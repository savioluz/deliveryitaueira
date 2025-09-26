"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, CheckCircle, Package, Phone, MapPin, User, Calendar } from "lucide-react"

interface OrderManagerProps {
  orders: any[]
  onOrderUpdate: (orders: any[]) => void
  storeId: "burger" | "sushi"
}

export function OrderManager({ orders, onOrderUpdate, storeId }: OrderManagerProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    onOrderUpdate(updatedOrders)
    localStorage.setItem(`orders_${storeId}`, JSON.stringify(updatedOrders))
  }

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true
    return order.status === statusFilter
  })

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Pedidos</h2>
          <p className="text-muted-foreground">
            {filteredOrders.length} pedidos - {storeId === "burger" ? "Burger Raiz" : "Hot Sushi"}
          </p>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os pedidos</SelectItem>
            <SelectItem value="recebido">Recebidos</SelectItem>
            <SelectItem value="em preparo">Em Preparo</SelectItem>
            <SelectItem value="concluído">Concluídos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground">
              {statusFilter === "all"
                ? "Ainda não há pedidos no sistema."
                : `Não há pedidos com status "${getStatusText(statusFilter)}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{storeId === "burger" ? "🍔" : "🍣"}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Pedido #{order.id.slice(-6)}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </div>
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-teal-600">
                        R$ {order.total.toFixed(2).replace(".", ",")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {storeId === "burger" ? "Burger Raiz" : "Hot Sushi"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground">Cliente</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{order.customer.phone}</p>
                      <p className="text-xs text-muted-foreground">Telefone</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {order.customer.address}, {order.customer.neighborhood}
                      </p>
                      <p className="text-xs text-muted-foreground">Endereço</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-2">Itens do Pedido</h4>
                  <div className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-border last:border-0"
                      >
                        <div>
                          <span className="font-medium">
                            {item.quantity}x {item.name}
                          </span>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <span className="font-semibold">
                          R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Atualizar Status:</span>
                    <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recebido">Recebido</SelectItem>
                        <SelectItem value="em preparo">Em Preparo</SelectItem>
                        <SelectItem value="concluído">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const phone = order.customer.phone.replace(/\D/g, "")
                      const message = `Olá ${order.customer.name}! Seu pedido #${order.id.slice(-6)} foi atualizado para: ${getStatusText(order.status)}`
                      window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, "_blank")
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contatar Cliente
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
