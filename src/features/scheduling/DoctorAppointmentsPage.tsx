// src/features/scheduling/DoctorAppointmentsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Activity, ArrowLeft, CalendarPlus, Calendar as CalIcon, CheckCircle, Clock, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import useAppStore, { type Appointment } from "@/store/appStore";
import { useDndOrder } from "@/hooks/useDndOrder";
import { addMinutes, compareAsc, endOfDay, format, parse, parseISO, startOfDay, isWithinInterval } from "date-fns";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function StatusBadge({ status }: { status: "pending" | "confirmed" | "cancelled" }) {
    if (status === "pending") return <Badge variant="secondary">pendiente</Badge>;
    if (status === "confirmed") return <Badge>confirmada</Badge>;
    return <Badge variant="destructive">cancelada</Badge>;
}

function hhmm(d: Date) {
    return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(d);
}

export default function DoctorAppointmentsPage() {
    const navigate = useNavigate();
    const {
        currentUser,
        currentDoctorId,
        doctors,
        patients,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
    } = useAppStore();

    // doctor actual (fallback al primero)
    const doctorId = useMemo(() => {
        return (
            currentDoctorId ||
            doctors.find((d) => d.name === currentUser?.name)?.id ||
            doctors[0]?.id
        );
    }, [currentDoctorId, doctors, currentUser?.name]);

    // filtro por día (yyyy-MM-dd)
    const [day, setDay] = useState<string>(() => format(new Date(), "yyyy-MM-dd"));
    useEffect(() => {
        // sanity: si cambia doctor, mantenemos el día actual
    }, [doctorId]);

    // const dayStart = useMemo(() => startOfDay(new Date(day)), [day]);
    // const dayEnd = useMemo(() => endOfDay(new Date(day)), [day]);

    // Después (día local, sin shift de huso)
    const dayDate = useMemo(() => parse(day, "yyyy-MM-dd", new Date()), [day]);
    const dayStart = useMemo(() => startOfDay(dayDate), [dayDate]);
    const dayEnd = useMemo(() => endOfDay(dayDate), [dayDate]);

    const dayAppts = useMemo(() => {
        return appointments
            .filter(
                (a) =>
                    a.doctorId === doctorId &&
                    isWithinInterval(parseISO(a.startsAt), { start: dayStart, end: dayEnd })
            )
            .sort((a, b) => compareAsc(parseISO(a.startsAt), parseISO(b.startsAt)));
    }, [appointments, doctorId, dayStart, dayEnd]);

    // Orden persistido por fecha+doctor
    const storageKey = useMemo(() => `agenda:${doctorId}:${day}`, [doctorId, day]);
    const { ordered: orderedAppts, onDragEnd } = useDndOrder(dayAppts, (a) => a.id, storageKey);

    // ---- creación de turno ----
    const [showNew, setShowNew] = useState(false);
    const [newPatientId, setNewPatientId] = useState<string>(patients[0]?.id ?? "");
    const [newStart, setNewStart] = useState<string>(() => `${day}T09:00`);
    const [newDuration, setNewDuration] = useState<number>(20);
    // const [newType, setNewType] = useState<"virtual" | "presencial">("virtual");
    // const [newStatus, setNewStatus] = useState<"pending" | "confirmed" | "cancelled">("confirmed");
    // estado TIPADO
    const [newType, setNewType] = useState<Appointment["type"]>("virtual");
    const [newStatus, setNewStatus] = useState<Appointment["status"]>("confirmed");

    // handlers TIPADOS
    const onChangeType = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setNewType(e.target.value as Appointment["type"]);

    const onChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setNewStatus(e.target.value as Appointment["status"]);

    // probando =)

    useEffect(() => {
        // si cambia el día, reseteamos la hora inicial
        setNewStart(`${day}T09:00`);
    }, [day]);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPatientId) {
            toast.error("Selecciona un paciente");
            return;
        }
        const startISO = new Date(newStart).toISOString();
        const endsISO = addMinutes(new Date(newStart), newDuration).toISOString();

        addAppointment({
            id: crypto.randomUUID(),
            doctorId,
            patientId: newPatientId,
            startsAt: startISO,
            endsAt: endsISO,
            type: newType,
            status: newStatus,
        });

        toast.success("Turno creado");
        setShowNew(false);
    };

    // ---- edición simple por fila ----
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editStart, setEditStart] = useState<string>("");
    const [editDuration, setEditDuration] = useState<number>(20);
    const [editType, setEditType] = useState<"virtual" | "presencial">("virtual");
    const [editStatus, setEditStatus] = useState<"pending" | "confirmed" | "cancelled">("confirmed");

    const openEdit = (id: string) => {
        const a = orderedAppts.find((x) => x.id === id);
        if (!a) return;
        setEditingId(id);
        setEditStart(format(parseISO(a.startsAt), "yyyy-MM-dd'T'HH:mm"));
        const minutes = Math.max(
            5,
            Math.round((+new Date(a.endsAt) - +new Date(a.startsAt)) / 60000)
        );
        setEditDuration(minutes);
        setEditType(a.type);
        setEditStatus(a.status);
    };

    const saveEdit = () => {
        if (!editingId) return;
        const startISO = new Date(editStart).toISOString();
        const endISO = addMinutes(new Date(editStart), editDuration).toISOString();
        updateAppointment(editingId, {
            startsAt: startISO,
            endsAt: endISO,
            type: editType,
            status: editStatus,
        });
        setEditingId(null);
        toast.success("Turno actualizado");
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Volver
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 my-gradient-class rounded-xl flex items-center justify-center">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold">Gestión de agenda</h1>
                                <p className="text-sm text-muted-foreground">Profesional: {doctors.find(d => d.id === doctorId)?.name ?? "—"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <CalIcon className="w-4 h-4 text-primary" />
                            <Input
                                type="date"
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                className="h-8 w-[150px]"
                            />
                        </div>
                        <Button onClick={() => setShowNew((v) => !v)} className="gap-2">
                            <CalendarPlus className="w-4 h-4" />
                            Nuevo turno
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-md">
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground">Turnos del día</p>
                            <h3 className="text-3xl font-bold mt-1">{dayAppts.length}</h3>
                        </CardContent>
                    </Card>
                    <Card className="shadow-md">
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground">Virtual / Presencial</p>
                            <h3 className="text-3xl font-bold mt-1">
                                {dayAppts.filter(a => a.type === "virtual").length} / {dayAppts.filter(a => a.type === "presencial").length}
                            </h3>
                        </CardContent>
                    </Card>
                    <Card className="shadow-md">
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground">Pendientes</p>
                            <h3 className="text-3xl font-bold mt-1">{dayAppts.filter(a => a.status === "pending").length}</h3>
                        </CardContent>
                    </Card>
                </div>

                {/* Form nuevo turno */}
                {showNew && (
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarPlus className="w-5 h-5 text-primary" />
                                Crear nuevo turno
                            </CardTitle>
                            <CardDescription>Completa los campos y guarda para agendar.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                <div className="md:col-span-2">
                                    <Label>Paciente</Label>
                                    <select
                                        className="w-full border rounded-md h-10 px-3"
                                        value={newPatientId}
                                        onChange={(e) => setNewPatientId(e.target.value)}
                                    >
                                        {patients.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <Label>Inicio</Label>
                                    <Input
                                        type="datetime-local"
                                        value={newStart}
                                        onChange={(e) => setNewStart(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Duración (min)</Label>
                                    <Input
                                        type="number"
                                        min={5}
                                        step={5}
                                        value={newDuration}
                                        onChange={(e) => setNewDuration(parseInt(e.target.value || "20", 10))}
                                    />
                                </div>
                                <div>
                                    <Label>Tipo</Label>
                                    <select
                                        className="w-full border rounded-md h-10 px-3"
                                        value={newType}
                                        // onChange={(e) => setNewType(e.target.value as any)}
                                        onChange={onChangeType}

                                    >
                                        <option value="virtual">Teleconsulta</option>
                                        <option value="presencial">Presencial</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>Estado</Label>
                                    <select
                                        className="w-full border rounded-md h-10 px-3"
                                        value={newStatus}
                                        // onChange={(e) => setNewStatus(e.target.value as any)}
                                        onChange={onChangeStatus}

                                    >
                                        <option value="confirmed">Confirmada</option>
                                        <option value="pending">Pendiente</option>
                                        <option value="cancelled">Cancelada</option>
                                    </select>
                                </div>

                                <div className="md:col-span-6 flex gap-2 justify-end pt-2">
                                    <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
                                    <Button type="submit">Guardar</Button>
                                </div>

                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Lista del día con DnD */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            Agenda del {format(dayDate, "dd/MM/yyyy")}
                        </CardTitle>
                        <CardDescription>Arrastra para cambiar el orden visual del día.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orderedAppts.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay turnos en este día.</p>
                        ) : (
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="day">
                                    {(dropProvided) => (
                                        <div ref={dropProvided.innerRef} {...dropProvided.droppableProps} className="space-y-3">
                                            {orderedAppts.map((a, index) => {
                                                const p = patients.find((x) => x.id === a.patientId);
                                                const start = parseISO(a.startsAt);
                                                const end = parseISO(a.endsAt);
                                                const isEditing = editingId === a.id;

                                                return (
                                                    <Draggable key={a.id} draggableId={a.id} index={index}>
                                                        {(dragProvided, snapshot) => (
                                                            <div
                                                                ref={dragProvided.innerRef}
                                                                {...dragProvided.draggableProps}
                                                                className={`border rounded-lg p-4 bg-card transition-colors ${snapshot.isDragging ? "ring-2 ring-primary/50 bg-accent/20" : "hover:bg-accent/5"}`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        {...dragProvided.dragHandleProps}
                                                                        className="cursor-grab active:cursor-grabbing text-slate-400 select-none"
                                                                        title="Arrastrar"
                                                                    >
                                                                        ⠿
                                                                    </div>

                                                                    <div className="flex-1">
                                                                        <div className="flex flex-wrap items-center gap-2">
                                                                            <div className="font-semibold">{p?.name ?? "Paciente"}</div>
                                                                            <StatusBadge status={a.status} />
                                                                            <Badge variant="outline">{a.type === "virtual" ? "Teleconsulta" : "Presencial"}</Badge>
                                                                        </div>
                                                                        <div className="text-sm text-muted-foreground mt-1">
                                                                            {hhmm(start)} — {hhmm(end)} • DocID: {p?.docId ?? "—"}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex gap-2">
                                                                        <Button size="sm" variant="outline" className="gap-1" onClick={() => openEdit(a.id)}>
                                                                            <Edit3 className="w-4 h-4" /> Editar
                                                                        </Button>
                                                                        {a.status !== "cancelled" ? (
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="gap-1"
                                                                                onClick={() => {
                                                                                    updateAppointment(a.id, { status: "cancelled" });
                                                                                    toast.message("Turno cancelado");
                                                                                }}
                                                                            >
                                                                                <Trash2 className="w-4 h-4" /> Cancelar
                                                                            </Button>
                                                                        ) : (
                                                                            <Button
                                                                                size="sm"
                                                                                className="gap-1"
                                                                                onClick={() => {
                                                                                    updateAppointment(a.id, { status: "confirmed" });
                                                                                    toast.success("Turno reactivado");
                                                                                }}
                                                                            >
                                                                                <CheckCircle className="w-4 h-4" /> Confirmar
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            if (confirm("¿Eliminar este turno?")) deleteAppointment(a.id);
                                                                        }}
                                                                    >
                                                                        Eliminar
                                                                    </Button>
                                                                </div>

                                                                {/* Editor inline */}
                                                                {isEditing && (
                                                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-3">
                                                                        <div className="md:col-span-2">
                                                                            <Label>Inicio</Label>
                                                                            <Input
                                                                                type="datetime-local"
                                                                                value={editStart}
                                                                                onChange={(e) => setEditStart(e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label>Duración (min)</Label>
                                                                            <Input
                                                                                type="number"
                                                                                min={5}
                                                                                step={5}
                                                                                value={editDuration}
                                                                                onChange={(e) => setEditDuration(parseInt(e.target.value || "20", 10))}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label>Tipo</Label>
                                                                            <select
                                                                                className="w-full border rounded-md h-10 px-3"
                                                                                value={editType}
                                                                                // onChange={(e) => setEditType(e.target.value as any)}
                                                                                onChange={onChangeType}

                                                                            >
                                                                                <option value="virtual">Teleconsulta</option>
                                                                                <option value="presencial">Presencial</option>
                                                                            </select>
                                                                        </div>
                                                                        <div>
                                                                            <Label>Estado</Label>
                                                                            <select
                                                                                className="w-full border rounded-md h-10 px-3"
                                                                                value={editStatus}
                                                                                // onChange={(e) => setEditStatus(e.target.value as any)}
                                                                                onChange={onChangeStatus}

                                                                            >
                                                                                <option value="confirmed">Confirmada</option>
                                                                                <option value="pending">Pendiente</option>
                                                                                <option value="cancelled">Cancelada</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="md:col-span-6 flex gap-2 justify-end">
                                                                            <Button variant="outline" onClick={() => setEditingId(null)}>Cerrar</Button>
                                                                            <Button onClick={saveEdit}>Guardar cambios</Button>
                                                                        </div>
                                                                    </div>
                                                                )}
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
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
