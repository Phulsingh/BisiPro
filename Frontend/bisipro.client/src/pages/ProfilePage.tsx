import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  Cake,
  Check,
  ChevronRight,
  Copy,
  IdCard,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/context/authContext"
import { normaliseRole } from "@/layouts/NavConfig"
import { cn, formatDate, getInitials } from "@/lib/utils"
import { userService, type User } from "@/services/userService"

/** Whole years since the date of birth, or null when the date is missing or unreadable. */
const getAge = (dateOfBirth: string): number | null => {
  const birthDate = new Date(dateOfBirth)
  if (!dateOfBirth || Number.isNaN(birthDate.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())

  if (!hasHadBirthdayThisYear) age -= 1
  return age >= 0 ? age : null
}

/** Renders a single labelled value row inside the detail cards */
const InfoRow = ({
  icon: Icon,
  label,
  value,
  title,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  title?: string
}) => (
  <div className="flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-[#f5f7f3]/70">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#cedbd3] bg-[#f5f7f3] text-[#078a76]">
      <Icon className="size-4" />
    </span>
    <div className="min-w-0">
      <span className="block text-xs font-medium text-[#788b83]">{label}</span>
      <span
        className="block truncate text-sm font-semibold text-[#183630]"
        title={title ?? (typeof value === "string" ? value : undefined)}
      >
        {value}
      </span>
    </div>
  </div>
)

/** Renders one of the summary tiles shown under the profile header */
const StatCard = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  accent?: boolean
}) => (
  <div className="rounded-xl border border-brand bg-white p-4 shadow-sm">
    <div className="flex items-center gap-2 text-xs font-medium text-[#788b83]">
      <Icon className="size-3.5" />
      <span>{label}</span>
    </div>
    <div
      className={cn(
        "mt-2 truncate text-lg font-bold tracking-tight capitalize",
        accent ? "text-[#056c5c]" : "text-brand-ink"
      )}
    >
      {value}
    </div>
  </div>
)

