import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAppStore from "@/store/appStore";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { isSameYear, parseISO } from "date-fns";

const monthLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function ConsultationsByMonthLine() {
    const { clinicalRecords, patients, currentClinicId } = useAppStore();
    const year = new Date().getFullYear();

    const dataCounts = useMemo(() => {
        const counts = Array<number>(12).fill(0);

        // pacientes a considerar según clínica activa (si no hay, usar todos)
        const patientIds = Object.keys(clinicalRecords).filter(pid => {
            if (!currentClinicId) return true;
            const p = patients.find(pp => pp.id === pid);
            return (p?.clinicIds ?? []).includes(currentClinicId);
        });

        for (const pid of patientIds) {
            const rec = clinicalRecords[pid];
            for (const c of rec?.consultations ?? []) {
                const d = parseISO(c.dateISO);
                if (isSameYear(d, new Date(year, 0, 1))) {
                    counts[d.getMonth()] += 1;
                }
            }
        }
        return counts;
    }, [clinicalRecords, patients, currentClinicId, year]);

    const chart = {
        labels: monthLabels,
        datasets: [
            {
                label: `Consultas ${year}`,
                data: dataCounts,
                fill: true,
                tension: 0.35,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } },
        },
    } as const;

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Consultas por mes</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
                <Line data={chart} options={options} />
            </CardContent>
        </Card>
    );
}
