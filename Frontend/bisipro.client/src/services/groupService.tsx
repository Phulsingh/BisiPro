import { apiService, type ApiResponse, type PagedResponse } from "@/config/apiService"
import { BisiType } from "@/enums/enum"


export type Group = {
  groupId: string
  groupName: string
  description: string
  bisiType: BisiType
  monthlyAmount: number
  totalMembers: number
  durationInMonths: number
  startDate: string
  endDate: string
  collectionDay: number
  auctionDay: number
  lateFee: number
  gracePeriod: number
  isActive: boolean
}

export type GroupQueryParams = {
  search?: string
  pageNumber?: number
  pageSize?: number
  bisiType?: BisiType
  isActive?: boolean
  startDateFrom?: string
  startDateTo?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

/** Maps the POST /api/Group request body */
export type CreateGroupRequest = {
  groupName: string
  description: string
  bisiType: BisiType
  monthlyAmount: number
  totalMembers: number
  durationInMonths: number
  startDate: string         // ISO date string e.g. "2025-01-01"
  collectionDay: number     // Day of month (1-31)
  auctionDay: number | null // null when bisiType is not Auction
  lateFee: number
  gracePeriod: number
}

export type GroupListResponse = PagedResponse<Group>
export type GroupResponse = ApiResponse<Group>

export const groupService = {
  getGroups(params: GroupQueryParams = {}) {
    return apiService.get<GroupListResponse>("Group", {
      params,
    })
  },

  getGroupById(groupId: string) {
    return apiService.get<GroupResponse>(`Group/${groupId}`)
  },

  createGroup(body: CreateGroupRequest) {
    return apiService.post<GroupResponse, CreateGroupRequest>("Group", body)
  },
}

