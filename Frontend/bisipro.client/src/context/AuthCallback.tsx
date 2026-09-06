import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { useAuth } from "@/context/authContext"
import type { AuthSession } from "@/services/authService"

export function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { signIn } = useAuth()

  useEffect(() => {
    const token = searchParams.get("token")
    const userId = searchParams.get("userId")
    const fullName = searchParams.get("fullName")
    const email = searchParams.get("email")
    const role = searchParams.get("role")

    if (!token || !userId || !fullName || !email || !role) {
      navigate("/login", { replace: true })
      return
    }

    const session: AuthSession = {
      userId,
      fullName,
      email,
      token,
      role,
    }

    signIn(session)

    navigate("/dashboard", { replace: true })
  }, [searchParams, signIn, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-sm text-[#60736c]">
          Signing you in...
        </p>
      </div>
    </div>
  )
}