const StatusPill = ({ isActive }: { isActive: boolean }) =>
  isActive ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c3e4ba]/40 bg-[#e2f1df] px-2.5 py-0.5 text-xs font-bold text-[#056c5c]">
      <span className="size-1.5 animate-pulse rounded-full bg-[#078a76]" />
      <span>Active</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
      <span className="size-1.5 rounded-full bg-gray-400" />
      <span>Inactive</span>
    </span>
  )

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="overflow-hidden rounded-2xl border border-brand bg-white shadow-sm">
      <Skeleton className="h-28 w-full rounded-none sm:h-32" />
      <div className="flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:px-8">
        <Skeleton className="-mt-10 size-20 rounded-full border-4 border-white sm:size-24" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="space-y-2 rounded-xl border border-brand bg-white p-4 shadow-sm">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 rounded-xl border border-brand bg-white p-6 shadow-sm lg:col-span-2">
        <Skeleton className="h-5 w-44" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4 rounded-xl border border-brand bg-white p-6 shadow-sm">
        <Skeleton className="h-5 w-32" />
        {[...Array(3)].map((_, idx) => (
          <Skeleton key={idx} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  </div>
)

const ProfilePage = () => {
  const { user: sessionUser, logout } = useAuth()

  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await userService.getProfileUser()

      if (response && response.isSuccess) {
        setProfile(response.data)
      } else {
        setError(response?.error || "Failed to load your profile.")
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err)
      setError(err?.message || "An unexpected error occurred while loading your profile.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleCopyId = async () => {
    if (!profile?.id) return
    try {
      await navigator.clipboard.writeText(profile.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be blocked by the browser; the ID stays visible to select manually.
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-8 text-center text-red-800">
        <AlertTriangle className="mb-3 size-10 text-red-600" />
        <h3 className="text-lg font-bold">Failed to Load Profile</h3>
        <p className="mt-1 max-w-md text-sm text-red-700/80">{error}</p>
        <Button
          onClick={fetchProfile}
          variant="outline"
          className="mt-4 flex items-center gap-2 rounded-xl border-red-200 bg-white text-red-800 hover:bg-red-50"
        >
          <RefreshCw className="size-4" />
          <span>Try Again</span>
        </Button>
      </div>
    )
  }

  if (loading) return <ProfileSkeleton />

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#cedbd3] bg-white p-12 text-center shadow-sm">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#f5f7f3] text-[#078a76]">
          <UserRound className="size-7" />
        </div>
        <h3 className="text-lg font-bold text-brand-ink">Profile unavailable</h3>
        <p className="mt-1 max-w-sm text-sm text-[#60736c]">
          We couldn't find your profile details. Please try again in a moment.
        </p>
        <Button
          onClick={fetchProfile}
          variant="outline"
          className="mt-6 rounded-xl border-[#cedbd3] px-4 text-[#078a76] hover:bg-[#e2f1df]"
        >
          <RefreshCw className="mr-2 size-4" />
          <span>Reload</span>
        </Button>
      </div>
    )
  }

  const fullName =
    `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || sessionUser?.fullName || "BisiPro user"
  // The profile endpoint does not return the role, so it comes from the signed-in session.
  const role = normaliseRole(sessionUser?.role)
  const age = getAge(profile.dateOfBirth)
  const groupCount = profile.groups?.length ?? 0

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <section className="overflow-hidden rounded-2xl border border-brand bg-white shadow-sm">
        <div className="relative h-28 bg-brand-forest sm:h-32">
          {/* Soft decorative glow over the brand banner */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(185,228,216,0.35),transparent_45%),radial-gradient(circle_at_10%_120%,rgba(195,228,186,0.25),transparent_40%)]" />
          <div className="absolute top-4 right-4 sm:top-5 sm:right-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-[#d9f0c9] capitalize backdrop-blur">
              <ShieldCheck className="size-3.5" />
              {role}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
            <span className="-mt-10 flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#e2f1df] text-2xl font-bold text-[#056c5c] shadow-md sm:-mt-12 sm:size-24 sm:text-3xl">
              {getInitials(fullName)}
            </span>
            <div className="min-w-0 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
                  {fullName}
                </h1>
                <StatusPill isActive={profile.isActive} />
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#60736c]">
                {profile.email && (
                  <span className="inline-flex min-w-0 items-center gap-1.5" title={profile.email}>
                    <Mail className="size-3.5 shrink-0 text-[#788b83]" />
                    <span className="truncate">{profile.email}</span>
                  </span>
                )}
                {profile.phoneNumber && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="size-3.5 text-[#788b83]" />
                    {profile.phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={fetchProfile}
            className="flex h-9 w-full items-center gap-2 rounded-xl border-[#cedbd3] text-[#29463f] hover:bg-[#e2f1df] hover:text-[#078a76] sm:w-auto"
          >
            <RefreshCw className="size-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </section>

      {/* Summary Stat Tiles */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Users} label="Groups Enrolled" accent value={groupCount} />
        <StatCard icon={ShieldCheck} label="Role" value={role} />
        <StatCard icon={Cake} label="Age" value={age !== null ? `${age} yrs` : "-"} />
        <StatCard icon={UserRound} label="Account Status" value={profile.isActive ? "Active" : "Inactive"} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Information */}
          <section className="rounded-xl border border-brand bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-brand-ink">Personal Information</h2>
              <span className="text-xs text-[#788b83]">Your details</span>
            </div>
            <div className="mt-4 h-px bg-[#d9e2dc]" />

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
              <InfoRow icon={UserRound} label="First Name" value={profile.firstName || "-"} />
              <InfoRow icon={UserRound} label="Last Name" value={profile.lastName || "-"} />
              <InfoRow icon={Mail} label="Email Address" value={profile.email || "-"} />
              <InfoRow icon={Phone} label="Phone Number" value={profile.phoneNumber || "-"} />
              <InfoRow
                icon={Cake}
                label="Date of Birth"
                value={profile.dateOfBirth ? formatDate(profile.dateOfBirth) : "-"}
              />
              <InfoRow icon={ShieldCheck} label="Role" value={<span className="capitalize">{role}</span>} />
            </div>
          </section>

          {/* Account */}
          <section className="rounded-xl border border-brand bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-brand-ink">Account</h2>
              <span className="text-xs text-[#788b83]">Sign-in &amp; identity</span>
            </div>
            <div className="mt-4 h-px bg-[#d9e2dc]" />

            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#cedbd3] bg-[#f5f7f3]/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#cedbd3] bg-white text-[#078a76]">
                  <IdCard className="size-4" />
                </span>
                <div className="min-w-0">
                  <span className="block text-xs font-medium text-[#788b83]">User ID</span>
                  <span
                    className="block truncate font-mono text-sm font-semibold text-[#183630]"
                    title={profile.id}
                  >
                    {profile.id}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyId}
                className="h-8 shrink-0 gap-1.5 rounded-lg border-[#cedbd3] bg-white text-[#29463f] hover:bg-[#e2f1df] hover:text-[#078a76]"
              >
                {copied ? <Check className="size-3.5 text-[#078a76]" /> : <Copy className="size-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#f3d5d3] bg-[#fdf6f5] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="block text-sm font-semibold text-[#183630]">Sign out</span>
                <span className="block text-xs text-[#788b83]">End your session on this device.</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="h-8 shrink-0 gap-1.5 rounded-lg border-[#f3d5d3] bg-white text-[#bf403d] hover:bg-[#fdf0ef] hover:text-[#bf403d]"
              >
                <LogOut className="size-3.5" />
                <span>Sign out</span>
              </Button>
            </div>
          </section>
        </div>

        {/* Enrolled Groups */}
        <section className="h-fit rounded-xl border border-brand bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-brand-ink">My Groups</h2>
            <span className="inline-flex items-center rounded-full border border-[#c3e4ba]/40 bg-[#e2f1df]/60 px-2.5 py-0.5 text-[10px] font-bold text-[#056c5c]">
              {groupCount}
            </span>
          </div>
          <div className="mt-4 h-px bg-[#d9e2dc]" />

          {groupCount > 0 ? (
            <ul className="mt-4 space-y-2">
              {profile.groups.map((group) => (
                <li key={group.id}>
                  <Link
                    to={`/groups/${group.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-[#cedbd3] bg-white p-3 transition-colors hover:border-[#078a76]/40 hover:bg-[#e2f1df]/40"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#cedbd3] bg-[#f5f7f3] text-[#078a76]">
                      <Users className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span
                        className="block truncate text-sm font-semibold text-[#183630]"
                        title={group.groupName}
                      >
                        {group.groupName}
                      </span>
                      <span className="block text-xs text-[#788b83]">Enrolled</span>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-[#a0b0aa] transition-transform group-hover:translate-x-0.5 group-hover:text-[#078a76]" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#cedbd3] bg-[#f5f7f3]/40 p-6 text-center">
              <div className="mb-2 flex size-10 items-center justify-center rounded-full border border-[#cedbd3] bg-white text-[#078a76]">
                <Users className="size-5" />
              </div>
              <p className="text-sm font-semibold text-brand-ink">No groups yet</p>
              <p className="mt-1 text-xs text-[#60736c]">You are not enrolled in any savings group.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default ProfilePage
