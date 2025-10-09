import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import useAppStore from "@/store/appStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Activity, Search, Plus, Users, FileText, Calendar } from "lucide-react";
import { format, parseISO, compareDesc } from "date-fns";

function lastConsultDate(patientId: string, clinicalRecords: ReturnType<typeof useAppStore.getState>["clinicalRecords"]) {
    const rec = clinicalRecords[patientId];
    if (!rec || !rec.consultations.length) return null;
    const sorted = [...rec.consultations].sort((a, b) =>
        compareDesc(parseISO(a.dateISO), parseISO(b.dateISO))
    );
    return sorted[0]?.dateISO ?? null;
}

export default function PatientsPage() {
    const navigate = useNavigate();
    const { patients, clinicalRecords, addPatient } = useAppStore();
    const [q, setQ] = useState("");
    const [openNew, setOpenNew] = useState(false);

    // alta rápida
    const [name, setName] = useState("");
    const [docId, setDocId] = useState("");
    const [phone, setPhone] = useState("");

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return patients;
        return patients.filter(
            (p) =>
                p.name.toLowerCase().includes(query) ||
                p.docId.toLowerCase().includes(query)
        );
    }, [patients, q]);

    const onCreate = () => {
        if (!name.trim() || !docId.trim()) return;
        const id = addPatient({ name: name.trim(), docId: docId.trim(), phone: phone.trim() || undefined, notes: "" });
        setOpenNew(false);
        setName(""); setDocId(""); setPhone("");
        // Llevar directo a la historia si querés:
        navigate(`/patients/${id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center my-gradient-class">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">Pacientes</h1>
                            <p className="text-sm text-muted-foreground">Listado y acciones rápidas</p>
                        </div>
                    </div>

                    <Dialog open={openNew} onOpenChange={setOpenNew}>
                        <DialogTrigger asChild>
                            <Button className="gap-2"><Plus className="w-4 h-4" /> Nuevo paciente</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Alta rápida de paciente</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label>Nombre completo</Label>
                                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Pérez" />
                                </div>
                                <div className="space-y-1">
                                    <Label>DNI / Documento</Label>
                                    <Input value={docId} onChange={(e) => setDocId(e.target.value)} placeholder="12.345.678" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Teléfono (opcional)</Label>
                                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+54 9 ..." />
                                </div>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setOpenNew(false)}>Cancelar</Button>
                                <Button onClick={onCreate} disabled={!name.trim() || !docId.trim()}>Crear</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6">
                {/* Buscador */}
                <Card className="shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <div className="relative w-full md:max-w-xl">
                                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input
                                    className="pl-9"
                                    placeholder="Buscar por nombre o documento…"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                />
                            </div>
                            <Badge variant="secondary" className="ml-auto">
                                <Users className="w-4 h-4 mr-1" /> {filtered.length} paciente{filtered.length === 1 ? "" : "s"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Listado */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((p) => {
                        const last = lastConsultDate(p.id, clinicalRecords);
                        return (
                            <Card key={p.id} className="shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>{p.name}</span>
                                        <Badge variant="outline">{p.docId}</Badge>
                                    </CardTitle>
                                    <CardDescription className="space-x-2">
                                        {p.phone && <span className="text-sm">Tel: {p.phone}</span>}
                                        {p.notes && <span className="text-sm text-muted-foreground">• {p.notes}</span>}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        Última consulta:{" "}
                                        {last ? format(parseISO(last), "dd/MM/yyyy") : "—"}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => navigate(`/patients/${p.id}`)}
                                        >
                                            <FileText className="w-4 h-4 mr-2" /> Historia
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => navigate(`/doctor/appointments?patientId=${p.id}`)}
                                        >
                                            <Calendar className="w-4 h-4 mr-2" /> Nuevo turno
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <Card className="shadow-sm">
                        <CardContent className="py-10 text-center text-muted-foreground">
                            No se encontraron pacientes para “{q}”.
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
