/**
 * Utilidades de formateo
 */

/**
 * Formatea un precio en centavos a formato de moneda
 * @param price Precio en centavos
 * @returns String formateado (ej: $99.99)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(price);
}
