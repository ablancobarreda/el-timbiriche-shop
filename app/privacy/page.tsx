import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-8">Politica de Privacidad</h1>
            <p className="text-muted-foreground mb-8">Ultima actualizacion: 7 de Diciembre de 2025</p>

            <div className="prose prose-pink max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Informacion que Recopilamos</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  En El Timbiriche Shop, recopilamos la siguiente informacion:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>
                    <strong>Informacion personal:</strong> nombre, direccion de correo electronico, numero de telefono,
                    direccion de envio.
                  </li>
                  <li>
                    <strong>Informacion de pago:</strong> datos de tarjeta de credito/debito (procesados de forma
                    segura).
                  </li>
                  <li>
                    <strong>Informacion de navegacion:</strong> direccion IP, tipo de navegador, paginas visitadas.
                  </li>
                  <li>
                    <strong>Preferencias:</strong> moneda seleccionada, productos guardados, historial de pedidos.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Uso de la Informacion</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">Utilizamos su informacion para:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Procesar y gestionar sus pedidos.</li>
                  <li>Enviar actualizaciones sobre el estado de su pedido.</li>
                  <li>Mejorar nuestros productos y servicios.</li>
                  <li>Enviar comunicaciones de marketing (con su consentimiento).</li>
                  <li>Prevenir fraudes y garantizar la seguridad.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Proteccion de Datos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Implementamos medidas de seguridad tecnicas y organizativas para proteger su informacion personal
                  contra acceso no autorizado, alteracion, divulgacion o destruccion. Utilizamos encriptacion SSL para
                  todas las transacciones y almacenamos los datos en servidores seguros.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">Utilizamos cookies para:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Mantener su sesion activa mientras navega.</li>
                  <li>Recordar sus preferencias de idioma y moneda.</li>
                  <li>Analizar el trafico del sitio web.</li>
                  <li>Personalizar su experiencia de compra.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del
                  sitio.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Compartir Informacion</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  No vendemos su informacion personal. Podemos compartir datos con:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Proveedores de servicios de pago para procesar transacciones.</li>
                  <li>Empresas de logistica para realizar envios.</li>
                  <li>Autoridades legales cuando sea requerido por ley.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Sus Derechos</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">Usted tiene derecho a:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Acceder a su informacion personal.</li>
                  <li>Rectificar datos inexactos.</li>
                  <li>Solicitar la eliminacion de sus datos.</li>
                  <li>Oponerse al procesamiento de sus datos.</li>
                  <li>Solicitar la portabilidad de sus datos.</li>
                  <li>Retirar su consentimiento en cualquier momento.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Retencion de Datos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Conservamos su informacion personal durante el tiempo necesario para cumplir con los fines descritos
                  en esta politica, a menos que la ley exija o permita un periodo de retencion mas largo.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Menores de Edad</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nuestros servicios no estan dirigidos a menores de 18 anos. No recopilamos intencionalmente
                  informacion de menores. Si descubrimos que hemos recopilado informacion de un menor, la eliminaremos
                  de inmediato.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Cambios en la Politica</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos actualizar esta politica periodicamente. Le notificaremos cualquier cambio significativo a
                  traves de nuestro sitio web o por correo electronico. Le recomendamos revisar esta politica
                  regularmente.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contacto</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Para ejercer sus derechos o realizar consultas sobre privacidad:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>Email: privacidad@eltimbiricheshop.com</li>
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
