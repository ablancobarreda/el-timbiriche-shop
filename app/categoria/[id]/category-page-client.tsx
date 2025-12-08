"use client"

import Image from "next/image"
import { ShoppingBag, Heart, Eye, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useStore, type Product } from "@/lib/store-context"
import { useState, useEffect } from "react"

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

interface CategoryPageClientProps {
  initialProducts: Product[]
  category: Category | null
}

export function CategoryPageClient({ initialProducts, category }: CategoryPageClientProps) {
  const { addToCart, formatPrice, setQuickViewProduct, currency } = useStore()
  const [showFilters, setShowFilters] = useState(false)
  const [products] = useState<Product[]>(initialProducts)
  
  // Initialize with default USD range to avoid hydration mismatch
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortBy, setSortBy] = useState("default")
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted flag after initial render
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update price range when currency changes (only after mount)
  useEffect(() => {
    if (!isMounted) return
    
    const newMaxPrice = currency === "USD" ? 1000 : 350000
    // Reset to default range when currency changes
    setPriceRange([0, newMaxPrice])
  }, [currency, isMounted])

  // Get default max price based on current currency
  const defaultMaxPrice = currency === "USD" ? 1000 : 350000

  // Get price based on current currency
  const getProductPrice = (product: Product) => {
    return currency === "USD" ? product.price_usd : product.price_cup
  }

  const filteredProducts = Array.isArray(products)
    ? products
        .filter((product) => {
          const productPrice = getProductPrice(product)
          const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1]
          return matchesPrice
        })
        .sort((a, b) => {
          switch (sortBy) {
            case "price-asc":
              return getProductPrice(a) - getProductPrice(b)
            case "price-desc":
              return getProductPrice(b) - getProductPrice(a)
            case "rating":
              return b.rating - a.rating
            case "newest":
              return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
            default:
              return 0
          }
        })
    : []

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Filters - Desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Ordenar por</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="default">Por defecto</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor valorados</option>
                <option value="newest">Mas nuevos</option>
              </select>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Rango de Precio</h3>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-20 text-sm"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-20 text-sm"
                />
              </div>
            </div>

            {(priceRange[0] > 0 || priceRange[1] < defaultMaxPrice) && (
              <Button variant="ghost" size="sm" onClick={() => setPriceRange([0, defaultMaxPrice])} className="text-primary">
                Limpiar filtros
              </Button>
            )}
          </div>
        </aside>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="fixed inset-0 bg-foreground/50 z-50">
            <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filtros</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Ordenar por</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="default">Por defecto</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                    <option value="rating">Mejor valorados</option>
                    <option value="newest">Mas nuevos</option>
                  </select>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Precio</h4>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="flex-1"
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button
                  className="w-full rounded-full bg-primary text-primary-foreground"
                  onClick={() => setShowFilters(false)}
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">{filteredProducts.length} productos</p>
            <Button
              variant="outline"
              size="sm"
              className="md:hidden rounded-full border-primary/30 gap-2 bg-transparent"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const hasVariations = product.variations && product.variations.length > 0

                // Calculate price range if variations have different prices
                const getPriceRange = () => {
                  if (!hasVariations || !product.variations) return null
                  
                  const prices = product.variations
                    .filter(v => v.is_available && v.stock > 0)
                    .map(v => ({
                      usd: v.effective_sale_price_usd ?? product.price_usd,
                      cup: v.effective_sale_price_cup ?? product.price_cup
                    }))
                  
                  if (prices.length === 0) return null
                  
                  const minPrice = prices.reduce((min, p) => p.usd < min.usd ? p : min, prices[0])
                  const maxPrice = prices.reduce((max, p) => p.usd > max.usd ? p : max, prices[0])
                  
                  if (minPrice.usd === maxPrice.usd) return null
                  
                  return {
                    min: minPrice,
                    max: maxPrice
                  }
                }

                const priceRange = getPriceRange()
                const displayPrice = priceRange 
                  ? `${formatPrice(priceRange.min.usd, priceRange.min.cup)} - ${formatPrice(priceRange.max.usd, priceRange.max.cup)}`
                  : formatPrice(product.price_usd, product.price_cup)

                // Extract unique attribute values from variations
                const getAvailableAttributes = () => {
                  if (!hasVariations || !product.variations) return null
                  
                  const availableVariations = product.variations.filter(v => v.is_available && v.stock > 0)
                  if (availableVariations.length === 0) return null
                  
                  const attributes: Record<string, Set<string>> = {}
                  
                  availableVariations.forEach(variation => {
                    if (variation.attributes) {
                      Object.entries(variation.attributes).forEach(([key, value]) => {
                        if (!attributes[key]) {
                          attributes[key] = new Set()
                        }
                        attributes[key].add(value)
                      })
                    }
                  })
                  
                  return Object.keys(attributes).length > 0 ? attributes : null
                }

                const availableAttributes = getAvailableAttributes()

                return (
                  <Card key={product.id} className="group bg-card border-border hover:shadow-lg transition-shadow">
                    <CardContent className=" flex flex-col justify-between p-4 h-full">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-4">
                        <Image
                          src={product.image || "/images/logo.png"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {product.isNew && (
                            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                              Nuevo
                            </span>
                          )}
                          {product.isSale && (
                            <span className="px-2 py-1 bg-destructive text-card text-xs font-medium rounded-full">
                              Oferta
                            </span>
                          )}
                          {hasVariations && product.variations && (
                            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                              {product.variations.length} {product.variations.length === 1 ? 'variación' : 'variaciones'}
                            </span>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-card/90 backdrop-blur hover:bg-primary hover:text-primary-foreground"
                            onClick={() => setQuickViewProduct(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                        <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-primary">{displayPrice}</span>
                          {product.originalPrice_usd && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.originalPrice_usd || 0, product.originalPrice_cup || 0)}
                            </span>
                          )}
                        </div>
                        
                        {/* Show available variations attributes */}
                        {availableAttributes && (
                          <div className="space-y-1.5 mb-2">
                            {Object.entries(availableAttributes).map(([key, values]) => {
                              const attributeName = key === 'color' ? 'Colores' : key === 'modelo' ? 'Modelos' : key.charAt(0).toUpperCase() + key.slice(1)
                              const valuesArray = Array.from(values)
                              
                              return (
                                <div key={key} className="flex flex-col gap-1">
                                  <span className="text-xs text-muted-foreground font-medium">{attributeName}:</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {valuesArray.slice(0, 3).map((value, idx) => (
                                      <span
                                        key={idx}
                                        className="text-xs px-2 py-0.5 bg-muted rounded-full text-foreground"
                                      >
                                        {value}
                                      </span>
                                    ))}
                                    {valuesArray.length > 3 && (
                                      <span className="text-xs px-2 py-0.5 text-muted-foreground">
                                        +{valuesArray.length - 3} más
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                      <div className=" mt-4">
                          <Button
                            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                            size="sm"
                            onClick={() => {
                              if (hasVariations) {
                                setQuickViewProduct(product)
                              } else {
                                addToCart(product)
                              }
                            }}
                          >
                            {hasVariations ? (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Opciones
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Agregar
                              </>
                            )}
                          </Button>
                        </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No hay productos en esta categoria</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

