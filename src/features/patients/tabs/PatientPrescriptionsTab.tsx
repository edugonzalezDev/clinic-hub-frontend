import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAppStore from "@/store/appStore";
import { format } from "date-fns";
import { openPrescriptionPdf } from "@/features/medical/pdfActions";
import { genPrescriptionPdf } from "@/lib/pdf";
import { toast } from "sonner";
import type { Prescription } from "@/store/appStore";

export default function PatientPrescriptionsTab({ patientId }: { patientId: string }) {
    const {
        clinicalRecords,
        doctors,
        currentDoctorId,
        updatePrescription,
        deletePrescription,
    } = useAppStore();

    const items = [...(clinicalRecords[patientId]?.prescriptions ?? [])]
        .sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));

    if (items.length === 0) {
        return <p className="text-sm text-muted-foreground">No hay recetas registradas para este paciente.</p>;
    }

    const onReemit = (rx: Prescription) => {
        const picked =
            doctors.find(d => d.id === currentDoctorId) ??
            doctors.find(d => d.id === rx.doctorId) ??
            doctors[0];

        // Armamos el objeto de doctor que pide el generador
        const doctorForPdf = picked
            ? {
                name: picked.name,
                license: picked.license,
                signaturePng: picked.signaturePng,
                stampPng: picked.stampPng,
            }
            : { name: "—" as const };

        // 2) Paciente: usamos snapshot si existe (lo más robusto)
        const patientForPdf = rx.patientSnapshot
            ? { ...rx.patientSnapshot, insurance: rx.insuranceSnapshot }
            : { name: "—", docId: "" };

        // 3) Generamos y abrimos
        const fileUrl = genPrescriptionPdf({
            doctor: doctorForPdf,
            patient: patientForPdf,
            diagnosis: rx.diagnosis,
            items: rx.items,
        });

        // 4) Guardamos el blob URL + snapshot de doctor para trazabilidad
        updatePrescription(patientId, rx.id, {
            fileUrl,
            dateISO: new Date().toISOString(),
            doctorSnapshot: { name: doctorForPdf.name },
        });

        toast.success("Receta reemitida");
        window.open(fileUrl, "_blank");
    };


    const onDelete = (rx: Prescription) => {
        if (!confirm("¿Eliminar esta receta?")) return;
        deletePrescription(patientId, rx.id);
        toast.success("Receta eliminada");
    };

    return (
        <div className="space-y-4">
            {items.map((rx) => {
                const docName = doctors.find(d => d.id === rx.doctorId)?.name ?? "—";
                const date = rx.dateISO ? format(new Date(rx.dateISO), "d MMM yyyy") : "—";
                const firstDrug = rx.items[0]?.drug ?? "";
                const more = Math.max(0, rx.items.length - 1);
                return (
                    <Card key={rx.id} id={`rx-${rx.id}`} className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Receta • {date}</CardTitle>
                            <div className="text-sm text-muted-foreground">Dr/a: {docName}</div>
                        </CardHeader>
                        <section className="w-full h-auto flex flex-row">
                            <div className="leftCont w-1/2 flex flex-col">
                                <CardContent className="space-y-2">
                                    {rx.diagnosis && (
                                        <p className="text-sm">
                                            <span className="font-medium">Diagnóstico:</span> {rx.diagnosis}
                                        </p>
                                    )}
                                    <p className="text-sm">
                                        <span className="font-medium">Medicamentos:</span> {firstDrug}{more > 0 ? ` (+${more} más)` : ""}
                                    </p>
                                    <div className="flex gap-2 pt-2">
                                        <Button className="rounded-[4px] border border-slate-400 hover:border-blue-400" variant="outline" onClick={() => openPrescriptionPdf(rx)}>Ver PDF</Button>
                                        {rx.fileUrl && (
                                            <Button
                                                className="rounded-[4px] border border-slate-400 hover:border-blue-400"
                                                variant="default"
                                                onClick={() => window.open(rx.fileUrl!, "_blank")}
                                            >
                                                Abrir archivo guardado
                                            </Button>
                                        )}
                                    </div>

                                </CardContent>
                            </div>
                            <div className="rightCont w-1/2 flex flex-col justify-center items-end pr-3 gap-2">
                                <Button
                                    className="w-auto rounded-[4px] border border-slate-400 hover:border-blue-400"
                                    variant="outline"
                                    onClick={() => onReemit(rx)}>
                                    Reemitir PDF
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => onDelete(rx)}>
                                    Eliminar
                                </Button>
                            </div>
                        </section>
                    </Card>
                );
            })}
        </div>
    );
}
