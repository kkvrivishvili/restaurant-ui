import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Clock, MapPin, Heart } from "lucide-react"

const recentOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "En preparación",
    total: "$89.99"
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "Entregado",
    total: "$124.50"
  }
]

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bienvenido/a</h1>
        <Button>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Nuevo Pedido
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Último Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">Pedido #ORD-001</p>
                <p className="text-sm text-muted-foreground">En preparación</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dirección de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">Casa</p>
                <p className="text-sm text-muted-foreground">Av. Principal 123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Favoritos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">5 productos</p>
                <p className="text-sm text-muted-foreground">En tu lista</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.total}</p>
                  <p className="text-sm text-muted-foreground">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
