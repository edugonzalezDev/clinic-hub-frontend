import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Activity, Video, Calendar, FileText, Shield, Users } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Video,
            title: "Teleconsulta",
            description: "Conéctate con profesionales de la salud mediante videollamadas seguras.",
        },
        {
            icon: Calendar,
            title: "Agenda fácil",
            description: "Reserva turnos cuando te convenga y recibe confirmación al instante.",
        },
        {
            icon: FileText,
            title: "Historia clínica",
            description: "Accede a tu historial médico completo en cualquier momento y lugar.",
        },
        {
            icon: Shield,
            title: "Seguro y privado",
            description: "Tus datos de salud están protegidos con seguridad de nivel empresarial.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            {/* Navegación */}
            <nav className="border-b bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold">HealthConnect</span>
                    </div>
                    <Button onClick={() => navigate("/select-user-type")} size="lg">
                        Comenzar
                    </Button>
                </div>
            </nav>

            {/* Hero */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h1 className="text-5xl font-bold leading-tight">
                        Salud moderna
                        <br />
                        <span className="text-primary">a tu alcance</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Conéctate con profesionales certificados, gestiona tus turnos y accede a tu historia clínica
                        en una sola plataforma segura.
                    </p>
                    <div className="flex gap-4 justify-center pt-6">
                        <Button size="lg" onClick={() => navigate("/login?type=patient")} className="gap-2">
                            <Users className="w-5 h-5" />
                            Portal de Pacientes
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate("/login?type=doctor")} className="gap-2">
                            <Activity className="w-5 h-5" />
                            Portal de Profesionales
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">¿Por qué elegir HealthConnect?</h2>
                    <p className="text-muted-foreground">
                        Atención médica que se adapta a tu estilo de vida
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-4 py-20">
                <div className="bg-gradient-primary rounded-3xl p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
                    <p className="text-lg mb-8 opacity-90">
                        Súmate a miles de pacientes y profesionales que ya usan HealthConnect
                    </p>
                    <Button size="lg" variant="secondary" onClick={() => navigate("/login")}>
                        Crear mi cuenta
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} HealthConnect. Tu plataforma confiable de telemedicina.</p>
                </div>
            </footer>
        </div>
    );
};

export default Login;
