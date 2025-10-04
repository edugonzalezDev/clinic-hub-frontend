import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, UserCircle, Stethoscope, ArrowLeft } from "lucide-react";
import { toast } from "sonner"

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState<"patient" | "doctor">("patient");

    useEffect(() => {
        const type = searchParams.get("type");
        if (type === "doctor" || type === "patient") {
            setUserType(type);
        }
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(`${isLogin ? "Logged in" : "Registered"} as ${userType}`)
        navigate(userType === "patient" ? "/patient-dashboard" : "/doctor-dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
            <Card className="w-full max-w-md shadow-lg relative">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/")}
                    className="absolute top-4 left-4 gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Button>
                <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                        type="button"
                        variant={userType === "patient" ? "default" : "outline"}
                        onClick={() => setUserType("patient")}
                        size="sm"
                        className="gap-2"
                    >
                        <UserCircle className="w-4 h-4" />
                        Paciente
                    </Button>
                    <Button
                        type="button"
                        variant={userType === "doctor" ? "default" : "outline"}
                        onClick={() => setUserType("doctor")}
                        size="sm"
                        className="gap-2"
                    >
                        <Stethoscope className="w-4 h-4" />
                        Doctor
                    </Button>
                </div>
                <CardHeader className="space-y-3 text-center pt-16">
                    <div className="mx-auto w-16 h-16 my-gradient-class rounded-2xl flex items-center justify-center shadow-md">
                        <Activity className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl">HealthConnect</CardTitle>
                    <CardDescription className="text-base">
                        Tu plataforma de telemedicina de confianza
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={isLogin ? "login" : "register"} onValueChange={(v) => setIsLogin(v === "login")} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Registro</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="space-y-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="usuario@ejemplo.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" size="lg">
                                    Login como {userType === "patient" ? "Paciente" : "Doctor"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register" className="space-y-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre completo</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-email">Email</Label>
                                    <Input
                                        id="reg-email"
                                        type="email"
                                        placeholder="usuario@ejemplo.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-password">Contraseña</Label>
                                    <Input
                                        id="reg-password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                {userType === "doctor" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="license">Número de licencia médica</Label>
                                        <Input
                                            id="license"
                                            type="text"
                                            placeholder="MD123456"
                                            required
                                        />
                                    </div>
                                )}
                                <Button type="submit" className="w-full" size="lg">
                                    Registerse como {userType === "patient" ? "Paciente" : "Doctor"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
