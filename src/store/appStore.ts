import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addMinutes } from "date-fns";


/** Tipos base */
export type Role = "patient" | "doctor" | "admin";
export interface User { id: string; name: string; role: Role; email?: string; }

export interface Doctor { id: string; name: string; specialty: string; color?: string; }
export interface Patient { id: string; name: string; docId: string; phone?: string; notes?: string; }

// 👇 Tipos de Historia Clínica
export type Consultation = {
    id: string;
    dateISO: string;
    doctorId: string;
    specialty: string;
    diagnosis: string;
    notes: string;
};
export type Medication = {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    status: "active" | "suspended" | "completed";
};
export type LabResult = {
    id: string;
    test: string;
    dateISO: string;
    result: string;
    status: "pending" | "complete";
};
export type Vital = {
    id: string;
    metric: string;
    value: string;
    dateISO: string;
    status?: string;
};

export type ClinicalRecord = {
    consultations: Consultation[];
    medications: Medication[];
    labs: LabResult[];
    vitals: Vital[];
};


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

    // historia clínica por paciente
    clinicalRecords: Record<string, ClinicalRecord>;

    // acciones HC (mínimas por ahora)
    upsertClinicalRecord: (patientId: string, patch: Partial<ClinicalRecord>) => void;
}

/** Seeds demo */
const seedDoctors: Doctor[] = [
    { id: "d1", name: "Dra. Sofía Pérez", specialty: "Clínica", color: "#A7D8F0" },
    { id: "d2", name: "Dr. Martín Gómez", specialty: "Pediatría", color: "#BEE7C8" },
    { id: "d3", name: "Dra. Laura Martínez", specialty: "Ginecología", color: "#FAD2CF" },
];
const seedPatients: Patient[] = [
    { id: "p1", name: "Juan Ramírez", docId: "34.567.890", phone: "+54 9 294 123", notes: "Alergia a penicilina" },
    { id: "p2", name: "Ana Díaz", docId: "29.111.222", phone: "+54 9 2944396777", notes: "Alergia a penicilina" },
    { id: "p3", name: "Carlos Rodríguez", docId: "XX.333.444", phone: "+54 9 294 123", notes: "Alergia a penicilina" },
    { id: "p4", name: "María López", docId: "XX.555.666", phone: "+54 9 294 123", notes: "Alergia a penicilina" },
    { id: "p5", name: "Pedro Gómez", docId: "XX.777.888", phone: "+54 9 294 123", notes: "Alergia a penicilina" },
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
        doctorId: "d1",
        patientId: "p2",
        startsAt: new Date().toISOString(),
        endsAt: addMinutes(new Date(), 30).toISOString(),
        type: "presencial",
        status: "confirmed",
    },
    {
        id: "a3",
        doctorId: "d1",
        patientId: "p3",
        startsAt: new Date().toISOString(),
        endsAt: addMinutes(new Date(), 30).toISOString(),
        type: "virtual",
        status: "confirmed",
    },
    {
        id: "a4",
        doctorId: "d1",
        patientId: "p4",
        startsAt: new Date().toISOString(),
        endsAt: addMinutes(new Date(), 30).toISOString(),
        type: "virtual",
        status: "confirmed",
    },
    {
        id: "a5",
        doctorId: "d1",
        patientId: "p5",
        startsAt: new Date().toISOString(),
        endsAt: addMinutes(new Date(), 30).toISOString(),
        type: "virtual",
        status: "confirmed",
    },
    {
        id: "a6",
        doctorId: "d1",
        patientId: "p6",
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

const seedClinical: Record<string, ClinicalRecord> = {
    p1: {
        consultations: [
            {
                id: "c1",
                dateISO: new Date().toISOString(),
                doctorId: "d1",
                specialty: "Cardiología",
                diagnosis: "Chequeo anual - Todo OK",
                notes: "Buen estado cardiovascular. Mantener estilo de vida.",
            },
            {
                id: "c2",
                dateISO: new Date().toISOString(),
                doctorId: "d2",
                specialty: "Clínica",
                diagnosis: "Resfrío común",
                notes: "Reposo e hidratación.",
            },
            {
                id: "c3",
                dateISO: new Date().toISOString(),
                doctorId: "d1",
                specialty: "Pediatría",
                diagnosis: "Chequeo anual - Todo OK",
                notes: "Cuidarse con las comidad, sal.",
            }
        ],
        medications: [
            { id: "m1", name: "Lisinopril", dosage: "10 mg", frequency: "1 vez al día", status: "active" },
            { id: "m2", name: "Aspirina", dosage: "81 mg", frequency: "1 vez al día", status: "active" },
        ],
        labs: [
            { id: "l1", test: "Hemograma", dateISO: "2024-01-10", result: "Normal", status: "complete" },
            { id: "l2", test: "Perfil lipídico", dateISO: "2024-01-10", result: "Normal", status: "complete" },
        ],
        vitals: [
            { id: "v1", metric: "TA", value: "120/80 mmHg", dateISO: "2024-01-15", status: "Normal" },
            { id: "v2", metric: "FC", value: "72 lpm", dateISO: "2024-01-15", status: "Normal" },
            { id: "v3", metric: "Peso", value: "75 kg", dateISO: "2024-01-15", status: "Normal" },
        ],
    },
    p2: {
        consultations: [
            {
                id: "c3",
                dateISO: new Date().toISOString(),
                doctorId: "XX",
                specialty: "Ginecología",
                diagnosis: "Examen de rutina",
                notes: "Buen estado general. Mantener estilo de vida.",
            },
            {
                id: "c4",
                dateISO: new Date().toISOString(),
                doctorId: "XX",
                specialty: "Clínica",
                diagnosis: "Resfrío común",
                notes: "Reposo e hidratación.",
            },
            {
                id: "c5",
                dateISO: new Date().toISOString(),
                doctorId: "XX",
                specialty: "Clínica",
                diagnosis: "Resfrío común",
                notes: "Reposo e hidratación.",
            },
        ],
        medications: [
            { id: "m3", name: "Lisinopril", dosage: "10 mg", frequency: "1 vez al día", status: "active" },
            { id: "m4", name: "Aspirina", dosage: "81 mg", frequency: "1 vez al día", status: "active" },
        ],
        labs: [
            { id: "l3", test: "Hemograma", dateISO: "2024-01-10", result: "Normal", status: "complete" },
            { id: "l4", test: "Perfil lipídico", dateISO: "2024-01-10", result: "Normal", status: "complete" },
        ],
        vitals: [
            { id: "v4", metric: "TA", value: "120/80 mmHg", dateISO: "2024-01-15", status: "Normal" },
            { id: "v5", metric: "FC", value: "72 lpm", dateISO: "2024-01-15", status: "Normal" },
            { id: "v6", metric: "Peso", value: "75 kg", dateISO: "2024-01-15", status: "Normal" },
        ],
    }
};

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

            clinicalRecords: seedClinical,

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

            upsertClinicalRecord: (patientId, patch) => {
                const cur = get().clinicalRecords[patientId] ?? { consultations: [], medications: [], labs: [], vitals: [] };
                set({
                    clinicalRecords: {
                        ...get().clinicalRecords,
                        [patientId]: {
                            consultations: patch.consultations ?? cur.consultations,
                            medications: patch.medications ?? cur.medications,
                            labs: patch.labs ?? cur.labs,
                            vitals: patch.vitals ?? cur.vitals,
                        },
                    },
                });
            },

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
                clinicalRecords: s.clinicalRecords,
            }),
            migrate: (persisted, _version) => persisted as AppState,
        }
    )
);

export default useAppStore;
