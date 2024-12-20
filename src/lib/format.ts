/**
 * Utilidades de formateo para la aplicación
 * 
 * formatPrice:
 * - Formatea un precio en centavos a formato moneda
 * - Ejemplo: 2500 -> "$25.00"
 * - Los precios se almacenan en centavos para evitar errores de punto flotante
 * 
 * Uso:
 * ```ts
 * const price = 2500; // $25.00
 * formatPrice(price); // -> "$25.00"
 * ```
 * 
 * Configuración:
 * - El símbolo de moneda y el formato se pueden modificar aquí
 * - Considera usar Intl.NumberFormat para internacionalización
 */

export const formatPrice = (price: number | null | undefined): string => {
  if (price == null) return "$0.00";
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(price/100);
};

export const formatNumber = (num: number, padLength: number = 2): string => {
  return String(num).padStart(padLength, '0');
};

export const cn = (...classes: string[]): string => {
  return classes.filter(Boolean).join(' ');
};
