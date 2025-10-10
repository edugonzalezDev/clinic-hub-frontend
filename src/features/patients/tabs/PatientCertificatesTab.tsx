import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAppStore from "@/store/appStore";
import { format } from "date-fns";
import { openCertificatePdf } from "@/features/medical/pdfActions";

export default function PatientCertificatesTab({ patientId }: { patientId: string }) {
    const { clinicalRecords, doctors } = useAppStore();

    const items = [...(clinicalRecords[patientId]?.certificates ?? [])]
        .sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));

    if (items.length === 0) {
        return <p className="text-sm text-muted-foreground">No hay certificados registrados para este paciente.</p>;
    }

    return (
        <div className="space-y-4">
            {items.map((cert) => {
                const docName = doctors.find(d => d.id === cert.doctorId)?.name ?? "—";
                const date = cert.dateISO ? format(new Date(cert.dateISO), "d MMM yyyy") : "—";
                return (
                    <Card key={cert.id} id={`cert-${cert.id}`} className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Certificado • {date}</CardTitle>
                            <div className="text-sm text-muted-foreground">Dr/a: {docName}</div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm"><span className="font-medium">Motivo:</span> {cert.reason}</p>
                            {cert.period && (
                                <p className="text-sm">
                                    <span className="font-medium">Período:</span>{" "}
                                    {format(new Date(cert.period.fromISO), "d MMM yyyy")} – {format(new Date(cert.period.toISO), "d MMM yyyy")}
                                </p>
                            )}
                            {cert.recommendations && (
                                <p className="text-sm"><span className="font-medium">Recomendaciones:</span> {cert.recommendations}</p>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" onClick={() => openCertificatePdf(cert)}>Ver PDF</Button>
                                {cert.fileUrl && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => window.open(cert.fileUrl!, "_blank")}
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
