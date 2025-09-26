"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, ChefHat, Settings } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Initialize seed data if not exists
    initializeSeedData()
  }, [])

  const initializeSeedData = () => {
    // Check if data already exists
    const burgerProducts = localStorage.getItem("products_burger")
    const sushiProducts = localStorage.getItem("products_sushi")

    if (!burgerProducts) {
      const seedBurgerProducts = [
        {
          id: "burger-1",
          name: "Burger Raiz",
          description: "Hambúrguer artesanal 180g, queijo, alface, tomate, cebola roxa e molho especial",
          price: 25.0,
          image: "/delicious-burger-with-cheese-lettuce-tomato.jpg",
          category: "Hambúrgueres",
        },
      ]
      localStorage.setItem("products_burger", JSON.stringify(seedBurgerProducts))

      const seedBurgerCombos = [
        {
          id: "combo-1",
          product_id: "burger-1",
          description: "Batata + Refri",
          valor_adicional: 6.0,
        },
        {
          id: "combo-2",
          product_id: "burger-1",
          description: "Cheddar",
          valor_adicional: 3.0,
        },
      ]
      localStorage.setItem("combos_burger", JSON.stringify(seedBurgerCombos))

      const burgerSettings = {
        whatsapp: "5589999999999",
        nome: "Itaueira Burger Raiz",
      }
      localStorage.setItem("settings_burger", JSON.stringify(burgerSettings))
    }

    if (!sushiProducts) {
      const seedSushiProducts = [
        {
          id: "sushi-1",
          name: "Hot Filadélfia",
          description: "Uramaki empanado com salmão, cream cheese e cebolinha",
          price: 3.5,
          image: "/hot-philadelphia-sushi-roll-tempura.jpg",
          category: "Hot Rolls",
        },
      ]
      localStorage.setItem("products_sushi", JSON.stringify(seedSushiProducts))

      const seedSushiCombos = [
        {
          id: "combo-3",
          product_id: "sushi-1",
          description: "Sunomono",
          valor_adicional: 4.0,
        },
        {
          id: "combo-4",
          product_id: "sushi-1",
          description: "Refrigerante",
          valor_adicional: 6.0,
        },
      ]
      localStorage.setItem("combos_sushi", JSON.stringify(seedSushiCombos))

      const sushiSettings = {
        whatsapp: "5589888888888",
        nome: "Itaueira Hot Sushi",
      }
      localStorage.setItem("settings_sushi", JSON.stringify(sushiSettings))
    }
  }

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed blur-sm"
        style={{
          backgroundImage: "url(/combined-food-regional-bg.png)",
        }}
      />
      {/* Dark overlay for content readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content with relative positioning */}
      <div className="relative z-10">
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/15 to-cyan-500/15 backdrop-blur-sm" />
          <div className="relative container mx-auto px-4 py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl mb-6 shadow-2xl">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance drop-shadow-lg">
              Itaueira Delivery
            </h1>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto text-pretty drop-shadow-md">
              Sabores autênticos entregues na sua porta. Escolha entre nossos hambúrgueres artesanais ou sushi fresco.
            </p>
            <div className="flex items-center justify-center gap-8 text-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-400" />
                <span className="drop-shadow-sm">Entrega rápida</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-teal-400" />
                <span className="drop-shadow-sm">Avaliação 4.8+</span>
              </div>
            </div>

            <div className="mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin")}
                className="text-slate-200 border-slate-400 hover:bg-slate-800/80 hover:text-white backdrop-blur-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Acesso Admin
              </Button>
            </div>
          </div>
        </header>

        {/* Store Cards */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card
              className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-slate-800/80 backdrop-blur-md border-slate-600 overflow-hidden"
              onClick={() => router.push("/burger")}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src="/itaueira-burger-raiz-logo-updated.png"
                      alt="Itaueira Burger Raiz"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-orange-500/90 text-white mb-2">Hambúrgueres Artesanais</Badge>
                  </div>
                </div>

                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-3">Itaueira Burger Raiz</h2>
                  <p className="text-slate-200 mb-6 text-pretty">
                    Hambúrgueres artesanais com ingredientes frescos, temperos especiais e o autêntico sabor raiz.
                  </p>

                  <div className="flex items-center gap-6 mb-6 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-400" />
                      <span>30-40min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-teal-400" />
                      <span>4.8 (120+ avaliações)</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                    Fazer Pedido
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card
              className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-slate-800/80 backdrop-blur-md border-slate-600 overflow-hidden"
              onClick={() => router.push("/sushi")}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src="/itaueira-hot-sushi-logo.jpeg"
                      alt="Itaueira Hot Sushi"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-orange-500/90 text-white mb-2">Sushi Tradicional</Badge>
                  </div>
                </div>

                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-3">Itaueira Hot Sushi</h2>
                  <p className="text-slate-200 mb-6 text-pretty">
                    Sushi fresco e saboroso, preparado com técnicas tradicionais e ingredientes premium.
                  </p>

                  <div className="flex items-center gap-6 mb-6 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-400" />
                      <span>35-45min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-teal-400" />
                      <span>4.9 (80+ avaliações)</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                    Fazer Pedido
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-teal-500/15 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Clock className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-md">Entrega Rápida</h3>
              <p className="text-slate-200 text-sm drop-shadow-sm">
                Seus pratos favoritos chegam quentinhos em até 45 minutos
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-teal-500/15 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <ChefHat className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-md">Qualidade Premium</h3>
              <p className="text-slate-200 text-sm drop-shadow-sm">
                Ingredientes frescos e preparo artesanal em todos os pratos
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-teal-500/15 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Star className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-md">Satisfação Garantida</h3>
              <p className="text-slate-200 text-sm drop-shadow-sm">
                Mais de 200 clientes satisfeitos e avaliações 5 estrelas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
