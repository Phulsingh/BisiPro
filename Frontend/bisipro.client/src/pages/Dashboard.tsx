import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  Users,
  Layers,
  UserCheck,
  CircleCheckBig,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  CalendarDays,
  Sparkles,
} from "lucide-react"
import {
  AdminDashboardService,
  type summary,
  type recentGroups,
  type recentMembers,
} from "@/services/adminDashboardService"
import { cn, formatDate, getInitials } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/context/authContext"

/** One of the four headline metrics, with an active-share progress bar */
const StatCard = ({
  icon: Icon,
  label,
  value,
  caption,
  ratio,
}: {
  icon: React.ElementType
  label: string
  value: number
  caption: string
  ratio: number
}) => (
  <div className="rounded-xl border border-brand bg-white p-5 shadow-sm transition-colors hover:border-[#078a76]/40">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-[#788b83]">{label}</p>
        <p className="mt-1.5 text-3xl font-bold tracking-tight text-brand-ink">{value}</p>
      </div>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#c3e4ba]/40 bg-[#e2f1df]/70 text-[#056c5c]">
        <Icon className="size-5" />
      </span>
    </div>

    <div className="mt-4">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eef2ef]">
        <div
          className="h-full rounded-full bg-[#078a76] transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, ratio))}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-[#60736c]">{caption}</p>
    </div>
  </div>
)

/** Card shell shared by the two recent-activity panels */
const ListCard = ({
  title,
  description,
  count,
  viewAllHref,
  children,
}: {
  title: string
  description: string
  count: number
  viewAllHref: string
  children: React.ReactNode
}) => (
  <div className="flex flex-col rounded-xl border border-brand bg-white shadow-sm">
    <div className="flex items-start justify-between gap-3 p-5">
      <div>
        <h2 className="text-base font-bold text-brand-ink">{title}</h2>
        <p className="mt-0.5 text-xs text-[#60736c]">{description}</p>
      </div>
      <span className="inline-flex shrink-0 items-center rounded-full border border-[#c3e4ba]/40 bg-[#e2f1df]/60 px-2.5 py-0.5 text-[10px] font-bold text-[#056c5c]">
        {count}
      </span>
    </div>

    <div className="h-px bg-[#d9e2dc]" />
    <div className="flex-1 p-3">{children}</div>
    <div className="h-px bg-[#d9e2dc]" />

    <Link
      to={viewAllHref}
      className="flex items-center justify-center gap-1.5 p-3 text-sm font-semibold text-[#078a76] transition-colors hover:bg-[#f5f7f3]/60 hover:text-[#056c5c]"
    >
      <span>View all</span>
      <ArrowRight className="size-4" />
    </Link>
  </div>
)

/** Placeholder shown inside a list card when the API returns no rows */
const EmptyList = ({ icon: Icon, message }: { icon: React.ElementType; message: string }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#cedbd3] bg-[#f5f7f3]/40 p-8 text-center">
    <div className="mb-2 flex size-10 items-center justify-center rounded-full border border-[#cedbd3] bg-white text-[#078a76]">
      <Icon className="size-5" />
    </div>
    <p className="text-sm font-semibold text-brand-ink">Nothing yet</p>
    <p className="mt-1 max-w-[15rem] text-xs text-[#60736c]">{message}</p>
  </div>
)

const greetingForNow = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

/** Share of total expressed as a percentage, guarding against a zero total */
const percentOf = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0)

