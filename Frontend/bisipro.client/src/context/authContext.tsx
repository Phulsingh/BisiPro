import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import type { AuthSession } from "@/services/authService"

export type CurrentUser = Pick<AuthSession, "userId" | "fullName" | "email" | "role">

type AuthContextValue = {
  user: CurrentUser | null
  token: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  signIn: (session: AuthSession) => void
  logout: () => void
}

const ACCESS_TOKEN_KEY = "accessToken"
const USER_KEY = "user"
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    if (!storedToken || !storedUser) {
      setIsInitializing(false)
      return
    }

    try {
      setToken(storedToken)
      setUser(JSON.parse(storedUser) as CurrentUser)
    } catch {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } finally {
      setIsInitializing(false)
    }
  }, [])

const signIn = useCallback((session: AuthSession) => {
  const currentUser: CurrentUser = {
    userId: session.userId,
    fullName: session.fullName,
    email: session.email,
    role: session.role,
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, session.token)
  localStorage.setItem(USER_KEY, JSON.stringify(currentUser))

  setToken(session.token)
  setUser(currentUser)
}, [])

const logout = useCallback(() => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem("refreshToken")

  setToken(null)
  setUser(null)

  navigate("/login", { replace: true })
}, [navigate])

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
