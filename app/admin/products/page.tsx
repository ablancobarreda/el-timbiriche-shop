"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Package, Layers } from "lucide-react"
import type { Product, Category } from "@/lib/admin-types"

const fetcher = async (url: string) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  console.log("Fetcher - Token:", token ? "Token exists" : "No token")
  console.log("Fetcher - URL:", url)
  
  if (!token) {
    console.warn("No token found in localStorage for request to:", url)
    throw new Error("No authentication token found")
  }
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    console.log("Fetcher - Response status:", response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Request failed:", {
        status: response.status,
        statusText: response.statusText,
        url,
        error: errorText,
      })
      
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: errorText || "Unknown error" }
      }
      
      throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("Fetcher - Success, data received:", {
      url,
      hasProducts: !!data.products,
      productsCount: data.products?.length || 0,
      hasCategories: !!data.categories,
      categoriesCount: data.categories?.length || 0,
    })
    
    return data
  } catch (error) {
    console.error("Fetcher - Error:", error)
    throw error
  }
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: productsData, mutate } = useSWR(
    `/api/admin/products`,
    fetcher,
  )

  const { data: categoriesData } = useSWR("/api/admin/categories", fetcher)

  const products: Product[] = productsData?.products || []
  const categories: Category[] = categoriesData?.categories || []
  const pagination = productsData?.pagination

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
      await fetch(`/api/admin/products/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      })
      mutate()
      setDeleteId(null)
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  return (
    <AdminLayout title="Productos" description="Gestiona el catalogo de productos">
      <Card className="bg-card border-border">
        <CardContent className="p-4 sm:p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground top-1/2 -translate-y-1/2 " />
              <Input
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-10 bg-background h-10"
              />
            </div>
            <Select
                
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-48 bg-background h-10 min-h-10">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link href="/admin/products/create">
              <Button className="h-10 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Producto</TableHead>
                  <TableHead className="text-muted-foreground">Categoria</TableHead>
                  <TableHead className="text-muted-foreground">Precio Venta</TableHead>
                  <TableHead className="text-muted-foreground">Stock</TableHead>
                  <TableHead className="text-muted-foreground">Variaciones</TableHead>
                  <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              product.primary_image ||
                              (Array.isArray(product.images) && product.images.length > 0
                                ? typeof product.images[0] === "string"
                                  ? product.images[0]
                                  : (product.images[0] as any).image_url || (product.images[0] as any).image_path
                                : "/placeholder.svg?height=48&width=48&query=product")
                            }
                            alt={product.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{product.description?.slice(0, 50) + (product.description?.length && product.description?.length > 50 ? "..." : "") || ""}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {product.category?.name || product.category_name || "Sin categoría"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">${product.sale_price_usd.toFixed(2)} USD</p>
                        <p className="text-sm text-muted-foreground">₱{product.sale_price_cup.toFixed(2)} CUP</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.stock > 10
                            ? "bg-green-100 text-green-700"
                            : product.stock > 0
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock} unidades
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.variations.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          <Layers className="h-3 w-3" />
                          {product.variations.length} variaciones
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sin variaciones</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <div key={product.id} className="p-4 rounded-xl border border-border bg-background">
                <div className="flex gap-3">
                  <div className="h-16 w-16 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        product.primary_image ||
                        (Array.isArray(product.images) && product.images.length > 0
                          ? typeof product.images[0] === "string"
                            ? product.images[0]
                            : (product.images[0] as any).image_url || (product.images[0] as any).image_path
                          : "/placeholder.svg?height=64&width=64&query=product")
                      }
                      alt={product.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category?.name || product.category_name || "Sin categoría"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold text-primary">${product.sale_price_usd}</span>
                      <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  {product.variations.length > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                      <Layers className="h-3 w-3" />
                      {product.variations.length} variaciones
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin variaciones</span>
                  )}
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive/30 bg-transparent"
                      onClick={() => setDeleteId(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-foreground mb-1">No hay productos</h3>
              <p className="text-sm text-muted-foreground mb-4">Comienza agregando tu primer producto</p>
              <Link href="/admin/products/create">
                <Button className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Producto
                </Button>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Mostrando {pagination.from || products.length} - {pagination.to || products.length} de{" "}
                {pagination.total} productos
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Pagina {page} de {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Producto</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. El producto sera eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
