import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import { SESSION_EXPIRED_EVENT, tokenStorage } from "@/config/tokenStorage"
import { authService, type AuthSession } from "@/services/authService"

export type CurrentUser = Pick<AuthSession, "userId" | "fullName" | "email" | "role">

type AuthContextValue = {
  user: CurrentUser | null
  token: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  signIn: (session: AuthSession) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const storedToken = tokenStorage.getAccessToken()
    const storedUser = tokenStorage.getUser()

    if (!storedToken || !storedUser) {
      tokenStorage.clear()
      setIsInitializing(false)
      return
    }

    setToken(storedToken)
    setUser(storedUser)
    setIsInitializing(false)
  }, [])

  const signIn = useCallback((session: AuthSession) => {
    const currentUser = tokenStorage.saveSession(session)

    setToken(session.token)
    setUser(currentUser)
  }, [])

  const clearSession = useCallback(() => {
    tokenStorage.clear()

    setToken(null)
    setUser(null)
  }, [])

  const logout = useCallback(() => {
    // Only the server can drop the HttpOnly refresh cookie, and revoking the
    // token there stops the session being renewed after sign out.
    void authService.logout()

    clearSession()
    navigate("/login", { replace: true })
  }, [clearSession, navigate])

  // The axios interceptor raises this once the refresh cookie can no longer
  // renew the session, so React state has to catch up with the cleared storage.
  useEffect(() => {
    const handleSessionExpired = () => {
      clearSession()
      navigate("/login", { replace: true })
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [clearSession, navigate])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isInitializing,
      signIn,
      logout,
    }),
    [user, token, isInitializing, signIn, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider.")
  return context
}
