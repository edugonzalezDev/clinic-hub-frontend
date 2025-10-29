import { AxiosError } from "axios";
import Cookies from "js-cookie";

interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

type ApiError = AxiosError<ApiErrorResponse>;

const onError400 = (_error: ApiError) => {
  alert(
    _error.response?.data?.message ||
      "Error 400: Datos inválidos, revisa el formulario."
  );
};

const onError401 = (_error: ApiError) => {
  alert("Error 401: No autorizado. Por favor inicia sesión.");
  Cookies.remove("token");
  window.location.href = "/login"; // opcional
};

const onError403 = (_error: ApiError) => {
  alert(_error.response?.data?.detail || "Error 403: Acceso prohibido.");
};

const onError404 = (_error: ApiError) => {
  alert("Error 404: Recurso no encontrado.");
};

// Tipado estricto del diccionario
const errorHandlers: Record<number, (error: ApiError) => void> = {
  400: onError400,
  401: onError401,
  403: onError403,
  404: onError404,
};

export const handleApiError = (error: unknown) => {
  // Solo actuamos si es un error de Axios
  if (typeof error === "object" && error && "response" in error) {
    const axiosError = error as ApiError;
    const status = axiosError.response?.status;

    if (status && errorHandlers[status]) {
      errorHandlers[status](axiosError);
      return;
    }
  }

  // Si no es un error conocido
  alert("Ocurrió un error inesperado.");
  console.error(error);
};
