"use client"

import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store-context"

export function CartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartCount, formatPrice, formatCartTotal } =
    useStore()

  if (!isCartOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-foreground/50 z-50 transition-opacity" onClick={() => setIsCartOpen(false)} />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-card z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg font-semibold text-foreground">Tu Carrito ({cartCount})</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="hover:bg-secondary">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-2">Tu carrito esta vacio</p>
              <p className="text-sm text-muted-foreground/70 mb-6">Agrega productos para comenzar tu pedido</p>
              <Button onClick={() => setIsCartOpen(false)} className="rounded-full bg-primary text-primary-foreground">
                Explorar Productos
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const itemPrice_usd = item.selectedVariation?.effective_sale_price_usd ?? item.price_usd
                const itemPrice_cup = item.selectedVariation?.effective_sale_price_cup ?? item.price_cup
                const itemKey = item.selectedVariation ? `${item.id}-${item.selectedVariation.id}` : item.id.toString()
                
                return (
                  <div key={itemKey} className="flex gap-4 p-3 bg-secondary rounded-xl">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image || "/images/logo.png"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-1">{item.name}</h3>
                      {item.selectedVariation && (
                        <p className="text-xs text-primary font-medium mb-1">
                          Variación: {item.selectedVariation.name}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
                      <p className="font-semibold text-primary text-sm">{formatPrice(itemPrice_usd, itemPrice_cup)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id, item.selectedVariation?.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-1 bg-card rounded-full p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariation?.id)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariation?.id)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">{formatCartTotal()}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">Envio calculado en el checkout</p>
            <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
              <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                Hacer Pedido
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full rounded-full border-primary/30 hover:bg-primary/5 bg-transparent"
              onClick={() => setIsCartOpen(false)}
            >
              Seguir Comprando
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
