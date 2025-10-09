import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Augmenta el tipo para que TS conozca lastAutoTable del plugin
declare module 'jspdf' {
    interface jsPDF {
        lastAutoTable?: { finalY: number };
    }
}

type DoctorSig = {
    name: string;
    license?: string;
    signaturePng?: string;
    stampPng?: string;
};

type PatientInfo = {
    name: string;
    docId?: string;
    insurance?: { provider?: string; plan?: string; memberId?: string };
};

/* ----------------- CERTIFICADO ----------------- */
export function genCertificatePdf(opts: {
    doctor: DoctorSig;
    patient: PatientInfo;
    body: {
        reason: string;
        recommendations?: string;
        period?: { fromISO: string; toISO: string };
    };
}): string {
    const doc = new jsPDF();
    const left = 20;
    const top = 20;

    doc.setFontSize(14);
    doc.text('CERTIFICADO MÉDICO', left, top);

    doc.setFontSize(11);
    doc.text(`Paciente: ${opts.patient.name} (${opts.patient.docId ?? 's/d'})`, left, top + 12);

    const paragraphs: string[] = [
        `Se certifica que el/la paciente ${opts.patient.name} ${opts.body.reason}.`,
    ];

    if (opts.body.period) {
        paragraphs.push(
            `Período: desde ${new Date(opts.body.period.fromISO).toLocaleDateString()} ` +
            `hasta ${new Date(opts.body.period.toISO).toLocaleDateString()}.`
        );
    }
    if (opts.body.recommendations) {
        paragraphs.push(`Recomendaciones: ${opts.body.recommendations}`);
    }

    doc.text(doc.splitTextToSize(paragraphs.join('\n\n'), 170), left, top + 26);

    // Firma / sello
    const baseY = doc.lastAutoTable?.finalY ?? top + 100;
    try {
        if (opts.doctor.signaturePng) {
            doc.addImage(opts.doctor.signaturePng, 'PNG', left, baseY, 60, 20);
        }
    } catch (e) {
        if (import.meta.env.DEV) console.debug("addImage signature failed", e);
    }
    try {
        if (opts.doctor.stampPng) {
            doc.addImage(opts.doctor.stampPng, 'PNG', left + 90, baseY - 5, 50, 50);
        }
    } catch (e) {
        if (import.meta.env.DEV) console.debug("addImage stamp failed", e);
    }

    doc.line(left, baseY + 24, left + 70, baseY + 24);
    doc.text(
        `${opts.doctor.name}${opts.doctor.license ? `  ·  Matrícula ${opts.doctor.license}` : ''}`,
        left,
        baseY + 32
    );

    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
}

/* ----------------- RECETA ----------------- */
export function genPrescriptionPdf(opts: {
    doctor: DoctorSig;
    patient: PatientInfo;
    diagnosis?: string;
    items: Array<{ drug: string; dose: string; frequency: string; duration: string; notes?: string }>;
}): string {
    const doc = new jsPDF();
    const left = 20;

    doc.setFontSize(14);
    doc.text('RECETA / INDICACIONES', left, 20);

    doc.setFontSize(11);
    doc.text(
        [
            `Paciente: ${opts.patient.name} (${opts.patient.docId ?? 's/d'})`,
            opts.patient.insurance?.provider
                ? `Obra social/Seguro: ${opts.patient.insurance.provider} ${opts.patient.insurance.plan ?? ''} ${opts.patient.insurance.memberId ?? ''}`.trim()
                : '',
            opts.diagnosis ? `Diagnóstico: ${opts.diagnosis}` : '',
        ].filter(Boolean) as string[],
        left,
        30
    );

    autoTable(doc, {
        startY: 48,
        theme: "grid",
        head: [['Medicamento', 'Dosis', 'Frecuencia', 'Duración', 'Notas']],
        body: opts.items.map(i => [i.drug, i.dose, i.frequency, i.duration, i.notes ?? '']),
        styles: { fontSize: 10, cellPadding: 2, overflow: 'linebreak', lineColor: [200, 200, 200], lineWidth: 0.2 },
        headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: "bold" },
        // 👉 Anchos pensados para A4 con márgenes 20/20
        columnStyles: {
            0: { cellWidth: 30 },   // Medicamento
            1: { cellWidth: 25 },   // Dosis
            2: { cellWidth: 25 },   // Frecuencia
            3: { cellWidth: 25 },   // Duración
            4: { cellWidth: 'auto' } // Notas (se expande)
        },
        margin: { left, right: 20 },
    });

    const baseY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 50 : 120;

    try {
        if (opts.doctor.signaturePng) {
            doc.addImage(opts.doctor.signaturePng, 'PNG', left, baseY - 12, 60, 18);
        }
    } catch (e) {
        if (import.meta.env.DEV) console.debug("addImage signature failed", e);
    }
    try {
        if (opts.doctor.stampPng) {
            doc.addImage(opts.doctor.stampPng, 'PNG', left + 90, baseY - 20, 50, 50);
        }
    } catch (e) {
        if (import.meta.env.DEV) console.debug("addImage stamp failed", e)
    }

    doc.line(left, baseY + 10, left + 70, baseY + 10);
    doc.text(
        `${opts.doctor.name}${opts.doctor.license ? `  ·  Matrícula ${opts.doctor.license}` : ''}`,
        left,
        baseY + 18
    );

    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
}
