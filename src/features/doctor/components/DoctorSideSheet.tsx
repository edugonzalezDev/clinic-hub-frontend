import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Edit3, FileText, LogOut, Menu, Stamp, Users } from "lucide-react";
import { parseISO, startOfToday, endOfToday, isWithinInterval, compareAsc } from "date-fns";
import useAppStore from "@/store/appStore";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
import CardPerfil from "./CardPerfil";


export default function DoctorSideSheet() {
    const navigate = useNavigate();

    // function initials(name?: string) {
    //     if (!name) return "U";
    //     const [a, b] = name.split(" ");
    //     return (a?.[0] ?? "") + (b?.[0] ?? "");
    // }
    const {
        currentUser,
        currentDoctorId,
        doctors,
        patients,
        appointments,
        clinics,
        currentClinicId,
        setCurrentClinic,
        logout,
    } = useAppStore();

    // const doctor = useMemo(
    //     () => doctors.find(d => d.id === currentDoctorId),
    //     [doctors, currentDoctorId]
    // );

    // const roleLabel = currentUser?.role === "doctor" ? "Profesional" :
    //     currentUser?.role === "admin" ? "Administrador" : "Usuario";

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
                {/* Perfil */}
                <CardPerfil />

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
                                <div className="my-gradient-class w-5 h-5 rounded-[3px] flex justify-center items-center">
                                    <Calendar className="h-3 w-3 text-white" />
                                </div>
                                Turnos
                            </div>
                            <div className="text-2xl font-semibold mt-1">{todayAppts.length}</div>
                        </div>
                        <div className="rounded-xl border p-3 bg-card">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="my-gradient-class w-5 h-5 rounded-[3px] flex justify-center items-center">
                                    <Users className="h-3 w-3 text-white" />
                                </div>

                                Pacien.
                            </div>
                            <div className="text-2xl font-semibold mt-1">{totalPacientes}</div>
                        </div>
                        <div className="rounded-xl border p-3 bg-card">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="my-gradient-class w-5 h-5 rounded-[3px] flex justify-center items-center">
                                    <FileText className="h-3 w-3 text-white" />
                                </div>

                                Pend.
                            </div>
                            <div className="text-2xl font-semibold mt-1">
                                {todayAppts.filter((a) => a.status === "pending").length}
                            </div>
                        </div>
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
                            <Button
                                variant="outline"
                                className="justify-start"
                                onClick={() => navigate("/doctor/settings/profile")}
                            >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Editar perfil
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start"
                                onClick={() => navigate("/doctor/settings/signature")}
                            >
                                <Stamp className="w-4 h-4 mr-2" />
                                Firma y sello
                            </Button>
                        </div>
                    </section>
                    <Separator className="my-4" />

                    <Button
                        variant="destructive"
                        className="w-auto ml-5"
                        onClick={() => {
                            logout();
                            navigate("/", { replace: true });
                        }}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar sesión
                    </Button>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
