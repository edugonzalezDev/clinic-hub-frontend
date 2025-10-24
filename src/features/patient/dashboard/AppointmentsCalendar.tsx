import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"; // Necesitas lucide-react (o iconos SVG)

// Datos de las citas (adaptados de la imagen)
const appointments = [
  {
    name: "Dra. Luisa Martínez",
    specialty: "Cardiología",
    date: "5 de Octubre, 2025 - 10:00 AM",
    avatar: "avatar-luisa.png", // Reemplazar con URL o componente de imagen real
    bgColor: "bg-indigo-50",
  },
  {
    name: "Dr. Luis Rodríguez",
    specialty: "Medicina G.",
    date: "8 de Enero, 2025 - 2:00 PM",
    avatar: "avatar-luis.png",
    bgColor: "bg-gray-100",
  },
  {
    name: "Dra. Ana López",
    specialty: "Dermatología",
    date: "5 de Enero, 2025 - 2:00 PM",
    avatar: "avatar-ana.png",
    bgColor: "bg-teal-50",
  },
];

// Datos del calendario (para simular la estructura visual)
const calendarDays = [
  { day: 25, isInactive: true },
  { day: 26, isInactive: true },
  { day: 27, isInactive: true },
  { day: 28, isInactive: true },
  { day: 29, isInactive: true },
  { day: 30, isInactive: true },
  { day: 1, isInactive: true },
  { day: 2 },
  { day: 3 },
  { day: 17 },
  { day: 5, isSelected: true },
  { day: 6 },
  { day: 7 },
  { day: 8 },
  { day: 8 },
  { day: 9 },
  { day: 4 },
  { day: 11 },
  { day: 12 },
  { day: 13 },
  { day: 14 },
  { day: 15 },
  { day: 16 },
  { day: 10 },
  { day: 18 },
  { day: 19 },
  { day: 20 },
  { day: 21 },
  { day: 22 },
  { day: 23 },
  { day: 24 },
  { day: 25 },
  { day: 26 },
  { day: 27 },
  { day: 28 },
  { day: 29 },
  { day: 30 },
  { day: 31 },
  { day: 1, isInactive: true },
  { day: 2, isInactive: true },
  { day: 3, isInactive: true },
  { day: 4, isInactive: true },
];

const AppointmentsCalendar = () => (
  <Card>
    {/* Cabecera Principal */}
    <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800">
        Mis Citas Agendadas
      </h2>
      <button className="flex items-center text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-50 transition duration-150">
        Todas
        <ChevronLeft size={16} className="ml-1" />
      </button>
    </div>
    {/* Calendario */}
    <div className="p-4 bg-white">
      {/* Navegación del mes */}
      <div className="flex justify-between items-center mb-4">
        <button className="text-gray-500 hover:text-gray-700">
          <ChevronLeft size={20} />
        </button>
        <span className="text-lg font-medium text-gray-800">Octubre 2025</span>
        <button className="text-gray-500 hover:text-gray-700">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500">
        {["D", "L", "M", "M", "J", "V", "S"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Números de días */}
      <div className="grid grid-cols-7 text-center">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`flex justify-center items-center w-full aspect-square text-sm rounded-lg cursor-pointer transition duration-150 
              ${day.isInactive ? "text-gray-400" : "text-gray-800"}
              ${
                day.isSelected
                  ? "bg-indigo-600 text-white font-bold"
                  : day.day === 24
                  ? "border border-gray-300"
                  : "hover:bg-gray-100"
              }
            `}
          >
            {day.day}
          </div>
        ))}
      </div>
    </div>
    {/* Lista de Citas */}
    <div className="p-4 pt-0 space-y-3 min-w-[400px]">
      {appointments.map((appointment, i) => (
        <div
          key={i}
          className={`p-4 rounded-xl flex justify-between items-center border border-gray-200 ${appointment.bgColor}`}
        >
          {/* Detalles de la cita */}
          <div className="flex flex-col">
            {/* Nombre y Especialidad */}
            <p className="text-base font-semibold text-gray-800 mb-1">
              {appointment.name} – {appointment.specialty}
            </p>
            {/* Fecha y Hora */}
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2 text-gray-500" />
              <span>{appointment.date}</span>
            </div>
          </div>

          {/* Avatar */}
          <Avatar src={appointment.avatar} alt={appointment.name} />
        </div>
      ))}
    </div>
    {/* Botón Inferior */}
    <div className="p-4 pt-2">
      <button className="w-full py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition duration-150">
        Todas las Citas Agendadas
      </button>
    </div>
  </Card>
);

export default AppointmentsCalendar;
