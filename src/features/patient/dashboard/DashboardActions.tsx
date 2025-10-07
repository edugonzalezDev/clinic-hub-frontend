import { CalendarPlus, FileText, Video, CalendarDays } from "lucide-react";

const DashboardActions: React.FC = () => {
  const actions = [
    { label: "Book Appointment", icon: <CalendarPlus />, active: true },
    { label: "Medical History", icon: <FileText /> },
    { label: "Join Call", icon: <Video /> },
    { label: "My Schedule", icon: <CalendarDays /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {actions.map((a) => (
        <button
          key={a.label}
          className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border text-sm font-medium transition
          ${
            a.active
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white hover:cursor-pointer hover:bg-blue-400 hover:text-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md"
          }`}
        >
          {a.icon}
          {a.label}
        </button>
      ))}
    </div>
  );
};

export default DashboardActions;
