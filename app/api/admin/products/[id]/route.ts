import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/lib/admin-types"

const LARAVEL_API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL || "http://localhost:8000/api"

function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  return null
}

function transformLaravelProduct(laravelProduct: any): Product {
  return {
    id: laravelProduct.id,
    name: laravelProduct.name,
    slug: laravelProduct.slug,
    description: laravelProduct.description || "",
    cost_price_usd: laravelProduct.cost_price_usd,
    cost_price_cup: laravelProduct.cost_price_cup,
    sale_price_usd: laravelProduct.sale_price_usd,
    sale_price_cup: laravelProduct.sale_price_cup,
    stock: laravelProduct.stock,
    is_available: laravelProduct.is_available,
    has_variations: laravelProduct.has_variations,
    profit_margin: laravelProduct.profit_margin,
    category_id: laravelProduct.category?.id,
    category: laravelProduct.category,
    category_name: laravelProduct.category?.name,
    images: laravelProduct.images || [],
    primary_image: laravelProduct.primary_image,
    variations: laravelProduct.variations || [],
    created_at: laravelProduct.created_at,
    updated_at: laravelProduct.updated_at,
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = getAuthToken(request)

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(`${LARAVEL_API_BASE_URL}/admin/products/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || "Product not found" },
        { status: response.status },
      )
    }

    const data = await response.json()
    const product = transformLaravelProduct(data.data || data)

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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

    if (isFormData) {
      // Handle FormData from client
      const formData = await request.formData()

      // Forward FormData directly to Laravel
      // Next.js FormData should work with fetch in Node.js 18+
      const response = await fetch(`${LARAVEL_API_BASE_URL}/admin/products/${id}`, {
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
          { error: errorData.message || "Failed to update product", errors: errorData.errors },
          { status: response.status },
        )
      }

      const data = await response.json()
      const product = transformLaravelProduct(data.data || data)

      return NextResponse.json({ product, success: true })
    } else {
      // Handle JSON request (backward compatibility)
      const body = await request.json()

      // Send JSON data directly to Laravel
      const response = await fetch(`${LARAVEL_API_BASE_URL}/admin/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return NextResponse.json(
          { error: errorData.message || "Failed to update product", errors: errorData.errors },
          { status: response.status },
        )
      }

      const data = await response.json()
      const product = transformLaravelProduct(data.data || data)

      return NextResponse.json({ product, success: true })
    }
  } catch (error) {
    console.error("Error updating product:", error)
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

    const response = await fetch(`${LARAVEL_API_BASE_URL}/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || "Failed to delete product" },
        { status: response.status },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
