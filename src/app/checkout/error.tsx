/**
 * Error handling para la página de checkout
 */

'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export default function ErrorCheckout({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Checkout error:', error);

    // Mostrar notificación de error
    toast({
      title: "Error en el Checkout",
      description: error.message || 'Ha ocurrido un error al procesar tu pedido',
      variant: "destructive",
    });
  }, [error, toast]);

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icons.alertCircle className="h-5 w-5" />
            <CardTitle>¿Qué puedes hacer?</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Verificar tu conexión a internet</li>
            <li>Comprobar que todos los datos ingresados son correctos</li>
            <li>Intentar nuevamente en unos minutos</li>
            <li>Si el problema persiste, contacta con nuestro soporte</li>
          </ul>
        </CardContent>
        <CardFooter className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => router.push('/cart')}
          >
            Volver al Carrito
          </Button>
          <Button
            onClick={() => reset()}
          >
            Intentar Nuevamente
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
