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
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "start_date and end_date are required" },
        { status: 422 },
      )
    }

    // Build query params for Laravel API
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    })

    const laravelUrl = `${LARAVEL_API_BASE_URL}/admin/orders/reports/revenue-by-day?${params.toString()}`

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
        errorData = { message: errorText || "Failed to fetch revenue by day" }
      }

      return NextResponse.json(
        { error: errorData.message || errorData.error || "Failed to fetch revenue by day", errors: errorData.errors },
        { status: response.status },
      )
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching revenue by day:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
