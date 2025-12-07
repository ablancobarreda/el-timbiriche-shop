/**
 * Helper function to make authenticated API requests to Laravel backend
 * This function automatically includes the Bearer token from localStorage
 */

const LARAVEL_API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL || "http://localhost:8000/api"
const ADMIN_TOKEN_KEY = "admin_token" // Must match the key in admin-auth-context.tsx

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export async function adminApiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${LARAVEL_API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API error: ${response.status}`)
  }

  return response.json()
}

// Convenience methods
export const adminApi = {
  get: <T>(endpoint: string) => adminApiRequest<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, data?: unknown) =>
    adminApiRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T>(endpoint: string, data?: unknown) =>
    adminApiRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(endpoint: string, data?: unknown) =>
    adminApiRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(endpoint: string) => adminApiRequest<T>(endpoint, { method: "DELETE" }),
}

