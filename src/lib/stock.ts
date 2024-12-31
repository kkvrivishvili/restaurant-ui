/**
 * Manejo de stock para productos
 * 
 * Funcionalidades:
 * - Bloqueo temporal de stock
 * - Actualización de stock
 * - Liberación de stock bloqueado
 */

import supabase from '@/utils/supabase';

interface StockItem {
  productId: string;
  quantity: number;
}

export async function blockStock(items: StockItem[], orderId: string) {
  // Iniciar transacción
  const { data: transaction, error: transactionError } = await supabase
    .rpc('begin_transaction');

  if (transactionError) {
    throw new Error('Error al iniciar la transacción de stock');
  }

  try {
    // Verificar y bloquear stock para cada item
    for (const item of items) {
      const { data, error } = await supabase
        .from('products')
        .select('stock_quantity, blocked_stock')
        .eq('id', item.productId)
        .single();

      if (error) throw error;
      if (!data) throw new Error(`Producto ${item.productId} no encontrado`);

      const availableStock = data.stock_quantity - (data.blocked_stock || 0);
      if (availableStock < item.quantity) {
        throw new Error(`Stock insuficiente para el producto ${item.productId}`);
      }

      // Actualizar blocked_stock
      const { error: updateError } = await supabase
        .from('products')
        .update({
          blocked_stock: (data.blocked_stock || 0) + item.quantity
        })
        .eq('id', item.productId);

      if (updateError) throw updateError;

      // Registrar el bloqueo
      const { error: blockError } = await supabase
        .from('stock_blocks')
        .insert({
          product_id: item.productId,
          order_id: orderId,
          quantity: item.quantity,
          expires_at: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
        });

      if (blockError) throw blockError;
    }

    // Confirmar transacción
    const { error: commitError } = await supabase
      .rpc('commit_transaction');

    if (commitError) throw commitError;

  } catch (error) {
    // Rollback en caso de error
    await supabase.rpc('rollback_transaction');
    throw error;
  }
}

export async function confirmStock(orderId: string) {
  // Obtener los bloqueos de stock para la orden
  const { data: blocks, error: blocksError } = await supabase
    .from('stock_blocks')
    .select('product_id, quantity')
    .eq('order_id', orderId);

  if (blocksError) throw blocksError;
  if (!blocks || blocks.length === 0) return;

  // Iniciar transacción
  const { error: transactionError } = await supabase
    .rpc('begin_transaction');

  if (transactionError) throw transactionError;

  try {
    for (const block of blocks) {
      // Actualizar stock y blocked_stock
      const { error: updateError } = await supabase
        .from('products')
        .update({
          stock_quantity: supabase.raw('stock_quantity - ?', [block.quantity]),
          blocked_stock: supabase.raw('blocked_stock - ?', [block.quantity])
        })
        .eq('id', block.product_id);

      if (updateError) throw updateError;
    }

    // Eliminar los bloqueos
    const { error: deleteError } = await supabase
      .from('stock_blocks')
      .delete()
      .eq('order_id', orderId);

    if (deleteError) throw deleteError;

    // Confirmar transacción
    const { error: commitError } = await supabase
      .rpc('commit_transaction');

    if (commitError) throw commitError;

  } catch (error) {
    // Rollback en caso de error
    await supabase.rpc('rollback_transaction');
    throw error;
  }
}

export async function releaseStock(orderId: string) {
  // Obtener los bloqueos de stock para la orden
  const { data: blocks, error: blocksError } = await supabase
    .from('stock_blocks')
    .select('product_id, quantity')
    .eq('order_id', orderId);

  if (blocksError) throw blocksError;
  if (!blocks || blocks.length === 0) return;

  // Iniciar transacción
  const { error: transactionError } = await supabase
    .rpc('begin_transaction');

  if (transactionError) throw transactionError;

  try {
    for (const block of blocks) {
      // Actualizar blocked_stock
      const { error: updateError } = await supabase
        .from('products')
        .update({
          blocked_stock: supabase.raw('blocked_stock - ?', [block.quantity])
        })
        .eq('id', block.product_id);

      if (updateError) throw updateError;
    }

    // Eliminar los bloqueos
    const { error: deleteError } = await supabase
      .from('stock_blocks')
      .delete()
      .eq('order_id', orderId);

    if (deleteError) throw deleteError;

    // Confirmar transacción
    const { error: commitError } = await supabase
      .rpc('commit_transaction');

    if (commitError) throw commitError;

  } catch (error) {
    // Rollback en caso de error
    await supabase.rpc('rollback_transaction');
    throw error;
  }
}

// Tarea programada para liberar bloqueos expirados
export async function cleanupExpiredBlocks() {
  const { data: expiredBlocks, error: blocksError } = await supabase
    .from('stock_blocks')
    .select('order_id')
    .lt('expires_at', new Date().toISOString())
    .limit(100);

  if (blocksError) throw blocksError;
  if (!expiredBlocks || expiredBlocks.length === 0) return;

  for (const block of expiredBlocks) {
    await releaseStock(block.order_id);
  }
}
