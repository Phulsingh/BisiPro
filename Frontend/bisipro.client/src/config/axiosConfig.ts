import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"

import { getConfig, loadConfig } from "@/config/configService"
import { notifySessionExpired, tokenStorage } from "@/config/tokenStorage"
import type { ApiResponse } from "@/config/apiService"
import type { AuthSession } from "@/services/authService"

type RetriableRequest = InternalAxiosRequestConfig & { _retriedAfterRefresh?: boolean }

export const apiClient = axios.create({
  timeout: 30_000,
  headers: { Accept: "application/json" },
})

/**
 * Refreshing runs on its own client so it never re-enters the interceptors
 * below, which would loop when the refresh call itself answers 401.
 */
const refreshClient = axios.create({
  timeout: 30_000,
  headers: { Accept: "application/json" },
})

/** Endpoints that issue tokens: a 401 from these is a real failure, not an expiry. */
const TOKEN_ENDPOINTS = [
  "auth/login",
  "auth/register",
  "auth/refresh",
  "auth/forgot-password",
  "auth/reset-password",
]

const isTokenEndpoint = (url: string | undefined) =>
  Boolean(url) && TOKEN_ENDPOINTS.some((endpoint) => url!.includes(endpoint))

apiClient.interceptors.request.use((request) => {
  const accessToken = tokenStorage.getAccessToken()

  if (accessToken && !request.headers.Authorization) {
    request.headers.Authorization = `Bearer ${accessToken}`
  }

  return request
})

/**
 * Only one refresh may be in flight: the backend revokes the old refresh token
 * as soon as it issues a new one, so parallel calls would invalidate each other.
 */
let refreshRequest: Promise<string | null> | null = null

/** Exchanges the stored refresh token for a new session. Returns the new access token. */
export async function refreshSession(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) return null

  try {
    const response = await refreshClient.post<ApiResponse<AuthSession>>(
      "auth/refresh",
      { refreshToken },
      { baseURL: apiClient.defaults.baseURL }
    )

    const session = response.data.data
    if (!response.data.isSuccess || !session?.token) return null

    tokenStorage.saveSession(session)
    return session.token
  } catch {
    return null
  }
}

function refreshOnce(): Promise<string | null> {
  refreshRequest ??= refreshSession().finally(() => {
    refreshRequest = null
  })

  return refreshRequest
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetriableRequest | undefined

    if (
      !request ||
      error.response?.status !== 401 ||
      request._retriedAfterRefresh ||
      isTokenEndpoint(request.url)
    ) {
      return Promise.reject(error)
    }

    request._retriedAfterRefresh = true

    const accessToken = await refreshOnce()

    if (!accessToken) {
      tokenStorage.clear()
      notifySessionExpired()
      return Promise.reject(error)
    }

    request.headers.Authorization = `Bearer ${accessToken}`
    return apiClient(request)
  }
)

/** Load runtime configuration and apply its API base URL before the app mounts. */
export async function initializeApiClient(): Promise<void> {
  await loadConfig()
  apiClient.defaults.baseURL = getConfig().apiBaseUrl
  refreshClient.defaults.baseURL = getConfig().apiBaseUrl
}
