# 4. Gestión de Pagos

## 4.1 Reserva de Fondos

### Proceso de Reserva
La reserva de fondos permite retener temporalmente el monto de una compra en la tarjeta del cliente sin efectuar el cargo definitivo.

### Implementación
```javascript
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'YOUR_ACCESS_TOKEN' });
const payment = new Payment(client);

const createReserve = async () => {
  const body = {
    transaction_amount: 100,
    token: '123456',
    description: 'Mi producto',
    installments: 1,
    payment_method_id: 'visa',
    payer: {
      email: 'user@example.com',
    },
    capture: false  // Indica que es una reserva
  };

  try {
    const result = await payment.create({ 
      body, 
      requestOptions: { idempotencyKey: 'UNIQUE_KEY' }
    });
    return result;
  } catch (error) {
    console.error('Error creating reserve:', error);
  }
};
```

## 4.2 Captura de Pagos

### Captura de Monto Total
```javascript
const capturePayment = async (paymentId) => {
  try {
    const result = await payment.capture({
      id: paymentId,
      requestOptions: { idempotencyKey: 'UNIQUE_KEY' }
    });
    return result;
  } catch (error) {
    console.error('Error capturing payment:', error);
  }
};
```

### Captura de Monto Parcial
```javascript
const capturePartial = async (paymentId, amount) => {
  try {
    const result = await payment.capturePartial({
      id: paymentId,
      transaction_amount: amount,
      requestOptions: { idempotencyKey: 'UNIQUE_KEY' }
    });
    return result;
  } catch (error) {
    console.error('Error capturing partial payment:', error);
  }
};
```

## 4.3 Cancelaciones

### Proceso de Cancelación
```javascript
const cancelPayment = async (paymentId) => {
  try {
    const result = await payment.cancel({
      id: paymentId,
      requestOptions: { idempotencyKey: 'UNIQUE_KEY' }
    });
    return result;
  } catch (error) {
    console.error('Error canceling payment:', error);
  }
};
```

### Condiciones y Restricciones
- Solo disponible para pagos en estado "pending" o "in_process"
- Tiempo límite de 30 días para pagos pendientes
- No aplicable a pagos ya capturados

## 4.4 Reembolsos

### Reembolsos Totales
```javascript
const refundPayment = async (paymentId) => {
  try {
    const result = await payment.refund({
      payment_id: paymentId,
      requestOptions: { idempotencyKey: 'UNIQUE_KEY' }
    });
    return result;
  } catch (error) {
    console.error('Error refunding payment:', error);
  }
};
```

### Reembolsos Parciales
```javascript
const partialRefund = async (paymentId, amount) => {
  try {
    const result = await payment.refund({
      payment_id: paymentId,
      amount: amount,
      requestOptions: { idempotencyKey: 'UNIQUE_KEY' }
    });
    return result;
  } catch (error) {
    console.error('Error processing partial refund:', error);
  }
};
```

### Diferencias con Cancelaciones
- Reembolsos: para pagos ya procesados y capturados
- Cancelaciones: para pagos pendientes o en proceso
- Reembolsos pueden ser parciales o totales
- Cancelaciones siempre son totales