import { LogOut } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b bg-white border-gray-200 shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
          H
        </div>
        <div>
          <h1 className="font-semibold text-lg">HealthConnect</h1>
          <p className="text-sm text-gray-500 -mt-1">Patient Portal</p>
        </div>
      </div>

      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
        <LogOut size={18} />
        Logout
      </button>
    </header>
  );
};

export default Header;
