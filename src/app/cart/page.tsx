/**
 * CartPage: Página del carrito de compras
 * 
 * Funcionalidades:
 * - Listado de productos en el carrito
 * - Control de cantidad por producto
 * - Cálculo de subtotal y total
 * - Mensaje cuando el carrito está vacío
 * - Procesar pago con MercadoPago
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
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const formatPrice = (price: number) => {
  return `$${(price/100).toFixed(2)}`;
};

const CartPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { items, removeFromCart, addToCart, updateQuantity, totalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleCheckout = async () => {
    try {
      if (!user) {
        // Redirigir a login si no está autenticado
        router.push('/login?redirect=/cart');
        return;
      }

      setIsProcessing(true);

      // Log de los items antes de enviar
      console.log('Items to send:', items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        category: item.category,
        quantity: item.quantity,
        price: item.price
      })));

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            image_url: item.image_url,
            category: item.category,
            quantity: item.quantity,
            price: item.price
          }))
        }),
      });

      const result = await response.json();
      
      // Log de la respuesta
      console.log('API Response:', result);

      if (!result.success || !result.data?.init_point) {
        throw new Error(result.error || 'Error al procesar el pago');
      }

      // Redirigir a la página de pago de MercadoPago
      window.location.href = result.data.init_point;

    } catch (error) {
      console.error('Error initiating checkout:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error al procesar el pago',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
                  <div className="relative w-24 h-24 overflow-hidden rounded-md">
                    <Image
                      src={item.image_url || "/temporary/p1.png"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-foreground">{item.title}</h2>
                    <p className="text-muted-foreground">{formatPrice(item.price)}</p>
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
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span className="text-emerald-600 dark:text-emerald-400">¡GRATIS!</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium text-foreground">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Proceder al Pago'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default CartPage;
