import { http, HttpResponse } from "msw";
import type { RegisterDataPatient, User } from "@/types/domain";
import { API_ENPOINTS } from "@/api/enpoints";
import type { RegisterResponse } from "@/api/auth";
import { API_BASE_URL } from "@/lib/apiClient";

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

console.log(API_ENPOINTS.AUTH.REGISTER);
const existingEmails = new Set(["existing@example.com"]);
const existingDocuments = new Set(["12345678-9"]);
export const authHandler = [
  http.post(
    `${API_BASE_URL}${API_ENPOINTS.AUTH.REGISTER}`,
    async ({ request }) => {
      const body = (await request.json()) as RegisterDataPatient;
      console.log("esty ejecutando el handler de msw");
      console.log("--->", body);
      // validacione correo ya existe
      if (existingEmails.has(body.email)) {
        const response: RegisterResponse = {
          success: false,
          message: "User already exists",
          error: {
            code: "AUTH_EMAIL_EXISTS",
          },
        };
        return HttpResponse.json(response, { status: 409 });
      }
      // validacione documento ya existe
      if (existingDocuments.has(body.document)) {
        const response: RegisterResponse = {
          success: false,
          message: "User already exists",
          error: {
            code: "AUTH_DOCUMENT_EXISTS",
          },
        };
        return HttpResponse.json(response, { status: 409 });
      }
      // respuesta exitosa
      const response: RegisterResponse = {
        success: true,
        message: "User registered successfully",
        data: {
          email: mockUser.email,
        },
      };
      return HttpResponse.json(response, { status: 201 });
    }
  ),
  http.post(API_ENPOINTS.AUTH.LOGIN, () => {
    return HttpResponse.json({
      user: mockUser,
      token: "fake-jwt-token",
      requireMfa: true,
    });
  }),
  http.post(API_ENPOINTS.AUTH.VERYIFYMFA, () => {
    return HttpResponse.json({
      user: mockUser,
      token: "fake-jwt-token",
    });
  }),
];
