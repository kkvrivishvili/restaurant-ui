/**
 * API Route: /api/payment
 * 
 * Endpoints para:
 * - Crear preferencia de pago
 * - Procesar pagos
 * - Manejar estados de pago
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createPaymentPreference } from '@/lib/mercadopago';
import { type MercadoPagoPreference } from '@/types/payment';
import { Database } from '@/types/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación con Supabase
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Obtener datos del request
    const body = await req.json();
    const { orderId, items } = body;

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Obtener orden de la base de datos
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verificar que la orden pertenece al usuario
    if (order.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verificar si ya existe un pago pendiente para esta orden
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingPayment?.provider_preference_id && 
        Date.now() - new Date(existingPayment.created_at).getTime() < 300000) { // 5 minutos
      return NextResponse.json({
        success: true,
        data: {
          preference_id: existingPayment.provider_preference_id,
          payment_id: existingPayment.id,
        },
      });
    }

    // Crear preferencia para MercadoPago
    const preference: MercadoPagoPreference = {
      items: items.map((item: any) => ({
        id: item.id,
        title: item.name,
        description: item.description,
        picture_url: item.image,
        category_id: 'fashion',
        quantity: item.quantity,
        currency_id: 'ARS',
        unit_price: item.price
      })),
      payer: {
        email: session.user.email!,
        name: session.user.user_metadata?.full_name,
      },
      payment_methods: {
        excluded_payment_types: [
          { id: 'ticket' }
        ],
        installments: 12
      },
      back_urls: {
        success: `${SITE_URL}/checkout/success`,
        pending: `${SITE_URL}/checkout/pending`,
        failure: `${SITE_URL}/checkout/failure`,
      },
      auto_return: 'approved',
      notification_url: `${SITE_URL}/api/payment/webhook`,
      external_reference: orderId,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
      binary_mode: true,
    };

    // Crear preferencia en MercadoPago
    const result = await createPaymentPreference(preference);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { 
          error: 'Error creating payment preference',
          details: result.error
        },
        { status: 500 }
      );
    }

    // Crear registro de pago en la base de datos
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        provider: 'mercadopago',
        provider_preference_id: result.data.preference_id,
        amount: items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0),
        currency: 'ARS',
        status: 'pending',
        payment_data: {
          ...preference,
          created_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Error creating payment record' },
        { status: 500 }
      );
    }

    // Actualizar orden con ID de preferencia
    await supabase
      .from('orders')
      .update({
        provider_preference_id: result.data.preference_id,
        status: 'pending_payment'
      })
      .eq('id', orderId);

    return NextResponse.json({
      success: true,
      data: {
        ...result.data,
        payment_id: payment.id
      }
    });

  } catch (error) {
    console.error('Error in payment route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// No permitimos GET en esta ruta
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
