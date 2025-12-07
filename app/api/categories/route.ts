import { NextResponse } from "next/server"

const LARAVEL_API_BASE_URL = process.env.LARAVEL_API_BASE_URL || "http://localhost:8000/api"

interface LaravelCategory {
  id: number
  name: string
  slug: string
  image_url: string
  description: string
  is_active: boolean
  order: number
  active_products_count: number
  created_at: string
  updated_at: string
}

interface CategoryResponse {
  data: LaravelCategory[]
}

export async function GET() {
  try {
    const response = await fetch(`${LARAVEL_API_BASE_URL}/categories`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Laravel API error: ${response.status}`)
    }

    const laravelData: CategoryResponse = await response.json()

    // Transform Laravel response to match component expectations
    const categories = laravelData.data
      .filter((category) => category.is_active)
      .sort((a, b) => a.order - b.order)
      .map((category) => ({
        id: category.id,
        name: category.name,
        image_url: category.image_url || "/images/logo-placeholder.png", // Placeholder image as requested
        count: category.active_products_count,
        slug: category.slug,
        description: category.description,
      }))

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories from Laravel API:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
