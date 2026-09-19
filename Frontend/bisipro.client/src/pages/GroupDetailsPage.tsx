import { useCallback, useEffect, useState, type ElementType, type ReactNode } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AlertTriangle, ArrowLeft, CalendarDays, CalendarRange, CircleDollarSign, Clock3, Gavel, Handshake, RefreshCw, Repeat2, Trophy, Users, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BisiType } from "@/enums/enum"
import { cn, formatCurrency, formatDate, getInitials } from "@/lib/utils"
import { groupService, type Group } from "@/services/groupService"

const bisiTypeDetails: Record<BisiType, { label: string; description: string; icon: ElementType; className: string }> = {
  [BisiType.FixedRotation]: { label: "Fixed Rotation", description: "Members receive the pool in a pre-set order.", icon: Repeat2, className: "border-[#c3e4ba] bg-[#e2f1df] text-[#056c5c]" },
  [BisiType.Auction]: { label: "Auction", description: "Members bid for the monthly pooled amount.", icon: Gavel, className: "border-blue-200 bg-blue-50 text-blue-700" },
  [BisiType.LuckyDraw]: { label: "Lucky Draw", description: "The recipient is chosen by a monthly draw.", icon: Trophy, className: "border-amber-200 bg-amber-50 text-amber-700" },
  [BisiType.ManualSelection]: { label: "Manual Selection", description: "The administrator selects each monthly recipient.", icon: Handshake, className: "border-purple-200 bg-purple-50 text-purple-700" },
}

const InfoRow = ({ icon: Icon, label, value }: { icon: ElementType; label: string; value: ReactNode }) => (
  <div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#cedbd3] bg-[#f5f7f3] text-[#078a76]"><Icon className="size-4" /></span><div className="min-w-0"><span className="block text-xs font-medium text-[#788b83]">{label}</span><span className="block text-sm font-semibold text-[#183630]">{value}</span></div></div>
)

const StatCard = ({ icon: Icon, label, value, accent }: { icon: ElementType; label: string; value: ReactNode; accent?: boolean }) => (
  <div className="rounded-xl border border-brand bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-xs font-medium text-[#788b83]"><Icon className="size-3.5" /><span>{label}</span></div><p className={cn("mt-2 text-lg font-bold tracking-tight", accent ? "text-[#056c5c]" : "text-brand-ink")}>{value}</p></div>
)

