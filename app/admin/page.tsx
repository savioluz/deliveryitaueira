"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, ShoppingBag, Settings, TrendingUp, Clock, CheckCircle, LogOut } from "lucide-react"
import { ProductManager } from "@/components/admin/product-manager"
import { OrderManager } from "@/components/admin/order-manager"
import { StoreSettings } from "@/components/admin/store-settings"
import { Analytics } from "@/components/admin/analytics"
import { BackupManager } from "@/components/admin/backup-manager"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedStore, setSelectedStore] = useState<"burger" | "sushi">("burger")
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem("admin-auth")
    if (auth === "authenticated") {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      // Load orders for selected store
      const savedOrders = JSON.parse(localStorage.getItem(`orders_${selectedStore}`) || "[]")
      setOrders(savedOrders)
    }
  }, [isAuthenticated, selectedStore])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (loginForm.username === "savio" && loginForm.password === "147258") {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin-auth", "authenticated")
    } else {
      alert("Credenciais inválidas!")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin-auth")
    setLoginForm({ username: "", password: "" })
  }

  const getOrderStats = () => {
    const today = new Date().toDateString()
    const todayOrders = orders.filter((order) => new Date(order.date).toDateString() === today)

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0)

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      totalRevenue,
      todayRevenue,
      pendingOrders: orders.filter((order) => order.status === "recebido").length,
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = getOrderStats()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">Gerencie suas lojas Itaueira</p>
              </div>

              <Select value={selectedStore} onValueChange={(value: "burger" | "sushi") => setSelectedStore(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="burger">🍔 Burger Raiz</SelectItem>
                  <SelectItem value="sushi">🍣 Hot Sushi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                Online
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">{stats.todayOrders}</div>
              <p className="text-xs text-muted-foreground">Total: {stats.totalOrders} pedidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Hoje</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">
                R$ {stats.todayRevenue.toFixed(2).replace(".", ",")}
              </div>
              <p className="text-xs text-muted-foreground">
                Total: R$ {stats.totalRevenue.toFixed(2).replace(".", ",")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loja Ativa</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{selectedStore === "burger" ? "🍔" : "🍣"}</div>
              <p className="text-xs text-muted-foreground">
                {selectedStore === "burger" ? "Burger Raiz" : "Hot Sushi"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Backup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManager storeId={selectedStore} />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManager orders={orders} onOrderUpdate={setOrders} storeId={selectedStore} />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics orders={orders} storeId={selectedStore} />
          </TabsContent>

          <TabsContent value="settings">
            <StoreSettings storeId={selectedStore} />
          </TabsContent>

          <TabsContent value="backup">
            <BackupManager storeId={selectedStore} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
