import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAppStore from "@/store/appStore";
import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { isWithinInterval, subDays, parseISO } from "date-fns";
import type { TooltipItem } from "chart.js/auto";

export default function AppointmentsTypeDonut() {
    const { appointments, patients, currentClinicId } = useAppStore();

    const { virtualCount, presencialCount } = useMemo(() => {
        const since = subDays(new Date(), 30);
        let virt = 0, pres = 0;

        const belongsToActiveClinic = (a: { clinicId?: string; patientId: string }) => {
            if (!currentClinicId) return true;
            if (a.clinicId) return a.clinicId === currentClinicId;
            const p = patients.find(pt => pt.id === a.patientId);
            return (p?.clinicIds ?? []).includes(currentClinicId);
        };

        for (const a of appointments) {
            if (!belongsToActiveClinic(a)) continue;
            const start = parseISO(a.startsAt);
            if (!isWithinInterval(start, { start: since, end: new Date() })) continue;
            if (a.type === "virtual") virt++; else pres++;
        }
        return { virtualCount: virt, presencialCount: pres };
    }, [appointments, patients, currentClinicId]);

    const total = virtualCount + presencialCount;

    const chart = {
        labels: ["Teleconsulta", "Presencial"],
        datasets: [
            {
                data: [virtualCount, presencialCount],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" as const },
            tooltip: {
                callbacks: {
                    label: (ctx: TooltipItem<"doughnut">) => {
                        const v = ctx.parsed as number;
                        const pct = total ? Math.round((v / total) * 100) : 0;
                        return `${ctx.label}: ${v} (${pct}%)`;
                    }
                }
            }
        },
        cutout: "65%",
    } as const;

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Turnos por tipo (últimos 30 días)</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
                <Doughnut data={chart} options={options} />
            </CardContent>
        </Card>
    );
}
