import { useState, useEffect, useCallback } from "react"
import {
  Search,
  RotateCcw,
  Users,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  RefreshCw,
  X,
  Eye,
  AlertTriangle,
} from "lucide-react"
import { groupService, type Group } from "@/services/groupService"
import { BisiType } from "@/enums/enum"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebounce } from "@/hooks/useDebouce"
import { CreateGroupDialog } from "@/components/CerateGroupDialog"

// Display configurations for BisiTypes matching the BisiPro theme palette
const bisiTypeConfig: Record<
  BisiType,
  { name: string; bg: string; text: string; border: string; icon: string }
> = {
  [BisiType.FixedRotation]: {
    name: "Fixed Rotation",
    bg: "bg-[#e2f1df]/60",
    text: "text-[#164238]",
    border: "border-[#c3e4ba]/40",
    icon: "🔄",
  },
  [BisiType.Auction]: {
    name: "Auction",
    bg: "bg-blue-50/80",
    text: "text-[#0369a1]",
    border: "border-blue-200/40",
    icon: "🔨",
  },
  [BisiType.LuckyDraw]: {
    name: "Lucky Draw",
    bg: "bg-amber-50/80",
    text: "text-[#b45309]",
    border: "border-amber-200/40",
    icon: "🎫",
  },
  [BisiType.ManualSelection]: {
    name: "Manual Selection",
    bg: "bg-purple-50/80",
    text: "text-[#6b21a8]",
    border: "border-purple-200/40",
    icon: "👤",
  },
}

