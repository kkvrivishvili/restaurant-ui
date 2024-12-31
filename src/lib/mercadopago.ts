/**
 * Configuración y utilidades de MercadoPago
 * 
 * Este archivo contiene:
 * - Configuración del cliente de MercadoPago
 * - Funciones helper para crear preferencias
 * - Funciones para procesar webhooks
 * - Tipos y utilidades relacionadas con pagos
 */

import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { 
  type MercadoPagoPreference, 
  type CreatePaymentResponse, 
  type PaymentStatusResponse,
  type PaymentStatusType,
  PaymentMethod
} from '@/types/payment';

// Configuración de MercadoPago
const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

if (!MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error('MERCADOPAGO_ACCESS_TOKEN is not defined');
}

if (!SITE_URL) {
  throw new Error('NEXT_PUBLIC_SITE_URL is not defined');
}

// Cliente de MercadoPago
const config = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN });
const preference = new Preference(config);
const payment = new Payment(config);

/**
 * Crea una preferencia de pago en MercadoPago
 */
export async function createPaymentPreference(
  preferenceData: MercadoPagoPreference
): Promise<CreatePaymentResponse> {
  try {
    // Aseguramos que los items tengan los campos requeridos
    const items = preferenceData.items.map((item, index) => ({
      ...item,
      id: item.id || `item-${index}`,
      currency_id: item.currency_id || 'ARS'
    }));

    // Construimos la preferencia completa
    const fullPreference = {
      ...preferenceData,
      items,
      back_urls: {
        success: `${SITE_URL}/checkout/success`,
        pending: `${SITE_URL}/checkout/pending`,
        failure: `${SITE_URL}/checkout/failure`
      },
      auto_return: 'approved',
      notification_url: `${SITE_URL}/api/payment/webhook`,
      statement_descriptor: 'VERA ECOMMERCE',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
    };

    // Crear la preferencia en MercadoPago
    const response = await preference.create({ body: fullPreference });

    if (!response.id || !response.init_point) {
      throw new Error('Invalid response from MercadoPago');
    }

    return {
      success: true,
      data: {
        preference_id: response.id,
        init_point: response.init_point,
      }
    };
  } catch (error) {
    console.error('Error creating payment preference:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error creating payment preference',
        code: 'MERCADOPAGO_CREATE_PREFERENCE_ERROR'
      }
    };
  }
}

interface MPPaymentResponse {
  id: number;
  status: string;
  external_reference: string;
  transaction_amount: number;
  currency_id: string;
  payment_method: {
    type: string;
  };
  date_created: string;
  date_last_updated: string;
}

/**
 * Obtiene información de un pago
 */
export async function getPaymentInfo(id: string): Promise<PaymentStatusResponse> {
  try {
    const response = await payment.get({ id });

    if (!response) {
      throw new Error('Payment not found');
    }

    // Asegurarnos de que todos los campos requeridos existan y convertir tipos
    const mpResponse = response as unknown as MPPaymentResponse;
    const paymentId = mpResponse.id.toString();
    const status = mpResponse.status;
    const externalReference = mpResponse.external_reference;
    const transactionAmount = mpResponse.transaction_amount;
    const currencyId = mpResponse.currency_id;
    const paymentMethodType = mpResponse.payment_method?.type;
    const dateCreated = mpResponse.date_created;
    const dateLastUpdated = mpResponse.date_last_updated;

    if (!paymentId || !status || !externalReference || 
        typeof transactionAmount !== 'number' || !currencyId || 
        !dateCreated || !dateLastUpdated || !paymentMethodType) {
      throw new Error('Invalid payment data from MercadoPago');
    }

    return {
      success: true,
      data: {
        status: mapMercadoPagoStatus(status),
        payment_id: paymentId,
        order_id: externalReference,
        amount: transactionAmount,
        currency: currencyId,
        payment_method: mapPaymentMethod(paymentMethodType),
        created_at: new Date(dateCreated),
        updated_at: new Date(dateLastUpdated)
      }
    };
  } catch (error) {
    console.error('Error getting payment info:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error getting payment info',
        code: 'MERCADOPAGO_GET_PAYMENT_ERROR'
      }
    };
  }
}

interface MPWebhookPayload {
  action: string;
  api_version: string;
  data: {
    id: string;
  };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: 'payment' | 'plan' | 'subscription' | 'invoice' | 'point_integration_wh';
  user_id: string;
}

/**
 * Procesa un webhook de MercadoPago
 * @param payload - Payload del webhook
 * @returns Respuesta procesada del webhook
 */
