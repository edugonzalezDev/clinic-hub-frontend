import { useState } from "react";
import {
  CalendarDays,
  Video,
  XCircle,
  FileText,
  ClipboardList,
} from "lucide-react";
import AppointmentScheduler from "../dashboard/ScheduleAppointment";
import Modal from "./Modal";

export interface Consultation {
  id: string;
  doctorName: string;
  specialty: string;
  type: "Presencial" | "Teleconsulta";
  status: "Próxima" | "Completada" | "Cancelada";
  date: string;
  time: string;
  diagnosis?: string;
  notes?: string;
}

const statusStyles: Record<string, string> = {
  Próxima:
    "bg-gradient-to-r from-blue-30 to-blue-100 border-l-4 border-blue-500",
  Completada:
    "bg-gradient-to-r from-green-30 to-green-100 border-l-4 border-green-500",
  Cancelada:
    "bg-gradient-to-r from-red-30 to-red-100 border-l-4 border-red-500",
};

const badgeStyles: Record<string, string> = {
  Próxima: "bg-blue-600 text-white",
  Completada: "bg-green-600 text-white",
  Cancelada: "bg-red-600 text-white",
};

const ConsultationCard: React.FC<{ consultation: Consultation }> = ({
  consultation,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<Consultation["status"]>(
    consultation.status
  );

  const colorClass = statusStyles[status] || "bg-gray-100";
  const badgeClass = badgeStyles[status] || "bg-gray-400";

  const handleReagendar = () => {
    if (status !== "Completada") {
      setShowModal(true);
    }
  };

  const handleCancelar = () => {
    if (status === "Próxima") {
      setStatus("Cancelada");
    }
  };

  return (
    <>
      <div
        className={`rounded-2xl p-5 mb-5 shadow-sm transition hover:shadow-md ${colorClass}`}
      >
        {/* Estado y tipo */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}`}
            >
              {status}
            </span>
            <span
              className={`text-xs font-semibold ${
                consultation.type === "Presencial"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              {consultation.type}
            </span>
          </div>

          {/* Botones */}
          <div className="flex space-x-2">
            {/* Teleconsulta */}
            {status === "Próxima" && consultation.type === "Teleconsulta" && (
              <button className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600">
                <Video size={18} />
              </button>
            )}

            {/* Reagendar (solo si no completada) */}
            {status !== "Completada" && (
              <button
                onClick={handleReagendar}
                className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600"
              >
                <CalendarDays size={18} />
              </button>
            )}

            {/* Cancelar */}
            {status === "Próxima" && (
              <button
                onClick={handleCancelar}
                className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600"
              >
                <XCircle size={18} />
              </button>
            )}

            {/* Archivos (solo completadas) */}
            {status === "Completada" && (
              <>
                <button className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700">
                  <FileText size={18} />
                </button>
                <button className="bg-purple-500 text-white p-2 rounded-xl hover:bg-purple-600">
                  <ClipboardList size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Información del doctor */}
        <div className="mb-2">
          <h3 className="font-semibold text-gray-800">
            {consultation.doctorName}
          </h3>
          <p className="text-sm text-gray-600">{consultation.specialty}</p>
        </div>

        {/* Fecha y hora */}
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <div className="flex items-center space-x-1">
            <CalendarDays size={16} />
            <span>{consultation.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🕒</span>
            <span>{consultation.time}</span>
          </div>
        </div>

        {/* Diagnóstico y notas */}
        {status === "Completada" && (
          <div className="mt-3 bg-white/50 rounded-xl p-3 text-sm">
            {consultation.diagnosis && (
              <p className="text-gray-700">
                <span className="font-semibold">Diagnóstico:</span>{" "}
                {consultation.diagnosis}
              </p>
            )}
            {consultation.notes && (
              <p className="text-gray-700 mt-1">{consultation.notes}</p>
            )}
          </div>
        )}

        {/* Cancelada */}
        {status === "Cancelada" && (
          <p className="mt-3 text-red-700 text-sm font-medium">
            Cancelada por el paciente
          </p>
        )}
      </div>

      {/* Modal con el agendador */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Reagendar cita"
      >
        <AppointmentScheduler />
      </Modal>
    </>
  );
};

export default ConsultationCard;
