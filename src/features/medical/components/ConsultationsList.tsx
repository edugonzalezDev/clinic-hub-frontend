import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import type { Consultation } from "@/store/appStore";

const fdate = (iso: string) =>
    new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));

export function ConsultationsList({
    items, resolveDoctorName,
}: { items: Consultation[]; resolveDoctorName: (doctorId?: string) => string }) {
    if (!items.length) {
        return <p className="text-sm text-muted-foreground">No hay consultas registradas.</p>;
    }

    return (
        <div className="space-y-4">
            {items.map(c => (
                <Card key={c.id} className="shadow-md">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    {resolveDoctorName(c.doctorId)}
                                </CardTitle>
                                <CardDescription>{c.specialty} • {fdate(c.dateISO)}</CardDescription>
                            </div>
                            <Badge variant="outline">{c.specialty}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <h4 className="font-semibold text-sm mb-1">Diagnóstico</h4>
                            <p className="text-sm text-muted-foreground">{c.diagnosis}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-1">Notas</h4>
                            <p className="text-sm text-muted-foreground">{c.notes}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
