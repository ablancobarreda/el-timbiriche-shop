"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import useSWR from "swr"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, Order, OrderStatus } from "@/lib/admin-types"

const STATUS_ICONS: Record<OrderStatus, React.ElementType> = {
    pending: Clock,
    confirmed: CheckCircle,
    processing: Package,
    completed: CheckCircle,
    cancelled: XCircle,
  }

const fetcher = async (url: string) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorData
    try {
      errorData = JSON.parse(errorText)
    } catch {
      errorData = { error: errorText || "Unknown error" }
    }

    throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`)
  }

  return response.json()
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateData, setUpdateData] = useState({
    status: "" as OrderStatus,
    tracking_number: "",
    notes: "",
  })

  const { data, mutate } = useSWR(
    `/api/admin/orders?search=${search}&status=${statusFilter}&page=${page}&limit=10`,
    fetcher,
  )

  const orders: Order[] = data?.orders || []
  const pagination = data?.pagination

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order)
    setUpdateData({
      status: order.status,
      tracking_number: order.tracking_number,
      notes: order.notes,
    })
  }

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return
    
    // Validate status
    if (!updateData.status) {
      alert("Por favor, selecciona un estado")
      return
    }

    setIsUpdating(true)

    try {
      // Update status using the correct endpoint
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("admin_token") : ""}`,
        },
        body: JSON.stringify({
          status: updateData.status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || "Error al actualizar el estado del pedido")
      }

      // Refresh the orders list
      await mutate()
      
      // Close dialog and reset
      setSelectedOrder(null)
      setUpdateData({
        status: "" as OrderStatus,
        tracking_number: "",
        notes: "",
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      alert(error instanceof Error ? error.message : "Error al actualizar el estado del pedido. Por favor, intenta de nuevo.")
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <AdminLayout title="Pedidos" description="Gestiona los pedidos de la tienda">
      <Card className="bg-card border-border">
        <CardContent className="p-4 sm:p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, cliente, email o tracking..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-10 bg-background h-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-48 bg-background h-10 min-h-10">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => (
                  <SelectItem key={status} value={status}>
                    {ORDER_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Pedido</TableHead>
                  <TableHead className="text-muted-foreground">Cliente</TableHead>
                  <TableHead className="text-muted-foreground">Total</TableHead>
                  <TableHead className="text-muted-foreground">Estado</TableHead>
                  <TableHead className="text-muted-foreground">Fecha</TableHead>
                  <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const StatusIcon = STATUS_ICONS[order.status] || Clock
                  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status
                  const statusColor = ORDER_STATUS_COLORS[order.status] || ORDER_STATUS_COLORS.pending
                  return (
                    <TableRow key={order.id} className="border-border">
                      <TableCell>
                        <p className="font-medium text-primary">{order.order_number}</p>
                        {order.tracking_number && (
                          <p className="text-xs text-muted-foreground">{order.tracking_number}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-foreground">
                          ${order.total} {order.currency}
                        </p>
                        <p className="text-xs text-muted-foreground">{order.items.length} productos</p>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusLabel}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenOrder(order)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => {
              const StatusIcon = STATUS_ICONS[order.status] || Clock
              const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status
              const statusColor = ORDER_STATUS_COLORS[order.status] || ORDER_STATUS_COLORS.pending
              return (
                <div key={order.id} className="p-4 rounded-xl border border-border bg-background">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-primary">{order.id}</p>
                      <p className="text-sm text-foreground">{order.customer_name}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{order.items.length} productos</span>
                    <span className="font-semibold text-foreground">
                      ${order.total} {order.currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">{formatDate(order.created_at)}</span>
                    <Button variant="outline" size="sm" onClick={() => handleOpenOrder(order)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-foreground mb-1">No hay pedidos</h3>
              <p className="text-sm text-muted-foreground">Los nuevos pedidos apareceran aqui</p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Mostrando {orders.length} de {pagination.total} pedidos
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
                  disabled={page === pagination.pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">Pedido {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Creado el {selectedOrder && formatDate(selectedOrder.created_at)}</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Customer Info */}
              <div className="p-4 rounded-xl bg-secondary">
                <h4 className="font-medium text-foreground mb-3">Informacion del Cliente</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {selectedOrder.customer_email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {selectedOrder.customer_phone}
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    {selectedOrder.shipping_address}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Productos</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item:any, index:any) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                      <div className="h-14 w-14 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image_url || "/images/logo-placeholder.png"}
                          alt={item.product_name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{item.product_name}</p>
                        {item.variation && <p className="text-xs text-muted-foreground">{item.variation}</p>}
                        <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-foreground">${item.price_usd * item.quantity}</p>
                      <p className="font-semibold text-foreground">${item.price_cup * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envio</span>
                    <span className="text-foreground">${selectedOrder.shipping}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">
                      ${selectedOrder.total} {selectedOrder.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="font-medium text-foreground">Actualizar Pedido</h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select
                      value={updateData.status}
                      onValueChange={(value) => setUpdateData({ ...updateData, status: value as OrderStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => (
                          <SelectItem key={status} value={status}>
                            {ORDER_STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Numero de Tracking</Label>
                    <Input
                      value={updateData.tracking_number}
                      onChange={(e) => setUpdateData({ ...updateData, tracking_number: e.target.value })}
                      placeholder="TRK-XXX-XXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notas Internas</Label>
                  <Textarea
                    value={updateData.notes}
                    onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                    placeholder="Notas sobre el pedido..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Cerrar
            </Button>
            <Button className="bg-primary text-primary-foreground" onClick={handleUpdateOrder} disabled={isUpdating}>
              {isUpdating ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
