import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, Pill, Plus, Trash2 } from "lucide-react";
import type { Medication } from "@/store/appStore";
import { useState } from "react";
import useAppStore from "@/store/appStore";
import MedicationEditor from "@/features/patients/components/MedicationEditor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function MedicationsList({ items, patientId }: { items: Medication[]; patientId: string }) {
    const { updateMedication, deleteMedication, upsertClinicalRecord } = useAppStore();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Medication | undefined>(undefined);

    if (!items.length) {
        return <p className="text-sm text-muted-foreground">No hay medicación registrada.</p>;
    }
    // const label = (s: Medication["status"]) =>
    //     s === "active" ? "Activa" : s === "completed" ? "Finalizada" : "Suspendida";

    const label = (s: Medication["status"]) =>
        s === "active" ? "Activa" : s === "completed" ? "Finalizada" : "Suspendida";

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => { setEditing(undefined); setOpen(true); }}>
                    <Plus className="w-4 h-4" /> Nuevo medicamento
                </Button>
            </div>

            {items.length === 0 && <p className="text-sm text-muted-foreground">No hay medicación registrada.</p>}

            {items.map(med => (
                <Card key={med.id} className="shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 rounded-xl my-gradient-class flex items-center justify-center">
                                    <Pill className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{med.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{med.dosage} • {med.frequency}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge variant={med.status === "active" ? "secondary" : "outline"}>{label(med.status)}</Badge>
                                <Button size="sm" variant="outline" onClick={() => { setEditing(med); setOpen(true); }}>
                                    <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                        if (confirm("¿Eliminar este medicamento?")) {
                                            deleteMedication(patientId, med.id);
                                            toast.success("Medicamento eliminado");
                                        }
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <MedicationEditor
                open={open}
                onClose={() => setOpen(false)}
                initial={editing}
                onSubmit={async (data) => {
                    if (editing) {
                        updateMedication(patientId, editing.id, data);
                        toast.success("Medicamento actualizado");
                    } else {
                        // alta reutilizando upsert: agregamos nuevo con id
                        const id = crypto.randomUUID();
                        upsertClinicalRecord(patientId, {
                            medications: [...items, { id, ...data }],
                        });
                        toast.success("Medicamento agregado");
                    }
                }}
            />
        </div>
    );
}
