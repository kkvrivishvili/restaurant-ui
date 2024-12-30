# 3. Notificaciones

## Tópicos de Notificación

### Eventos Disponibles

| Eventos | Nombre en Panel | Tópico | Productos Asociados |
|---------|----------------|---------|-------------------|
| Pagos | Pagos | `payment` | Checkout API, Pro, Bricks |
| Suscripciones | Planes y suscripciones | `subscription_authorized_payment` | Suscripciones |
| Vinculación | Planes y suscripciones | `subscription_preapproval` | Suscripciones |
| OAuth | Vinculación de aplicaciones | `mp-connect` | Todos con OAuth |
| Fraude | Alertas de fraude | `stop_delivery_op_wh` | Checkout API, PRO |
| Reclamos | Reclamos | `topic_claims_integration_wh` | Todos los productos |
| Tarjetas | Card Updater | `topic_card_id_wh` | Checkout API, Pro, Bricks |

## Tipos de Notificaciones

### 1. Webhooks
- Recomendados para integración
- Utilizan HTTP REST
- Notificación instantánea
- Mayor seguridad mediante clave secreta
- Validación de origen mediante header `x-Signature`

### 2. IPN (Internet Payment Notification)
- Sistema legacy
- No permite validación de origen
- Puede tener retraso en las notificaciones
- Será descontinuado próximamente

## Configuración y Uso

### Activación de Tópicos
1. Mediante panel de "Tus integraciones"
2. Durante la creación de pagos
3. A través de la API de notificaciones

### Procesamiento de Notificaciones
```javascript
// Ejemplo de endpoint para webhooks
app.post('/webhooks', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    switch(type) {
      case 'payment':
        await handlePaymentNotification(data.id);
        break;
      case 'subscription_authorized_payment':
        await handleSubscriptionNotification(data.id);
        break;
      // Otros casos según necesidad
    }
    
    res.status(200).send('OK');
  } catch (error) {
    res.status(500).send('Error processing webhook');
  }
});
```

### Mejores Prácticas
1. Validar la autenticidad de las notificaciones
2. Procesar asincrónicamente
3. Responder rápidamente al webhook
4. Implementar reintentos
5. Mantener logs de las notificaciones