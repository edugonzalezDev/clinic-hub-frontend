import React from "react";

type StatsCardProps = {
  completed: number;
  upcoming: number;
  teleconsults: number;
  reminders: number;
};

const StatsCards: React.FC<StatsCardProps> = ({
  completed,
  upcoming,
  teleconsults,
  reminders,
}) => {
  const stats = [
    {
      label: "Consultas Completadas",
      value: completed,
      icon: "✅",
      color: "bg-green-100",
    },
    {
      label: "Próximas Citas",
      value: upcoming,
      icon: "📅",
      color: "bg-blue-100",
    },
    {
      label: "Teleconsultas",
      value: teleconsults,
      icon: "💻",
      color: "bg-purple-100",
    },
    {
      label: "Recordatorios",
      value: reminders,
      icon: "⏰",
      color: "bg-yellow-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-xl shadow-md p-6 card-hover transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${item.color}`}>
              <span className="text-2xl">{item.icon}</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
