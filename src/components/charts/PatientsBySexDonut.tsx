import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAppStore from "@/store/appStore";
import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import type { ChartOptions } from "chart.js";

export default function PatientsBySexDonut() {
    const { patients, currentClinicId } = useAppStore();

    const { male, female, other, unknown, total } = useMemo(() => {
        let m = 0, f = 0, o = 0, u = 0;
        const list = currentClinicId
            ? patients.filter(p => (p.clinicIds ?? []).includes(currentClinicId))
            : patients;

        for (const p of list) {
            const sx = (p as any).sex?.toString().toLowerCase(); // por si aún no tipaste sex en Patient
            if (sx === "m" || sx === "male" || sx === "masculino") m++;
            else if (sx === "f" || sx === "female" || sx === "femenino") f++;
            else if (sx) o++;
            else u++;
        }
        return { male: m, female: f, other: o, unknown: u, total: m + f + o + u };
    }, [patients, currentClinicId]);

    const data = {
        labels: ["Masculino", "Femenino", "Otro", "Desconocido"],
        datasets: [{ data: [male, female, other, unknown], borderWidth: 1 }],
    };

    const options: ChartOptions<"doughnut"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const v = ctx.parsed as number;
                        const pct = total ? Math.round((v / total) * 100) : 0;
                        return `${ctx.label}: ${v} (${pct}%)`;
                    },
                },
            },
        },
        cutout: "65%",
    };

    return (
        <Card className="shadow-md">
            <CardHeader><CardTitle>Pacientes por sexo</CardTitle></CardHeader>
            <CardContent className="h-64">
                <Doughnut data={data} options={options} />
            </CardContent>
        </Card>
    );
}
