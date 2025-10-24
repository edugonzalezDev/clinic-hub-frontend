import React from "react";
import { X } from "lucide-react";

interface ProfileSidebarProps {
  onClose: () => void;
  onEdit: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ onClose, onEdit }) => (
  <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto animate-slideIn">
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Mi Perfil</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-3 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 
            0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            ></path>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">María González</h3>
        <p className="text-sm text-gray-600">👤 Paciente</p>
        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
          Activo
        </span>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Información Personal</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">RUT:</span>
            <span className="font-medium">12.345.678-9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">maria.gonzalez@email.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Teléfono:</span>
            <span className="font-medium">+56 9 8765 4321</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fecha de Nacimiento:</span>
            <span className="font-medium">15/03/1985</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Previsión:</span>
            <span className="font-medium">FONASA</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onEdit}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          ✏️ Editar Información
        </button>

        <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
          🔒 Cambiar Contraseña
        </button>

        <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
          📋 Descargar Historial
        </button>

        <hr className="my-4" />

        <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium">
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
);

export default ProfileSidebar;
