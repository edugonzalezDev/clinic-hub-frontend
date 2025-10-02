#!/usr/bin/env bash
# Conventional Commit helper (bash/zsh)
set -euo pipefail

# --- helpers UI ---
bold() { printf "\e[1m%s\e[0m\n" "$*"; }
info() { printf "🔹 %s\n" "$*"; }
warn() { printf "⚠️  %s\n" "$*"; }
ok()   { printf "✅ %s\n" "$*"; }
err()  { printf "❌ %s\n" "$*"; }

# --- prechecks ---
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { err "No es un repo Git."; exit 1; }

BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "desconocida")"
bold "Rama actual: $BRANCH"
if [[ "$BRANCH" == "HEAD" ]]; then
  warn "Estás en HEAD detached. Considerá crear/checkout una rama antes de commitear."
fi
if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
  warn "Estás en rama principal ($BRANCH). ¿Continuar? [y/N]"
  read -r CONTMAIN
  [[ "${CONTMAIN:-N}" =~ ^[Yy]$ ]] || { info "Abortado."; exit 0; }
fi

# --- status breve ---
git status -sb || true
echo

# Si no hay staged, ofrecer add -A
if [[ -z "$(git diff --name-only --cached)" ]]; then
  warn "No hay cambios staged."
  printf "¿Hacer stage de todo (git add -A)? [y/N]: "
  read -r ADDALL
  if [[ "${ADDALL:-N}" =~ ^[Yy]$ ]]; then
    git add -A
    ok "Archivos staged."
  else
    err "No hay nada para commitear. Abortado."
    exit 1
  fi
fi

# --- menú de tipos + emojis ---
types=(feat fix docs style refactor perf test build ci chore revert)
emojis=(✨ 🐛 📝 🎨 ♻️ ⚡ ✅ 🧱 🤖 🔧 ⏪)

bold "Seleccioná el tipo de commit:"
for i in "${!types[@]}"; do
  printf "%2d) %-8s %s\n" "$((i+1))" "${types[$i]}" "${emojis[$i]}"
done
printf "Opción (1-%d): " "${#types[@]}"; read -r OPT
[[ "$OPT" =~ ^[0-9]+$ ]] && ((OPT>=1 && OPT<=${#types[@]})) || { err "Opción inválida."; exit 1; }
TYPE="${types[$((OPT-1))]}"
EMOJI="${emojis[$((OPT-1))]}"

# --- scope opcional ---
printf "Scope (opcional, ej: router, ui, appointments/form, vite, etc) → "
read -r SCOPE
SCOPE_FMT=""
if [[ -n "${SCOPE// }" ]]; then
  # normalizar: minúsculas, espacios->-, quitar raros
  SCOPE_CLEAN=$(echo "$SCOPE" | tr '[:upper:] ' '[:lower:]-' | sed 's/[^a-z0-9\.\-\/]//g')
  SCOPE_FMT="(${SCOPE_CLEAN})"
fi

# --- breaking change? ---
printf "¿Es breaking change? [y/N]: "
read -r ISBREAK
BANG=""
BC_MSG=""
if [[ "${ISBREAK:-N}" =~ ^[Yy]$ ]]; then
  BANG="!"
  printf "Describe brevemente el BREAKING CHANGE: "
  read -r BC_MSG
fi

# --- resumen ---
while true; do
  printf "Resumen (máx. 72 chars, en presente) → "
  read -r SUMMARY
  if [[ -z "${SUMMARY// }" ]]; then
    warn "El resumen no puede estar vacío."
    continue
  fi
  if [[ "${#SUMMARY}" -gt 72 ]]; then
    warn "Supera 72 chars. ¿Continuar igual? [y/N]"
    read -r CONT72
    [[ "${CONT72:-N}" =~ ^[Yy]$ ]] || continue
  fi
  break
done

HEADER="${TYPE}${SCOPE_FMT}${BANG}: ${EMOJI} ${SUMMARY}"

# --- body opcional (editor) ---
BODY=""
printf "¿Abrir editor para cuerpo del commit? [y/N]: "
read -r OPENED
if [[ "${OPENED:-N}" =~ ^[Yy]$ ]]; then
  TMP="$(mktemp /tmp/ccmsg.XXXXXX)"
  printf "\n# Escribe detalles adicionales. Líneas con # se ignoran.\n" > "$TMP"
  "${EDITOR:-nano}" "$TMP"
  # filtrar líneas comentadas
  BODY="$(grep -v '^[[:space:]]*#' "$TMP" | sed '/^[[:space:]]*$/d' || true)"
  rm -f "$TMP"
fi

# --- footer ---
FOOTER=""
if [[ -n "${BC_MSG// }" ]]; then
  FOOTER="BREAKING CHANGE: ${BC_MSG}"
fi

# --- confirmación ---
echo
bold "Vista previa del commit:"
echo "$HEADER"
[[ -n "$BODY" ]] && echo -e "\n$BODY"
[[ -n "$FOOTER" ]] && echo -e "\n$FOOTER"
printf "\n¿Confirmar commit? [y/N]: "
read -r OKCOMMIT
[[ "${OKCOMMIT:-N}" =~ ^[Yy]$ ]] || { info "Abortado."; exit 0; }

# --- commit ---
ARGS=( -m "$HEADER" )
[[ -n "$BODY" ]] && ARGS+=( -m "$BODY" )
[[ -n "$FOOTER" ]] && ARGS+=( -m "$FOOTER" )

set +e
git commit "${ARGS[@]}"
RC=$?
set -e
if [[ $RC -ne 0 ]]; then
  err "Falló git commit."
  exit $RC
fi
ok "Commit creado."

# --- pull rebase autostash ---
if git remote get-url origin >/dev/null 2>&1; then
  info "Haciendo pull --rebase --autostash…"
  set +e
  git pull --rebase --autostash
  PULLRC=$?
  set -e
  if [[ $PULLRC -ne 0 ]]; then
    warn "Pull con conflictos o error. Revisá el estado y resolvé merges."
    exit $PULLRC
  fi
  ok "Pull OK."
else
  warn "No hay remoto 'origin' configurado. Skipping pull."
fi

# --- push opcional ---
printf "¿Hacer push a origin/%s ahora? [y/N]: " "$BRANCH"
read -r DOPUSH
if [[ "${DOPUSH:-N}" =~ ^[Yy]$ ]]; then
  if git remote get-url origin >/dev/null 2>&1; then
    git push -u origin "$BRANCH"
    ok "Push completado."
  else
    err "No hay remoto 'origin'. Configuralo y hacé el push manualmente."
  fi
else
  info "Push omitido. Podés hacer: git push -u origin $BRANCH"
fi
