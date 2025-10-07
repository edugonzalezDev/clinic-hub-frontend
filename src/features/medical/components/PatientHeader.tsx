import { Card, CardContent } from "@/components/ui/card";

export function PatientHeader({
    name, docId, phone, lastUpdated,
}: { name: string; docId?: string; phone?: string; lastUpdated?: string }) {
    return (
        <Card className="shadow-md">
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-semibold">{name}</h2>
                        <p className="text-sm text-muted-foreground">
                            {docId ? `Documento: ${docId}` : "Documento: —"}
                            {phone ? ` • Tel: ${phone}` : ""}
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Última actualización: {lastUpdated ?? "—"}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
