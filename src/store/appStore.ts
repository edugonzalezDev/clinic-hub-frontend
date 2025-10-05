import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addMinutes } from "date-fns";

/** Tipos base */
export type Role = "patient" | "doctor" | "admin";
export interface User { id: string; name: string; role: Role; email?: string; }

export interface Doctor { id: string; name: string; specialty: string; color?: string; }
export interface Patient { id: string; name: string; docId: string; phone?: string; notes?: string; }

export interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    startsAt: string;
    endsAt: string;
    type: "presencial" | "virtual";
    status: "pending" | "confirmed" | "cancelled";
}

export interface AuthUser {
    id: string;
    name: string;
    role: Role;
    email: string;
    password: string; // ⚠️ solo mock (plaintext)
    linkedPatientId?: string;
    linkedDoctorId?: string;
}
/** Estado + acciones */
interface AppState {
    // sesión
    currentUser?: User;
    currentPatientId?: string;
    currentDoctorId?: string;
    accessToken?: string;   // para cuando conectes API
    refreshToken?: string;

    // datos mock (hoy locales; mañana desde API)
    doctors: Doctor[];
    patients: Patient[];
    appointments: Appointment[];
    waitlist: { id: string; patientId: string; reason?: string }[];

    // acciones de sesión
    register: (p: { name: string; email: string; password: string; role: Role; phone: string, sex: string, date_of_bird: string, license?: string }) => { ok: boolean; error?: string };

    login: (p: { user: User; accessToken?: string; refreshToken?: string; linkedPatientId?: string; linkedDoctorId?: string }) => void;
    logout: () => void;

    // acciones de negocio
    addAppointment: (a: Appointment) => void;
    moveWaitlist: (from: number, to: number) => void;
}

/** Seeds demo */
const seedDoctors: Doctor[] = [
    { id: "d1", name: "Dra. Sofía Pérez", specialty: "Clínica", color: "#A7D8F0" },
    { id: "d2", name: "Dr. Martín Gómez", specialty: "Pediatría", color: "#BEE7C8" },
    { id: "d3", name: "Dra. Laura Martínez", specialty: "Ginecología", color: "#FAD2CF" },
    { id: "d4", name: "Dr. Carlos Rodríguez", specialty: "Cardiología", color: "#F0E1D8" },
    { id: "d5", name: "Dra. Ana Díaz", specialty: "Dermatología", color: "#E7D8F0" },
];
const seedPatients: Patient[] = [
    { id: "p1", name: "Juan Ramírez", docId: "34.567.890", phone: "+54 9 294 123", notes: "Alergia a penicilina" },
    { id: "p2", name: "Ana Díaz", docId: "29.111.222" },
    { id: "p3", name: "Carlos Rodríguez", docId: "XX.333.444" },
    { id: "p4", name: "Laura Martínez", docId: "XX.555.666" },
    { id: "p5", name: "Sofía Pérez", docId: "XX.777.888" },
    { id: "p6", name: "Martín Gómez", docId: "XX.999.000" },
    { id: "p7", name: "Laura Díaz", docId: "XX.111.222" },
    { id: "p8", name: "Carlos Martínez", docId: "XX.333.444" },
    { id: "p9", name: "Ana Rodríguez", docId: "XX.555.666" },
    { id: "p10", name: "Sofía Pérez", docId: "XX.777.888" },
];

const seedAppointments: Appointment[] = [
    {
        id: "a1",
        doctorId: "d1",
        patientId: "p1",
        startsAt: new Date().toISOString(),
        endsAt: addMinutes(new Date(), 30).toISOString(),
        type: "virtual",
        status: "confirmed",
    },
    {
        id: "a2",
        doctorId: "d2",
        patientId: "p3",
        startsAt: addMinutes(new Date(), 30).toISOString(),
        endsAt: addMinutes(new Date(), 60).toISOString(),
        type: "presencial",
        status: "confirmed",
    },
    {
        id: "a3",
        doctorId: "d2",
        patientId: "p10",
        startsAt: addMinutes(new Date(), 60).toISOString(),
        endsAt: addMinutes(new Date(), 90).toISOString(),
        type: "virtual",
        status: "confirmed",
    },
    {
        id: "a4",
        doctorId: "d1",
        patientId: "p5",
        startsAt: addMinutes(new Date(), 90).toISOString(),
        endsAt: addMinutes(new Date(), 120).toISOString(),
        type: "presencial",
        status: "confirmed",
    },
    {
        id: "a5",
        doctorId: "d1",
        patientId: "p7",
        startsAt: addMinutes(new Date(), 120).toISOString(),
        endsAt: addMinutes(new Date(), 150).toISOString(),
        type: "virtual",
        status: "confirmed",
    },
];

const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // sesión
            currentUser: undefined,
            currentPatientId: undefined,
            currentDoctorId: undefined,
            accessToken: undefined,
            refreshToken: undefined,

            // datos
            doctors: seedDoctors,
            patients: seedPatients,
            appointments: seedAppointments,
            waitlist: [{ id: "w1", patientId: "p2", reason: "Consulta prioritaria" }],

            // ---- Acciones de sesión ----
            register: ({ name, email, password, role }) => { },
            login: ({ user, accessToken, refreshToken, linkedDoctorId, linkedPatientId }) => {
                set({
                    currentUser: user,
                    accessToken,
                    refreshToken,
                    currentDoctorId: linkedDoctorId ?? (user.role === "doctor" ? user.id : get().currentDoctorId),
                    currentPatientId: linkedPatientId ?? (user.role === "patient" ? user.id : get().currentPatientId),
                });
            },

            logout: () => set({
                currentUser: undefined,
                accessToken: undefined,
                refreshToken: undefined,
                currentDoctorId: undefined,
                currentPatientId: undefined,
            }),

            // ---- Acciones de negocio ----
            addAppointment: (a) => set({ appointments: [...get().appointments, a] }),

            moveWaitlist: (from, to) => set((s) => {
                const items = [...s.waitlist];
                const [moved] = items.splice(from, 1);
                items.splice(to, 0, moved);
                return { waitlist: items };
            }),
        }),
        {
            name: "hc/app-store",                 // key en localStorage
            version: 1,
            storage: createJSONStorage(() => localStorage),
            /** Persistimos sólo lo necesario para sesión/UX.
             *  Los catálogos (doctores/pacientes) idealmente vendrán de API. */
            partialize: (s) => ({
                currentUser: s.currentUser,
                currentPatientId: s.currentPatientId,
                currentDoctorId: s.currentDoctorId,
                accessToken: s.accessToken,
                refreshToken: s.refreshToken,
                appointments: s.appointments, // las mantenemos al recargar por demo
            }),
            migrate: (persisted, _version) => persisted as AppState,
        }
    )
);

export default useAppStore;