const GroupsPage = () => {
  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Query state
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [bisiType, setBisiType] = useState<BisiType | undefined>(undefined)
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined)
  const [sortBy, setSortBy] = useState<string>("groupName")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Data state
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch groups from API
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await groupService.getGroups({
        search: debouncedSearch || undefined,
        bisiType,
        isActive,
        sortBy,
        sortOrder,
        pageNumber,
        pageSize,
      })

      if (response && response.isSuccess) {
        setGroups(response.data || [])
        setTotalCount(response.totalCount || 0)
        setTotalPages(response.totalPages || 1)
      } else {
        setError(response?.error || "Failed to fetch groups data.")
      }
    } catch (err: any) {
      console.error("Error fetching groups:", err)
      setError(err?.message || "An unexpected error occurred while fetching groups.")
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, bisiType, isActive, sortBy, sortOrder, pageNumber, pageSize])

  // Trigger fetch when query parameters change
  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  // Handle Sort Change
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
    setPageNumber(1)
  }

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSearch("")
    setBisiType(undefined)
    setIsActive(undefined)
    setSortBy("groupName")
    setSortOrder("asc")
    setPageNumber(1)
  }

  // Helper to render sort indicator icons
  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="size-3.5 text-[#94a39d] opacity-50" />
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="size-3.5 text-[#078a76]" />
    ) : (
      <ArrowDown className="size-3.5 text-[#078a76]" />
    )
  }


  // Generate pagination range helper
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const delta = 1 // Number of sibling pages to show around current page

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }

    // Always show page 1
    pages.push(1)

    let left = pageNumber - delta
    let right = pageNumber + delta

    if (left <= 2) {
      left = 2
      right = Math.min(4, totalPages - 1)
    } else if (right >= totalPages - 1) {
      left = Math.max(totalPages - 3, 2)
      right = totalPages - 1
    }

    if (left > 2) {
      pages.push("ellipsis")
    }

    for (let i = left; i <= right; i++) {
      pages.push(i)
    }

    if (right < totalPages - 1) {
      pages.push("ellipsis")
    }

    // Always show last page
    pages.push(totalPages)

    return pages
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPageNumber(page)
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Group Dialog */}
      <CreateGroupDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          setPageNumber(1)
          fetchGroups()
        }}
      />
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-page-title font-bold tracking-tight text-brand-ink">
            Groups Workspace
          </h1>
          <p className="mt-1 text-sm text-[#60736c]">
            Create and monitor rotating savings groups, monthly auctions, and member allocations.
          </p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="cursor-pointer h-10 rounded-xl bg-brand font-semibold text-white shadow-md hover:bg-brand/90 sm:self-center flex items-center gap-1.5 px-4"
        >
          <Plus className="size-4" />
          <span>New Group</span>
        </Button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="rounded-xl border border-brand/40 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute top-3 left-3 size-4 text-[#788b83] pointer-events-none" />
            <Input
              type="text"
              placeholder="Search groups by name or description..."
              className="pl-9 h-10 w-full rounded-xl bg-[#f5f7f3]/50 focus:bg-white border-[#cedbd3] placeholder:text-[#788b83] text-[#183630]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute top-3 right-3 text-[#788b83] hover:text-[#183630] transition-colors"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="relative w-full md:w-52">
            <select
              className="w-full h-10 rounded-xl border border-[#cedbd3] bg-[#f5f7f3]/50 pl-3 pr-9 py-1.5 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50 focus:bg-white text-[#183630] appearance-none cursor-pointer"
              value={bisiType ?? ""}
              onChange={(e) => {
                const val = e.target.value
                setBisiType(val ? (Number(val) as unknown as BisiType) : undefined)
                setPageNumber(1)
              }}
            >
              <option value="">All Group Types</option>
              <option value={BisiType.FixedRotation}>Fixed Rotation (🔄)</option>
              <option value={BisiType.Auction}>Auction (🔨)</option>
              <option value={BisiType.LuckyDraw}>Lucky Draw (🎫)</option>
              <option value={BisiType.ManualSelection}>Manual Selection (👤)</option>
            </select>
            <ChevronDown className="absolute top-3 right-3 size-4 text-[#788b83] pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative w-full md:w-44">
            <select
              className="w-full h-10 rounded-xl border border-[#cedbd3] bg-[#f5f7f3]/50 pl-3 pr-9 py-1.5 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50 focus:bg-white text-[#183630] appearance-none cursor-pointer"
              value={isActive === undefined ? "" : String(isActive)}
              onChange={(e) => {
                const val = e.target.value
                setIsActive(val === "" ? undefined : val === "true")
                setPageNumber(1)
              }}
            >
              <option value="">All Statuses</option>
              <option value="true">Active Groups</option>
              <option value="false">Inactive Groups</option>
            </select>
            <ChevronDown className="absolute top-3 right-3 size-4 text-[#788b83] pointer-events-none" />
          </div>

          {/* Reset Filters Option */}
          {(search || bisiType !== undefined || isActive !== undefined) && (
            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="h-10 px-3 text-[#078a76] hover:text-[#056c5c] hover:bg-[#e2f1df] rounded-xl flex items-center gap-1.5"
            >
              <RotateCcw className="size-4" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-8 text-center text-red-800">
          <AlertTriangle className="size-10 text-red-600 mb-3" />
          <h3 className="text-lg font-bold">Failed to Load Groups</h3>
          <p className="mt-1 text-sm max-w-md text-red-700/80">{error}</p>
          <Button
            onClick={fetchGroups}
            variant="outline"
            className="mt-4 border-red-200 bg-white text-red-800 hover:bg-red-50 flex items-center gap-2 rounded-xl"
          >
            <RefreshCw className="size-4" />
            <span>Try Again</span>
          </Button>
        </div>
      ) : loading ? (
        /* Loading Skeleton State */
        <div className="space-y-4">
          <div className="hidden md:block rounded-xl border border-brand/30 bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-[#f5f7f3]/50">
                <TableRow>
                  <TableHead className="w-[180px]"><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead className="w-[140px]"><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-12" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead className="w-[100px]"><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(pageSize)].map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-lg" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="rounded-xl border border-[#cedbd3] bg-white p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-px bg-muted" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : groups.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#cedbd3] bg-white p-12 text-center shadow-sm">
          <div className="flex size-14 items-center justify-center rounded-full bg-[#f5f7f3] text-[#078a76] mb-4">
            <Users className="size-7" />
          </div>
          <h3 className="text-lg font-bold text-brand-ink">No groups found</h3>
          <p className="mt-1 text-sm text-[#60736c] max-w-sm">
            {search || bisiType !== undefined || isActive !== undefined
              ? "We couldn't find any groups matching your filter parameters. Try resetting your search filters."
              : "There are currently no savings groups in this workspace. Create your first group to get started."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {(search || bisiType !== undefined || isActive !== undefined) ? (
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="border-[#cedbd3] text-[#078a76] hover:bg-[#e2f1df] rounded-xl px-4"
              >
                <RotateCcw className="size-4 mr-2" />
                <span>Reset Filters</span>
              </Button>
            ) : (
              <Button className="bg-brand text-white hover:bg-brand/90 rounded-xl px-4 flex items-center gap-1.5">
                <Plus className="size-4" />
                <span>Create Group</span>
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Data Display States */
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-xl border border-brand/40 bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-[#f5f7f3]/50">
                <TableRow>
                  <TableHead
                    onClick={() => handleSort("groupName")}
                    className="cursor-pointer font-semibold text-brand-ink hover:bg-[#f5f7f3]/70 transition-colors w-[220px]"
                  >
                    <div className="flex items-center gap-1.5">
                      Group Name
                      {renderSortIcon("groupName")}
                    </div>
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("bisiType")}
                    className="cursor-pointer font-semibold text-brand-ink hover:bg-[#f5f7f3]/70 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Group Type
                      {renderSortIcon("bisiType")}
                    </div>
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("monthlyAmount")}
                    className="cursor-pointer font-semibold text-brand-ink hover:bg-[#f5f7f3]/70 transition-colors text-right pr-6"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      Monthly Amount
                      {renderSortIcon("monthlyAmount")}
                    </div>
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("totalMembers")}
                    className="cursor-pointer font-semibold text-brand-ink hover:bg-[#f5f7f3]/70 transition-colors text-center"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Members
                      {renderSortIcon("totalMembers")}
                    </div>
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("durationInMonths")}
                    className="cursor-pointer font-semibold text-brand-ink hover:bg-[#f5f7f3]/70 transition-colors text-center"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Duration
                      {renderSortIcon("durationInMonths")}
                    </div>
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("startDate")}
                    className="cursor-pointer font-semibold text-brand-ink hover:bg-[#f5f7f3]/70 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Start Date
                      {renderSortIcon("startDate")}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-brand-ink">End Date</TableHead>
                  <TableHead
                    onClick={() => handleSort("isActive")}
                    className="cursor-pointer font-semibold text-brand-ink hover:bg-[#f5f7f3]/70 transition-colors w-[120px] text-center"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Status
                      {renderSortIcon("isActive")}
                    </div>
                  </TableHead>
                  <TableHead className="w-[85px] text-center font-semibold text-brand-ink">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-[#d9e2dc]">
                {groups.map((group) => {
                  const typeInfo = bisiTypeConfig[group.bisiType] || {
                    name: "Unknown",
                    bg: "bg-gray-100",
                    text: "text-gray-800",
                    border: "border-gray-200",
                    icon: "❓",
                  }
                  return (
                    <TableRow
                      key={group.groupId}
                      className="hover:bg-[#f5f7f3]/35 transition-colors duration-150"
                    >
                      <TableCell className="font-semibold text-[#183630] py-3.5">
                        <div className="truncate max-w-[200px]" title={group.groupName}>
                          {group.groupName}
                        </div>
                        {group.description && (
                          <div className="text-xs text-[#788b83] font-normal truncate max-w-[200px]" title={group.description}>
                            {group.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border",
                            typeInfo.bg,
                            typeInfo.text,
                            typeInfo.border
                          )}
                        >
                          <span className="text-[10px]">{typeInfo.icon}</span>
                          <span>{typeInfo.name}</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium pr-6 text-[#183630]">
                        {formatCurrency(group.monthlyAmount)}
                      </TableCell>
                      <TableCell className="text-center font-medium text-[#183630]">
                        {group.totalMembers}
                      </TableCell>
                      <TableCell className="text-center font-medium text-[#183630]">
                        {group.durationInMonths} <span className="text-xs text-[#788b83]">mos</span>
                      </TableCell>
                      <TableCell className="text-[#60736c]">{formatDate(group.startDate)}</TableCell>
                      <TableCell className="text-[#60736c]">{formatDate(group.endDate)}</TableCell>
                      <TableCell className="text-center">
                        {group.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e2f1df] text-[#056c5c] border border-[#c3e4ba]/30">
                            <span className="size-1.5 rounded-full bg-[#078a76] animate-pulse" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                            <span className="size-1.5 rounded-full bg-gray-400" />
                            <span>Inactive</span>
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer text-[#60736c] hover:text-[#078a76] hover:bg-[#eef5f0] rounded-lg"
                          title="View Details"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards Grid View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {groups.map((group) => {
              const typeInfo = bisiTypeConfig[group.bisiType] || {
                name: "Unknown",
                bg: "bg-gray-100",
                text: "text-gray-800",
                border: "border-gray-200",
                icon: "❓",
              }
              return (
                <div
                  key={group.groupId}
                  className="rounded-xl border border-[#cedbd3] bg-white p-4 shadow-sm hover:border-[#078a76] transition-all space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[#183630] text-base leading-tight">
                        {group.groupName}
                      </h3>
                      {group.description && (
                        <p className="text-xs text-[#788b83] mt-0.5 line-clamp-1">
                          {group.description}
                        </p>
                      )}
                    </div>
                    {group.isActive ? (
                      <span className="flex size-2 shrink-0 rounded-full bg-[#078a76] mt-1.5" />
                    ) : (
                      <span className="flex size-2 shrink-0 rounded-full bg-gray-400 mt-1.5" />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                        typeInfo.bg,
                        typeInfo.text,
                        typeInfo.border
                      )}
                    >
                      <span>{typeInfo.icon}</span>
                      <span>{typeInfo.name}</span>
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center text-[10px] px-2 py-0.5 rounded-full font-semibold border",
                        group.isActive
                          ? "bg-[#e2f1df] text-[#056c5c] border-[#c3e4ba]/30"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      )}
                    >
                      {group.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="h-px bg-[#d9e2dc]" />

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                    <div>
                      <span className="text-[#788b83] block">Monthly Contribution</span>
                      <span className="font-bold text-[#183630]">
                        {formatCurrency(group.monthlyAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#788b83] block">Total Members</span>
                      <span className="font-bold text-[#183630]">{group.totalMembers} Members</span>
                    </div>
                    <div>
                      <span className="text-[#788b83] block">Duration</span>
                      <span className="font-bold text-[#183630]">
                        {group.durationInMonths} Months
                      </span>
                    </div>
                    <div>
                      <span className="text-[#788b83] block">Start Date</span>
                      <span className="font-semibold text-[#183630]">
                        {formatDate(group.startDate)}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-[#d9e2dc]" />

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#cedbd3] text-[#29463f] hover:bg-[#f5f7f3] rounded-lg w-full flex justify-center items-center gap-1.5"
                    >
                      <Eye className="size-3.5" />
                      <span>View Details</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination Controls Footer Container */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-brand/40 bg-white p-4 shadow-sm">
            {/* Left Side: Summary and Page Size Select */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#60736c] justify-between sm:justify-start">
              <span>
                Showing <span className="font-semibold text-brand-ink">{(pageNumber - 1) * pageSize + 1}</span> to{" "}
                <span className="font-semibold text-brand-ink">
                  {Math.min(pageNumber * pageSize, totalCount)}
                </span> of{" "}
                <span className="font-semibold text-brand-ink">{totalCount}</span> groups
              </span>

              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <div className="relative">
                  <select
                    className="h-8 rounded-lg border border-[#cedbd3] bg-[#f5f7f3]/50 pl-2 pr-6 py-0.5 text-xs outline-none text-[#183630] appearance-none cursor-pointer hover:bg-[#eef5f0]"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      setPageNumber(1)
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <ChevronDown className="absolute top-2.5 right-1.5 size-3.5 text-[#788b83] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Right Side: Page Navigation buttons */}
            <Pagination className="w-auto mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault()
                      if (pageNumber > 1) handlePageChange(pageNumber - 1)
                    }}
                    href="#"
                    className={cn(
                      "cursor-pointer text-xs rounded-lg px-2 h-8",
                      pageNumber === 1 && "pointer-events-none opacity-40"
                    )}
                  />
                </PaginationItem>

                {getPageNumbers().map((p, idx) => {
                  if (p === "ellipsis") {
                    return (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis className="size-8" />
                      </PaginationItem>
                    )
                  }
                  return (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === pageNumber}
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(p)
                        }}
                        href="#"
                        className={cn(
                          "cursor-pointer size-8 rounded-lg text-xs font-semibold hover:bg-[#eef5f0]",
                          p === pageNumber && "border-[#078a76] text-[#078a76] bg-[#e2f1df]/50"
                        )}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault()
                      if (pageNumber < totalPages) handlePageChange(pageNumber + 1)
                    }}
                    href="#"
                    className={cn(
                      "cursor-pointer text-xs rounded-lg px-2 h-8",
                      pageNumber === totalPages && "pointer-events-none opacity-40"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupsPage
