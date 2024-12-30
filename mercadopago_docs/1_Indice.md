# Índice de Documentación Checkout API

## 1. Tipos de Integración
- Comparativa de tipos de integración
  - Checkout Bricks
  - Cardform
  - Métodos Core
- Certificación PCI SAQ A
- Requisitos Previos
  - Aplicación
  - Credenciales
  - MercadoPago.js

## 2. Integración de Pagos con Tarjeta
- Importar MercadoPago.js
- Configurar Credenciales
- Añadir Formulario de Pago
  - Estructura HTML
  - Estilos básicos
- Inicializar Formulario de Pago
  - Configuración del CardForm
  - Callbacks y eventos
- Enviar Pago
  - Procesamiento en backend
  - Manejo de respuestas

## 3. Notificaciones
- Tópicos de Notificación
  - Eventos disponibles
  - Productos asociados
- Tipos de Notificaciones
  - Webhooks
  - IPN (Internet Payment Notification)
- Configuración y Uso
  - Activación de tópicos
  - Procesamiento de notificaciones

## 4. Gestión de Pagos
### 4.1 Reserva de Fondos
- Proceso de reserva
- Implementación

### 4.2 Captura de Pagos
- Captura de monto total
- Captura de monto parcial
- Tiempos límite

### 4.3 Cancelaciones
- Proceso de cancelación
- Condiciones y restricciones

### 4.4 Reembolsos
- Reembolsos totales
- Reembolsos parciales
- Diferencias con cancelaciones

## 5. Códigos de Error y Estados
### 5.1 Errores de Token
- Errores en la creación
- Códigos de estado

### 5.2 Errores de Datos
- Validaciones client-side
- Errores de formato

### 5.3 Estados de Pago
- Estados principales
  - Aprobado
  - En proceso
  - Rechazado
  - Cancelado
- Detalles de estado
- Mensajes al usuario

## 6. Anexos y Referencias
- APIs y Endpoints
- SDKs disponibles
- Recursos adicionales