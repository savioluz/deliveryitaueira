"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, MapPin, Clock, Star, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"
import { Cart } from "@/components/cart"
import { OrderHistory } from "@/components/order-history"
import type { Product, CartItem } from "@/app/burger/page"

export default function SushiPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const [customerData, setCustomerData] = useState<any>(null)
  const [heroImage, setHeroImage] = useState<string>("")

  // Load customer data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("clients_sushi")
    if (saved) {
      const clients = JSON.parse(saved)
      if (clients.length > 0) {
        setCustomerData(clients[0]) // Get the most recent customer data
      }
    }

    const savedSettings = localStorage.getItem("settings_sushi")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setHeroImage(settings.heroImage || "/itaueira-hot-sushi-logo.jpeg")
    } else {
      setHeroImage("/itaueira-hot-sushi-logo.jpeg")
    }
  }, [])

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  if (showOrderHistory) {
    return <OrderHistory onBack={() => setShowOrderHistory(false)} customerData={customerData} storeId="sushi" />
  }

  if (showCart) {
    return (
      <Cart
        items={cartItems}
        onBack={() => setShowCart(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        storeId="sushi"
        customerData={customerData}
        onCustomerDataUpdate={setCustomerData}
      />
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Regional Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: "url('/sushi-regional-bg.png')",
        }}
      />
      <div className="fixed inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 bg-transparent">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/50 border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🍣</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground drop-shadow-sm">Itaueira Hot Sushi</h1>
                  <p className="text-sm text-muted-foreground drop-shadow-sm">Sushi fresco e saboroso</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {customerData && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOrderHistory(true)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Pedidos
                  </Button>
                )}

                <Button variant="outline" size="sm" onClick={() => setShowCart(true)} className="relative">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Carrinho
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-teal-500 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-6">
          <Card className="bg-gradient-to-r from-pink-500/8 to-purple-600/8 border-pink-500/20 overflow-hidden backdrop-blur-sm bg-background/50">
            <CardContent className="p-0">
              {heroImage ? (
                <div className="relative">
                  <div className="aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] relative overflow-hidden">
                    <img
                      src={heroImage || "/placeholder.svg"}
                      alt="Hot Sushi"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.src = "/bustling-sushi-restaurant.png"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/25" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="text-center text-white max-w-4xl">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-balance drop-shadow-lg">
                        Hot Sushi
                      </h2>
                      <p className="text-sm sm:text-lg md:text-xl mb-4 sm:mb-6 text-pretty opacity-90 drop-shadow-md">
                        Sushi fresco e saboroso, preparado com técnicas tradicionais
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm drop-shadow-md">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-teal-400" />
                          <span>Entrega grátis acima de R$ 30</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-400" />
                          <span>35-45 min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-teal-400" />
                          <span>4.9 (80+ avaliações)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-4 drop-shadow-sm">Hot Sushi</h2>
                    <p className="text-lg text-muted-foreground mb-6 drop-shadow-sm">
                      Sushi fresco e saboroso, preparado com técnicas tradicionais
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground drop-shadow-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-teal-500" />
                        <span>Entrega grátis acima de R$ 30</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-500" />
                        <span>35-45 min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-teal-500" />
                        <span>4.9 (80+ avaliações)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Products */}
        <div className="container mx-auto px-4 pb-8">
          <ProductGrid storeId="sushi" onAddToCart={addToCart} />
        </div>

        {/* Floating Cart Button */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button
              onClick={() => setShowCart(true)}
              className="bg-teal-500 hover:bg-teal-600 text-white shadow-lg rounded-full w-14 h-14 relative"
            >
              <ShoppingCart className="w-6 h-6" />
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[24px] h-6 flex items-center justify-center text-sm">
                {getTotalItems()}
              </Badge>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
