"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import useSWR from "swr"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Trash2, Upload, X, GripVertical, Save } from "lucide-react"
import Link from "next/link"
import type { Category, ProductVariation } from "@/lib/admin-types"

const fetcher = (url: string) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
  return fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  }).then((res) => res.json())
}

export default function CreateProductPage() {
  const router = useRouter()
  const { data: categoriesData } = useSWR("/api/admin/categories", fetcher)
  const categories: Category[] = categoriesData?.categories || []

  const [isLoading, setIsLoading] = useState(false)
  const [hasVariations, setHasVariations] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost_price_usd: "",
    cost_price_cup: "",
    sale_price_usd: "",
    sale_price_cup: "",
    stock: "",
    category_id: "",
  })

  const [variations, setVariations] = useState<Partial<ProductVariation>[]>([])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles: File[] = []
    const newPreviews: string[] = []

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(`El archivo ${file.name} no es una imagen válida`)
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`El archivo ${file.name} es demasiado grande. Máximo 5MB`)
        return
      }

      newFiles.push(file)
      // Create preview URL
      const preview = URL.createObjectURL(file)
      newPreviews.push(preview)
    })

    setImageFiles([...imageFiles, ...newFiles])
    setImagePreviews([...imagePreviews, ...newPreviews])

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddImage = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = (index: number) => {
    // Revoke preview URL to free memory
    URL.revokeObjectURL(imagePreviews[index])
    
    setImageFiles(imageFiles.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleAddVariation = () => {
    setVariations([
      ...variations,
      {
        id: `temp-${Date.now()}`,
        name: "",
        sku: "",
        attributes: {},
        stock: 0, // Required field
        // Optional fields - leave undefined so they inherit from product
        cost_price_usd: undefined,
        cost_price_cup: undefined,
        sale_price_usd: undefined,
        sale_price_cup: undefined,
        is_available: true,
        order: variations.length,
      },
    ])
  }

  const handleRemoveVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index))
  }

  const handleVariationChange = (index: number, field: string, value: string | number | boolean) => {
    const updated = [...variations]
    updated[index] = { ...updated[index], [field]: value }
    setVariations(updated)
  }

  const handleAttributeChange = (index: number, key: string, value: string) => {
    const updated = [...variations]
    updated[index] = {
      ...updated[index],
      attributes: { ...updated[index].attributes, [key]: value },
    }
    setVariations(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

      if (!token) {
        alert("No estás autenticado. Por favor, inicia sesión.")
        router.push("/admin/login")
        setIsLoading(false)
        return
      }

      // Validate required fields
      if (!formData.name || !formData.category_id) {
        alert("Por favor, completa todos los campos requeridos")
        setIsLoading(false)
        return
      }

      // Create FormData to handle file uploads
      const formDataToSend = new FormData()

      // Add product fields
      formDataToSend.append("name", formData.name)
      if (formData.description) {
        formDataToSend.append("description", formData.description)
      }
      formDataToSend.append("cost_price_usd", formData.cost_price_usd)
      formDataToSend.append("cost_price_cup", formData.cost_price_cup)
      formDataToSend.append("sale_price_usd", formData.sale_price_usd)
      formDataToSend.append("sale_price_cup", formData.sale_price_cup)
      // Stock: if product has variations, stock should be 0 or null
      // If no variations, stock is required
      if (hasVariations) {
        formDataToSend.append("stock", "0")
      } else {
        formDataToSend.append("stock", formData.stock || "0")
      }
      formDataToSend.append("category_id", formData.category_id)
      formDataToSend.append("is_available", "1")

      // Add variations if present
      // Laravel expects variations as an array in FormData format
      if (hasVariations && variations.length > 0) {
        variations.forEach((variation, index) => {
          // Required fields
          if (variation.name) {
            formDataToSend.append(`variations[${index}][name]`, variation.name)
          }
          if (variation.stock !== undefined && variation.stock !== null) {
            formDataToSend.append(`variations[${index}][stock]`, variation.stock.toString())
          }

          // Optional fields - only send if they have values
          if (variation.sku && variation.sku.trim() !== "") {
            formDataToSend.append(`variations[${index}][sku]`, variation.sku)
          }
          if (variation.cost_price_usd !== undefined && variation.cost_price_usd !== null && variation.cost_price_usd > 0) {
            formDataToSend.append(`variations[${index}][cost_price_usd]`, variation.cost_price_usd.toString())
          }
          if (variation.cost_price_cup !== undefined && variation.cost_price_cup !== null && variation.cost_price_cup > 0) {
            formDataToSend.append(`variations[${index}][cost_price_cup]`, variation.cost_price_cup.toString())
          }
          if (variation.sale_price_usd !== undefined && variation.sale_price_usd !== null && variation.sale_price_usd > 0) {
            formDataToSend.append(`variations[${index}][sale_price_usd]`, variation.sale_price_usd.toString())
          }
          if (variation.sale_price_cup !== undefined && variation.sale_price_cup !== null && variation.sale_price_cup > 0) {
            formDataToSend.append(`variations[${index}][sale_price_cup]`, variation.sale_price_cup.toString())
          }
          if (variation.is_available !== undefined) {
            formDataToSend.append(`variations[${index}][is_available]`, variation.is_available ? "1" : "0")
          }
          if (variation.order !== undefined && variation.order !== null) {
            formDataToSend.append(`variations[${index}][order]`, variation.order.toString())
          }
          
          // Attributes must be sent as nested array in FormData
          // Laravel expects: variations[0][attributes][color] = "Rojo"
          // This will be parsed as: $variations[0]['attributes'] = ['color' => 'Rojo']
          if (variation.attributes) {
            const hasAttributes = Object.entries(variation.attributes).some(
              ([, value]) => value && value.toString().trim() !== "",
            )
            
            if (hasAttributes) {
              Object.entries(variation.attributes).forEach(([key, value]) => {
                if (value && value.toString().trim() !== "") {
                  formDataToSend.append(`variations[${index}][attributes][${key}]`, value.toString().trim())
                }
              })
            }
            // If no attributes, don't send the field (Laravel will treat it as null/empty array)
          }
        })
      }

      // Add image files
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`images[${index}]`, file)
      })

      console.log("Sending product data:", {
        name: formData.name,
        category_id: formData.category_id,
        imagesCount: imageFiles.length,
        variationsCount: variations.length,
      })

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type header, let browser set it with boundary for FormData
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error creating product:", errorData)
        const errorMessage =
          errorData.errors && typeof errorData.errors === "object"
            ? Object.values(errorData.errors).flat().join(", ")
            : errorData.error || errorData.message || "Error al crear el producto"
        alert(errorMessage)
        setIsLoading(false)
        return
      }

      const result = await response.json()
      console.log("Product created successfully:", result)

      // Clean up preview URLs
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview))

      router.push("/admin/products")
    } catch (error) {
      console.error("Error:", error)
      alert("Error al crear el producto. Por favor, intenta de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout title="Crear Producto" description="Agrega un nuevo producto al catalogo">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Informacion Basica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Bolso de Cuero Premium"
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripcion</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el producto..."
                    rows={4}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Selecciona una categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Precios</CardTitle>
                <CardDescription>Define los precios de costo y venta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cost_usd">Precio Costo (USD) *</Label>
                    <Input
                      id="cost_usd"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cost_price_usd}
                      onChange={(e) => setFormData({ ...formData, cost_price_usd: e.target.value })}
                      placeholder="0.00"
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost_cup">Precio Costo (CUP) *</Label>
                    <Input
                      id="cost_cup"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cost_price_cup}
                      onChange={(e) => setFormData({ ...formData, cost_price_cup: e.target.value })}
                      placeholder="0.00"
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale_usd">Precio Venta (USD) *</Label>
                    <Input
                      id="sale_usd"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.sale_price_usd}
                      onChange={(e) => setFormData({ ...formData, sale_price_usd: e.target.value })}
                      placeholder="0.00"
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale_cup">Precio Venta (CUP) *</Label>
                    <Input
                      id="sale_cup"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.sale_price_cup}
                      onChange={(e) => setFormData({ ...formData, sale_price_cup: e.target.value })}
                      placeholder="0.00"
                      required
                      className="bg-background"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variations */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-serif text-lg">Variaciones</CardTitle>
                    <CardDescription>Color, tamanno, talla, etc.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="has-variations" className="text-sm">
                      Tiene variaciones
                    </Label>
                    <Switch id="has-variations" checked={hasVariations} onCheckedChange={setHasVariations} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!hasVariations ? (
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="0"
                      required={!hasVariations}
                      className="bg-background max-w-xs"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {variations.map((variation, index) => (
                      <div key={variation.id} className="p-4 rounded-xl border border-border bg-background">
                        <div className="flex items-center gap-2 mb-4">
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                          <span className="font-medium text-foreground">Variacion {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="ml-auto h-8 w-8 text-destructive"
                            onClick={() => handleRemoveVariation(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nombre *</Label>
                            <Input
                              value={variation.name || ""}
                              onChange={(e) => handleVariationChange(index, "name", e.target.value)}
                              placeholder="Ej: Rojo - Talla M"
                              required
                              className="bg-card"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>SKU (Opcional)</Label>
                            <Input
                              value={variation.sku || ""}
                              onChange={(e) => handleVariationChange(index, "sku", e.target.value)}
                              placeholder="Ej: CAM-DEP-ROJO-M"
                              className="bg-card"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Stock *</Label>
                            <Input
                              type="number"
                              min="0"
                              value={variation.stock !== undefined ? variation.stock : ""}
                              onChange={(e) =>
                                handleVariationChange(
                                  index,
                                  "stock",
                                  e.target.value === "" ? 0 : Number.parseInt(e.target.value) || 0,
                                )
                              }
                              placeholder="0"
                              required
                              className="bg-card"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Precio Costo USD (Opcional)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={variation.cost_price_usd !== undefined ? variation.cost_price_usd : ""}
                              onChange={(e) =>
                                handleVariationChange(
                                  index,
                                  "cost_price_usd",
                                  e.target.value === "" ? "" : Number.parseFloat(e.target.value) || "",
                                )
                              }
                              placeholder="Hereda del producto"
                              className="bg-card"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Precio Costo CUP (Opcional)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={variation.cost_price_cup !== undefined ? variation.cost_price_cup : ""}
                              onChange={(e) =>
                                handleVariationChange(
                                  index,
                                  "cost_price_cup",
                                  e.target.value === "" ? "" : Number.parseFloat(e.target.value) || "",
                                )
                              }
                              placeholder="Hereda del producto"
                              className="bg-card"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Precio Venta USD (Opcional)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={variation.sale_price_usd !== undefined ? variation.sale_price_usd : ""}
                              onChange={(e) =>
                                handleVariationChange(
                                  index,
                                  "sale_price_usd",
                                  e.target.value === "" ? "" : Number.parseFloat(e.target.value) || "",
                                )
                              }
                              placeholder="Hereda del producto"
                              className="bg-card"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Precio Venta CUP (Opcional)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={variation.sale_price_cup !== undefined ? variation.sale_price_cup : ""}
                              onChange={(e) =>
                                handleVariationChange(
                                  index,
                                  "sale_price_cup",
                                  e.target.value === "" ? "" : Number.parseFloat(e.target.value) || "",
                                )
                              }
                              placeholder="Hereda del producto"
                              className="bg-card"
                            />
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                          <Label className="mb-2 block">Atributos (Opcional)</Label>
                          <p className="text-xs text-muted-foreground mb-3">
                            Define los atributos de esta variación (color, talla, modelo, peso, etc.)
                          </p>
                          <div className="grid sm:grid-cols-3 gap-2">
                            <Input
                              placeholder="Color (ej: Rojo)"
                              value={variation.attributes?.color || ""}
                              onChange={(e) => handleAttributeChange(index, "color", e.target.value)}
                              className="bg-card"
                            />
                            <Input
                              placeholder="Talla (ej: M)"
                              value={variation.attributes?.talla || ""}
                              onChange={(e) => handleAttributeChange(index, "talla", e.target.value)}
                              className="bg-card"
                            />
                            <Input
                              placeholder="Modelo/Peso (ej: iPhone 11, 500g)"
                              value={variation.attributes?.modelo || variation.attributes?.peso || ""}
                              onChange={(e) => {
                                // Try to detect if it's modelo or peso based on input
                                const value = e.target.value
                                if (value.toLowerCase().includes("iphone") || value.toLowerCase().includes("modelo")) {
                                  handleAttributeChange(index, "modelo", value)
                                } else if (value.includes("g") || value.includes("kg")) {
                                  handleAttributeChange(index, "peso", value)
                                } else {
                                  // Default to modelo if not clear
                                  handleAttributeChange(index, "modelo", value)
                                }
                              }}
                              className="bg-card"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Los atributos se pueden combinar libremente según el tipo de producto
                          </p>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          <Switch
                            checked={variation.is_available !== false}
                            onCheckedChange={(checked) => handleVariationChange(index, "is_available", checked)}
                          />
                          <Label className="text-sm">Disponible para venta</Label>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={handleAddVariation}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Variacion
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Images */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Imagenes</CardTitle>
                <CardDescription>Sube las fotos del producto</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg bg-secondary overflow-hidden group border border-border"
                      >
                        <Image
                          src={preview}
                          alt={`Imagen ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                            Principal
                          </span>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                          {imageFiles[index]?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No hay imágenes seleccionadas</p>
                  </div>
                )}

                <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleAddImage}>
                  <Upload className="h-4 w-4 mr-2" />
                  {imagePreviews.length > 0 ? "Agregar Más Imágenes" : "Seleccionar Imágenes"}
                </Button>
                {imagePreviews.length > 0 && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {imagePreviews.length} imagen{imagePreviews.length !== 1 ? "es" : ""} seleccionada
                    {imagePreviews.length !== 1 ? "s" : ""}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Guardando...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Producto
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => router.push("/admin/products")}
                >
                  Cancelar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
