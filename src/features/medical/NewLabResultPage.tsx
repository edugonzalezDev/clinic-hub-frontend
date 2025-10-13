import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAppStore from "@/store/appStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import type { LabResult } from "@/store/appStore";

export default function NewLabResultPage() {
    const navigate = useNavigate();
    const [sp] = useSearchParams();
    const { patients, addLabResult } = useAppStore();

    const [patientId, setPatientId] = useState(sp.get("patientId") || "");
    const [test, setTest] = useState("");
    const [dateISO, setDateISO] = useState(new Date().toISOString().slice(0, 10));
    const [result, setResult] = useState("Normal");
    const [status, setStatus] = useState<LabResult["status"]>("complete");

    const canSave = patientId && test;

    const onSave = () => {
        if (!canSave) return;
        addLabResult(patientId, { test, dateISO, result, status });
        toast.success("Estudio de laboratorio guardado");
        navigate(`/patients/${patientId}?tab=labs`);
    };

    const onChangeStatus = (v: string) =>
        setStatus(v as LabResult["status"]);

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader><CardTitle>Nuevo estudio de laboratorio</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label>Paciente</Label>
                        <select className="w-full border rounded-md h-10 px-3" value={patientId} onChange={e => setPatientId(e.target.value)}>
                            <option value="">Selecciona…</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name} • {p.docId}</option>)}
                        </select>
                    </div>
                    <div><Label>Estudio</Label><Input value={test} onChange={e => setTest(e.target.value)} placeholder="p. ej. Hemograma" /></div>
                    <div><Label>Fecha</Label><Input type="date" value={dateISO} onChange={e => setDateISO(e.target.value)} /></div>
                    <div><Label>Resultado</Label><Input value={result} onChange={e => setResult(e.target.value)} /></div>
                    <div>
                        <Label>Estado</Label>
                        <Select value={status} onValueChange={onChangeStatus}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="complete">Completado</SelectItem>
                                <SelectItem value="pending">Pendiente</SelectItem>
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
