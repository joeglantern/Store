-- =====================================================
-- MIGRATION 005: Security & Auditing Tables
-- =====================================================
-- Purpose: Admin controls and compliance logging
-- Tables: logs, admin_invitations
-- Dependencies: profiles (from migration 001)
-- =====================================================

-- =====================================================
-- SECTION 1: Logs Table
-- =====================================================
-- Purpose: Audit trail for compliance and security monitoring
-- Relationship: Many-to-one with profiles (optional - some logs may be system-generated)
-- RLS: Enabled (only admins can view logs, system can insert)

CREATE TABLE logs (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User who performed the action (NULL for system actions)
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Action performed
  action TEXT NOT NULL,

  -- Entity affected
  entity_type TEXT NOT NULL,
  entity_id UUID,

  -- Additional details stored as JSONB for flexibility
  -- Example: {"old_value": {"price": 29.99}, "new_value": {"price": 24.99}}
  details JSONB DEFAULT '{}'::jsonb,

  -- Request metadata
  ip_address INET,
  user_agent TEXT,

  -- Timestamp (no updated_at - append-only log)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_entity_type ON logs(entity_type);
CREATE INDEX idx_logs_entity_id ON logs(entity_id);
CREATE INDEX idx_logs_created_at ON logs(created_at DESC);

-- GIN index on JSONB for fast searching within details
CREATE INDEX idx_logs_details ON logs USING GIN (details);

-- Enable Row Level Security
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Add comments for documentation
COMMENT ON TABLE logs IS 'Audit trail for compliance and security. Tracks all administrative and critical user actions.';
COMMENT ON COLUMN logs.action IS 'Action performed (e.g., "product.update", "user.role_change", "inventory.restock")';
COMMENT ON COLUMN logs.entity_type IS 'Type of entity affected (e.g., "product", "order", "user")';
COMMENT ON COLUMN logs.entity_id IS 'UUID of the affected entity';
COMMENT ON COLUMN logs.details IS 'JSONB field for flexible logging data (before/after values, metadata, etc.)';
COMMENT ON COLUMN logs.ip_address IS 'Client IP address. INET type supports both IPv4 and IPv6.';

-- =====================================================
-- SECTION 2: Admin Invitations Table
-- =====================================================
-- Purpose: Secure admin registration (invitation-only)
-- Relationship: Many-to-one with profiles (created_by)
-- RLS: Enabled (only super admins can manage, anyone can view by token)

CREATE TABLE admin_invitations (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Invitee email
  email TEXT NOT NULL,

  -- Cryptographically secure token (32 bytes = 64 hex characters)
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),

  -- Who created this invitation
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Expiration (24 hours from creation)
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),

  -- Usage tracking (one-time use)
  used_at TIMESTAMPTZ,

  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_admin_invitations_token ON admin_invitations(token);
CREATE INDEX idx_admin_invitations_email ON admin_invitations(email);
CREATE INDEX idx_admin_invitations_expires_at ON admin_invitations(expires_at);

-- Enable Row Level Security
ALTER TABLE admin_invitations ENABLE ROW LEVEL SECURITY;

-- Add comments for documentation
COMMENT ON TABLE admin_invitations IS 'Admin invitation system. Prevents unauthorized admin registration.';
COMMENT ON COLUMN admin_invitations.token IS 'Unique, cryptographically secure token sent via email';
COMMENT ON COLUMN admin_invitations.expires_at IS 'Token expiration time (24 hours from creation)';
COMMENT ON COLUMN admin_invitations.used_at IS 'Timestamp when invitation was accepted. NULL = unused.';
COMMENT ON COLUMN admin_invitations.created_by IS 'Super admin who created this invitation';

-- =====================================================
-- END OF MIGRATION 005
-- =====================================================
