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
// 1. DATOS Y CONFIGURACIÓN
// ----------------------------------------------------------------------

// Datos de las tarjetas de resumen
const summaryData = [
  { label: "Todas", count: 63, color: "text-indigo-600", dot: "bg-indigo-600" },
  { label: "Canceladas", count: 45, color: "text-red-500", dot: "bg-red-500" },
  { label: "Agendadas", count: 74, color: "text-pink-500", dot: "bg-pink-500" },
  {
    label: "Completadas",
    count: 45,
    color: "text-teal-600",
    dot: "bg-teal-600",
  },
];

// Datos del gráfico de barras apiladas
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
    // Cardiología (Verde/Cian claro en la imagen)
    {
      label: "Cardiología",
      data: [15, 15, 20, 18, 15, 9, 15, 12, 18, 15, 14, 17],
      backgroundColor: "#10b981", // Emerald 500
    },
    // Medicina General (Verde brillante en la imagen)
    {
      label: "Medicina General",
      data: [2, 7, 5, 5, 8, 5, 5, 7, 15, 14, 6, 0],
      backgroundColor: "#22d3ee", // Cyan 500
    },
    // Quiropráctico (Morado/Índigo oscuro en la imagen)
    {
      label: "Quiropráctico",
      data: [5, 1, 9, 11, 20, 4, 3, 8, 13, 13, 7, 8],
      backgroundColor: "#4f46e5", // Indigo 600
    },
  ],
};

// Opciones del gráfico con corrección de tipado para 'position'
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
      // ✅ Corrección de tipado usando 'as const'
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

const VisitHistoryChart = () => (
  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
    {/* Cabecera del Historial */}

    {/* Tarjetas de Resumen */}
    <div className="grid grid-cols-4 gap-4 mb-6">
      {summaryData.map((summary, index) => (
        <div
          key={index}
          className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center"
        >
          <div className="flex items-center justify-center space-x-1 mb-1">
            <div className={`w-2 h-2 rounded-full ${summary.dot}`}></div>
            <p className="text-sm font-medium text-gray-700">{summary.label}</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{summary.count}</p>
        </div>
      ))}
    </div>

    {/* Contenedor del Gráfico */}
    <div style={{ height: "350px" }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  </div>
);

export default VisitHistoryChart;
