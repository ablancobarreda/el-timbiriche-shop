import { NextRequest, NextResponse } from "next/server"

const LARAVEL_API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL || process.env.LARAVEL_API_BASE_URL || "http://localhost:8000/api"

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
  data: LaravelProduct[]
}

function transformProduct(laravelProduct: LaravelProduct) {
  // Calculate if product is new (created within last 30 days)
  const createdAt = new Date(laravelProduct.created_at)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const isNew = createdAt > thirtyDaysAgo

  // Calculate if product is on sale (sale price is less than cost price)
  const isSale = laravelProduct.sale_price_usd < laravelProduct.cost_price_usd

  // Get all image URLs
  const images = laravelProduct.images
    .sort((a, b) => a.order - b.order)
    .map((img) => img.image_url)

  // Transform variations
  const variations = laravelProduct.variations?.map((variation) => ({
    id: variation.id,
    name: variation.name,
    attributes: variation.attributes,
    stock: variation.stock,
    effective_sale_price_usd: variation.effective_sale_price_usd ?? variation.sale_price_usd ?? laravelProduct.sale_price_usd,
    effective_sale_price_cup: variation.effective_sale_price_cup ?? variation.sale_price_cup ?? laravelProduct.sale_price_cup,
    is_available: variation.is_available,
  })) || []

  return {
    id: laravelProduct.id,
    name: laravelProduct.name,
    price_usd: laravelProduct.sale_price_usd,
    price_cup: laravelProduct.sale_price_cup,
    originalPrice_usd: laravelProduct.cost_price_usd,
    originalPrice_cup: laravelProduct.cost_price_cup,
    image: laravelProduct.primary_image || images[0] || "/images/logo.png",
    images: images.length > 0 ? images : undefined,
    category: laravelProduct.category.name,
    rating: 4.5, // Default rating, can be updated if Laravel provides it
    description: laravelProduct.description,
    isNew,
    isSale,
    slug: laravelProduct.slug,
    stock: laravelProduct.stock,
    is_available: laravelProduct.is_available,
    has_variations: laravelProduct.has_variations,
    variations: variations.length > 0 ? variations : undefined,
  }
}

export async function GET(request: NextRequest, { params }: { params: { categoryId: string } }) {
  try {
    const categoryId = params.categoryId

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
    }

    const response = await fetch(`${LARAVEL_API_BASE_URL}/products/category/${categoryId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Laravel API error: ${response.status}`)
    }

    const laravelData: ProductResponse = await response.json()

    // Transform Laravel response to match component expectations
    const products = laravelData.data
      .filter((product) => product.is_available && product.stock > 0)
      .map(transformProduct)

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products by category from Laravel API:", error)
    return NextResponse.json({ error: "Failed to fetch products by category" }, { status: 500 })
  }
}

