import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAppStore from "@/store/appStore";
import { format } from "date-fns";
import { openPrescriptionPdf } from "@/features/medical/pdfActions";

export default function PatientPrescriptionsTab({ patientId }: { patientId: string }) {
    const { clinicalRecords, doctors } = useAppStore();

    const items = [...(clinicalRecords[patientId]?.prescriptions ?? [])]
        .sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));

    if (items.length === 0) {
        return <p className="text-sm text-muted-foreground">No hay recetas registradas para este paciente.</p>;
    }

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
                                <Button variant="outline" onClick={() => openPrescriptionPdf(rx)}>Ver PDF</Button>
                                {rx.fileUrl && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => window.open(rx.fileUrl!, "_blank")}
                                    >
                                        Abrir archivo guardado
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
