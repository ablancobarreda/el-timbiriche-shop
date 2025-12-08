"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Search, Package, Truck, CheckCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

interface OrderStatus {
  id: string
  status: "pending" | "confirmed" | "processing" | "completed" | "cancelled"
  date: string
  items: number
  total: string
  estimatedDelivery: string
  timeline: {
    title: string
    description: string
    date: string
    completed: boolean
    icon: React.ReactNode
  }[]
}

const mockOrder: OrderStatus = {
  id: "",
  status: "processing",
  date: "7 Diciembre, 2025",
  items: 3,
  total: "$549.97",
  estimatedDelivery: "12-15 Diciembre, 2025",
  timeline: [
    {
      title: "Pedido Recibido",
      description: "Tu pedido ha sido confirmado",
      date: "7 Dic, 10:30 AM",
      completed: true,
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      title: "En Preparacion",
      description: "Estamos preparando tu pedido",
      date: "7 Dic, 2:15 PM",
      completed: true,
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Enviado",
      description: "Tu pedido esta en camino",
      date: "8 Dic, 9:00 AM",
      completed: true,
      icon: <Truck className="h-5 w-5" />,
    },
    {
      title: "Entregado",
      description: "Pedido entregado exitosamente",
      date: "Estimado: 12-15 Dic",
      completed: false,
      icon: <MapPin className="h-5 w-5" />,
    },
  ],
}

export default function TrackingPage() {
  const searchParams = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const orderParam = searchParams.get("order")
    if (orderParam) {
      setTrackingNumber(orderParam)
      handleSearch(orderParam)
    }
  }, [searchParams])

  const handleSearch = async (number?: string) => {
    const searchNumber = number || trackingNumber
    if (!searchNumber) return

    setIsSearching(true)
    setSearched(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo, show order if starts with "TS-"
    if (searchNumber.startsWith("TS-")) {
      setOrder({ ...mockOrder, id: searchNumber })
    } else {
      setOrder(null)
    }

    setIsSearching(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "confirmed":
        return "text-blue-600 bg-blue-100"
      case "processing":
        return "text-purple-600 bg-purple-100"
      case "completed":
        return "text-green-600 bg-green-100"
      case "cancelled":
        return "text-red-600 bg-red-100"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "confirmed":
        return "Confirmado"
      case "processing":
        return "Procesando"
      case "completed":
        return "Completado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/">
              <Image
                src="/images/full-logo.png"
                alt="El Timbiriche Shop"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Seguimiento de Pedido</h1>
            <p className="text-muted-foreground">Ingresa tu numero de pedido para ver el estado de tu orden</p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
            className="flex gap-3 mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Ej: TS-12345678"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-primary/30 rounded-full"
              />
            </div>
            <Button
              type="submit"
              className="rounded-full bg-primary text-primary-foreground px-8"
              disabled={isSearching || !trackingNumber}
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </form>

          {/* Results */}
          {isSearching && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Buscando tu pedido...</p>
            </div>
          )}

          {!isSearching && searched && !order && (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Pedido no encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  No pudimos encontrar un pedido con el numero "{trackingNumber}"
                </p>
                <p className="text-sm text-muted-foreground">
                  Verifica que el numero sea correcto e intenta nuevamente
                </p>
              </CardContent>
            </Card>
          )}

          {!isSearching && order && (
            <div className="space-y-6">
              {/* Order Info */}
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Numero de Pedido</p>
                      <p className="font-semibold text-lg text-foreground">{order.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Fecha</p>
                      <p className="font-medium text-foreground">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Productos</p>
                      <p className="font-medium text-foreground">{order.items} items</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-medium text-primary">{order.total}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Entrega Estimada</p>
                      <p className="font-medium text-foreground">{order.estimatedDelivery}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-6">Estado del Envio</h3>
                  <div className="space-y-0">
                    {order.timeline.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              step.completed
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {step.icon}
                          </div>
                          {index < order.timeline.length - 1 && (
                            <div className={`w-0.5 h-16 ${step.completed ? "bg-primary" : "bg-border"}`} />
                          )}
                        </div>
                        <div className="pb-8">
                          <h4 className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-primary/30 hover:bg-primary/5 bg-transparent"
                  >
                    Seguir Comprando
                  </Button>
                </Link>
                <Button className="flex-1 rounded-full bg-primary text-primary-foreground">Contactar Soporte</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
