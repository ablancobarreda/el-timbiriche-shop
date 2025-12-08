"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Menu, X, Search, User } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store-context"
import { CurrencySelector } from "@/components/currency-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeDecorations } from "@/components/theme-decorations"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { cartCount, setIsCartOpen, setIsSearchOpen } = useStore()

  // Avoid hydration mismatch by only showing cart count after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/full-logo.png"
              alt="El Timbiriche Shop"
              width={140}
              height={50}
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#categorias"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Categorias
            </Link>
            <Link
              href="/#productos"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Productos
            </Link>
            <Link
              href="/seguimiento"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Seguimiento
            </Link>
            <Link
              href="/#contacto"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Contacto
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <CurrencySelector />
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground/80 hover:text-primary"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/admin/login">
              <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground/80 hover:text-primary relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {isMounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <CurrencySelector />
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag className="h-5 w-5" />
              {isMounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link
                href="/#categorias"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorias
              </Link>
              <Link
                href="/#productos"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                href="/seguimiento"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Seguimiento
              </Link>
              <Link
                href="/#contacto"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/80 hover:text-primary"
                  onClick={() => {
                    setIsSearchOpen(true)
                    setIsMenuOpen(false)
                  }}
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Link href="/admin/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
