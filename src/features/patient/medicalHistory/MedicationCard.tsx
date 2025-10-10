import { Pill } from "lucide-react";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  status: string;
}

const MedicationCard: React.FC<{ medication: Medication }> = ({
  medication,
}) => (
  <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100 flex justify-between items-center">
    <div className="flex items-center space-x-3">
      <div className="bg-blue-500 p-3 rounded-xl">
        <Pill className="text-white" size={20} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{medication.name}</h3>
        <p className="text-sm text-gray-500">
          {medication.dosage} • {medication.frequency}
        </p>
      </div>
    </div>
    <span className="px-3 py-1 text-xs bg-emerald-100 text-emerald-600 rounded-full">
      {medication.status}
    </span>
  </div>
);

export default MedicationCard;
