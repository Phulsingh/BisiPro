import { apiService, type ApiResponse} from "@/config/apiService"

export type summary = {
    totalGroups: number,
    totalMembers: number,
    totalActiveGroups: number,
    totalActiveMembers: number
}

export type recentGroups ={
    id: string,
    groupName : string,
    createdAt: string,
}

export type recentMembers={
    id: string,
    firstName: string,
    groupId: string,
    groupName: string,
    joinedDate: string,
}

export type adminDashboardResponse =  ApiResponse<{
    summary: summary,
    recentGroups: recentGroups[],
    recentMembers: recentMembers[]
}>

export const AdminDashboardService = {
    getAdminDashboard(){
        return apiService.get<adminDashboardResponse>(`AdminDashboard`)
    }
}
