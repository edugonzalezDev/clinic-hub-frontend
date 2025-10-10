// src/features/medical/pdfActions.ts
import { genCertificatePdf, genPrescriptionPdf } from "@/lib/pdf";
import useAppStore, { type Certificate, type Prescription } from "@/store/appStore";

/** Abre en una pestaña el PDF de un certificado.
 *  Usa snapshot si existe; si no, toma los datos actuales del store. */
export function openCertificatePdf(cert: Certificate) {
    const { doctors, patients } = useAppStore.getState();

    const doctor =
        cert.doctorSnapshot ??
        (() => {
            const d = doctors.find(x => x.id === cert.doctorId);
            return d
                ? { name: d.name, license: d.license, signaturePng: d.signaturePng, stampPng: d.stampPng }
                : { name: "—" };
        })();

    const patient =
        cert.patientSnapshot ??
        (() => {
            const p = patients.find(x => x.id === cert.patientId);
            return p ? { name: p.name, docId: p.docId } : { name: "—" };
        })();

    const url = genCertificatePdf({
        doctor,
        patient,
        body: {
            reason: cert.reason,
            recommendations: cert.recommendations,
            period: cert.period,
        },
    });

    window.open(url, "_blank");
}

/** Abre en una pestaña el PDF de una receta.
 *  Usa snapshot si existe; si no, toma los datos actuales del store. */
export function openPrescriptionPdf(rx: Prescription) {
    const { doctors, patients } = useAppStore.getState();

    const doctor =
        rx.doctorSnapshot ??
        (() => {
            const d = doctors.find(x => x.id === rx.doctorId);
            return d
                ? { name: d.name, license: d.license, signaturePng: d.signaturePng, stampPng: d.stampPng }
                : { name: "—" };
        })();

    const patient =
        rx.patientSnapshot ??
        (() => {
            const p = patients.find(x => x.id === rx.patientId);
            return p ? { name: p.name, docId: p.docId, insurance: rx.insuranceSnapshot ?? p.insurance } : { name: "—" };
        })();

    const url = genPrescriptionPdf({
        doctor,
        patient,
        diagnosis: rx.diagnosis,
        items: rx.items,
    });

    window.open(url, "_blank");
}
