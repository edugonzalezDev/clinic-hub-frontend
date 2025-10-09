import { apiClient } from "@/lib/apiClient";
import type {
  User,
  LoginCredentials,
  CodeMfa,
  RegisterDataPatient,
} from "@/types/domain";
import { API_ENPOINTS } from "./enpoints";
import type { StandardResponse } from "@/types/api";

// Respuestas planas (una sola envoltura)
export type RegisterResponse = StandardResponse<{ email: User["email"] }>;
export type LoginResponse = StandardResponse<{ user: User; token: string; requireMfa?: boolean }>;
export type VerifyMfaResponse = StandardResponse<{ user: User; token: string }>;

export const AuthService = {
  register: async (data: RegisterDataPatient) => {
    const res = await apiClient.post<RegisterResponse>(API_ENPOINTS.AUTH.REGISTER, data);
    return res.data;
  },
  login: async (credentials: LoginCredentials) => {
    const res = await apiClient.post<LoginResponse>(API_ENPOINTS.AUTH.LOGIN, credentials);
    return res.data;
  },
  verifyMfa: async (mfaData: CodeMfa) => {
    const res = await apiClient.post<VerifyMfaResponse>(API_ENPOINTS.AUTH.VERIFY_MFA, mfaData);
    return res.data;
  },
};
