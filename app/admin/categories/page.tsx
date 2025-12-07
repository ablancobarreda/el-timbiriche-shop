"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import useSWR from "swr"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, FolderTree, Upload, GripVertical, X } from "lucide-react"
import type { Category } from "@/lib/admin-types"

const fetcher = (url: string) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
  return fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  }).then((res) => res.json())
}

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
    order: 0,
    image_url: "",
    thumbnail_url: "",
    active_products_count: 0,

  })

  const { data, mutate } = useSWR(`/api/admin/categories?search=${search}`, fetcher)

  const categories: Category[] = data?.categories || []

  const resetForm = () => {
    setFormData({ name: "", description: "", is_active: true, order: 0, image_url: "", thumbnail_url: "", active_products_count: 0 })
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleOpenCreate = () => {
    resetForm()
    setIsCreateOpen(true)
  }

  const handleOpenEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      is_active: category.is_active ?? true,
      order: category.order || 0,
      image_url: category.image_url || "",
      thumbnail_url: category.thumbnail_url || "",
      active_products_count: category.active_products_count || 0,
    })
    setImagePreview(category.image_url || "")
    setImageFile(null)
    setEditCategory(category)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description || "")
      formDataToSend.append("is_active", formData.is_active ? "1" : "0")
      formDataToSend.append("order", formData.order.toString())

      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        alert(errorData.error || "Error al crear la categoría")
        setIsLoading(false)
        return
      }

      mutate()
      setIsLoading(false)
      setIsCreateOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating category:", error)
      alert("Error al crear la categoría")
      setIsLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editCategory) return
    setIsLoading(true)

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
      if (!token) {
        alert("No estás autenticado. Por favor, inicia sesión.")
        setIsLoading(false)
        return
      }

      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description || "")
      formDataToSend.append("is_active", formData.is_active ? "1" : "0")
      formDataToSend.append("order", formData.order.toString())

      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }

      console.log("Updating category:", {
        id: editCategory.id,
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active,
        order: formData.order,
        hasImage: !!imageFile,
      })

      const response = await fetch(`/api/admin/categories/${editCategory.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type header, let browser set it with boundary for FormData
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error updating category:", errorData)
        const errorMessage =
          errorData.errors && typeof errorData.errors === "object"
            ? Object.values(errorData.errors).flat().join(", ")
            : errorData.error || errorData.message || "Error al actualizar la categoría"
        alert(errorMessage)
        setIsLoading(false)
        return
      }

      const result = await response.json()
      console.log("Category updated successfully:", result)

      mutate()
      setIsLoading(false)
      setEditCategory(null)
      resetForm()
    } catch (error) {
      console.error("Error updating category:", error)
      alert("Error al actualizar la categoría")
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    // Find the category to check if it has active products
    const categoryToDelete = categories.find((cat) => cat.id === deleteId)

    if (categoryToDelete && categoryToDelete.active_products_count && categoryToDelete.active_products_count > 0) {
      alert(
        `No se puede eliminar la categoría "${categoryToDelete.name}" porque tiene ${categoryToDelete.active_products_count} producto(s) activo(s). Por favor, elimina o mueve los productos antes de eliminar la categoría.`,
      )
      setDeleteId(null)
      return
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.")
      setDeleteId(null)
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        alert(errorData.error || "Error al eliminar la categoría")
        setDeleteId(null)
        return
      }

      mutate()
      setDeleteId(null)
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Error al eliminar la categoría")
      setDeleteId(null)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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

    setImageFile(file)
    // Create preview URL
    const preview = URL.createObjectURL(file)
    setImagePreview(preview)
  }

  const handleAddImage = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <AdminLayout title="Categorias" description="Gestiona las categorias de productos">
      <Card className="bg-card border-border">
        <CardContent className="p-4 sm:p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar categorias..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background h-10"
              />
            </div>
            <Button
              onClick={handleOpenCreate}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 h-10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoria
            </Button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground w-12">Orden</TableHead>
                  <TableHead className="text-muted-foreground">Categoria</TableHead>
                  <TableHead className="text-muted-foreground">Productos Activos</TableHead>
                  <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {<pre>{JSON.stringify(categories, null, 2)}</pre>} */}
                {categories.map((category) => (
                  <TableRow key={category.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <span className="text-muted-foreground">{category.order}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                          <Image
                            src={category.image_url || "/images/logo-placeholder.png"}
                            alt={category.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{category.name}</p>
                          <p className="text-sm text-muted-foreground">{category.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {category.active_products_count || 0} productos
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(category.id)}
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
            {categories.map((category) => (
              <div key={category.id} className="p-4 rounded-xl border border-border bg-background">
                <div className="flex gap-3">
                  <div className="h-16 w-16 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                    <Image
                      src={category.image_url || "/placeholder.svg"}
                      alt={category.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{category.name}</p>
                    <p className="text-sm text-muted-foreground">{category.active_products_count || 0} productos</p>
                    <p className="text-xs text-muted-foreground">Orden: {category.order}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(category)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 bg-transparent"
                    onClick={() => setDeleteId(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {categories.length === 0 && (
            <div className="text-center py-12">
              <FolderTree className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-foreground mb-1">No hay categorias</h3>
              <p className="text-sm text-muted-foreground mb-4">Comienza creando tu primera categoria</p>
              <Button onClick={handleOpenCreate} className="bg-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Crear Categoria
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Nueva Categoria</DialogTitle>
            <DialogDescription>Crea una nueva categoria para organizar tus productos</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Nombre *</Label>
                <Input
                  id="create-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Accesorios"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-description">Descripción</Label>
                <Textarea
                  id="create-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ej: Vestidos, blusas, pantalones y más"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Imagen</Label>
                <div className="flex gap-4 items-center">
                  {imagePreview ? (
                    <div className="relative h-20 w-20 rounded-lg bg-secondary overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-secondary flex items-center justify-center">
                      <FolderTree className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={handleAddImage}>
                      <Upload className="h-4 w-4 mr-2" />
                      {imagePreview ? "Cambiar Imagen" : "Subir Imagen"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-order">Orden</Label>
                <Input
                  id="create-order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
                  className="max-w-24"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="create-is-active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="create-is-active" className="cursor-pointer">
                  Categoría activa
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground" disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear Categoria"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editCategory} onOpenChange={() => setEditCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Editar Categoria</DialogTitle>
            <DialogDescription>Modifica los datos de la categoria</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Accesorios"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ej: Vestidos, blusas, pantalones y más"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Imagen</Label>
                <div className="flex gap-4 items-center">
                  {imagePreview ? (
                    <div className="relative h-20 w-20 rounded-lg bg-secondary overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-secondary flex items-center justify-center">
                      <FolderTree className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={handleAddImage}>
                      <Upload className="h-4 w-4 mr-2" />
                      {imagePreview ? "Cambiar Imagen" : "Subir Imagen"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-order">Orden</Label>
                <Input
                  id="edit-order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
                  className="max-w-24"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-is-active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-is-active" className="cursor-pointer">
                  Categoría activa
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditCategory(null)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteId && (() => {
                const categoryToDelete = categories.find((cat) => cat.id === deleteId)
                const hasActiveProducts = categoryToDelete?.active_products_count && categoryToDelete.active_products_count > 0
                
                if (hasActiveProducts) {
                  return `No se puede eliminar la categoría "${categoryToDelete?.name}" porque tiene ${categoryToDelete.active_products_count} producto(s) activo(s). Por favor, elimina o mueve los productos antes de eliminar la categoría.`
                }
                
                return `Esta acción no se puede deshacer. Los productos de esta categoría quedarán sin categoría asignada.`
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            {deleteId && (() => {
              const categoryToDelete = categories.find((cat) => cat.id === deleteId)
              const hasActiveProducts = categoryToDelete?.active_products_count && categoryToDelete.active_products_count > 0
              
              if (!hasActiveProducts) {
                return (
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
                    Eliminar
                  </AlertDialogAction>
                )
              }
              
              return null
            })()}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
