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
}
