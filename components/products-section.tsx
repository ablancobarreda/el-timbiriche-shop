"use client"

import Image from "next/image"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Eye } from "lucide-react"
import { useStore, type Product, type ProductVariation } from "@/lib/store-context"
import { useRouter } from "next/navigation"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, quantity?: number, variation?: ProductVariation) => void
  onQuickView: () => void
  formatPrice: (price_usd: number, price_cup: number) => string
}

function ProductCard({ product, onAddToCart, onQuickView, formatPrice }: ProductCardProps) {
  const hasVariations = product.variations && product.variations.length > 0

  const handleAddToCart = () => {
    if (!hasVariations) {
      onAddToCart(product, 1)
    }
  }

  const handleButtonClick = () => {
    if (hasVariations) {
      onQuickView()
    } else {
      handleAddToCart()
    }
  }

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
    <Card className="group bg-card border-border hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-4">
          <Image
            src={product.image || "/images/logo.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badges */}
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
          <div className="absolute top-2 right-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-card/90 backdrop-blur hover:bg-primary hover:text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onQuickView}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-medium text-foreground text-sm md:text-base mb-2 line-clamp-2">
            {product.name}
          </h3>
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
          
          <div className="flex items-center gap-1 mt-2">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-muted-foreground">{product.rating}</span>
          </div>
        </div>
        <Button
          className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
          size="sm"
          onClick={handleButtonClick}
        >
          {hasVariations ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Ver Opciones
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Agregar al Carrito
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export function ProductsSection() {
  const { data: products, isLoading } = useSWR<Product[]>("/api/products", fetcher)
  const [filter, setFilter] = useState("all")
  const { addToCart, formatPrice, setQuickViewProduct } = useStore()
  const router = useRouter()

  const filters = [
    { id: "all", name: "Todos" },
    { id: "new", name: "Nuevos" },
    { id: "sale", name: "Ofertas" },
    { id: "popular", name: "Populares" },
  ]

  const filteredProducts = products?.filter((product) => {
    if (filter === "all") return true
    if (filter === "new") return product.isNew
    if (filter === "sale") return product.isSale
    if (filter === "popular") return product.rating >= 4.5
    return true
  })

  return (
    <section id="productos" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Catalogo</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Productos Destacados</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Descubre nuestra seleccion de productos mas populares y las mejores ofertas del momento.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {filters.map((f) => (
              <Button
                key={f.id}
                variant={filter === f.id ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-6 ${
                  filter === f.id ? "bg-primary text-primary-foreground" : "border-primary/30 hover:bg-primary/5"
                }`}
              >
                {f.name}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-xl animate-pulse mb-4" />
                  <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onQuickView={() => setQuickViewProduct(product)}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button
          onClick={() => router.push("/buscar?q=")}
            variant="outline"
            size="lg"
            className="rounded-full px-8 border-primary/30 hover:bg-primary/5 bg-transparent"
          >
            Ver Todos los Productos
          </Button>
        </div>
      </div>
    </section>
  )
}
