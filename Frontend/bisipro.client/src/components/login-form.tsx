import { ArrowRight, LockKeyhole } from "lucide-react"
import { isAxiosError } from "axios"
import { type FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/authContext"
import { authService } from "@/services/authService"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await authService.login({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      })

      if (!response.isSuccess || !response.data) {
        setErrorMessage(response.error || "Your email or password is incorrect.")
        return
      }

      signIn(response.data)
      navigate("/dashboard", { replace: true })
    } catch (error) {
      if (isAxiosError<{ error?: string; message?: string }>(error)) {
        setErrorMessage(error.response?.data?.error || error.response?.data?.message || "Your email or password is incorrect.")
      } else {
        setErrorMessage("We could not sign you in. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={cn("w-full max-w-[27rem]", className)} aria-labelledby="login-heading" {...props}>
      <div className="mb-8">
        <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#078a76] uppercase">Account access</p>
        <h1 id="login-heading" className="font-serif text-4xl leading-[1.06] font-semibold tracking-[-0.045em] text-[#183630] sm:text-[2.7rem]">Welcome back.</h1>
        <p className="mt-3 max-w-sm text-[0.95rem] leading-6 text-[#60736c]">Sign in to keep your business moving with clarity and confidence.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-[#29463f]">Email address</label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required className="h-12 rounded-xl border-[#cedbd3] bg-white px-4 text-[#183630] shadow-[0_1px_2px_rgba(24,54,48,0.04)] placeholder:text-[#92a39c] focus-visible:border-[#078a76] focus-visible:ring-[#078a76]/20" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="password" className="text-sm font-semibold text-[#29463f]">Password</label>
            <a href="#" className="text-sm font-semibold text-[#078a76] underline-offset-4 transition-colors hover:text-[#056c5c] hover:underline">Forgot password?</a>
          </div>
          <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-12 rounded-xl border-[#cedbd3] bg-white px-4 text-[#183630] shadow-[0_1px_2px_rgba(24,54,48,0.04)] focus-visible:border-[#078a76] focus-visible:ring-[#078a76]/20" />
        </div>

        {errorMessage && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}

        <Button type="submit" disabled={isSubmitting} className="mt-1 h-12 w-full rounded-xl bg-[#078a76] px-4 text-sm font-bold text-white shadow-[0_8px_18px_rgba(7,138,118,0.18)] hover:bg-[#056c5c]">
          {isSubmitting ? "Signing in…" : "Sign in to BisiPro"} <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
        </Button>

        <div className="flex items-center gap-3 py-1" aria-hidden="true">
          <div className="h-px flex-1 bg-[#d9e2dc]" />
          <span className="text-[0.68rem] font-bold tracking-[0.14em] text-[#94a39d] uppercase">Or continue with</span>
          <div className="h-px flex-1 bg-[#d9e2dc]" />
        </div>

        <Button variant="outline" type="button" className="h-12 w-full rounded-xl border-[#cedbd3] bg-white text-sm font-semibold text-[#29463f] hover:border-[#b3c3ba] hover:bg-[#f8faf8]">
          <svg className="size-[18px]" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.52h3.15c1.85-1.7 2.9-4.21 2.9-7.29Z" />
            <path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.23L15.3 17c-.87.58-1.98.92-3.3.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.6A9.75 9.75 0 0 0 12 21.75Z" />
            <path fill="#FBBC05" d="M6.53 13.89A5.86 5.86 0 0 1 6.22 12c0-.66.11-1.29.31-1.89v-2.6H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.37 3.06 1.03 4.49l3.25-2.6Z" />
            <path fill="#EA4335" d="M12 6.08c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.18 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.72 5.26l3.25 2.6C7.3 7.8 9.46 6.08 12 6.08Z" />
          </svg>
          Continue with Google
        </Button>

        <p className="pt-1 text-center text-sm text-[#60736c]">New to BisiPro? <Link to="/register" className="font-bold text-[#078a76] underline-offset-4 hover:underline">Create an account</Link></p>
      </form>

      <p className="mt-8 flex items-center justify-center gap-2 text-xs text-[#788b83]"><LockKeyhole className="size-3.5" />Your information is securely encrypted.</p>
    </section>
  )
}
