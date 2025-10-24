import React, { useEffect } from "react";
import Chart from "chart.js/auto";

const HealthCards: React.FC = () => {
  useEffect(() => {
    let vitalsChart: Chart | null = null;
    let medicationsChart: Chart | null = null;

    // Datos de salud con valores porcentuales
    const healthData = [
      { label: "Presión Arterial 120/80 mmHg", value: 95 },
      { label: "Frecuencia Cardíaca 95 bpm", value: 75 },
      { label: "Saturación O2 98%", value: 100 },
      { label: "Temperatura 36.5°C", value: 90 },
      { label: "IMC 31.2 kg/m²", value: 40 },
    ];

    // Determinar color de cada etiqueta según valor
    const labelColors = healthData.map((item) => {
      if (item.value >= 85) return "#22c55e"; // Bueno - verde
      if (item.value >= 60) return "#eab308"; // Precaución - amarillo
      return "#ef4444"; // Peligroso - rojo
    });

    const vitalsCtx = document.getElementById(
      "vitalsChart"
    ) as HTMLCanvasElement | null;
    const medicationsCtx = document.getElementById(
      "medicationsChart"
    ) as HTMLCanvasElement | null;

    // Destruir gráficos previos si existen
    Chart.getChart("vitalsChart")?.destroy();
    Chart.getChart("medicationsChart")?.destroy();

    // 🩺 Radar de Salud
    if (vitalsCtx) {
      vitalsChart = new Chart(vitalsCtx, {
        type: "radar",
        data: {
          labels: healthData.map((h) => h.label),
          datasets: [
            {
              label: "Estado de Salud",
              data: healthData.map((h) => h.value),
              backgroundColor: "rgba(34,197,94,0.15)",
              borderColor: "#22c55e",
              pointBackgroundColor: labelColors,
              pointRadius: 5,
              borderWidth: 2,
            },
          ],
        },
        options: {
          maintainAspectRatio: false, // 🔹 Hace que el canvas ocupe todo el contenedor
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { display: false },
              grid: { color: "#e5e7eb" },
              angleLines: { color: "#e5e7eb" },
              pointLabels: {
                callback: function (label: string, index: number) {
                  // Se pintan las etiquetas con su color correspondiente

                  return label
                    .split(" ")
                    .map((word) => `${word}`)
                    .join(" ");
                },
                font: { size: 11, weight: "bold" },
                color: (ctx) => labelColors[ctx.index],
              },
            },
          },
          plugins: {
            legend: { display: false },
          },
        },
      });
    }

    // 💊 Donut de Medicamentos
    if (medicationsCtx) {
      medicationsChart = new Chart(medicationsCtx, {
        type: "doughnut",
        data: {
          labels: ["Activos", "Suspendidos", "Completados"],
          datasets: [
            {
              data: [40, 10, 50],
              backgroundColor: ["#22c55e", "#eab308", "#9ca3af"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // 🔹 Asegura que el canvas use todo el alto del contenedor
          cutout: "70%",
          plugins: {
            legend: {
              position: "bottom",
              labels: { boxWidth: 14, font: { size: 12 } },
            },
          },
        },
      });
    }

    // Cleanup
    return () => {
      vitalsChart?.destroy();
      medicationsChart?.destroy();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* 🩺 Estado General de Salud */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-center">
          <span className="mr-2 text-xl">💓</span>
          Estado General de Salud
        </h3>
        <div className="w-full h-72 flex justify-center items-center">
          <canvas id="vitalsChart" className="w-full h-full"></canvas>
        </div>
        <div className="mt-5">
          <div className="flex justify-center space-x-5 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span className="text-gray-600">Bueno</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
              <span className="text-gray-600">Precaución</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span className="text-gray-600">Peligroso</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Valores basados en rangos médicos estándar
          </p>
        </div>
      </div>

      {/* 💊 Estado de Medicamentos */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-center">
          <span className="mr-2 text-xl">💊</span>
          Estado de Medicamentos
        </h3>
        <div className="w-full h-72 flex justify-center items-center">
          <canvas id="medicationsChart" className="w-full h-full"></canvas>
        </div>
      </div>
    </div>
  );
};

export default HealthCards;
