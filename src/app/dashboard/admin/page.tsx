import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, ShoppingCart, Package } from "lucide-react"

const stats = [
  {
    title: "Ingresos Totales",
    value: "$15,231.89",
    icon: DollarSign,
    description: "Últimos 30 días",
  },
  {
    title: "Nuevos Clientes",
    value: "124",
    icon: Users,
    description: "↗︎ 14% desde el último mes",
  },
  {
    title: "Pedidos Pendientes",
    value: "23",
    icon: ShoppingCart,
    description: "Requieren atención",
  },
  {
    title: "Productos Activos",
    value: "45",
    icon: Package,
    description: "En el catálogo",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel de Administración</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
