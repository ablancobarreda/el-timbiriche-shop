"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "María González",
    role: "Cliente Frecuente",
    avatar: "/latina-professional-headshot.png",
    content:
      "¡Me encanta El Timbiriche Shop! Siempre encuentro productos únicos y de excelente calidad. El envío es súper rápido y el servicio al cliente es increíble.",
    rating: 5,
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    role: "Comprador Verificado",
    avatar: "/latino-man-professional-headshot.png",
    content:
      "Los precios son muy competitivos y la variedad de productos es impresionante. Ya he hecho varias compras y todas han superado mis expectativas.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ana Martínez",
    role: "Cliente desde 2023",
    avatar: "/young-latina-woman-headshot-smiling.jpg",
    content:
      "La mejor tienda online que he encontrado. Los productos llegan muy bien empacados y siempre en perfecto estado. ¡Totalmente recomendada!",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Testimonios</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Miles de clientes satisfechos nos respaldan. Conoce sus experiencias con El Timbiriche Shop.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 md:p-8">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-foreground/90 leading-relaxed mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