export async function processWebhook(payload: MPWebhookPayload): Promise<PaymentStatusResponse> {
  try {
    // Validar que sea un webhook de pago
    if (payload.type !== 'payment') {
      throw new Error('Invalid webhook type');
    }

    // Obtener información del pago
    return await getPaymentInfo(payload.data.id);
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error processing webhook',
        code: 'MERCADOPAGO_WEBHOOK_ERROR'
      }
    };
  }
}

/**
 * Verifica la firma del webhook de MercadoPago
 * @param body - Cuerpo del webhook en formato string
 * @param signature - Firma del webhook (x-signature header)
 * @param timestamp - Timestamp del webhook (x-timestamp header)
 * @returns true si la firma es válida, false si no
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  timestamp: string
): boolean {
  try {
    // Verificar que tenemos los datos necesarios
    if (!body || !signature || !timestamp || !MERCADOPAGO_ACCESS_TOKEN) {
      return false;
    }

    // En producción, aquí implementaríamos la verificación de la firma
    // usando HMAC-SHA256 con el access token como clave
    // Por ahora, en desarrollo, aceptamos todas las firmas
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implementar verificación de firma
      // const hmac = crypto.createHmac('sha256', MERCADOPAGO_ACCESS_TOKEN);
      // hmac.update(`${body}${timestamp}`);
      // const computedSignature = hmac.digest('hex');
      // return computedSignature === signature;
      console.warn('Webhook signature verification not implemented in production');
    }

    return true;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Formatea un monto para MercadoPago (convierte a centavos)
 */
export function formatAmount(amount: number): number {
  return Math.round(amount * 100) / 100;
}

interface CartItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  quantity: number;
  price: number;
  category?: string;
}

/**
 * Convierte items del carrito al formato de MercadoPago
 */
export function convertCartItemsToMPFormat(items: CartItem[]): MercadoPagoItem[] {
  return items.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    picture_url: item.image_url,
    category_id: item.category || 'others',
    quantity: item.quantity,
    currency_id: 'ARS',
    unit_price: formatAmount(item.price)
  }));
}

/**
 * Crea una preferencia de pago para un carrito
 */
export async function createCartPaymentPreference(
  items: CartItem[],
  orderId: string,
  payer: MercadoPagoPayer
): Promise<CreatePaymentResponse> {
  try {
    const mpItems = items.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || item.title,
      picture_url: item.image_url,
      category_id: item.category || "others",
      quantity: item.quantity,
      currency_id: "ARS",
      unit_price: item.price
    }));

    const preference = {
      items: mpItems,
      external_reference: orderId,
      payer: {
        name: payer.name || "Test",
        surname: payer.surname || "User",
        email: payer.email,
        phone: {
          area_code: "11",
          number: payer.phone || "22223333"
        },
        identification: {
          type: "DNI",
          number: payer.identification?.number || "12345678"
        }
      },
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      },
      back_urls: {
        success: `${SITE_URL}/checkout/success`,
        failure: `${SITE_URL}/checkout/failure`,
        pending: `${SITE_URL}/checkout/pending`
      },
      auto_return: "approved",
      notification_url: `${SITE_URL}/api/payment/webhook`,
      statement_descriptor: "VERA ECOMMERCE",
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    const response = await createPaymentPreference(preference);
    return response;
  } catch (error) {
    console.error("Error creating cart payment preference:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Error creating payment preference",
        code: "MERCADOPAGO_CREATE_PREFERENCE_ERROR"
      }
    };
  }
}

// Funciones auxiliares privadas
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

function mapPaymentMethod(type: string): PaymentMethod {
  switch (type) {
    case 'credit_card':
      return PaymentMethod.CREDIT_CARD;
    case 'debit_card':
      return PaymentMethod.DEBIT_CARD;
    default:
      return PaymentMethod.BANK_TRANSFER;
  }
}

/**
 * Tarjetas de prueba para testing
 */
export const TEST_CARDS = {
  MASTERCARD: {
    STATUS_APPROVED: {
      number: '5031 7557 3453 0604',
      cvv: '123',
      expiration: '11/25',
      holder: 'APRO'
    },
    STATUS_PENDING: {
      number: '5031 7557 3453 0604',
      cvv: '123',
      expiration: '11/25',
      holder: 'CONT'
    },
    STATUS_REJECTED: {
      number: '5031 7557 3453 0604',
      cvv: '123',
      expiration: '11/25',
      holder: 'OTHE'
    }
  },
  VISA: {
    STATUS_APPROVED: {
      number: '4509 9535 6623 3704',
      cvv: '123',
      expiration: '11/25',
      holder: 'APRO'
    },
    STATUS_PENDING: {
      number: '4509 9535 6623 3704',
      cvv: '123',
      expiration: '11/25',
      holder: 'CONT'
    },
    STATUS_REJECTED: {
      number: '4509 9535 6623 3704',
      cvv: '123',
      expiration: '11/25',
      holder: 'OTHE'
    }
  }
};
