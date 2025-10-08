import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAppStore from "@/store/appStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Activity, FileText, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const DRAFT_KEY = (doctorId?: string) => `hc/draft-note:${doctorId ?? "anon"}`;

export default function NewClinicalNotePage() {
    const navigate = useNavigate();
    const [sp] = useSearchParams();

    const {
        currentUser,
        currentDoctorId,
        doctors,
        patients,
        addConsultation,
    } = useAppStore();

    const doctorId = useMemo(
        () => currentDoctorId || doctors.find((d) => d.name === currentUser?.name)?.id || doctors[0]?.id,
        [currentDoctorId, doctors, currentUser?.name]
    );

    // draft state
    const [patientId, setPatientId] = useState<string>(sp.get("patientId") || "");
    const [specialty, setSpecialty] = useState<string>(
        doctors.find((d) => d.id === doctorId)?.specialty || "Clínica"
    );
    const [diagnosis, setDiagnosis] = useState("");
    const [notes, setNotes] = useState("");

    // cargar/autoguardar borrador
    useEffect(() => {
        const raw = localStorage.getItem(DRAFT_KEY(doctorId));
        if (raw) {
            try {
                const d = JSON.parse(raw) as {
                    patientId: string; specialty: string; diagnosis: string; notes: string;
                };
                setPatientId(d.patientId || patientId);
                setSpecialty(d.specialty || specialty);
                setDiagnosis(d.diagnosis || "");
                setNotes(d.notes || "");
            } catch {/* ignore */ }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doctorId]);

    useEffect(() => {
        const draft = { patientId, specialty, diagnosis, notes };
        localStorage.setItem(DRAFT_KEY(doctorId), JSON.stringify(draft));
    }, [patientId, specialty, diagnosis, notes, doctorId]);

    const canSave = patientId.trim().length > 0 && diagnosis.trim().length > 0;

    const onSave = (closeAfter = false) => {
        if (!canSave) {
            toast.error("Selecciona un paciente y escribe al menos un diagnóstico.");
            return;
        }
        addConsultation(patientId, {
            specialty,
            diagnosis: diagnosis.trim(),
            notes: notes.trim(),
        });
        localStorage.removeItem(DRAFT_KEY(doctorId));
        toast.success("Nota clínica guardada");
        if (closeAfter) navigate(`/patients/${patientId}`);
        else {
            // limpiar para una nueva
            setDiagnosis("");
            setNotes("");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button size="sm" variant="ghost" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                        </Button>
                        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center my-gradient-class">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">Nueva nota clínica</h1>
                            <p className="text-sm text-muted-foreground">Registro de consulta</p>
                        </div>
                    </div>
                    <Badge variant="secondary">
                        <FileText className="w-4 h-4 mr-1" /> {doctors.find(d => d.id === doctorId)?.name ?? "Profesional"}
                    </Badge>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Datos de la consulta</CardTitle>
                        <CardDescription>Completa los campos mínimos para guardar</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Paciente</Label>
                            <select
                                className="w-full border rounded-md h-10 px-3"
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                            >
                                <option value="">Selecciona un paciente…</option>
                                {patients.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name} • {p.docId}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Especialidad</Label>
                            <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Diagnóstico (requerido)</Label>
                            <Input
                                placeholder="p. ej., Infección respiratoria alta"
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Notas / Indicaciones</Label>
                            <Textarea
                                className="min-h-40"
                                placeholder="Evolución, tratamiento, indicaciones al paciente, etc."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2 flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => onSave(false)}>
                                <Save className="w-4 h-4 mr-2" /> Guardar
                            </Button>
                            <Button onClick={() => onSave(true)} disabled={!canSave}>
                                <Save className="w-4 h-4 mr-2" /> Guardar y abrir historia
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Atajos</CardTitle>
                        <CardDescription>Productividad</CardDescription>
                    </CardHeader>
                    {/* <CardContent className="text-sm text-muted-foreground">
                        - Si vienes desde “Ver pacientes” puedes pasar el patientId en la URL: <code>?patientId=p1</code>. <br />
                        - El borrador se guarda automáticamente y se limpia al guardar la nota.
                    </CardContent> */}
                </Card>
            </main>
        </div>
    );
}
