/**
 * API Route: /api/payment/webhook
 * 
 * Endpoint para:
 * - Recibir notificaciones de MercadoPago
 * - Actualizar estados de pago
 * - Notificar al usuario
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { processWebhook, verifyWebhookSignature } from '@/lib/mercadopago';
import { Database } from '@/types/supabase';

export async function POST(req: NextRequest) {
  try {
    // Obtener headers necesarios
    const signature = req.headers.get('x-signature') || '';
    const timestamp = req.headers.get('x-timestamp') || '';
    
    // Obtener el cuerpo del webhook
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    
    console.log('Webhook received:', {
      body,
      signature,
      timestamp
    });

    // Verificar la firma del webhook
    if (!verifyWebhookSignature(rawBody, signature, timestamp)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Procesar el webhook
    const result = await processWebhook(body);

    if (!result.success) {
      console.error('Error processing webhook:', result.error);
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    // Actualizar el pago en la base de datos
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const payment = result.data;

    if (!payment) {
      throw new Error('No payment data received');
    }

    // Buscar el pago existente
    const { data: existingPayment, error: findError } = await supabase
      .from('payments')
      .select('*')
      .eq('provider_payment_id', payment.payment_id)
      .single();

    if (findError) {
      throw new Error(`Payment not found: ${findError.message}`);
    }

    // Si el estado no ha cambiado, no hacemos nada
    if (existingPayment.status === payment.status) {
      return NextResponse.json({ success: true });
    }

    // Actualizar el pago
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: payment.status,
        payment_data: {
          ...existingPayment.payment_data,
          amount: payment.amount,
          currency: payment.currency,
          payment_method: payment.payment_method,
          updated_at: payment.updated_at
        }
      })
      .eq('id', existingPayment.id);

    if (updateError) {
      throw new Error(`Error updating payment: ${updateError.message}`);
    }

    // Registrar el cambio de estado
    const { error: historyError } = await supabase
      .from('payment_status_history')
      .insert({
        payment_id: existingPayment.id,
        status: payment.status,
        metadata: {
          amount: payment.amount,
          currency: payment.currency,
          payment_method: payment.payment_method,
          provider_payment_id: payment.payment_id
        }
      });

    if (historyError) {
      console.error('Error creating payment history:', historyError);
      // No lanzamos error aquí para no afectar el flujo principal
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in webhook route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
