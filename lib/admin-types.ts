// Types for admin CRUD operations

export interface ProductImage {
  id: number
  product_id: number
  image_path: string
  image_url: string
  thumbnail_url: string
  is_primary: boolean
  order: number
  created_at: string
}

export interface ProductVariation {
  id: number | string
  name: string
  sku?: string
  attributes?: Record<string, string>
  stock: number
  cost_price_usd?: number
  cost_price_cup?: number
  sale_price_usd?: number
  sale_price_cup?: number
  is_available: boolean
  order: number
}

export interface Category {
  id: number
  name: string
  slug: string
  image_url?: string
  thumbnail_url?: string
  description?: string
  is_active?: boolean
  order?: number
  active_products_count?: number
  created_at?: string
  updated_at?: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description?: string
  cost_price_usd: number
  cost_price_cup: number
  sale_price_usd: number
  sale_price_cup: number
  stock: number
  is_available: boolean
  has_variations: boolean
  profit_margin?: number
  category_id?: number
  category?: Category
  category_name?: string
  images: ProductImage[] | string[]
  primary_image?: string
  variations: ProductVariation[]
  created_at: string
  updated_at: string
}
  
  
  export interface Order {
    id: string
    order_number: string
    customer_name: string
    customer_email: string
    customer_phone: string
    shipping_address: string
    items: OrderItem[]
    subtotal: number
    shipping: number
    total: number
    currency: "USD" | "CUP"
    status: OrderStatus
    tracking_number: string
    notes: string
    created_at: string
    updated_at: string
  }
  
  export interface OrderItem {
    product_id: number
    product_name: string
    variation?: string
    quantity: number
    price: number
    image: string
  }
  
  export type OrderStatus = "pending" | "confirmed" | "processing" | "completed" | "cancelled"
  
  export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    processing: "Procesando",
    completed: "Completado",
    cancelled: "Cancelado",
  }
  
  export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  }
  