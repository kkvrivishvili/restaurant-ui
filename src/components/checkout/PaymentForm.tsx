/**
 * Componente de formulario de pago
 * 
 * Características:
 * - Integración con MercadoPago
 * - Validación de campos
 * - Manejo de errores
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { formatAmount } from '@/lib/mercadopago';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export default function PaymentForm() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar el script de MercadoPago
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, {
        locale: 'es-AR'
      });

      // Crear el botón de pago
      mp.checkout({
        preference: {
          id: '{{ preference_id }}'
        },
        render: {
          container: '.cho-container',
          label: 'Pagar',
        }
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCreatePreference = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            title: item.title,
            description: item.description,
            picture_url: item.image_url,
            quantity: item.quantity,
            currency_id: 'ARS',
            unit_price: formatAmount(item.price),
          })),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Error al crear la preferencia de pago');
      }

      // Redirigir al checkout de MercadoPago
      router.push(data.data.init_point);
    } catch (err) {
      console.error('Error creating payment preference:', err);
      setError('Error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Método de Pago</CardTitle>
        <CardDescription>
          Elige tu método de pago preferido
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Contenedor para el botón de MercadoPago */}
          <div className="cho-container"></div>

          {/* Botón alternativo mientras se carga MP */}
          <Button
            onClick={handleCreatePreference}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Proceder al Pago
          </Button>

          {/* Mensaje de error */}
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}

          {/* Información de seguridad */}
          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Pago seguro procesado por MercadoPago</p>
            <p>Tus datos están protegidos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