const Dashboard = () => {
  const { user } = useAuth()

  const [summary, setSummary] = useState<summary | null>(null)
  const [groups, setGroups] = useState<recentGroups[]>([])
  const [members, setMembers] = useState<recentMembers[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch the whole dashboard payload in one call
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await AdminDashboardService.getAdminDashboard()

      if (response && response.isSuccess && response.data) {
        setSummary(response.data.summary)
        setGroups(response.data.recentGroups || [])
        setMembers(response.data.recentMembers || [])
      } else {
        setError(response?.error || "Failed to fetch dashboard data.")
      }
    } catch (err: any) {
      console.error("Error fetching dashboard:", err)
      setError(err?.message || "An unexpected error occurred while fetching the dashboard.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const firstName = user?.fullName?.trim().split(/\s+/)[0] || "there"

  const activeGroupShare = percentOf(summary?.totalActiveGroups ?? 0, summary?.totalGroups ?? 0)
  const activeMemberShare = percentOf(summary?.totalActiveMembers ?? 0, summary?.totalMembers ?? 0)

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-page-title font-bold tracking-tight text-brand-ink">
            {greetingForNow()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-[#60736c]">
            Here's how your savings groups and members are tracking across the workspace today.
          </p>
        </div>
        <Button
          onClick={fetchDashboard}
          disabled={loading}
          variant="outline"
          className="h-10 cursor-pointer gap-2 rounded-xl border-[#cedbd3] bg-white px-4 text-[#29463f] hover:bg-[#f5f7f3] sm:self-center"
        >
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Main Content Area */}
      {error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-8 text-center text-red-800">
          <AlertTriangle className="mb-3 size-10 text-red-600" />
          <h3 className="text-lg font-bold">Failed to Load Dashboard</h3>
          <p className="mt-1 max-w-md text-sm text-red-700/80">{error}</p>
          <Button
            onClick={fetchDashboard}
            variant="outline"
            className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl border-red-200 bg-white text-red-800 hover:bg-red-50"
          >
            <RefreshCw className="size-4" />
            <span>Try Again</span>
          </Button>
        </div>
      ) : loading ? (
        /* Loading Skeleton State */
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="rounded-xl border border-brand bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="size-10 rounded-xl" />
                </div>
                <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
                <Skeleton className="mt-2 h-3 w-32" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[...Array(2)].map((_, cardIdx) => (
              <div key={cardIdx} className="rounded-xl border border-brand bg-white shadow-sm">
                <div className="space-y-2 p-5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <div className="h-px bg-[#d9e2dc]" />
                <div className="space-y-2 p-3">
                  {[...Array(5)].map((_, rowIdx) => (
                    <div key={rowIdx} className="flex items-center gap-3 p-2">
                      <Skeleton className="size-10 rounded-full" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Data Display States */
        <div className="space-y-6">
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Layers}
              label="Total Groups"
              value={summary?.totalGroups ?? 0}
              ratio={activeGroupShare}
              caption={`${summary?.totalActiveGroups ?? 0} active (${activeGroupShare}%)`}
            />
            <StatCard
              icon={CircleCheckBig}
              label="Active Groups"
              value={summary?.totalActiveGroups ?? 0}
              ratio={activeGroupShare}
              caption={`of ${summary?.totalGroups ?? 0} groups in total`}
            />
            <StatCard
              icon={Users}
              label="Total Members"
              value={summary?.totalMembers ?? 0}
              ratio={activeMemberShare}
              caption={`${summary?.totalActiveMembers ?? 0} active (${activeMemberShare}%)`}
            />
            <StatCard
              icon={UserCheck}
              label="Active Members"
              value={summary?.totalActiveMembers ?? 0}
              ratio={activeMemberShare}
              caption={`of ${summary?.totalMembers ?? 0} members in total`}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recently Created Groups */}
            <ListCard
              title="Recent Groups"
              description="The newest savings groups in your workspace"
              count={groups.length}
              viewAllHref="/groups"
            >
              {groups.length > 0 ? (
                <ul className="space-y-1">
                  {groups.map((group) => (
                    <li key={group.id}>
                      <Link
                        to="/groups"
                        className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#f5f7f3]/70"
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c3e4ba]/40 bg-[#e2f1df]/70 text-xs font-bold text-[#056c5c]">
                          {getInitials(group.groupName)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate font-semibold text-[#183630]"
                            title={group.groupName}
                          >
                            {group.groupName}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-[#788b83]">
                            <CalendarDays className="size-3" />
                            Created {formatDate(group.createdAt)}
                          </p>
                        </div>
                        <ChevronRight className="size-4 shrink-0 text-[#a0b0aa]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyList
                  icon={Layers}
                  message="Create your first savings group to see it appear here."
                />
              )}
            </ListCard>

            {/* Recently Joined Members */}
            <ListCard
              title="Recent Members"
              description="The latest members to join a savings group"
              count={members.length}
              viewAllHref="/group/members"
            >
              {members.length > 0 ? (
                <ul className="space-y-1">
                  {members.map((member) => (
                    <li key={`${member.id}-${member.groupId}`}>
                      <Link
                        to={`/group/members/${member.id}`}
                        className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#f5f7f3]/70"
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c3e4ba]/40 bg-[#e2f1df]/70 text-xs font-bold text-[#056c5c]">
                          {getInitials(member.fullName)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-[#183630]" title={member.fullName}>
                            {member.fullName}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#788b83]">
                            <Users className="size-3 shrink-0" />
                            <span className="truncate" title={member.groupName}>
                              {member.groupName}
                            </span>
                          </p>
                        </div>
                        <span className="hidden shrink-0 text-xs text-[#60736c] sm:block">
                          {formatDate(member.joinedDate)}
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-[#a0b0aa]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyList
                  icon={Users}
                  message="Members will show up here as soon as they join a group."
                />
              )}
            </ListCard>
          </div>

          {/* Quick Actions Footer */}
          <div className="flex flex-col gap-4 rounded-xl border border-brand bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#c3e4ba]/40 bg-[#e2f1df]/70 text-[#056c5c]">
                <Sparkles className="size-5" />
              </span>
              <div>
                <p className="font-bold text-brand-ink">Keep things moving</p>
                <p className="mt-0.5 text-sm text-[#60736c]">
                  Jump straight into your groups or review member enrolment.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/groups"
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#cedbd3] bg-white px-4 text-sm font-semibold text-[#29463f] transition-colors hover:bg-[#f5f7f3]"
              >
                <Layers className="size-4" />
                Manage Groups
              </Link>
              <Link
                to="/group/members"
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#078a76] px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(7,138,118,0.18)] transition-colors hover:bg-[#056c5c]"
              >
                <Users className="size-4" />
                View Members
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
