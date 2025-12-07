"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Truck, Shield, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store-context"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, cartTotal_usd, cartTotal_cup, formatPrice, formatCartTotal, currency, removeFromCart, updateQuantity, clearCart } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    notas: "",
  })

  // Calculate shipping costs in both currencies
  const shippingCost_usd = cartTotal_usd > 100 ? 0 : 15
  const shippingCost_cup = cartTotal_cup > 100 ? 0 : 15 * 350 // Assuming 350 CUP per USD
  const shippingCost = currency === "USD" ? shippingCost_usd : shippingCost_cup
  
  const total_usd = cartTotal_usd + shippingCost_usd
  const total_cup = cartTotal_cup + shippingCost_cup
  const total = currency === "USD" ? total_usd : total_cup

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate order creation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate order number
    const orderNumber = `TS-${Date.now().toString().slice(-8)}`

    // Clear cart and redirect to tracking
    clearCart()
    router.push(`/seguimiento?order=${orderNumber}`)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground mb-4">Tu carrito esta vacio</h1>
            <p className="text-muted-foreground mb-8">Agrega productos para continuar con tu pedido</p>
            <Link href="/">
              <Button className="rounded-full bg-primary text-primary-foreground">Explorar Productos</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      

      <main className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Finalizar Pedido</h1>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Informacion de Envio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                        className="mt-1 border-border focus:ring-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        required
                        className="mt-1 border-border focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-1 border-border focus:ring-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Telefono</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      required
                      className="mt-1 border-border focus:ring-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="direccion">Direccion</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      required
                      className="mt-1 border-border focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input
                        id="ciudad"
                        value={formData.ciudad}
                        onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                        required
                        className="mt-1 border-border focus:ring-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="provincia">Provincia</Label>
                      <Input
                        id="provincia"
                        value={formData.provincia}
                        onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                        required
                        className="mt-1 border-border focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notas">Notas del pedido (opcional)</Label>
                    <textarea
                      id="notas"
                      value={formData.notas}
                      onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Procesando..."
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Confirmar Pedido - {formatPrice(total_usd, total_cup)}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Pago seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Envio garantizado</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-border sticky top-4">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-secondary rounded-xl">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image src={item.image || "/images/logo.png"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-primary font-semibold">{formatPrice(item.price_usd, item.price_cup)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-auto text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envio</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        formatPrice(shippingCost_usd, shippingCost_cup)
                      )}
                    </span>
                  </div>
                  {(currency === "USD" ? cartTotal_usd : cartTotal_cup) < (currency === "USD" ? 100 : 35000) && (
                    <p className="text-xs text-muted-foreground">
                      Envio gratis en pedidos mayores a {formatPrice(100, 35000)}
                    </p>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total_usd, total_cup)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button
              variant="outline"
              className="w-full rounded-full border-primary/30 hover:bg-primary/5 bg-white mt-4"
              
            
                    onClick={() => router.push("/")}
                  >
                    <>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Continuar comprando en la tienda
                      </>
                  </Button>
          </div>

          
        </div>
      </main>
    </div>
  )
}
