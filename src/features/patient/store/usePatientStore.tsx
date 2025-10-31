import { create } from "zustand";
import {
  getAppointmentHistory,
  getUser,
  getVitals,
} from "../services/patientService"; // 👈 Importamos ambos servicios

export interface VitalSign {
  id: string;
  metric: string;
  value: string | number;
  date: Date;
  status?: "Normal" | "Alto" | "Bajo";
}

interface Patient {
  id: string;
  full_name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  is_active: boolean;
}

interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  clinic_id: string;
  starts_at: string;
  ends_at: string;
  type: "presencial" | "virtual";
  status: "pending" | "confirmed" | "cancelled";
  specialty: string;
  doctor_name: string;
}

interface PatientState {
  patient: Patient | null;
  vitals: VitalSign[];
  appointmentHistory?: Appointment[];
  loading: boolean; // Estado de carga
  error: string | null; // Estado para manejar errores
  updatePatient: (patient: Patient) => void;
  updateVitalSign: (id: string, newValue: string | number) => void;
  addVitalSign: (vital: VitalSign) => void;
  fetchPatientData: () => Promise<void>;
  fetchVitalsData: () => Promise<void>;
  fetchAppointmentHistory?: () => Promise<void>;
}

export const usePatientStore = create<PatientState>((set) => ({
  patient: null,
  vitals: [],
  loading: false, // Inicializamos como no cargando
  error: null, // No hay error al inicio

  // --- Actualizar datos del paciente ---
  updatePatient: (patient) => set({ patient }),

  // --- Agregar un signo vital ---
  addVitalSign: (vital) =>
    set((state) => ({
      vitals: [...state.vitals, vital],
    })),

  // --- Actualizar un signo vital existente ---
  updateVitalSign: (id, newValue) =>
    set((state) => ({
      vitals: state.vitals.map((vital) =>
        vital.id === id ? { ...vital, value: newValue } : vital
      ),
    })),

  // --- Obtener los datos del paciente ---
  fetchPatientData: async () => {
    set({ loading: true, error: null }); // Activamos el estado de carga
    try {
      const user = await getUser();
      set({ patient: user, loading: false });
    } catch (error) {
      console.error("❌ Error al obtener datos del paciente:", error);
      set({ error: "Error al obtener datos del paciente", loading: false });
    }
  },

  // --- Obtener los signos vitales ---
  fetchVitalsData: async () => {
    set({ loading: true, error: null }); // Activamos el estado de carga
    try {
      const vitals = await getVitals();
      set({ vitals, loading: false });
    } catch (error) {
      console.error("❌ Error al obtener signos vitales:", error);
      set({ error: "Error al obtener signos vitales", loading: false });
    }
  },

  // --- Obtener el historial de citas ---
  fetchAppointmentHistory: async () => {
    set({ loading: true, error: null }); // Activamos el estado de carga
    try {
      const appointmentHistory = await getAppointmentHistory();
      set({ appointmentHistory, loading: false });
    } catch (error) {
      console.error("❌ Error al obtener el historial de citas:", error);
      set({ error: "Error al obtener el historial de citas", loading: false });
    }
  },
}));
