import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react"
import { isAxiosError } from "axios"
import { type FormEvent, useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { AuthShell } from "@/components/auth-shell"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authService } from "@/services/authService"

const inputClassName =
  "h-12 rounded-xl border-[#cedbd3] bg-white pr-11 pl-4 text-[#183630] shadow-[0_1px_2px_rgba(24,54,48,0.04)] placeholder:text-[#92a39c] focus-visible:border-[#078a76] focus-visible:ring-[#078a76]/20"

/** The password policy surfaced to the user as a live checklist */
const passwordRules = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "One number", test: (value: string) => /\d/.test(value) },
  { label: "One special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
]

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // useSearchParams decodes the percent-encoded token from ?token=... for us
  const token = searchParams.get("token") ?? ""

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReset, setIsReset] = useState(false)

  const ruleResults = useMemo(
    () => passwordRules.map((rule) => ({ label: rule.label, passed: rule.test(newPassword) })),
    [newPassword]
  )
  const allRulesPassed = ruleResults.every((rule) => rule.passed)
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

    if (!allRulesPassed) {
      setErrorMessage("Your new password does not meet all the requirements below.")
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("The two passwords do not match.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await authService.resetPassword(token, newPassword)

      if (!response.isSuccess) {
        setErrorMessage(response.error || "We could not reset your password. The link may have expired.")
        return
      }

      setIsReset(true)
    } catch (error) {
      if (isAxiosError<{ error?: string; message?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "We could not reset your password. The link may have expired."
        )
      } else {
        setErrorMessage("We could not reset your password. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <section className="relative z-10 w-full max-w-[27rem]" aria-labelledby="reset-password-heading">
        {!token ? (
          /* Missing Token State */
          <div>
            <span className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <CircleAlert className="size-6" />
            </span>
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#078a76] uppercase">Invalid link</p>
            <h1
              id="reset-password-heading"
              className="font-serif text-4xl leading-[1.06] font-semibold tracking-[-0.045em] text-[#183630] sm:text-[2.7rem]"
            >
              This link isn't valid.
            </h1>
            <p className="mt-3 max-w-sm text-[0.95rem] leading-6 text-[#60736c]">
              The reset link is missing its security token. It may have been copied incompletely or already used.
              Request a fresh link to continue.
            </p>

            <Link
              to="/forgot-password"
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#078a76] text-sm font-bold text-white shadow-[0_8px_18px_rgba(7,138,118,0.18)] transition-colors hover:bg-[#056c5c]"
            >
              Request a new link <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/login"
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#cedbd3] bg-white text-sm font-semibold text-[#29463f] transition-colors hover:border-[#b3c3ba] hover:bg-[#f8faf8]"
            >
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>
          </div>
        ) : isReset ? (
          /* Success State */
          <div>
            <span className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#e2f1df] text-[#056c5c]">
              <ShieldCheck className="size-6" />
            </span>
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#078a76] uppercase">All set</p>
            <h1
              id="reset-password-heading"
              className="font-serif text-4xl leading-[1.06] font-semibold tracking-[-0.045em] text-[#183630] sm:text-[2.7rem]"
            >
              Password updated.
            </h1>
            <p className="mt-3 max-w-sm text-[0.95rem] leading-6 text-[#60736c]">
              Your password has been changed. Sign in with your new password to get back to your workspace.
            </p>

            <Button
              type="button"
              onClick={() => navigate("/login", { replace: true })}
              className="mt-7 h-12 w-full cursor-pointer rounded-xl bg-[#078a76] px-4 text-sm font-bold text-white shadow-[0_8px_18px_rgba(7,138,118,0.18)] hover:bg-[#056c5c]"
            >
              Continue to sign in <ArrowRight className="size-4" />
            </Button>
          </div>
        ) : (
          /* Reset Form State */
          <div>
            <span className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#e2f1df] text-[#056c5c]">
              <KeyRound className="size-6" />
            </span>
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#078a76] uppercase">Account recovery</p>
            <h1
              id="reset-password-heading"
              className="font-serif text-4xl leading-[1.06] font-semibold tracking-[-0.045em] text-[#183630] sm:text-[2.7rem]"
            >
              Set a new password.
            </h1>
            <p className="mt-3 max-w-sm text-[0.95rem] leading-6 text-[#60736c]">
              Choose a strong password you haven't used before. You'll use it the next time you sign in.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-semibold text-[#29463f]">
                  New password
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    autoFocus
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={inputClassName}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((visible) => !visible)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[#788b83] transition-colors hover:text-[#183630]"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-[#29463f]">
                  Confirm new password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={cn(
                      inputClassName,
                      confirmPassword.length > 0 &&
                        !passwordsMatch &&
                        "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[#788b83] transition-colors hover:text-[#183630]"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-xs font-medium text-red-600">The two passwords do not match.</p>
                )}
              </div>

              {/* Live password policy checklist */}
              <ul className="grid grid-cols-1 gap-2 rounded-xl border border-[#cedbd3] bg-white p-4 sm:grid-cols-2">
                {ruleResults.map((rule) => (
                  <li key={rule.label} className="flex items-center gap-2 text-xs">
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                        rule.passed
                          ? "border-[#c3e4ba] bg-[#e2f1df] text-[#056c5c]"
                          : "border-[#cedbd3] bg-[#f5f7f3] text-transparent"
                      )}
                    >
                      <Check className="size-2.5" strokeWidth={3.5} />
                    </span>
                    <span className={rule.passed ? "font-semibold text-[#29463f]" : "text-[#788b83]"}>
                      {rule.label}
                    </span>
                  </li>
                ))}
              </ul>

              {errorMessage && (
                <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !allRulesPassed || !passwordsMatch}
                className="mt-1 h-12 w-full cursor-pointer rounded-xl bg-[#078a76] px-4 text-sm font-bold text-white shadow-[0_8px_18px_rgba(7,138,118,0.18)] hover:bg-[#056c5c]"
              >
                {isSubmitting ? "Updating password…" : "Reset password"} <ArrowRight className="size-4" />
              </Button>

              <p className="pt-1 text-center text-sm text-[#60736c]">
                Changed your mind?{" "}
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

export default ResetPassword
