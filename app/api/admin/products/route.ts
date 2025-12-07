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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const categoryId = searchParams.get("category_id")
    const page = searchParams.get("page") || "1"
    const perPage = searchParams.get("per_page") || searchParams.get("limit") || "15"

    const token = getAuthToken(request)
    console.log("API GET products - Token:", token ? "Token exists" : "No token")
    
    if (!token) {
      console.error("API GET products - Unauthorized: No token")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Build query params for Laravel API
    const params = new URLSearchParams({
      page,
      per_page: perPage,
    })

    if (search) {
      params.append("search", search)
    }

    if (categoryId && categoryId !== "all") {
      params.append("category_id", categoryId)
    }

    const laravelUrl = `${LARAVEL_API_BASE_URL}/admin/products`
    console.log("API GET products - Calling Laravel:", laravelUrl)

    const response = await fetch(laravelUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    console.log("API GET products - Laravel response status:", response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API GET products - Laravel error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })
      
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText || "Failed to fetch products" }
      }
      
      return NextResponse.json(
        { error: errorData.message || errorData.error || "Failed to fetch products", errors: errorData.errors },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("API GET products - Laravel data structure:", {
      hasData: !!data.data,
      dataIsArray: Array.isArray(data.data),
      dataLength: Array.isArray(data.data) ? data.data.length : 0,
      hasMeta: !!data.meta,
      meta: data.meta,
    })

    // Transform Laravel response to match frontend structure
    if (!data.data || !Array.isArray(data.data)) {
      console.error("API GET products - Invalid data structure from Laravel:", data)
      return NextResponse.json(
        { error: "Invalid response format from server" },
        { status: 500 },
      )
    }

    const products = data.data.map(transformLaravelProduct)
    console.log("API GET products - Transformed products count:", products.length)

    return NextResponse.json({
      products,
      pagination: {
        page: data.meta?.current_page || Number.parseInt(page),
        limit: Number.parseInt(perPage),
        total: data.meta?.total || products.length,
        pages: data.meta?.last_page || 1,
        from: data.meta?.from || 1,
        to: data.meta?.to || products.length,
      },
    })
  } catch (error) {
    console.error("API GET products - Error:", error)
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

      // Forward FormData directly to Laravel
      // Next.js FormData should work with fetch in Node.js 18+
      const response = await fetch(`${LARAVEL_API_BASE_URL}/admin/products`, {
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
          { error: errorData.message || "Failed to create product", errors: errorData.errors },
          { status: response.status },
        )
      }

      const data = await response.json()
      const product = transformLaravelProduct(data.data || data)

      return NextResponse.json({ product, success: true })
    } else {
      // Handle JSON request (backward compatibility)
      const body = await request.json()

      // Prepare FormData for Laravel (to handle file uploads)
      const formData = new FormData()

      // Add product fields
      formData.append("name", body.name)
      if (body.description) formData.append("description", body.description)
      formData.append("cost_price_usd", body.cost_price_usd.toString())
      formData.append("cost_price_cup", body.cost_price_cup.toString())
      formData.append("sale_price_usd", body.sale_price_usd.toString())
      formData.append("sale_price_cup", body.sale_price_cup.toString())
      formData.append("stock", body.stock?.toString() || "0")
      formData.append("category_id", body.category_id.toString())
      if (body.is_available !== undefined) {
        formData.append("is_available", body.is_available ? "1" : "0")
      }

      // Add variations if present
      if (body.variations && Array.isArray(body.variations) && body.variations.length > 0) {
        formData.append("variations", JSON.stringify(body.variations))
      }

      // Handle image uploads - if images are File objects
      if (body.images && Array.isArray(body.images)) {
        body.images.forEach((image: File | string, index: number) => {
          if (image instanceof File) {
            formData.append(`images[${index}]`, image)
          }
        })
      }

      const response = await fetch(`${LARAVEL_API_BASE_URL}/admin/products`, {
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
          { error: errorData.message || "Failed to create product", errors: errorData.errors },
          { status: response.status },
        )
      }

      const data = await response.json()
      const product = transformLaravelProduct(data.data || data)

      return NextResponse.json({ product, success: true })
    }
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
