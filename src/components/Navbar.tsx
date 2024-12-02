/**
 * Navbar: Barra de navegación principal
 *
 * Funcionalidades:
 * - Navegación principal
 * - Menú móvil con dropdown
 * - Carrito con contador de items
 * - Toggle de tema claro/oscuro
 *
 * Hooks y Context utilizados:
 * - useCart(): Para el contador del carrito
 * - useTheme(): Para el toggle de tema
 *
 * Configuración:
 * - Links de navegación en @/config/site.ts
 * - Estilos del tema en globals.css
 *
 * Componentes UI:
 * - DropdownMenu: Menú móvil (@/components/ui/dropdown-menu.tsx)
 * - Button: Botones de acción (@/components/ui/button.tsx)
 * - CartIcon: Icono del carrito con badge (@/components/CartIcon.tsx)
 * - ThemeToggle: Toggle de tema claro/oscuro (@/components/Navbar/theme-toggle.tsx)
 *
 * Responsive:
 * - Móvil: Menú en dropdown
 * - Desktop: Links en horizontal
 *
 * Ejemplo de configuración de links:
 * ```ts
 * // En @/config/site.ts
 * export const siteConfig = {
 *   mainNav: [
 *     { title: "Inicio", href: "/" },
 *     { title: "Menú", href: "/menu" },
 *   ]
 * }
 * ```
 */

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import CartIcon from "./CartIcon";
import { User, Menu as MenuIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/globals";
import { Container } from "@/components/ui/container";

const Navbar = () => {
  const pathname = usePathname();
  
  // No mostrar el navbar en las rutas de admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const { totalItems } = useCart();

  return (
    <div className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* LEFT SECTION - MOBILE MENU & LOGO */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MenuIcon className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  {siteConfig.mainNav.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href}>{item.title}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative w-24 h-8">
                <Image
                  src="/logo.svg"
                  alt={siteConfig.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* CENTER SECTION - DESKTOP MENU */}
          <nav className="hidden md:flex items-center justify-center space-x-6">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* RIGHT SECTION - THEME & CART */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              aria-label="User account"
              className="h-9 w-9"
            >
              <User className="h-5 w-5" />
            </Button>

            <Link href="/cart">
              <CartIcon />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
