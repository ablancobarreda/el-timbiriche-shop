import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent/20 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative mb-8">
              <div className="text-[200px] md:text-[280px] font-serif font-bold text-primary/10 leading-none select-none">
                404
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
                  <div className="text-6xl mb-2">😢</div>
                </div>
              </div>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Pagina No Encontrada</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Lo sentimos, la pagina que buscas no existe o ha sido movida. Pero no te preocupes, tenemos muchos
              productos increibles esperandote.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Volver al Inicio
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent">
                <Link href="/#productos">
                  <Search className="mr-2 h-5 w-5" />
                  Ver Productos
                </Link>
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Enlaces utiles:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/#categorias" className="text-primary hover:underline">
                  Categorias
                </Link>
                <Link href="/seguimiento" className="text-primary hover:underline">
                  Seguir Pedido
                </Link>
                <Link href="/faq" className="text-primary hover:underline">
                  Preguntas Frecuentes
                </Link>
                <Link href="/#contacto" className="text-primary hover:underline">
                  Contacto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
