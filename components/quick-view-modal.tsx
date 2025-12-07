"use client"

import Image from "next/image"
import { X, Minus, Plus, ShoppingBag, Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore, type ProductVariation } from "@/lib/store-context"
import { useState, useEffect } from "react"

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, formatPrice } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(undefined)

  // Track selected attributes for each attribute type
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})

  // Check if product has variations
  const hasVariations = quickViewProduct?.variations && quickViewProduct.variations.length > 0

  // Initialize selected variation when product changes
  useEffect(() => {
    if (hasVariations && quickViewProduct?.variations) {
      const firstAvailable = quickViewProduct.variations.find((v) => v.is_available && v.stock > 0)
      setSelectedVariation(firstAvailable)
      // Initialize selected attributes from first available variation
      if (firstAvailable?.attributes) {
        setSelectedAttributes(firstAvailable.attributes)
      } else {
        setSelectedAttributes({})
      }
      setQuantity(1)
    } else {
      setSelectedVariation(undefined)
      setSelectedAttributes({})
      setQuantity(1)
    }
  }, [quickViewProduct, hasVariations])

  // Update selected variation when attributes change
  useEffect(() => {
    if (
      hasVariations &&
      quickViewProduct?.variations &&
      Object.keys(selectedAttributes).length > 0
    ) {
      // Find variation that matches all selected attributes
      const matchingVariation = quickViewProduct.variations.find((v) => {
        if (!v.attributes) return false
        // Check if all selected attributes match this variation's attributes
        return Object.keys(selectedAttributes).every(
          (key) => v.attributes?.[key] === selectedAttributes[key]
        )
      })

      if (matchingVariation) {
        setSelectedVariation(matchingVariation)
        if (matchingVariation.is_available && matchingVariation.stock > 0) {
          // Adjust quantity if it exceeds stock
          setQuantity((prev) => Math.min(prev, matchingVariation.stock))
        } else {
          // Variation exists but is not available
          setQuantity(0)
        }
      } else {
        // No matching variation found, clear selection
        setSelectedVariation(undefined)
        setQuantity(0)
      }
    }
  }, [selectedAttributes, quickViewProduct, hasVariations])

  // Update quantity when selected variation changes to respect stock
  useEffect(() => {
    if (selectedVariation && quantity > selectedVariation.stock) {
      setQuantity(selectedVariation.stock)
    }
  }, [selectedVariation, quantity])

  if (!quickViewProduct) return null

  // Generate thumbnail images (simulated multiple images)
  const images = quickViewProduct.images || [quickViewProduct.image]

  const handleAddToCart = () => {
    if (hasVariations) {
      if (selectedVariation && selectedVariation.is_available && selectedVariation.stock > 0) {
        addToCart(quickViewProduct, quantity, selectedVariation)
        setQuickViewProduct(null)
        setQuantity(1)
        setSelectedImage(0)
        setSelectedVariation(undefined)
        setSelectedAttributes({})
      }
    } else {
      addToCart(quickViewProduct, quantity)
      setQuickViewProduct(null)
      setQuantity(1)
      setSelectedImage(0)
      setSelectedVariation(undefined)
      setSelectedAttributes({})
    }
  }

  const displayPrice = selectedVariation
    ? formatPrice(
        selectedVariation.effective_sale_price_usd ?? quickViewProduct.price_usd,
        selectedVariation.effective_sale_price_cup ?? quickViewProduct.price_cup
      )
    : formatPrice(quickViewProduct.price_usd, quickViewProduct.price_cup)

  const handleClose = () => {
    setQuickViewProduct(null)
    setQuantity(1)
    setSelectedImage(0)
    setSelectedVariation(undefined)
    setSelectedAttributes({})
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-foreground/50 z-50 transition-opacity" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-4xl md:w-full bg-card z-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-card/80 backdrop-blur hover:bg-card"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Image Section */}
        <div className="md:w-1/2 p-4 md:p-6 bg-secondary">
          {/* Main Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-4">
            <Image
              src={images[selectedImage] || "/images/logo.png"}
              alt={quickViewProduct.name}
              fill
              className="object-cover"
            />
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {quickViewProduct.isNew && (
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Nuevo
                </span>
              )}
              {quickViewProduct.isSale && (
                <span className="px-2 py-1 bg-destructive text-card text-xs font-medium rounded-full">Oferta</span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                  selectedImage === index ? "border-primary" : "border-transparent hover:border-primary/50"
                }`}
              >
                <Image
                  src={img || "/images/logo.png"}
                  alt={`${quickViewProduct.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 p-6 flex flex-col overflow-y-auto">
          <p className="text-sm text-primary font-medium mb-2">{quickViewProduct.category}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">{quickViewProduct.name}</h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(quickViewProduct.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({quickViewProduct.rating})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-primary">{displayPrice}</span>
          </div>

          {/* Variations Selector - Custom Radio Buttons grouped by attribute */}
          {hasVariations && (
            <div className="mb-6 space-y-4">
              {(() => {
                if (!quickViewProduct.variations || quickViewProduct.variations.length === 0) return null

                // Get all unique attribute keys from all variations
                const attributeKeys = new Set<string>()
                quickViewProduct.variations.forEach((v) => {
                  if (v.attributes) {
                    Object.keys(v.attributes).forEach((key) => attributeKeys.add(key))
                  }
                })

                return Array.from(attributeKeys).map((attrKey) => {
                  // Get unique values for this attribute
                  const uniqueValues = new Set<string>()
                  quickViewProduct.variations?.forEach((v) => {
                    if (v.attributes?.[attrKey]) {
                      uniqueValues.add(v.attributes[attrKey])
                    }
                  })

                  // Get label for attribute (translate common ones)
                  const getAttributeLabel = (key: string) => {
                    const labels: Record<string, string> = {
                      color: "Color",
                      modelo: "Modelo",
                      size: "Talla",
                      material: "Material",
                    }
                    return labels[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1)
                  }

                  return (
                    <div key={attrKey} className="space-y-2">
                      <label className="text-sm font-semibold text-foreground block">
                        {getAttributeLabel(attrKey)}:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(uniqueValues).map((value) => {
                          const isSelected = selectedAttributes[attrKey] === value
                          // Check if this value is available (has at least one variation with stock > 0)
                          const isAvailable =
                            quickViewProduct.variations?.some(
                              (v) =>
                                v.attributes?.[attrKey] === value &&
                                v.is_available &&
                                v.stock > 0
                            ) ?? false

                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => {
                                setSelectedAttributes((prev) => ({
                                  ...prev,
                                  [attrKey]: value,
                                }))
                              }}
                              className={`
                                px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium
                                ${
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                    : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary"
                                }
                                ${!isAvailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                              `}
                              disabled={!isAvailable}
                            >
                              {value}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              })()}
              
              {/* Selected Variation Info */}
              {selectedVariation ? (
                <div className="mt-4 p-3 bg-secondary rounded-lg border border-border">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Variación seleccionada:
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">{selectedVariation.name}</p>
                      {selectedVariation.stock > 0 ? (
                        <p className="text-xs text-muted-foreground">
                          Stock disponible: <span className="font-medium text-foreground">{selectedVariation.stock} unidades</span>
                        </p>
                      ) : (
                        <p className="text-xs text-destructive font-medium">Sin stock disponible</p>
                      )}
                    </div>
                    {selectedVariation.effective_sale_price_usd !== undefined && 
                     selectedVariation.effective_sale_price_usd !== quickViewProduct.price_usd && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Precio:</p>
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(
                            selectedVariation.effective_sale_price_usd ?? quickViewProduct.price_usd,
                            selectedVariation.effective_sale_price_cup ?? quickViewProduct.price_cup
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : hasVariations && Object.keys(selectedAttributes).length > 0 ? (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive font-medium">
                    Por favor, selecciona todas las opciones disponibles para continuar.
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Description */}
          <p className="text-muted-foreground mb-6 flex-1">
            {quickViewProduct.description ||
              "Producto de alta calidad cuidadosamente seleccionado para ti. Disfruta de la mejor experiencia de compra con El Timbiriche Shop."}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-muted-foreground">Cantidad:</span>
            <div className="flex items-center gap-2 bg-secondary rounded-full p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  const maxQuantity = selectedVariation
                    ? selectedVariation.stock
                    : quickViewProduct.stock || 999
                  setQuantity(Math.min(maxQuantity, quantity + 1))
                }}
                disabled={
                  selectedVariation
                    ? quantity >= selectedVariation.stock
                    : quantity >= (quickViewProduct.stock || 999)
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {selectedVariation && (
              <span className="text-xs text-muted-foreground">
                ({selectedVariation.stock} disponibles)
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={
                hasVariations 
                  ? !selectedVariation || !selectedVariation.is_available || selectedVariation.stock === 0 || quantity === 0
                  : false
              }
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Agregar al Carrito
            </Button>
            {/* <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/30 hover:bg-primary/5 bg-transparent"
            >
              <Heart className="h-5 w-5" />
            </Button> */}
          </div>
        </div>
      </div>
    </>
  )
}
