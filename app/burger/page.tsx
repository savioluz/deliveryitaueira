"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Clock, Star, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"
import { Cart } from "@/components/cart"
import { OrderHistory } from "@/components/order-history"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export interface CartItem extends Product {
  quantity: number
  combos?: Array<{ id: string; description: string; valor_adicional: number }>
}

export default function BurgerPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const [customerData, setCustomerData] = useState<any>(null)
  const [heroImage, setHeroImage] = useState<string>("")

  // Load customer data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("clients_burger")
    if (saved) {
      const clients = JSON.parse(saved)
      if (clients.length > 0) {
        setCustomerData(clients[0]) // Get the most recent customer data
      }
    }

    const savedSettings = localStorage.getItem("settings_burger")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setHeroImage(settings.heroImage || "/itaueira-burger-raiz-logo-updated.png")
    } else {
      setHeroImage("/itaueira-burger-raiz-logo-updated.png")
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
    return <OrderHistory onBack={() => setShowOrderHistory(false)} customerData={customerData} storeId="burger" />
  }

  if (showCart) {
    return (
      <Cart
        items={cartItems}
        onBack={() => setShowCart(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        storeId="burger"
        customerData={customerData}
        onCustomerDataUpdate={setCustomerData}
      />
    )
  }

  return (
    <div
      className="bg-background min-h-screen relative"
      style={{
        backgroundImage: "url(/burger-regional-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        /* Added blur filter to background */
        filter: "blur(0.5px)",
      }}
    >
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed blur-sm"
        style={{
          backgroundImage: "url(/burger-regional-bg.png)",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/65 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🍔</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Itaueira Burger Raiz</h1>
                  <p className="text-sm text-muted-foreground">Hambúrgueres artesanais</p>
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
          <Card className="bg-gradient-to-r from-orange-500/12 to-red-600/12 border-orange-500/30 overflow-hidden backdrop-blur-md bg-background/40 shadow-xl">
            <CardContent className="p-0">
              {heroImage ? (
                <div className="relative">
                  <div className="aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] relative overflow-hidden">
                    <img
                      src={heroImage || "/placeholder.svg"}
                      alt="Burger Raiz"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.src = "/burger-restaurant.png"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/25" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="text-center text-white max-w-4xl">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-balance drop-shadow-lg">
                        Burger Raiz
                      </h2>
                      <p className="text-sm sm:text-lg md:text-xl mb-4 sm:mb-6 text-pretty opacity-95 drop-shadow-md">
                        Hambúrgueres artesanais com ingredientes frescos e sabor autêntico
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm drop-shadow-md">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-400" />
                          <span>30-40 min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-teal-400" />
                          <span>4.8 (120+ avaliações)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Burger Raiz</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      Hambúrgueres artesanais com ingredientes frescos e sabor autêntico
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-500" />
                        <span>30-40 min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-teal-500" />
                        <span>4.8 (120+ avaliações)</span>
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
          <ProductGrid storeId="burger" onAddToCart={addToCart} />
        </div>
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
  )
}
