"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"

export function ConditionalHeader() {
  const pathname = usePathname()
  
  // Hide header on admin routes
  if (pathname?.startsWith("/admin")) {
    return null
  }
  
  return <Header />
}

