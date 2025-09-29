"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Minus, Plus, Trash2, MapPin, Phone, User } from "lucide-react"
import type { CartItem } from "@/app/burger/page"

interface CartProps {
  items: CartItem[]
  onBack: () => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  storeId: "burger" | "sushi"
  customerData: any
  onCustomerDataUpdate: (data: any) => void
}

const getHardcodedSettings = (storeId: string) => ({
  deliveryFee: 4.0, // Fixed delivery fee
  quantityPricingEnabled: storeId === "sushi",
  quantityTier1Max: 9,
  quantityTier1Price: 3.5,
  quantityTier2Price: 3.0,
  nome: storeId === "burger" ? "Itaueira Burger Raiz" : "Itaueira Hot Sushi",
  whatsapp: "5586987654321", // Test store number
})

export function Cart({
  items,
  onBack,
  onUpdateQuantity,
  onRemoveItem,
  storeId,
  customerData,
  onCustomerDataUpdate,
}: CartProps) {
  const [step, setStep] = useState<"cart" | "address" | "confirmation">("cart")
  const [formData, setFormData] = useState({
    name: customerData?.name || "",
    phone: customerData?.phone || "",
    address: customerData?.address || "",
    complement: customerData?.complement || "",
    neighborhood: customerData?.neighborhood || "",
    observations: "",
  })

  const calculateTotals = () => {
    const settings = getHardcodedSettings(storeId)
    console.log("[v0] Using hardcoded settings - no localStorage dependency:", settings)

    let subtotal = 0

    // Calculate subtotal with quantity-based pricing for sushi
    if (storeId === "sushi" && settings.quantityPricingEnabled) {
      const totalSushiQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
      const tier1Max = settings.quantityTier1Max || 9
      const tier1Price = settings.quantityTier1Price || 3.5
      const tier2Price = settings.quantityTier2Price || 3.0

      if (totalSushiQuantity <= tier1Max) {
        subtotal = totalSushiQuantity * tier1Price
      } else {
        subtotal = totalSushiQuantity * tier2Price
      }
    } else {
      // Regular pricing
      subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    const deliveryFee = settings.deliveryFee || 4.0
    console.log("[v0] Fixed delivery fee:", deliveryFee)

    const total = subtotal + deliveryFee

    return { subtotal, deliveryFee, total, settings }
  }

  const { subtotal, deliveryFee, total, settings } = calculateTotals()

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const customerInfo = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      complement: formData.complement,
      neighborhood: formData.neighborhood,
    }

    onCustomerDataUpdate(customerInfo)
    console.log("[v0] Customer data updated (not saved to localStorage):", customerInfo)

    setStep("confirmation")
  }

  const handleWhatsAppOrder = () => {
    const brandName = storeId === "burger" ? "Itaueira Burger Raiz" : "Itaueira Hot Sushi"
    const storePhone = "5586987654321" // Different store number for testing

    console.log("[v0] === WHATSAPP DEBUG INFO ===")
    console.log("[v0] Customer making order:", formData.name)
    console.log("[v0] Customer phone (in message):", formData.phone)
    console.log("[v0] Store phone (URL destination):", storePhone)
    console.log("[v0] How WhatsApp works:")
    console.log("[v0] - Customer clicks button on THEIR phone")
    console.log("[v0] - Opens CUSTOMER's WhatsApp")
    console.log("[v0] - Creates conversation TO store number:", storePhone)
    console.log("[v0] - Message is sent FROM customer TO store")

    const customerPhoneClean = formData.phone.replace(/\D/g, "")
    const storePhoneClean = storePhone.replace(/\D/g, "")

    if (customerPhoneClean.includes("87654321") || formData.phone === "86987654321") {
      console.log("[v0] ⚠️  TESTING DETECTED: You are using the test store number as customer!")
      console.log("[v0] This will show 'você' because it's the same WhatsApp account")
      console.log("[v0] For real customers with different numbers, it works correctly")
      console.log("[v0] Try testing with: 86999999999 (different from store)")
    }

    let message = `🍽️ *Novo Pedido - ${brandName}*\n\n`
    message += `👤 *Cliente:* ${formData.name}\n`
    message += `📱 *Telefone do Cliente:* ${formData.phone}\n`
    message += `📍 *Endereço:* ${formData.address}\n`
    if (formData.complement) message += `🏠 *Complemento:* ${formData.complement}\n`
    message += `🏘️ *Bairro:* ${formData.neighborhood}\n\n`

    message += `🛒 *Itens do Pedido:*\n`

    if (storeId === "sushi" && settings.quantityPricingEnabled) {
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
      const tier1Max = settings.quantityTier1Max || 9
      const tier1Price = settings.quantityTier1Price || 3.5
      const tier2Price = settings.quantityTier2Price || 3.0
      const unitPrice = totalQuantity <= tier1Max ? tier1Price : tier2Price

      items.forEach((item) => {
        message += `• ${item.quantity}x ${item.name}\n`
      })
      message += `\n💰 *Preço por peça:* R$ ${unitPrice.toFixed(2).replace(".", ",")}\n`
      message += `📊 *Total de peças:* ${totalQuantity}\n`
    } else {
      items.forEach((item) => {
        message += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}\n`
      })
    }

    message += `\n💰 *Resumo:*\n`
    message += `Subtotal: R$ ${subtotal.toFixed(2).replace(".", ",")}\n`
    message += `Taxa de entrega: R$ ${deliveryFee.toFixed(2).replace(".", ",")}\n`
    message += `*Total: R$ ${total.toFixed(2).replace(".", ",")}*\n`

    if (formData.observations) {
      message += `\n📝 *Observações:* ${formData.observations}`
    }

    const whatsappUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`

    console.log("[v0] Final WhatsApp URL:", whatsappUrl)
    console.log("[v0] When clicked, this will:")
    console.log("[v0] 1. Open customer's WhatsApp app")
    console.log("[v0] 2. Create conversation with store number:", storePhone)
    console.log("[v0] 3. Pre-fill message with order details")
    console.log("[v0] 4. Customer sends message TO store")
    console.log("[v0] === END DEBUG INFO ===")

    window.open(whatsappUrl, "_blank")

    console.log("[v0] Order completed - not saved to localStorage")
    console.log("[v0] Order details:", {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: items,
      total: total,
      status: "recebido",
      customer: formData,
    })

    // Clear cart and go back
    items.forEach((item) => onRemoveItem(item.id))
    onBack()
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">Carrinho</h1>
          </div>

          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🛒</span>
            </div>
            <h2 className="text-lg font-semibold mb-2">Carrinho vazio</h2>
            <p className="text-muted-foreground mb-6">Adicione alguns produtos deliciosos!</p>
            <Button onClick={onBack} className="bg-teal-500 hover:bg-teal-600 text-white">
              Ver Produtos
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setStep("address")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">Confirmar Pedido</h1>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {storeId === "sushi" && settings.quantityPricingEnabled ? (
                  <div>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span className="font-medium">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-3">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Total de peças: {items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                        <span>
                          Preço por peça: R${" "}
                          {(subtotal / items.reduce((sum, item) => sum + item.quantity, 0) || 0)
                            .toFixed(2)
                            .replace(".", ",")}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">
                          {item.quantity}x {item.name}
                        </span>
                      </div>
                      <span className="font-semibold">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  ))
                )}

                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de entrega</span>
                    <span>R$ {deliveryFee.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-teal-600">R$ {total.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{formData.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {formData.address}, {formData.neighborhood}
                  </span>
                </div>
                {formData.observations && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Observações:</strong> {formData.observations}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
            >
              Finalizar via WhatsApp
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "address") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setStep("cart")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">Dados de Entrega</h1>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                required
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                required
                placeholder="Rua, número"
              />
            </div>

            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={formData.complement}
                onChange={(e) => setFormData((prev) => ({ ...prev, complement: e.target.value }))}
                placeholder="Apartamento, bloco, etc."
              />
            </div>

            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData((prev) => ({ ...prev, neighborhood: e.target.value }))}
                required
                placeholder="Seu bairro"
              />
            </div>

            <div>
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => setFormData((prev) => ({ ...prev, observations: e.target.value }))}
                placeholder="Observações sobre o pedido..."
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6">
              Continuar
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Carrinho</h1>
        </div>

        <div className="space-y-4">
          {storeId === "sushi" && settings.quantityPricingEnabled && (
            <Card className="border-4 border-teal-300 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full mb-4 shadow-lg">
                    <span className="text-3xl">🔒</span>
                  </div>
                  <h3 className="text-2xl font-bold text-teal-700 mb-6">Preço por Quantidade</h3>
                  <div className="space-y-4 text-lg">
                    <div className="bg-white/90 rounded-xl p-6 border-2 border-teal-200 shadow-md hover:shadow-lg transition-shadow">
                      <p className="font-bold text-teal-800 text-xl">
                        Até {settings.quantityTier1Max || 9} peças: R${" "}
                        {(settings.quantityTier1Price || 3.5).toFixed(2).replace(".", ",")} cada
                      </p>
                    </div>
                    <div className="bg-white/90 rounded-xl p-6 border-2 border-teal-200 shadow-md hover:shadow-lg transition-shadow">
                      <p className="font-bold text-teal-800 text-xl">
                        A partir de {(settings.quantityTier1Max || 9) + 1} peças: R${" "}
                        {(settings.quantityTier2Price || 3.0).toFixed(2).replace(".", ",")} cada
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl p-8 mt-8 shadow-2xl border-2 border-teal-400">
                    <p className="text-2xl font-bold mb-2">
                      Total de peças: {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </p>
                    <p className="text-lg opacity-95">
                      Preço atual: R${" "}
                      {(subtotal / items.reduce((sum, item) => sum + item.quantity, 0) || 0)
                        .toFixed(2)
                        .replace(".", ",")}{" "}
                      por peça
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.image || "/placeholder.svg?height=96&width=96&query=food"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-teal-600">
                          {storeId === "sushi" && settings.quantityPricingEnabled
                            ? `${item.quantity} peças`
                            : `R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de entrega</span>
                  <span>R$ {deliveryFee.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-teal-600">R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={() => setStep("address")}
            className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-600 hover:via-emerald-600 hover:to-teal-700 text-white py-16 px-10 text-3xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.05] border-0 rounded-3xl animate-pulse hover:animate-none"
          >
            <div className="flex items-center justify-center gap-6">
              <span className="text-5xl animate-bounce">🛒</span>
              <div className="text-center">
                <div className="text-3xl font-black mb-2 tracking-wide">CONTINUAR PEDIDO</div>
                <div className="text-xl opacity-95 font-bold bg-white/20 rounded-full px-4 py-1">
                  Total: R$ {total.toFixed(2).replace(".", ",")}
                </div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
