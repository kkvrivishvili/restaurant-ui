/**
 * CartContext: Maneja el estado global del carrito de compras
 *
 * Funcionalidades:
 * - Persistencia del carrito en Supabase y localStorage como respaldo
 * - Agregar/remover productos
 * - Calcular totales
 * - Notificaciones usando el sistema toast de Radix UI
 *
 * Uso:
 * ```tsx
 * // En un componente:
 * const { items, addToCart, removeFromCart } = useCart();
 * ```
 */

'use client';

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNotification } from "@/hooks/useNotification";
import supabase from "@/utils/supabase";
import { type Database } from "@/types/supabase";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
  stock_quantity: number;
  is_active: boolean;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { notifyCart } = useNotification();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Load cart from Supabase and localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: cartItems } = await supabase
            .from('cart_items')
            .select(`
              quantity,
              products (
                id,
                title,
                price,
                image_url,
                stock_quantity,
                is_active
              )
            `)
            .eq('user_id', session.user.id);

          if (cartItems) {
            const formattedItems = cartItems.map(item => ({
              ...item.products,
              quantity: item.quantity
            })) as CartItem[];
            
            setItems(formattedItems);
            return;
          }
        }

        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        notifyCart.error("No se pudo cargar el carrito");
      } finally {
        setIsInitialized(true);
      }
    };

    loadCart();
  }, [notifyCart]);

  // Save cart to Supabase and localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    
    const saveCart = async () => {
      try {
        localStorage.setItem("cart", JSON.stringify(items));

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', session.user.id);

          if (items.length > 0) {
            const cartItems = items.map(item => ({
              user_id: session.user.id,
              product_id: item.id,
              quantity: item.quantity
            }));

            await supabase.from('cart_items').insert(cartItems);
          }
        }
      } catch (error) {
        console.error("Error saving cart:", error);
        notifyCart.error("No se pudo guardar el carrito");
      }
    };

    saveCart();
  }, [items, isInitialized, notifyCart]);

  const addToCart = useCallback(async (productId: string) => {
    setIsLoading(true);
    try {
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!product) {
        notifyCart.error("Producto no encontrado");
        return;
      }

      if (!product.is_active) {
        notifyCart.error("Este producto no está disponible");
        return;
      }

      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === productId);
        
        if (existingItem) {
          if (existingItem.quantity >= product.stock_quantity) {
            notifyCart.error("No hay más stock disponible");
            return currentItems;
          }

          const updatedItems = currentItems.map(item =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          return updatedItems;
        }
        
        const newItem = { ...product, quantity: 1 } as CartItem;
        return [...currentItems, newItem];
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      notifyCart.error("No se pudo agregar el producto al carrito");
    } finally {
      setIsLoading(false);
    }
  }, [notifyCart]);

  const removeFromCart = useCallback((productId: string) => {
    setItems(currentItems => {
      const item = currentItems.find(item => item.id === productId);
      if (item) {
        setTimeout(() => notifyCart.itemRemoved(item.title), 0);
      }
      return currentItems.filter(item => item.id !== productId);
    });
  }, [notifyCart]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 0) return;

    setItems(currentItems => {
      const item = currentItems.find(item => item.id === productId);
      if (!item) return currentItems;

      if (quantity > item.stock_quantity) {
        setTimeout(() => notifyCart.error("No hay suficiente stock disponible"), 0);
        return currentItems;
      }

      if (quantity === 0) {
        return currentItems.filter(item => item.id !== productId);
      }

      const updatedItems = currentItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );

      setTimeout(() => notifyCart.quantityUpdated(item.title, quantity), 0);
      return updatedItems;
    });
  }, [notifyCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
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
