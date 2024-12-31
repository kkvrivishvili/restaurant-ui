/**
 * Componente de estado del pago
 * 
 * Estados:
 * - Pendiente
 * - Procesando
 * - Completado
 * - Error
 */

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { type PaymentStatusType } from '@/types/payment';

interface StatusConfig {
  title: string;
  description: string;
  icon: keyof typeof Icons;
  buttonText: string;
  buttonAction: 'retry' | 'continue' | 'home';
  color: string;
}

const STATUS_CONFIG: Record<PaymentStatusType, StatusConfig> = {
  pending: {
    title: 'Pago Pendiente',
    description: 'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
    icon: 'clock',
    buttonText: 'Verificar Estado',
    buttonAction: 'retry',
    color: 'text-yellow-500',
  },
  completed: {
    title: '¡Pago Exitoso!',
    description: 'Tu pago ha sido procesado correctamente. Gracias por tu compra.',
    icon: 'check',
    buttonText: 'Ver Pedido',
    buttonAction: 'continue',
    color: 'text-green-500',
  },
  failed: {
    title: 'Error en el Pago',
    description: 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.',
    icon: 'alertCircle',
    buttonText: 'Reintentar Pago',
    buttonAction: 'retry',
    color: 'text-red-500',
  },
  refunded: {
    title: 'Pago Reembolsado',
    description: 'El pago ha sido reembolsado a tu cuenta.',
    icon: 'undo',
    buttonText: 'Volver al Inicio',
    buttonAction: 'home',
    color: 'text-blue-500',
  },
};

interface PaymentStatusProps {
  status?: PaymentStatusType;
  paymentId?: string;
}

export default function PaymentStatus({ status = 'pending', paymentId }: PaymentStatusProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const config = STATUS_CONFIG[status];

  // Efecto para verificar el estado del pago
  useEffect(() => {
    if (status === 'pending' && paymentId) {
      const checkStatus = async () => {
        try {
          const response = await fetch(`/api/payment/status?id=${paymentId}`);
          const data = await response.json();

          if (data.success && data.data.status !== 'pending') {
            router.refresh();
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      };

      // Verificar cada 5 segundos
      const interval = setInterval(checkStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [status, paymentId, router]);

  const handleButtonClick = () => {
    switch (config.buttonAction) {
      case 'retry':
        router.push('/checkout');
        break;
      case 'continue':
        router.push('/orders');
        break;
      case 'home':
        router.push('/');
        break;
    }
  };

  const Icon = Icons[config.icon];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className={`h-6 w-6 ${config.color}`} />
          <CardTitle>{config.title}</CardTitle>
        </div>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Detalles adicionales según el estado */}
          {status === 'completed' && (
            <div className="text-sm text-muted-foreground">
              <p>ID de Pago: {paymentId}</p>
              <p>Fecha: {new Date().toLocaleDateString()}</p>
            </div>
          )}

          {/* Botón de acción */}
          <Button
            onClick={handleButtonClick}
            className="w-full"
            variant={status === 'completed' ? 'default' : 'secondary'}
          >
            {config.buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
