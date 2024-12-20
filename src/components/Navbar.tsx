"use client"

import Link from "next/link"
import { useCart } from "@/context/CartContext"
import CartIcon from "./CartIcon"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export default function Navbar() {
  const { items } = useCart()
  const { user, signOut } = useAuth()

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <span className="font-bold">VERA</span>
        </Link>

        <div className="flex-1 flex items-center justify-end space-x-4">
          <Link href="/store" className="text-foreground/60 hover:text-foreground">
            Tienda
          </Link>
          
          <Link href="/cart" className="relative">
            <CartIcon count={items.length} />
          </Link>

          <ThemeToggle />

          {user ? (
            <Button variant="ghost" onClick={() => signOut()}>
              Salir
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="ghost">Ingresar</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
