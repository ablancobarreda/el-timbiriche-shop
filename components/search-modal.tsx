"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore, type Product } from "@/lib/store-context"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, formatPrice, setQuickViewProduct } = useStore()
  const [localQuery, setLocalQuery] = useState("")
  const { data: products } = useSWR<Product[]>("/api/products", fetcher)

  useEffect(() => {
    if (isSearchOpen) {
      setLocalQuery(searchQuery)
    }
  }, [isSearchOpen, searchQuery])

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(localQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(localQuery.toLowerCase()),
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(localQuery)
    if (localQuery) {
      setIsSearchOpen(false)
      window.location.href = `/buscar?q=${encodeURIComponent(localQuery)}`
    }
  }

  if (!isSearchOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-foreground/50 z-50 transition-opacity" onClick={() => setIsSearchOpen(false)} />

      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 bg-card z-50 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="p-4 border-b border-border">
          <div className="container mx-auto flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar productos, categorias..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg border-primary/30 rounded-full focus:ring-primary"
                autoFocus
              />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
        </form>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto">
            {localQuery ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredProducts?.length || 0} resultados para "{localQuery}"
                </p>
                {filteredProducts && filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredProducts.slice(0, 12).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setQuickViewProduct(product)
                          setIsSearchOpen(false)
                        }}
                        className="group text-left"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-2">
                          <Image
                            src={product.image || "/images/logo.png"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">{product.name}</h3>
                        <p className="text-sm font-semibold text-primary">{formatPrice(product.price_usd, product.price_cup)}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No se encontraron productos</p>
                  </div>
                )}
                {filteredProducts && filteredProducts.length > 0 && (
                  <div className="text-center mt-6">
                    <Link href={`/buscar?q=${encodeURIComponent(localQuery)}`} onClick={() => setIsSearchOpen(false)}>
                      <Button
                        variant="outline"
                        className="rounded-full border-primary/30 hover:bg-primary/5 bg-transparent"
                      >
                        Ver todos los resultados
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Escribe para buscar productos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
