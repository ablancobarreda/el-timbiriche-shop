"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store-context"

interface Particle {
  id: number
  left: number
  animationDuration: number
  animationDelay: number
  opacity: number
  size: number
  type: "primary" | "secondary" | "tertiary"
}

export function ThemeEffects() {
  const { activeTheme, isThemeActive } = useStore()
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!isThemeActive) {
      setParticles([])
      return
    }

    const newParticles: Particle[] = []
    const particleCount = activeTheme === "navidad" ? 50 : 30

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 8 + Math.random() * 12,
        animationDelay: Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.7,
        size: 8 + Math.random() * 16,
        type: Math.random() > 0.7 ? (Math.random() > 0.5 ? "secondary" : "tertiary") : "primary",
      })
    }
    setParticles(newParticles)
  }, [activeTheme, isThemeActive])

  if (!isThemeActive) return null

  const renderParticle = (particle: Particle) => {
    switch (activeTheme) {
      case "navidad":
        return particle.type === "primary" ? (
          <svg width={particle.size} height={particle.size} viewBox="0 0 24 24" fill="none" className="text-white/60">
            <path
              d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        ) : particle.type === "secondary" ? (
          <svg
            width={particle.size}
            height={particle.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-yellow-400/50"
          >
            <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
          </svg>
        ) : (
          <div className="rounded-full bg-red-400/40" style={{ width: particle.size / 2, height: particle.size / 2 }} />
        )

      case "black-friday":
        return (
          <div
            className={`rounded-full ${particle.type === "primary" ? "bg-yellow-400/30" : particle.type === "secondary" ? "bg-zinc-800/40" : "bg-yellow-500/20"}`}
            style={{ width: particle.size / 2, height: particle.size / 2 }}
          />
        )

      case "verano":
        return particle.type === "primary" ? (
          <svg
            width={particle.size}
            height={particle.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-orange-400/40"
          >
            <circle cx="12" cy="12" r="5" />
            <path
              d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <div
            className={`rounded-full ${particle.type === "secondary" ? "bg-cyan-400/30" : "bg-orange-300/25"}`}
            style={{ width: particle.size / 2, height: particle.size / 2 }}
          />
        )

      case "san-valentin":
        return particle.type === "primary" ? (
          <svg
            width={particle.size}
            height={particle.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-rose-400/50"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          <div
            className={`rounded-full ${particle.type === "secondary" ? "bg-pink-300/40" : "bg-rose-300/30"}`}
            style={{ width: particle.size / 2, height: particle.size / 2 }}
          />
        )

      default:
        return (
          <div className="rounded-full bg-primary/30" style={{ width: particle.size / 2, height: particle.size / 2 }} />
        )
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-snowfall"
          style={{
            left: `${particle.left}%`,
            animationDuration: `${particle.animationDuration}s`,
            animationDelay: `${particle.animationDelay}s`,
            opacity: particle.opacity,
          }}
        >
          {renderParticle(particle)}
        </div>
      ))}
    </div>
  )
}
