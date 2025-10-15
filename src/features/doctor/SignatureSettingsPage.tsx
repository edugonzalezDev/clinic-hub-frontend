import { useMemo, useState } from "react";
import useAppStore from "@/store/appStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Activity, ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router";
import DoctorSideSheet from "./components/DoctorSideSheet";
import LogoTitle from "./components/LogoTitle";

function fileToDataURL(f: File): Promise<string> {
    return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.onerror = rej;
        r.readAsDataURL(f);
    });
}

export default function SignatureSettingsPage() {
    const navigate = useNavigate();
    const {
        currentUser,
        doctors,
        currentDoctorId,
        updateDoctorProfile
    } = useAppStore();
    const me = doctors.find(d => d.id === currentDoctorId);
    const [sig, setSig] = useState<string | undefined>(me?.signaturePng);
    const [stamp, setStamp] = useState<string | undefined>(me?.stampPng);

    const doctorId = useMemo(() => {
        return (
            currentDoctorId ||
            doctors.find((d) => d.name === currentUser?.name)?.id ||
            doctors[0]?.id
        );
    }, [currentDoctorId, doctors, currentUser?.name]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <DoctorSideSheet />
                    <LogoTitle
                        title="Gestión de Firma y Sello"
                        description={`Profesional: ${doctors.find(d => d.id === doctorId)?.name ?? "—"}`}
                    />


                </div>
            </header>
            <div className="container mx-auto p-6">
                <h1 className="text-center font-bold text-2xl p-2 mb-5">Para certificados y recetas con su sello y firma virtual</h1>
                <Card>
                    <CardHeader><CardTitle>Firma y sello digital</CardTitle></CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="w-full h-auto space-y-2 flex flex-col justify-center items-center border-2 border-slate-300 rounded-md relative">
                            <Label htmlFor="file_firma" className="w-auto max-w-full text-xs md:text-[15px] xl:text-lg">Firma (PNG con fondo transparente)
                                <Upload />

                            </Label>
                            <input
                                type="file" id="file_firma" accept="image/png" className="w-auto max-w-full h-auto px-2 text-center text-xs md:text-[15px] xl:text-lg"
                                onChange={async (e) => {
                                    const f = e.target.files?.[0]; if (!f) return;
                                    const url = await fileToDataURL(f);
                                    setSig(url);
                                }}
                            ></input>
                            {sig && <img src={sig} alt="firma" className="h-24 object-contain border rounded" />}
                        </div>
                        <div className="space-y-2 flex flex-col justify-center items-center border-2 border-slate-300 rounded-md">
                            <Label htmlFor="file_sello" className="w-auto max-w-full text-xs md:text-[15px] xl:text-lg">Sello (PNG con fondo transparente)
                                <Upload />
                            </Label>
                            <input
                                type="file" id="file_sello" accept="image/png" className="w-auto max-w-full h-auto px-2 text-center text-xs md:text-[15px] xl:text-lg"
                                onChange={async (e) => {
                                    const f = e.target.files?.[0]; if (!f) return;
                                    const url = await fileToDataURL(f);
                                    setStamp(url);
                                }}
                            />
                            {stamp && <img src={stamp} alt="sello" className="h-24 object-contain border rounded" />}
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => { setSig(undefined); setStamp(undefined); }}>
                                Limpiar
                            </Button>
                            <Button onClick={() => updateDoctorProfile({ signaturePng: sig, stampPng: stamp })}>
                                Guardar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
