import type { AuthSession } from "@/services/authService"

/** The subset of the auth session that is safe to keep for the UI. */
export type StoredUser = Pick<AuthSession, "userId" | "fullName" | "email" | "role">

const ACCESS_TOKEN_KEY = "accessToken"
const REFRESH_TOKEN_KEY = "refreshToken"
const USER_KEY = "user"

/**
 * Raised when the access token expired and the refresh token could not renew
 * it. AuthProvider listens for this and sends the user back to the login page.
 */
export const SESSION_EXPIRED_EVENT = "auth:session-expired"

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  getUser(): StoredUser | null {
    const storedUser = localStorage.getItem(USER_KEY)
    if (!storedUser) return null

    try {
      return JSON.parse(storedUser) as StoredUser
    } catch {
      return null
    }
  },

  /** Persists a freshly issued session (login, external login, or refresh). */
  saveSession(session: AuthSession): StoredUser {
    const user: StoredUser = {
      userId: session.userId,
      fullName: session.fullName,
      email: session.email,
      role: session.role,
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, session.token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))

    // The backend rotates the refresh token on every refresh, so an empty
    // value must never overwrite a usable one.
    if (session.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken)
    }

    return user
  },

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}

export function notifySessionExpired(): void {
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
}
