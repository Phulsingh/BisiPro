import axios from "axios"

import { getConfig, loadConfig } from "@/config/configService"

export const apiClient = axios.create({
  timeout: 30_000,
  headers: { Accept: "application/json" },
})

apiClient.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem("accessToken")

  if (accessToken && !request.headers.Authorization) {
    request.headers.Authorization = `Bearer ${accessToken}`
  }

  return request
})

/** Load runtime configuration and apply its API base URL before the app mounts. */
export async function initializeApiClient(): Promise<void> {
  await loadConfig()
  apiClient.defaults.baseURL = getConfig().apiBaseUrl
}
