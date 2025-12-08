import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-8">Terminos y Condiciones</h1>
            <p className="text-muted-foreground mb-8">Ultima actualizacion: 7 de Diciembre de 2025</p>

            <div className="prose prose-pink max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceptacion de los Terminos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Al acceder y utilizar El Timbiriche Shop, usted acepta estar sujeto a estos terminos y condiciones de
                  uso. Si no esta de acuerdo con alguna parte de estos terminos, le rogamos que no utilice nuestro sitio
                  web ni nuestros servicios.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Uso del Sitio</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  El uso de este sitio web esta sujeto a las siguientes condiciones:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Debe tener al menos 18 anos de edad para realizar compras.</li>
                  <li>La informacion proporcionada debe ser veraz y actualizada.</li>
                  <li>No esta permitido el uso del sitio para fines ilegales o no autorizados.</li>
                  <li>No debe intentar acceder a areas restringidas del sitio.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Productos y Precios</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nos esforzamos por mostrar con precision las descripciones y precios de nuestros productos. Sin
                  embargo, no garantizamos que las descripciones de los productos u otro contenido del sitio sean
                  precisos, completos, confiables, actuales o libres de errores. Los precios estan sujetos a cambios sin
                  previo aviso.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Pedidos y Pagos</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">Al realizar un pedido, usted acepta:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Proporcionar informacion de pago valida y completa.</li>
                  <li>Que nos reservamos el derecho de rechazar cualquier pedido.</li>
                  <li>Que los precios mostrados son en la moneda seleccionada (USD o CUP).</li>
                  <li>Que el procesamiento del pago es seguro y encriptado.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Envios y Entregas</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Los tiempos de entrega son estimados y pueden variar segun la ubicacion y disponibilidad del producto.
                  No nos hacemos responsables por retrasos causados por terceros o circunstancias fuera de nuestro
                  control. El cliente es responsable de proporcionar una direccion de envio correcta.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Devoluciones y Reembolsos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Aceptamos devoluciones dentro de los 30 dias posteriores a la recepcion del producto, siempre que el
                  producto este en su estado original, sin usar y con todas las etiquetas. Los gastos de devolucion
                  corren por cuenta del cliente, excepto en casos de productos defectuosos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Propiedad Intelectual</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Todo el contenido de este sitio web, incluyendo pero no limitado a textos, graficos, logotipos,
                  iconos, imagenes y software, es propiedad de El Timbiriche Shop y esta protegido por las leyes de
                  propiedad intelectual aplicables.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitacion de Responsabilidad</h2>
                <p className="text-muted-foreground leading-relaxed">
                  El Timbiriche Shop no sera responsable por danos indirectos, incidentales, especiales o consecuentes
                  que resulten del uso o la imposibilidad de usar nuestros servicios o productos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Modificaciones</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nos reservamos el derecho de modificar estos terminos en cualquier momento. Las modificaciones
                  entraran en vigor inmediatamente despues de su publicacion en el sitio web. El uso continuado del
                  sitio despues de dichos cambios constituira su aceptacion de los mismos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contacto</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Si tiene preguntas sobre estos terminos y condiciones, puede contactarnos a traves de:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>Email: legal@eltimbiricheshop.com</li>
                  <li>Telefono: +52 55 1234 5678</li>
                  <li>Direccion: Av. Principal 123, Ciudad de Mexico, Mexico</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
