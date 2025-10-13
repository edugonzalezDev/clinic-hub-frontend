import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Edit3, Trash2, Plus } from "lucide-react";
import type { Vital } from "@/store/appStore";
import useAppStore from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import VitalEditor from "../../patients/components/VitalEditor";

const fdate = (iso: string) =>
    new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));

export function VitalsList({ items, patientId }: { items: Vital[]; patientId: string }) {
    const { updateVital, deleteVital, upsertClinicalRecord } = useAppStore();

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Vital | undefined>(undefined);

    const statusBadge = (status: string) => {
        switch (status) {
            case "Normal": return <Badge variant="secondary">Normal</Badge>;
            case "Alto": return <Badge variant="destructive">Alto</Badge>;
            case "Bajo": return <Badge variant="default">Bajo</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => { setEditing(undefined); setOpen(true); }}>
                    <Plus className="w-4 h-4" /> Nuevo signo vital
                </Button>
            </div>

            {items.length === 0 && <p className="text-sm text-muted-foreground">No hay registros de signos vitales.</p>}

            {items.map(v => (
                <Card key={v.id} className="shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 rounded-xl my-gradient-class flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{v.metric}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{fdate(v.dateISO)}</p>
                                    <p className="text-lg font-semibold text-primary mt-2">{v.value}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {statusBadge(v.status ?? "Normal")}
                                <Button size="sm" variant="outline" onClick={() => { setEditing(v); setOpen(true); }}>
                                    <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                        if (confirm("¿Eliminar este registro?")) {
                                            deleteVital(patientId, v.id);
                                            toast.success("Registro eliminado");
                                        }
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))
            }

            <VitalEditor
                open={open}
                onClose={() => setOpen(false)}
                initial={editing}
                onSubmit={async (data) => {
                    if (editing) {
                        updateVital(patientId, editing.id, data);
                        toast.success("Signo vital actualizado");
                    } else {
                        const id = crypto.randomUUID();
                        upsertClinicalRecord(patientId, { vitals: [...items, { id, ...data }] });
                        toast.success("Signo vital agregado");
                    }
                    setOpen(false);
                }}
            />
        </div >
    );
}
