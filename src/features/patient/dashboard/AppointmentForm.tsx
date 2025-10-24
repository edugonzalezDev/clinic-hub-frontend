import React, { useState } from "react";

interface AppointmentFormData {
  specialty: string;
  doctor: string;
  date: string;
  time: string;
  mode: string;
}

const AppointmentForm: React.FC = () => {
  const [form, setForm] = useState<AppointmentFormData>({
    specialty: "",
    doctor: "",
    date: "",
    time: "",
    mode: "Presencial",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cita confirmada:", form);
    alert("✅ Cita médica confirmada");
  };

  // Generar horas de 08:00 a 20:00
  const hours = Array.from({ length: 13 }, (_, i) => {
    const hour = (8 + i).toString().padStart(2, "0");
    return `${hour}:00`;
  });

  return (
    <section
      aria-labelledby="appointment-form"
      className="bg-white p-6 rounded-2xl shadow-sm"
    >
      <h2
        id="appointment-form"
        className="text-lg font-semibold text-gray-800 mb-4"
      >
        Agendar Cita
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end"
      >
        {/* Especialidad */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Especialidad
          </label>
          <select
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm text-gray-700"
          >
            <option value="">Seleccione una Especialidad</option>
            <option value="Cardiología">Cardiología</option>
            <option value="Medicina General">Medicina General</option>
            <option value="Dermatología">Dermatología</option>
            <option value="Pediatría">Pediatría</option>
          </select>
        </div>

        {/* Médico */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Médico
          </label>
          <select
            name="doctor"
            value={form.doctor}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm text-gray-700"
          >
            <option value="">Seleccione un Médico</option>
            <option value="Dra. Luisa Martínez">Dra. Luisa Martínez</option>
            <option value="Dr. Luis Rodríguez">Dr. Luis Rodríguez</option>
            <option value="Dra. Ana López">Dra. Ana López</option>
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Fecha
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm text-gray-700"
          />
        </div>

        {/* Hora (Select) */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Hora
          </label>
          <select
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm text-gray-700"
          >
            <option value="">Seleccione una Hora</option>
            {hours.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        </div>

        {/* Modo de atención */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Modo de Atención
          </label>
          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm text-gray-700"
          >
            <option value="Presencial">Presencial</option>
            <option value="Telemedicina">Teleconsulta</option>
          </select>
        </div>

        {/* Botón */}
        <div className="col-span-full mt-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition"
          >
            Confirmar Cita Médica
          </button>
        </div>
      </form>
    </section>
  );
};

export default AppointmentForm;
