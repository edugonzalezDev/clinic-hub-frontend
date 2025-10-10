import { Bell } from "lucide-react";

const NotificationsPanel: React.FC = () => {
  const notifications = [
    {
      message: "Appointment reminder: Dr. Sarah Johnson in 2 hours",
      time: "10 min ago",
    },
    {
      message: "Your lab results are ready to view",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="w-full md:w-1/3 border rounded-xl p-5 bg-white shadow-sm border-gray-200 mt-6 md:mt-0">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="text-blue-600" />
        <h2 className="font-semibold text-lg text-gray-800">Notifications</h2>
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700"
          >
            <p>{n.message}</p>
            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;
