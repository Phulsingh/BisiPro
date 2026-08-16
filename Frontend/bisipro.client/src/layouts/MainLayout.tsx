import { Outlet } from "react-router-dom"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { NavConfig } from "@/layouts/NavConfig"
import { Topbar } from "@/layouts/Topbar"

export function MainLayout() {
  return (
    <SidebarProvider className="min-h-screen bg-[#f5f7f3]" style={{ "--sidebar-width": "17.25rem" } as React.CSSProperties}>
      <NavConfig />
      <SidebarInset className="min-h-screen bg-[#f5f7f3]">
        <Topbar />
        <div className="flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></div>
      </SidebarInset>
    </SidebarProvider>
  )
}
