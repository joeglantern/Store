-- =====================================================
-- MIGRATION 001: Core Foundation Tables
-- =====================================================
-- Purpose: Create the foundational tables that other tables depend on
-- Tables: profiles, categories
-- Dependencies: Requires Supabase Auth (auth.users table)
-- =====================================================

-- =====================================================
-- SECTION 1: Enable Required Extensions
-- =====================================================

-- Enable UUID generation for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for secure token generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- SECTION 2: Create update_updated_at_column Function
-- =====================================================
-- This function is used by triggers to auto-update the updated_at column

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SECTION 3: Profiles Table
-- =====================================================
-- Purpose: Extended user information beyond auth.users
-- Relationship: 1:1 with auth.users (Supabase Auth)
-- RLS: Enabled (users can view/update own profile, admins can view all)

CREATE TABLE profiles (
  -- Primary key links to Supabase auth.users
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- User information
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,

  -- Role-based access control (3 tiers)
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin')),

  -- Email verification status
  email_verified BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Auto-update timestamp trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE profiles IS 'Extended user profiles linked to Supabase auth.users. Contains role-based access control.';
COMMENT ON COLUMN profiles.role IS 'Access level: customer (default), admin, super_admin';

-- =====================================================
-- SECTION 4: Categories Table
-- =====================================================
-- Purpose: Hierarchical product organization
-- Relationship: Self-referencing for parent/child categories
-- RLS: Enabled (public read for active categories, admins manage all)

CREATE TABLE categories (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Category information
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- Hierarchy support (self-referencing foreign key)
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- Media
  image_url TEXT,

  -- Status and ordering
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_display_order ON categories(display_order);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Auto-update timestamp trigger
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE categories IS 'Hierarchical product categories supporting unlimited nesting via parent_id.';
COMMENT ON COLUMN categories.slug IS 'URL-friendly unique identifier for SEO.';
COMMENT ON COLUMN categories.parent_id IS 'Reference to parent category. NULL means top-level category.';
COMMENT ON COLUMN categories.display_order IS 'Sort order for displaying categories (lower numbers first).';

-- =====================================================
-- END OF MIGRATION 001
-- =====================================================
