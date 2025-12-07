import type React from "react"
import { AdminAuthProvider } from "@/lib/admin-auth-context"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>
}

