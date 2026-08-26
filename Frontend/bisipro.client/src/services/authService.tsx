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
  /** Role name as issued by the backend, e.g. "Admin" | "Agent" | "User" */
  role: string
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

  forgotPassword(email: string) {
    return apiService.post<ApiResponse<unknown>, { email: string }>("auth/forgot-password", { email })
  },

  resetPassword(token: string, newPassword: string) {
    return apiService.post<ApiResponse<unknown>, { token: string; newPassword: string }>("auth/reset-password", {
      token,
      newPassword
    })
  }

}
