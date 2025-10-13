import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addMinutes } from "date-fns";


/** Tipos base */
export type Role = "patient" | "doctor" | "admin";
export interface User { id: string; name: string; role: Role; email?: string; }

// + Nuevo tipo
export interface Clinic {
    id: string;
    name: string;
    address?: string;
    city?: string;
    phone?: string;
    geo?: { lat: number; lng: number };
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    color?: string;
    license?: string;          // matrícula/colegiatura
    signaturePng?: string; //url png sin fondo (firma)
    stampPng?: string;  //png sin fondo (sello)
    clinicIds?: string[]; // 👈 nuevo

}
export interface Patient {
    id: string;
    name: string;
    docId: string;
    phone?: string;
    notes?: string;
    insurance?: {
        provider?: string;       // obra social / seguro
        plan?: string;
        memberId?: string;       // nro. afiliado / póliza
    };
    clinicIds?: string[]; // 👈 nuevo
}

export type DoctorSnapshot = {
    name: string;
    license?: string;
    signaturePng?: string;
    stampPng?: string;
};

export type PatientSnapshot = {
    name: string;
    docId?: string;
    insurance?: Patient["insurance"];
};


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
    status?: "Normal" | "Alto" | "Bajo";
};

// ++++ certificados-recetas PDF +++
// Documentos
export type Certificate = {
    id: string;
    dateISO: string;
    doctorId: string;
    patientId: string;
    reason: string;            // “certifica que…”
    recommendations?: string;  // reposo, restricciones, etc.
    period?: { fromISO: string; toISO: string };
    fileUrl?: string;          // blob URL del PDF generado
    doctorSnapshot?: DoctorSnapshot;
    patientSnapshot?: PatientSnapshot;
};

export type RxItem = {
    drug: string;
    dose: string;              // “500 mg”
    frequency: string;         // “cada 8 h”
    duration: string;          // “7 días”
    notes?: string;
};
export type Prescription = {
    id: string;
    dateISO: string;
    doctorId: string;
    patientId: string;
    diagnosis?: string;
    items: RxItem[];
    insuranceSnapshot?: Patient["insurance"]; // copia al momento de emitir
    fileUrl?: string;

    doctorSnapshot?: DoctorSnapshot;
    patientSnapshot?: PatientSnapshot;
};

// ++++ FIN - certificados-recetas PDF +++

export type ClinicalRecord = {
    consultations: Consultation[];
    medications: Medication[];
    labs: LabResult[];
    vitals: Vital[];
    certificates?: Certificate[];
    prescriptions?: Prescription[];
};


export interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    startsAt: string;
    endsAt: string;
    type: "presencial" | "virtual";
    status: "pending" | "confirmed" | "cancelled";
    clinicId?: string; // 👈 nuevo
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
    currentClinicId?: string; // 👈 nuevo
    accessToken?: string;
    refreshToken?: string;

    // “BD” mock
    users: AuthUser[];
    clinics: Clinic[];         // 👈 nuevo
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

    updateAppointment: (id: string, patch: Partial<Appointment>) => void;
    deleteAppointment: (id: string) => void;

    // gestion paciente
    addPatient: (p: Omit<Patient, "id"> & { id?: string }) => string; // devuelve id
    updatePatient: (id: string, patch: Partial<Patient>) => void;
    deletePatient?: (id: string) => void;

    // nota clinica
    addConsultation: (
        patientId: string,
        data: Omit<Consultation, "id" | "doctorId" | "dateISO"> & { dateISO?: string }
    ) => string;

    // para certificados-recetas
    updateDoctorProfile: (patch: Partial<Doctor>) => void;
    addCertificate: (
        patientId: string,
        data: Omit<Certificate, "id" | "doctorId" | "dateISO" | "patientId">
            & { dateISO?: string; fileUrl?: string }
    ) => string;

    addPrescription: (
        patientId: string,
        data: Omit<Prescription, "id" | "doctorId" | "dateISO" | "patientId">
            & { dateISO?: string; fileUrl?: string }
    ) => string;

    // acciones clínicas
    setCurrentClinic: (clinicId: string) => void;
    assignDoctorToClinic: (doctorId: string, clinicId: string) => void;
    assignPatientToClinic: (patientId: string, clinicId: string) => void;
    unassignDoctorFromClinic: (doctorId: string, clinicId: string) => void;
    unassignPatientFromClinic: (patientId: string, clinicId: string) => void;

    addMedicationEntry: (
        patientId: string,
        data: Omit<Medication, "id">
    ) => string;

    addLabResult: (
        patientId: string,
        data: Omit<LabResult, "id">
    ) => string;

    addVitalSign: (
        patientId: string,
        data: Omit<Vital, "id">
    ) => string;

    // MEDICATIONS
    updateMedication: (patientId: string, id: string, patch: Partial<Medication>) => void;
    deleteMedication: (patientId: string, id: string) => void;

    // LABS
    updateLab: (patientId: string, id: string, patch: Partial<LabResult>) => void;
    deleteLab: (patientId: string, id: string) => void;

    // VITALS
    updateVital: (patientId: string, id: string, patch: Partial<Vital>) => void;
    deleteVital: (patientId: string, id: string) => void;

}

