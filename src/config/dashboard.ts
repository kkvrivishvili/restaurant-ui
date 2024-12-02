import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Database,
  User,
  Heart,
  Clock,
  MapPin,
  CreditCard,
} from "lucide-react";

export const dashboardConfig = {
  admin: {
    title: "Admin Dashboard",
    items: [
      {
        title: "Overview",
        icon: LayoutDashboard,
        href: "/dashboard/admin",
      },
      {
        title: "Products",
        icon: Package,
        href: "/dashboard/admin/products",
      },
      {
        title: "Orders",
        icon: ShoppingCart,
        href: "/dashboard/admin/orders",
      },
      {
        title: "Customers",
        icon: Users,
        href: "/dashboard/admin/customers",
      },
      {
        title: "Analytics",
        icon: BarChart3,
        href: "/dashboard/admin/analytics",
      },
      {
        title: "Database",
        icon: Database,
        href: "/dashboard/admin/database",
      },
      {
        title: "Settings",
        icon: Settings,
        href: "/dashboard/admin/settings",
      },
    ],
  },
  client: {
    title: "Mi Cuenta",
    items: [
      {
        title: "Mi Cuenta",
        icon: User,
        href: "/dashboard/client",
      },
      {
        title: "Mis Pedidos",
        icon: ShoppingCart,
        href: "/dashboard/client/orders",
      },
      {
        title: "Favoritos",
        icon: Heart,
        href: "/dashboard/client/favorites",
      },
      {
        title: "Historial",
        icon: Clock,
        href: "/dashboard/client/history",
      },
      {
        title: "Direcciones",
        icon: MapPin,
        href: "/dashboard/client/addresses",
      },
      {
        title: "Métodos de Pago",
        icon: CreditCard,
        href: "/dashboard/client/payment",
      },
      {
        title: "Configuración",
        icon: Settings,
        href: "/dashboard/client/settings",
      },
    ],
  },
};
