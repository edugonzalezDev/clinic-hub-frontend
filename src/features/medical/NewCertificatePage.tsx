// features/medical/NewCertificatePage.tsx
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAppStore from "@/store/appStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { genCertificatePdf } from "@/lib/pdf";
import { toast } from "sonner";
import { Activity, ArrowLeft } from "lucide-react";

export default function NewCertificatePage() {
    const navigate = useNavigate();
    const [sp] = useSearchParams();
    const { currentUser, patients, doctors, currentDoctorId, addCertificate } = useAppStore();

    const doctor = useMemo(() => doctors.find(d => d.id === currentDoctorId) ?? doctors[0], [doctors, currentDoctorId]);

    const [patientId, setPatientId] = useState(sp.get("patientId") || "");
    const [reason, setReason] = useState("ha sido atendido/a en consulta médica");
    const [recommendations, setRecommendations] = useState("");
    const [fromISO, setFromISO] = useState<string>("");
    const [toISO, setToISO] = useState<string>("");

    const canSave = patientId && reason.trim().length > 3;

    const onSave = () => {
        if (!canSave) return;
        const p = patients.find(x => x.id === patientId)!;

        const fileUrl = genCertificatePdf({
            doctor: { name: doctor.name, license: doctor.license, signaturePng: doctor.signaturePng, stampPng: doctor.stampPng },
            patient: { name: p.name, docId: p.docId },
            body: {
                reason,
                recommendations: recommendations || undefined,
                period: fromISO && toISO ? { fromISO, toISO } : undefined,
            }
        });

        const id = addCertificate(patientId, {
            reason,
            recommendations: recommendations || undefined,
            period: fromISO && toISO ? { fromISO, toISO } : undefined,
            fileUrl
        });

        toast.success("Certificado generado");
        window.open(fileUrl, "_blank");
        navigate(`/patients/${patientId}#cert-${id}`);
    };

    const doctorId = useMemo(() => {
        return (
            currentDoctorId ||
            doctors.find((d) => d.name === currentUser?.name)?.id ||
            doctors[0]?.id
        );
    }, [currentDoctorId, doctors, currentUser?.name]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Volver
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 my-gradient-class rounded-xl flex items-center justify-center">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold">Gestión  Certificado Medico</h1>
                                <p className="text-sm text-muted-foreground">Profesional: {doctors.find(d => d.id === doctorId)?.name ?? "—"}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </header>
            <div className="container mx-auto p-6">
                <Card>
                    <CardHeader><CardTitle>Nuevo certificado</CardTitle></CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Paciente</Label>
                            <select className="w-full border rounded-md h-10 px-3" value={patientId} onChange={e => setPatientId(e.target.value)}>
                                <option value="">Selecciona…</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.name} • {p.docId}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Período (desde)</Label>
                            <Input type="date" value={fromISO} onChange={e => setFromISO(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Período (hasta)</Label>
                            <Input type="date" value={toISO} onChange={e => setToISO(e.target.value)} />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label>Motivo</Label>
                            <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="p. ej., ha requerido reposo por 48 horas" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label>Recomendaciones</Label>
                            <Textarea value={recommendations} onChange={e => setRecommendations(e.target.value)} placeholder="Indicaciones al empleador/institución…" />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
                            <Button onClick={onSave} disabled={!canSave}>Generar PDF</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
