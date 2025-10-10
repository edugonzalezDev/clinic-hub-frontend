import { useState } from "react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  workDays: number[]; // 0=Dom, 1=Lun, ...
  startHour: number;
  endHour: number;
}

const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Pérez",
    specialty: "cardiologia",
    workDays: [1, 2, 3, 4, 5],
    startHour: 9,
    endHour: 17,
  },
  {
    id: "2",
    name: "Dra. González",
    specialty: "dermatologia",
    workDays: [2, 3, 4, 5, 6],
    startHour: 10,
    endHour: 18,
  },
  {
    id: "3",
    name: "Dr. Ramírez",
    specialty: "medicina-general",
    workDays: [1, 3, 5],
    startHour: 8,
    endHour: 14,
  },
];

const specialties = [
  { id: "cardiologia", name: "Cardiología" },
  { id: "medicina-general", name: "Medicina General" },
  { id: "dermatologia", name: "Dermatología" },
  { id: "neurologia", name: "Neurología" },
  { id: "pediatria", name: "Pediatría" },
];

const AppointmentScheduler = () => {
  const today = new Date();
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");

  const filteredDoctors = doctors.filter(
    (doc) => doc.specialty === selectedSpecialty
  );

  const getDaysInMonth = (month: number, year: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth, currentYear);

  const generateTimeSlots = (doctor: Doctor): string[] => {
    const slots: string[] = [];
    for (let h = doctor.startHour; h < doctor.endHour; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
      slots.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDoctor && selectedDate && selectedTime) {
      alert(
        `Cita agendada con ${
          selectedDoctor.name
        } el ${selectedDate.toLocaleDateString()} a las ${selectedTime}`
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Agendar Nueva Cita
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especialidad
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                setSelectedDoctor(null);
                setSelectedDate(null);
                setSelectedTime("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar especialidad</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor
            </label>
            <select
              value={selectedDoctor?.id || ""}
              onChange={(e) => {
                const doc =
                  doctors.find((d) => d.id === e.target.value) || null;
                setSelectedDoctor(doc);
                setSelectedDate(null);
                setSelectedTime("");
              }}
              disabled={!selectedSpecialty}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">Seleccionar doctor</option>
              {filteredDoctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calendar */}
        {selectedDoctor && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Selecciona una fecha disponible
            </label>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  {new Date(currentYear, currentMonth).toLocaleDateString(
                    "es-ES",
                    { month: "long", year: "numeric" }
                  )}
                </h4>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handlePreviousMonth}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm font-medium text-gray-600">
                <div>Dom</div>
                <div>Lun</div>
                <div>Mar</div>
                <div>Mié</div>
                <div>Jue</div>
                <div>Vie</div>
                <div>Sáb</div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const dayOfWeek = day.getDay();
                  const isAvailable =
                    selectedDoctor.workDays.includes(dayOfWeek);
                  const isSelected =
                    selectedDate?.toDateString() === day.toDateString();

                  const baseClasses =
                    "p-2 text-sm rounded-lg transition-colors duration-150";

                  const availableClasses = isSelected
                    ? "bg-blue-400 text-white cursor-default"
                    : "bg-white hover:bg-blue-100 hover:cursor-pointer";

                  const unavailableClasses = "bg-gray-200 cursor-not-allowed";

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => isAvailable && setSelectedDate(day)}
                      className={`${baseClasses} ${
                        isAvailable ? availableClasses : unavailableClasses
                      }`}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Time slots */}
        {selectedDoctor && selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horarios disponibles
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {generateTimeSlots(selectedDoctor).map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`px-2 py-1 rounded-lg text-sm border ${
                    selectedTime === time
                      ? "bg-blue-400 text-white border-2 "
                      : "bg-white hover:bg-blue-100 hover:border-blue-400 border-gray-300 hover:cursor-pointer"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Motivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo de la consulta
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe brevemente el motivo de tu consulta..."
          ></textarea>
        </div>

        {/* Botón */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!selectedDoctor || !selectedDate || !selectedTime}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Agendar Cita
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentScheduler;
