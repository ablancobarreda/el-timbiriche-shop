import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, ShieldX } from "lucide-react"
import { Footer } from "@/components/footer"

export default function ForbiddenPage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent/20 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative mb-8">
              <div className="text-[200px] md:text-[280px] font-serif font-bold text-orange-500/10 leading-none select-none">
                403
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
                  <div className="h-16 w-16 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center">
                    <ShieldX className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Acceso Denegado</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              No tienes permisos para acceder a esta pagina. Si crees que esto es un error, por favor contacta a nuestro
              equipo de soporte.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Volver al Inicio
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent">
                <Link href="/admin/login">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Iniciar Sesion
                </Link>
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Necesitas ayuda? Contactanos en{" "}
                <a href="mailto:soporte@eltimbiricheshop.com" className="text-primary hover:underline">
                  soporte@eltimbiricheshop.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
