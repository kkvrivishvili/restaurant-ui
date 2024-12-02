'use client';

import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

type NotificationType = {
  message?: string;
};

const Notification = ({ message }: NotificationType) => {
  const { toast } = useToast();

  useEffect(() => {
    if (message) {
      toast({
        description: message,
        duration: 3000,
      });
    }
  }, [message, toast]);

  return <Toaster />;
};

export default Notification;