"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Sparkles } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setEmail("")
    }
  }

  return (
    <section className="py-16 md:py-24 bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Únete a Nuestra Newsletter</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Suscríbete para recibir las últimas novedades, ofertas exclusivas y un 10% de descuento en tu primera
            compra.
          </p>

          {isSubmitted ? (
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">¡Gracias por suscribirte!</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Revisa tu correo para confirmar tu suscripción y obtener tu código de descuento.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full px-6 h-12 bg-card border-border focus:border-primary"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90 h-12"
              >
                Suscribirse
              </Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            Al suscribirte, aceptas recibir comunicaciones de marketing. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  )
}
