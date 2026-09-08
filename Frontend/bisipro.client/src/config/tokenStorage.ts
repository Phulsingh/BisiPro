import type { AuthSession } from "@/services/authService"

/** The subset of the auth session that is safe to keep for the UI. */
export type StoredUser = Pick<AuthSession, "userId" | "fullName" | "email" | "role">

const ACCESS_TOKEN_KEY = "accessToken"
const USER_KEY = "user"

/**
 * The refresh token is deliberately absent here. The backend keeps it in an
 * HttpOnly cookie, which this code cannot read or write, so a script injected
 * into the page cannot steal a long-lived credential. The browser attaches the
 * cookie to `auth/refresh` and `auth/logout` on its own.
 */
export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
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

    return user
  },

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    // Left over from the previous localStorage-based implementation.
    localStorage.removeItem("refreshToken")
  },
}

/**
 * Raised when the access token expired and the refresh cookie could not renew
 * it. AuthProvider listens for this and sends the user back to the login page.
 */
export const SESSION_EXPIRED_EVENT = "auth:session-expired"

export function notifySessionExpired(): void {
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
}
