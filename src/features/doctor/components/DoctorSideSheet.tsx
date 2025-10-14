import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, FileText, Menu, Users } from "lucide-react";
import { parseISO, startOfToday, endOfToday, isWithinInterval, compareAsc } from "date-fns";
import useAppStore from "@/store/appStore";

function hhmm(d: Date) {
    return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(d);
}
function StatusBadge({ status }: { status: "pending" | "confirmed" | "cancelled" }) {
    if (status === "pending") return <Badge variant="secondary">pendiente</Badge>;
    if (status === "confirmed") return <Badge>confirmada</Badge>;
    return <Badge variant="destructive">cancelada</Badge>;
}

export default function DoctorSideSheet() {
    const navigate = useNavigate();
    const {
        currentUser,
        currentDoctorId,
        doctors,
        patients,
        appointments,
        clinics,
        currentClinicId,
        setCurrentClinic,
    } = useAppStore();

    // doctor actual
    const doctorId = useMemo(() => {
        return (
            currentDoctorId ||
            doctors.find((d) => d.name === currentUser?.name)?.id ||
            doctors[0]?.id
        );
    }, [currentDoctorId, doctors, currentUser?.name]);

    // filtro por clínica activa (compat con turnos viejos sin clinicId)
    const belongsToActiveClinic = useCallback(
        (a: { clinicId?: string; patientId: string }) => {
            if (!currentClinicId) return true;
            if (a.clinicId) return a.clinicId === currentClinicId;
            const p = patients.find((pt) => pt.id === a.patientId);
            return (p?.clinicIds ?? []).includes(currentClinicId);
        },
        [currentClinicId, patients]
    );

    // agenda de hoy
    const todayAppts = useMemo(() => {
        const start = startOfToday();
        const end = endOfToday();
        return appointments
            .filter(
                (a) =>
                    a.doctorId === doctorId &&
                    belongsToActiveClinic(a) &&
                    isWithinInterval(parseISO(a.startsAt), { start, end })
            )
            .sort((a, b) => compareAsc(parseISO(a.startsAt), parseISO(b.startsAt)));
    }, [appointments, doctorId, belongsToActiveClinic]);

    const totalPacientes = useMemo(
        () =>
            currentClinicId
                ? patients.filter((p) => (p.clinicIds ?? []).includes(currentClinicId)).length
                : patients.length,
        [patients, currentClinicId]
    );

    return (
        <Sheet>
            {/* Botón de apertura (puede vivir en el header) */}
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-lg">
                    <Menu className="h-4 w-4" />
                    Panel
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[360px] p-0">
                <SheetHeader className="px-5 pt-5 pb-3">
                    <SheetTitle className="text-base">Panel del profesional</SheetTitle>
                    <SheetDescription className="text-xs">
                        Accesos rápidos, agenda de hoy y sede activa
                    </SheetDescription>
                </SheetHeader>
                <Separator />

                <ScrollArea className="h-[calc(100vh-140px)]">
                    {/* Sede activa + selector */}
                    <section className="p-5 space-y-3">
                        <div className="text-xs text-muted-foreground">Sede</div>
                        <select
                            className="w-full h-9 rounded-md border px-2 text-sm"
                            value={currentClinicId ?? clinics[0]?.id}
                            onChange={(e) => setCurrentClinic(e.target.value)}
                        >
                            {clinics.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </section>

                    <Separator />

                    {/* Stats mini */}
                    <section className="p-5 grid grid-cols-3 gap-3">
                        <div className="rounded-xl border p-3 bg-card">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                Hoy
                            </div>
                            <div className="text-2xl font-semibold mt-1">{todayAppts.length}</div>
                        </div>
                        <div className="rounded-xl border p-3 bg-card">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Users className="h-3.5 w-3.5" />
                                Pacientes
                            </div>
                            <div className="text-2xl font-semibold mt-1">{totalPacientes}</div>
                        </div>
                        <div className="rounded-xl border p-3 bg-card">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <FileText className="h-3.5 w-3.5" />
                                Pend.
                            </div>
                            <div className="text-2xl font-semibold mt-1">
                                {todayAppts.filter((a) => a.status === "pending").length}
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Agenda de hoy (mini) */}
                    <section className="p-5">
                        <div className="mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">Agenda de hoy</h3>
                        </div>

                        {todayAppts.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay turnos para hoy.</p>
                        ) : (
                            <ul className="space-y-2">
                                {todayAppts.slice(0, 6).map((a) => {
                                    const p = patients.find((x) => x.id === a.patientId);
                                    const start = parseISO(a.startsAt);
                                    return (
                                        <li
                                            key={a.id}
                                            className="rounded-lg border p-3 bg-card hover:bg-accent/30 transition-colors"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="font-medium text-sm">{p?.name ?? "Paciente"}</div>
                                                <StatusBadge status={a.status} />
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {hhmm(start)} • {a.type === "virtual" ? "Teleconsulta" : "Presencial"}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        {todayAppts.length > 6 && (
                            <Button
                                className="mt-3 w-full"
                                variant="outline"
                                onClick={() => navigate("/doctor/appointments")}
                            >
                                Ver todo
                            </Button>
                        )}
                    </section>

                    <Separator />

                    {/* Accesos rápidos */}
                    <section className="p-5 space-y-2">
                        <h3 className="font-medium">Acciones rápidas</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <Button
                                variant="outline"
                                className="justify-start"
                                onClick={() => navigate("/doctor/appointments")}
                            >
                                <Calendar className="h-4 w-4 mr-2" />
                                Gestionar agenda
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start"
                                onClick={() => navigate("/patients")}
                            >
                                <Users className="h-4 w-4 mr-2" />
                                Ver pacientes
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start"
                                onClick={() => navigate("/doctor/note/new")}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Nueva nota clínica
                            </Button>
                        </div>
                    </section>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
