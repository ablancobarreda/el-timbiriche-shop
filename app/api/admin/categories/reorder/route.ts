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
    active_products_count: laravelCategory.active_products_count,
    created_at: laravelCategory.created_at,
    updated_at: laravelCategory.updated_at,
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request)

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate request body
    if (!body.order || !Array.isArray(body.order)) {
      return NextResponse.json(
        { error: "Order must be an array of category IDs" },
        { status: 400 },
      )
    }

    const response = await fetch(`${LARAVEL_API_BASE_URL}/admin/categories/reorder`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order: body.order }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || "Failed to reorder categories", errors: errorData.errors },
        { status: response.status },
      )
    }

    const data = await response.json()
    const categories = (data.data || data.categories || []).map(transformLaravelCategory)

    return NextResponse.json({ categories, success: true })
  } catch (error) {
    console.error("Error reordering categories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
