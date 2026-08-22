import { apiService, type ApiResponse, type PagedResponse } from "@/config/apiService"


export type GroupMember = {
  id: string
  groupId: string
  userId: string
  memberName: string
  phoneNumber: string
  payableAmount: number
  joinedDate: string      // ISO date string e.g. "2026-08-21"
  exitDate: string | null
  isActive: boolean
}

export type GroupMemberQueryParams = {
  search?: string
  groupId?: string
  isActive?: boolean
  pageNumber?: number
  pageSize?: number
}

export type GroupMemberListResponse = PagedResponse<GroupMember>
export type GroupMemberResponse = ApiResponse<GroupMember>

export const groupMemberService = {
  getGroupMembers(params: GroupMemberQueryParams = {}) {
    return apiService.get<GroupMemberListResponse>(
      "GroupMember",
      {
        params,
      }
    );
  },

  getGroupMemberById(id: string) {
    return apiService.get<GroupMemberResponse>(
      `GroupMember/${id}`
    );
  },
};
