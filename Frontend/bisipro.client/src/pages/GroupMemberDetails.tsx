import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate, useLocation, Link } from "react-router-dom"
import {
  ArrowLeft,
  Users,
  Phone,
  Mail,
  Cake,
  RefreshCw,
  AlertTriangle,
  CalendarDays,
  CalendarX,
  Wallet,
  IdCard,
  UserRound,
  Layers,
} from "lucide-react"
import { userService, type User } from "@/services/userService"
import { type GroupMember } from "@/services/groupMemberService"
import { cn, formatCurrency, formatDate, getInitials } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

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
  <div className="flex items-start gap-3">
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

/** Renders one of the summary tiles shown above the detail cards */
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
        "mt-2 text-lg font-bold tracking-tight",
        accent ? "text-[#056c5c]" : "text-brand-ink"
      )}
    >
      {value}
    </div>
  </div>
)

const StatusPill = ({ isActive }: { isActive: boolean }) =>
  isActive ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c3e4ba]/30 bg-[#e2f1df] px-2.5 py-0.5 text-xs font-bold text-[#056c5c]">
      <span className="size-1.5 rounded-full bg-[#078a76] animate-pulse" />
      <span>Active</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
      <span className="size-1.5 rounded-full bg-gray-400" />
      <span>Exited</span>
    </span>
  )

