/**
 * CartPage: Página del carrito de compras
 * 
 * Funcionalidades:
 * - Listado de productos en el carrito
 * - Control de cantidad por producto
 * - Cálculo de subtotal y total
 * - Mensaje cuando el carrito está vacío
 * 
 * Hooks y Context:
 * - useCart: Provee funcionalidades del carrito (@/context/CartContext.tsx)
 *   - items: Productos en el carrito
 *   - addToCart/removeFromCart: Modificar cantidades
 *   - totalPrice: Precio total calculado
 * 
 * Formateo de precios:
 * - Usa la función formatPrice para mostrar precios
 * - Los precios se almacenan en centavos (dividir por 100)
 * 
 * Componentes UI:
 * - Container: Layout container (@/components/ui/container.tsx)
 * - Button: Botones de acción (@/components/ui/button.tsx)
 * - Iconos de Lucide React
 * 
 * Estilos:
 * - Usa Tailwind CSS para el diseño
 * - Responsive en móvil y desktop
 */

'use client';

import { useCart } from "@/context/CartContext";
import React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ProductImage } from '@/components/ui/product-image';
import { formatPrice } from '@/lib/format';

const CartPage = () => {
  const { items, removeFromCart, addToCart, updateQuantity, totalPrice } = useCart();

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado del carrito",
    });
  };

  const handleUpdateQuantity = (productId: string, action: 'increase' | 'decrease') => {
    const item = items.find(item => item.id === productId);
    if (!item) return;

    if (action === 'increase') {
      addToCart(productId);
      toast({
        title: "Cantidad actualizada",
        description: `${item.title} (${item.quantity + 1}x)`,
      });
    } else {
      if (item.quantity === 1) {
        handleRemoveFromCart(productId);
      } else {
        updateQuantity(productId, item.quantity - 1);
        toast({
          title: "Cantidad actualizada",
          description: `${item.title} (${item.quantity - 1}x)`,
        });
      }
    }
  };

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* PRODUCTS CONTAINER */}
        <div className="flex-1">
          {items.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  className="flex items-center gap-4 p-4 bg-card rounded-lg border"
                  key={item.id}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative h-24 w-24">
                      <ProductImage
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item.id, 'decrease')}
                      className="h-8 w-8"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item.id, 'increase')}
                      className="h-8 w-8"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-medium text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAYMENT CONTAINER */}
        {items.length > 0 && (
          <div className="lg:w-[380px]">
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <h2 className="font-semibold text-lg text-foreground">Resumen del Pedido</h2>
              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>{formatPrice(totalPrice)}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Envío</p>
                  <p>{formatPrice(0)}</p>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <p>Total</p>
                  <p>{formatPrice(totalPrice)}</p>
                </div>
              </div>
              <Button className="w-full" size="lg">
                Proceder al Pago
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default CartPage;
