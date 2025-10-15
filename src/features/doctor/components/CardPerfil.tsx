import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import useAppStore from "@/store/appStore";
import { useMemo } from "react";
import { useNavigate } from "react-router";



const CardPerfil = () => {

    const initials = (name?: string) => {
        if (!name) return "U";
        const [a, b] = name.split(" ");
        return (a?.[0] ?? "") + (b?.[0] ?? "");
    }

    const navigate = useNavigate();
    const {
        currentUser,
        currentDoctorId,
        doctors,
    } = useAppStore();

    const doctor = useMemo(
        () => doctors.find(d => d.id === currentDoctorId),
        [doctors, currentDoctorId]
    );

    const roleLabel = currentUser?.role === "doctor" ? "Profesional" :
        currentUser?.role === "admin" ? "Administrador" : "Usuario";

    return (
        <>
            <div className="flex items-center justify-start gap-4 mt-2 pl-3 pt-4">
                <Avatar className="h-14 w-14">
                    {/* si más adelante guardás foto => src aquí */}
                    <AvatarImage alt={currentUser?.name} />
                    <AvatarFallback className="font-semibold">{initials(currentUser?.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{currentUser?.name ?? "—"}</h3>
                        <Badge variant="secondary" className="text-xs">{roleLabel}</Badge>
                    </div>
                    {doctor?.license && (
                        <p className="text-xs text-muted-foreground mt-0.5">Matrícula: {doctor.license}</p>
                    )}
                    {/* Si en AuthUser guardás email/phone, podés mostrarlos aquí también */}
                    {currentUser?.email && (
                        <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default CardPerfil