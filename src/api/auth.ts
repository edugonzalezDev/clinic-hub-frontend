import { apiClient } from "@/libs/apiClient";
import type {
  User,
  LoginCredentials,
  CodeMfa,
  RegisterData,
} from "@/types/domain";
import { API_ENPOINTS } from "./enpoints";
import type { StandardResponse } from "@/types/api";

type AuthResponse = StandardResponse<User>;
export type RegisterResponse = StandardResponse<{email: User['email']}>;
export const AuthService = {
  reigister: async (data: RegisterData) => {
    const response = await apiClient.post<RegisterResponse>(
      API_ENPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<StandardResponse<AuthResponse>>(
      API_ENPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },
  verifyMfa: async (mfaData: CodeMfa) => {
    const response = await apiClient.post<AuthResponse>(
      API_ENPOINTS.AUTH.VERYIFYMFA,
      mfaData
    );
    return response.data;
  },
};
