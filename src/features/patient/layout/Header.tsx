import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { Bell } from "lucide-react";

const Header = () => (
  <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
    <section>
      <h1 className="text-2xl font-semibold text-gray-800">
        Paciente, <span className="text-blue-600">Juan Pérez</span>
      </h1>
    </section>

    <section className="flex items-center space-x-4">
      <Button text="+ Agendar Cita" />
      <Button text="+ Resultados" variant="outline" />

      {/* Botón de notificaciones */}
      <button
        type="button"
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-6 h-6" />
        <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <Avatar src="/user.jpg" alt="Foto de perfil" />
    </section>
  </header>
);

export default Header;
