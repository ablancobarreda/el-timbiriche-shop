"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, ShoppingBag, Star, Heart, Gift, Truck, Shield } from "lucide-react"

export function HeroSection() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("productos")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToCategories = () => {
    const categoriesSection = document.getElementById("categorias")
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-accent/20 py-16 md:py-24 lg:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative circles */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 animate-float-slow" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-accent/30 animate-float-delayed" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-primary/10 animate-float" />

        {/* Floating icons */}
        <div className="absolute top-20 left-[10%] animate-float-delayed opacity-60">
          <div className="p-3 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border">
            <Heart className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="absolute top-40 right-[15%] animate-float opacity-60">
          <div className="p-3 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="absolute bottom-32 left-[20%] animate-float-slow opacity-60">
          <div className="p-3 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border">
            <Gift className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="absolute bottom-40 right-[25%] animate-float-delayed opacity-60 hidden lg:block">
          <div className="p-3 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border">
            <Star className="w-6 h-6 text-primary fill-primary" />
          </div>
        </div>

        {/* Sparkle dots */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-primary/40 animate-bounce-soft" />
        <div className="absolute top-1/2 left-1/4 w-3 h-3 rounded-full bg-accent animate-bounce-soft animation-delay-200" />
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-primary/60 animate-bounce-soft animation-delay-400" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-primary/40 animate-bounce-soft animation-delay-600" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6 border border-primary/20 animate-pulse-glow">
              <Sparkles className="w-4 h-4" />
              <span>Nueva Coleccion Disponible</span>
              <Sparkles className="w-4 h-4" />
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6 text-balance">
              Descubre productos{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">unicos</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-primary/30"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,6 Q25,0 50,6 T100,6"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="animate-shimmer"
                  />
                </svg>
              </span>{" "}
              para tu estilo
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up animation-delay-200">
              En El Timbiriche Shop encontraras una seleccion cuidadosa de productos de calidad que haran brillar cada
              momento de tu dia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 animate-fade-in-up animation-delay-400">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 group"
                onClick={scrollToProducts}
              >
                <ShoppingBag className="mr-2 h-5 w-5 group-hover:animate-bounce-soft" />
                Explorar Catalogo
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-primary/30 hover:bg-primary/5 bg-card/50 backdrop-blur-sm hover:border-primary transition-all duration-300"
                onClick={scrollToCategories}
              >
                Ver Categorias
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground animate-fade-in-up animation-delay-600">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Truck className="w-4 h-4 text-primary" />
                </div>
                <span>Envio Rapido</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <span>Compra Segura</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                </div>
                <span>+500 Clientes</span>
              </div>
            </div>
          </div>

          {/* Hero Image with floating elements */}
          <div className="relative animate-scale-in">
            {/* Main image container with glow effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-3xl animate-pulse-glow" />
              <div className="aspect-square relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-accent/50 to-primary/20 border-2 border-card shadow-2xl">
                <Image
                  src="/elegant-pastel-pink-shopping-bags-gift-boxes-produ.jpg"
                  alt="Coleccion de productos El Timbiriche Shop"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
              </div>
            </div>

            {/* Floating stat cards */}
            <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 animate-float">
              <div className="bg-card/95 backdrop-blur-md rounded-2xl p-4 md:p-5 shadow-xl border border-border hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                    <Gift className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-xl md:text-2xl text-foreground">+500</p>
                    <p className="text-sm text-muted-foreground">Productos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 animate-float-delayed">
              <div className="bg-card/95 backdrop-blur-md rounded-2xl p-4 md:p-5 shadow-xl border border-border hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                    <Star className="w-6 h-6 md:w-7 md:h-7 text-primary fill-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-xl md:text-2xl text-foreground">4.9/5</p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>
              </div>
            </div>

            {/* New floating card - Satisfied customers */}
            <div className="absolute top-1/2 -right-2 md:-right-8 transform -translate-y-1/2 animate-float-slow hidden md:block">
              <div className="bg-card/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-border hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-card flex items-center justify-center text-xs font-medium text-primary">
                      M
                    </div>
                    <div className="w-8 h-8 rounded-full bg-accent border-2 border-card flex items-center justify-center text-xs font-medium text-accent-foreground">
                      A
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/50 border-2 border-card flex items-center justify-center text-xs font-medium text-primary-foreground">
                      R
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Clientes Felices</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative ring */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-2 border-dashed border-primary/20 rounded-full animate-spin-slow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
