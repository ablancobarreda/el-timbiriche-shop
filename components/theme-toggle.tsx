"use client"

import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Snowflake, Percent, Sun, Heart, Sparkles } from "lucide-react"

export function ThemeToggle() {
  const { activeTheme, isThemeActive } = useStore()

  if (!isThemeActive) return null

  const getIcon = () => {
    switch (activeTheme) {
      case "navidad":
        return <Snowflake className="h-5 w-5 animate-spin-slow" />
      case "black-friday":
        return <Percent className="h-5 w-5" />
      case "verano":
        return <Sun className="h-5 w-5" />
      case "san-valentin":
        return <Heart className="h-5 w-5" />
      default:
        return <Sparkles className="h-5 w-5" />
    }
  }

  const getColors = () => {
    switch (activeTheme) {
      case "navidad":
        return "text-red-500 hover:text-red-600 hover:bg-red-50"
      case "black-friday":
        return "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
      case "verano":
        return "text-orange-500 hover:text-orange-600 hover:bg-orange-50"
      case "san-valentin":
        return "text-rose-500 hover:text-rose-600 hover:bg-rose-50"
      default:
        return "text-primary hover:text-primary/80"
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`relative transition-all duration-300 ${getColors()}`}
      title={`Tema activo: ${activeTheme}`}
    >
      {getIcon()}
      <span className="absolute -top-1 -right-1 w-2 h-2 bg-current rounded-full animate-pulse" />
    </Button>
  )
}
