import { useEffect, useState } from "react";
import type { Vital } from "@/store/appStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


type Props = {
    open: boolean;
    onClose: () => void;
    initial?: Vital;
    onSubmit: (data: Omit<Vital, "id">) => void | Promise<void>;
};

export default function VitalEditor({ open, onClose, initial, onSubmit }: Props) {
    const [metric, setMetric] = useState("");
    const [value, setValue] = useState("");
    const [dateISO, setDateISO] = useState<string>("");
    const [status, setStatus] = useState<Vital["status"]>("Normal");

    useEffect(() => {
        if (initial) {
            setMetric(initial.metric);
            setValue(initial.value);
            setDateISO(initial.dateISO.slice(0, 10));
            setStatus(initial.status ?? "Normal");
        } else {
            const today = new Date().toISOString().slice(0, 10);
            setMetric(""); setValue(""); setDateISO(today); setStatus("Normal");
        }
    }, [initial, open]);

    const canSave = metric.trim() && value.trim() && dateISO;

    const onChangeStatus = (v: string) =>
        setStatus(v as Vital["status"]);

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {initial ? "Editar signo vital" : "Nuevo signo vital"}
                    </DialogTitle>
                    <DialogDescription id="vital-edit-desc">
                        Cargá la métrica, el valor, la fecha y el estado.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3">
                    <div>
                        <Label>Métrica</Label>
                        <Input value={metric} onChange={e => setMetric(e.target.value)} placeholder="TA / FC / Peso…" />
                    </div>
                    <div>
                        <Label>Valor</Label>
                        <Input value={value} onChange={e => setValue(e.target.value)} placeholder="120/80 mmHg, 72 lpm, 75 kg…" />
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
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button disabled={!canSave} onClick={() => onSubmit({ metric, value, dateISO, status })}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
