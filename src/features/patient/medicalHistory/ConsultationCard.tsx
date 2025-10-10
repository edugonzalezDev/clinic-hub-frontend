import { FileText } from "lucide-react";

export interface Consultation {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  diagnosis: string;
  notes: string;
}

const ConsultationCard: React.FC<{ consultation: Consultation }> = ({
  consultation,
}) => (
  <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-2">
        <FileText className="text-blue-500" size={20} />
        <div>
          <h3 className="font-semibold text-gray-800">
            {consultation.doctorName}
          </h3>
          <p className="text-sm text-gray-500">
            {consultation.specialty} • {consultation.date}
          </p>
        </div>
      </div>
      <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
        {consultation.specialty}
      </span>
    </div>

    <div className="mt-4 text-sm">
      <p className="font-semibold text-gray-700">Diagnosis</p>
      <p className="text-gray-600">{consultation.diagnosis}</p>

      <p className="font-semibold text-gray-700 mt-2">Notes</p>
      <p className="text-gray-600">{consultation.notes}</p>
    </div>
  </div>
);

export default ConsultationCard;
