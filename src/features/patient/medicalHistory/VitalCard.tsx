import { HeartPulse } from "lucide-react";

export interface Vital {
  id: string;
  name: string;
  date: string;
  value: string;
  status: string;
}

interface VitalCardProps {
  vital: Vital;
}

const VitalCard: React.FC<VitalCardProps> = ({ vital }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
          <HeartPulse size={24} />
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{vital.name}</h3>
          <p className="text-sm text-gray-500">{vital.date}</p>
          <p className="text-blue-600 font-semibold mt-1">{vital.value}</p>
        </div>
      </div>
      <span className="text-xs bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full font-medium">
        {vital.status}
      </span>
    </div>
  );
};

export default VitalCard;
