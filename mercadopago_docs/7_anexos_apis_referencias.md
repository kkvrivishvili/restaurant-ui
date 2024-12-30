# 6. Anexos y Referencias

## APIs y Endpoints

### Endpoints Principales
| Endpoint | Método | Descripción |
|----------|---------|------------|
| `/v1/payments` | POST | Crear un nuevo pago |
| `/v1/payments/:id` | GET | Obtener información de un pago |
| `/v1/payments/:id/refunds` | POST | Crear un reembolso |
| `/v1/payment_methods` | GET | Obtener métodos de pago disponibles |
| `/v1/card_tokens` | POST | Crear token de tarjeta |

### Headers Requeridos
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_ACCESS_TOKEN",
  "X-Idempotency-Key": "UNIQUE_KEY"
}
```

## SDKs Disponibles

### SDK JavaScript (Frontend)
```bash
# Instalación via npm
npm install @mercadopago/sdk-js
```

### SDK Node.js (Backend)
```bash
# Instalación via npm
npm install mercadopago
```

### Otros SDKs Oficiales
- PHP: `composer require mercadopago/dx-php`
- Python: `pip install mercadopago`
- Java: Available through Maven
- .NET: Available through NuGet

## Recursos de Desarrollo

### Herramientas de Testing
1. **Tarjetas de Prueba**
   ```javascript
   // Tarjetas para testing
   const testCards = {
     visa: {
       number: "4509 9535 6623 3704",
       cvv: "123",
       expDate: "11/25"
     },
     mastercard: {
       number: "5031 7557 3453 0604",
       cvv: "123",
       expDate: "11/25"
     }
   };
   ```

2. **Usuarios de Prueba**
   - Crear usuarios de prueba en el panel de desarrolladores
   - Usar credenciales de prueba para testing

### Ambientes
1. **Sandbox**
   - URL Base: `https://api.mercadopago.com/sandbox`
   - Para pruebas y desarrollo
   - Sin transacciones reales

2. **Producción**
   - URL Base: `https://api.mercadopago.com`
   - Para transacciones reales
   - Requiere credenciales de producción

## Enlaces Importantes

### Documentación Oficial
- [Documentación General](https://www.mercadopago.com.ar/developers/es/docs)
- [Referencias de API](https://www.mercadopago.com.ar/developers/es/reference)
- [Guías de Integración](https://www.mercadopago.com.ar/developers/es/guides)

### Soporte y Ayuda
- [Centro de Desarrolladores](https://www.mercadopago.com.ar/developers/es)
- [Foro de Desarrolladores](https://github.com/mercadopago)
- [Status Page](https://status.mercadopago.com)

## Glosario de Términos

### Términos Técnicos
| Término | Descripción |
|---------|-------------|
| Token | Representación segura de datos de tarjeta |
| Cardform | Formulario de captura de datos de tarjeta |
| Webhook | Notificación HTTP en tiempo real |
| IPN | Internet Payment Notification (legacy) |

### Estados de Pago
| Estado | Descripción |
|--------|-------------|
| approved | Pago aprobado y acreditado |
| in_process | Pago en proceso de revisión |
| rejected | Pago rechazado |
| cancelled | Pago cancelado |
| refunded | Pago reembolsado |

## Actualizaciones y Cambios

### Versiones de API
- v1: Versión actual estable
- v0: Deprecada (no usar)

### Cambios Importantes
1. Deprecación de IPN
2. Nuevos requisitos de seguridad
3. Actualizaciones de SDK

## Requerimientos Técnicos

### Requisitos Mínimos
- Node.js 12 o superior
- SSL/TLS para endpoints de producción
- Soporte para CORS en endpoints de backend
- Compatibilidad con ES6+

### Recomendaciones de Seguridad
1. Implementar HTTPS
2. Usar tokens de manera segura
3. Validar todas las entradas
4. Mantener SDKs actualizados
5. Implementar manejo de errores robusto

## Ejemplos de Implementación

### Ejemplos de Código Completos
- [GitHub Repository](https://github.com/mercadopago/sdk-js)
- [Code Samples](https://github.com/mercadopago/code-examples)
- [Demo Projects](https://github.com/mercadopago/demo)