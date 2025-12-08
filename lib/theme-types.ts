export type ThemeSlug = "default" | "navidad" | "black-friday" | "verano" | "san-valentin"

export interface ThemeResponse {
  data: {
    slug: ThemeSlug
  }
}

export interface ThemeConfig {
  slug: ThemeSlug
  name: string
  icon: string
  primaryColor: string
  accentColor: string
  badgeText: string
  heroTitle: string
  heroHighlight: string
  heroDescription: string
  ctaText: string
  floatingIcons: string[]
  particleType: "snowflake" | "heart" | "leaf" | "star" | "sparkle"
  decorations: boolean
}

export const themeConfigs: Record<ThemeSlug, ThemeConfig> = {
  default: {
    slug: "default",
    name: "Default",
    icon: "sparkles",
    primaryColor: "primary",
    accentColor: "accent",
    badgeText: "Nueva Coleccion Disponible",
    heroTitle: "Descubre productos",
    heroHighlight: "unicos",
    heroDescription:
      "En El Timbiriche Shop encontraras una seleccion cuidadosa de productos de calidad que haran brillar cada momento de tu dia.",
    ctaText: "Explorar Catalogo",
    floatingIcons: ["heart", "sparkles", "gift", "star"],
    particleType: "sparkle",
    decorations: false,
  },
  navidad: {
    slug: "navidad",
    name: "Navidad",
    icon: "tree-pine",
    primaryColor: "red-500",
    accentColor: "green-500",
    badgeText: "Ofertas Navidenas",
    heroTitle: "Regalos",
    heroHighlight: "perfectos",
    heroDescription:
      "Encuentra los regalos ideales para tus seres queridos. Ofertas especiales de temporada con envio rapido para que lleguen a tiempo.",
    ctaText: "Ver Regalos",
    floatingIcons: ["tree-pine", "gift", "star", "candy"],
    particleType: "snowflake",
    decorations: true,
  },
  "black-friday": {
    slug: "black-friday",
    name: "Black Friday",
    icon: "percent",
    primaryColor: "zinc-900",
    accentColor: "yellow-500",
    badgeText: "Black Friday - Hasta 70% OFF",
    heroTitle: "Ofertas",
    heroHighlight: "increibles",
    heroDescription:
      "Las mejores ofertas del ano estan aqui. Descuentos exclusivos por tiempo limitado. No te quedes sin tu producto favorito.",
    ctaText: "Ver Ofertas",
    floatingIcons: ["percent", "tag", "zap", "flame"],
    particleType: "sparkle",
    decorations: true,
  },
  verano: {
    slug: "verano",
    name: "Verano",
    icon: "sun",
    primaryColor: "orange-500",
    accentColor: "cyan-400",
    badgeText: "Ofertas de Verano",
    heroTitle: "Disfruta el",
    heroHighlight: "verano",
    heroDescription:
      "Preparate para la mejor temporada del ano con nuestra coleccion de verano. Productos frescos y coloridos para disfrutar al maximo.",
    ctaText: "Ver Coleccion",
    floatingIcons: ["sun", "umbrella", "waves", "palm-tree"],
    particleType: "leaf",
    decorations: true,
  },
  "san-valentin": {
    slug: "san-valentin",
    name: "San Valentin",
    icon: "heart",
    primaryColor: "rose-500",
    accentColor: "pink-300",
    badgeText: "Especial San Valentin",
    heroTitle: "Regalos con",
    heroHighlight: "amor",
    heroDescription:
      "Sorprende a esa persona especial con un regalo unico. Encuentra el detalle perfecto para expresar tu amor.",
    ctaText: "Ver Regalos",
    floatingIcons: ["heart", "gift", "sparkles", "flower"],
    particleType: "heart",
    decorations: true,
  },
}
