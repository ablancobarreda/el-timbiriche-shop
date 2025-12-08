"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import { ArrowLeft, Search, ShoppingBag, Heart, Eye, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useStore, type Product } from "@/lib/store-context"
import { useState, useEffect } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const searchUrl = query ? `/api/products/search?q=${encodeURIComponent(query)}` : "/api/products"
  const { data: products, isLoading, error } = useSWR<Product[]>(searchUrl, fetcher)
  const { addToCart, formatPrice, setQuickViewProduct, currency } = useStore()
  const [localQuery, setLocalQuery] = useState(query)
  const [showFilters, setShowFilters] = useState(false)
  
  // Default price range based on currency
  const defaultMaxPrice = currency === "USD" ? 1000 : 350000
  const [priceRange, setPriceRange] = useState<[number, number]>([0, defaultMaxPrice])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Update price range when currency changes
  useEffect(() => {
    const newMaxPrice = currency === "USD" ? 1000 : 350000
    setPriceRange([0, newMaxPrice])
  }, [currency])

  // Get price based on current currency
  const getProductPrice = (product: Product) => {
    return currency === "USD" ? product.price_usd : product.price_cup
  }

  const categories = [...new Set(products?.map((p) => p.category) || [])]

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        const productPrice = getProductPrice(product)
        const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1]
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
        return matchesPrice && matchesCategory
      })
    : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `/buscar?q=${encodeURIComponent(localQuery)}`
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border-primary/30 rounded-full"
                />
              </div>
            </form>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-primary/30 gap-2 md:hidden bg-transparent"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header> */}

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Categorias</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="rounded border-primary/30 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-muted-foreground">{category}</span>
                    </label>
                  ))}
                </div>
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

              {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < defaultMaxPrice) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategories([])
                    setPriceRange([0, defaultMaxPrice])
                  }}
                  className="text-primary"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </aside>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="fixed inset-0 bg-foreground/50 z-50 md:hidden">
              <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Filtros</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Categorias</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategories.includes(category) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleCategory(category)}
                          className={`rounded-full ${
                            selectedCategories.includes(category)
                              ? "bg-primary text-primary-foreground"
                              : "border-primary/30"
                          }`}
                        >
                          {category}
                        </Button>
                      ))}
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

          <div className="container mx-auto mb-2">
            <div className="flex items-center gap-4">
              
              <form onSubmit={handleSearch} className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar productos..."
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 border-primary/30 rounded-full"
                  />
                </div>
              </form>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-primary/30 gap-2 md:hidden bg-transparent"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
        </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {query ? (
                  <>
                    {filteredProducts?.length || 0} resultados para "{query}"
                  </>
                ) : (
                  "Todos los productos"
                )}
              </p>
            </div>
            

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-xl animate-pulse mb-4" />
                      <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Error al buscar</h3>
                <p className="text-muted-foreground">Hubo un problema al realizar la búsqueda. Por favor, intenta de nuevo.</p>
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
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
                      <CardContent className="">
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
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Sin resultados</h3>
                <p className="text-muted-foreground">No encontramos productos que coincidan con tu busqueda</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
