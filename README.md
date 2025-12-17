# E-Commerce Platform

A full-stack e-commerce platform built with Next.js, Fastify, Supabase, and Socket.io.

## 🏗 Architecture

This is a **monorepo** containing 3 applications:

- **`apps/storefront`**: Customer-facing Next.js app (Port 3000)
- **`apps/admin`**: Admin dashboard Next.js app (Port 3001)
- **`apps/backend`**: Fastify API server with Socket.io (Port 4000)

## 🚀 Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Socket.io Client** (Real-time updates)
- **Supabase Client** (Authentication & Data)

### Backend
- **Fastify** (High-performance Node.js framework)
- **Socket.io** (WebSocket for real-time features)
- **Redis** (WebSocket scaling & caching)
- **Stripe** (Payment processing)
- **Supabase** (PostgreSQL database & auth)

## ⚡ Real-time Features

- Live inventory updates across all users
- Instant order notifications for admins (with sound)
- Cart synchronization across devices
- Live admin dashboard metrics
- Low stock alerts

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.0.0
- **PNPM** >= 8.0.0 (Install: `npm install -g pnpm`)
- **Redis** (for WebSocket scaling)
- **Supabase account** (https://supabase.com)
- **Stripe account** (https://stripe.com)

## 🛠 Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to Project Settings → API
3. Copy your `URL` and `anon/public key`
4. Go to Project Settings → Database → Connection String
5. Copy your connection string

### 3. Run Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

Alternatively, run the SQL files manually in Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_functions.sql`

### 4. Setup Redis

**Option A: Local Redis**
```bash
# macOS
brew install redis
brew services start redis

# Linux
sudo apt-get install redis-server
sudo systemctl start redis
```

**Option B: Redis Cloud (Free tier)**
https://redis.com/try-free/

### 5. Configure Environment Variables

Copy `.env.example` to `.env` in each app:

```bash
# Storefront
cp apps/storefront/.env.example apps/storefront/.env

# Admin
cp apps/admin/.env.example apps/admin/.env

# Backend
cp apps/backend/.env.example apps/backend/.env
```

Then fill in your credentials:

**apps/storefront/.env & apps/admin/.env:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**apps/backend/.env:**
```env
PORT=4000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
REDIS_HOST=localhost
REDIS_PORT=6379
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
JWT_SECRET=generate_a_random_string_here
```

### 6. Setup Stripe

1. Create account at https://stripe.com
2. Go to Developers → API keys
3. Copy your `Publishable key` and `Secret key`
4. For webhooks:
   - Go to Developers → Webhooks
   - Add endpoint: `http://localhost:4000/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret

### 7. Seed Mock Products (Optional)

Populate your store with realistic mock products:

```bash
# Ensure backend is running first!
node seed-data.js
```

This creates:
- **5 categories**: Men's Fashion, Women's Fashion, Electronics, Home & Living, Sports & Outdoors
- **15 products**: T-shirts, jeans, sneakers, dresses, leggings, headphones, smartwatches, and more
- **80+ variants**: Different sizes, colors, and configurations
- **Realistic inventory**: Each variant has stock quantities

### 8. Create First Admin User

1. Sign up through the storefront at http://localhost:3000
2. In Supabase SQL Editor, run:
```sql
UPDATE profiles
SET role = 'super_admin'
WHERE email = 'your@email.com';
```

## 🏃 Running the Project

### Development Mode

**Option 1: Run all apps in parallel**
```bash
pnpm dev
```

**Option 2: Run apps individually**
```bash
# Terminal 1: Backend
cd apps/backend
pnpm dev

# Terminal 2: Storefront
cd apps/storefront
pnpm dev

# Terminal 3: Admin
cd apps/admin
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

## 🌐 Access Points

- **Storefront**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/health

## 📚 Project Structure

```
Store/
├── apps/
│   ├── storefront/          # Customer website
│   ├── admin/               # Admin dashboard
│   └── backend/             # API server
│       └── src/
│           ├── routes/      # API routes
│           ├── services/    # Business logic
│           ├── websocket/   # Socket.io handlers
│           ├── middleware/  # Auth, validation
│           └── types/       # TypeScript types
├── packages/
│   ├── ui/                  # Shared components
│   ├── utils/               # Shared utilities
│   └── config/              # Shared config
├── supabase/
│   └── migrations/          # Database migrations
├── enhancements/            # Planning documents
├── CLAUDE.md                # AI development guide
├── DESIGN_GUIDELINES.md     # Design system
├── ecommerce_guide.md       # Technical guide
└── ecommerce_prompt.md      # Feature specifications
```

## 🎨 Design System

See `DESIGN_GUIDELINES.md` for:
- Color palette (Orange #FF9900, Dark #2D2D2D)
- Typography guidelines
- Component patterns
- Responsive breakpoints
- Accessibility standards

## 🔒 Security Features

- Row Level Security (RLS) policies
- Admin invitation-only system
- Secure WebSocket authentication
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Inventory reservation system (prevents overselling)

## 📖 Documentation

- **Planning**: `/enhancements/` folder
- **API Specs**: `/enhancements/03-api-specifications.md`
- **Database Schema**: `/enhancements/02-database-schema.md`
- **WebSocket Events**: `/enhancements/09-websocket-integration.md`
- **Implementation Plan**: `/enhancements/08-phased-implementation-plan.md`

## 🐛 Troubleshooting

### Redis Connection Error
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG
```

### Supabase Connection Error
- Verify environment variables are correct
- Check Supabase project is active
- Ensure RLS policies are applied

### WebSocket Not Connecting
- Verify backend is running on port 4000
- Check NEXT_PUBLIC_WS_URL in frontend .env
- Ensure Redis is running

## 📝 License

MIT

## 🤝 Contributing

This project was developed with Claude Code assistance following the phased implementation plan in `/enhancements/08-phased-implementation-plan.md`.
