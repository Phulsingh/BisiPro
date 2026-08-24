import { ArrowLeft, ArrowRight, LockKeyhole, MailCheck, MailQuestion } from "lucide-react"
import { isAxiosError } from "axios"
import { type FormEvent, useState } from "react"
import { Link } from "react-router-dom"

import { AuthShell } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authService } from "@/services/authService"

const inputClassName =
  "h-12 rounded-xl border-[#cedbd3] bg-white px-4 text-[#183630] shadow-[0_1px_2px_rgba(24,54,48,0.04)] placeholder:text-[#92a39c] focus-visible:border-[#078a76] focus-visible:ring-[#078a76]/20"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setErrorMessage("Please enter the email address linked to your account.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await authService.forgotPassword(trimmedEmail)

      if (!response.isSuccess) {
        setErrorMessage(response.error || "We could not send the reset link. Please try again.")
        return
      }

      setIsSent(true)
    } catch (error) {
      if (isAxiosError<{ error?: string; message?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "We could not send the reset link. Please try again."
        )
      } else {
        setErrorMessage("We could not send the reset link. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <section className="relative z-10 w-full max-w-[27rem]" aria-labelledby="forgot-password-heading">
        {isSent ? (
          /* Confirmation State */
          <div>
            <span className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#e2f1df] text-[#056c5c]">
              <MailCheck className="size-6" />
            </span>
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#078a76] uppercase">Check your inbox</p>
            <h1
              id="forgot-password-heading"
              className="font-serif text-4xl leading-[1.06] font-semibold tracking-[-0.045em] text-[#183630] sm:text-[2.7rem]"
            >
              Reset link sent.
            </h1>
            <p className="mt-3 max-w-sm text-[0.95rem] leading-6 text-[#60736c]">
              If an account exists for <span className="font-semibold text-[#183630]">{email.trim()}</span>, we've sent
              a link to reset your password. The link expires shortly, so use it soon.
            </p>

            <div className="mt-7 rounded-xl border border-[#cedbd3] bg-white p-4 text-sm leading-6 text-[#60736c]">
              Didn't get the email? Check your spam folder, or{" "}
              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="cursor-pointer font-bold text-[#078a76] underline-offset-4 hover:underline"
              >
                try a different address
              </button>
              .
            </div>

            <Link
              to="/login"
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#cedbd3] bg-white text-sm font-semibold text-[#29463f] transition-colors hover:border-[#b3c3ba] hover:bg-[#f8faf8]"
            >
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
          /* Request Form State */
          <div>
            <span className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#e2f1df] text-[#056c5c]">
              <MailQuestion className="size-6" />
            </span>
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#078a76] uppercase">Account recovery</p>
            <h1
              id="forgot-password-heading"
              className="font-serif text-4xl leading-[1.06] font-semibold tracking-[-0.045em] text-[#183630] sm:text-[2.7rem]"
            >
              Forgot your password?
            </h1>
            <p className="mt-3 max-w-sm text-[0.95rem] leading-6 text-[#60736c]">
              Enter the email address linked to your account and we'll send you a link to set a new password.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-[#29463f]">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClassName}
                />
              </div>

              {errorMessage && (
                <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 h-12 w-full cursor-pointer rounded-xl bg-[#078a76] px-4 text-sm font-bold text-white shadow-[0_8px_18px_rgba(7,138,118,0.18)] hover:bg-[#056c5c]"
              >
                {isSubmitting ? "Sending link…" : "Send reset link"} <ArrowRight className="size-4" />
              </Button>

              <p className="pt-1 text-center text-sm text-[#60736c]">
                Remembered it?{" "}
                <Link to="/login" className="font-bold text-[#078a76] underline-offset-4 hover:underline">
                  Back to sign in
                </Link>
              </p>
            </form>
          </div>
        )}

        <p className="mt-8 flex items-center justify-center gap-2 text-xs text-[#788b83]">
          <LockKeyhole className="size-3.5" />
          Your information is securely encrypted.
        </p>
      </section>
    </AuthShell>
  )
}

export default ForgotPassword
