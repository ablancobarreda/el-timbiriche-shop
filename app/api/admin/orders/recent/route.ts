import { type NextRequest, NextResponse } from "next/server"

const LARAVEL_API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL || "http://localhost:8000/api"

function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  return null
}

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = searchParams.get("days") || "30"

    // Build query params for Laravel API
    const params = new URLSearchParams({
      days,
    })

    const laravelUrl = `${LARAVEL_API_BASE_URL}/admin/orders/recent?${params.toString()}`

    const response = await fetch(laravelUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText || "Failed to fetch recent orders" }
      }

      return NextResponse.json(
        { error: errorData.message || errorData.error || "Failed to fetch recent orders", errors: errorData.errors },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Return Laravel resource collection format
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching recent orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
