import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAppStore from "@/store/appStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import type { Medication } from "@/store/appStore";


export default function NewMedicationPage() {
    const navigate = useNavigate();
    const [sp] = useSearchParams();
    const { patients, addMedicationEntry } = useAppStore();

    const [patientId, setPatientId] = useState(sp.get("patientId") || "");
    const [name, setName] = useState("");
    const [dosage, setDosage] = useState("");
    const [frequency, setFrequency] = useState("");
    const [status, setStatus] = useState<Medication["status"]>("active");

    const canSave = patientId && name && dosage && frequency;

    const onSave = () => {
        if (!canSave) return;
        addMedicationEntry(patientId, { name, dosage, frequency, status });
        toast.success("Medicación guardada");
        navigate(`/patients/${patientId}?tab=medications`);
    };

    const onChangeStatus = (v: string) =>
        setStatus(v as Medication["status"]);

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader><CardTitle>Nueva medicación crónica</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label>Paciente</Label>
                        <select className="w-full border rounded-md h-10 px-3" value={patientId} onChange={e => setPatientId(e.target.value)}>
                            <option value="">Selecciona…</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name} • {p.docId}</option>)}
                        </select>
                    </div>
                    <div><Label>Nombre</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
                    <div><Label>Dosis</Label><Input value={dosage} onChange={e => setDosage(e.target.value)} placeholder="p. ej. 10 mg" /></div>
                    <div><Label>Frecuencia</Label><Input value={frequency} onChange={e => setFrequency(e.target.value)} placeholder="p. ej. 1 vez al día" /></div>
                    <div>
                        <Label>Estado</Label>
                        <Select value={status} onValueChange={onChangeStatus}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Activa</SelectItem>
                                <SelectItem value="suspended">Suspendida</SelectItem>
                                <SelectItem value="completed">Finalizada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                        <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
                        <Button onClick={onSave} disabled={!canSave}>Guardar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
