import { useEffect, useState } from "react";
import type { Medication } from "@/store/appStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
    open: boolean;
    onClose: () => void;
    initial?: Medication;                 // si viene => edición
    onSubmit: (data: Omit<Medication, "id">) => void | Promise<void>;
};

export default function MedicationEditor({ open, onClose, initial, onSubmit }: Props) {
    const [name, setName] = useState("");
    const [dosage, setDosage] = useState("");
    const [frequency, setFrequency] = useState("");
    const [status, setStatus] = useState<Medication["status"]>("active");

    useEffect(() => {
        if (initial) {
            setName(initial.name);
            setDosage(initial.dosage);
            setFrequency(initial.frequency);
            setStatus(initial.status);
        } else {
            setName(""); setDosage(""); setFrequency(""); setStatus("active");
        }
    }, [initial, open]);

    const canSave = name.trim() && dosage.trim() && frequency.trim();

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initial ? "Editar medicación" : "Nueva medicación"}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-3">
                    <div>
                        <Label>Nombre</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ibuprofeno" />
                    </div>
                    <div>
                        <Label>Dosis</Label>
                        <Input value={dosage} onChange={e => setDosage(e.target.value)} placeholder="600 mg" />
                    </div>
                    <div>
                        <Label>Frecuencia</Label>
                        <Input value={frequency} onChange={e => setFrequency(e.target.value)} placeholder="3 veces al día" />
                    </div>
                    <div>
                        <Label>Estado</Label>
                        <Select value={status} onValueChange={(v) => setStatus(v as Medication["status"])}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Activa</SelectItem>
                                <SelectItem value="suspended">Suspendida</SelectItem>
                                <SelectItem value="completed">Finalizada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button
                            disabled={!canSave}
                            onClick={async () => {
                                await onSubmit({ name, dosage, frequency, status });
                                onClose();
                            }}
                        >
                            Guardar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
