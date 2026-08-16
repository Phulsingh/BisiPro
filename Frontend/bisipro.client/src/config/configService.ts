export type AppConfig = {
  apiBaseUrl: string
  isProduction: boolean
}

type RuntimeConfiguration = Partial<{
  apiBaseUrl: string
  apiPath: string
  isProduction: boolean
}>

const defaultBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api/"
const hasEnvironmentBaseUrl = Boolean(import.meta.env.VITE_API_BASE_URL)
let configuration: AppConfig | undefined

const withTrailingSlash = (value: string) => `${value.replace(/\/+$/, "")}/`

const resolveApiBaseUrl = (runtimeConfig: RuntimeConfiguration): string => {
  const configuredUrl = runtimeConfig.apiBaseUrl?.trim() || defaultBaseUrl
  const apiPath = runtimeConfig.apiPath?.trim()

  if (apiPath) {
    return withTrailingSlash(`${configuredUrl}/${apiPath}`)
  }

  // apiBaseUrl is the complete API prefix. For example:
  // https://localhost:7081/api/ becomes https://localhost:7081/api/auth/login.
  return withTrailingSlash(configuredUrl)
}

/**
 * Loads server-provided configuration once. If the server does not expose a
 * configuration endpoint, VITE_API_BASE_URL (or /api/) remains the API URL.
 */
export async function loadConfig(): Promise<AppConfig> {
  if (configuration) return configuration

  const fallback: AppConfig = {
    apiBaseUrl: withTrailingSlash(defaultBaseUrl),
    isProduction: import.meta.env.PROD,
  }

  // A Vite environment variable is the explicit local/deployment setup. It
  // takes precedence over the optional backend configuration endpoint.
  if (hasEnvironmentBaseUrl) {
    configuration = fallback
    return configuration
  }

  try {
    const response = await fetch("/api/configuration")
    if (!response.ok) throw new Error(`Configuration request failed (${response.status})`)

    const runtimeConfig = (await response.json()) as RuntimeConfiguration
    configuration = {
      apiBaseUrl: resolveApiBaseUrl(runtimeConfig),
      isProduction: runtimeConfig.isProduction ?? import.meta.env.PROD,
    }
  } catch (error) {
    console.warn("Using the frontend API configuration fallback.", error)
    configuration = fallback
  }

  return configuration
}

export function getConfig(): AppConfig {
  if (!configuration) {
    throw new Error("App configuration has not loaded yet. Call loadConfig() during startup.")
  }
  return configuration
}

export function isProductionEnv(): boolean {
  return configuration?.isProduction ?? import.meta.env.PROD
}
