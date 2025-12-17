# Enhancement 04: Environment Configuration

> **Supplements Section 8 & 9 of ecommerce_guide.md**  
> Complete environment variable setup for all applications.

---

## Directory Structure

```
root/
  apps/
    storefront/.env.local
    admin/.env.local
    backend/.env
  .env.example (template)
```

---

## Storefront (.env.local)

```bash
# ============================================
# SUPABASE
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# API
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
# Production: https://api.yourdomain.com/api/v1

# ============================================
# STRIPE (Client-side public key)
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
# Production: pk_live_xxxxxxxxxxxxx

# ============================================
# SITE CONFIG
# ============================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Production: https://www.yourdomain.com

NEXT_PUBLIC_SITE_NAME="My E-Commerce Store"

# ============================================
# ANALYTICS (Optional)
# ============================================
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=

# ============================================
# FEATURE FLAGS (Optional)
# ============================================
NEXT_PUBLIC_ENABLE_OAUTH=true
NEXT_PUBLIC_ENABLE_REVIEWS=false
```

---

## Admin Dashboard (.env.local)

```bash
# ============================================
# SUPABASE
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# API
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
# Production: https://api.yourdomain.com/api/v1

# ============================================
# SITE CONFIG
# ============================================
NEXT_PUBLIC_ADMIN_URL=http://localhost:3002
# Production: https://admin.yourdomain.com

# ============================================
# SECURITY
# ============================================
# Allowed email domains for admin registration (comma-separated)
NEXT_PUBLIC_ALLOWED_ADMIN_DOMAINS=yourdomain.com,companydomain.com
```

---

## Backend (.env)

```bash
# ============================================
# SERVER
# ============================================
NODE_ENV=development
# Options: development, staging, production

PORT=3001

# ============================================
# SUPABASE
# ============================================
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# ⚠️ CRITICAL: Service role key must be kept SECRET and server-side only!

# Direct database connection string (for migrations)
DATABASE_URL=postgresql://postgres:[password]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# ============================================
# CORS
# ============================================
# Comma-separated list of allowed origins
CORS_ORIGINS=http://localhost:3000,http://localhost:3002
# Production: https://www.yourdomain.com,https://admin.yourdomain.com

# ============================================
# REDIS (Optional - for rate limiting & sessions)
# ============================================
REDIS_URL=redis://localhost:6379
# Production: redis://user:password@redis-server:6379

# ============================================
# STRIPE
# ============================================
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
# Production: sk_live_xxxxxxxxxxxxx

STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
# Get this from Stripe Dashboard > Webhooks

# ============================================
# EMAIL (Choose one provider)
# ============================================
# Option 1: Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Option 2: SendGrid
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# Option 3: Supabase SMTP (built-in)
# Use Supabase's built-in email service

EMAIL_FROM=noreply@yourdomain.com
EMAIL_SUPPORT=support@yourdomain.com

# ============================================
# STORAGE
# ============================================
# Supabase Storage bucket names
SUPABASE_PRODUCT_IMAGES_BUCKET=product-images
SUPABASE_CATEGORY_IMAGES_BUCKET=category-images

# ============================================
# JWT (If using custom JWT instead of Supabase Auth)
# ============================================
# Not needed if using Supabase Auth exclusively
# JWT_SECRET=your-super-secret-jwt-key-min-32-chars
# JWT_EXPIRES_IN=1h
# JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-chars
# JWT_REFRESH_EXPIRES_IN=30d

# ============================================
# RATE LIMITING
# ============================================
RATE_LIMIT_WINDOW_MS=3600000
# 1 hour in milliseconds

RATE_LIMIT_MAX_ANONYMOUS=100
RATE_LIMIT_MAX_AUTHENTICATED=1000
RATE_LIMIT_MAX_ADMIN=5000

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=debug
# Options: fatal, error, warn, info, debug, trace

# ============================================
# MONITORING (Optional)
# ============================================
SENTRY_DSN=https://xxxxxxxxxxxxx@sentry.io/xxxxxxxxxxxxx

# ============================================
# TAX & SHIPPING (Future)
# ============================================
TAX_CALCULATION_ENABLED=false
DEFAULT_TAX_RATE=0.08
# 8%

SHIPPING_RATE_FLAT=5.00
FREE_SHIPPING_THRESHOLD=50.00
```

