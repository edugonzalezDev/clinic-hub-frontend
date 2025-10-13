import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, Plus, TestTube, Trash2 } from "lucide-react";
import type { LabResult } from "@/store/appStore";
import useAppStore from "@/store/appStore";
import { useState } from "react";
import { toast } from "sonner";
import LabEditor from "@/features/patients/components/LabEditor";
import { Button } from "@/components/ui/button";

const fdate = (iso: string) =>
    new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));

export function LabsList({ items, patientId }: { items: LabResult[]; patientId: string }) {

    const { updateLab, deleteLab, upsertClinicalRecord } = useAppStore();

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<LabResult | undefined>(undefined);

    if (!items.length) {
        return <p className="text-sm text-muted-foreground">No hay resultados de laboratorio.</p>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => { setEditing(undefined); setOpen(true); }}>
                    <Plus className="w-4 h-4" /> Nuevo estudio
                </Button>
            </div>

            {items.length === 0 && <p className="text-sm text-muted-foreground">No hay resultados de laboratorio.</p>}

            {items.map(lab => (
                <Card key={lab.id} className="shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <div className="my-gradient-class w-12 h-12 rounded-xl flex items-center justify-center">
                                    <TestTube className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{lab.test}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{fdate(lab.dateISO)}</p>
                                    <Badge variant="outline" className="mt-2">{lab.result}</Badge>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge variant={lab.status === "complete" ? "secondary" : "outline"}>
                                    {lab.status === "complete" ? "Completado" : "Pendiente"}
                                </Badge>
                                <Button size="sm" variant="outline" onClick={() => { setEditing(lab); setOpen(true); }}>
                                    <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                        if (confirm("¿Eliminar este estudio?")) {
                                            deleteLab(patientId, lab.id);
                                            toast.success("Estudio eliminado");
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

            <LabEditor
                open={open}
                onClose={() => setOpen(false)}
                initial={editing}
                onSubmit={async (data) => {
                    if (editing) {
                        updateLab(patientId, editing.id, data);
                        toast.success("Estudio actualizado");
                    } else {
                        const id = crypto.randomUUID();
                        upsertClinicalRecord(patientId, { labs: [...items, { id, ...data }] });
                        toast.success("Estudio agregado");
                    }
                    setOpen(false);
                }}
            />
        </div>
    );
}
