import { useEffect, useState } from "react";
import type { LabResult } from "@/store/appStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
    open: boolean;
    onClose: () => void;
    initial?: LabResult; // si viene => edición
    onSubmit: (data: Omit<LabResult, "id">) => void | Promise<void>;
};

export default function LabEditor({ open, onClose, initial, onSubmit }: Props) {
    const [test, setTest] = useState("");
    const [dateISO, setDateISO] = useState<string>("");
    const [result, setResult] = useState("");
    const [status, setStatus] = useState<LabResult["status"]>("pending");

    useEffect(() => {
        if (initial) {
            setTest(initial.test);
            setDateISO(initial.dateISO.slice(0, 10));
            setResult(initial.result);
            setStatus(initial.status);
        } else {
            const today = new Date().toISOString().slice(0, 10);
            setTest(""); setDateISO(today); setResult(""); setStatus("pending");
        }
    }, [initial, open]);

    const canSave = test.trim() && dateISO;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent>
                <DialogHeader><DialogTitle>{initial ? "Editar estudio" : "Nuevo estudio"}</DialogTitle></DialogHeader>

                <div className="grid gap-3">
                    <div>
                        <Label>Estudio</Label>
                        <Input value={test} onChange={e => setTest(e.target.value)} placeholder="Hemograma" />
                    </div>
                    <div>
                        <Label>Fecha</Label>
                        <Input type="date" value={dateISO} onChange={e => setDateISO(e.target.value)} />
                    </div>
                    <div>
                        <Label>Resultado</Label>
                        <Input value={result} onChange={e => setResult(e.target.value)} placeholder="Normal / Alterado…" />
                    </div>
                    <div>
                        <Label>Estado</Label>
                        <Select value={status} onValueChange={(v) => setStatus(v as LabResult["status"])}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="complete">Completado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button disabled={!canSave} onClick={() => onSubmit({ test, dateISO, result, status })}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
