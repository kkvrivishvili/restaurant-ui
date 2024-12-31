/**
 * Tipos para el sistema de pagos
 * 
 * Incluye:
 * - Estados de pago
 * - Tipos de MercadoPago
 * - Tipos de órdenes
 */

// Enums
export enum PaymentProvider {
  MERCADOPAGO = 'mercadopago',
  STRIPE = 'stripe',
  PAYPAL = 'paypal'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export type PaymentStatusType = 'pending' | 'completed' | 'failed' | 'refunded';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer'
}

// Interfaces para MercadoPago
export interface MercadoPagoItem {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
}

export interface MercadoPagoPhone {
  area_code: string;
  number: string;
}

export interface MercadoPagoIdentification {
  type: string;
  number: string;
}

export interface MercadoPagoAddress {
  zip_code: string;
  street_name: string;
  street_number: string;
}

export interface MercadoPagoPayer {
  name?: string;
  surname?: string;
  email: string;
  phone?: MercadoPagoPhone;
  identification?: MercadoPagoIdentification;
  address?: MercadoPagoAddress;
}

export interface MercadoPagoPaymentMethods {
  excluded_payment_methods?: Array<{ id: string }>;
  excluded_payment_types?: Array<{ id: string }>;
  installments?: number;
  default_payment_method_id?: string;
  default_installments?: number;
}

export interface MercadoPagoBackUrls {
  success: string;
  pending: string;
  failure: string;
}

export interface MercadoPagoPreference {
  items: MercadoPagoItem[];
  payer?: MercadoPagoPayer;
  payment_methods?: MercadoPagoPaymentMethods;
  back_urls?: MercadoPagoBackUrls;
  auto_return?: 'approved' | 'all';
  external_reference?: string;
  notification_url?: string;
  statement_descriptor?: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
  binary_mode?: boolean;
}

// Interfaces para la base de datos
export interface Payment {
  id: string;
  order_id: string;
  provider: PaymentProvider;
  provider_payment_id: string;
  provider_preference_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatusType;
  payment_method?: PaymentMethod;
  payment_data: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentStatusHistory {
  id: string;
  payment_id: string;
  status: PaymentStatusType;
  metadata: Record<string, any>;
  created_at: Date;
}

// Interfaces para respuestas de API
export interface CreatePaymentResponse {
  success: boolean;
  data?: {
    preference_id: string;
    init_point: string;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  data?: {
    status: PaymentStatusType;
    payment_id: string;
    order_id: string;
    amount: number;
    currency: string;
    payment_method?: PaymentMethod;
    created_at: Date;
    updated_at: Date;
  };
  error?: {
    message: string;
    code: string;
  };
}
