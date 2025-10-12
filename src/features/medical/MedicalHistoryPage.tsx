import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Activity, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAppStore from "@/store/appStore";
import { PatientHeader } from "./components/PatientHeader";
import { ConsultationsList } from "./components/ConsultationsList";
import { MedicationsList } from "./components/MedicationsList";
import { LabsList } from "./components/LabsList";
import { VitalsList } from "./components/VitalsList";
import PatientPrescriptionsTab from "../patients/tabs/PatientPrescriptionsTab";
import PatientCertificatesTab from "../patients/tabs/PatientCertificatesTab";


function fdate(iso: string) {
    try {
        return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));
    } catch { return iso; }
}

export default function MedicalHistoryPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { patients, doctors, clinicalRecords } = useAppStore();

    const patient = useMemo(() => patients.find(p => p.id === id), [patients, id]);
    const record = clinicalRecords[id ?? ""];

    if (!id || !patient) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <Card className="p-6 max-w-md text-center">
                    <h2 className="text-xl font-semibold mb-2">Paciente no encontrado</h2>
                    <p className="text-muted-foreground mb-4">Verificá el enlace o intenta nuevamente.</p>
                    <Button onClick={() => navigate(-1)} variant="outline">Volver</Button>
                </Card>
            </div>
        );
    }

    const withDoctorName = (doctorId?: string) => doctors.find(d => d.id === doctorId)?.name || "Profesional";

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Volver
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 my-gradient-class rounded-xl flex items-center justify-center">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold">Historia clínica</h1>
                                <p className="text-sm text-muted-foreground">Registros completos del paciente</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-6">
                <PatientHeader
                    name={patient.name}
                    docId={patient.docId}
                    phone={patient.phone}
                    lastUpdated={
                        record
                            ? fdate(
                                [
                                    ...record.consultations.map(c => c.dateISO),
                                    ...record.labs.map(l => l.dateISO),
                                    ...record.vitals.map(v => v.dateISO),
                                ].sort().slice(-1)[0] ?? new Date().toISOString()
                            )
                            : "—"
                    }
                />

                <Tabs defaultValue="consultations" className="space-y-6">
                    <TabsList className="grid w-full h-auto grid-cols-3 gap-2 md:grid-cols-6 md:gap-2 ">
                        <TabsTrigger value="consultations">Consultas</TabsTrigger>
                        <TabsTrigger value="medications">Medicación</TabsTrigger>
                        <TabsTrigger value="labs">Laboratorio</TabsTrigger>
                        <TabsTrigger value="vitals">Signos vitales</TabsTrigger>

                        <TabsTrigger value="reset">Recetas</TabsTrigger>
                        <TabsTrigger value="certificate">Certificados</TabsTrigger>
                    </TabsList>

                    <TabsContent value="consultations">
                        <ConsultationsList
                            items={record?.consultations ?? []}
                            resolveDoctorName={withDoctorName}
                        />
                    </TabsContent>

                    {/* <TabsContent value="medications">
                        <MedicationsList items={record?.medications ?? []} />
                    </TabsContent> */}
                    <TabsContent value="medications">
                        <div className="flex justify-end mb-3">
                            <Button variant="outline" size="sm"
                                onClick={() => navigate(`/doctor/medications/new?patientId=${patient.id}`)}>
                                <Plus className="w-4 h-4 mr-1" /> Nuevo medicamento
                            </Button>
                        </div>
                        <MedicationsList items={record?.medications ?? []} />
                    </TabsContent>

                    {/* <TabsContent value="labs">
                        <LabsList items={record?.labs ?? []} />
                    </TabsContent> */}
                    <TabsContent value="labs">
                        <div className="flex justify-end mb-3">
                            <Button variant="outline" size="sm"
                                onClick={() => navigate(`/doctor/labs/new?patientId=${patient.id}`)}>
                                <Plus className="w-4 h-4 mr-1" /> Nuevo estudio
                            </Button>
                        </div>
                        <LabsList items={record?.labs ?? []} />
                    </TabsContent>

                    {/* <TabsContent value="vitals">
                        <VitalsList items={record?.vitals ?? []} />
                    </TabsContent> */}
                    <TabsContent value="vitals">
                        <div className="flex justify-end mb-3">
                            <Button variant="outline" size="sm"
                                onClick={() => navigate(`/doctor/vitals/new?patientId=${patient.id}`)}>
                                <Plus className="w-4 h-4 mr-1" /> Nuevo registro
                            </Button>
                        </div>
                        <VitalsList items={record?.vitals ?? []} />
                    </TabsContent>

                    <TabsContent value="reset">
                        <PatientPrescriptionsTab patientId={patient.id} />
                    </TabsContent>
                    <TabsContent value="certificate">
                        <PatientCertificatesTab patientId={patient.id} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
