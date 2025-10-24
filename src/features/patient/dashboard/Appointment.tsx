import React from "react";

const AppointmentsDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna Izquierda */}
      <div className="lg:col-span-2 space-y-6">
        {/* Agendar Cita Rápida */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🩺</span> Agendar Nueva Cita
          </h3>
          <form id="quickAppointmentForm" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidad
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Seleccionar especialidad</option>
                  <option value="cardiologia">Cardiología</option>
                  <option value="dermatologia">Dermatología</option>
                  <option value="medicina-general">Medicina General</option>
                  <option value="pediatria">Pediatría</option>
                  <option value="ginecologia">Ginecología</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Médico
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Seleccionar médico</option>
                  <option value="dr-martinez">Dr. Carlos Martínez</option>
                  <option value="dra-lopez">Dra. Ana López</option>
                  <option value="dr-rodriguez">Dr. Luis Rodríguez</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="2025-10-17"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Seleccionar hora</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Consulta
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="consultType"
                    value="presencial"
                    className="mr-2 text-blue-600"
                  />
                  <span>🏥 Presencial</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="consultType"
                    value="virtual"
                    className="mr-2 text-blue-600"
                  />
                  <span>💻 Virtual</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Agendar Cita
            </button>
          </form>
        </div>

        {/* Mis Citas */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="mr-2">📋</span> Mis Citas
            </h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                Todas
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                Próximas
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                Completadas
              </button>
            </div>
          </div>

          {/* Lista de Citas */}
          <div className="space-y-4">
            {/* Próxima */}
            <AppointmentCard
              status="Próxima"
              type="💻 Virtual"
              doctor="Dr. Carlos Martínez - Cardiología"
              date="15 de Enero, 2024 - 10:00 AM"
              note="Control rutinario"
              color="blue"
            />

            {/* Completada */}
            <AppointmentCard
              status="Completada"
              type="🏥 Presencial"
              doctor="Dra. Ana López - Dermatología"
              date="8 de Enero, 2024 - 2:00 PM"
              note="Revisión lunar"
              color="green"
            />

            {/* Cancelada */}
            <AppointmentCard
              status="Cancelada"
              type="🏥 Presencial"
              doctor="Dr. Luis Rodríguez - Medicina General"
              date="5 de Enero, 2024 - 9:00 AM"
              note="Cancelada por el paciente"
              color="red"
            />
          </div>
        </div>
      </div>

      {/* Columna Derecha */}
      <div className="space-y-6">
        {/* Recordatorios */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">⏰</span> Recordatorios
          </h3>
          <div className="space-y-3">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
              <p className="text-sm font-medium text-yellow-800">Cita mañana</p>
              <p className="text-xs text-yellow-700">Dr. Martínez - 10:00 AM</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
              <p className="text-sm font-medium text-blue-800">
                Tomar medicamento
              </p>
              <p className="text-xs text-blue-700">Aspirina - Cada 8 horas</p>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🔔</span> Notificaciones
          </h3>
          <div className="space-y-3">
            <NotificationCard
              icon="ℹ️"
              color="blue"
              title="Cita confirmada"
              text="Tu cita con Dr. Martínez ha sido confirmada"
              time="Hace 2 horas"
            />
            <NotificationCard
              icon="✅"
              color="green"
              title="Resultados disponibles"
              text="Los resultados de tu examen están listos"
              time="Ayer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// 📋 Subcomponente para Citas
interface AppointmentCardProps {
  status: string;
  type: string;
  doctor: string;
  date: string;
  note: string;
  color: "blue" | "green" | "red";
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  status,
  type,
  doctor,
  date,
  note,
  color,
}) => {
  const bg = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
  }[color];

  const label = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
  }[color];

  return (
    <div className={`appointment-item border rounded-lg p-4 ${bg}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full mr-2 ${label}`}
            >
              {status}
            </span>
            <span className="text-sm text-gray-600">{type}</span>
          </div>
          <h4 className="font-semibold text-gray-900">{doctor}</h4>
          <p className="text-sm text-gray-600">📅 {date}</p>
          <p className="text-sm text-gray-500 mt-1">{note}</p>
        </div>
      </div>
    </div>
  );
};

// 🔔 Subcomponente para Notificaciones
interface NotificationCardProps {
  icon: string;
  color: "blue" | "green";
  title: string;
  text: string;
  time: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  icon,
  color,
  title,
  text,
  time,
}) => {
  const colorMap = {
    blue: "text-blue-500",
    green: "text-green-500",
  }[color];

  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <span className={colorMap}>{icon}</span>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">{text}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
};

export default AppointmentsDashboard;
