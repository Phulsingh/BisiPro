import { apiService, type ApiResponse } from "@/config/apiService"

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  phoneNumber: string
  password: string
}

export type AuthSession = {
  userId: string
  fullName: string
  email: string
  token: string
}

/** The authentication envelope returned by the BisiPro backend. */
export type AuthResponse = ApiResponse<AuthSession>
export type RegisterResponse = ApiResponse<unknown>

export const authService = {
  login(credentials: LoginRequest) {
    return apiService.post<AuthResponse, LoginRequest>("auth/login", credentials)
  },

  register(user: RegisterRequest) {
    return apiService.post<RegisterResponse, RegisterRequest>("auth/register", user)
  },
}
