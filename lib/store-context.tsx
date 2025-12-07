"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from "react"

export interface ProductVariation {
  id: number
  name: string
  attributes?: Record<string, string>
  stock: number
  effective_sale_price_usd?: number
  effective_sale_price_cup?: number
  is_available: boolean
}

export interface Product {
  id: number
  name: string
  price_usd: number
  price_cup: number
  originalPrice_usd?: number
  originalPrice_cup?: number
  image: string
  images?: string[]
  category: string
  rating: number
  description?: string
  isNew?: boolean
  isSale?: boolean
  has_variations?: boolean
  variations?: ProductVariation[]
  stock?: number
  is_available?: boolean
}

export interface CartItem extends Product {
  quantity: number
  selectedVariation?: ProductVariation
}

type Currency = "USD" | "CUP"

interface StoreContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number, variation?: ProductVariation) => void
  removeFromCart: (productId: number, variationId?: number) => void
  updateQuantity: (productId: number, quantity: number, variationId?: number) => void
  clearCart: () => void
  cartTotal: number
  cartTotal_usd: number
  cartTotal_cup: number
  cartCount: number
  currency: Currency
  setCurrency: (currency: Currency) => void
  exchangeRate: number
  formatPrice: (price_usd: number, price_cup: number) => string
  formatCartTotal: () => string
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  quickViewProduct: Product | null
  setQuickViewProduct: (product: Product | null) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

const EXCHANGE_RATE_CUP = 350 // 1 USD = 350 CUP
const CART_STORAGE_KEY = "el-timbiriche-cart"

// Load cart from localStorage
function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as CartItem[]
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error)
  }
  return []
}

// Save cart to localStorage
function saveCartToStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error("Error saving cart to localStorage:", error)
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Initialize with empty array to avoid hydration mismatch
  const [cart, setCart] = useState<CartItem[]>([])
  const [currency, setCurrency] = useState<Currency>("USD")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const isInitialMount = useRef(true)

  // Load cart from localStorage only on client side after mount
  useEffect(() => {
    const savedCart = loadCartFromStorage()
    if (savedCart.length > 0) {
      setCart(savedCart)
    }
    isInitialMount.current = false
  }, [])

  // Save cart to localStorage whenever it changes (but skip initial load)
  useEffect(() => {
    // Skip saving on initial mount to avoid overwriting with empty cart
    if (!isInitialMount.current) {
      saveCartToStorage(cart)
    }
  }, [cart])

  const exchangeRate = currency === "CUP" ? EXCHANGE_RATE_CUP : 1

  const formatPrice = useCallback(
    (price_usd: number, price_cup: number) => {
      const price = currency === "USD" ? price_usd : price_cup
      const formattedNumber = new Intl.NumberFormat("es-CU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price)
      
      if (currency === "USD") {
        return `$${formattedNumber}`
      } else {
        return `₱${formattedNumber}`
      }
    },
    [currency],
  )

  const addToCart = useCallback((product: Product, quantity = 1, variation?: ProductVariation) => {
    setCart((prev) => {
      // If product has variations, we need to match by product id AND variation id
      if (variation) {
        const existing = prev.find(
          (item) => item.id === product.id && item.selectedVariation?.id === variation.id
        )
        if (existing) {
          return prev.map((item) =>
            item.id === product.id && item.selectedVariation?.id === variation.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        // Use variation prices if available, otherwise use product prices
        const price_usd = variation.effective_sale_price_usd ?? product.price_usd
        const price_cup = variation.effective_sale_price_cup ?? product.price_cup
        return [...prev, { ...product, price_usd, price_cup, quantity, selectedVariation: variation }]
      } else {
        // No variation, match by product id only
        const existing = prev.find((item) => item.id === product.id && !item.selectedVariation)
        if (existing) {
          return prev.map((item) =>
            item.id === product.id && !item.selectedVariation
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        return [...prev, { ...product, quantity }]
      }
    })
    setIsCartOpen(true)
  }, [])

  const removeFromCart = useCallback((productId: number, variationId?: number) => {
    setCart((prev) => {
      if (variationId !== undefined) {
        return prev.filter((item) => !(item.id === productId && item.selectedVariation?.id === variationId))
      }
      return prev.filter((item) => item.id !== productId)
    })
  }, [])

  const updateQuantity = useCallback(
    (productId: number, quantity: number, variationId?: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, variationId)
        return
      }
      setCart((prev) =>
        prev.map((item) => {
          if (variationId !== undefined) {
            return item.id === productId && item.selectedVariation?.id === variationId
              ? { ...item, quantity }
              : item
          }
          return item.id === productId && !item.selectedVariation ? { ...item, quantity } : item
        })
      )
    },
    [removeFromCart],
  )

  const clearCart = useCallback(() => {
    setCart([])
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY)
    }
  }, [])

  // Calculate totals in both currencies
  const cartTotal_usd = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.selectedVariation?.effective_sale_price_usd ?? item.price_usd
      return total + price * item.quantity
    }, 0)
  }, [cart])

  const cartTotal_cup = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.selectedVariation?.effective_sale_price_cup ?? item.price_cup
      return total + price * item.quantity
    }, 0)
  }, [cart])

  // Current currency total (for backward compatibility)
  const cartTotal = useMemo(() => {
    return currency === "USD" ? cartTotal_usd : cartTotal_cup
  }, [cartTotal_usd, cartTotal_cup, currency])

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }, [cart])

  // Helper function to format cart total
  const formatCartTotal = useCallback(() => {
    return formatPrice(cartTotal_usd, cartTotal_cup)
  }, [formatPrice, cartTotal_usd, cartTotal_cup])

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartTotal_usd,
        cartTotal_cup,
        cartCount,
        currency,
        setCurrency,
        exchangeRate,
        formatPrice,
        formatCartTotal,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
