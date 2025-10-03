import { http, HttpResponse } from "msw";
import type { User } from "@/types/domain";
import { API_ENPOINTS } from "@/api/enpoints";
import type { RegisterResponse } from "@/api/auth";

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

export const authHandler = [
  http.post(API_ENPOINTS.AUTH.REGISTER, async ({request}) => {
    const body = await request.json()
    console.log(body)
    // respuesta exitosa
    const response: RegisterResponse = {
      success: true,
      message: "User registered successfully",
      data: {
        email: mockUser.email,
      },
    }
    return HttpResponse.json(response,{status: 201});
  }),
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
