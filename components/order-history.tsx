"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, CheckCircle, Package, RotateCcw } from "lucide-react"

interface OrderHistoryProps {
  onBack: () => void
  customerData: any
  storeId: "burger" | "sushi"
}

interface Order {
  id: string
  date: string
  items: any[]
  total: number
  status: "recebido" | "em preparo" | "concluído"
  customer: any
}

export function OrderHistory({ onBack, customerData, storeId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem(`orders_${storeId}`) || "[]")
    // Filter orders by customer phone if customerData exists
    if (customerData?.phone) {
      const customerOrders = savedOrders.filter((order: Order) => order.customer?.phone === customerData.phone)
      setOrders(customerOrders)
    } else {
      setOrders(savedOrders)
    }
  }, [storeId, customerData])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "recebido":
        return <Clock className="w-4 h-4" />
      case "em preparo":
        return <Package className="w-4 h-4" />
      case "concluído":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "recebido":
        return "Recebido"
      case "em preparo":
        return "Em Preparo"
      case "concluído":
        return "Concluído"
      default:
        return "Recebido"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recebido":
        return "bg-yellow-500"
      case "em preparo":
        return "bg-orange-500"
      case "concluído":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleReorder = (order: Order) => {
    // This would typically add items back to cart and redirect to cart
    alert(`Funcionalidade "Refazer Pedido" será implementada em breve!`)
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">Histórico de Pedidos</h1>
          </div>

          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Nenhum pedido ainda</h2>
            <p className="text-muted-foreground mb-6">Seus pedidos aparecerão aqui após a primeira compra.</p>
            <Button onClick={onBack} className="bg-teal-500 hover:bg-teal-600 text-white">
              Fazer Pedido
            </Button>
          </div>
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
          <h1 className="text-xl font-bold">Histórico de Pedidos</h1>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{storeId === "burger" ? "Burger Raiz" : "Hot Sushi"}</CardTitle>
                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </div>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                    </div>
                  ))}

                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-teal-600">R$ {order.total.toFixed(2).replace(".", ",")}</span>
                  </div>

                  <div className="pt-3">
                    <Button variant="outline" size="sm" onClick={() => handleReorder(order)} className="w-full">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Refazer Pedido
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
