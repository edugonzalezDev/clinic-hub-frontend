import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, UserCircle, Stethoscope, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import useAppStore from "@/store/appStore";

type UserType = "patient" | "doctor";

type LoginForm = {
    email: string;
    password: string;
};

type RegisterForm = {
    full_name: string;
    email: string;
    phone: string;
    dni: string;
    sex: "masculino" | "femenino" | "otro";
    date_of_bird: string;
    password: string;
    license?: string; // requerida solo si userType === "doctor"
};

const emailRule = {
    required: "El email es obligatorio",
    pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Formato de email inválido",
    },
};
const phoneRule = {
    required: "El teléfono es obligatorio",
    pattern: {
        value: /^[+()\s-]*\d[\d\s()-]{6,14}$/,
        message: "Teléfono inválido",
    },
};
const dniRule = {
    required: "El DNI es obligatorio",
    pattern: {
        value: /^[0-9]{8}$/,
        message: "DNI inválido, ingrese solo 8 números",
    },
};

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState<UserType>("patient");

    const loginWithPassword = useAppStore(s => s.loginWithPassword);
    const registerLocal = useAppStore(s => s.register);

    // RHF
    const {
        register: registerLogin,
        handleSubmit: handleSubmitLogin,
        formState: { errors: errorsLogin, isSubmitting: isSubmittingLogin },
    } = useForm<LoginForm>({ defaultValues: { email: "", password: "" }, mode: "onSubmit" });

    const {
        register: registerReg,
        handleSubmit: handleSubmitReg,
        formState: { errors: errorsReg, isSubmitting: isSubmittingReg },
    } = useForm<RegisterForm>({
        defaultValues: {
            full_name: "",
            email: "",
            phone: "",
            dni: "",
            sex: "masculino",
            date_of_bird: "",
            password: "",
            license: "",
        },
        mode: "onSubmit",
    });

    useEffect(() => {
        const type = searchParams.get("type");
        if (type === "doctor" || type === "patient") setUserType(type);
    }, [searchParams]);

    // --- submit handlers ---
    const onLogin = async ({ email, password }: LoginForm) => {
        const res = loginWithPassword(email, password);
        if (!res.ok) {
            toast.error(res.error);
            return;
        }
        toast.success(`Sesión iniciada como ${userType === "patient" ? "Paciente" : "Profesional"}`);
        navigate(userType === "patient" ? "/patient" : "/doctor", { replace: true });
    };

    const onRegister = async (v: RegisterForm) => {
        // validaciones extra por fecha
        const today = new Date().toISOString().slice(0, 10);
        if (!v.date_of_bird) return toast.error("La fecha de nacimiento es obligatoria.");
        if (v.date_of_bird > today) return toast.error("La fecha de nacimiento no puede ser futura.");
        if (v.date_of_bird.slice(0, 4) < "1900") return toast.error("La fecha de nacimiento no puede ser antes de 1900.");

        // matrícula si es doctor
        if (userType === "doctor" && (!v.license || v.license.trim().length < 4)) {
            toast.error("La matrícula profesional es obligatoria (mínimo 4 caracteres).");
            return;
        }

        const res = registerLocal({
            role: userType,
            full_name: v.full_name,
            email: v.email,
            password: v.password,
            phone: v.phone,
            dni: v.dni,
            sex: v.sex,
            date_of_bird: v.date_of_bird,
            license: v.license,
        });

        if (!res.ok) {
            toast.error(res.error);
            return;
        }

        toast.success(`Cuenta creada como ${userType === "patient" ? "Paciente" : "Profesional"}`);
        navigate(userType === "patient" ? "/patient" : "/doctor", { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
            <Card className="w-full max-w-md shadow-lg relative">
                <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="absolute top-4 left-4 gap-2">
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
                        aria-pressed={userType === "patient"}
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
                        aria-pressed={userType === "doctor"}
                    >
                        <Stethoscope className="w-4 h-4" />
                        Profesional
                    </Button>
                </div>

                <CardHeader className="space-y-3 text-center pt-16">
                    <div className="mx-auto w-16 h-16 my-gradient-class rounded-2xl flex items-center justify-center shadow-md">
                        <Activity className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl">HealthConnect</CardTitle>
                    <CardDescription className="text-base">Tu plataforma de telemedicina de confianza</CardDescription>
                </CardHeader>

                <CardContent>
                    <Tabs value={isLogin ? "login" : "register"} onValueChange={(v) => setIsLogin(v === "login")} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Ingresar</TabsTrigger>
                            <TabsTrigger value="register">Registro</TabsTrigger>
                        </TabsList>

                        {/* LOGIN */}
                        <TabsContent value="login" className="space-y-4">
                            <form onSubmit={handleSubmitLogin(onLogin)} className="space-y-4" noValidate>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="usuario@ejemplo.com"
                                        aria-invalid={!!errorsLogin.email}
                                        {...registerLogin("email", emailRule)}
                                    />
                                    {errorsLogin.email && <p className="text-sm text-red-600">{errorsLogin.email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        aria-invalid={!!errorsLogin.password}
                                        {...registerLogin("password", {
                                            required: "La contraseña es obligatoria",
                                            minLength: { value: 6, message: "Mínimo 6 caracteres" },
                                        })}
                                    />
                                    {errorsLogin.password && <p className="text-sm text-red-600">{errorsLogin.password.message}</p>}
                                </div>

                                <Button type="submit" className="w-full" size="lg" disabled={isSubmittingLogin}>
                                    {isSubmittingLogin ? "Ingresando…" : `Ingresar como ${userType === "patient" ? "Paciente" : "Profesional"}`}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* REGISTRO */}
                        <TabsContent value="register" className="space-y-4">
                            <form onSubmit={handleSubmitReg(onRegister)} className="space-y-4" noValidate>
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Nombre completo</Label>
                                    <Input
                                        id="full_name"
                                        type="text"
                                        placeholder="Juan Pérez"
                                        aria-invalid={!!errorsReg.full_name}
                                        {...registerReg("full_name", { required: "El nombre es obligatorio" })}
                                    />
                                    {errorsReg.full_name && <p className="text-sm text-red-600">{errorsReg.full_name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reg-email">Email</Label>
                                    <Input
                                        id="reg-email"
                                        type="email"
                                        placeholder="usuario@ejemplo.com"
                                        aria-invalid={!!errorsReg.email}
                                        {...registerReg("email", emailRule)}
                                    />
                                    {errorsReg.email && <p className="text-sm text-red-600">{errorsReg.email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+54 9 11 1234-5678"
                                        aria-invalid={!!errorsReg.phone}
                                        {...registerReg("phone", phoneRule)}
                                    />
                                    {errorsReg.phone && <p className="text-sm text-red-600">{errorsReg.phone.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dni">DNI</Label>
                                    <Input
                                        id="dni"
                                        type="text"
                                        placeholder="12345678"
                                        aria-invalid={!!errorsReg.dni}
                                        {...registerReg("dni", dniRule)}
                                    />
                                    {errorsReg.dni && <p className="text-sm text-red-600">{errorsReg.dni.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sex">Sexo</Label>
                                    <select
                                        id="sex"
                                        className="input border-2 border-slate-200 rounded-md"
                                        aria-invalid={!!errorsReg.sex}
                                        {...registerReg("sex", { required: "Selecciona una opción" })}
                                    >
                                        <option value="masculino">Masculino</option>
                                        <option value="femenino">Femenino</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                    {errorsReg.sex && <p className="text-sm text-red-600">{errorsReg.sex.message as string}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dob">Fecha de nacimiento</Label>
                                    <Input
                                        id="dob"
                                        type="date"
                                        max={new Date().toISOString().slice(0, 10)}
                                        aria-invalid={!!errorsReg.date_of_bird}
                                        {...registerReg("date_of_bird", { required: "La fecha de nacimiento es obligatoria" })}
                                    />
                                    {errorsReg.date_of_bird && (
                                        <p className="text-sm text-red-600">{errorsReg.date_of_bird.message as string}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reg-password">Contraseña</Label>
                                    <Input
                                        id="reg-password"
                                        type="password"
                                        placeholder="••••••••"
                                        aria-invalid={!!errorsReg.password}
                                        {...registerReg("password", {
                                            required: "La contraseña es obligatoria",
                                            minLength: { value: 6, message: "Mínimo 6 caracteres" },
                                        })}
                                    />
                                    {errorsReg.password && <p className="text-sm text-red-600">{errorsReg.password.message}</p>}
                                </div>

                                {userType === "doctor" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="license">Matrícula profesional</Label>
                                        <Input
                                            id="license"
                                            type="text"
                                            placeholder="MP 123456"
                                            aria-invalid={!!errorsReg.license}
                                            {...registerReg("license", {
                                                required: "La matrícula es obligatoria",
                                                minLength: { value: 4, message: "Mínimo 4 caracteres" },
                                            })}
                                        />
                                        {errorsReg.license && <p className="text-sm text-red-600">{errorsReg.license.message}</p>}
                                    </div>
                                )}

                                <Button type="submit" className="w-full" size="lg" disabled={isSubmittingReg}>
                                    {isSubmittingReg
                                        ? "Creando cuenta…"
                                        : `Registrarme como ${userType === "patient" ? "Paciente" : "Profesional"}`}
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
