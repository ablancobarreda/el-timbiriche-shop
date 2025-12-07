"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"

const LARAVEL_API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL || "http://localhost:8000/api"
const ADMIN_TOKEN_KEY = "admin_token"
const ADMIN_USER_KEY = "admin_user"

export interface AdminUser {
  id: number
  name: string
  email: string
}

interface LoginResponse {
  message: string
  user: AdminUser
  token: string
}

interface LogoutResponse {
  message: string
}

interface AdminAuthContextType {
  user: AdminUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  getAuthHeaders: () => HeadersInit
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

// Load token and user from localStorage
function loadAuthFromStorage(): { token: string | null; user: AdminUser | null } {
  if (typeof window === "undefined") return { token: null, user: null }

  try {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    const userStr = localStorage.getItem(ADMIN_USER_KEY)
    const user = userStr ? (JSON.parse(userStr) as AdminUser) : null
    return { token, user }
  } catch (error) {
    console.error("Error loading auth from localStorage:", error)
    return { token: null, user: null }
  }
}

// Save token and user to localStorage
function saveAuthToStorage(token: string, user: AdminUser) {
  if (typeof window === "undefined") {
    console.warn("Cannot save to localStorage: window is undefined")
    return
  }

  try {
    console.log("Saving token to localStorage with key:", ADMIN_TOKEN_KEY)
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user))
    
    // Verify it was saved
    const savedToken = localStorage.getItem(ADMIN_TOKEN_KEY)
    if (savedToken !== token) {
      console.error("Token verification failed! Expected:", token, "Got:", savedToken)
      throw new Error("Failed to save token to localStorage")
    }
    
    console.log("Token and user saved successfully to localStorage")
  } catch (error) {
    console.error("Error saving auth to localStorage:", error)
    // Re-throw to let the caller know it failed
    throw error
  }
}

// Clear auth from localStorage
function clearAuthFromStorage() {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    localStorage.removeItem(ADMIN_USER_KEY)
  } catch (error) {
    console.error("Error clearing auth from localStorage:", error)
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth from localStorage on mount
  useEffect(() => {
    const { token: savedToken, user: savedUser } = loadAuthFromStorage()
    console.log("Loading auth from localStorage:", { 
      hasToken: !!savedToken, 
      hasUser: !!savedUser,
      tokenLength: savedToken?.length 
    })
    setToken(savedToken)
    setUser(savedUser)
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetch(`${LARAVEL_API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || "Error al iniciar sesión")
        }

        const data: LoginResponse = await response.json()

        // Handle different response structures from Laravel
        const token = data.token || (data as any).access_token || (data as any).data?.token
        const user = data.user || (data as any).data?.user

        if (!token) {
          console.error("No token received from API:", data)
          throw new Error("No se recibió un token de autenticación")
        }

        if (!user) {
          console.error("No user received from API:", data)
          throw new Error("No se recibió información del usuario")
        }

        console.log("Login successful, saving token to localStorage")
        setToken(token)
        setUser(user)
        saveAuthToStorage(token, user)
        
        // Verify token was saved
        const savedToken = localStorage.getItem(ADMIN_TOKEN_KEY)
        if (!savedToken) {
          console.error("Token was not saved to localStorage!")
          throw new Error("Error al guardar el token de autenticación")
        }
        
        console.log("Token saved successfully to localStorage")
      } catch (error) {
        console.error("Login error:", error)
        throw error
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      const currentToken = token || loadAuthFromStorage().token

      if (currentToken) {
        await fetch(`${LARAVEL_API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Continue with logout even if API call fails
    } finally {
      setToken(null)
      setUser(null)
      clearAuthFromStorage()
      router.push("/admin/login")
    }
  }, [token, router])

  const getAuthHeaders = useCallback((): HeadersInit => {
    const currentToken = token || loadAuthFromStorage().token

    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
    }
  }, [token])

  const isAuthenticated = !!token && !!user

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        getAuthHeaders,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

