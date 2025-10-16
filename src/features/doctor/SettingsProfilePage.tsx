import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAppStore from "@/store/appStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Upload, Trash2 } from "lucide-react";
import DoctorSideSheet from "./components/DoctorSideSheet";
import LogoTitle from "./components/LogoTitle";

const ProfileSchema = z.object({
    name: z.string().min(2, "Nombre muy corto"),
    email: z.string().email("Email no válido").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    license: z.string().optional().or(z.literal("")),
    // imágenes (guardamos dataURL simples)
    photoUrl: z.string().optional(),
    signaturePng: z.string().optional(),
    stampPng: z.string().optional(),
    bio: z.string().optional().or(z.literal("")),
});

type ProfileForm = z.infer<typeof ProfileSchema>;

// helper: archivo -> dataURL
async function fileToDataURL(file: File): Promise<string> {
    return await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.onerror = (e) => rej(e);
        r.readAsDataURL(file);
    });
}

export default function SettingsProfilePage() {
    // const navigate = useNavigate();
    const {
        currentUser,
        currentDoctorId,
        doctors,
        updateDoctorProfile,
        // si también querés persistir email/phone del usuario:
        users,
        login, // lo usamos para refrescar currentUser si lo cambiás
    } = useAppStore();

    const doctor = useMemo(
        () => doctors.find(d => d.id === currentDoctorId),
        [doctors, currentDoctorId]
    );

    const userRecord = useMemo(
        () => users.find(u => u.id === currentUser?.id),
        [users, currentUser?.id]
    );

    const form = useForm<ProfileForm>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            name: doctor?.name ?? currentUser?.name ?? "",
            email: userRecord?.email ?? "",
            phone: userRecord?.phone ?? "",
            license: doctor?.license ?? "",
            photoUrl: doctor?.photoUrl ?? "",
            signaturePng: doctor?.signaturePng,
            stampPng: doctor?.stampPng,
            bio: "",
        },
    });

    // Pre-carga si cambian entidades
    useEffect(() => {
        form.reset({
            name: doctor?.name ?? currentUser?.name ?? "",
            email: userRecord?.email ?? "",
            phone: userRecord?.phone ?? "",
            license: doctor?.license ?? "",
            photoUrl: doctor?.photoUrl ?? "",
            signaturePng: doctor?.signaturePng,
            stampPng: doctor?.stampPng,
            bio: "",
        });
    }, [doctor, currentUser, userRecord, form]);

    const [uploading, setUploading] = useState<null | "avatar" | "signature" | "stamp">(null);

    const onSubmit = (data: ProfileForm) => {
        // 1) actualizamos perfil del médico
        updateDoctorProfile({
            name: data.name,
            license: data.license,
            signaturePng: data.signaturePng,
            stampPng: data.stampPng,
            photoUrl: data.photoUrl ?? "",   // ⬅️ guarda también el vacío para “Quitar”
            // ...(data.photoUrl ? { photoUrl: data.photoUrl } : {}),
        });

        // 2) (opcional) persistir email/phone en el usuario autenticado
        if (userRecord) {
            userRecord.email = data.email || userRecord.email;
            userRecord.phone = data.phone || userRecord.phone;
            // “refrescamos” sesión para que currentUser conserve email actualizado
            login({
                user: {
                    id: currentUser!.id,
                    name: data.name || currentUser!.name,
                    role: currentUser!.role,
                    email: data.email || currentUser!.email,
                },
            });
        }

        toast.success("Perfil actualizado");
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            <header className="border-b border-slate-400 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    {/* ⬇️ Botón que abre el sheet */}
                    <DoctorSideSheet />
                    <LogoTitle
                        title="Editar Perfil"
                        description="Seccion para editar el perfil de Usuario"
                    />
                </div>
            </header>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Editar perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Perfil / Avatar */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-3 border-blue-400 ">
                            <AvatarImage className="object-cover " src={form.watch("photoUrl")} />
                            <AvatarFallback className="font-semibold">
                                {(currentUser?.name ?? "U").split(" ").map(s => s[0]).slice(0, 2).join("")}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                disabled={uploading === "avatar"}
                                onClick={async () => {
                                    const input = document.createElement("input");
                                    input.type = "file";
                                    input.accept = "image/*";
                                    input.onchange = async () => {
                                        const f = input.files?.[0]; if (!f) return;
                                        try {
                                            setUploading("avatar");
                                            const url = await fileToDataURL(f);
                                            form.setValue("photoUrl", url, { shouldDirty: true });
                                        } finally {
                                            setUploading(null);
                                        }
                                    };
                                    input.click();
                                }}
                            >
                                <Upload className="w-4 h-4" /> Cambiar foto
                            </Button>

                            {form.watch("photoUrl") && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => form.setValue("photoUrl", "", { shouldDirty: true })}
                                >
                                    <Trash2 className="w-4 h-4 mr-1" /> Quitar
                                </Button>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <div className="space-y-2">
                            <Label>Nombre y apellido</Label>
                            <Input {...form.register("name")} placeholder="Dra./Dr. Nombre Apellido" />
                            {form.formState.errors.name && (
                                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Licencia / Matrícula</Label>
                            <Input {...form.register("license")} placeholder="MP / MN / Colegio" />
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" {...form.register("email")} placeholder="profesional@ejemplo.com" />
                            {form.formState.errors.email && (
                                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input {...form.register("phone")} placeholder="+54 9 ..." />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label>Bio / Notas</Label>
                            <Textarea rows={3} {...form.register("bio")} placeholder="Especialidad, intereses, horarios, etc." />
                        </div>

                        <Separator className="md:col-span-2" />

                        {/* Firma y sello */}
                        <div className="space-y-2">
                            <Label>Firma (PNG sin fondo)</Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="gap-2"
                                    disabled={uploading === "signature"}
                                    onClick={async () => {
                                        const input = document.createElement("input");
                                        input.type = "file";
                                        input.accept = "image/png,image/*";
                                        input.onchange = async () => {
                                            const f = input.files?.[0]; if (!f) return;
                                            try {
                                                setUploading("signature");
                                                const url = await fileToDataURL(f);
                                                form.setValue("signaturePng", url, { shouldDirty: true });
                                            } finally { setUploading(null); }
                                        };
                                        input.click();
                                    }}
                                >
                                    <Upload className="w-4 h-4" /> Subir firma
                                </Button>
                                {form.watch("signaturePng") && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => form.setValue("signaturePng", "", { shouldDirty: true })}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" /> Quitar
                                    </Button>
                                )}
                            </div>
                            {form.watch("signaturePng") && (
                                <img
                                    src={form.watch("signaturePng")!}
                                    alt="firma"
                                    className="max-h-28 rounded-md border p-2 bg-white"
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Sello (PNG sin fondo)</Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="gap-2"
                                    disabled={uploading === "stamp"}
                                    onClick={async () => {
                                        const input = document.createElement("input");
                                        input.type = "file";
                                        input.accept = "image/png,image/*";
                                        input.onchange = async () => {
                                            const f = input.files?.[0]; if (!f) return;
                                            try {
                                                setUploading("stamp");
                                                const url = await fileToDataURL(f);
                                                form.setValue("stampPng", url, { shouldDirty: true });
                                            } finally { setUploading(null); }
                                        };
                                        input.click();
                                    }}
                                >
                                    <Upload className="w-4 h-4" /> Subir sello
                                </Button>
                                {form.watch("stampPng") && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => form.setValue("stampPng", "", { shouldDirty: true })}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" /> Quitar
                                    </Button>
                                )}
                            </div>
                            {form.watch("stampPng") && (
                                <img
                                    src={form.watch("stampPng")!}
                                    alt="sello"
                                    className="max-h-28 rounded-md border p-2 bg-white"
                                />
                            )}
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Deshacer
                            </Button>
                            <Button type="submit">Guardar</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
