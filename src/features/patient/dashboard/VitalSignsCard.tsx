import React from "react";

export interface VitalSign {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  status?: "Normal" | "Elevada" | "Baja" | string;
  icon?: string; // opcional si quieres usar un icono por signo
}

const VitalSignsCard: React.FC<{ sign: VitalSign }> = ({ sign }) => {
  return (
    <div className="min-w-[164px] flex-1 border-2 border-gray-100 bg-white rounded-2xl p-4 flex flex-col items-center shadow-sm hover:shadow-md transition">
      {/* Icono circular */}
      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
        <span className="text-indigo-600 text-lg">⚖️</span>
      </div>

      {/* Label */}
      <div className="text-sm text-gray-600">{sign.label}</div>

      {/* Valor y unidad */}
      <div className="mt-1 text-xl font-bold text-indigo-600">
        {sign.value}
        {sign.unit && (
          <span className="text-sm text-gray-400 ml-1">{sign.unit}</span>
        )}
      </div>

      {/* Estado */}
      <div
        className={`mt-2 text-xs font-medium px-4 py-1 rounded-full ${
          sign.status === "Elevada"
            ? "bg-orange-100 text-orange-700"
            : sign.status === "Baja"
            ? "bg-blue-100 text-blue-700"
            : "bg-indigo-100 text-indigo-700"
        }`}
      >
        {sign.status}
      </div>

      {/* Flecha */}
      <div className="mt-1 text-gray-400 text-xs">↗</div>
    </div>
  );
};

export default VitalSignsCard;
