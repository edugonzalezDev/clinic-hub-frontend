import { FlaskConical } from "lucide-react";

export interface LabResult {
  id: string;
  name: string;
  date: string;
  status: string;
  result: string;
}

const LabResultCard: React.FC<{ lab: LabResult }> = ({ lab }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100 flex justify-between items-center">
    <div className="flex items-center space-x-3">
      <div className="bg-teal-500 p-3 rounded-xl">
        <FlaskConical className="text-white" size={20} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{lab.name}</h3>
        <p className="text-sm text-gray-500">{lab.date}</p>
        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 rounded-full text-gray-600">
          {lab.result}
        </span>
      </div>
    </div>
    <span className="px-3 py-1 text-xs bg-emerald-100 text-emerald-600 rounded-full">
      {lab.status}
    </span>
  </div>
);

export default LabResultCard;
