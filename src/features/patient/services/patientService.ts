import Cookies from "js-cookie";
import { get, post, put, del } from "../../../lib/apiService";
import type { VitalSign } from "../store/usePatientStore";

// Interfaz para el usuario
interface User {
  id: string;
  full_name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  is_active: boolean;
}

interface Clinic {
  id: string; // ID de la clínica
  name: string; // Nombre de la clínica
  city: string; // Ciudad donde se encuentra la clínica
  address: string; // Dirección de la clínica
  phone: string; // Teléfono de contacto de la clínica
  photo_url: string; // URL de la foto o logo de la clínica
  lat: number; // Latitud para ubicación en mapa
  lng: number; // Longitud para ubicación en mapa
}
// Interfaz para el doctor
interface Doctor {
  id: string; // Identificador único del doctor
  user_id: string; // ID del usuario asociado (si es diferente del doctor)
  name: string; // Nombre completo del doctor
  specialty: string; // Especialidad del doctor
  email: string; // Correo electrónico del doctor
  phone: string; // Teléfono de contacto
  color: string; // Color asociado con el doctor (posiblemente para UI)
  license: string; // Número de licencia médica
  signature_png: string; // URL o base64 de la firma del doctor en formato PNG
  stamp_png: string; // URL o base64 del sello del doctor en formato PNG
  photo_url: string; // URL de la foto del doctor
  sex: "male" | "female" | "other"; // Sexo del doctor, restringido a valores válidos
  birth_date: string; // Fecha de nacimiento del doctor (en formato "YYYY-MM-DD")
  clinics: string[]; // Lista de IDs de clínicas donde trabaja el doctor
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
  clinic: {
    id: string;
    name: string;
    address: string;
    photo_url?: string;
    lng: number;
    lat: number;
    phone: string;
    city: string;
  };
  specialty: string;
  doctor_name: string;
}

// Obtener usuario
export const getUser = async (): Promise<User> => {
  const response = await get<{ user: User }>("/auth/me");
  return response.user;
};

// Crear un usuario
export const createUser = async (data: Omit<User, "id">): Promise<User> => {
  return post<User>("/users", data);
};

// Actualizar un usuario
export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  return put<User, Partial<User>>(`/users/${id}`, data);
};

// Eliminar un usuario
export const deleteUser = async (id: string): Promise<void> => {
  return del<void>(`/users/${id}`);
};

// Obtener el ID del usuario desde el token (almacenado en las cookies)
const getUserIdFromToken = (): string | null => {
  const token = Cookies.get("token"); // El nombre de la cookie puede variar, ajusta si es necesario
  if (!token) return null;

  // Decodificar el token JWT (asumiendo que es un JWT y el 'sub' es el ID del usuario)
  const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica el payload del JWT
  return payload.sub || null; // 'sub' contiene el ID del usuario
};

// Obtener los signos vitales del paciente usando el ID extraído del token
export const getVitals = async (): Promise<VitalSign[]> => {
  const userId = getUserIdFromToken(); // Obtener el ID del paciente

  if (!userId) {
    throw new Error("No se pudo obtener el ID del usuario del token.");
  }

  // Llamar al endpoint usando el ID del usuario
  const response = await get<VitalSign[]>(`/patients/${userId}/vital_signs`);
  return response;
};

export const getClinics = async (): Promise<Clinic[]> => {
  const response = await get<Clinic[]>("/clinics");
  return response;
};

export const getDoctors = async (
  clinicId: string,
  specialty: string
): Promise<Doctor[]> => {
  const response = await get<Doctor[]>(
    `/doctors/clinic/${clinicId}/specialty/${specialty}?limit=50&offset=0`
  );
  return response;
};

export const postAppointment = async (data: {
  patient_id: string;
  doctor_id: string;
  clinic_id: string; // Agregar clinic_id
  starts_at: string; // Fecha de inicio
  ends_at: string; // Fecha de fin
  type: "presencial" | "virtual"; // Tipo de cita
  status: "pending" | "confirmed" | "cancelled"; // Estado de la cita
}): Promise<void> => {
  return post<void>("/appointments", data);
};

export const getAppointmentHistory = async (): Promise<Appointment[]> => {
  const response = await get<Appointment[]>(
    `/appointments/patient/me/with-specialty`
  );
  return response;
};
