import { LogOut } from "lucide-react";
import UserSidebar from "./UserSidebar";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b bg-white border-gray-200 shadow-sm">
      {/* Sidebar del usuario (a la izquierda) */}
      <div className="flex items-center gap-3">
        <UserSidebar />
      </div>

      {/* Hospital al centro */}
      <div className="flex flex-col items-center text-center">
        <h1 className="font-semibold text-lg text-gray-800">
          Hospital Central
        </h1>
        <p className="text-sm text-gray-500 -mt-1">HealthConnect</p>
      </div>

      {/* Logout al lado derecho */}
      <div>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
