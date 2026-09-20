import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2, Search, UsersRound } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn, getInitials } from "@/lib/utils"
import { userService, type AgentDropdownItem } from "@/services/userService"
import { useDebounce } from "@/hooks/useDebouce"

type AgentCommandDropdownProps = {
  value: string[]
  onValueChange: (agentIds: string[]) => void
  disabled?: boolean
}

const PAGE_SIZE = 20

/**
 * Searchable multi-select command list for agent assignments. It loads the
 * next server page when its scroll container reaches the end.
 */
export function AgentCommandDropdown({
  value,
  onValueChange,
  disabled = false,
}: AgentCommandDropdownProps) {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 250)
  const [agents, setAgents] = useState<AgentDropdownItem[]>([])
  const [page, setPage] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestId = useRef(0)

  const loadPage = useCallback(async (pageNumber: number, replace: boolean) => {
    const activeRequestId = ++requestId.current

    try {
      setLoading(true)
      setError(null)

      const response = await userService.getAgentsDropdown({
        pageNumber,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
      })

      if (activeRequestId !== requestId.current) return

      if (!response?.isSuccess || !response.data || !Array.isArray(response.data.data)) {
        setError(response?.error || "Unable to load agents.")
        if (replace) setAgents([])
        return
      }

      const result = response.data
      setAgents((currentAgents) => {
        if (replace) return result.data

        const knownIds = new Set(currentAgents.map((agent) => agent.userId))
        return [...currentAgents, ...result.data.filter((agent) => !knownIds.has(agent.userId))]
      })
      setPage(result.pageNumber)
      setHasNextPage(result.hasNext || result.pageNumber < result.totalPages)
    } catch (err: any) {
      if (activeRequestId !== requestId.current) return
      console.error("Error fetching agents:", err)
      setError(err?.message || "Unable to load agents.")
      if (replace) setAgents([])
    } finally {
      if (activeRequestId === requestId.current) setLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    void loadPage(1, true)
  }, [loadPage])

  const toggleAgent = (agentId: string) => {
    if (disabled) return
    onValueChange(
      value.includes(agentId)
        ? value.filter((selectedId) => selectedId !== agentId)
        : [...value, agentId],
    )
  }

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const list = event.currentTarget
    const isNearEnd = list.scrollHeight - list.scrollTop - list.clientHeight < 48

    if (isNearEnd && hasNextPage && !loading) {
      void loadPage(page + 1, false)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#cedbd3] bg-white">
      <div className="border-b border-[#e4ebe6] bg-[#f8faf8] p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#788b83]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search agents by name..."
            disabled={disabled}
            className="h-10 rounded-lg border-[#cedbd3] bg-white pl-9 text-[#183630] placeholder:text-[#788b83]"
            aria-label="Search agents"
          />
        </div>
      </div>

      <div
        className="max-h-72 overflow-y-auto p-2"
        role="listbox"
        aria-label="Available agents"
        aria-multiselectable="true"
        onScroll={handleScroll}
      >
        {agents.map((agent) => {
          const selected = value.includes(agent.userId)

          return (
            <div
              key={agent.userId}
              role="option"
              aria-selected={selected}
              tabIndex={disabled ? -1 : 0}
              onClick={() => toggleAgent(agent.userId)}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault()
                  toggleAgent(agent.userId)
                }
              }}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                selected ? "bg-[#e2f1df]/70" : "hover:bg-[#f5f7f3]",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <span className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                selected ? "bg-[#078a76] text-white" : "bg-[#e6ece8] text-[#60736c]",
              )}>
                {getInitials(agent.name)}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#183630]">{agent.name}</span>
              <Checkbox checked={selected} tabIndex={-1} className="pointer-events-none" aria-hidden="true" />
            </div>
          )
        })}

        {loading && (
          <div className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-[#60736c]" role="status">
            <Loader2 className="size-4 animate-spin text-[#078a76]" />
            Loading agents…
          </div>
        )}

        {!loading && error && (
          <p className="px-3 py-5 text-center text-sm text-red-600" role="alert">{error}</p>
        )}

        {!loading && !error && agents.length === 0 && (
          <div className="flex flex-col items-center px-3 py-8 text-center text-[#60736c]">
            <UsersRound className="mb-2 size-5 text-[#078a76]" />
            <p className="text-sm font-medium">No agents found</p>
            <p className="mt-1 text-xs">Try a different name.</p>
          </div>
        )}
      </div>
    </div>
  )
}
