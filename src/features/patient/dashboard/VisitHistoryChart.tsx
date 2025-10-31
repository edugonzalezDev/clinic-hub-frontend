import { usePatientStore } from "../store/usePatientStore";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import type { ChartOptions, ChartData } from "chart.js";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// ----------------------------------------------------------------------
// 1. DATOS Y CONFIGURACIÓN DEL GRÁFICO
// ----------------------------------------------------------------------

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
      min: 0,
      max: 50,
      ticks: {
        stepSize: 10,
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  layout: {
    padding: {
      top: 10,
    },
  },
};

// ----------------------------------------------------------------------
// 2. COMPONENTE REACT
// ----------------------------------------------------------------------

const VisitHistoryChart = () => {
  // Usamos el store para obtener el historial de citas
  const { appointmentHistory } = usePatientStore((state) => state);

  // Verificamos si hay citas disponibles
  if (!appointmentHistory) {
    return <div>No hay citas disponibles.</div>;
  }

  // Filtramos y procesamos las citas para ajustarlas al formato del gráfico
  const chartData: ChartData<"bar"> = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Cardiología",
        data: Array(12).fill(0), // Inicializamos el array de 12 meses
        backgroundColor: "#10b981", // Emerald 500
      },
      {
        label: "Medicina General",
        data: Array(12).fill(0),
        backgroundColor: "#22d3ee", // Cyan 500
      },
      {
        label: "Quiropráctico",
        data: Array(12).fill(0),
        backgroundColor: "#4f46e5", // Indigo 600
      },
      {
        label: "Pediatría",
        data: Array(12).fill(0),
        backgroundColor: "#fbbf24", // Amarillo (para Pediatría)
      },
    ],
  };

  // Procesamos cada cita y asignamos su especialidad al mes correspondiente
  appointmentHistory.forEach((appointment) => {
    const month = new Date(appointment.starts_at).getMonth(); // Obtenemos el mes de la cita
    const specialty = appointment.specialty;

    // Aseguramos que los datos sean siempre de tipo número
    const updateDataset = (datasetIndex: number, monthIndex: number) => {
      const currentData = chartData.datasets[datasetIndex].data[monthIndex];
      if (typeof currentData === "number") {
        chartData.datasets[datasetIndex].data[monthIndex] = currentData + 1;
      }
    };

    // Asignamos la cita al mes correspondiente según la especialidad
    if (specialty === "Cardiologia") {
      updateDataset(0, month);
    } else if (specialty === "Medicina General") {
      updateDataset(1, month);
    } else if (specialty === "Quiropráctico") {
      updateDataset(2, month);
    } else if (specialty === "Pediatria") {
      updateDataset(3, month);
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Historial de Citas
        </h2>
      </div>

      <div style={{ height: "350px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default VisitHistoryChart;
