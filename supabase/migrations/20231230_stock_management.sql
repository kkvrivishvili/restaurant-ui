-- Agregar columna blocked_stock a la tabla products
ALTER TABLE products
ADD COLUMN blocked_stock INTEGER NOT NULL DEFAULT 0;

-- Crear tabla para bloqueos de stock
CREATE TABLE stock_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT positive_quantity CHECK (quantity > 0)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_stock_blocks_order_id ON stock_blocks(order_id);
CREATE INDEX idx_stock_blocks_product_id ON stock_blocks(product_id);
CREATE INDEX idx_stock_blocks_expires_at ON stock_blocks(expires_at);

-- Función para iniciar transacción
CREATE OR REPLACE FUNCTION begin_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Iniciar transacción con el nivel de aislamiento más alto
  BEGIN;
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
END;
$$;

-- Función para confirmar transacción
CREATE OR REPLACE FUNCTION commit_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  COMMIT;
END;
$$;

-- Función para rollback de transacción
CREATE OR REPLACE FUNCTION rollback_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  ROLLBACK;
END;
$$;

-- Políticas RLS
ALTER TABLE stock_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stock blocks are viewable by order owner"
  ON stock_blocks
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM orders 
      WHERE id = stock_blocks.order_id
    )
  );

-- Trigger para validar stock antes de bloquear
CREATE OR REPLACE FUNCTION validate_stock_block()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  available_stock INTEGER;
BEGIN
  -- Obtener stock disponible
  SELECT (stock_quantity - COALESCE(blocked_stock, 0))
  INTO available_stock
  FROM products
  WHERE id = NEW.product_id;

  -- Validar que hay suficiente stock
  IF available_stock < NEW.quantity THEN
    RAISE EXCEPTION 'Stock insuficiente';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER check_stock_before_block
  BEFORE INSERT ON stock_blocks
  FOR EACH ROW
  EXECUTE FUNCTION validate_stock_block();
