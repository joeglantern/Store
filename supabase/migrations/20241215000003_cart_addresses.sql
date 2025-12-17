-- =====================================================
-- MIGRATION 003: Shopping Experience Tables
-- =====================================================
-- Purpose: Enable cart and address management for shopping
-- Tables: addresses, carts, cart_items
-- Dependencies: profiles (from migration 001), variants (from migration 002)
-- =====================================================

-- =====================================================
-- SECTION 1: Addresses Table
-- =====================================================
-- Purpose: Customer shipping and billing addresses
-- Relationship: Many-to-one with profiles (users can have multiple addresses)
-- RLS: Enabled (users manage own addresses, admins view all)

CREATE TABLE addresses (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User relationship
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Contact information
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Address details
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',

  -- Default address flag
  is_default BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_is_default ON addresses(is_default);

-- Enable Row Level Security
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Auto-update timestamp trigger
CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE addresses IS 'Customer shipping and billing addresses. Users can have multiple addresses with one default.';
COMMENT ON COLUMN addresses.is_default IS 'Only one address per user should be default. Application logic enforces this.';

-- =====================================================
-- SECTION 2: Carts Table
-- =====================================================
-- Purpose: Shopping cart persistence for logged-in users and guests
-- Relationship: One-to-one with profiles (authenticated users)
-- RLS: Enabled (users manage own cart)

CREATE TABLE carts (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User relationship (for authenticated users)
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,

  -- Session ID (for guest checkout)
  session_id TEXT UNIQUE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraint: Either user_id OR session_id must be set (not both, not neither)
  CONSTRAINT check_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Indexes for performance
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);

-- Enable Row Level Security
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- Auto-update timestamp trigger
CREATE TRIGGER update_carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE carts IS 'Shopping cart persistence. One cart per user (via user_id) or guest (via session_id).';
COMMENT ON COLUMN carts.user_id IS 'For authenticated users. UNIQUE ensures one cart per user.';
COMMENT ON COLUMN carts.session_id IS 'For guest checkout. Stored in browser session/cookie.';

-- =====================================================
-- SECTION 3: Cart Items Table
-- =====================================================
-- Purpose: Items in shopping cart
-- Relationship: Many-to-one with carts, many-to-one with variants
-- RLS: Enabled (users manage own cart items)

CREATE TABLE cart_items (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Cart relationship
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,

  -- Variant relationship (what product variant is in the cart)
  variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,

  -- Quantity
  quantity INTEGER NOT NULL CHECK (quantity > 0),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraint: Prevent duplicate items (same variant can't be added twice)
  UNIQUE(cart_id, variant_id)
);

-- Indexes for performance
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_variant_id ON cart_items(variant_id);

-- Enable Row Level Security
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Auto-update timestamp trigger
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE cart_items IS 'Items in shopping cart. UNIQUE constraint prevents duplicate variants in same cart.';
COMMENT ON COLUMN cart_items.quantity IS 'Number of this variant in cart. Must be positive.';
COMMENT ON TABLE cart_items IS 'Note: Stock is NOT reserved on add-to-cart. Reservation happens at checkout.';

-- =====================================================
-- END OF MIGRATION 003
-- =====================================================
