// pdf.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // asegúrate de importar el plugin

// 👇 helper de tipos para acceder a lastAutoTable sin any
type JsPDFWithAutoTable = jsPDF & { lastAutoTable?: { finalY: number } };

// ---------------- CERTIFICADO ----------------
export function genCertificatePdf(opts: {
    doc: jsPDF;
    patient: { name: string; docId?: string };
    doctor: { name: string; license?: string; signaturePng?: string; stampPng?: string };
    body: {
        reason: string;
        period?: { fromISO: string; toISO: string };
        recommendations?: string;
    };
}) {
    const doc = opts.doc;

    doc.setFontSize(14);
    doc.text("CERTIFICADO MÉDICO", 40, 60);

    doc.setFontSize(11);
    doc.text(`Paciente: ${opts.patient.name} (${opts.patient.docId ?? "s/d"})`, 40, 95);

    const lines: string[] = [];
    lines.push(`Se certifica que el/la paciente ${opts.patient.name} ${opts.body.reason}.`);
    if (opts.body.period) {
        lines.push(
            `Periodo: desde ${new Date(opts.body.period.fromISO).toLocaleDateString()} ` +
            `hasta ${new Date(opts.body.period.toISO).toLocaleDateString()}.`,
        );
    }
    if (opts.body.recommendations) {
        lines.push(`Recomendaciones: ${opts.body.recommendations}`);
    }
    doc.text(doc.splitTextToSize(lines.join("\n\n"), 515), 40, 130);

    // Firma / sello
    const baseY = 640;

    if (opts.doctor.signaturePng) {
        try {
            doc.addImage(opts.doctor.signaturePng, "PNG", 60, baseY - 35, 160, 60);
        } catch (err) {
            if (import.meta.env.DEV) console.debug("No se pudo agregar la firma al PDF:", err);
        }
    }

    if (opts.doctor.stampPng) {
        try {
            doc.addImage(opts.doctor.stampPng, "PNG", 240, baseY - 45, 90, 90);
        } catch (err) {
            if (import.meta.env.DEV) console.debug("No se pudo agregar el sello al PDF:", err);
        }
    }

    doc.line(60, baseY + 40, 260, baseY + 40);
    doc.text(
        `${opts.doctor.name}${opts.doctor.license ? ` · Matrícula ${opts.doctor.license}` : ""}`,
        60,
        baseY + 60,
    );

    const blob = doc.output("blob");
    return URL.createObjectURL(blob);
}

// ---------------- RECETA ----------------
export function genPrescriptionPdf(opts: {
    doc: jsPDF;
    patient: {
        name: string;
        docId?: string;
        insurance?: { provider?: string; plan?: string; memberId?: string };
    };
    doctor: { name: string; license?: string; signaturePng?: string; stampPng?: string };
    diagnosis?: string;
    items: Array<{ drug: string; dose: string; frequency: string; duration: string; notes?: string }>;
}) {
    const doc = opts.doc;

    doc.setFontSize(14);
    doc.text("RECETA / INDICACIONES", 40, 60);

    doc.setFontSize(11);
    doc.text(
        [
            `Paciente: ${opts.patient.name} (${opts.patient.docId ?? "s/d"})`,
            opts.patient.insurance?.provider
                ? `Obra social/Seguro: ${opts.patient.insurance.provider} ${opts.patient.insurance.plan ?? ""} (${opts.patient.insurance.memberId ?? ""})`
                : "",
            opts.diagnosis ? `Diagnóstico: ${opts.diagnosis}` : "",
        ].filter(Boolean) as string[],
        40,
        90,
    );

    autoTable(doc, {
        startY: 120,
        head: [["Medicamento", "Dosis", "Frecuencia", "Duración", "Notas"]],
        body: opts.items.map((i) => [i.drug, i.dose, i.frequency, i.duration, i.notes ?? ""]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [240, 240, 240] },
        margin: { left: 40, right: 40 },
    });

    // ✅ sin any: usamos el helper tipado
    const baseY = ((doc as JsPDFWithAutoTable).lastAutoTable?.finalY ?? 120) + 60;

    if (opts.doctor.signaturePng) {
        try {
            doc.addImage(opts.doctor.signaturePng, "PNG", 60, baseY - 35, 160, 60);
        } catch (err) {
            if (import.meta.env.DEV) console.debug("No se pudo agregar la firma al PDF:", err);
        }
    }

    if (opts.doctor.stampPng) {
        try {
            doc.addImage(opts.doctor.stampPng, "PNG", 240, baseY - 45, 90, 90);
        } catch (err) {
            if (import.meta.env.DEV) console.debug("No se pudo agregar el sello al PDF:", err);
        }
    }

    doc.line(60, baseY + 40, 260, baseY + 40);
    doc.text(
        `${opts.doctor.name}${opts.doctor.license ? ` · Matrícula ${opts.doctor.license}` : ""}`,
        60,
        baseY + 60,
    );

    const blob = doc.output("blob");
    return URL.createObjectURL(blob);
}
