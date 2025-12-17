-- =====================================================
-- MIGRATION 007: Row Level Security (RLS) Policies
-- =====================================================
-- Purpose: Granular access control for all tables
-- Security: Following Supabase RLS best practices
-- Reference: https://supabase.com/docs/guides/database/postgres/row-level-security
-- =====================================================

-- =====================================================
-- SECTION 1: Profiles Policies
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (but NOT their role)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT role FROM profiles WHERE id = auth.uid()) -- Prevent role escalation
  );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- Super admins can update any profile (including roles)
CREATE POLICY "Super admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- =====================================================
-- SECTION 2: Categories Policies
-- =====================================================

-- Everyone can view active categories
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = TRUE);

-- Admins can view all categories (including inactive)
CREATE POLICY "Admins can view all categories"
  ON categories FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- Admins can manage categories (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- =====================================================
-- SECTION 3: Products Policies
-- =====================================================

-- Everyone can view active products
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = TRUE);

-- Admins can view all products (including inactive)
CREATE POLICY "Admins can view all products"
  ON products FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- Admins can manage products
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- =====================================================
-- SECTION 4: Product Images Policies
-- =====================================================

-- Everyone can view product images (via active products)
CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.is_active = TRUE
    )
  );

-- Admins can manage product images
CREATE POLICY "Admins can manage product images"
  ON product_images FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- =====================================================
-- SECTION 5: Variants Policies
-- =====================================================

-- Everyone can view active variants (via active products)
CREATE POLICY "Anyone can view active variants"
  ON variants FOR SELECT
  USING (
    is_active = TRUE AND
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = variants.product_id
      AND products.is_active = TRUE
    )
  );

-- Admins can manage variants
CREATE POLICY "Admins can manage variants"
  ON variants FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- =====================================================
-- SECTION 6: Inventory Policies
-- =====================================================

-- Everyone can view inventory (public stock levels)
CREATE POLICY "Anyone can view inventory"
  ON inventory FOR SELECT
  USING (TRUE);

-- Admins can manage inventory
CREATE POLICY "Admins can manage inventory"
  ON inventory FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- =====================================================
-- SECTION 7: Addresses Policies
-- =====================================================

-- Users can manage their own addresses
CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL
  USING (auth.uid() = user_id);

-- Admins can view all addresses
CREATE POLICY "Admins can view all addresses"
  ON addresses FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- =====================================================
-- SECTION 8: Carts Policies
-- =====================================================

-- Users can manage their own cart
CREATE POLICY "Users can manage own cart"
  ON carts FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- SECTION 9: Cart Items Policies
-- =====================================================

-- Users can manage their cart items
CREATE POLICY "Users can manage own cart items"
  ON cart_items FOR ALL
  USING (
    cart_id IN (
      SELECT id FROM carts WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- SECTION 10: Orders Policies
-- =====================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- Admins can update orders (status changes)
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- =====================================================
-- SECTION 11: Order Items Policies
-- =====================================================

-- Users can view their order items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- Users can insert order items (during checkout)
CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- =====================================================
-- SECTION 12: Discounts Policies
-- =====================================================

-- Anyone can view active discounts
CREATE POLICY "Anyone can view active discounts"
  ON discounts FOR SELECT
  USING (is_active = TRUE);

-- Admins can manage discounts
CREATE POLICY "Admins can manage discounts"
  ON discounts FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- =====================================================
-- SECTION 13: Logs Policies
-- =====================================================

-- Only admins can view logs
CREATE POLICY "Admins can view logs"
  ON logs FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- System can insert logs (for audit trail)
CREATE POLICY "System can insert logs"
  ON logs FOR INSERT
  WITH CHECK (TRUE);

-- =====================================================
-- SECTION 14: Admin Invitations Policies
-- =====================================================

-- Only super admins can manage invitations
CREATE POLICY "Super admins can manage invitations"
  ON admin_invitations FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Anyone can view invitation by token (for accepting)
CREATE POLICY "Anyone can view invitation by token"
  ON admin_invitations FOR SELECT
  USING (TRUE); -- Token validation happens in application logic

-- =====================================================
-- END OF MIGRATION 007
-- =====================================================

-- Verification: Check that all tables have RLS enabled
DO $$
DECLARE
  table_record RECORD;
  tables_without_rls TEXT[] := ARRAY[]::TEXT[];
BEGIN
  FOR table_record IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename NOT IN ('spatial_ref_sys') -- Exclude PostGIS system table if exists
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = table_record.tablename
      AND rowsecurity = true
    ) THEN
      tables_without_rls := array_append(tables_without_rls, table_record.tablename);
    END IF;
  END LOOP;

  IF array_length(tables_without_rls, 1) > 0 THEN
    RAISE WARNING 'The following tables do NOT have RLS enabled: %', array_to_string(tables_without_rls, ', ');
  ELSE
    RAISE NOTICE 'SUCCESS: All public tables have RLS enabled!';
  END IF;
END $$;
