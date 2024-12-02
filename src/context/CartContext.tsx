/**
 * CartContext: Maneja el estado global del carrito de compras
 *
 * Funcionalidades:
 * - Persistencia del carrito en localStorage
 * - Agregar/remover productos
 * - Calcular totales
 * - Notificaciones usando el sistema toast de Radix UI
 *
 * Configuración:
 * - Las notificaciones se pueden personalizar en @/components/ui/toast.tsx
 * - Los precios se manejan en centavos (dividir por 100 para mostrar)
 *
 * Uso:
 * ```tsx
 * // En un componente:
 * const { items, addToCart, removeFromCart } = useCart();
 * ```
 */

"use client";

import { products } from "@/data";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { toast } from "@/components/ui/use-toast";

// Tipos para los items del carrito y el contexto
type CartItem = {
  id: number;
  quantity: number;
  price: number;
  title: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAction, setLastAction] = useState<{
    type: "add" | "remove" | "error";
    productId?: number;
  } | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setLastAction({ type: "error", productId: undefined });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart:", error);
      setLastAction({ type: "error", productId: undefined });
    }
  }, [items]);

  // Handle notifications
  useEffect(() => {
    if (!lastAction) return;

    if (lastAction.type === "error") {
      toast({
        title: "Error",
        description: "Error al procesar el carrito",
        variant: "destructive",
      });
      return;
    }

    const product = lastAction.productId
      ? products.find((p) => p.id === lastAction.productId)
      : null;
    if (!product) return;

    const item = items.find((item) => item.id === lastAction.productId);

    if (lastAction.type === "add") {
      if (item && item.quantity > 1) {
        toast({
          title: "Carrito actualizado",
          description: `Cantidad de ${product.title} aumentada`,
        });
      } else {
        toast({
          title: "Producto agregado",
          description: `${product.title} agregado al carrito`,
        });
      }
    } else if (lastAction.type === "remove") {
      if (!item) {
        toast({
          title: "Producto eliminado",
          description: `${product.title} eliminado del carrito`,
        });
      } else {
        toast({
          title: "Carrito actualizado",
          description: `Cantidad de ${product.title} reducida`,
        });
      }
    }
  }, [lastAction, items]);

  const addToCart = useCallback((productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      setLastAction({ type: "error", productId });
      return;
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === productId);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
        },
      ];
    });

    setLastAction({ type: "add", productId });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      setLastAction({ type: "error", productId });
      return;
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === productId);

      if (existingItem?.quantity === 1) {
        return currentItems.filter((item) => item.id !== productId);
      }

      return currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });

    setLastAction({ type: "remove", productId });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
