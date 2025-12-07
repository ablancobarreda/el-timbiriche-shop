import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer id="contacto" className="bg-foreground text-card py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/images/full-logo.png"
              alt="El Timbiriche Shop"
              width={160}
              height={60}
              className="h-22 w-44 mb-4 "
            />
            <p className="text-card/70 text-sm leading-relaxed mb-6">
              Tu tienda favorita de productos únicos y de calidad. Descubre una experiencia de compra excepcional.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-card/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-card/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-card/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-card/70 hover:text-primary transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#categorias" className="text-card/70 hover:text-primary transition-colors text-sm">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="#productos" className="text-card/70 hover:text-primary transition-colors text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-card/70 hover:text-primary transition-colors text-sm">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="#" className="text-card/70 hover:text-primary transition-colors text-sm">
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Atención al Cliente</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-card/70 hover:text-primary transition-colors text-sm">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="#" className="text-card/70 hover:text-primary transition-colors text-sm">
                  Seguir mi Pedido
                </Link>
              </li>
              <li>
                <Link href="#" className="text-card/70 hover:text-primary transition-colors text-sm">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-card/70 hover:text-primary transition-colors text-sm">
                  Políticas de Envío
                </Link>
              </li>
              <li>
                <Link href="#" className="text-card/70 hover:text-primary transition-colors text-sm">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-card/70 text-sm">Figueredo #411 entre 26 de Julio y Manuel Pedreira. Bayamo, Granma, Cuba</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-card/70 text-sm">+53 58583728</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-card/70 text-sm">info@eltimbiriche.shop</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-card/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-card/50 text-sm">© 2025 El Timbiriche Shop. Todos los derechos reservados.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-card/50 hover:text-primary transition-colors text-sm">
                Términos y Condiciones
              </Link>
              <Link href="#" className="text-card/50 hover:text-primary transition-colors text-sm">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
