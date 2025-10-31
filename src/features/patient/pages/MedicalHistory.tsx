import { useState } from "react";
import Tabs from "../medicalHistory/Tabs";
import ConsultationCard from "../medicalHistory/ConsultationCard";
import type { Consultation } from "../medicalHistory/ConsultationCard";
import MedicationCard from "../medicalHistory/MedicationCard";
import type { Medication } from "../medicalHistory/MedicationCard";
import LabResultCard from "../medicalHistory/LabResultCard";
import type { LabResult } from "../medicalHistory/LabResultCard";
import VitalCard from "../medicalHistory/VitalCard";
import type { Vital } from "../medicalHistory/VitalCard";
import { usePatientStore } from "../store/usePatientStore";

const MedicalHistory = () => {
  const [activeTab, setActiveTab] = useState("Consultations");
  const { appointmentHistory } = usePatientStore();

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
      <div className=" mx-auto">
        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "Consultations" &&
          (appointmentHistory || []).map((c) => (
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
