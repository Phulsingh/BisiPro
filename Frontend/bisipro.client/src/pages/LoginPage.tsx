import { ArrowUpRight, Check, Landmark } from "lucide-react"
import { useLocation } from "react-router-dom"

import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"

const LoginPage = () => {
  const { pathname } = useLocation()
  const isRegisterPage = pathname === "/register"

  return (
    <main className="min-h-screen bg-[#f5f7f3] text-[#183630] selection:bg-[#b9e4d8]">
      <div className="grid min-h-screen xl:grid-cols-[minmax(420px,0.9fr)_minmax(520px,1.1fr)]">
        <aside className="relative hidden overflow-hidden bg-[#183f37] p-10 text-[#f5f7f3] xl:flex xl:flex-col xl:justify-between 2xl:p-14">
          <div className="absolute inset-y-0 right-0 w-px bg-white/10" />
          <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full border border-[#c3e4ba]/20" />
          <div className="absolute top-20 -left-7 h-56 w-56 rounded-full border border-[#c3e4ba]/10" />
          <div className="absolute right-[-7rem] bottom-[-8rem] h-96 w-96 rounded-full border border-[#c3e4ba]/20" />

          <a href="#" className="relative z-10 flex w-fit items-center gap-3" aria-label="BisiPro home">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#d9f0c9] text-[#164238] shadow-[0_8px_20px_rgba(0,0,0,0.12)]"><Landmark className="size-5" strokeWidth={2.25} /></span>
            <span className="text-xl font-bold tracking-[-0.04em]">BisiPro</span>
          </a>

          <div className="relative z-10 max-w-md">
            <div className="mb-7 flex items-center gap-3 text-xs font-bold tracking-[0.16em] text-[#c3e4ba] uppercase"><span className="h-px w-8 bg-[#c3e4ba]/60" />Built for the everyday business</div>
            <h2 className="font-serif text-5xl leading-[1.02] font-semibold tracking-[-0.055em] 2xl:text-6xl">Business clarity,<span className="block text-[#c3e4ba]">in every move.</span></h2>
            <p className="mt-6 max-w-sm text-base leading-7 text-[#c7d8d1]">Bring members, savings and transactions into one dependable place your team can use every day.</p>

            <div className="mt-10 border-t border-white/15 pt-6">
              <p className="mb-4 text-xs font-bold tracking-[0.14em] text-[#9dbbb0] uppercase">Made to keep you moving</p>
              <ul className="space-y-3 text-sm text-[#e2ece7]">
                {["Know where your money is", "Keep your team in sync", "Make confident decisions"].map((item) => (
                  <li key={item} className="flex items-center gap-3"><span className="flex size-5 items-center justify-center rounded-full bg-[#c3e4ba] text-[#183f37]"><Check className="size-3.5" strokeWidth={3} /></span>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-6 text-sm text-[#afc5bd]">
            <span>© {new Date().getFullYear()} BisiPro</span>
            <a href="#" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">Help centre <ArrowUpRight className="size-3.5" /></a>
          </div>
        </aside>

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12 sm:px-10 lg:px-16">
          <div className="absolute top-0 right-0 h-48 w-48 rounded-bl-[7rem] bg-[#e2f1df]" />
          <div className="absolute top-7 right-8 text-[0.65rem] font-bold tracking-[0.18em] text-[#528277] uppercase sm:right-12">Secure workspace</div>

          <a href="#" className="absolute top-7 left-6 flex items-center gap-2 xl:hidden" aria-label="BisiPro home">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#183f37] text-[#d9f0c9]"><Landmark className="size-4" /></span>
            <span className="text-lg font-bold tracking-[-0.04em] text-[#183630]">BisiPro</span>
          </a>
          {isRegisterPage ? <RegisterForm className="relative z-10" /> : <LoginForm className="relative z-10" />}
        </section>
      </div>
    </main>
  )
}

export default LoginPage
