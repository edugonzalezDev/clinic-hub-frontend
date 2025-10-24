import {
  LogOut,
  Calendar,
  FileText,
  Settings,
  Heart,
  ClipboardList,
  User,
  Home,
} from "lucide-react";

const Sidebar = () => (
  <aside className="fixed left-0 top-0 h-screen w-64 bg-blue-50 flex flex-col justify-between p-6 border-r border-blue-100">
    {/* LOGO Y MENÚ */}
    <div>
      <h1 className="text-2xl font-bold text-blue-600 mb-10 tracking-tight">
        Happycare
      </h1>

      <nav aria-label="Menú principal">
        <ul className="space-y-3">
          {[
            { icon: Home, label: "Escritorio" },
            { icon: Calendar, label: "Citas" },
            { icon: FileText, label: "Resultados" },
            { icon: ClipboardList, label: "Recetas Médicas" },
            { icon: User, label: "Doctores" },
            { icon: Heart, label: "Historial Clínico" },
            { icon: Settings, label: "Ajustes" },
          ].map(({ icon: Icon, label }) => (
            <li key={label}>
              <a
                href="#"
                className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition-colors duration-150"
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </a>
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
