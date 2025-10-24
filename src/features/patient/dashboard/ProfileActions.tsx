import React from "react";

const ProfileActions: React.FC = () => {
  const actions = [
    {
      id: "history",
      icon: "📋",
      title: "Mi Historial",
      subtitle: "Clínico",
    },
    {
      id: "medications",
      icon: "💊",
      title: "Mis",
      subtitle: "Medicamentos",
    },
    {
      id: "documents",
      icon: "📄",
      title: "Descargar",
      subtitle: "Documentos",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {actions.map((action) => (
        <button
          key={action.id}
          id={action.id === "documents" ? "downloadBtn" : undefined}
          className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 card-hover"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">{action.icon}</div>
            <p className="text-sm font-medium text-gray-900">{action.title}</p>
            <p className="text-xs text-gray-600">{action.subtitle}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ProfileActions;