const GroupMemberDetails = () => {
  const { userId = "" } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  // The list page hands the membership row over so this page can show group-scoped
  // figures (payable amount, joined/exit dates) that the User endpoint does not return.
  const member = (location.state as { member?: GroupMember } | null)?.member

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch the member profile from the User API
  const fetchUser = useCallback(async () => {
    if (!userId) {
      setError("No member was selected.")
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const response = await userService.getUserById(userId)

      if (response && response.isSuccess) {
        setUser(response.data)
      } else {
        setError(response?.error || "Failed to fetch member details.")
      }
    } catch (err: any) {
      console.error("Error fetching member details:", err)
      setError(err?.message || "An unexpected error occurred while fetching member details.")
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const fullName = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : ""
  const displayName = fullName || member?.memberName || "Member"
  const phoneNumber = user?.phoneNumber || member?.phoneNumber || "-"
  const isActive = user ? user.isActive : Boolean(member?.isActive)

  const handleBack = () => {
    navigate("/group/members")
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Button
        variant="ghost"
        onClick={handleBack}
        className="-ml-2 cursor-pointer flex h-9 items-center gap-1.5 rounded-xl px-2 text-[#60736c] hover:bg-[#e2f1df] hover:text-[#078a76]"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Group Members</span>
      </Button>

      {/* Main Content Area */}
      {error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-8 text-center text-red-800">
          <AlertTriangle className="mb-3 size-10 text-red-600" />
          <h3 className="text-lg font-bold">Failed to Load Member Details</h3>
          <p className="mt-1 max-w-md text-sm text-red-700/80">{error}</p>
          <Button
            onClick={fetchUser}
            variant="outline"
            className="mt-4 flex items-center gap-2 rounded-xl border-red-200 bg-white text-red-800 hover:bg-red-50"
          >
            <RefreshCw className="size-4" />
            <span>Try Again</span>
          </Button>
        </div>
      ) : loading ? (
        /* Loading Skeleton State */
        <div className="space-y-6">
          <div className="rounded-xl border border-brand bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="size-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="space-y-2 rounded-xl border border-brand bg-white p-4 shadow-sm">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-28" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 rounded-xl border border-brand bg-white p-6 shadow-sm lg:col-span-2">
              <Skeleton className="h-5 w-40" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-32" />
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
      ) : !user ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#cedbd3] bg-white p-12 text-center shadow-sm">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#f5f7f3] text-[#078a76]">
            <UserRound className="size-7" />
          </div>
          <h3 className="text-lg font-bold text-brand-ink">Member not found</h3>
          <p className="mt-1 max-w-sm text-sm text-[#60736c]">
            We couldn't find a profile for this member. They may have been removed from the
            workspace.
          </p>
          <Button
            onClick={handleBack}
            variant="outline"
            className="mt-6 rounded-xl border-[#cedbd3] px-4 text-[#078a76] hover:bg-[#e2f1df]"
          >
            <ArrowLeft className="mr-2 size-4" />
            <span>Back to Group Members</span>
          </Button>
        </div>
      ) : (
        /* Data Display States */
        <div className="space-y-6">
          {/* Profile Header Card */}
          <div className="rounded-xl border border-brand bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <span className="flex size-16 shrink-0 items-center justify-center rounded-full border border-[#c3e4ba]/40 bg-[#e2f1df]/70 text-lg font-bold text-[#056c5c]">
                  {getInitials(displayName)}
                </span>
                <div className="min-w-0">
                  <h1 className="truncate text-page-title font-bold tracking-tight text-brand-ink">
                    {displayName}
                  </h1>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#60736c]">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="size-3.5 text-[#788b83]" />
                      {phoneNumber}
                    </span>
                    {user.email && (
                      <span className="inline-flex min-w-0 items-center gap-1.5" title={user.email}>
                        <Mail className="size-3.5 shrink-0 text-[#788b83]" />
                        <span className="truncate">{user.email}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:self-start">
                <StatusPill isActive={isActive} />
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#cedbd3] bg-white px-3 py-2 text-xs font-semibold text-[#29463f]">
                  <Users className="size-3.5" />
                  <span>{user.groups?.length ?? 0} Groups</span>
                </span>
              </div>
            </div>
          </div>

          {/* Summary Stat Tiles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Wallet}
              label="Payable Amount"
              accent
              value={member ? formatCurrency(member.payableAmount) : "-"}
            />
            <StatCard
              icon={CalendarDays}
              label="Joined Date"
              value={member ? formatDate(member.joinedDate) : "-"}
            />
            <StatCard
              icon={CalendarX}
              label="Exit Date"
              value={member?.exitDate ? formatDate(member.exitDate) : "-"}
            />
            <StatCard
              icon={Layers}
              label="Membership Status"
              value={(member ? member.isActive : isActive) ? "Active" : "Exited"}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Personal Information Card */}
            <div className="rounded-xl border border-brand bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-brand-ink">Personal Information</h2>
                <span className="text-xs text-[#788b83]">Profile details</span>
              </div>
              <div className="mt-4 h-px bg-[#d9e2dc]" />

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoRow icon={UserRound} label="First Name" value={user.firstName || "-"} />
                <InfoRow icon={UserRound} label="Last Name" value={user.lastName || "-"} />
                <InfoRow icon={Mail} label="Email Address" value={user.email || "-"} />
                <InfoRow icon={Phone} label="Phone Number" value={user.phoneNumber || "-"} />
                <InfoRow
                  icon={Cake}
                  label="Date of Birth"
                  value={user.dateOfBirth ? formatDate(user.dateOfBirth) : "-"}
                />
                <InfoRow
                  icon={IdCard}
                  label="Member ID"
                  title={user.userId}
                  value={user.userId ? user.userId.slice(0, 8) : "-"}
                />
              </div>

              {member && (
                <>
                  <div className="mt-6 h-px bg-[#d9e2dc]" />
                  <h3 className="mt-5 text-sm font-bold text-brand-ink">Membership Details</h3>
                  <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <InfoRow
                      icon={Wallet}
                      label="Payable Amount"
                      value={formatCurrency(member.payableAmount)}
                    />
                    <InfoRow
                      icon={CalendarDays}
                      label="Joined Date"
                      value={formatDate(member.joinedDate)}
                    />
                    <InfoRow
                      icon={CalendarX}
                      label="Exit Date"
                      value={member.exitDate ? formatDate(member.exitDate) : "-"}
                    />
                    <InfoRow
                      icon={IdCard}
                      label="Membership ID"
                      title={member.id}
                      value={member.id.slice(0, 8)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Enrolled Groups Card */}
            <div className="rounded-xl border border-brand bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-brand-ink">Enrolled Groups</h2>
                <span className="inline-flex items-center rounded-full border border-[#c3e4ba]/40 bg-[#e2f1df]/60 px-2.5 py-0.5 text-[10px] font-bold text-[#056c5c]">
                  {user.groups?.length ?? 0}
                </span>
              </div>
              <div className="mt-4 h-px bg-[#d9e2dc]" />

              {user.groups && user.groups.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {user.groups.map((group) => {
                    const isCurrent = member?.groupId === group.id
                    return (
                      <li key={group.id}>
                        <Link
                          to="/groups"
                          className={cn(
                            "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                            isCurrent
                              ? "border-[#078a76]/40 bg-[#e2f1df]/50"
                              : "border-[#cedbd3] bg-white hover:bg-[#f5f7f3]/60"
                          )}
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#cedbd3] bg-[#f5f7f3] text-[#078a76]">
                            <Users className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <span
                              className="block truncate text-sm font-semibold text-[#183630]"
                              title={group.groupName}
                            >
                              {group.groupName}
                            </span>
                            <span className="block text-xs text-[#788b83]">
                              {isCurrent ? "Current membership" : "Enrolled"}
                            </span>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#cedbd3] bg-[#f5f7f3]/40 p-6 text-center">
                  <div className="mb-2 flex size-10 items-center justify-center rounded-full border border-[#cedbd3] bg-white text-[#078a76]">
                    <Users className="size-5" />
                  </div>
                  <p className="text-sm font-semibold text-brand-ink">No groups yet</p>
                  <p className="mt-1 text-xs text-[#60736c]">
                    This member is not enrolled in any savings group.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupMemberDetails
