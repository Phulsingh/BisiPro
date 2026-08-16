import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  Bell,
  BookOpen,
  CircleDollarSign,
  ContactRound,
  Crown,
  Gavel,
  LayoutDashboard,
  ReceiptText,
  Settings,
  Trophy,
  UsersRound,
  WalletCards,
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export type NavigationItem = {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

export const navigationGroups: { label: string; items: NavigationItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Groups", href: "/groups", icon: UsersRound },
      { title: "Members", href: "/members", icon: ContactRound },
    ],
  },
  {
    label: "Money flow",
    items: [
      { title: "Collections", href: "/collections", icon: WalletCards },
      { title: "Payments", href: "/payments", icon: CircleDollarSign },
      { title: "Ledger", href: "/ledger", icon: BookOpen },
      { title: "Receipts", href: "/receipts", icon: ReceiptText },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Auctions", href: "/auctions", icon: Gavel },
      { title: "Winners", href: "/winners", icon: Trophy },
      { title: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Notifications", href: "/notifications", icon: Bell, badge: "4" },
      { title: "Settings", href: "/settings", icon: Settings },
      { title: "Subscription", href: "/subscription", icon: Crown },
    ],
  },
]

export const allNavigationItems = navigationGroups.flatMap((group) => group.items)

export function NavConfig() {
  const { pathname } = useLocation()

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-[#dce6e1] bg-white [&_[data-sidebar=sidebar]]:bg-white [&_[data-sidebar=sidebar]]:text-[#29463f]">
      <SidebarHeader className="border-b border-[#e4ece8] px-5 py-5">
        <NavLink to="/dashboard" className="flex items-center gap-3" aria-label="BisiPro dashboard">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#183f37] text-sm font-bold text-[#d9f0c9] shadow-[0_6px_14px_rgba(24,63,55,0.16)]">B</span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-[-0.04em] text-[#183630]">BisiPro</span>
            <span className="mt-1 text-[0.62rem] font-bold tracking-[0.12em] text-[#078a76] uppercase">Business workspace</span>
          </span>
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label} className="p-0 pb-4">
            <SidebarGroupLabel className="mb-1 h-auto px-3 py-2 text-[0.64rem] font-bold tracking-[0.14em] text-[#789088] uppercase">{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<NavLink to={item.href} />}
                        isActive={isActive}
                        tooltip={item.title}
                        className="h-10 rounded-xl px-3 text-[0.94rem] font-medium text-[#587069] hover:bg-[#eef5f0] hover:text-[#183f37] data-active:bg-[#e2f1df] data-active:font-bold data-active:text-[#056c5c]"
                      >
                        <Icon className="size-[18px]" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.badge && <SidebarMenuBadge className="right-2 top-2.5 rounded-full bg-[#e2f1df] text-[0.65rem] font-bold text-[#078a76]">{item.badge}</SidebarMenuBadge>}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="m-3 rounded-xl bg-[#f1f6f2] p-3 group-data-[collapsible=icon]:hidden">
        <p className="text-xs font-semibold text-[#29463f]">Need a hand?</p>
        <p className="mt-1 text-xs leading-5 text-[#70857d]">Our support team is ready to help your group.</p>
        <a href="mailto:support@bisipro.com" className="mt-2 inline-flex text-xs font-bold text-[#078a76] hover:underline">Contact support</a>
      </SidebarFooter>
    </Sidebar>
  )
}
