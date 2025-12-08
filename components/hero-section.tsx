"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Star,
  Heart,
  Gift,
  Truck,
  Shield,
  TreePine,
  Candy,
  Percent,
  Tag,
  Zap,
  Flame,
  Sun,
  Umbrella,
  Waves,
} from "lucide-react"
import { useStore } from "@/lib/store-context"

export function HeroSection() {
  const { activeTheme, isThemeActive, themeConfig } = useStore()

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

  const getThemeColors = () => {
    switch (activeTheme) {
      case "navidad":
        return {
          badge: "bg-red-50 text-red-600 border-red-200",
          highlight: "text-red-500",
          highlightLine: "text-red-300",
          button: "bg-red-500 text-white hover:bg-red-600 hover:shadow-red-500/25",
          buttonOutline: "border-green-300 hover:bg-green-50 hover:border-green-400",
          glow: "bg-red-400/20",
          imageGradient: "bg-gradient-to-br from-red-50/50 to-green-50/20 border-red-200",
          trustIcon1: "bg-red-100",
          trustIcon2: "bg-green-100",
          trustIcon3: "bg-yellow-100",
          trustIconColor1: "text-red-500",
          trustIconColor2: "text-green-600",
          trustIconColor3: "text-yellow-500 fill-yellow-500",
        }
      case "black-friday":
        return {
          badge: "bg-zinc-900 text-yellow-400 border-zinc-700",
          highlight: "text-yellow-500",
          highlightLine: "text-yellow-400",
          button: "bg-zinc-900 text-yellow-400 hover:bg-zinc-800 hover:shadow-zinc-900/25",
          buttonOutline: "border-yellow-400 hover:bg-yellow-50 hover:border-yellow-500 text-zinc-900",
          glow: "bg-yellow-400/20",
          imageGradient: "bg-gradient-to-br from-zinc-100/50 to-yellow-50/20 border-zinc-300",
          trustIcon1: "bg-yellow-100",
          trustIcon2: "bg-zinc-100",
          trustIcon3: "bg-yellow-100",
          trustIconColor1: "text-yellow-600",
          trustIconColor2: "text-zinc-600",
          trustIconColor3: "text-yellow-500 fill-yellow-500",
        }
      case "verano":
        return {
          badge: "bg-orange-50 text-orange-600 border-orange-200",
          highlight: "text-orange-500",
          highlightLine: "text-orange-300",
          button: "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-orange-500/25",
          buttonOutline: "border-cyan-300 hover:bg-cyan-50 hover:border-cyan-400",
          glow: "bg-orange-400/20",
          imageGradient: "bg-gradient-to-br from-orange-50/50 to-cyan-50/20 border-orange-200",
          trustIcon1: "bg-orange-100",
          trustIcon2: "bg-cyan-100",
          trustIcon3: "bg-yellow-100",
          trustIconColor1: "text-orange-500",
          trustIconColor2: "text-cyan-600",
          trustIconColor3: "text-yellow-500 fill-yellow-500",
        }
      case "san-valentin":
        return {
          badge: "bg-rose-50 text-rose-600 border-rose-200",
          highlight: "text-rose-500",
          highlightLine: "text-rose-300",
          button: "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-rose-500/25",
          buttonOutline: "border-pink-300 hover:bg-pink-50 hover:border-pink-400",
          glow: "bg-rose-400/20",
          imageGradient: "bg-gradient-to-br from-rose-50/50 to-pink-50/20 border-rose-200",
          trustIcon1: "bg-rose-100",
          trustIcon2: "bg-pink-100",
          trustIcon3: "bg-rose-100",
          trustIconColor1: "text-rose-500",
          trustIconColor2: "text-pink-600",
          trustIconColor3: "text-rose-500 fill-rose-500",
        }
      default:
        return {
          badge: "bg-primary/10 text-primary border-primary/20",
          highlight: "text-primary",
          highlightLine: "text-primary/30",
          button: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25",
          buttonOutline: "border-primary/30 hover:bg-primary/5 hover:border-primary",
          glow: "bg-primary/20",
          imageGradient: "bg-gradient-to-br from-accent/50 to-primary/20 border-card",
          trustIcon1: "bg-primary/10",
          trustIcon2: "bg-primary/10",
          trustIcon3: "bg-primary/10",
          trustIconColor1: "text-primary",
          trustIconColor2: "text-primary",
          trustIconColor3: "text-primary fill-primary",
        }
    }
  }

  const colors = getThemeColors()

  const getFloatingIcon = (iconName: string, className: string) => {
    const iconProps = { className }
    switch (iconName) {
      case "heart":
        return <Heart {...iconProps} />
      case "sparkles":
        return <Sparkles {...iconProps} />
      case "gift":
        return <Gift {...iconProps} />
      case "star":
        return <Star {...iconProps} />
      case "tree-pine":
        return <TreePine {...iconProps} />
      case "candy":
        return <Candy {...iconProps} />
      case "percent":
        return <Percent {...iconProps} />
      case "tag":
        return <Tag {...iconProps} />
      case "zap":
        return <Zap {...iconProps} />
      case "flame":
        return <Flame {...iconProps} />
      case "sun":
        return <Sun {...iconProps} />
      case "umbrella":
        return <Umbrella {...iconProps} />
      case "waves":
        return <Waves {...iconProps} />
      default:
        return <Sparkles {...iconProps} />
    }
  }

  const getFloatingIconColor = (index: number) => {
    switch (activeTheme) {
      case "navidad":
        return index % 2 === 0 ? "text-red-500" : "text-green-600"
      case "black-friday":
        return index % 2 === 0 ? "text-yellow-500" : "text-zinc-800"
      case "verano":
        return index % 2 === 0 ? "text-orange-500" : "text-cyan-500"
      case "san-valentin":
        return index % 2 === 0 ? "text-rose-500" : "text-pink-400"
      default:
        return "text-primary"
    }
  }

  const floatingIcons = themeConfig.floatingIcons

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-accent/20 py-16 md:py-24 lg:py-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 animate-float-slow" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-accent/30 animate-float-delayed" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-primary/10 animate-float" />

        {/* Dynamic floating icons */}
        <div className="absolute top-20 left-[10%] animate-float-delayed opacity-70">
          <div className={`p-3 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border`}>
            {getFloatingIcon(floatingIcons[0], `w-6 h-6 ${getFloatingIconColor(0)}`)}
          </div>
        </div>
        <div className="absolute top-40 right-[15%] animate-float opacity-70">
          <div className={`p-3 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border`}>
            {getFloatingIcon(floatingIcons[1], `w-6 h-6 ${getFloatingIconColor(1)}`)}
          </div>
        </div>
        <div className="absolute bottom-32 left-[20%] animate-float-slow opacity-70">
          <div className={`p-3 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border`}>
            {getFloatingIcon(floatingIcons[2], `w-6 h-6 ${getFloatingIconColor(2)}`)}
          </div>
        </div>
        <div className="absolute bottom-40 right-[25%] animate-float-delayed opacity-70 hidden lg:block">
          <div className={`p-3 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border`}>
            {getFloatingIcon(floatingIcons[3], `w-6 h-6 ${getFloatingIconColor(3)}`)}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left animate-fade-in-up">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full mb-6 border animate-pulse-glow ${colors.badge}`}
            >
              {getFloatingIcon(themeConfig.icon, "w-4 h-4")}
              <span>{themeConfig.badgeText}</span>
              {getFloatingIcon(themeConfig.icon, "w-4 h-4")}
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6 text-balance">
              {themeConfig.heroTitle}{" "}
              <span className="relative inline-block">
                <span className={`relative z-10 ${colors.highlight}`}>{themeConfig.heroHighlight}</span>
                <svg
                  className={`absolute -bottom-2 left-0 w-full h-3 ${colors.highlightLine}`}
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
              </span>
              {activeTheme === "navidad" && " para esta Navidad"}
              {activeTheme === "default" && " para tu estilo"}
              {activeTheme === "black-friday" && " solo por hoy"}
              {activeTheme === "verano" && " con estilo"}
              {activeTheme === "san-valentin" && " este San Valentin"}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up animation-delay-200">
              {themeConfig.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 animate-fade-in-up animation-delay-400">
              <Button
                size="lg"
                className={`rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300 group ${colors.button}`}
                onClick={scrollToProducts}
              >
                <ShoppingBag className="mr-2 h-5 w-5 group-hover:animate-bounce-soft" />
                {themeConfig.ctaText}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={`rounded-full px-8 bg-card/50 backdrop-blur-sm transition-all duration-300 ${colors.buttonOutline}`}
                onClick={scrollToCategories}
              >
                Ver Categorias
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground animate-fade-in-up animation-delay-600">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${colors.trustIcon1}`}>
                  <Truck className={`w-4 h-4 ${colors.trustIconColor1}`} />
                </div>
                <span>Envio Rapido</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${colors.trustIcon2}`}>
                  <Shield className={`w-4 h-4 ${colors.trustIconColor2}`} />
                </div>
                <span>Compra Segura</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${colors.trustIcon3}`}>
                  <Star className={`w-4 h-4 ${colors.trustIconColor3}`} />
                </div>
                <span>+500 Clientes</span>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="relative">
              <div className={`absolute inset-0 rounded-[2.5rem] blur-3xl animate-pulse-glow ${colors.glow}`} />
              <div
                className={`aspect-square relative rounded-[2.5rem] overflow-hidden border-2 shadow-2xl ${colors.imageGradient}`}
              >
                <Image
                  src="/elegant-pastel-pink-shopping-bags-gift-boxes-produ.jpg"
                  alt="Coleccion de productos El Timbiriche Shop"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent from-primary/10`} />
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 animate-float">
              <div
                className={`backdrop-blur-md rounded-2xl p-4 md:p-5 shadow-xl border border-border bg-card/95 hover:shadow-2xl hover:scale-105 transition-all duration-300`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent`}
                  >
                    <Gift className={`w-6 h-6 md:w-7 md:h-7 ${colors.trustIconColor1}`} />
                  </div>
                  <div>
                    <p className="font-bold text-xl md:text-2xl text-foreground">+500</p>
                    <p className="text-sm text-muted-foreground">Productos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 animate-float-delayed">
              <div
                className={`backdrop-blur-md rounded-2xl p-4 md:p-5 shadow-xl border border-border bg-card/95 hover:shadow-2xl hover:scale-105 transition-all duration-300`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent`}
                  >
                    <Star className={`w-6 h-6 md:w-7 md:h-7 ${colors.trustIconColor3}`} />
                  </div>
                  <div>
                    <p className="font-bold text-xl md:text-2xl text-foreground">4.9/5</p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-2 md:-right-8 transform -translate-y-1/2 animate-float-slow hidden md:block">
              <div
                className={`backdrop-blur-md rounded-2xl p-4 shadow-xl border border-border bg-card/95 hover:shadow-2xl hover:scale-105 transition-all duration-300`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-xs font-medium bg-primary/30 text-primary">
                      M
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-xs font-medium bg-accent text-accent-foreground">
                      A
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-xs font-medium bg-primary/50 text-primary-foreground">
                      R
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Clientes Felices</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${colors.trustIconColor3}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 -z-10">
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-2 border-dashed rounded-full animate-spin-slow border-primary/20`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
