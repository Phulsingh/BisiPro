import {type GroupDropdownItem} from "./groupService"
import { apiService, type ApiResponse, type PagedResponse } from "@/config/apiService"

export type User = {
    id: string
    firstName: string
    lastName: string
    email: string
    dateOfBirth: string
    phoneNumber: string
    isActive: boolean
    groups: GroupDropdownItem[]
}

export type userResponse = ApiResponse<User>

/** Lightweight agent option returned by GET /api/Auth/agents/dropdown. */
export type AgentDropdownItem = {
    userId: string
    name: string
} 

export type AgentDropdownParams = {
    pageNumber?: number
    pageSize?: number
    search?: string
}

export type AgentDropdownResponse = ApiResponse<PagedResponse<AgentDropdownItem>>
export type AssignedAgentIdsResponse = ApiResponse<string[]>

export const userService = {
    getUserById(userId:string){
        return apiService.get<userResponse>(`User/${userId}`)
    },

    /** Returns the profile for the authenticated user. */
    getCurrentUser(){
        return apiService.get<userResponse>("User/me")
    },

    getAgentsDropdown({ pageNumber = 1, pageSize = 10, search }: AgentDropdownParams = {}) {
        return apiService.get<AgentDropdownResponse>("Auth/agents/dropdown", {
            params: {
                PageNumber: pageNumber,
                PageSize: pageSize,
                Search: search || undefined,
            },
        })
    },

    /** Returns the agent user IDs currently assigned to a group. */
    getAssignedAgentIds(groupId: string) {
        return apiService.get<AssignedAgentIdsResponse>(
            `Group/${groupId}/assigned-agent-ids`
        )
    }
}

