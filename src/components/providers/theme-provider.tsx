/**
 * ThemeProvider: Proveedor de tema claro/oscuro para la aplicación
 * 
 * Funcionalidades:
 * - Manejo de tema claro/oscuro
 * - Persistencia del tema en localStorage
 * - Sincronización con preferencias del sistema
 * 
 * Hooks disponibles:
 * - useTheme(): { theme, setTheme }
 *   theme: 'light' | 'dark' | 'system'
 * 
 * Configuración:
 * - Los estilos de tema se definen en globals.css
 * - Usa las variables CSS de Tailwind para colores
 * 
 * Uso:
 * ```tsx
 * // En _app.tsx o layout.tsx
 * <ThemeProvider attribute="class" defaultTheme="system">
 *   <App />
 * </ThemeProvider>
 * 
 * // En cualquier componente
 * const { theme, setTheme } = useTheme();
 * ```
 * 
 * Nota: Basado en next-themes para manejo de tema en Next.js
 */

"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
