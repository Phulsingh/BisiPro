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
}

export type AgentDropdownResponse = ApiResponse<PagedResponse<AgentDropdownItem>>

export const userService = {
    getUserById(userId:string){
        return apiService.get<userResponse>(`User/${userId}`)
    },

    /** Returns the profile for the authenticated user. */
    getCurrentUser(){
        return apiService.get<userResponse>("User/me")
    },

    getAgentsDropdown({ pageNumber = 1, pageSize = 10 }: AgentDropdownParams = {}) {
        return apiService.get<AgentDropdownResponse>("Auth/agents/dropdown", {
            params: {
                PageNumber: pageNumber,
                PageSize: pageSize,
            },
        })
    }
}

