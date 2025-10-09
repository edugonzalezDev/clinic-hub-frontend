import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, UserCircle, Stethoscope, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const SelectUserType = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
            <div className="w-full max-w-4xl">
                <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-6 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Button>

                <div className="text-center mb-12">
                    <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg mb-6 bg-gradient-to-br from-indigo-600 to-sky-500">
                        <Activity className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">HealthConnect</h1>
                    <p className="text-muted-foreground text-lg">Elige tu tipo de cuenta</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card
                        className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2 border-slate-300"
                        onClick={() => navigate("/login?type=patient")}
                    >
                        <CardHeader className="text-center pb-4">
                            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <UserCircle className="w-12 h-12 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Paciente</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <CardDescription className="text-base">
                                Reserva turnos, accede a tu historia clínica y realiza teleconsultas.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2 border-slate-300"
                        onClick={() => navigate("/login?type=doctor")}
                    >
                        <CardHeader className="text-center pb-4">
                            <div className="mx-auto w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                                <Stethoscope className="w-12 h-12 text-secondary" />
                            </div>
                            <CardTitle className="text-2xl">Profesional</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <CardDescription className="text-base">
                                Gestiona tu agenda, accede a fichas de pacientes y brinda teleconsultas.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center">
                    <p className="text-muted-foreground">
                        ¿Ya tienes cuenta?{" "}
                        <Button variant="link" onClick={() => navigate("/login")} className="p-0 h-auto font-semibold">
                            Inicia sesión aquí
                        </Button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SelectUserType;
