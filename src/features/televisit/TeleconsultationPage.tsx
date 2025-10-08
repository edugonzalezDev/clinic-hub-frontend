import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, FileText, Activity } from "lucide-react";
import { toast } from "sonner";
import useAppStore from "@/store/appStore";
import { format, parseISO } from "date-fns";

const TeleconsultationPage = () => {
    const navigate = useNavigate();
    const { appointmentId } = useParams<{ appointmentId: string }>();

    const {
        appointments,
        patients,
        doctors,
        clinicalRecords,
        upsertClinicalRecord,
    } = useAppStore();

    // turno, doctor y paciente actuales
    const appt = useMemo(
        () => appointments.find(a => a.id === appointmentId),
        [appointments, appointmentId]
    );

    const doctor = useMemo(
        () => doctors.find(d => d.id === appt?.doctorId),
        [doctors, appt?.doctorId]
    );

    const patient = useMemo(
        () => patients.find(p => p.id === appt?.patientId),
        [patients, appt?.patientId]
    );

    // estado UI
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [message, setMessage] = useState("");
    const [notes, setNotes] = useState("");
    const [messages, setMessages] = useState([
        { sender: "doctor", text: "Hola, ¿cómo te sentís hoy?", time: "09:00" },
        { sender: "patient", text: "Mejor desde la última consulta.", time: "09:01" },
    ]);

    // cronómetro simple (mm:ss)
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setElapsed(s => s + 1), 1000);
        return () => clearInterval(t);
    }, []);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");

    // enviar mensaje
    const handleSendMessage = () => {
        const text = message.trim();
        if (!text) return;
        setMessages(prev => [
            ...prev,
            { sender: "patient", text, time: new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date()) },
        ]);
        setMessage("");
    };

    // guardar notas en Historia Clínica (consultations) y notificar
    const saveNotes = () => {
        if (!appt) return;

        const current = clinicalRecords[appt.patientId] ?? {
            consultations: [],
            medications: [],
            labs: [],
            vitals: [],
        };

        const newConsult = {
            id: crypto.randomUUID(),
            dateISO: new Date().toISOString(),
            doctorId: appt.doctorId,
            specialty: doctor?.specialty ?? "Clínica",
            diagnosis: "Teleconsulta",
            notes: notes.trim(),
        };

        upsertClinicalRecord(appt.patientId, {
            consultations: [...current.consultations, newConsult],
        });

        toast.success("Notas guardadas en la historia clínica");
    };

    // finalizar llamada: guarda (si hay notas) y vuelve al dashboard
    const handleEndCall = () => {
        if (notes.trim()) saveNotes();
        toast.info("Consulta finalizada");
        navigate("/doctor", { replace: true });
    };

    // sin turno válido -> aviso + volver
    if (!appt) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Turno no encontrado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate(-1)}>Volver</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const start = parseISO(appt.startsAt);
    const end = parseISO(appt.endsAt);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold">Teleconsulta</h1>
                                <p className="text-sm text-muted-foreground">
                                    {doctor?.name ?? "Profesional"} • {doctor?.specialty ?? "Clínica"} — Paciente: {patient?.name ?? "N/D"} — {format(start, "HH:mm")}–{format(end, "HH:mm")}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="default" className="animate-pulse">
                                <span className="w-2 h-2 bg-white rounded-full mr-2" />
                                Live
                            </Badge>
                            <span className="text-sm text-muted-foreground">{mm}:{ss}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video Area */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card className="shadow-lg overflow-hidden">
                            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                <div className="text-center space-y-2">
                                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto">
                                        <Video className="w-12 h-12 text-white" />
                                    </div>
                                    <p className="text-lg font-semibold">{doctor?.name ?? "Profesional"}</p>
                                    <Badge variant={isVideoOn ? "secondary" : "destructive"}>
                                        {isVideoOn ? "Video activo" : "Video apagado"}
                                    </Badge>
                                </div>

                                {/* Self-view mock */}
                                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg border-2 border-white shadow-lg flex items-center justify-center">
                                    <Video className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </Card>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                size="lg"
                                variant={isMicOn ? "default" : "destructive"}
                                className="rounded-full w-14 h-14"
                                onClick={() => setIsMicOn(v => !v)}
                                aria-label={isMicOn ? "Apagar micrófono" : "Encender micrófono"}
                            >
                                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                            </Button>

                            <Button
                                size="lg"
                                variant={isVideoOn ? "default" : "destructive"}
                                className="rounded-full w-14 h-14"
                                onClick={() => setIsVideoOn(v => !v)}
                                aria-label={isVideoOn ? "Apagar cámara" : "Encender cámara"}
                            >
                                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                            </Button>

                            <Button
                                size="lg"
                                variant="destructive"
                                className="rounded-full w-14 h-14"
                                onClick={handleEndCall}
                                aria-label="Finalizar llamada"
                            >
                                <PhoneOff className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Chat */}
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <MessageSquare className="w-5 h-5" />
                                    Chat seguro
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ScrollArea className="h-64 pr-4">
                                    <div className="space-y-3">
                                        {messages.map((msg, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-3 rounded-lg ${msg.sender === "doctor"
                                                    ? "bg-primary/10 ml-0 mr-4"
                                                    : "bg-secondary/10 ml-4 mr-0"
                                                    }`}
                                            >
                                                <p className="text-sm">{msg.text}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Escribe un mensaje…"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    />
                                    <Button onClick={handleSendMessage} disabled={!message.trim()}>Enviar</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Clinical Notes */}
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <FileText className="w-5 h-5" />
                                    Notas clínicas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Textarea
                                    placeholder="Escribe las notas de la consulta…"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="min-h-32"
                                />
                                <div className="flex gap-2">
                                    <Button className="p-2" variant="outline" onClick={saveNotes} disabled={!notes.trim()}>
                                        Guardar notas
                                    </Button>
                                    <Button className="w-p-2" onClick={handleEndCall}>
                                        Finalizar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Info del turno (opcional) */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Detalle del turno</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground space-y-1">
                                <div><span className="font-medium">Paciente:</span> {patient?.name ?? "N/D"}</div>
                                <div><span className="font-medium">Profesional:</span> {doctor?.name ?? "N/D"}</div>
                                <div><span className="font-medium">Horario:</span> {format(start, "HH:mm")}–{format(end, "HH:mm")}</div>
                                <div><span className="font-medium">Tipo:</span> {appt.type === "virtual" ? "Teleconsulta" : "Presencial"}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeleconsultationPage;
