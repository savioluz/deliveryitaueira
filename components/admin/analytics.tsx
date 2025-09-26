import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Clock, Star } from "lucide-react"

interface AnalyticsProps {
  orders: any[]
}

export function Analytics({ orders }: AnalyticsProps) {
  const getAnalytics = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const todayOrders = orders.filter((order) => new Date(order.date) >= today)
    const yesterdayOrders = orders.filter((order) => {
      const orderDate = new Date(order.date)
      return orderDate >= yesterday && orderDate < today
    })
    const weekOrders = orders.filter((order) => new Date(order.date) >= thisWeek)
    const monthOrders = orders.filter((order) => new Date(order.date) >= thisMonth)

    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0)
    const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + order.total, 0)
    const weekRevenue = weekOrders.reduce((sum, order) => sum + order.total, 0)
    const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0)

    const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0

    const orderChange =
      yesterdayOrders.length > 0 ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100 : 0

    // Brand analysis
    const burgerOrders = orders.filter((order) => order.brand === "burger")
    const sushiOrders = orders.filter((order) => order.brand === "sushi")
    const burgerRevenue = burgerOrders.reduce((sum, order) => sum + order.total, 0)
    const sushiRevenue = sushiOrders.reduce((sum, order) => sum + order.total, 0)

    // Popular items
    const itemCounts: { [key: string]: { count: number; revenue: number; brand: string } } = {}
    orders.forEach((order) => {
      order.items.forEach((item: any) => {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = { count: 0, revenue: 0, brand: order.brand }
        }
        itemCounts[item.name].count += item.quantity
        itemCounts[item.name].revenue += item.price * item.quantity
      })
    })

    const popularItems = Object.entries(itemCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)

    // Average order value
    const avgOrderValue = orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0

    return {
      todayOrders: todayOrders.length,
      todayRevenue,
      revenueChange,
      orderChange,
      weekRevenue,
      monthRevenue,
      burgerOrders: burgerOrders.length,
      sushiOrders: sushiOrders.length,
      burgerRevenue,
      sushiRevenue,
      popularItems,
      avgOrderValue,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    }
  }

  const analytics = getAnalytics()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Relatórios e Analytics</h2>
        <p className="text-muted-foreground">Acompanhe o desempenho das suas lojas</p>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              R$ {analytics.todayRevenue.toFixed(2).replace(".", ",")}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {analytics.revenueChange >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={analytics.revenueChange >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(analytics.revenueChange).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{analytics.todayOrders}</div>
            <div className="flex items-center gap-1 text-xs">
              {analytics.orderChange >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={analytics.orderChange >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(analytics.orderChange).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              R$ {analytics.avgOrderValue.toFixed(2).replace(".", ",")}
            </div>
            <p className="text-xs text-muted-foreground">Valor médio por pedido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              R$ {analytics.totalRevenue.toFixed(2).replace(".", ",")}
            </div>
            <p className="text-xs text-muted-foreground">{analytics.totalOrders} pedidos no total</p>
          </CardContent>
        </Card>
      </div>

      {/* Brand Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🍔</span>
              Burger Raiz
            </CardTitle>
            <CardDescription>Performance da loja de hambúrgueres</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Pedidos:</span>
              <span className="font-semibold">{analytics.burgerOrders}</span>
            </div>
            <div className="flex justify-between">
              <span>Receita:</span>
              <span className="font-semibold text-teal-600">
                R$ {analytics.burgerRevenue.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>% do Total:</span>
              <span className="font-semibold">
                {analytics.totalRevenue > 0 ? ((analytics.burgerRevenue / analytics.totalRevenue) * 100).toFixed(1) : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🍣</span>
              Hot Sushi
            </CardTitle>
            <CardDescription>Performance da loja de sushi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Pedidos:</span>
              <span className="font-semibold">{analytics.sushiOrders}</span>
            </div>
            <div className="flex justify-between">
              <span>Receita:</span>
              <span className="font-semibold text-teal-600">
                R$ {analytics.sushiRevenue.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>% do Total:</span>
              <span className="font-semibold">
                {analytics.totalRevenue > 0 ? ((analytics.sushiRevenue / analytics.totalRevenue) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Items */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Vendidos</CardTitle>
          <CardDescription>Top 5 itens por quantidade vendida</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.popularItems.length > 0 ? (
            <div className="space-y-3">
              {analytics.popularItems.map(([name, data], index) => (
                <div key={name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {data.brand === "burger" ? "Burger Raiz" : "Hot Sushi"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{data.count} vendidos</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-teal-600">R$ {data.revenue.toFixed(2).replace(".", ",")}</p>
                    <p className="text-xs text-muted-foreground">receita total</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Dados insuficientes para análise. Aguarde mais pedidos.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
