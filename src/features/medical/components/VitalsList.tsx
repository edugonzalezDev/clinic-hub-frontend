import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import type { Vital } from "@/store/appStore";

const fdate = (iso: string) =>
    new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));

export function VitalsList({ items }: { items: Vital[] }) {
    if (!items.length) {
        return <p className="text-sm text-muted-foreground">No hay registros de signos vitales.</p>;
    }
    return (
        <div className="space-y-4">
            {items.map(v => (
                <Card key={v.id} className="shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 rounded-xl my-gradient-class flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{v.metric}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{fdate(v.dateISO)}</p>
                                    <p className="text-lg font-semibold text-primary mt-2">{v.value}</p>
                                </div>
                            </div>
                            <Badge variant="secondary">{v.status ?? "—"}</Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
