import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestTube } from "lucide-react";
import type { LabResult } from "@/store/appStore";

const fdate = (iso: string) =>
    new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));

export function LabsList({ items }: { items: LabResult[] }) {
    if (!items.length) {
        return <p className="text-sm text-muted-foreground">No hay resultados de laboratorio.</p>;
    }
    return (
        <div className="space-y-4">
            {items.map(lab => (
                <Card key={lab.id} className="shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center">
                                    <TestTube className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{lab.test}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{fdate(lab.dateISO)}</p>
                                    <Badge variant="outline" className="mt-2">{lab.result}</Badge>
                                </div>
                            </div>
                            <Badge variant={lab.status === "complete" ? "secondary" : "outline"}>
                                {lab.status === "complete" ? "Completado" : "Pendiente"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
