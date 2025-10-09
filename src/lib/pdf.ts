// lib/pdf.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type JsPDFWithAutoTable = jsPDF & { lastAutoTable?: { finalY?: number } };

// ---------- CERTIFICADO ----------
export function genCertificatePdf(opts: {
    doc?: jsPDF;
    doctor: {
        name: string;
        license?: string;
        signaturePng?: string;
        stampPng?: string;
    };
    patient: { name: string; docId?: string };
    body: {
        reason: string;
        recommendations?: string;
        period?: { fromISO: string; toISO: string };
    };
}): string {
    const doc = opts.doc ?? new jsPDF();

    doc.setFontSize(14);
    doc.text("CERTIFICADO MÉDICO", 40, 60);

    doc.setFontSize(11);
    doc.text(`Paciente: ${opts.patient.name} (${opts.patient.docId ?? "s/d"})`, 40, 95);

    const lines: string[] = [];
    lines.push(`Se certifica que el/la paciente ${opts.patient.name} ${opts.body.reason}.`);
    if (opts.body.period) {
        lines.push(
            `Periodo: desde ${new Date(opts.body.period.fromISO).toLocaleDateString()} ` +
            `hasta ${new Date(opts.body.period.toISO).toLocaleDateString()}.`
        );
    }
    if (opts.body.recommendations) lines.push(`Recomendaciones: ${opts.body.recommendations}`);
    doc.text(doc.splitTextToSize(lines.join("\n\n"), 515), 40, 130);

    // Firma / sello
    const baseY = 640;
    if (opts.doctor.signaturePng) {
        try {
            doc.addImage(opts.doctor.signaturePng, "PNG", 60, baseY - 35, 160, 60);
        } catch (e) {
            if (import.meta.env.DEV) console.debug("addImage signature failed", e);
        }
    }
    if (opts.doctor.stampPng) {
        try {
            doc.addImage(opts.doctor.stampPng, "PNG", 240, baseY - 45, 90, 90);
        } catch (e) {
            if (import.meta.env.DEV) console.debug("addImage stamp failed", e);
        }
    }

    doc.line(60, baseY + 40, 260, baseY + 40);
    doc.text(
        `${opts.doctor.name}${opts.doctor.license ? " · Matrícula " + opts.doctor.license : ""}`,
        60,
        baseY + 60
    );

    const blob = doc.output("blob");
    return URL.createObjectURL(blob);
}

// ---------- RECETA ----------
export function genPrescriptionPdf(opts: {
    doc?: jsPDF;
    doctor: {
        name: string;
        license?: string;
        specialty?: string;          // <- ahora permitido
        signaturePng?: string;
        stampPng?: string;
    };
    patient: {
        name: string;
        docId?: string;
        insurance?: { provider?: string; plan?: string; memberId?: string };
    };
    diagnosis?: string;
    items: Array<{ drug: string; dose: string; frequency: string; duration: string; notes?: string }>;
}): string {
    const doc = opts.doc ?? new jsPDF();

    doc.setFontSize(14);
    doc.text("RECETA / INDICACIONES", 40, 60);

    doc.setFontSize(11);
    doc.text(
        [
            `Paciente: ${opts.patient.name} (${opts.patient.docId ?? "s/d"})`,
            opts.patient.insurance?.provider
                ? `Obra social/Seguro: ${opts.patient.insurance.provider} ${opts.patient.insurance.plan ?? ""} ${opts.patient.insurance.memberId ?? ""}`
                : "",
            opts.diagnosis ? `Diagnóstico: ${opts.diagnosis}` : "",
        ].filter(Boolean) as string[],
        40,
        90
    );

    autoTable(doc, {
        startY: 120,
        head: [["Medicamento", "Dosis", "Frecuencia", "Duración", "Notas"]],
        body: opts.items.map(i => [i.drug, i.dose, i.frequency, i.duration, i.notes ?? ""]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [240, 240, 240] },
        margin: { left: 40, right: 40 },
    });

    const lastY = ((doc as JsPDFWithAutoTable).lastAutoTable?.finalY ?? 160) + 60;

    if (opts.doctor.signaturePng) {
        try {
            doc.addImage(opts.doctor.signaturePng, "PNG", 60, lastY - 35, 160, 60);
        } catch (e) {
            if (import.meta.env.DEV) console.debug("addImage signature failed", e);
        }
    }
    if (opts.doctor.stampPng) {
        try {
            doc.addImage(opts.doctor.stampPng, "PNG", 240, lastY - 45, 90, 90);
        } catch (e) {
            if (import.meta.env.DEV) console.debug("addImage stamp failed", e);
        }
    }

    doc.line(60, lastY + 40, 260, lastY + 40);
    doc.text(
        `${opts.doctor.name}${opts.doctor.license ? " · Matrícula " + opts.doctor.license : ""}${opts.doctor.specialty ? " · " + opts.doctor.specialty : ""
        }`,
        60,
        lastY + 60
    );

    const blob = doc.output("blob");
    return URL.createObjectURL(blob);
}
