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

/** Usuario “auth” (solo mock) */
export interface AuthUser {
    id: string;
    name: string;
    role: Role;
    email: string;
    password: string;        // ⚠️ solo mock (plaintext)
    dni?: string;
    phone?: string;
    sex?: string;
    date_of_bird?: string;
    license?: string;
    linkedPatientId?: string;
    linkedDoctorId?: string;
}

/** Estado + acciones */
interface AppState {
    // sesión
    currentUser?: User;
    currentPatientId?: string;
    currentDoctorId?: string;
    accessToken?: string;
    refreshToken?: string;

    // “BD” mock
    users: AuthUser[];
    doctors: Doctor[];
    patients: Patient[];
    appointments: Appointment[];
    waitlist: { id: string; patientId: string; reason?: string }[];

    // acciones de sesión
    /** Registro + login automático (mock) */
    register: (p: {
        role: Role;
        full_name: string;
        email: string;
        password: string;
        phone: string;
        dni: string;
        sex: string;
        date_of_bird: string;
        license?: string;
    }) => { ok: true } | { ok: false; error: string };

    /** Login por email/password (mock) */
    loginWithPassword: (email: string, password: string) => { ok: true } | { ok: false; error: string };

    /** Setter de sesión “crudo” (útil si después conectás API real) */
    login: (p: { user: User; accessToken?: string; refreshToken?: string; linkedPatientId?: string; linkedDoctorId?: string }) => void;

    logout: () => void;

    // negocio
    addAppointment: (a: Appointment) => void;
    moveWaitlist: (from: number, to: number) => void;
}

/** Seeds demo */
const seedDoctors: Doctor[] = [
    { id: "d1", name: "Dra. Sofía Pérez", specialty: "Clínica", color: "#A7D8F0" },
    { id: "d2", name: "Dr. Martín Gómez", specialty: "Pediatría", color: "#BEE7C8" },
    { id: "d3", name: "Dra. Laura Martínez", specialty: "Ginecología", color: "#FAD2CF" },
];
const seedPatients: Patient[] = [
    { id: "p1", name: "Juan Ramírez", docId: "34.567.890", phone: "+54 9 294 123", notes: "Alergia a penicilina" },
    { id: "p2", name: "Ana Díaz", docId: "29.111.222" },
    { id: "p3", name: "Carlos Rodríguez", docId: "XX.333.444" },
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
];
const seedUsers: AuthUser[] = [
    {
        id: "u-doc",
        name: "Dra. Sofía Pérez",
        role: "doctor",
        email: "sofia@demo.com",
        password: "123456",
        linkedDoctorId: "d1",
    },
    {
        id: "u-pat",
        name: "Juan Ramírez",
        role: "patient",
        email: "juan@demo.com",
        password: "123456",
        linkedPatientId: "p1",
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
            users: seedUsers,
            doctors: seedDoctors,
            patients: seedPatients,
            appointments: seedAppointments,
            waitlist: [{ id: "w1", patientId: "p2", reason: "Consulta prioritaria" }],

            // ---- Acciones de sesión ----
            register: (p) => {
                const { email, dni, full_name, role } = p;
                const { users, patients, doctors } = get();

                // unicidad email
                if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                    return { ok: false as const, error: "El email ya está registrado." };
                }
                // unicidad DNI (si viene)
                if (dni && (users.some(u => u.dni === dni) || patients.some(pt => pt.docId.replace(/\D/g, "") === dni))) {
                    return { ok: false as const, error: "El DNI ya está registrado." };
                }

                // crear entidades vinculadas
                let linkedPatientId: string | undefined;
                let linkedDoctorId: string | undefined;

                if (role === "patient") {
                    linkedPatientId = `p-${crypto.randomUUID()}`;
                    const newPatient: Patient = {
                        id: linkedPatientId,
                        name: full_name,
                        docId: dni || "S/D",
                        phone: p.phone,
                        notes: "",
                    };
                    set({ patients: [...patients, newPatient] });
                }

                if (role === "doctor") {
                    linkedDoctorId = `d-${crypto.randomUUID()}`;
                    const newDoctor: Doctor = {
                        id: linkedDoctorId,
                        name: full_name,
                        specialty: "Clínica",
                        color: "#A7D8F0",
                    };
                    set({ doctors: [...doctors, newDoctor] });
                }

                // crear auth user
                const newAuthUser: AuthUser = {
                    id: crypto.randomUUID(),
                    name: full_name,
                    role,
                    email: p.email,
                    password: p.password,
                    dni: p.dni,
                    phone: p.phone,
                    sex: p.sex,
                    date_of_bird: p.date_of_bird,
                    license: p.license,
                    linkedPatientId,
                    linkedDoctorId,
                };

                set({ users: [...get().users, newAuthUser] });

                // login automático
                set({
                    currentUser: { id: newAuthUser.id, name: newAuthUser.name, role: newAuthUser.role, email: newAuthUser.email },
                    currentDoctorId: newAuthUser.linkedDoctorId,
                    currentPatientId: newAuthUser.linkedPatientId,
                    accessToken: "mock.access.token",
                    refreshToken: "mock.refresh.token",
                });

                return { ok: true as const };
            },

            loginWithPassword: (email, password) => {
                const u = get().users.find(
                    x => x.email.toLowerCase() === email.toLowerCase() && x.password === password
                );
                if (!u) return { ok: false as const, error: "Credenciales inválidas." };

                set({
                    currentUser: { id: u.id, name: u.name, role: u.role, email: u.email },
                    currentDoctorId: u.linkedDoctorId,
                    currentPatientId: u.linkedPatientId,
                    accessToken: "mock.access.token",
                    refreshToken: "mock.refresh.token",
                });
                return { ok: true as const };
            },

            login: ({ user, accessToken, refreshToken, linkedDoctorId, linkedPatientId }) => {
                set({
                    currentUser: user,
                    accessToken,
                    refreshToken,
                    currentDoctorId: linkedDoctorId ?? (user.role === "doctor" ? user.id : get().currentDoctorId),
                    currentPatientId: linkedPatientId ?? (user.role === "patient" ? user.id : get().currentPatientId),
                });
            },

            logout: async () => {
                set({
                    currentUser: undefined,
                    currentDoctorId: undefined,
                    currentPatientId: undefined,
                    accessToken: undefined,
                    refreshToken: undefined,
                });

                // borra el storage persistido en store
                try {
                    await useAppStore.persist?.clearStorage?.(); // disponible con zustand/persist
                    await useAppStore.persist?.rehydrate?.();    // vuelve a cargar (seeds)
                } catch {
                    console.error("No se pudo borrar el storage persistido.");
                }
            },

            // ---- Negocio ----
            addAppointment: (a) => set({ appointments: [...get().appointments, a] }),

            moveWaitlist: (from, to) => set((s) => {
                const items = [...s.waitlist];
                const [moved] = items.splice(from, 1);
                items.splice(to, 0, moved);
                return { waitlist: items };
            }),
        }),
        {
            name: "hc/app-store",
            version: 1,
            storage: createJSONStorage(() => localStorage),
            /** Persistimos también users/doctores/pacientes para que el registro quede guardado. */
            partialize: (s) => ({
                currentUser: s.currentUser,
                currentPatientId: s.currentPatientId,
                currentDoctorId: s.currentDoctorId,
                accessToken: s.accessToken,
                refreshToken: s.refreshToken,
                users: s.users,
                doctors: s.doctors,
                patients: s.patients,
                appointments: s.appointments,
            }),
            migrate: (persisted, _version) => persisted as AppState,
        }
    )
);

export default useAppStore;
