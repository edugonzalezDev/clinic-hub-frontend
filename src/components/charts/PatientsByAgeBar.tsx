// src/components/charts/PatientsByAgeBar.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAppStore from "@/store/appStore";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import type { ChartOptions } from "chart.js";
import { differenceInYears, parseISO, isValid } from "date-fns";

// buckets: 0–12, 13–19, 20–34, 35–49, 50–64, 65+
const LABELS = ["0–12", "13–19", "20–34", "35–49", "50–64", "65+", "Descon."];
function bucketFor(age?: number) {
    if (age == null) return 6;
    if (age <= 12) return 0;
    if (age <= 19) return 1;
    if (age <= 34) return 2;
    if (age <= 49) return 3;
    if (age <= 64) return 4;
    return 5;
}

export default function PatientsByAgeBar() {
    const { patients, currentClinicId } = useAppStore();

    const counts = useMemo(() => {
        const arr = Array<number>(7).fill(0);
        const list = currentClinicId
            ? patients.filter(p => (p.clinicIds ?? []).includes(currentClinicId))
            : patients;

        for (const p of list) {
            // soporta p.birthDate o p.date_of_bird (según tu modelo actual)
            const raw = (p as any).birthDate ?? (p as any).date_of_bird;
            let age: number | undefined;
            if (raw) {
                const d = typeof raw === "string" ? parseISO(raw) : new Date(raw);
                if (isValid(d)) age = differenceInYears(new Date(), d);
            }
            arr[bucketFor(age)]++;
        }
        return arr;
    }, [patients, currentClinicId]);

    const data = {
        labels: LABELS,
        datasets: [{ label: "Pacientes", data: counts, borderWidth: 1 }],
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
        plugins: { legend: { display: false } },
    };

    return (
        <Card className="shadow-md">
            <CardHeader><CardTitle>Distribución por edad</CardTitle></CardHeader>
            <CardContent className="h-64">
                <Bar data={data} options={options} />
            </CardContent>
        </Card>
    );
}