---

## Environment-Specific Values

### Development
```bash
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
STRIPE_SECRET_KEY=sk_test_...
LOG_LEVEL=debug
```

### Staging
```bash
NODE_ENV=staging
NEXT_PUBLIC_API_URL=https://api-staging.yourdomain.com/api/v1
STRIPE_SECRET_KEY=sk_test_...  # Still test keys
LOG_LEVEL=info
```

### Production
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
STRIPE_SECRET_KEY=sk_live_...  # Live keys!
LOG_LEVEL=warn
SENTRY_DSN=https://...  # Enable monitoring
```

---

## Secrets Management

### Local Development
- Use `.env.local` files (gitignored)
- Never commit `.env` files to git
- Provide `.env.example` template

### Staging/Production

**Option 1: Platform Environment Variables**
- Vercel: Project Settings > Environment Variables
- Railway: Project > Variables
- Render: Environment > Environment Variables

**Option 2: Secret Management Service**
- AWS Secrets Manager
- Google Secret Manager
- HashiCorp Vault

**Recommendation**: Use platform environment variables for simplicity.

---

## Setting Up Environment

### 1. Create .env.example

Create a template file in root:

```bash
# .env.example
# Copy this to .env and fill in the values

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_key

# ... etc
```

### 2. Setup Script

Create `scripts/setup-env.sh`:

```bash
#!/bin/bash

echo "Setting up environment files..."

# Storefront
if [ ! -f apps/storefront/.env.local ]; then
  cp apps/storefront/.env.example apps/storefront/.env.local
  echo "✅ Created apps/storefront/.env.local"
fi

# Admin
if [ ! -f apps/admin/.env.local ]; then
  cp apps/admin/.env.example apps/admin/.env.local
  echo "✅ Created apps/admin/.env.local"
fi

# Backend
if [ ! -f apps/backend/.env ]; then
  cp apps/backend/.env.example apps/backend/.env
  echo "✅ Created apps/backend/.env"
fi

echo "⚠️  Please fill in the environment variables in each .env file"
```

Make executable:
```bash
chmod +x scripts/setup-env.sh
```

---

## Validation

### Backend Environment Validation

Create `backend/src/config/env.ts`:

```typescript
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.string().transform(Number),
  
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  
  DATABASE_URL: z.string().url(),
  
  CORS_ORIGINS: z.string().transform(s => s.split(',')),
  
  EMAIL_FROM: z.string().email(),
  
  RATE_LIMIT_MAX_ANONYMOUS: z.string().transform(Number),
  RATE_LIMIT_MAX_AUTHENTICATED: z.string().transform(Number),
  
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  
  REDIS_URL: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Environment validation failed:')
    console.error(error)
    process.exit(1)
  }
}

// Use in index.ts
export const env = validateEnv()
```

### Frontend Environment Validation

Create `storefront/lib/env.ts`:

```typescript
function getEnvVar(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const env = {
  supabaseUrl: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL'),
  stripePublishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  siteUrl: getEnvVar('NEXT_PUBLIC_SITE_URL'),
}
```

---

## Security Checklist

- ✅ Never commit `.env` files to git
- ✅ Add `.env*` to `.gitignore` (except `.env.example`)
- ✅ Use different Stripe keys for test/production
- ✅ Rotate secrets periodically
- ✅ Use `SUPABASE_SERVICE_ROLE_KEY` only on backend
- ✅ Validate all environment variables on startup
- ✅ Use HTTPS in production
- ✅ Set `NODE_ENV=production` in production
- ✅ Enable CORS only for trusted origins
- ✅ Keep Stripe webhook secret secure

---

## .gitignore Addition

Add to root `.gitignore`:

```gitignore
# Environment files
.env
.env.local
.env.*.local
.env.development
.env.staging
.env.production

# Keep examples
!.env.example
!**/.env.example
```

---

## Next Steps
- [Chunk 5] Use these env vars in inventory management flow
- [Chunk 6] Configure Supabase Storage with bucket names
- [Chunk 7] Setup Stripe with webhook secret
