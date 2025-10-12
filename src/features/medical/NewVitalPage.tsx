import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAppStore from "@/store/appStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Vital } from "@/store/appStore";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


export default function NewVitalPage() {
    const navigate = useNavigate();
    const [sp] = useSearchParams();
    const { patients, addVitalSign } = useAppStore();

    const [patientId, setPatientId] = useState(sp.get("patientId") || "");
    const [metric, setMetric] = useState("");
    const [value, setValue] = useState("");
    const [dateISO, setDateISO] = useState(new Date().toISOString().slice(0, 10));
    const [status, setStatus] = useState<Vital["status"]>("Normal");

    const canSave = patientId && metric && value;

    const onSave = () => {
        if (!canSave) return;
        addVitalSign(patientId, { metric, value, dateISO, status });
        toast.success("Signo vital guardado");
        navigate(`/patients/${patientId}?tab=vitals`);
    };

    const onChangeStatus = (v: string) =>
        setStatus(v as Vital["status"]);

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader><CardTitle>Nuevo registro de signos vitales</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label>Paciente</Label>
                        <select className="w-full border rounded-md h-10 px-3" value={patientId} onChange={e => setPatientId(e.target.value)}>
                            <option value="">Selecciona…</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name} • {p.docId}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label>Métrica</Label>
                        <Input value={metric} onChange={e => setMetric(e.target.value)} placeholder="p. ej. TA, FC, Peso" />
                    </div>
                    <div>
                        <Label>Valor</Label>
                        <Input value={value} onChange={e => setValue(e.target.value)} placeholder="p. ej. 120/80 mmHg" />
                    </div>
                    <div>
                        <Label>Fecha</Label>
                        <Input type="date" value={dateISO} onChange={e => setDateISO(e.target.value)} />
                    </div>
                    <div>
                        <Label>Estado</Label>
                        <Select value={status} onValueChange={onChangeStatus}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Normal">Normal</SelectItem>
                                <SelectItem value="Alto">Alto</SelectItem>
                                <SelectItem value="Bajo">Bajo</SelectItem>
                            </SelectContent>
                        </Select>
                        {/* <Input value={status} onChange={() => onChangeStatus} placeholder="Normal, Alto, Bajo…" /> */}
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
