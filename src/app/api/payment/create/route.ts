/**
 * API Route: /api/payment/create
 * 
 * Endpoint para:
 * - Crear una preferencia de pago en MercadoPago
 * - Registrar el pago en la base de datos
 * - Retornar la URL de pago
 */

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createCartPaymentPreference } from '@/lib/mercadopago';
import { blockStock } from '@/lib/stock';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { Database } from '@/types/supabase';

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerComponentClient<Database>({ cookies });
    
    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener datos del request
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Carrito vacío' },
        { status: 400 }
      );
    }

    console.log('Creating order with items:', items);

    // Crear orden
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: session.user.id,
        status: 'pending',
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        })),
        total_amount: items.reduce((total, item) => total + (item.price * item.quantity), 0)
      })
      .select()
      .single();

    console.log('Order creation result:', { order, error: orderError });

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      throw new Error('Error al crear la orden');
    }

    // Bloquear stock
    try {
      await blockStock(
        items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        order.id
      );
    } catch (stockError) {
      console.error('Error blocking stock:', stockError);
      // Si falla el bloqueo de stock, eliminar la orden
      await supabase
        .from('orders')
        .delete()
        .eq('id', order.id);

      throw stockError;
    }

    console.log('Creating payment preference...');

    // Crear preferencia de pago
    const preference = await createCartPaymentPreference(
      items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        image_url: item.image_url,
        category: item.category || 'others',
        quantity: item.quantity,
        price: item.price
      })),
      order.id,
      {
        email: session.user.email || '',
        name: session.user.user_metadata?.first_name,
        surname: session.user.user_metadata?.last_name,
        identification: {
          type: 'DNI',
          number: session.user.user_metadata?.dni || '12345678'
        }
      }
    );

    console.log('Payment preference created:', preference);

    return NextResponse.json({
      success: true,
      data: preference
    });

  } catch (error) {
    console.error('Error in payment creation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al crear el pago' 
      },
      { status: 500 }
    );
  }
}
