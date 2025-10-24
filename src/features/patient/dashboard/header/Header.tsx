import React, { useState } from "react";
import {
  Bell,
  Info,
  CheckCircle,
  Clock,
  ClipboardList,
  ChevronDown,
} from "lucide-react";

import NotificationItem from "./NotificationItem";
import ProfileSidebar from "./ProfileSidebar";
import EditProfileModal from "./EditProfileModal";

const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center h-16 px-6 border-b bg-white shadow-sm relative">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-600">🏥 MediConnect</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Botón de notificaciones */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors relative"
            >
              <Bell className="text-blue-600 w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notificaciones
                  </h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Marcar todas como leídas
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <NotificationItem
                    icon={<Info className="text-blue-600 w-4 h-4" />}
                    title="Cita confirmada"
                    description="Tu cita con Dr. Carlos Martínez ha sido confirmada para mañana a las 10:00 AM"
                    time="Hace 2 horas"
                    bg="bg-blue-100"
                  />
                  <NotificationItem
                    icon={<CheckCircle className="text-green-600 w-4 h-4" />}
                    title="Resultados disponibles"
                    description="Los resultados de tu examen de sangre están listos para descargar"
                    time="Ayer"
                    bg="bg-green-100"
                  />
                  <NotificationItem
                    icon={<Clock className="text-yellow-600 w-4 h-4" />}
                    title="Recordatorio de medicamento"
                    description="Es hora de tomar tu medicamento: Aspirina 100mg"
                    time="Hace 3 horas"
                    bg="bg-yellow-100"
                  />
                  <NotificationItem
                    icon={<ClipboardList className="text-gray-600 w-4 h-4" />}
                    title="Cita completada"
                    description="Tu consulta con Dra. Ana López ha sido completada"
                    time="Hace 2 días"
                    bg="bg-gray-100"
                    read
                  />
                </div>

                <div className="p-4 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Perfil */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            <img
              className="h-8 w-8 rounded-full bg-blue-200"
              src="https://api.dicebear.com/7.x/initials/svg?seed=Maria%20Gonzalez&backgroundColor=bfdbfe"
              alt="Avatar"
            />
            <span className="text-gray-700 font-medium">María González</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </header>

      {showProfile && (
        <ProfileSidebar
          onClose={() => setShowProfile(false)}
          onEdit={() => setShowEditModal(true)}
        />
      )}
      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
    </>
  );
};

export default Header;
