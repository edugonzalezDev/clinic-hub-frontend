// features/medical/NewPrescriptionPage.tsx
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAppStore, { type RxItem } from "@/store/appStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { genPrescriptionPdf } from "@/lib/pdf";
import { toast } from "sonner";
import { Activity, ArrowLeft } from "lucide-react";

export default function NewPrescriptionPage() {
    const navigate = useNavigate();
    const [sp] = useSearchParams();
    const { currentUser, patients, doctors, currentDoctorId, addPrescription } = useAppStore();

    const doctor = useMemo(() => doctors.find(d => d.id === currentDoctorId) ?? doctors[0], [doctors, currentDoctorId]);

    const [patientId, setPatientId] = useState(sp.get("patientId") || "");
    const [diagnosis, setDiagnosis] = useState("");
    const [items, setItems] = useState<RxItem[]>([
        { drug: "", dose: "", frequency: "", duration: "", notes: "" }
    ]);

    const patient = patients.find(p => p.id === patientId);

    const updateItem = (i: number, patch: Partial<RxItem>) =>
        setItems(prev => prev.map((row, idx) => idx === i ? { ...row, ...patch } : row));

    const addRow = () => setItems(prev => [...prev, { drug: "", dose: "", frequency: "", duration: "" }]);
    const removeRow = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

    const canSave = patientId && items.some(i => i.drug && i.dose && i.frequency && i.duration);

    const onSave = () => {
        if (!canSave || !patient) return;

        const fileUrl = genPrescriptionPdf({
            doctor: { name: doctor.name, license: doctor.license, signaturePng: doctor.signaturePng, stampPng: doctor.stampPng },
            patient: { name: patient.name, docId: patient.docId, insurance: patient.insurance },
            diagnosis: diagnosis || undefined,
            items
        });

        const id = addPrescription(patientId, {
            diagnosis: diagnosis || undefined,
            items,
            insuranceSnapshot: patient.insurance,
            fileUrl
        });

        toast.success("Receta generada");
        window.open(fileUrl, "_blank");
        navigate(`/patients/${patientId}#rx-${id}`);
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
                                <h1 className="text-xl font-semibold">Gestión Receta Medica</h1>
                                <p className="text-sm text-muted-foreground">Profesional: {doctors.find(d => d.id === doctorId)?.name ?? "—"}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </header>
            <div className="container mx-auto p-6">
                <Card>
                    <CardHeader><CardTitle>Nueva receta</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Paciente</Label>
                                <select className="w-full border rounded-md h-10 px-3" value={patientId} onChange={e => setPatientId(e.target.value)}>
                                    <option value="">Selecciona…</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.name} • {p.docId}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Diagnóstico (opcional)</Label>
                                <Input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Medicamentos</Label>
                            {items.map((row, i) => (
                                <div key={i} className="grid md:grid-cols-5 gap-3 items-center">
                                    <Input placeholder="Medicamento" value={row.drug} onChange={e => updateItem(i, { drug: e.target.value })} />
                                    <Input placeholder="Dosis" value={row.dose} onChange={e => updateItem(i, { dose: e.target.value })} />
                                    <Input placeholder="Frecuencia" value={row.frequency} onChange={e => updateItem(i, { frequency: e.target.value })} />
                                    <Input placeholder="Duración" value={row.duration} onChange={e => updateItem(i, { duration: e.target.value })} />
                                    <div className="flex gap-2">
                                        <Input placeholder="Notas" value={row.notes ?? ""} onChange={e => updateItem(i, { notes: e.target.value })} />
                                        <Button variant="outline" onClick={() => removeRow(i)}>–</Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addRow}>+ Agregar medicamento</Button>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
                            <Button onClick={onSave} disabled={!canSave}>Generar PDF</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
