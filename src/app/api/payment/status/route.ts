/**
 * API Route: /api/payment/status
 * 
 * Endpoint para:
 * - Consultar estado de pagos
 * - Actualizar estado en base de datos
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getPaymentInfo } from '@/lib/mercadopago';
import { Database } from '@/types/supabase';
import { type PaymentStatusType } from '@/types/payment';

// Mensajes de error según documentación
const ERROR_MESSAGES: Record<string, string> = {
  cc_rejected_bad_filled_card_number: "Revisa el número de tarjeta.",
  cc_rejected_bad_filled_date: "Revisa la fecha de vencimiento.",
  cc_rejected_bad_filled_security_code: "Revisa el código de seguridad.",
  cc_rejected_bad_filled_other: "Revisa los datos ingresados.",
  cc_rejected_high_risk: "Tu pago fue rechazado. Elige otro de los medios de pago.",
  cc_rejected_blacklist: "Tu pago fue rechazado. Elige otro de los medios de pago.",
  cc_rejected_insufficient_amount: "Tu tarjeta no tiene fondos suficientes.",
  cc_rejected_max_attempts: "Llegaste al límite de intentos permitidos.",
  cc_rejected_duplicated_payment: "Ya hiciste un pago por ese valor.",
  cc_rejected_card_disabled: "Llama a tu banco para activar tu tarjeta.",
  cc_rejected_call_for_authorize: "Debes autorizar el pago con tu banco.",
};

// Mensajes de estado según documentación
const STATUS_MESSAGES: Record<string, Record<string, string>> = {
  approved: {
    accredited: "¡Listo! Se acreditó tu pago.",
    partially_refunded: "Se realizó la devolución parcial del pago.",
  },
  in_process: {
    pending_contingency: "Estamos procesando tu pago. En menos de una hora te enviaremos por e-mail el resultado.",
    pending_review_manual: "Estamos procesando tu pago. En menos de 2 días hábiles te diremos por e-mail si se acreditó o si necesitamos más información.",
    pending_capture: "Tu pago está pendiente de captura.",
  },
  rejected: {
    // Los mensajes de rechazo se manejan en ERROR_MESSAGES
  },
};

export async function GET(req: NextRequest) {
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

    // Obtener ID del pago de los parámetros
    const searchParams = req.nextUrl.searchParams;
    const paymentId = searchParams.get('id');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Obtener pago de la base de datos
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, order:orders(*)')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Verificar que el pago pertenece al usuario
    if (payment.order.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Si el pago ya está completado o fallido, retornamos el estado actual
    if (payment.status !== 'pending') {
      const paymentData = payment.payment_data as any;
      const message = getStatusMessage(payment.status, paymentData?.mercadopago_status_detail);

      return NextResponse.json({
        success: true,
        data: {
          status: payment.status,
          status_detail: paymentData?.mercadopago_status_detail,
          message,
          payment_id: payment.id,
          order_id: payment.order_id,
          amount: payment.amount,
        },
      });
    }

    // Si el pago está pendiente, consultamos a MercadoPago
    if (payment.provider_payment_id) {
      const result = await getPaymentInfo(payment.provider_payment_id);

      if (result.success && result.data) {
        // Mapear estado de MercadoPago a nuestro estado
        const status = mapMercadoPagoStatus(result.data.status);
        const message = getStatusMessage(status, result.data.status_detail);

        // Si el estado cambió, actualizamos la base de datos
        if (status !== payment.status) {
          // Actualizar estado del pago
          await supabase
            .from('payments')
            .update({
              status,
              payment_data: {
                ...payment.payment_data,
                mercadopago_status: result.data.status,
                mercadopago_status_detail: result.data.status_detail,
                mercadopago_payment_method: result.data.payment_method,
                mercadopago_payment_type: result.data.payment_type_id,
                last_updated: new Date().toISOString(),
              },
            })
            .eq('id', paymentId);

          // Registrar historial de estado
          await supabase
            .from('payment_status_history')
            .insert({
              payment_id: payment.id,
              status,
              metadata: {
                mercadopago_status: result.data.status,
                mercadopago_status_detail: result.data.status_detail,
                mercadopago_payment_method: result.data.payment_method,
                mercadopago_payment_type: result.data.payment_type_id,
              },
            });

          // Si el pago se completó o falló, actualizar la orden
          if (status === 'completed') {
            await supabase
              .from('orders')
              .update({ status: 'paid' })
              .eq('id', payment.order_id);
          } else if (status === 'failed') {
            await supabase
              .from('orders')
              .update({ status: 'payment_failed' })
              .eq('id', payment.order_id);
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            status,
            status_detail: result.data.status_detail,
            message,
            payment_id: payment.id,
            order_id: payment.order_id,
            amount: payment.amount,
          },
        });
      }
    }

    // Si no hay ID de pago o hubo error, retornamos el estado actual
    return NextResponse.json({
      success: true,
      data: {
        status: payment.status,
        status_detail: payment.payment_data?.mercadopago_status_detail,
        message: getStatusMessage(payment.status, payment.payment_data?.mercadopago_status_detail),
        payment_id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
      },
    });

  } catch (error) {
    console.error('Error in payment status route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Función auxiliar para mapear estados de MercadoPago
function mapMercadoPagoStatus(status: string): PaymentStatusType {
  switch (status) {
    case 'approved':
      return 'completed';
    case 'rejected':
    case 'cancelled':
      return 'failed';
    case 'refunded':
      return 'refunded';
    case 'in_process':
    case 'pending':
      return 'pending';
    default:
      return 'pending';
  }
}

// Función auxiliar para obtener mensaje según estado
function getStatusMessage(status: string, statusDetail?: string): string {
  if (status === 'rejected' && statusDetail) {
    return ERROR_MESSAGES[statusDetail] || 'Tu pago fue rechazado. Intenta nuevamente.';
  }

  if (statusDetail && STATUS_MESSAGES[status]?.[statusDetail]) {
    return STATUS_MESSAGES[status][statusDetail];
  }

  switch (status) {
    case 'completed':
      return '¡Listo! Se acreditó tu pago.';
    case 'pending':
      return 'Tu pago está pendiente de confirmación.';
    case 'failed':
      return 'Tu pago fue rechazado. Intenta nuevamente.';
    case 'refunded':
      return 'El pago fue devuelto.';
    default:
      return 'Estado de pago desconocido.';
  }
}
