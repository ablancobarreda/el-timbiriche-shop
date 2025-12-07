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
    const perPage = searchParams.get("per_page") || searchParams.get("limit") || "15"
    const page = searchParams.get("page") || "1"
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    // Build query params for Laravel API
    const params = new URLSearchParams({
      per_page: perPage,
      page,
    })

    // Add search and status if provided (Laravel API may support these)
    if (search) {
      params.append("search", search)
    }
    if (status && status !== "all") {
      params.append("status", status)
    }

    const laravelUrl = `${LARAVEL_API_BASE_URL}/admin/orders?${params.toString()}`

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
        errorData = { message: errorText || "Failed to fetch orders" }
      }

      return NextResponse.json(
        { error: errorData.message || errorData.error || "Failed to fetch orders", errors: errorData.errors },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Transform Laravel pagination format to match frontend expectations
    // Laravel returns: { data: [...], links: {...}, meta: {...} }
    // Frontend expects: { orders: [...], pagination: {...} }
    if (data.data && Array.isArray(data.data)) {
      // Transform orders to match frontend format
      const transformedOrders = data.data.map((order: any) => {
        // Extract currency code from currency object
        const currencyCode = order.currency?.code || order.currency || "USD"
        
        // Transform order items if they exist
        const transformedItems = (order.items || []).map((item: any) => ({
          product_id: item.product_id,
          product_name: item.product?.name || "Producto eliminado",
          variation: item.variation?.name || item.variation || undefined,
          quantity: item.quantity,
          price: item.unit_price || item.price,
          image: item.product?.primary_image || item.product?.images?.[0] || "/placeholder.svg",
        }))

        // Map Laravel status to frontend status
        const statusMap: Record<string, "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"> = {
          pending: "pending",
          confirmed: "confirmed",
          processing: "processing",
          shipped: "shipped",
          completed: "delivered", // Laravel uses "completed", frontend uses "delivered"
          delivered: "delivered",
          cancelled: "cancelled",
        }
        const mappedStatus = statusMap[order.status?.toLowerCase() || ""] || "pending"

        return {
          id: order.order_number || order.id?.toString() || "",
          customer_name: order.customer_name || "",
          customer_email: order.customer_email || "",
          customer_phone: order.customer_phone || "",
          shipping_address: order.shipping_address || "",
          items: transformedItems,
          subtotal: order.total_amount || order.subtotal || 0,
          shipping: order.shipping || 0,
          total: order.total_amount || order.total || 0,
          currency: currencyCode,
          status: mappedStatus,
          tracking_number: order.tracking_number || "",
          notes: order.notes || "",
          created_at: order.created_at || new Date().toISOString(),
          updated_at: order.updated_at || new Date().toISOString(),
        }
      })

      return NextResponse.json({
        orders: transformedOrders,
        pagination: {
          page: data.meta?.current_page || Number.parseInt(page),
          limit: Number.parseInt(perPage),
          total: data.meta?.total || data.data.length,
          pages: data.meta?.last_page || 1,
          from: data.meta?.from || 1,
          to: data.meta?.to || data.data.length,
        },
        links: data.links,
        meta: data.meta,
      })
    }

    // Return Laravel format directly if structure is different
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
