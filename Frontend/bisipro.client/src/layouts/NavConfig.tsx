import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  Bell,
  BookOpen,
  CircleDollarSign,
  ContactRound,
  FileCheck,
  Gavel,
  History,
  LayoutDashboard,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Trophy,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react"
import {useAuth } from "@/context/authContext"

import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


// ============================================================
// TYPES
// ============================================================

export type NavigationItem = {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

export type NavigationGroup = {
  label: string
  items: NavigationItem[]
}


// ============================================================
// ADMIN NAVIGATION
// ============================================================

export const adminNavigationGroups: NavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Groups",
        href: "/groups",
        icon: UsersRound,
      },
      {
        title: "Members",
        href: "/members",
        icon: ContactRound,
      },
      {
        title: "Agents",
        href: "/agents",
        icon: UserRound,
      },
    ],
  },

  {
    label: "Bisi Management",
    items: [
      {
        title: "Auctions",
        href: "/auctions",
        icon: Gavel,
      },
      {
        title: "Winners",
        href: "/winners",
        icon: Trophy,
      },
    ],
  },

  {
    label: "Money Flow",
    items: [
      {
        title: "Collections",
        href: "/collections",
        icon: WalletCards,
      },
      {
        title: "Payments",
        href: "/payments",
        icon: CircleDollarSign,
      },
      {
        title: "Ledger",
        href: "/ledger",
        icon: BookOpen,
      },
      {
        title: "Receipts",
        href: "/receipts",
        icon: ReceiptText,
      },
    ],
  },

  {
    label: "Verification",
    items: [
      {
        title: "KYC Requests",
        href: "/kyc",
        icon: FileCheck,
        badge: "3",
      },
    ],
  },

  {
    label: "Reports",
    items: [
      {
        title: "Reports",
        href: "/reports",
        icon: BarChart3,
      },
      {
        title: "Activity Logs",
        href: "/activity-logs",
        icon: History,
      },
    ],
  },

  {
    label: "Account",
    items: [
      {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
        badge: "4",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
]


// ============================================================
// AGENT NAVIGATION
// ============================================================

export const agentNavigationGroups: NavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "My Groups",
        href: "/groups",
        icon: UsersRound,
      },
      {
        title: "Members",
        href: "/members",
        icon: ContactRound,
      },
    ],
  },

  {
    label: "Money Flow",
    items: [
      {
        title: "Collections",
        href: "/collections",
        icon: WalletCards,
      },
      {
        title: "Payments",
        href: "/payments",
        icon: CircleDollarSign,
      },
      {
        title: "Ledger",
        href: "/ledger",
        icon: BookOpen,
      },
      {
        title: "Receipts",
        href: "/receipts",
        icon: ReceiptText,
      },
    ],
  },

  {
    label: "Bisi",
    items: [
      {
        title: "Auctions",
        href: "/auctions",
        icon: Gavel,
      },
      {
        title: "Winners",
        href: "/winners",
        icon: Trophy,
      },
    ],
  },

  {
    label: "Account",
    items: [
      {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
        badge: "4",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
]


// ============================================================
// USER NAVIGATION
// ============================================================

export const userNavigationGroups: NavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Explore Groups",
        href: "/groups/explore",
        icon: Search,
      },
      {
        title: "My Groups",
        href: "/groups/my",
        icon: UsersRound,
      },
    ],
  },

  {
    label: "Payments",
    items: [
      {
        title: "My Payments",
        href: "/payments",
        icon: CircleDollarSign,
      },
      {
        title: "Receipts",
        href: "/receipts",
        icon: ReceiptText,
      },
    ],
  },

  {
    label: "Account",
    items: [
      {
        title: "KYC",
        href: "/kyc",
        icon: ShieldCheck,
      },
      {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
        badge: "4",
      },
      {
        title: "Profile",
        href: "/profile",
        icon: ContactRound,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
]


// ============================================================
// GET NAVIGATION BASED ON ROLE
// ============================================================

export type UserRole = "admin" | "agent" | "user"

/**
 * Normalises whatever the backend sends ("Admin", "AGENT", null…) into a role
 * we recognise. Anything unknown falls back to the least privileged menu.
 */
export function normaliseRole(role?: string | null): UserRole {

  switch (role?.trim().toLowerCase()) {

    case "admin":
      return "admin"

    case "agent":
      return "agent"

    default:
      return "user"
  }
}


export function getNavigationByRole(
  role: string
): NavigationGroup[] {

  switch (normaliseRole(role)) {

    case "admin":
      return adminNavigationGroups

    case "agent":
      return agentNavigationGroups

    default:
      return userNavigationGroups
  }
}


// ============================================================
// ALL NAVIGATION ITEMS
// ============================================================

export const allNavigationItems = [
  ...adminNavigationGroups.flatMap(
    (group) => group.items
  ),

  ...agentNavigationGroups.flatMap(
    (group) => group.items
  ),

  ...userNavigationGroups.flatMap(
    (group) => group.items
  ),
]


// ============================================================
// SIDEBAR COMPONENT
// ============================================================

type NavConfigProps = {
  /** Optional override; by default the role comes from the signed-in session */
  role?: string
}

export function NavConfig({
  role,
}: NavConfigProps = {}) {

  const { pathname } = useLocation()
  const { user } = useAuth()

  const activeRole = normaliseRole(role ?? user?.role)

  const navigationGroups =
    getNavigationByRole(activeRole)


  return (
    <Sidebar
      collapsible="offcanvas"
      className="
        border-r
        border-[#dce6e1]
        bg-white
        [&_[data-sidebar=sidebar]]:bg-white
        [&_[data-sidebar=sidebar]]:text-[#29463f]
      "
    >

      {/* ======================================================
          LOGO
      ====================================================== */}

      <SidebarHeader
        className="
          border-b
          border-[#e4ece8]
          px-5
          py-5
        "
      >

        <NavLink
          to="/dashboard"
          className="flex items-center gap-3"
          aria-label="BisiPro dashboard"
        >

          <span
            className="
              flex
              size-10
              items-center
              justify-center
              rounded-xl
              bg-[#183f37]
              text-sm
              font-bold
              text-[#d9f0c9]
              shadow-[0_6px_14px_rgba(24,63,55,0.16)]
            "
          >
            B
          </span>

          <span className="flex flex-col leading-none">

            <span
              className="
                text-lg
                font-bold
                tracking-[-0.04em]
                text-[#183630]
              "
            >
              BisiPro
            </span>

            <span
              className="
                mt-1
                text-[0.62rem]
                font-bold
                tracking-[0.12em]
                text-[#078a76]
                uppercase
              "
            >
              Business workspace
            </span>

          </span>

        </NavLink>

      </SidebarHeader>


      {/* ======================================================
          SIDEBAR CONTENT
      ====================================================== */}

      <SidebarContent className="px-3 py-4">

        {navigationGroups.map((group) => (

          <SidebarGroup
            key={group.label}
            className="p-0 pb-4"
          >

            <SidebarGroupLabel
              className="
                mb-1
                h-auto
                px-3
                py-2
                text-[0.64rem]
                font-bold
                tracking-[0.14em]
                text-[#789088]
                uppercase
              "
            >
              {group.label}
            </SidebarGroupLabel>


            <SidebarGroupContent>

              <SidebarMenu className="gap-1">

                {group.items.map((item) => {

                  const Icon = item.icon

                  /*
                   * Exact match for Dashboard.
                   *
                   * For nested routes like:
                   * /groups/my/details
                   *
                   * the Groups menu will remain active.
                   */

                  const isActive =
                    pathname === item.href ||
                    (
                      item.href !== "/dashboard" &&
                      pathname.startsWith(`${item.href}/`)
                    )


                  return (
                    <SidebarMenuItem
                      key={item.href}
                    >

                      <SidebarMenuButton
                        render={
                          <NavLink to={item.href} />
                        }
                        isActive={isActive}
                        tooltip={item.title}
                        className="
                          h-10
                          rounded-xl
                          px-3
                          text-[0.94rem]
                          font-medium
                          text-[#587069]
                          hover:bg-[#eef5f0]
                          hover:text-[#183f37]
                          data-active:bg-[#e2f1df]
                          data-active:font-bold
                          data-active:text-[#056c5c]
                        "
                      >

                        <Icon className="size-[18px]" />

                        <span>
                          {item.title}
                        </span>

                      </SidebarMenuButton>


                      {item.badge && (

                        <SidebarMenuBadge
                          className="
                            right-2
                            top-2.5
                            rounded-full
                            bg-[#e2f1df]
                            text-[0.65rem]
                            font-bold
                            text-[#078a76]
                          "
                        >
                          {item.badge}
                        </SidebarMenuBadge>

                      )}

                    </SidebarMenuItem>
                  )

                })}

              </SidebarMenu>

            </SidebarGroupContent>

          </SidebarGroup>

        ))}

      </SidebarContent>

    </Sidebar>
  )
}