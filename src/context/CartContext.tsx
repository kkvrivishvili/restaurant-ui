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

"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import supabase from "@/utils/supabase";
import { type Database } from "@/types/supabase";

// Tipos para los items del carrito y el contexto
type Product = Database["public"]["Tables"]["products"]["Row"];
type CartItem = Product & { quantity: number };

type CartContextType = {
  items: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from Supabase and localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        // Primero intentamos cargar desde Supabase si hay un usuario autenticado
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: cartItems } = await supabase
            .from('cart_items')
            .select(`
              quantity,
              products (
                id,
                title,
                description,
                image_url,
                price,
                discount_price,
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

        // Si no hay usuario o falla la carga desde Supabase, usamos localStorage como respaldo
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el carrito",
          variant: "destructive",
        });
      }
      setIsInitialized(true);
    };

    loadCart();
  }, []);

  // Save cart to Supabase and localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    
    const saveCart = async () => {
      try {
        // Guardamos en localStorage como respaldo
        localStorage.setItem("cart", JSON.stringify(items));

        // Si hay un usuario autenticado, guardamos en Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Primero eliminamos todos los items del carrito del usuario
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', session.user.id);

          // Luego insertamos los nuevos items
          if (items.length > 0) {
            const cartItems = items.map(item => ({
              user_id: session.user.id,
              product_id: item.id,
              quantity: item.quantity
            }));

            await supabase
              .from('cart_items')
              .insert(cartItems);
          }
        }
      } catch (error) {
        console.error("Error saving cart:", error);
        toast({
          title: "Error",
          description: "No se pudo guardar el carrito",
          variant: "destructive",
        });
      }
    };

    saveCart();
  }, [items, isInitialized]);

  const addToCart = useCallback(async (productId: string) => {
    try {
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!product) {
        toast({
          title: "Error",
          description: "Producto no encontrado",
          variant: "destructive",
        });
        return;
      }

      if (!product.is_active) {
        toast({
          title: "Error",
          description: "Este producto no está disponible",
          variant: "destructive",
        });
        return;
      }

      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === productId);
        
        if (existingItem) {
          // Verificar stock antes de incrementar
          if (existingItem.quantity >= product.stock_quantity) {
            toast({
              title: "Error",
              description: "No hay más stock disponible",
              variant: "destructive",
            });
            return currentItems;
          }

          return currentItems.map(item =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        
        return [...currentItems, { ...product, quantity: 1 }];
      });

      toast({
        title: "Éxito",
        description: "Producto agregado al carrito",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
        variant: "destructive",
      });
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(currentItems => {
      return currentItems.filter(item => item.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity < 0) return;

    try {
      // Verificar stock disponible
      const { data: product } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', productId)
        .single();

      if (product && quantity > product.stock_quantity) {
        toast({
          title: "Error",
          description: "No hay suficiente stock disponible",
          variant: "destructive",
        });
        return;
      }

      setItems(currentItems => {
        return currentItems.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        ).filter(item => item.quantity > 0);
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad",
        variant: "destructive",
      });
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toast({
      title: "Éxito",
      description: "Carrito vaciado",
    });
  }, []);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => {
    const price = item.discount_price || item.price;
    return total + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
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