const GroupDetailsPage = () => {
  const { groupId = "" } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGroup = useCallback(async () => {
    if (!groupId) { setError("No group was selected."); setLoading(false); return }
    try {
      setLoading(true); setError(null)
      const response = await groupService.getGroupById(groupId)
      if (response?.isSuccess) setGroup(response.data)
      else setError(response?.error || "Failed to fetch group details.")
    } catch (err: any) {
      console.error("Error fetching group details:", err)
      setError(err?.message || "An unexpected error occurred while fetching group details.")
    } finally { setLoading(false) }
  }, [groupId])

  useEffect(() => { fetchGroup() }, [fetchGroup])
  const backToGroups = () => navigate("/groups")

  if (error) return <div className="space-y-6"><BackButton onClick={backToGroups} /><div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-8 text-center text-red-800"><AlertTriangle className="mb-3 size-10 text-red-600" /><h1 className="text-lg font-bold">Failed to Load Group Details</h1><p className="mt-1 max-w-md text-sm text-red-700/80">{error}</p><Button onClick={fetchGroup} variant="outline" className="mt-4 rounded-xl border-red-200 bg-white text-red-800 hover:bg-red-50"><RefreshCw className="mr-2 size-4" />Try Again</Button></div></div>
  if (loading) return <div className="space-y-6"><BackButton onClick={backToGroups} /><div className="rounded-xl border border-brand bg-white p-6 shadow-sm"><div className="flex items-center gap-4"><Skeleton className="size-16 rounded-2xl" /><div className="space-y-2"><Skeleton className="h-7 w-52" /><Skeleton className="h-4 w-72" /></div></div></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((item) => <div key={item} className="rounded-xl border border-brand bg-white p-4 shadow-sm"><Skeleton className="h-3 w-24" /><Skeleton className="mt-3 h-6 w-32" /></div>)}</div><div className="grid grid-cols-1 gap-6 lg:grid-cols-3"><div className="space-y-5 rounded-xl border border-brand bg-white p-6 shadow-sm lg:col-span-2"><Skeleton className="h-5 w-40" /><div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{[0, 1, 2, 3, 4, 5].map((item) => <Skeleton key={item} className="h-10 w-full" />)}</div></div><Skeleton className="h-64 rounded-xl" /></div></div>
  if (!group) return <div className="space-y-6"><BackButton onClick={backToGroups} /><div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#cedbd3] bg-white p-12 text-center shadow-sm"><Users className="mb-4 size-9 text-[#078a76]" /><h1 className="text-lg font-bold text-brand-ink">Group not found</h1><p className="mt-1 text-sm text-[#60736c]">This group may have been removed from the workspace.</p><Button onClick={backToGroups} variant="outline" className="mt-6 rounded-xl border-[#cedbd3] text-[#078a76]">Back to Groups</Button></div></div>

  const type = bisiTypeDetails[group.bisiType] || bisiTypeDetails[BisiType.FixedRotation]
  const TypeIcon = type.icon
  return <div className="space-y-6"><BackButton onClick={backToGroups} />
    <section className="relative overflow-hidden rounded-xl border border-brand bg-white p-6 shadow-sm"><div className="absolute inset-y-0 left-0 w-1.5 bg-[#078a76]" /><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="flex min-w-0 items-start gap-4"><span className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-[#c3e4ba]/60 bg-[#e2f1df]/70 text-lg font-bold text-[#056c5c]">{getInitials(group.groupName)}</span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h1 className="truncate text-page-title font-bold tracking-tight text-brand-ink">{group.groupName}</h1><span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold", group.isActive ? "border-[#c3e4ba] bg-[#e2f1df] text-[#056c5c]" : "border-gray-200 bg-gray-100 text-gray-500")}><span className={cn("size-1.5 rounded-full", group.isActive ? "bg-[#078a76]" : "bg-gray-400")} />{group.isActive ? "Active" : "Inactive"}</span></div><p className="mt-2 max-w-2xl text-sm leading-6 text-[#60736c]">{group.description || "No description has been added for this savings group."}</p></div></div><span className={cn("inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold", type.className)}><TypeIcon className="size-4" />{type.label}</span></div></section>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={Wallet} label="Monthly contribution" value={formatCurrency(group.monthlyAmount)} accent /><StatCard icon={Users} label="Member capacity" value={`${group.totalMembers} members`} /><StatCard icon={CalendarRange} label="Duration" value={`${group.durationInMonths} months`} /><StatCard icon={CircleDollarSign} label="Estimated pool" value={formatCurrency(group.monthlyAmount * group.totalMembers)} /></div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3"><section className="rounded-xl border border-brand bg-white p-6 shadow-sm lg:col-span-2"><div className="flex items-center justify-between"><h2 className="text-base font-bold text-brand-ink">Group schedule</h2><span className="text-xs text-[#788b83]">Key dates and collection settings</span></div><div className="mt-4 h-px bg-[#d9e2dc]" /><div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2"><InfoRow icon={CalendarDays} label="Start date" value={formatDate(group.startDate)} /><InfoRow icon={CalendarRange} label="End date" value={group.endDate ? formatDate(group.endDate) : "Not set"} /><InfoRow icon={Clock3} label="Collection day" value={`Day ${group.collectionDay} of each month`} />{group.bisiType === BisiType.Auction && <InfoRow icon={Gavel} label="Auction day" value={group.auctionDay ? `Day ${group.auctionDay} of each month` : "Not set"} />}</div></section><section className="rounded-xl border border-brand bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className={cn("flex size-10 items-center justify-center rounded-xl border", type.className)}><TypeIcon className="size-5" /></span><div><h2 className="text-base font-bold text-brand-ink">{type.label}</h2><p className="text-xs text-[#788b83]">Payout method</p></div></div><p className="mt-5 text-sm leading-6 text-[#60736c]">{type.description}</p><div className="mt-5 rounded-xl border border-[#cedbd3] bg-[#f5f7f3]/60 p-4"><span className="block text-xs font-medium text-[#788b83]">Group status</span><span className="mt-1 block text-sm font-bold text-[#183630]">{group.isActive ? "Currently accepting activity" : "Currently inactive"}</span></div></section></div>
    <section className="rounded-xl border border-brand bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-base font-bold text-brand-ink">Payment terms</h2><span className="text-xs text-[#788b83]">Applied to overdue collections</span></div><div className="mt-4 h-px bg-[#d9e2dc]" /><div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3"><InfoRow icon={Wallet} label="Monthly contribution" value={formatCurrency(group.monthlyAmount)} /><InfoRow icon={CircleDollarSign} label="Late fee" value={formatCurrency(group.lateFee)} /><InfoRow icon={Clock3} label="Grace period" value={`${group.gracePeriod} day${group.gracePeriod === 1 ? "" : "s"}`} /></div></section>
  </div>
}

const BackButton = ({ onClick }: { onClick: () => void }) => <Button variant="ghost" onClick={onClick} className="-ml-2 flex h-9 cursor-pointer items-center gap-1.5 rounded-xl px-2 text-[#60736c] hover:bg-[#e2f1df] hover:text-[#078a76]"><ArrowLeft className="size-4" /><span>Back to Groups</span></Button>

export default GroupDetailsPage
