import React from "react";

interface NotificationItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  bg?: string;
  read?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  icon,
  title,
  description,
  time,
  bg = "bg-gray-100",
  read = false,
}) => (
  <div
    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-opacity ${
      read ? "opacity-60" : ""
    }`}
  >
    <div className="flex items-start space-x-3">
      <div
        className={`w-8 h-8 ${bg} rounded-full flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {!read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  </div>
);

export default NotificationItem;
