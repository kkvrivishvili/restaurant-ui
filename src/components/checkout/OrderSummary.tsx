/**
 * Componente de resumen del pedido
 * 
 * Muestra:
 * - Lista de productos
 * - Subtotal
 * - Total
 */

'use client';

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { formatPrice } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  showPayButton?: boolean;
}

export default function OrderSummary({ showPayButton = false }: OrderSummaryProps) {
  const { items, totalPrice } = useCart();

  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Lista de productos */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-md">
                  <Image
                    src={item.image_url || "/temporary/p1.png"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totales */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Envío</span>
              <span className="text-emerald-600 dark:text-emerald-400">¡GRATIS!</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
