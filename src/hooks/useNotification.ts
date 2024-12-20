'use client';

import { useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  type?: NotificationType;
  duration?: number;
}

export function useNotification() {
  const notify = useCallback((title: string, description?: string, options: NotificationOptions = {}) => {
    const { type = 'info', duration = 3000 } = options;

    toast({
      title,
      description,
      variant: type === 'error' ? 'destructive' : 'default',
      duration,
    });
  }, []);

  const notifySuccess = useCallback((title: string, description?: string) => {
    notify(title, description, { type: 'success' });
  }, [notify]);

  const notifyError = useCallback((title: string, description?: string) => {
    notify(title, description, { type: 'error' });
  }, [notify]);

  const notifyCart = {
    itemAdded: useCallback((productName: string) => {
      notify('Producto agregado', productName, { type: 'success' });
    }, [notify]),

    itemRemoved: useCallback((productName: string) => {
      notify('Producto eliminado', productName);
    }, [notify]),

    quantityUpdated: useCallback((productName: string, quantity: number) => {
      notify('Cantidad actualizada', `${productName} (${quantity}x)`);
    }, [notify]),

    error: useCallback((message: string) => {
      notify('Error', message, { type: 'error' });
    }, [notify])
  };

  return {
    notify,
    notifySuccess,
    notifyError,
    notifyCart
  };
}
