import React from "react";
import VitalSignsCard from "./VitalSignsCard";

export interface VitalSign {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  status?: "Normal" | "Elevada" | "Baja" | string;
  icon?: string; // opcional si quieres usar un icono por signo
}

const dummy: VitalSign[] = [
  { id: "peso", label: "Peso", value: 90, unit: "kg", status: "Normal" },
  { id: "altura", label: "Altura", value: 154, unit: "cm", status: "Normal" },
  { id: "imc", label: "IMC", value: 19.2, unit: "kg/m²", status: "Normal" },
  {
    id: "pa",
    label: "Presión Arterial",
    value: "120/95",
    unit: "mmHg",
    status: "Elevada",
  },
  { id: "ox", label: "Oxígeno", value: 98, unit: "%", status: "Normal" },
  { id: "temp", label: "Temperatura", value: 36, unit: "°C", status: "Normal" },
];

const LatestCheckup: React.FC<{ date?: string; signs?: VitalSign[] }> = ({
  date = "05/06/2025",
  signs = dummy,
}) => {
  return (
    <section
      aria-labelledby="vital-signs"
      className="bg-white p-6 rounded-2xl shadow-sm "
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id="vital-signs" className="text-lg font-semibold text-gray-800">
          Último Chequeo: <time className="font-normal">{date}</time>
        </h2>
        {/* botones u opciones si quieres */}
        <div className="flex items-center gap-2"></div>
      </div>

      <div className="flex flex-wrap gap-4  ">
        {signs.map((s) => (
          <VitalSignsCard key={s.id} sign={s} />
        ))}
      </div>
    </section>
  );
};

export default LatestCheckup;
