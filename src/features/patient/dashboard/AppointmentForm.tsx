import React, { useState, useEffect } from "react";
import {
  getClinics,
  getDoctors,
  postAppointment,
} from "../services/patientService";
import { usePatientStore } from "../store/usePatientStore";

interface AppointmentFormData {
  specialty: string;
  doctor: string;
  date: string;
  time: string;
  mode: string;
  clinic: string;
}

interface Clinic {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  name: string;
}

const AppointmentForm: React.FC = () => {
  const { patient } = usePatientStore(); // Obtener el estado del paciente desde el store

  const [form, setForm] = useState<AppointmentFormData>({
    specialty: "",
    doctor: "",
    date: "",
    time: "",
    mode: "Presencial",
    clinic: "",
  });

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Llamada para obtener las clínicas al montar el componente
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const clinicsData = await getClinics();
        const formattedClinics = clinicsData.map((clinic) => ({
          id: clinic.id,
          name: clinic.name,
        }));
        setClinics(formattedClinics);
      } catch (error) {
        console.error("Error al obtener las clínicas:", error);
      }
    };
    fetchClinics();
  }, []);

  // Llamada para obtener los doctores cuando se seleccionan clínica y especialidad
  useEffect(() => {
    const fetchDoctors = async () => {
      if (form.clinic && form.specialty) {
        try {
          const doctorsData = await getDoctors(form.clinic, form.specialty);
          setDoctors(doctorsData);
        } catch (error) {
          console.error("Error al obtener los doctores:", error);
        }
      }
    };
    fetchDoctors();
  }, [form.clinic, form.specialty]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar si patient_id está disponible
    if (!patient?.id) {
      alert("Error: El paciente no está autenticado.");
      return;
    }

    const startsAt = new Date(`${form.date}T${form.time}:00`).toISOString();
    const endsAt = new Date(
      new Date(startsAt).getTime() + 59 * 60 * 1000 // Duración de 59 minutos
    ).toISOString();

    // Asegurarnos que "type" sea uno de los valores permitidos
    const type: "presencial" | "virtual" =
      form.mode === "Presencial" ? "presencial" : "virtual";
    const status = "pending" as const;

    const appointmentData = {
      patient_id: patient.id, // Usar patient.id, asegurado que no sea undefined
      doctor_id: form.doctor,
      clinic_id: form.clinic,
      starts_at: startsAt,
      ends_at: endsAt,
      type: type, // Ahora es un tipo "presencial" o "virtual"
      status: status, // Estado inicial
    };

    try {
      await postAppointment(appointmentData);
      alert("✅ Cita médica confirmada");
    } catch (error) {
      console.error("Error al agendar la cita", error);
    }
  };

  // Generar horas de 08:00 a 20:00
  const hours = Array.from({ length: 13 }, (_, i) => {
    const hour = (8 + i).toString().padStart(2, "0");
    return `${hour}:00`;
  });

  // Obtener la fecha actual para limitar el calendario
  const currentDate = new Date().toISOString().split("T")[0]; // Formato "YYYY-MM-DD"

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
        {/* Clínica */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Clínica
          </label>
          <select
            name="clinic"
            value={form.clinic}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm text-gray-700"
          >
            <option value="">Seleccione una Clínica</option>
            {clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name}
              </option>
            ))}
          </select>
        </div>

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
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
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
            min={currentDate} // Establece la fecha mínima
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
