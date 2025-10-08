import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Video, FileText, Users, LogOut, Activity, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDndOrder } from "@/hooks/useDndOrder"; // <— nuevo

import { parseISO, startOfToday, endOfToday, isWithinInterval, format, compareAsc } from "date-fns";

import useAppStore from "@/store/appStore";
import { useMemo } from "react";


// function isSameDay(a: Date, b: Date) {
//     return a.getFullYear() === b.getFullYear() &&
//         a.getMonth() === b.getMonth() &&
//         a.getDate() === b.getDate();
// }

function hhmm(d: Date) {
    return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(d);
}

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { currentUser, currentDoctorId, doctors, patients, appointments, logout } = useAppStore();

    // Detectar el ID del doctor actual (persistido o por nombre; fallback al primero)
    const doctorId = useMemo(() => {
        return (
            currentDoctorId ||
            doctors.find((d) => d.name === currentUser?.name)?.id ||
            doctors[0]?.id
        );
    }, [currentDoctorId, doctors, currentUser?.name]);

    // Citas de hoy para el doctor
    // const todayAppts = useMemo(() => {
    //     const today = new Date();
    //     return appointments
    //         .filter((a) => a.doctorId === doctorId && isSameDay(new Date(a.startsAt), today))
    //         .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
    // }, [appointments, doctorId]);

    // ✅ Citas de hoy por rango local (evita problemas de huso horario)
    const todayAppts = useMemo(() => {
        const start = startOfToday();
        const end = endOfToday();
        return appointments
            .filter((a) =>
                a.doctorId === doctorId &&
                isWithinInterval(parseISO(a.startsAt), { start, end })
            )
            .sort((a, b) => compareAsc(parseISO(a.startsAt), parseISO(b.startsAt)));
    }, [appointments, doctorId]);



    // ✅ storageKey determinística por fecha
    const storageKey = useMemo(
        () => `agenda:${doctorId}:${format(new Date(), "yyyy-MM-dd")}`,
        [doctorId]
    );

    const { ordered: orderedAppts, onDragEnd } = useDndOrder(
        todayAppts,
        (a) => a.id,
        storageKey
    );

    const stats = [
        { label: "Turnos de hoy", value: String(todayAppts.length), icon: Calendar, color: "text-primary" },
        { label: "Notas pendientes", value: "3", icon: FileText, color: "text-yellow-600" },
        { label: "Pacientes totales", value: String(patients.length), icon: Users, color: "text-secondary" },
    ];

    const statusBadge = (status: string) => {
        switch (status) {
            case "pending": return <Badge variant="secondary">pendiente</Badge>;
            case "confirmed": return <Badge>confirmada</Badge>;
            case "cancelled": return <Badge variant="destructive">cancelada</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
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
                            <h1 className="text-xl font-semibold">HealthConnect</h1>
                            <p className="text-sm text-muted-foreground">Portal de profesionales</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            logout();
                            navigate("/", { replace: true });
                        }}
                    >
                        <LogOut className="w-4 h-4 mr-2 " />
                        Cerrar sesión
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Welcome */}
                <div className="space-y-1">
                    <h2 className="text-3xl font-semibold">
                        ¡Hola{currentUser?.name ? `, ${currentUser.name}` : ""}!
                    </h2>
                    <p className="text-muted-foreground">
                        Hoy tenés {todayAppts.length} turno{todayAppts.length === 1 ? "" : "s"} agendado{todayAppts.length === 1 ? "" : "s"}.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <Card key={i} className="shadow-md">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                                    </div>
                                    <div className={`my-gradient-class w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center ${stat.color}`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Agenda de hoy */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    Agenda de hoy
                                </CardTitle>
                                <CardDescription>Turnos programados para hoy</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {orderedAppts.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No hay turnos para hoy.</p>
                                )}

                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="todayAppts">
                                        {(dropProvided) => (
                                            <div ref={dropProvided.innerRef} {...dropProvided.droppableProps} className="space-y-3">
                                                {orderedAppts.map((a, index) => {
                                                    const p = patients.find((x) => x.id === a.patientId);
                                                    const start = new Date(a.startsAt);
                                                    const typeLabel = a.type === "virtual" ? "Teleconsulta" : "Presencial";

                                                    return (
                                                        <Draggable draggableId={a.id} index={index} key={a.id}>
                                                            {(dragProvided, snapshot) => (
                                                                <div
                                                                    ref={dragProvided.innerRef}
                                                                    {...dragProvided.draggableProps}
                                                                    className={`flex items-center justify-between p-4 rounded-lg border bg-card transition-colors
                                                                    ${snapshot.isDragging ? "ring-2 ring-primary/50 bg-accent/20" : "hover:bg-accent/5"}`}
                                                                >
                                                                    {/* “manija” de arrastre: podés moverla a un icono si querés */}
                                                                    <div
                                                                        {...dragProvided.dragHandleProps}
                                                                        className="cursor-grab active:cursor-grabbing select-none mr-3 text-blue-500"
                                                                        title="Arrastrar para reordenar"
                                                                        aria-label="Arrastrar para reordenar"
                                                                    >
                                                                        ⠿
                                                                    </div>

                                                                    <div className="space-y-1 flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <h4 className="font-semibold">{p?.name || "Paciente"}</h4>
                                                                            {statusBadge(a.status)}
                                                                        </div>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {hhmm(start)} • {typeLabel}
                                                                        </p>
                                                                        {p?.docId && (
                                                                            <p className="text-xs text-muted-foreground">Doc: {p.docId}</p>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex gap-2">
                                                                        {a.type === "virtual" && a.status !== "cancelled" && (
                                                                            <Button size="sm" onClick={() => navigate(`/televisit/${a.id}`)}>
                                                                                <Video className="w-4 h-4 mr-2" />
                                                                                Iniciar
                                                                            </Button>
                                                                        )}
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => navigate(`/patients/${p?.id ?? ""}`)}
                                                                        >
                                                                            <FileText className="w-4 h-4 mr-2" />
                                                                            historia
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                                {dropProvided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Acciones rápidas */}
                    <div>
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle>Acciones rápidas</CardTitle>
                                <CardDescription>Atajos para tu día a día</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/doctor/appointments")}>
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Gestionar agenda
                                </Button>
                                <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/patients")}>
                                    <Users className="w-4 h-4 mr-2" />
                                    Ver pacientes
                                </Button>
                                <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/doctor")}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Nueva nota clínica
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;