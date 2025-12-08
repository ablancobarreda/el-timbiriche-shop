"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, RotateCcw, AlertTriangle } from "lucide-react"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent/20 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative mb-8">
            <div className="text-[200px] md:text-[280px] font-serif font-bold text-destructive/10 leading-none select-none">
              500
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-card rounded-3xl p-8 shadow-2xl border border-border">
                <Image
                  src="/images/full-logo.png"
                  alt="El Timbiriche Shop"
                  width={120}
                  height={45}
                  className="mx-auto mb-4 opacity-50"
                />
                <div className="h-16 w-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </div>
            </div>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Error del Servidor</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Algo salio mal en nuestro servidor. Nuestro equipo ha sido notificado y estamos trabajando para
            solucionarlo. Por favor, intenta de nuevo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={reset} size="lg" className="rounded-full">
              <RotateCcw className="mr-2 h-5 w-5" />
              Intentar de Nuevo
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Volver al Inicio
              </Link>
            </Button>
          </div>

          {error.digest && <p className="mt-8 text-xs text-muted-foreground">Codigo de error: {error.digest}</p>}
        </div>
      </div>
    </main>
  )
}
