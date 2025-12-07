import { type NextRequest, NextResponse } from "next/server"
import type { Category } from "@/lib/admin-types"

const LARAVEL_API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL || "http://localhost:8000/api"

function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  return null
}

interface LaravelCategory {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
  thumbnail_url?: string
  is_active: boolean
  order: number
  active_products_count?: number
  created_at: string
  updated_at: string
}

function transformLaravelCategory(laravelCategory: LaravelCategory): Category {
  return {
    id: laravelCategory.id,
    name: laravelCategory.name,
    slug: laravelCategory.slug,
    description: laravelCategory.description,
    image_url: laravelCategory.image_url,
    thumbnail_url: laravelCategory.thumbnail_url,
    is_active: laravelCategory.is_active,
    order: laravelCategory.order,
    active_products_count: laravelCategory.active_products_count || 0,
    created_at: laravelCategory.created_at,
    updated_at: laravelCategory.updated_at,
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    const params = new URLSearchParams()
    if (search) {
      params.append("search", search)
    }

    const response = await fetch(`${LARAVEL_API_BASE_URL}/categories?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch categories" },
        { status: response.status },
      )
    }

    const data = await response.json()
    const categories = (data.data || data.categories || []).map(transformLaravelCategory)

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if request contains FormData (for file uploads)
    const contentType = request.headers.get("content-type") || ""
    const isFormData = contentType.includes("multipart/form-data")

    if (isFormData) {
      // Handle FormData from client
      const formData = await request.formData()

      console.log("FormData:", formData)

      // Forward FormData directly to Laravel
      const response = await fetch(`${LARAVEL_API_BASE_URL}/admin/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          // Don't set Content-Type, let fetch set it with boundary for FormData
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return NextResponse.json(
          { error: errorData.message || "Failed to create category", errors: errorData.errors },
          { status: response.status },
        )
      }

      const data = await response.json()
      const category = transformLaravelCategory(data.data || data)

      return NextResponse.json({ category, success: true })
    } else {
      // Handle JSON request (backward compatibility)
      const body = await request.json()

      // Prepare FormData for Laravel (to handle file uploads)
      const formData = new FormData()

      // Add category fields
      formData.append("name", body.name)
      if (body.description) formData.append("description", body.description)
      if (body.is_active !== undefined) {
        formData.append("is_active", body.is_active ? "1" : "0")
      }
      if (body.order !== undefined) {
        formData.append("order", body.order.toString())
      }

      // Handle image upload
      if (body.image && body.image instanceof File) {
        formData.append("image", body.image)
      }

      const response = await fetch(`${LARAVEL_API_BASE_URL}/admin/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return NextResponse.json(
          { error: errorData.message || "Failed to create category", errors: errorData.errors },
          { status: response.status },
        )
      }

      const data = await response.json()
      const category = transformLaravelCategory(data.data || data)

      return NextResponse.json({ category, success: true })
    }
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
