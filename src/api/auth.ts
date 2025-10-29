import apiClient from "@/lib/apiClient";
import Cookies from "js-cookie";
import type {
  User,
  LoginCredentials,
  CodeMfa,
  RegisterDataPatient,
} from "@/types/domain";
import { API_ENPOINTS } from "./enpoints";
import type { StandardResponse } from "@/types/api";
import type { CustomAxiosRequestConfig } from "@/lib/apiClient";
import type { LoginResponse2 as LoginResponse } from "../types/api";

// Respuestas planas (una sola envoltura)
export type RegisterResponse = StandardResponse<{ email: User["email"] }>;
export type LoginResponse2 = StandardResponse<{
  user: User;
  token: string;
  requireMfa?: boolean;
}>;
export type VerifyMfaResponse = StandardResponse<{ user: User; token: string }>;

export const AuthService = {
  register: async (data: RegisterDataPatient) => {
    const res = await apiClient.post<RegisterResponse>(
      API_ENPOINTS.AUTH.REGISTER,
      data,
      { useAuth: false } as CustomAxiosRequestConfig
    );
    return res.data;
  },
  login: async (credentials: LoginCredentials) => {
    const res = await apiClient.post<LoginResponse>(
      API_ENPOINTS.AUTH.LOGIN,
      credentials,
      { useAuth: false } as CustomAxiosRequestConfig
    );

    const data = res.data;
    // Guardar el token en cookies
    if (data.access_token) {
      Cookies.set("token", data.access_token, { sameSite: "strict" });
    }

    // Opcional: guardar usuario en cookies si quieres
    // if (data.data?.user) Cookies.set("user", JSON.stringify(data.data.user), { sameSite: "strict" });

    return data;
  },
  verifyMfa: async (mfaData: CodeMfa) => {
    const res = await apiClient.post<VerifyMfaResponse>(
      API_ENPOINTS.AUTH.VERIFY_MFA,
      mfaData
    );
    return res.data;
  },
};
