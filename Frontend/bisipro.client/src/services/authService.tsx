import { apiService, type ApiResponse } from "@/config/apiService"
import { refreshSession } from "@/config/axiosConfig"

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
  refreshToken: string
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
  },

  /**
   * Exchanges the stored refresh token for a new session. Expired access tokens
   * are already refreshed automatically by the axios interceptor; call this
   * only to renew the session ahead of a request.
   *
   * @returns the new access token, or null when the session can no longer be renewed.
   */
  refresh() {
    return refreshSession()
  }

}
