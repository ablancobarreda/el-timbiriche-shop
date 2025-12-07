export function LogoCloud() {
  const stores = [
    { name: "Temu", logo: "/temu-logo-text-pink.jpg" },
    { name: "SHEIN", logo: "/shein-logo-text-pink.jpg" },
    { name: "Amazon", logo: "/amazon-logo-text-pink.jpg" },
    { name: "eBay", logo: "/ebay-logo-text-pink.jpg" },
    { name: "AliExpress", logo: "/aliexpress-logo-text-pink.jpg" },
    { name: "Etsy", logo: "/etsy-logo-text-pink.jpg" },
    { name: "Mercado Libre", logo: "/mercado-libre-logo-text-pink.jpg" },
    { name: "The Home Depot", logo: "/the-home-depot-logo-text-pink.png" },
  ]

  // Duplicate for seamless infinite scroll
  const duplicatedStores = [...stores, ...stores, ...stores, ...stores, ...stores, ...stores, ...stores, ...stores]

  return (
    <section className="py-12 md:py-16 bg-card border-y border-border overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <p className="text-center text-sm text-muted-foreground uppercase tracking-wider">
          Compramos en las mejores tiendas del mundo
        </p>
      </div>

      <div className="relative">
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-card to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-card to-transparent z-10" />

        {/* Infinite scroll container */}
        <div className="flex animate-scroll">
          {duplicatedStores.map((store, index) => (
            <div
              key={`${store.name}-${index}`}
              className="flex-shrink-0 mx-8 md:mx-12 flex items-center justify-center"
            >
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl  transition-colors">
                <img
                  src={store.logo || "/placeholder.svg"}
                  alt={`${store.name} logo`}
                  className="h-12 md:h-18 w-auto object-contain grayscale hover:grayscale-0 transition-all  hover:opacity-100"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
