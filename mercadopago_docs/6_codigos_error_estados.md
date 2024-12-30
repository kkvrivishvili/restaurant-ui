# 5. Códigos de Error y Estados

## 5.1 Errores de Token

### Errores en la Creación del Token de Tarjeta

| Estado | Detalle | Descripción |
|--------|---------|-------------|
| 106 | Cannot operate between users from different countries | No se pueden realizar pagos entre países diferentes |
| 109 | Invalid number of shares | El medio de pago no procesa pagos en las cuotas seleccionadas |
| 126 | Invalid action for current state | No se pudo procesar el pago |
| 129 | Cannot pay this amount | El medio de pago no procesa pagos del monto seleccionado |
| 145 | Invalid users involved | Conflicto entre usuario de prueba y real |
| 150 | The payer_id cannot do payments | El pagador no puede realizar pagos |
| 151 | The payer_id cannot do payments | El pagador no puede operar con este medio de pago |
| 204 | Unavailable payment_method | El medio de pago no está disponible en este momento |
| 801 | Already posted same request | Pago duplicado, intentar en unos minutos |

## 5.2 Errores de Datos

### Validaciones Client-Side

| Código | Descripción | Mensaje Sugerido |
|--------|-------------|------------------|
| 205 | parameter cardNumber empty | Ingresa el número de tu tarjeta |
| 208 | parameter expirationMonth empty | Elige un mes |
| 209 | parameter expirationYear empty | Elige un año |
| 212 | parameter docType empty | Ingresa tu tipo de documento |
| 213 | parameter docNumber empty | Ingresa tu documento |
| 214 | parameter docNumber invalid | Ingresa tu documento |
| 220 | parameter cardIssuerId empty | Ingresa tu banco |
| 221 | parameter cardholderName empty | Ingresa el nombre y apellido |
| 224 | parameter securityCode empty | Ingresa el código de seguridad |
| E301 | invalid parameter cardNumber | Número de tarjeta inválido |
| 316 | invalid parameter cardholderName | Nombre inválido |

## 5.3 Estados de Pago

### Estados Principales

#### Aprobado (approved)
- `accredited`: Pago acreditado
- `partially_refunded`: Pago con reembolso parcial

#### En Proceso (in_process)
- `pending_contingency`: En procesamiento
- `pending_review_manual`: En revisión
- `pending_capture`: Esperando captura

#### Rechazado (rejected)
- `cc_rejected_bad_filled_card_number`: Número de tarjeta inválido
- `cc_rejected_bad_filled_date`: Fecha inválida
- `cc_rejected_bad_filled_security_code`: Código de seguridad inválido
- `cc_rejected_call_for_authorize`: Requiere autorización
- `cc_rejected_card_disabled`: Tarjeta deshabilitada
- `cc_rejected_duplicated_payment`: Pago duplicado
- `cc_rejected_high_risk`: Pago rechazado por riesgo
- `cc_rejected_insufficient_amount`: Fondos insuficientes

### Detalles de Estado

```javascript
const getPaymentStatus = (status, statusDetail) => {
  const statusMessages = {
    approved: {
      accredited: "¡Pago aprobado! El dinero fue acreditado.",
      partially_refunded: "Pago aprobado con reembolso parcial.",
    },
    in_process: {
      pending_contingency: "El pago está siendo procesado.",
      pending_review_manual: "El pago está en revisión.",
      pending_capture: "Pago autorizado, esperando captura.",
    },
    rejected: {
      cc_rejected_bad_filled_card_number: "Revisa el número de tarjeta.",
      cc_rejected_bad_filled_date: "Revisa la fecha de vencimiento.",
      cc_rejected_high_risk: "Pago rechazado por riesgo.",
      cc_rejected_insufficient_amount: "Fondos insuficientes.",
    }
  };

  return statusMessages[status]?.[statusDetail] || "Estado desconocido";
};
```

### Mensajes al Usuario

Es importante proporcionar mensajes claros al usuario según el estado del pago:

```javascript
const getUserMessage = (paymentResult) => {
  switch(paymentResult.status) {
    case 'approved':
      return `¡Pago aprobado! Se acreditaron $${paymentResult.transaction_amount}`;
    case 'in_process':
      return 'El pago está siendo procesado. Recibirás un email con el resultado.';
    case 'rejected':
      return getErrorMessage(paymentResult.status_detail);
    default:
      return 'Ocurrió un error con el pago. Por favor, intenta nuevamente.';
  }
};

const getErrorMessage = (statusDetail) => {
  const errorMessages = {
    cc_rejected_bad_filled_card_number: 'Revisa el número de tarjeta.',
    cc_rejected_bad_filled_date: 'Revisa la fecha de vencimiento.',
    cc_rejected_bad_filled_security_code: 'Revisa el código de seguridad.',
    cc_rejected_call_for_authorize: 'Debes autorizar el pago con tu banco.',
    cc_rejected_card_disabled: 'Llama a tu banco para activar la tarjeta.',
    cc_rejected_insufficient_amount: 'No hay fondos suficientes.',
    default: 'No pudimos procesar tu pago.'
  };

  return errorMessages[statusDetail] || errorMessages.default;
};
```

## Buenas Prácticas de Manejo de Errores

1. **Validación Preventiva**
   - Validar datos antes de enviar al servidor
   - Mostrar errores de forma amigable
   - Guiar al usuario para corregir errores

2. **Monitoreo y Logging**
   - Registrar todos los errores
   - Monitorear tasas de error
   - Identificar patrones problemáticos

3. **Recuperación de Errores**
   - Implementar reintentos automáticos
   - Ofrecer alternativas al usuario
   - Mantener consistencia en los datos

4. **Seguridad**
   - No mostrar detalles técnicos al usuario
   - Validar todos los inputs
   - Mantener logs seguros