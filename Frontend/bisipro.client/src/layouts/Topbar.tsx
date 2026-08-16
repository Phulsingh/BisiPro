import { Bell, ChevronRight, LogOut, Moon, Search } from "lucide-react"
import { useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/context/authContext"
import { allNavigationItems } from "@/layouts/NavConfig"

export function Topbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const currentPage = allNavigationItems.find((item) => item.href === pathname)?.title ?? "Dashboard"
  const initials = user?.fullName.split(" ").map((name) => name[0]).slice(0, 2).join("") || "BP"

  return (
    <header className="sticky top-0 z-20 flex h-[4.5rem] shrink-0 items-center gap-3 border-b border-[#dce6e1] bg-white/95 px-4 backdrop-blur sm:px-6">
      <SidebarTrigger className="text-[#38584f] hover:bg-[#eef5f0] md:hidden" />
      <div className="hidden items-center gap-2 text-sm sm:flex">
        <span className="text-[#789088]">Home</span>
        <ChevronRight className="size-4 text-[#a0b0aa]" />
        <span className="font-bold text-[#183630]">{currentPage}</span>
      </div>

      <div className="relative ml-auto hidden w-full max-w-sm md:block">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#789088]" />
        <Input aria-label="Search workspace" placeholder="Search groups, members, receipts..." className="h-10 rounded-xl border-[#dce6e1] bg-[#f7faf8] pr-3 pl-9 text-sm shadow-sm placeholder:text-[#84968f] focus-visible:border-[#078a76] focus-visible:ring-[#078a76]/20" />
      </div>

      <div className="ml-auto flex items-center gap-1 md:ml-2">
        <Button variant="ghost" size="icon" className="text-[#38584f] hover:bg-[#eef5f0]" aria-label="Switch colour mode"><Moon /></Button>
        <Button variant="ghost" size="icon" className="relative text-[#38584f] hover:bg-[#eef5f0]" aria-label="Notifications"><Bell /><span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#d8534f] ring-2 ring-white" /></Button>
        <div className="ml-1 hidden items-center gap-2 border-l border-[#e2ebe6] pl-3 sm:flex">
          <span className="flex size-9 items-center justify-center rounded-full bg-[#183f37] text-xs font-bold text-[#d9f0c9]">{initials}</span>
          <span className="hidden pr-1 lg:block"><span className="block text-sm font-bold leading-4 text-[#183630]">{user?.fullName || "BisiPro user"}</span><span className="block text-xs text-[#789088]">Workspace member</span></span>
          <Button variant="ghost" size="icon-sm" onClick={logout} className="text-[#789088] hover:bg-[#fdf0ef] hover:text-[#bf403d]" aria-label="Sign out"><LogOut /></Button>
        </div>
      </div>
    </header>
  )
}
