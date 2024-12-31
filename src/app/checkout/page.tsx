/**
 * Página de Checkout
 * 
 * Componentes:
 * - Resumen del pedido
 * - Formulario de envío
 * - Botón de pago
 * - Estado del pago
 */

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { Database } from '@/types/supabase';

export const metadata: Metadata = {
  title: 'Checkout | Vera Ecommerce',
  description: 'Completa tu compra en Vera Ecommerce',
};

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  // Verificar autenticación
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login?redirect=/checkout');
  }

  // Obtener datos del usuario
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de envío y pago */}
        <div className="lg:col-span-2 space-y-6">
          <CheckoutForm 
            initialData={{
              firstName: userData?.first_name || '',
              lastName: userData?.last_name || '',
              email: session.user.email || '',
              phone: userData?.phone || '',
              address: userData?.address || undefined,
              identification: userData?.identification || undefined,
            }}
          />
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </main>
  );
}
