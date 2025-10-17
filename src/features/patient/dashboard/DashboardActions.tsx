import { FileText, Video, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router";

const DashboardActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Medical History",
      icon: <FileText />,
      path: "/paciente/historial-medico",
    },
    {
      label: "Join Call",
      icon: <Video />,
      path: "/paciente/teleconsulta/a1",
    },
    {
      label: "My Schedule",
      icon: <CalendarDays />,
      path: "/schedule",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={() => navigate(a.path)}
          className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border text-sm font-medium bg-white 
          text-gray-700 border-gray-200 shadow-sm transition hover:cursor-pointer hover:bg-blue-400 hover:text-white hover:shadow-md"
        >
          {a.icon}
          {a.label}
        </button>
      ))}
    </div>
  );
};

export default DashboardActions;
