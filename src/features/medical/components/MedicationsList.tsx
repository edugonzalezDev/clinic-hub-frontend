import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill } from "lucide-react";
import type { Medication } from "@/store/appStore";

export function MedicationsList({ items }: { items: Medication[] }) {
    if (!items.length) {
        return <p className="text-sm text-muted-foreground">No hay medicación registrada.</p>;
    }
    const label = (s: Medication["status"]) =>
        s === "active" ? "Activa" : s === "completed" ? "Finalizada" : "Suspendida";

    return (
        <div className="space-y-4">
            {items.map(med => (
                <Card key={med.id} className="shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 rounded-xl  my-gradient-class flex items-center justify-center">
                                    <Pill className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{med.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {med.dosage} • {med.frequency}
                                    </p>
                                </div>
                            </div>
                            <Badge variant={med.status === "active" ? "secondary" : "outline"}>
                                {label(med.status)}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
