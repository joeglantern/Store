-- Verification script for database schema
-- Run this in Supabase Dashboard SQL Editor

-- Check all tables created
SELECT
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Expected output: 14 tables, all with RLS enabled
-- addresses, admin_invitations, cart_items, carts, categories,
-- discounts, inventory, logs, order_items, orders,
-- product_images, products, profiles, variants

-- Check all functions created
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Expected output: 9 functions
-- calculate_cart_total, check_low_stock, commit_inventory,
-- generate_order_number, get_available_stock, handle_new_user,
-- release_inventory, reserve_inventory, update_updated_at_column

-- Check indexes created
SELECT
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
