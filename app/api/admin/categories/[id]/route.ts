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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = getAuthToken(request)

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if request contains FormData (for file uploads)
    const contentType = request.headers.get("content-type") || ""
    const isFormData = contentType.includes("multipart/form-data")

    console.log("PUT category request:", {
      id,
      contentType,
      isFormData,
    })

    // Always try to parse as FormData first if content-type suggests it
    // Otherwise, try to parse as JSON
    let formData: FormData
    let isFormDataRequest = false

    try {
      formData = await request.formData()
      isFormDataRequest = true
      console.log("Parsed as FormData, fields:", Array.from(formData.keys()))
    } catch {
      // If parsing as FormData fails, try JSON
      try {
        const body = await request.json()
        console.log("Parsed as JSON:", body)

        // Convert JSON to FormData for Laravel
        formData = new FormData()
        if (body.name) formData.append("name", body.name)
        if (body.description !== undefined) formData.append("description", body.description || "")
        if (body.is_active !== undefined) {
          formData.append("is_active", body.is_active ? "1" : "0")
        }
        if (body.order !== undefined) {
          formData.append("order", body.order.toString())
        }
        if (body.image && body.image instanceof File) {
          formData.append("image", body.image)
        }
        isFormDataRequest = true
      } catch (jsonError) {
        console.error("Failed to parse request:", jsonError)
        return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
      }
    }

    // Forward FormData to Laravel
    const response = await fetch(`${LARAVEL_API_BASE_URL}/admin/categories/${id}`, {
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
      console.error("Laravel API error:", {
        status: response.status,
        error: errorData,
      })
      return NextResponse.json(
        { error: errorData.message || "Failed to update category", errors: errorData.errors },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("Category updated successfully:", data)
    const category = transformLaravelCategory(data.data || data)

    return NextResponse.json({ category, success: true })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = getAuthToken(request)

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(`${LARAVEL_API_BASE_URL}/admin/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || "Failed to delete category" },
        { status: response.status },
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: data.message || `Category ${id} deleted successfully`,
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
