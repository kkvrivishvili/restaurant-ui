"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const Footer = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // No mostrar el footer en las rutas de admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between py-6 md:py-8">
          <Link 
            href="/" 
            className="text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            VERA
          </Link>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            {currentYear} Vera Ecommerce. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
