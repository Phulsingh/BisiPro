import type { AxiosRequestConfig } from "axios"

import { apiClient } from "@/config/axiosConfig"

/** Matches BisiPro.Contracts.Common.ApiResponse<T>. */
export type ApiResponse<T> = {
  data: T | null
  isSuccess: boolean
  error: string | null
  errors: string[]
}

/** Matches BisiPro.Contracts.Common.PagedResponse<T>. */
export type PagedResponse<T> = ApiResponse<T[]> & {
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

export const apiService = {
  async get<T>(endpoint: string, config?: AxiosRequestConfig) {
    const response = await apiClient.get<T>(endpoint, config)
    return response.data
  },

  async post<TResponse, TBody>(endpoint: string, body: TBody, config?: AxiosRequestConfig) {
    const response = await apiClient.post<TResponse>(endpoint, body, config)
    return response.data
  },

  async put<TResponse, TBody>(endpoint: string, body: TBody, config?: AxiosRequestConfig) {
    const response = await apiClient.put<TResponse>(endpoint, body, config)
    return response.data
  },

  async patch<TResponse, TBody>(endpoint: string, body: TBody, config?: AxiosRequestConfig) {
    const response = await apiClient.patch<TResponse>(endpoint, body, config)
    return response.data
  },

  async delete<T>(endpoint: string, config?: AxiosRequestConfig) {
    const response = await apiClient.delete<T>(endpoint, config)
    return response.data
  },
}
