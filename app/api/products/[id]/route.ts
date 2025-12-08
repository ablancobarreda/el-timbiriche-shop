import { type NextRequest, NextResponse } from "next/server"

const LARAVEL_API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL || "http://localhost:8000/api"

interface LaravelProductImage {
  id: number
  product_id: number
  image_path: string
  image_url: string
  thumbnail_url: string
  is_primary: boolean
  order: number
  created_at: string
}

interface LaravelCategory {
  id: number
  name: string
  slug: string
  description: string
  is_active: boolean
  order: number
  created_at: string
  updated_at: string
}

interface LaravelProductVariation {
  id: number
  product_id: number
  sku?: string
  name: string
  attributes?: Record<string, string>
  stock: number
  cost_price_usd?: number
  cost_price_cup?: number
  sale_price_usd?: number
  sale_price_cup?: number
  effective_cost_price_usd?: number
  effective_cost_price_cup?: number
  effective_sale_price_usd?: number
  effective_sale_price_cup?: number
  is_available: boolean
  profit_margin?: number
  order: number
  created_at: string
  updated_at: string
}

interface LaravelProduct {
  id: number
  name: string
  slug: string
  description: string
  cost_price_usd: number
  cost_price_cup: number
  sale_price_usd: number
  sale_price_cup: number
  stock: number
  is_available: boolean
  has_variations: boolean
  profit_margin: number
  category: LaravelCategory
  images: LaravelProductImage[]
  primary_image: string
  variations: LaravelProductVariation[]
  created_at: string
  updated_at: string
}

interface ProductResponse {
  data: LaravelProduct
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Laravel's show method accepts both ID and slug
    // Route: GET /products/{slugOrId}
    const response = await fetch(`${LARAVEL_API_BASE_URL}/products/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }
      const errorText = await response.text()
      console.error("Laravel API error:", response.status, errorText)
      throw new Error(`Laravel API error: ${response.status}`)
    }

    const laravelData: ProductResponse = await response.json()
    const product = laravelData.data

    // Transform to match admin format
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      cost_price_usd: product.cost_price_usd,
      cost_price_cup: product.cost_price_cup,
      sale_price_usd: product.sale_price_usd,
      sale_price_cup: product.sale_price_cup,
      stock: product.stock,
      is_available: product.is_available,
      has_variations: product.has_variations,
      profit_margin: product.profit_margin,
      category_id: product.category?.id,
      category: product.category,
      category_name: product.category?.name,
      images: product.images || [],
      primary_image: product.primary_image,
      variations: product.variations || [],
      created_at: product.created_at,
      updated_at: product.updated_at,
    }

    return NextResponse.json({ product: transformedProduct })
  } catch (error) {
    console.error("Error fetching product from Laravel API:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
