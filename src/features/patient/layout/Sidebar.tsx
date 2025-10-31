import {
  LogOut,
  Calendar,
  FileText,
  ClipboardList,
  User,
  Home,
  Heart,
  Settings,
} from "lucide-react";

interface SidebarProps {
  onRouteChange: (route: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onRouteChange }) => (
  <aside className="fixed left-0 top-0 h-screen w-64 bg-blue-50 flex flex-col justify-between p-6 border-r border-blue-100">
    {/* LOGO Y MENÚ */}
    <div>
      <h1 className="text-2xl font-bold text-blue-600 mb-10 tracking-tight">
        Happycare
      </h1>

      <nav aria-label="Menú principal">
        <ul className="space-y-3">
          {[
            { icon: Home, label: "Escritorio", route: "/" },
            { icon: Calendar, label: "Citas", route: "/citas" },
            { icon: FileText, label: "Resultados", route: "/resultados" },
            {
              icon: ClipboardList,
              label: "Recetas Médicas",
              route: "/recetas",
            },
            { icon: User, label: "Doctores", route: "/doctores" },
            { icon: Heart, label: "Historial Clínico", route: "/historial" },
            { icon: Settings, label: "Ajustes", route: "/ajustes" },
          ].map(({ icon: Icon, label, route }) => (
            <li key={label}>
              <button
                onClick={() => onRouteChange(route)}
                className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition-colors duration-150"
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>

    {/* BOTÓN DE SALIDA */}
    <button
      className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors duration-150"
      aria-label="Cerrar sesión"
    >
      <LogOut className="w-5 h-5 mr-2" />
      Cerrar Sesión
    </button>
  </aside>
);

export default Sidebar;
