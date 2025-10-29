export interface StandardResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: Record<string, unknown>;
  };
}

// Datos de autenticación
export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  role: "patient" | "doctor";
  is_active: boolean;
}

export interface AuthData {
  access_token: string;
  token_type: "bearer";
  user: AuthUser;
  linkedDoctorId?: string;
  linkedPatientId?: string;
}

// Respuesta del login
export type LoginResponse = StandardResponse<AuthData>;

export type User = {
  id: string;
  full_name: string;
  email: string;
  role: "patient" | "doctor" | string;
  is_active: boolean;
};

export type LoginResponse2 = {
  access_token: string;
  token_type: "bearer" | string;
  user: User;
  linkedDoctorId?: string | null;
  linkedPatientId?: string | null;
};
