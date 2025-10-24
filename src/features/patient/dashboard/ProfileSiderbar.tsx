import { X, Pencil, Lock, ClipboardList, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Fondo semi-transparente */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mi Perfil</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Información del Usuario */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  María González
                </h3>
                <p className="text-sm text-gray-600">👤 Paciente</p>
                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                  Activo
                </span>
              </div>

              {/* Selector de Clínica */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clínica Actual
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="clinica-central">🏥 Clínica Central</option>
                  <option value="clinica-norte">🏥 Clínica Norte</option>
                  <option value="clinica-sur">🏥 Clínica Sur</option>
                  <option value="clinica-oriente">🏥 Clínica Oriente</option>
                </select>
              </div>

              {/* Información Básica */}
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Información Personal
                  </h4>
                  <div className="space-y-2 text-sm">
                    <InfoItem label="RUT" value="12.345.678-9" />
                    <InfoItem label="Email" value="maria.gonzalez@email.com" />
                    <InfoItem label="Teléfono" value="+56 9 8765 4321" />
                    <InfoItem label="Fecha de Nacimiento" value="15/03/1985" />
                    <InfoItem label="Previsión" value="FONASA" />
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="space-y-3">
                <ActionButton
                  color="blue"
                  icon={<Pencil className="w-4 h-4" />}
                  text="Editar Información"
                />
                <ActionButton
                  color="gray"
                  icon={<Lock className="w-4 h-4" />}
                  text="Cambiar Contraseña"
                />
                <ActionButton
                  color="gray"
                  icon={<ClipboardList className="w-4 h-4" />}
                  text="Descargar Historial"
                />
                <ActionButton
                  color="gray"
                  icon={<Settings className="w-4 h-4" />}
                  text="Configuración"
                />
                <hr className="my-4" />
                <ActionButton
                  color="red"
                  icon={<LogOut className="w-4 h-4" />}
                  text="Cerrar Sesión"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileSidebar;

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

const ActionButton = ({
  color,
  icon,
  text,
}: {
  color: "blue" | "gray" | "red";
  icon: React.ReactNode;
  text: string;
}) => {
  const styles =
    color === "blue"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : color === "gray"
      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
      : "bg-red-600 text-white hover:bg-red-700";

  return (
    <button
      className={`w-full py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2 ${styles}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};
