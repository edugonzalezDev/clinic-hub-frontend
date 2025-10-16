import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAppStore from "@/store/appStore";
import { format } from "date-fns";
import { openPrescriptionPdf } from "@/features/medical/pdfActions";
import { genPrescriptionPdf } from "@/lib/pdf";
import { toast } from "sonner";
import type { Prescription, RxItem } from "@/store/appStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";


export default function PatientPrescriptionsTab({ patientId }: { patientId: string }) {
    type DraftItem = { drug: string; dose: string; frequency: string; duration: string; notes?: string };

    const [editing, setEditing] = useState<null | Prescription>(null);
    const [diag, setDiag] = useState<string>("");
    const [rows, setRows] = useState<RxItem[]>([]);

    const {
        clinicalRecords,
        doctors,
        currentDoctorId,
        updatePrescription,
        deletePrescription,
    } = useAppStore();

    const items = [...(clinicalRecords[patientId]?.prescriptions ?? [])]
        .sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));

    if (items.length === 0) {
        return <p className="text-sm text-muted-foreground">No hay recetas registradas para este paciente.</p>;
    }

    const onReemit = (rx: Prescription) => {
        const picked =
            doctors.find(d => d.id === currentDoctorId) ??
            doctors.find(d => d.id === rx.doctorId) ??
            doctors[0];

        // Armamos el objeto de doctor que pide el generador
        const doctorForPdf = picked
            ? {
                name: picked.name,
                license: picked.license,
                signaturePng: picked.signaturePng,
                stampPng: picked.stampPng,
            }
            : { name: "—" as const };

        // 2) Paciente: usamos snapshot si existe (lo más robusto)
        const patientForPdf = rx.patientSnapshot
            ? { ...rx.patientSnapshot, insurance: rx.insuranceSnapshot }
            : { name: "—", docId: "" };

        // 3) Generamos y abrimos
        const fileUrl = genPrescriptionPdf({
            doctor: doctorForPdf,
            patient: patientForPdf,
            diagnosis: rx.diagnosis,
            items: rx.items,
        });

        // 4) Guardamos el blob URL + snapshot de doctor para trazabilidad
        updatePrescription(patientId, rx.id, {
            fileUrl,
            dateISO: new Date().toISOString(),
            doctorSnapshot: { name: doctorForPdf.name },
        });

        toast.success("Receta reemitida");
        window.open(fileUrl, "_blank");
    };


    const onDelete = (rx: Prescription) => {
        if (!confirm("¿Eliminar esta receta?")) return;
        deletePrescription(patientId, rx.id);
        toast.success("Receta eliminada");
    };

    function startEdit(rx: Prescription) {
        setEditing(rx);
        setDiag(rx.diagnosis ?? "");
        setRows(rx.items.map(i => ({ ...i })));
    }

    function updateRow(i: number, patch: Partial<DraftItem>) {
        setRows(prev => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    }
    function addRow() {
        setRows(prev => [...prev, { drug: "", dose: "", frequency: "", duration: "", notes: "" }]);
    }
    function removeRow(i: number) {
        setRows(prev => prev.filter((_, idx) => idx !== i));
    }

    function doctorForRegen(rx: Prescription) {
        const picked =
            doctors.find(d => d.id === currentDoctorId) ??
            doctors.find(d => d.id === rx.doctorId) ??
            doctors[0];

        return picked
            ? {
                name: picked.name,
                license: picked.license,
                signaturePng: picked.signaturePng,
                stampPng: picked.stampPng,
            }
            : { name: "—" as const };
    }

    function patientForRegen(rx: Prescription) {
        return rx.patientSnapshot
            ? { ...rx.patientSnapshot, insurance: rx.insuranceSnapshot }
            : { name: "—", docId: "" };
    }

    function saveEdit() {
        if (!editing) return;
        // re-generar PDF con los cambios
        const fileUrl = genPrescriptionPdf({
            doctor: doctorForRegen(editing),
            patient: patientForRegen(editing),
            diagnosis: diag || undefined,
            items: rows,
        });
        updatePrescription(patientId, editing.id, {
            diagnosis: diag || undefined,
            items: rows,
            fileUrl,
            dateISO: new Date().toISOString(),
            doctorSnapshot: { name: doctorForRegen(editing).name },
        });
        toast.success("Receta actualizada y reemitida");
        window.open(fileUrl, "_blank");
        setEditing(null);
    }

    return (
        <div className="space-y-4">
            {items.map((rx) => {
                const docName = doctors.find(d => d.id === rx.doctorId)?.name ?? "—";
                const date = rx.dateISO ? format(new Date(rx.dateISO), "d MMM yyyy") : "—";
                const firstDrug = rx.items[0]?.drug ?? "";
                const more = Math.max(0, rx.items.length - 1);
                return (
                    <Card key={rx.id} id={`rx-${rx.id}`} className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Receta • {date}</CardTitle>
                            <div className="text-sm text-muted-foreground">Dr/a: {docName}</div>
                        </CardHeader>
                        <section className="w-full h-auto flex flex-row">
                            <div className="leftCont w-1/2 flex flex-col">
                                <CardContent className="space-y-2">
                                    {rx.diagnosis && (
                                        <p className="text-sm">
                                            <span className="font-medium">Diagnóstico:</span> {rx.diagnosis}
                                        </p>
                                    )}
                                    <p className="text-sm">
                                        <span className="font-medium">Medicamentos:</span> {firstDrug}{more > 0 ? ` (+${more} más)` : ""}
                                    </p>
                                    <div className="flex gap-2 pt-2">
                                        <Button className="rounded-[4px] border border-slate-400 hover:border-blue-400" variant="outline" onClick={() => openPrescriptionPdf(rx)}>Ver PDF</Button>
                                        {rx.fileUrl && (
                                            <Button
                                                className="rounded-[4px] border border-slate-400 hover:border-blue-400"
                                                variant="default"
                                                onClick={() => window.open(rx.fileUrl!, "_blank")}
                                            >
                                                Abrir archivo guardado
                                            </Button>
                                        )}
                                    </div>

                                </CardContent>
                            </div>
                            <div className="rightCont w-1/2 flex flex-col justify-center items-end pr-3 gap-2">
                                <Button
                                    className="w-auto rounded-[4px] border border-slate-400 hover:border-blue-400"
                                    variant="outline"
                                    onClick={() => startEdit(rx)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    className="w-auto rounded-[4px] border border-slate-400 hover:border-blue-400"
                                    variant="outline"
                                    onClick={() => onReemit(rx)}
                                >
                                    Reemitir PDF
                                </Button>
                                <Button variant="destructive" onClick={() => onDelete(rx)}>
                                    Eliminar
                                </Button>
                            </div>
                        </section>
                    </Card>
                );
            })}
            <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Editar receta</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Diagnóstico (opcional)</Label>
                            <Input value={diag} onChange={(e) => setDiag(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Medicamentos</Label>
                            <div className="space-y-2">
                                {rows.map((r, i) => (
                                    <div key={i} className="grid md:grid-cols-6 gap-2 items-center">
                                        <Input placeholder="Medicamento" value={r.drug} onChange={(e) => updateRow(i, { drug: e.target.value })} />
                                        <Input placeholder="Dosis" value={r.dose} onChange={(e) => updateRow(i, { dose: e.target.value })} />
                                        <Input placeholder="Frecuencia" value={r.frequency} onChange={(e) => updateRow(i, { frequency: e.target.value })} />
                                        <Input placeholder="Duración" value={r.duration} onChange={(e) => updateRow(i, { duration: e.target.value })} />
                                        <div className="msj md:col-span-2 gap-2">
                                            <Input className="w-3/4" placeholder="Notas" value={r.notes ?? ""} onChange={(e) => updateRow(i, { notes: e.target.value })} />
                                            <Button className="w-1/4" variant="outline" type="button" onClick={() => removeRow(i)}>–</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" type="button" onClick={addRow}>+ Agregar medicamento</Button>
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" type="button" onClick={() => setEditing(null)}>Cancelar</Button>
                        <Button type="button" onClick={saveEdit}>Guardar y reemitir</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

    );

}
