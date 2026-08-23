import {type GroupDropdownItem} from "./groupService"
import { apiService, type ApiResponse} from "@/config/apiService"

export type User = {
    userId: string
    firstName: string
    lastName: string
    email: string
    dateOfBirth: string
    phoneNumber: string
    isActive: boolean
    groups: GroupDropdownItem[]
}

export type userResponse = ApiResponse<User>

export const userService = {
    getUserById(userId:string){
        return apiService.get<userResponse>(`User/${userId}`)
    }
}

