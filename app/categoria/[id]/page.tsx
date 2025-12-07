import Image from "next/image"
import { CategoryPageClient } from "./category-page-client"
import type { Product } from "@/lib/store-context"

const LARAVEL_API_BASE_URL = process.env.LARAVEL_API_BASE_URL || "http://localhost:8000/api"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  is_active: boolean
  order: number
  active_products_count: number
  created_at: string
  updated_at: string
}

interface CategoryResponse {
  data: Category[]
}

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
  is_available?: boolean
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

function transformProduct(laravelProduct: LaravelProduct): Product {
  const createdAt = new Date(laravelProduct.created_at)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const isNew = createdAt > thirtyDaysAgo

  const isSale = laravelProduct.sale_price_usd < laravelProduct.cost_price_usd

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
    rating: 4.5,
    description: laravelProduct.description,
    isNew,
    isSale,
    stock: laravelProduct.stock,
    is_available: laravelProduct.is_available,
    has_variations: laravelProduct.has_variations,
    variations: variations.length > 0 ? variations : undefined,
  }
}

async function getCategory(categoryId: string): Promise<Category | null> {
  try {
    const response = await fetch(`${LARAVEL_API_BASE_URL}/categories`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const data: CategoryResponse = await response.json()
    return data.data.find((c) => c.id === Number(categoryId) && c.is_active) || null
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const response = await fetch(`${LARAVEL_API_BASE_URL}/products/category/${categoryId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return []
    }

    const laravelData: ProductResponse = await response.json()

    return laravelData.data
      .filter((product) => product.is_available && product.stock > 0)
      .map(transformProduct)
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: categoryId } = await params
  const [category, products] = await Promise.all([
    getCategory(categoryId),
    getProductsByCategory(categoryId),
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Category Hero */}
      {category && (
        <div className="relative h-48 md:h-64 overflow-hidden">
          <Image src="/images/logo.png" alt={category.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-foreground/20" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="container mx-auto">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-card mb-2">{category.name}</h1>
              <p className="text-card/80">{category.active_products_count} productos disponibles</p>
            </div>
          </div>
        </div>
      )}

      <CategoryPageClient initialProducts={products} category={category} />
    </div>
  )
}
