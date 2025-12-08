import { NextResponse } from "next/server"

const LARAVEL_API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL || "http://localhost:8000/api"

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
    // Validate API URL is configured
    if (!LARAVEL_API_BASE_URL) {
      console.error("LARAVEL_API_BASE_URL is not configured")
      return NextResponse.json(
        { error: "API configuration error", data: [] },
        { status: 500 }
      )
    }

    const response = await fetch(`${LARAVEL_API_BASE_URL}/categories`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Laravel API error: ${response.status}`, errorText)
      return NextResponse.json(
        { error: `API error: ${response.status}`, data: [] },
        { status: response.status }
      )
    }

    const laravelData: CategoryResponse = await response.json()

    // Validate response structure
    if (!laravelData || !Array.isArray(laravelData.data)) {
      console.error("Invalid response structure from Laravel API", laravelData)
      return NextResponse.json(
        { error: "Invalid API response", data: [] },
        { status: 500 }
      )
    }

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
      { error: "Failed to fetch categories", data: [] },
      { status: 500 }
    )
  }
}
