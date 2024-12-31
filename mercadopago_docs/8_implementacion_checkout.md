# Implementación de Checkout con MercadoPago

## Índice
1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Base de Datos](#base-de-datos)
3. [Flujo de Pago](#flujo-de-pago)
4. [Componentes](#componentes)
5. [APIs](#apis)
6. [Tipos](#tipos)
7. [Testing](#testing)

## Estructura del Proyecto

### Archivos Creados
```
src/
├── app/
│   ├── api/
│   │   └── payment/
│   │       ├── route.ts                 # POST /api/payment - Crear preferencia
│   │       ├── status/route.ts          # GET /api/payment/status - Consultar estado
│   │       └── webhook/route.ts         # POST /api/payment/webhook - Webhooks
│   └── checkout/
│       ├── page.tsx                     # Página principal de checkout
│       ├── loading.tsx                  # Loading state
│       └── error.tsx                    # Error handling
├── components/
│   └── checkout/
│       ├── PaymentForm.tsx             # Formulario de pago con MP
│       ├── OrderSummary.tsx            # Resumen del pedido
│       └── PaymentStatus.tsx           # Estado del pago
├── lib/
│   └── mercadopago.ts                  # Configuración de MP
└── types/
    └── payment.ts                      # Tipos para pagos
```

## Base de Datos

### Nuevas Tablas

#### Payments
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    provider payment_provider NOT NULL,
    provider_payment_id VARCHAR(255) NOT NULL,
    provider_preference_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ARS',
    status payment_status DEFAULT 'pending',
    payment_method payment_method,
    payment_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_payment_id)
);
```

#### Payment Status History
```sql
CREATE TABLE payment_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    status payment_status NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### Modificaciones a Tablas Existentes
- Tabla `orders`: Nuevos campos para tracking de pagos
  - `provider_payment_id`: ID del pago en MercadoPago
  - `provider`: Proveedor de pago (enum)

## Flujo de Pago

1. **Inicio del Checkout**
   - Usuario hace clic en "Proceder al Pago" en el carrito
   - Se redirige a `/checkout`
   - Se muestra resumen del pedido y formulario de pago

2. **Creación de Preferencia**
   - Frontend envía datos del pedido a `/api/payment`
   - Backend crea preferencia en MercadoPago
   - Se crea registro en tabla `orders` y `payments`

3. **Proceso de Pago**
   - Usuario completa formulario de pago
   - MercadoPago procesa el pago
   - Se recibe webhook con resultado

4. **Actualización de Estado**
   - Webhook actualiza estado en `payments`
   - Se registra en `payment_status_history`
   - Se actualiza UI en tiempo real

## Componentes

### PaymentForm
- Integración con MercadoPago.js
- Manejo de estados de carga
- Validación de campos
- Manejo de errores

### OrderSummary
- Muestra items del carrito
- Calcula totales
- Muestra información de envío

### PaymentStatus
- Muestra estado actual del pago
- Actualización en tiempo real
- Manejo de diferentes estados

## APIs

### POST /api/payment
- Crea preferencia de pago
- Valida datos del pedido
- Retorna ID de preferencia

### GET /api/payment/status
- Consulta estado de pago
- Retorna detalles actualizados

### POST /api/payment/webhook
- Recibe notificaciones de MercadoPago
- Actualiza estado de pagos
- Dispara eventos necesarios

## Tipos

### Enums
```typescript
enum PaymentProvider {
  MERCADOPAGO = 'mercadopago',
  STRIPE = 'stripe',
  PAYPAL = 'paypal'
}

enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  TRANSFER = 'transfer',
  CASH = 'cash'
}
```

## Testing

### Tarjetas de Prueba
```typescript
const TEST_CARDS = {
  VISA: {
    number: '4509 9535 6623 3704',
    cvv: '123',
    expDate: '11/25',
    status: 'APPROVED'
  },
  MASTERCARD: {
    number: '5031 7557 3453 0604',
    cvv: '123',
    expDate: '11/25',
    status: 'APPROVED'
  }
};
```

### Flujos de Prueba
1. Pago exitoso
2. Pago rechazado
3. Pago pendiente
4. Error en formulario
5. Timeout de pago
6. Reintento de pago

## Próximos Pasos

1. **Fase 1: Configuración Base**
   - Implementar configuración de MercadoPago
   - Definir tipos TypeScript
   - Crear interfaces base

2. **Fase 2: Componentes UI**
   - Implementar PaymentForm
   - Implementar OrderSummary
   - Implementar PaymentStatus

3. **Fase 3: APIs**
   - Implementar endpoint de creación de preferencia
   - Implementar webhook handler
   - Implementar consulta de estado

4. **Fase 4: Testing**
   - Pruebas con tarjetas de test
   - Validación de flujos
   - Manejo de errores
