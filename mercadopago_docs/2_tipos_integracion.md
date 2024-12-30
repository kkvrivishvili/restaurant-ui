# 1. Tipos de Integración

## Comparativa de Tipos de Integración

La integración con Checkout API se puede realizar mediante diferentes procedimientos que varían según los conocimientos técnicos y las necesidades de negocio.

| Tipo de integración | Medios de pago | Complejidad front-end | User interface (UI) |
|---------------------|----------------|----------------------|-------------------|
| Checkout Bricks | Crédito, débito, Pago Fácil, Rapipago, Cuenta de Mercado Pago y Pago a cuotas sin tarjeta | Fácil | Componentes con UI predefinida y personalizable |
| Cardform | Todos los medios disponibles | Medio | Formulario sin opciones de estilización para empezar desde cero |
| Métodos Core | Todos los medios disponibles | Alto | Crea tu formulario y su estilización |

## Certificación PCI SAQ A

Los tres tipos de integración son elegibles para la certificación PCI SAQ A. Esto se debe a que los datos sensibles de la tarjeta (número, CVV y fecha de vencimiento) viajan a través de un iframe directamente a los servidores de Mercado Pago, evitando que sean accesibles a terceros.

## Requisitos Previos

### 1. Aplicación
- Las aplicaciones representan las diversas integraciones contenidas en una o varias tiendas
- Se recomienda crear una aplicación para cada solución implementada
- Facilita la organización y control de las integraciones

### 2. Credenciales
- Son claves únicas proporcionadas para configurar integraciones
- Se necesitan dos pares de credenciales:
  - Credenciales de prueba: para testing
  - Credenciales de producción: para pagos reales

### 3. MercadoPago.js
- Biblioteca que gestiona datos de tarjetas de forma segura
- Cumple con requisitos de seguridad necesarios
- Evita el envío de datos sensibles a servidores propios
- Genera tokens que representan la información de forma segura

## Medios de Pago Adicionales
Para obtener una lista completa de las opciones de pago disponibles:
- Realizar una petición GET al endpoint `/v1/payment_methods`
- La respuesta incluirá todas las opciones de pago disponibles para la integración