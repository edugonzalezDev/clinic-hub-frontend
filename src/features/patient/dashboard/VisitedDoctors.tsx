// src/components/dashboard/VisitedDoctors.tsx
import React from "react";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  date: string;
  mode: "Presencial" | "Telemedicina";
  avatar: string;
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Mick Thompson",
    specialty: "Cardiología",
    date: "5/6/2025",
    mode: "Presencial",
    avatar: "https://i.pravatar.cc/60?img=12",
  },
  {
    id: 2,
    name: "Dra. Emily Carter",
    specialty: "Pediatría",
    date: "9/9/2025",
    mode: "Telemedicina",
    avatar: "https://i.pravatar.cc/60?img=47",
  },
  {
    id: 3,
    name: "Dr. David Lee",
    specialty: "Ginecología",
    date: "1/10/2025",
    mode: "Presencial",
    avatar: "https://i.pravatar.cc/60?img=33",
  },
];

// Componente para el avatar con punto de estado
const DoctorAvatar: React.FC<{
  src: string;
  alt: string;
  mode: Doctor["mode"];
}> = ({ src, alt, mode }) => {
  const isOnline = mode === "Telemedicina";

  return (
    <div className="relative">
      {/* Imagen del doctor */}
      <img
        src={src}
        alt={alt}
        className="w-12 h-12 rounded-full object-cover"
        // Estilo de sombra para simular el relieve del avatar si es necesario
        style={{ filter: "grayscale(10%)" }}
      />
      {/* Punto de estado - siempre verde en la imagen */}
      <div
        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          isOnline ? "bg-green-500" : "bg-green-500"
        }`}
      ></div>
    </div>
  );
};

const VisitedDoctors: React.FC = () => {
  return (
    <section
      aria-labelledby="visited-doctors-list"
      // La sección principal es blanca, pero usamos un contenedor para el fondo verde claro
      className="bg-white rounded-xl shadow-sm border border-gray-100"
    >
      {/* Cabecera con fondo verde claro */}
      <div className="flex justify-between items-center px-5 py-4 rounded-t-xl bg-green-50/70 border-b border-green-100/50">
        <h2
          id="visited-doctors-list"
          className="text-xl font-semibold text-gray-800"
        >
          Doctores visitados
        </h2>

        {/* Selector "Último año" */}
        <select
          className="border border-gray-300 rounded-lg text-sm px-3 py-1 bg-white appearance-none cursor-pointer focus:ring-1 focus:ring-green-500"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.5rem center",
            backgroundSize: "1em",
          }}
        >
          <option>Último año</option>
          <option>Últimos 6 meses</option>
          <option>Último mes</option>
        </select>
      </div>

      {/* Lista de doctores */}
      <div className="p-4 space-y-4">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            // Tarjeta individual con borde y sombra sutil
            className="p-4 border border-gray-200 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-start">
              {/* Contenido Izquierdo: Avatar y Nombre/Especialidad */}
              <div className="flex items-start gap-4">
                <DoctorAvatar src={doc.avatar} alt={doc.name} mode={doc.mode} />

                <div className="mt-1">
                  <p className="text-lg font-semibold text-gray-800 leading-tight">
                    {doc.name}
                  </p>
                  <p className="text-base text-gray-500 leading-tight">
                    {doc.specialty}
                  </p>
                </div>
              </div>

              {/* Contenido Derecho: Fecha y Modo */}
              <div className="text-right pt-1">
                <p className="text-base font-semibold text-gray-800 mb-1">
                  {doc.date}
                </p>
                <p
                  className={`text-sm font-medium ${
                    doc.mode === "Telemedicina"
                      ? "text-gray-500" // El color del modo en la imagen es gris, no azul/verde
                      : "text-gray-500"
                  }`}
                >
                  {doc.mode}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VisitedDoctors;
