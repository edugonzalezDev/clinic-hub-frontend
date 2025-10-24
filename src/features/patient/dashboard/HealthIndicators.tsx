import React from "react";

interface Indicator {
  title: string;
  icon: string;
  color: string;
  value: string;
  description: string;
  note: string;
}

const indicators: Indicator[] = [
  {
    title: "Presión Arterial",
    icon: "📈",
    color: "text-green-600",
    value: "120/80",
    description: "mmHg - Normal",
    note: "↗ Última medición: Hoy",
  },
  {
    title: "Frecuencia Cardíaca",
    icon: "❤️",
    color: "text-yellow-600",
    value: "95",
    description: "bpm - Elevada",
    note: "⚠️ Requiere atención",
  },
  {
    title: "IMC",
    icon: "⚖️",
    color: "text-red-600",
    value: "31.2",
    description: "kg/m² - Obesidad",
    note: "🚨 Consultar médico",
  },
];

const HealthIndicators: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {indicators.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 transition-transform transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">{item.title}</h4>
            <span className={item.color}>{item.icon}</span>
          </div>

          <div className={`text-2xl font-bold ${item.color} mb-1`}>
            {item.value}
          </div>
          <div className="text-sm text-gray-600">{item.description}</div>
          <div className={`mt-2 text-xs ${item.color}`}>{item.note}</div>
        </div>
      ))}
    </div>
  );
};

export default HealthIndicators;
