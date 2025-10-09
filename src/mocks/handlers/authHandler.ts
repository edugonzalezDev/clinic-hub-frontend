import { http, HttpResponse } from "msw";
import type { RegisterDataPatient, User } from "@/types/domain";
import { API_ENPOINTS } from "@/api/enpoints";
import type { RegisterResponse, LoginResponse, VerifyMfaResponse } from "@/api/auth";
import { API_BASE_URL } from "@/lib/apiClient";

const R = (path: string) => `${API_BASE_URL ?? ""}${path}`;

const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "patient",
  phone: "123456789",
  document: "123456789",
  createdAt: new Date(),
  updatedAt: new Date(),
  isFirstLogin: false,
};

const existingEmails = new Set(["existing@example.com"]);
const existingDocuments = new Set(["12345678-9"]);

export const authHandler = [
  // REGISTER
  http.post(R(API_ENPOINTS.AUTH.REGISTER), async ({ request }) => {
    const body = (await request.json()) as RegisterDataPatient;

    if (existingEmails.has(body.email)) {
      const response: RegisterResponse = {
        success: false,
        message: "User already exists",
        error: { code: "AUTH_EMAIL_EXISTS" as const },
      };
      return HttpResponse.json(response, { status: 409 });
    }
    if (existingDocuments.has(body.document)) {
      const response: RegisterResponse = {
        success: false,
        message: "User already exists",
        error: { code: "AUTH_DOCUMENT_EXISTS" as const },
      };
      return HttpResponse.json(response, { status: 409 });
    }

    const response: RegisterResponse = {
      success: true,
      message: "User registered successfully",
      data: { email: mockUser.email },
    };
    return HttpResponse.json(response, { status: 201 });
  }),

  // LOGIN
  http.post(R(API_ENPOINTS.AUTH.LOGIN), async () => {
    const response: LoginResponse = {
      success: true,
      message: "OK",
      data: { user: mockUser, token: "fake-jwt-token", requireMfa: true },
    };
    return HttpResponse.json(response);
  }),

  // VERIFY MFA
  http.post(R(API_ENPOINTS.AUTH.VERIFY_MFA), async () => {
    const response: VerifyMfaResponse = {
      success: true,
      message: "OK",
      data: { user: mockUser, token: "fake-jwt-token" },
    };
    return HttpResponse.json(response);
  }),
];
