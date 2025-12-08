"use client"

import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Package, CreditCard, Truck, RotateCcw, Shield, MessageCircle } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"

const faqCategories = [
  {
    icon: Package,
    title: "Pedidos",
    faqs: [
      {
        question: "Como puedo realizar un pedido?",
        answer:
          "Para realizar un pedido, simplemente navega por nuestro catalogo, agrega los productos que desees al carrito y procede al checkout. Completa tus datos de envio y pago, y listo. Recibiras un correo de confirmacion con los detalles de tu pedido.",
      },
      {
        question: "Puedo modificar mi pedido despues de realizarlo?",
        answer:
          "Si tu pedido aun no ha sido procesado, puedes contactarnos inmediatamente para solicitar cambios. Una vez que el pedido esta en preparacion o enviado, no es posible realizar modificaciones.",
      },
      {
        question: "Como puedo cancelar mi pedido?",
        answer:
          "Puedes cancelar tu pedido dentro de las primeras 2 horas despues de realizarlo, siempre que no haya sido procesado. Contacta a nuestro servicio al cliente para solicitar la cancelacion.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Pagos",
    faqs: [
      {
        question: "Que metodos de pago aceptan?",
        answer:
          "Aceptamos tarjetas de credito y debito (Visa, Mastercard, American Express), transferencias bancarias, y pagos en efectivo a traves de puntos de pago autorizados.",
      },
      {
        question: "Es seguro pagar en su sitio web?",
        answer:
          "Si, utilizamos encriptacion SSL de 256 bits y cumplimos con los estandares PCI DSS para garantizar la seguridad de tus datos de pago. Nunca almacenamos informacion sensible de tarjetas.",
      },
      {
        question: "Puedo pagar en diferentes monedas?",
        answer:
          "Si, ofrecemos la opcion de pagar en USD (dolares americanos) o CUP (pesos cubanos). Puedes seleccionar tu moneda preferida desde el selector en el encabezado del sitio.",
      },
    ],
  },
  {
    icon: Truck,
    title: "Envios",
    faqs: [
      {
        question: "Cuanto tiempo tarda el envio?",
        answer:
          "El tiempo de envio varia segun tu ubicacion. Envios nacionales: 3-7 dias habiles. Envios internacionales: 10-20 dias habiles. Recibirás un numero de seguimiento para rastrear tu paquete.",
      },
      {
        question: "Cual es el costo del envio?",
        answer:
          "El costo de envio se calcula automaticamente segun el peso del paquete y tu ubicacion. Ofrecemos envio gratis en pedidos mayores a $50 USD para envios nacionales.",
      },
      {
        question: "Hacen envios internacionales?",
        answer:
          "Si, realizamos envios a la mayoria de paises. Los tiempos y costos varian segun el destino. Consulta la disponibilidad y tarifas durante el proceso de checkout.",
      },
    ],
  },
  {
    icon: RotateCcw,
    title: "Devoluciones",
    faqs: [
      {
        question: "Cual es su politica de devoluciones?",
        answer:
          "Aceptamos devoluciones dentro de los 30 dias posteriores a la recepcion del producto. El producto debe estar sin usar, en su empaque original y con todas las etiquetas. Algunos productos (ropa interior, cosmeticos abiertos) no son elegibles para devolucion.",
      },
      {
        question: "Como inicio una devolucion?",
        answer:
          "Para iniciar una devolucion, ve a la seccion 'Mis Pedidos', selecciona el producto a devolver y sigue las instrucciones. Recibirás una etiqueta de envio y las instrucciones para el proceso.",
      },
      {
        question: "Cuanto tiempo tarda el reembolso?",
        answer:
          "Una vez recibido y procesado el producto devuelto, el reembolso se realizara en un plazo de 5-10 dias habiles al metodo de pago original.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Cuenta y Seguridad",
    faqs: [
      {
        question: "Como creo una cuenta?",
        answer:
          "Puedes crear una cuenta haciendo clic en el icono de usuario en el menu superior. Completa el formulario con tus datos y veras un correo de verificacion para activar tu cuenta.",
      },
      {
        question: "Olvide mi contrasena, que hago?",
        answer:
          "En la pagina de inicio de sesion, haz clic en 'Olvide mi contrasena'. Ingresa tu correo electronico y te enviaremos un enlace para restablecer tu contrasena.",
      },
      {
        question: "Como protegen mi informacion personal?",
        answer:
          "Utilizamos encriptacion de ultima generacion, servidores seguros y cumplimos con las regulaciones de proteccion de datos. Nunca compartimos tu informacion con terceros sin tu consentimiento.",
      },
    ],
  },
  {
    icon: MessageCircle,
    title: "Soporte",
    faqs: [
      {
        question: "Como puedo contactar al servicio al cliente?",
        answer:
          "Puedes contactarnos por email a hola@eltimbiricheshop.com, por telefono al +52 55 1234 5678, o a traves de nuestras redes sociales. Nuestro horario de atencion es de lunes a viernes de 9am a 6pm.",
      },
      {
        question: "Tienen chat en vivo?",
        answer:
          "Si, ofrecemos chat en vivo durante nuestro horario de atencion. Busca el icono de chat en la esquina inferior derecha de la pantalla.",
      },
      {
        question: "Cuanto tiempo tardan en responder?",
        answer:
          "Nos esforzamos por responder todas las consultas dentro de las 24 horas habiles. Para casos urgentes, te recomendamos llamarnos directamente.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.faqs.length > 0)

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Preguntas Frecuentes</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Encuentra respuestas rapidas a las preguntas mas comunes
              </p>

              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar en las preguntas frecuentes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-full border-border bg-card"
                />
              </div>
            </div>

            <div className="space-y-8">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="bg-card rounded-2xl border border-border p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <category.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">{category.title}</h2>
                    </div>

                    <Accordion type="single" collapsible className="space-y-2">
                      {category.faqs.map((faq, faqIndex) => (
                        <AccordionItem
                          key={faqIndex}
                          value={`${categoryIndex}-${faqIndex}`}
                          className="border border-border rounded-xl px-4 data-[state=open]:bg-secondary/50"
                        >
                          <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No se encontraron resultados para "{searchQuery}"</p>
                </div>
              )}
            </div>

            <div className="mt-12 text-center bg-primary/5 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-xl font-semibold text-foreground mb-2">No encontraste lo que buscabas?</h3>
              <p className="text-muted-foreground mb-4">Nuestro equipo de soporte esta listo para ayudarte</p>
              <a
                href="mailto:hola@eltimbiricheshop.com"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                Contactar Soporte
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
