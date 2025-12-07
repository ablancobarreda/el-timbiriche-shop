"use client"

import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"
import { ArrowUpRight } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function CategoriesSection() {
  const { data: categories, isLoading } = useSWR("/api/categories", fetcher)

  return (
    <section id="categorias" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Explora</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Nuestras Categorías</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encuentra exactamente lo que buscas navegando por nuestras categorías cuidadosamente seleccionadas.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories?.map((category: { id: number; name: string; image_url: string; count: number }) => (
              <Link
                key={category.id}
                href={`/categoria/${category.id}`}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-secondary"
              >
                <Image
                  src={category.image_url || "/images/logo-placeholder.png"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-semibold text-card text-lg md:text-xl mb-1">{category.name}</h3>
                      <p className="text-card/80 text-sm">{category.count} productos</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-card/20 backdrop-blur flex items-center justify-center group-hover:bg-primary transition-colors">
                      <ArrowUpRight className="h-5 w-5 text-card" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
