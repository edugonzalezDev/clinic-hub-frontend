import React from "react";
import VitalSignsCard from "./VitalSignsCard";
import { usePatientStore } from "../store/usePatientStore";

const unitsMap: Record<string, string> = {
  Peso: "kg",
  Altura: "cm",
  IMC: "kg/m²",
  "Presion Arterial": "mmHg",
  Oxigeno: "%",
  Temperatura: "°C",
};

const LatestCheckup: React.FC<{ date?: string }> = ({
  date = "05/06/2025",
}) => {
  const { vitals } = usePatientStore(); // Accedemos al store para obtener los signos vitales

  if (!vitals || vitals.length === 0) {
    return (
      <section
        aria-labelledby="vital-signs"
        className="bg-white p-6 rounded-2xl shadow-sm "
      >
        <h2 id="vital-signs" className="text-lg font-semibold text-gray-800">
          Último Chequeo: <time className="font-normal">{date}</time>
        </h2>
        <p>No se encontraron signos vitales.</p>
      </section>
    );
  }

  // Ordenamos los signos vitales por la fecha en orden descendente
  const sortedVitals = vitals.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Obtenemos la fecha más reciente
  const lastCheckupDate = new Date(sortedVitals[0].date);

  // Convertir a la fecha local del dispositivo
  const lastCheckupLocalDate = lastCheckupDate.toLocaleDateString(); // Solo la fecha sin hora

  return (
    <section
      aria-labelledby="vital-signs"
      className="bg-white p-6 rounded-2xl shadow-sm "
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id="vital-signs" className="text-lg font-semibold text-gray-800">
          Último Chequeo:{" "}
          <time className="font-normal">{lastCheckupLocalDate}</time>
        </h2>
      </div>

      <div className="flex flex-wrap gap-4">
        {sortedVitals.map((s) => (
          <VitalSignsCard
            key={s.id}
            sign={{
              ...s,
              unit: unitsMap[s.metric], // Agregar la unidad correspondiente
              value: isNaN(Number(s.value)) ? s.value : Number(s.value), // Convertir el valor a número si es necesario
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default LatestCheckup;
