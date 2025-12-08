import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { StoreProvider } from "@/lib/store-context"
import { CartSidebar } from "@/components/cart-sidebar"
import { QuickViewModal } from "@/components/quick-view-modal"
import { SearchModal } from "@/components/search-modal"
import { ConditionalHeader } from "@/components/conditional-header"
import { ThemeEffects } from "@/components/theme-effects"
import { Suspense } from "react"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "El Timbiriche Shop - Tu Tienda de Productos Favoritos",
  description:
    "Descubre nuestra coleccion de productos unicos y de calidad. El Timbiriche Shop - donde encuentras todo lo que necesitas.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/images/logo.png", media: "(prefers-color-scheme: light)" },
      { url: "/images/logo.png", media: "(prefers-color-scheme: dark)" },
      { url: "/images/logo.png", type: "image/png" },
    ],
    apple: "/images/logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#f8b4c4",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} ${playfair.variable} font-sans antialiased`}>
        <StoreProvider>
          <Suspense fallback={null}>
            <ThemeEffects />
            <ConditionalHeader />
            {children}
            <CartSidebar />
            <QuickViewModal />
            <SearchModal />
          </Suspense>
        </StoreProvider>
        <Analytics />
      </body>
    </html>
  )
}
