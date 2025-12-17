-- =====================================================
-- MIGRATION 006: Database Functions
-- =====================================================
-- Purpose: Business logic functions for inventory, orders, and auth
-- Functions: 7 total (inventory management, order generation, auth trigger)
-- Dependencies: All previous migrations
-- =====================================================

-- =====================================================
-- SECTION 1: Auto-Create Profile Function & Trigger
-- =====================================================
-- Purpose: Automatically create profile when user signs up via Supabase Auth
-- Trigger: Fires after INSERT on auth.users

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

COMMENT ON FUNCTION handle_new_user() IS 'Auto-creates profile in public.profiles when user signs up. SECURITY DEFINER allows trigger to bypass RLS.';

-- =====================================================
-- SECTION 2: Get Available Stock Function
-- =====================================================
-- Purpose: Calculate real-time available stock (quantity - reserved)
-- Returns: INTEGER (0 if variant not found)

CREATE OR REPLACE FUNCTION get_available_stock(p_variant_id UUID)
RETURNS INTEGER AS $$
DECLARE
  available INTEGER;
BEGIN
  SELECT (quantity - reserved) INTO available
  FROM inventory
  WHERE variant_id = p_variant_id;

  -- Return 0 if variant not found
  RETURN COALESCE(available, 0);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_available_stock(UUID) IS 'Returns available stock for a variant (quantity - reserved). Returns 0 if variant not found.';

-- =====================================================
-- SECTION 3: Reserve Inventory Function
-- =====================================================
-- Purpose: Atomically reserve stock during checkout (prevents race conditions)
-- Returns: BOOLEAN (TRUE if successful, FALSE if insufficient stock)

CREATE OR REPLACE FUNCTION reserve_inventory(
  p_variant_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  current_available INTEGER;
BEGIN
  -- Lock the row for update (prevents race conditions)
  SELECT (quantity - reserved) INTO current_available
  FROM inventory
  WHERE variant_id = p_variant_id
  FOR UPDATE;

  -- Check if enough stock is available
  IF current_available >= p_quantity THEN
    -- Reserve the stock
    UPDATE inventory
    SET reserved = reserved + p_quantity,
        updated_at = NOW()
    WHERE variant_id = p_variant_id;

    RETURN TRUE;
  ELSE
    -- Insufficient stock
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION reserve_inventory(UUID, INTEGER) IS 'Atomically reserves stock during checkout. Uses FOR UPDATE lock to prevent race conditions. Returns TRUE if successful, FALSE if insufficient stock.';

-- =====================================================
-- SECTION 4: Release Inventory Function
-- =====================================================
-- Purpose: Unlock reserved stock (called on payment timeout or cancellation)
-- Returns: VOID

CREATE OR REPLACE FUNCTION release_inventory(
  p_variant_id UUID,
  p_quantity INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE inventory
  SET reserved = GREATEST(0, reserved - p_quantity),
      updated_at = NOW()
  WHERE variant_id = p_variant_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION release_inventory(UUID, INTEGER) IS 'Releases reserved stock. Called on payment timeout or order cancellation. Uses GREATEST to ensure reserved never goes negative.';

-- =====================================================
-- SECTION 5: Commit Inventory Function
-- =====================================================
-- Purpose: Deduct stock after successful payment
-- Returns: VOID

CREATE OR REPLACE FUNCTION commit_inventory(
  p_variant_id UUID,
  p_quantity INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE inventory
  SET quantity = quantity - p_quantity,
      reserved = reserved - p_quantity,
      updated_at = NOW()
  WHERE variant_id = p_variant_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION commit_inventory(UUID, INTEGER) IS 'Commits inventory on successful payment. Deducts from both quantity and reserved. Called after Stripe payment succeeds.';

-- =====================================================
-- SECTION 6: Generate Order Number Function
-- =====================================================
-- Purpose: Generate sequential order numbers (format: YYYYMM00001)
-- Returns: TEXT

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  year_month TEXT;
  next_number INTEGER;
  order_number TEXT;
BEGIN
  -- Get current year-month (e.g., "202412")
  year_month := TO_CHAR(NOW(), 'YYYYMM');

  -- Find the highest number used this month and increment
  SELECT COALESCE(
    MAX(
      CAST(
        SUBSTRING(order_number FROM 7) AS INTEGER
      )
    ), 0
  ) + 1
  INTO next_number
  FROM orders
  WHERE order_number LIKE year_month || '%';

  -- Format: YYYYMM00001
  order_number := year_month || LPAD(next_number::TEXT, 5, '0');

  RETURN order_number;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_order_number() IS 'Generates sequential order numbers in format YYYYMM00001. Resets monthly for easier tracking.';

-- =====================================================
-- SECTION 7: Check Low Stock Function
-- =====================================================
-- Purpose: Get all variants below low stock threshold
-- Returns: TABLE of variant details with current stock levels

CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TABLE (
  variant_id UUID,
  product_name TEXT,
  variant_name TEXT,
  sku TEXT,
  current_quantity INTEGER,
  low_stock_threshold INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id AS variant_id,
    p.name AS product_name,
    v.name AS variant_name,
    v.sku,
    i.quantity AS current_quantity,
    i.low_stock_threshold
  FROM inventory i
  JOIN variants v ON i.variant_id = v.id
  JOIN products p ON v.product_id = p.id
  WHERE i.quantity <= i.low_stock_threshold
  ORDER BY i.quantity ASC, p.name ASC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_low_stock() IS 'Returns all variants below their low stock threshold. Used for admin dashboard alerts.';

-- =====================================================
-- SECTION 8: Calculate Cart Total Function
-- =====================================================
-- Purpose: Calculate total price for a cart (including variant prices)
-- Returns: DECIMAL

CREATE OR REPLACE FUNCTION calculate_cart_total(p_cart_id UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  cart_total DECIMAL(10,2);
BEGIN
  SELECT COALESCE(SUM(
    (p.base_price + v.price_adjustment) * ci.quantity
  ), 0)
  INTO cart_total
  FROM cart_items ci
  JOIN variants v ON ci.variant_id = v.id
  JOIN products p ON v.product_id = p.id
  WHERE ci.cart_id = p_cart_id
  AND v.is_active = TRUE
  AND p.is_active = TRUE;

  RETURN cart_total;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_cart_total(UUID) IS 'Calculates total price for a cart. Formula: SUM((base_price + price_adjustment) * quantity). Only includes active products/variants.';

-- =====================================================
-- END OF MIGRATION 006
-- =====================================================
