"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  Settings,
  Bell,
  Menu,
} from "lucide-react"
import { useAdminAuth } from "@/lib/admin-auth-context"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, logout, isAuthenticated, isLoading } = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = async () => {
    await logout()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const stats = [
    {
      title: "Ventas Totales",
      value: "$12,450",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Pedidos",
      value: "156",
      change: "+8.2%",
      isPositive: true,
      icon: ShoppingCart,
    },
    {
      title: "Productos",
      value: "89",
      change: "+3",
      isPositive: true,
      icon: Package,
    },
    {
      title: "Clientes",
      value: "2,450",
      change: "+18.7%",
      isPositive: true,
      icon: Users,
    },
  ]

  const recentOrders = [
    { id: "ORD-001", customer: "Maria Garcia", total: "$125.00", status: "Completado", date: "Hoy" },
    { id: "ORD-002", customer: "Carlos Lopez", total: "$89.50", status: "En proceso", date: "Hoy" },
    { id: "ORD-003", customer: "Ana Martinez", total: "$245.00", status: "Pendiente", date: "Ayer" },
    { id: "ORD-004", customer: "Luis Rodriguez", total: "$67.00", status: "Completado", date: "Ayer" },
  ]

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard", active: true },
    { icon: Package, label: "Productos", href: "/admin/products", active: false },
    { icon: ShoppingCart, label: "Pedidos", href: "/admin/orders", active: false },
    { icon: Users, label: "Clientes", href: "/admin/customers", active: false },
    { icon: TrendingUp, label: "Analiticas", href: "/admin/analytics", active: false },
    { icon: Settings, label: "Configuracion", href: "/admin/settings", active: false },
  ]

  return (
    <div className="min-h-screen bg-secondary">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-border">
          <Image
            src="/images/full-logo.png"
            alt="El Timbiriche Shop"
            width={150}
            height={60}
            className="object-contain"
          />
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                item.active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors justify-start"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Bienvenido de vuelta, {user?.name || "Admin"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
            </Button>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold">{user?.name?.charAt(0).toUpperCase() || "A"}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span
                      className={`flex items-center gap-1 text-sm font-medium ${
                        stat.isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Orders */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif text-foreground">Pedidos Recientes</CardTitle>
              <CardDescription>Ultimos pedidos realizados en la tienda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cliente</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-4 text-sm font-medium text-primary">{order.id}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{order.customer}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{order.total}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === "Completado"
                                ? "bg-green-100 text-green-700"
                                : order.status === "En proceso"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
