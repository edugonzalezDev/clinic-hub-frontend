import { CalendarDays } from "lucide-react";
import AppointmentCard from "./AppointmentCard";

const AppointmentsList: React.FC = () => {
  return (
    <div className="flex-1 border rounded-xl p-5 bg-white shadow-sm border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="text-blue-600" />
        <h2 className="font-semibold text-lg text-gray-800">
          Upcoming Appointments
        </h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">Your scheduled consultations</p>

      <div className="space-y-3">
        <AppointmentCard
          doctor="Dr. Sarah Johnson"
          specialty="Cardiologist"
          date="Today, 2:30 PM"
          type="Video Consultation"
          joinable
        />
        <AppointmentCard
          doctor="Dr. Michael Chen"
          specialty="General Practice"
          date="Tomorrow, 10:00 AM"
          type="In-Person"
        />
      </div>
    </div>
  );
};

export default AppointmentsList;
