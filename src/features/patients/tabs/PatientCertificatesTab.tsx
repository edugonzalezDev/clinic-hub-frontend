import { useState } from "react";
import { format, parse as parseDate } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import useAppStore, { type Certificate } from "@/store/appStore";
import { openCertificatePdf } from "@/features/medical/pdfActions";
import { genCertificatePdf } from "@/lib/pdf";
import { toast } from "sonner";


export default function PatientCertificatesTab({ patientId }: { patientId: string }) {
    const {
        clinicalRecords, doctors, currentDoctorId,
        updateCertificate, deleteCertificate,
    } = useAppStore();

    // Dialog state 
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Certificate | null>(null);
    const [reason, setReason] = useState("");
    const [reco, setReco] = useState("");
    const [fromISO, setFromISO] = useState<string | undefined>();
    const [toISO, setToISO] = useState<string | undefined>();

    const items = [...(clinicalRecords[patientId]?.certificates ?? [])]
        .sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));

    const fdate = (yyyyMMdd: string) =>
        format(parseDate(yyyyMMdd, "yyyy-MM-dd", new Date()), "d MMM yyyy");


    const startEdit = (cert: Certificate) => {
        setEditing(cert);
        setReason(cert.reason ?? "");
        setReco(cert.recommendations ?? "");
        setFromISO(cert.period?.fromISO);
        setToISO(cert.period?.toISO);
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
        // (opcional) limpiar estado
        setEditing(null);
    };

    const saveEdit = () => {
        if (!editing) return;
        updateCertificate(patientId, editing.id, {
            reason,
            recommendations: reco,
            period: fromISO || toISO ? { fromISO: fromISO || toISO!, toISO: toISO || fromISO! } : undefined,
            dateISO: new Date().toISOString(),
        });
        toast.success("Certificado actualizado");
        closeDialog();
    };

    const onReemit = (cert: Certificate) => {
        const picked =
            doctors.find(d => d.id === currentDoctorId) ??
            doctors.find(d => d.id === cert.doctorId) ??
            doctors[0];

        const doctorForPdf = picked
            ? { name: picked.name, license: picked.license, signaturePng: picked.signaturePng, stampPng: picked.stampPng }
            : { name: "—" as const };

        const patientForPdf = cert.patientSnapshot ?? { name: "—", docId: "" };

        const url = genCertificatePdf({
            doctor: doctorForPdf,
            patient: patientForPdf,
            body: { reason: cert.reason, recommendations: cert.recommendations, period: cert.period },
        });

        updateCertificate(patientId, cert.id, {
            fileUrl: url,
            dateISO: new Date().toISOString(),
            doctorSnapshot: { name: doctorForPdf.name },
        });

        toast.success("Certificado reemitido");
        window.open(url, "_blank");
    };

    const onDelete = (cert: Certificate) => {
        if (!confirm("¿Estás seguro de eliminar este certificado?")) return;
        deleteCertificate(patientId, cert.id);
        toast.success("Certificado eliminado");
    };

    if (items.length === 0) {
        return <p className="text-sm text-muted-foreground">No hay certificados registrados para este paciente.</p>;
    }

    return (
        <>
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

                            <section className="w-full h-auto flex flex-row">
                                <div className="leftCont w-1/2 flex flex-col">
                                    <CardContent className="space-y-2">
                                        <p className="text-sm"><span className="font-medium">Motivo:</span> {cert.reason}</p>
                                        {cert.period && (
                                            <p className="text-sm">
                                                <span className="font-medium">Período:</span>{" "}
                                                {fdate(cert.period.fromISO)} – {fdate(cert.period.toISO)}
                                            </p>
                                        )}
                                        {cert.recommendations && (
                                            <p className="text-sm"><span className="font-medium">Recomendaciones:</span> {cert.recommendations}</p>
                                        )}
                                        <div className="flex gap-2 pt-2">
                                            <Button variant="outline" onClick={() => openCertificatePdf(cert)}>Ver PDF</Button>
                                            {cert.fileUrl && (
                                                <Button variant="default" onClick={() => window.open(cert.fileUrl!, "_blank")}>
                                                    Abrir archivo guardado
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </div>

                                <div className="rightCont w-1/2 flex flex-col justify-center items-end pr-3 gap-2">
                                    <Button className="w-auto rounded-[4px] border border-slate-400 hover:border-blue-400" variant="outline" onClick={() => startEdit(cert)}>
                                        Editar
                                    </Button>
                                    <Button className="w-auto rounded-[4px] border border-slate-400 hover:border-blue-400" variant="outline" onClick={() => onReemit(cert)}>
                                        Reemitir PDF
                                    </Button>
                                    <Button variant="destructive" onClick={() => onDelete(cert)}>
                                        Eliminar
                                    </Button>
                                </div>
                            </section>
                        </Card>
                    );
                })}
            </div>

            {/* Modal de edición */}
            <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : closeDialog())}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Editar certificado</DialogTitle>
                        <DialogDescription id="cert-edit-desc">
                            Modificá motivo, recomendaciones y el período de vigencia.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-3">
                            <Label>Motivo</Label>
                            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="ha sido atendido/a..." />
                        </div>
                        <div className="md:col-span-3">
                            <Label>Recomendaciones</Label>
                            <Textarea value={reco} onChange={(e) => setReco(e.target.value)} placeholder="reposo, restricciones..." />
                        </div>
                        <div>
                            <Label>Desde</Label>
                            <Input type="date" value={fromISO ?? ""} onChange={(e) => setFromISO(e.target.value || undefined)} />
                        </div>
                        <div>
                            <Label>Hasta</Label>
                            <Input type="date" value={toISO ?? ""} onChange={(e) => setToISO(e.target.value || undefined)} />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
                        <Button onClick={saveEdit}>Guardar cambios</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
