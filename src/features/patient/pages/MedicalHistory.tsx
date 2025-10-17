import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import Tabs from "../medicalHistory/Tabs";
import ConsultationCard from "../medicalHistory/ConsultationCard";
import type { Consultation } from "../medicalHistory/ConsultationCard";
import MedicationCard from "../medicalHistory/MedicationCard";
import type { Medication } from "../medicalHistory/MedicationCard";
import LabResultCard from "../medicalHistory/LabResultCard";
import type { LabResult } from "../medicalHistory/LabResultCard";
import VitalCard from "../medicalHistory/VitalCard";
import type { Vital } from "../medicalHistory/VitalCard";

const MedicalHistory = () => {
  const [activeTab, setActiveTab] = useState("Consultations");
  const navigate = useNavigate();

  const consultations: Consultation[] = [
    {
      id: "1",
      doctorName: "Dr. Carlos Mendoza",
      specialty: "Cardiología",
      type: "Teleconsulta",
      status: "Próxima",
      date: "15 Dic 2024",
      time: "10:00 AM",
    },
    {
      id: "2",
      doctorName: "Dra. Ana Rodríguez",
      specialty: "Medicina General",
      type: "Presencial",
      status: "Completada",
      date: "10 Dic 2024",
      time: "2:30 PM",
      diagnosis:
        "Control rutinario. Paciente en buen estado general. Se recomienda continuar con medicación actual.",
    },
    {
      id: "3",
      doctorName: "Dr. Luis Martínez",
      specialty: "Dermatología",
      type: "Teleconsulta",
      status: "Completada",
      date: "5 Dic 2024",
      time: "11:15 AM",
      diagnosis:
        "Dermatitis leve. Se prescribe crema tópica y se recomienda evitar exposición solar directa.",
    },
    {
      id: "4",
      doctorName: "Dr. Roberto Silva",
      specialty: "Traumatología",
      type: "Presencial",
      status: "Cancelada",
      date: "1 Dic 2024",
      time: "4:00 PM",
    },
  ];

  const medications: Medication[] = [
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      status: "Active",
    },
    {
      id: "2",
      name: "Aspirin",
      dosage: "81mg",
      frequency: "Once daily",
      status: "Active",
    },
  ];

  const labResults: LabResult[] = [
    {
      id: "1",
      name: "Complete Blood Count",
      date: "Jan 10, 2024",
      status: "Complete",
      result: "Normal",
    },
    {
      id: "2",
      name: "Lipid Panel",
      date: "Jan 10, 2024",
      status: "Complete",
      result: "Normal",
    },
  ];

  const vitals: Vital[] = [
    {
      id: "1",
      name: "Blood Pressure",
      date: "Jan 15, 2024",
      value: "120/80 mmHg",
      status: "Normal",
    },
    {
      id: "2",
      name: "Heart Rate",
      date: "Jan 15, 2024",
      value: "72 bpm",
      status: "Normal",
    },
    {
      id: "3",
      name: "Weight",
      date: "Jan 15, 2024",
      value: "75 kg",
      status: "Normal",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 mb-6 hover:text-blue-600 transition">
          <ArrowLeft
            className="text-gray-600 cursor-pointer"
            size={18}
            onClick={() => navigate(-1)}
          />
          <div>
            <h1 className="font-semibold text-lg text-gray-800">
              Medical History
            </h1>
            <p className="text-sm text-gray-500">Complete health records</p>
          </div>
        </div>

        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "Consultations" &&
          consultations.map((c) => (
            <ConsultationCard key={c.id} consultation={c} />
          ))}

        {activeTab === "Medications" &&
          medications.map((m) => <MedicationCard key={m.id} medication={m} />)}

        {activeTab === "Lab Results" &&
          labResults.map((l) => <LabResultCard key={l.id} lab={l} />)}

        {activeTab === "Vitals" &&
          vitals.map((v) => <VitalCard key={v.id} vital={v} />)}
      </div>
    </div>
  );
};

export default MedicalHistory;
