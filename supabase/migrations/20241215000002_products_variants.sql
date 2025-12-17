-- =====================================================
-- MIGRATION 002: Product System Tables
-- =====================================================
-- Purpose: Create variant-based product architecture with inventory
-- Tables: products, product_images, variants, inventory
-- Dependencies: categories (from migration 001)
-- =====================================================

-- =====================================================
-- SECTION 1: Products Table
-- =====================================================
-- Purpose: Base product information (not variant-specific)
-- Relationship: Many-to-one with categories
-- RLS: Enabled (public read for active products, admins manage all)

CREATE TABLE products (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Product information
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- Category relationship
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,

  -- Pricing (variants can adjust this base price)
  base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),

  -- Additional info
  brand TEXT,

  -- Status flags
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,

  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Auto-update timestamp trigger
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE products IS 'Base product information. Actual sellable items are variants of these products.';
COMMENT ON COLUMN products.base_price IS 'Base price in USD. Variants can add price_adjustment to this.';
COMMENT ON COLUMN products.is_featured IS 'Display on homepage/promotional areas';
COMMENT ON COLUMN products.slug IS 'URL-friendly unique identifier for SEO (e.g., "mens-cotton-tshirt")';

-- =====================================================
-- SECTION 2: Product Images Table
-- =====================================================
-- Purpose: Multiple images per product for galleries
-- Relationship: Many-to-one with products
-- RLS: Enabled (public read via active products, admins manage)

CREATE TABLE product_images (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Product relationship
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  -- Image information
  image_url TEXT NOT NULL,
  alt_text TEXT,

  -- Display order for gallery
  display_order INTEGER DEFAULT 0,

  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_display_order ON product_images(display_order);

-- Enable Row Level Security
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Add comments for documentation
COMMENT ON TABLE product_images IS 'Product image gallery. Supports multiple images per product.';
COMMENT ON COLUMN product_images.image_url IS 'URL pointing to Supabase Storage bucket';
COMMENT ON COLUMN product_images.display_order IS 'Sort order for image gallery (lower numbers first)';

-- =====================================================
-- SECTION 3: Variants Table
-- =====================================================
-- Purpose: Product options (size, color, etc.) with unique SKUs
-- Relationship: Many-to-one with products
-- RLS: Enabled (public read for active variants, admins manage)

CREATE TABLE variants (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Product relationship
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  -- Variant information
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,

  -- Flexible attributes stored as JSONB
  -- Example: {"size": "L", "color": "red", "material": "cotton"}
  attributes JSONB DEFAULT '{}'::jsonb,

  -- Price modification from base_price
  -- Positive values add to base, negative values subtract
  price_adjustment DECIMAL(10,2) DEFAULT 0 CHECK (price_adjustment >= -999999.99),

  -- Optional variant-specific image
  image_url TEXT,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_variants_product_id ON variants(product_id);
CREATE INDEX idx_variants_sku ON variants(sku);
CREATE INDEX idx_variants_is_active ON variants(is_active);

-- GIN index on JSONB for fast filtering (e.g., WHERE attributes @> '{"size": "L"}')
CREATE INDEX idx_variants_attributes ON variants USING GIN (attributes);

-- Enable Row Level Security
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;

-- Auto-update timestamp trigger
CREATE TRIGGER update_variants_updated_at
  BEFORE UPDATE ON variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE variants IS 'Product variants (SKUs) with flexible attributes. Each variant tracks its own inventory.';
COMMENT ON COLUMN variants.sku IS 'Stock Keeping Unit - unique identifier for inventory tracking';
COMMENT ON COLUMN variants.attributes IS 'JSONB field for flexible variant properties (size, color, etc.)';
COMMENT ON COLUMN variants.price_adjustment IS 'Amount to add/subtract from product base_price. Final price = base_price + price_adjustment';

-- =====================================================
-- SECTION 4: Inventory Table
-- =====================================================
-- Purpose: Stock tracking with reservation system
-- Relationship: One-to-one with variants
-- RLS: Enabled (public read, admins manage)

CREATE TABLE inventory (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Variant relationship (one-to-one)
  variant_id UUID NOT NULL UNIQUE REFERENCES variants(id) ON DELETE CASCADE,

  -- Stock quantities
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reserved INTEGER NOT NULL DEFAULT 0 CHECK (reserved >= 0),

  -- Alert threshold for low stock notifications
  low_stock_threshold INTEGER DEFAULT 10,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraint: reserved can never exceed quantity
  CONSTRAINT check_reserved_not_exceed_quantity CHECK (reserved <= quantity)
);

-- Indexes for performance
CREATE INDEX idx_inventory_variant_id ON inventory(variant_id);

-- Partial index for low stock alerts (only indexes rows below threshold)
CREATE INDEX idx_inventory_low_stock ON inventory(quantity)
  WHERE quantity <= low_stock_threshold;

-- Enable Row Level Security
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Auto-update timestamp trigger
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE inventory IS 'Inventory tracking with reservation system to prevent overselling.';
COMMENT ON COLUMN inventory.quantity IS 'Total physical stock count';
COMMENT ON COLUMN inventory.reserved IS 'Temporarily locked during checkout (released after 15 minutes or on payment)';
COMMENT ON COLUMN inventory.low_stock_threshold IS 'Trigger alerts when quantity falls to or below this value';

-- Add computed column comment
COMMENT ON TABLE inventory IS 'Available stock = quantity - reserved. Use get_available_stock() function for accurate real-time values.';

-- =====================================================
-- END OF MIGRATION 002
-- =====================================================