const seedClinics: Clinic[] = [
    {
        id: "c1",
        name: "Hospital Privado Regional del Sur",
        address: "20 de Febrero 598",
        city: "San Carlos de Bariloche, Río Negro",
        phone: "+54 2944 525000",
        geo: { lat: -41.13726414478574, lng: -71.31203699238564 },
    },
    {
        id: "c2",
        name: "Hospital Zonal Dr. Ramón Carrillo",
        address: "Francisco Pascasio Moreno 601",
        city: "San Carlos de Bariloche, Río Negro",
        phone: "+54 2944 426100",
        geo: { lat: -41.13620671740496, lng: -71.3000110554434 },
    }
];

/** Seeds demo */
const seedDoctors: Doctor[] = [
    { id: "d1", name: "Dra. Sofía Pérez", specialty: "Clínica", color: "#A7D8F0", clinicIds: ["c1"] },
    { id: "d2", name: "Dr. Martín Gómez", specialty: "Pediatría", color: "#BEE7C8", clinicIds: ["c1"] },
    { id: "d3", name: "Dra. Laura Martínez", specialty: "Ginecología", color: "#FAD2CF", clinicIds: ["c2"] },
    { id: "d4", name: "Dr. Carlos Sánchez", specialty: "Cardiología", color: "#F0E1D1", clinicIds: ["c2"] },
];
const seedPatients: Patient[] = [
    { id: "p1", name: "Juan Ramírez", docId: "34.567.890", phone: "+54 9 294 123", notes: "Alergia a penicilina", clinicIds: ["c1"] },
    { id: "p2", name: "Ana Díaz", docId: "29.111.222", phone: "+54 9 2944396777", notes: "Alergia a penicilina", clinicIds: ["c1"] },
    { id: "p3", name: "Carlos Rodríguez", docId: "XX.333.444", phone: "+54 9 294 123", notes: "Alergia a penicilina", clinicIds: ["c1"] },
    { id: "p4", name: "María López", docId: "XX.555.666", phone: "+54 9 294 123", notes: "Alergia a penicilina", clinicIds: ["c1"] },
    { id: "p5", name: "Pedro Gómez", docId: "XX.777.888", phone: "+54 9 294 123", notes: "Alergia a penicilina", clinicIds: ["c2"] },
    { id: "p6", name: "Laura Sánchez", docId: "XX.999.000", phone: "+54 9 294 123", notes: "Alergia a penicilina", clinicIds: ["c2"] },
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
        certificates: [
            {
                id: "cert-1",
                patientId: "p1",
                doctorId: "d1",
                dateISO: "2025-10-13T01:53:10.060Z",
                reason: "ha sido atendido/a en consulta médica",
                recommendations: "mensaje de pruebas",
                period: {
                    "fromISO": "2025-10-12",
                    "toISO": "2025-10-12"
                },
                fileUrl: "blob:http://localhost:5173/bdc6dda5-1b46-4cea-af7c-9ecfddd69407",
                doctorSnapshot: {
                    name: "Dra. Sofía Pérez"
                },
                patientSnapshot: {
                    name: "Juan Ramírez",
                    docId: "34.567.890"
                }
            }
        ],
        prescriptions: [
            {
                id: "prx-1",
                patientId: "p1",
                doctorId: "d1",
                dateISO: "2025-10-13T01:59:23.871Z",
                diagnosis: "Fiebre Alta",
                items: [
                    {
                        "drug": "Ibuprofeno",
                        "dose": "300 mg",
                        "frequency": "cada 8 hs",
                        "duration": "3 Dias",
                        "notes": "medicamento para bajar la fiebre alta, nota de pruebas ..."
                    }
                ],
                fileUrl: "blob:http://localhost:5173/e252a072-f7f8-4145-ab49-9d2a9ba26bc6",
                doctorSnapshot: {
                    name: "Dra. Sofía Pérez"
                },
                patientSnapshot: {
                    name: "Juan Ramírez",
                    docId: "34.567.890"
                }
            }
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
            clinics: seedClinics,
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
                const s = get();
                const doc = u.linkedDoctorId ? s.doctors.find(d => d.id === u.linkedDoctorId) : undefined;
                set({
                    currentUser: { id: u.id, name: u.name, role: u.role, email: u.email },
                    currentDoctorId: u.linkedDoctorId,
                    currentPatientId: u.linkedPatientId,
                    currentClinicId: doc?.clinicIds?.[0] ?? s.currentClinicId ?? s.clinics[0]?.id, // 👈
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
            // addAppointment: (a) => set({ appointments: [...get().appointments, a] }),
            // Al crear turnos, guardar clinicId activa (sin romper compat)
            addAppointment: (a) =>
                set(s => ({
                    appointments: [...s.appointments, { ...a, clinicId: a.clinicId ?? s.currentClinicId }]
                })),

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
            updateAppointment: (id, patch) =>
                set((s) => ({
                    appointments: s.appointments.map((a) =>
                        a.id === id ? { ...a, ...patch } : a
                    ),
                })),

            deleteAppointment: (id) =>
                set((s) => ({
                    appointments: s.appointments.filter((a) => a.id !== id),
                })),


            // gestio paciente
            addPatient: (p) => {
                const id = p.id ?? `p-${crypto.randomUUID()}`;
                set((s) => ({ patients: [...s.patients, { id, ...p }] }));
                return id;
            },

            updatePatient: (id, patch) =>
                set((s) => ({
                    patients: s.patients.map(pt => (pt.id === id ? { ...pt, ...patch } : pt)),
                })),

            deletePatient: (id) =>
                set((s) => ({ patients: s.patients.filter(pt => pt.id !== id) })),

            // nota clinica
            addConsultation: (patientId, data) => {
                const id = `c-${crypto.randomUUID()}`;
                const s = get();
                const doctorId =
                    s.currentDoctorId ||
                    s.doctors.find((d) => d.name === s.currentUser?.name)?.id ||
                    s.doctors[0]?.id ||
                    "d-unknown";

                const next: Consultation = {
                    id,
                    doctorId,
                    dateISO: data.dateISO ?? new Date().toISOString(),
                    specialty: data.specialty,
                    diagnosis: data.diagnosis,
                    notes: data.notes,
                };

                const cur = s.clinicalRecords[patientId] ?? {
                    consultations: [],
                    medications: [],
                    labs: [],
                    vitals: [],
                };
                set({
                    clinicalRecords: {
                        ...s.clinicalRecords,
                        [patientId]: {
                            ...cur,
                            consultations: [...cur.consultations, next],
                        },
                    },
                });

                return id;
            },

            updateDoctorProfile: (patch) => {
                const s = get();
                const id = s.currentDoctorId;
                if (!id) return;
                set({
                    doctors: s.doctors.map(d => d.id === id ? { ...d, ...patch } : d)
                });
            },

            addCertificate: (patientId, data) => {
                const s = get();
                const id = `cert-${crypto.randomUUID()}`;
                const doctorId = s.currentDoctorId || s.doctors[0]?.id || "d-unknown";
                const cur = s.clinicalRecords[patientId] ?? { consultations: [], medications: [], labs: [], vitals: [] };
                const doc: Certificate = {
                    id, patientId, doctorId,
                    dateISO: data.dateISO ?? new Date().toISOString(),
                    reason: data.reason,
                    recommendations: data.recommendations,
                    period: data.period,
                    fileUrl: data.fileUrl,

                    // 👇 nuevos (opcionales)
                    doctorSnapshot: data.doctorSnapshot,
                    patientSnapshot: data.patientSnapshot,
                };
                set({
                    clinicalRecords: {
                        ...s.clinicalRecords,
                        [patientId]: { ...cur, certificates: [...(cur.certificates ?? []), doc] }
                    }
                });
                return id;
            },

            addPrescription: (patientId, data) => {
                const s = get();
                const id = `rx-${crypto.randomUUID()}`;
                const doctorId = s.currentDoctorId || s.doctors[0]?.id || "d-unknown";
                const cur = s.clinicalRecords[patientId] ?? { consultations: [], medications: [], labs: [], vitals: [] };
                const rx: Prescription = {
                    id, patientId, doctorId,
                    dateISO: data.dateISO ?? new Date().toISOString(),
                    diagnosis: data.diagnosis,
                    items: data.items,
                    insuranceSnapshot: data.insuranceSnapshot,
                    fileUrl: data.fileUrl,

                    // 👇 nuevos (opcionales)
                    doctorSnapshot: data.doctorSnapshot,
                    patientSnapshot: data.patientSnapshot,
                };
                set({
                    clinicalRecords: {
                        ...s.clinicalRecords,
                        [patientId]: { ...cur, prescriptions: [...(cur.prescriptions ?? []), rx] }
                    }
                });
                return id;
            },
            setCurrentClinic: (clinicId) => set({ currentClinicId: clinicId }),

            assignDoctorToClinic: (doctorId, clinicId) =>
                set(s => ({
                    doctors: s.doctors.map(d => d.id === doctorId
                        ? { ...d, clinicIds: Array.from(new Set([...(d.clinicIds ?? []), clinicId])) }
                        : d
                    )
                })),

            unassignDoctorFromClinic: (doctorId, clinicId) =>
                set(s => ({
                    doctors: s.doctors.map(d => d.id === doctorId
                        ? { ...d, clinicIds: (d.clinicIds ?? []).filter(id => id !== clinicId) }
                        : d
                    )
                })),

            assignPatientToClinic: (patientId, clinicId) =>
                set(s => ({
                    patients: s.patients.map(p => p.id === patientId
                        ? { ...p, clinicIds: Array.from(new Set([...(p.clinicIds ?? []), clinicId])) }
                        : p
                    )
                })),

            unassignPatientFromClinic: (patientId, clinicId) =>
                set(s => ({
                    patients: s.patients.map(p => p.id === patientId
                        ? { ...p, clinicIds: (p.clinicIds ?? []).filter(id => id !== clinicId) }
                        : p
                    )
                })),

            // para la seccion historia clinica
            addMedicationEntry: (patientId, data) => {
                const id = `m-${crypto.randomUUID()}`;
                const s = get();
                const cur = s.clinicalRecords[patientId] ?? { consultations: [], medications: [], labs: [], vitals: [] };
                const next: Medication = { id, ...data };
                set({
                    clinicalRecords: {
                        ...s.clinicalRecords,
                        [patientId]: { ...cur, medications: [...(cur.medications ?? []), next] }
                    }
                });
                return id;
            },

            addLabResult: (patientId, data) => {
                const id = `l-${crypto.randomUUID()}`;
                const s = get();
                const cur = s.clinicalRecords[patientId] ?? { consultations: [], medications: [], labs: [], vitals: [] };
                const next: LabResult = { id, ...data };
                set({
                    clinicalRecords: {
                        ...s.clinicalRecords,
                        [patientId]: { ...cur, labs: [...(cur.labs ?? []), next] }
                    }
                });
                return id;
            },

            addVitalSign: (patientId, data) => {
                const id = `v-${crypto.randomUUID()}`;
                const s = get();
                const cur = s.clinicalRecords[patientId] ?? { consultations: [], medications: [], labs: [], vitals: [] };
                const next: Vital = { id, ...data };
                set({
                    clinicalRecords: {
                        ...s.clinicalRecords,
                        [patientId]: { ...cur, vitals: [...(cur.vitals ?? []), next] }
                    }
                });
                return id;
            },

            // MEDICATIONS
            updateMedication: (patientId, id, patch) => {
                const s = get();
                const rec = s.clinicalRecords[patientId];
                if (!rec) return;
                const meds = rec.medications.map(m => (m.id === id ? { ...m, ...patch } : m));
                set({ clinicalRecords: { ...s.clinicalRecords, [patientId]: { ...rec, medications: meds } } });
            },
            deleteMedication: (patientId, id) => {
                const s = get();
                const rec = s.clinicalRecords[patientId];
                if (!rec) return;
                const meds = rec.medications.filter(m => m.id !== id);
                set({ clinicalRecords: { ...s.clinicalRecords, [patientId]: { ...rec, medications: meds } } });
            },

            // LABS
            updateLab: (patientId, id, patch) => {
                const s = get();
                const rec = s.clinicalRecords[patientId];
                if (!rec) return;
                const labs = rec.labs.map(l => (l.id === id ? { ...l, ...patch } : l));
                set({ clinicalRecords: { ...s.clinicalRecords, [patientId]: { ...rec, labs } } });
            },
            deleteLab: (patientId, id) => {
                const s = get();
                const rec = s.clinicalRecords[patientId];
                if (!rec) return;
                const labs = rec.labs.filter(l => l.id !== id);
                set({ clinicalRecords: { ...s.clinicalRecords, [patientId]: { ...rec, labs } } });
            },

            // VITALS
            updateVital: (patientId, id, patch) => {
                const s = get();
                const rec = s.clinicalRecords[patientId];
                if (!rec) return;
                const vitals = rec.vitals.map(v => (v.id === id ? { ...v, ...patch } : v));
                set({ clinicalRecords: { ...s.clinicalRecords, [patientId]: { ...rec, vitals } } });
            },
            deleteVital: (patientId, id) => {
                const s = get();
                const rec = s.clinicalRecords[patientId];
                if (!rec) return;
                const vitals = rec.vitals.filter(v => v.id !== id);
                set({ clinicalRecords: { ...s.clinicalRecords, [patientId]: { ...rec, vitals } } });
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
                currentClinicId: s.currentClinicId,     // 👈
                accessToken: s.accessToken,
                refreshToken: s.refreshToken,
                users: s.users,
                clinics: s.clinics,                      // 👈
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
