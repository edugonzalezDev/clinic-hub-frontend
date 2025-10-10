import { Video } from "lucide-react";

interface AppointmentCardProps {
  doctor: string;
  specialty: string;
  date: string;
  type: string;
  joinable?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  doctor,
  specialty,
  date,
  type,
  joinable,
}) => {
  return (
    <div className="flex items-center justify-between border rounded-xl p-4 bg-white shadow-sm border-gray-200">
      <div>
        <h3 className="font-semibold text-gray-800">
          {doctor}
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md mx-2">
            {specialty}
          </span>
        </h3>
        <p className="text-sm text-gray-500 mt-2">{date}</p>
        <p className="text-xs text-gray-400">{type}</p>
      </div>
      <div className="flex gap-2">
        {joinable && (
          <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
            <Video size={16} /> Join
          </button>
        )}
        <button className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:cursor-pointer hover:bg-blue-400 hover:text-white border-gray-200">
          Details
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;
