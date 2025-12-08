"use client"

import { useStore } from "@/lib/store-context"

export function ThemeDecorations() {
  const { activeTheme, isThemeActive } = useStore()

  if (!isThemeActive) return null

  // Christmas lights
  if (activeTheme === "navidad") {
    const lights = Array.from({ length: 20 }, (_, i) => i)
    return (
      <div className="absolute top-0 left-0 right-0 h-6 overflow-hidden pointer-events-none">
        <div className="flex justify-between items-start px-2">
          {lights.map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-px h-2 bg-foreground/20" />
              <div
                className={`w-3 h-4 rounded-full animate-christmas-light ${
                  i % 4 === 0
                    ? "bg-red-400 shadow-red-400/50"
                    : i % 4 === 1
                      ? "bg-green-400 shadow-green-400/50"
                      : i % 4 === 2
                        ? "bg-yellow-400 shadow-yellow-400/50"
                        : "bg-blue-400 shadow-blue-400/50"
                }`}
                style={{ animationDelay: `${i * 0.2}s`, boxShadow: `0 0 8px currentColor` }}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Black Friday banner stripe
  if (activeTheme === "black-friday") {
    return (
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 animate-shimmer" />
    )
  }

  // Summer wave
  if (activeTheme === "verano") {
    return (
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-cyan-400 to-orange-400 animate-shimmer" />
    )
  }

  // Valentine hearts
  if (activeTheme === "san-valentin") {
    const hearts = Array.from({ length: 10 }, (_, i) => i)
    return (
      <div className="absolute top-0 left-0 right-0 h-6 overflow-hidden pointer-events-none flex justify-around items-center">
        {hearts.map((i) => (
          <div key={i} className="animate-bounce-soft" style={{ animationDelay: `${i * 0.3}s` }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-rose-400/60">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}
      </div>
    )
  }

  return null
}
