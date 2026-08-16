import { ArrowRight, LockKeyhole } from "lucide-react"
import { isAxiosError } from "axios"
import { type FormEvent, useState } from "react"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authService } from "@/services/authService"

const inputClassName = "h-11 rounded-xl border-[#cedbd3] bg-white px-4 text-[#183630] shadow-[0_1px_2px_rgba(24,54,48,0.04)] placeholder:text-[#92a39c] focus-visible:border-[#078a76] focus-visible:ring-[#078a76]/20"
const labelClassName = "text-sm font-semibold text-[#29463f]"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await authService.register({
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        email: String(formData.get("email") ?? ""),
        dateOfBirth: String(formData.get("dateOfBirth") ?? ""),
        phoneNumber: String(formData.get("phoneNumber") ?? ""),
        password: String(formData.get("password") ?? ""),
      })

      if (!response.isSuccess) {
        setErrorMessage(response.error || "We could not create your account.")
        return
      }

      window.location.assign("/login?registered=true")
    } catch (error) {
      if (isAxiosError<{ error?: string; message?: string }>(error)) {
        setErrorMessage(error.response?.data?.error || error.response?.data?.message || "We could not create your account.")
      } else {
        setErrorMessage("We could not create your account. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={cn("w-full max-w-[31rem]", className)} aria-labelledby="register-heading" {...props}>
      <div className="mb-6">
        <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#078a76] uppercase">Get started</p>
        <h1 id="register-heading" className="font-serif text-4xl leading-[1.06] font-semibold tracking-[-0.045em] text-[#183630] sm:text-[2.7rem]">Create your account.</h1>
        <p className="mt-3 max-w-md text-[0.95rem] leading-6 text-[#60736c]">Set up your BisiPro workspace and keep your business in clear view.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className={labelClassName}>First name</label>
            <Input id="firstName" name="firstName" type="text" autoComplete="given-name" placeholder="Sneha" required className={inputClassName} />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className={labelClassName}>Last name</label>
            <Input id="lastName" name="lastName" type="text" autoComplete="family-name" placeholder="Sharma" required className={inputClassName} />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className={labelClassName}>Email address</label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="sneha.sharma@example.com" required className={inputClassName} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="dateOfBirth" className={labelClassName}>Date of birth</label>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" autoComplete="bday" required className={inputClassName} />
          </div>
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className={labelClassName}>Phone number</label>
            <Input id="phoneNumber" name="phoneNumber" type="tel" autoComplete="tel" inputMode="numeric" pattern="[0-9]{10}" placeholder="9123456789" required className={inputClassName} />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className={labelClassName}>Password</label>
          <Input id="password" name="password" type="password" autoComplete="new-password" placeholder="Create a secure password" required minLength={8} className={inputClassName} />
          <p className="text-xs leading-5 text-[#788b83]">Use at least 8 characters, including a letter and a number.</p>
        </div>

        {errorMessage && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}

        <Button type="submit" disabled={isSubmitting} className="mt-2 h-12 w-full rounded-xl bg-[#078a76] px-4 text-sm font-bold text-white shadow-[0_8px_18px_rgba(7,138,118,0.18)] hover:bg-[#056c5c]">
          {isSubmitting ? "Creating your account…" : "Create BisiPro account"} <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
        </Button>

        <p className="pt-1 text-center text-sm text-[#60736c]">Already have an account? <Link to="/login" className="font-bold text-[#078a76] underline-offset-4 hover:underline">Sign in</Link></p>
      </form>

      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-[#788b83]"><LockKeyhole className="size-3.5" />Your information is securely encrypted.</p>
    </section>
  )
}
