# ⚡ Quick Start Guide

## Prerequisites Checklist

Before running the system, ensure you have:

- [ ] Node.js 18+ installed
- [ ] PNPM installed (`npm install -g pnpm`)
- [ ] Supabase account with project created
- [ ] Supabase URL and keys ready

## One-Time Setup (Do This Once)

### 1. Install Dependencies

```bash
# From the root directory
pnpm install
```

### 2. Configure Backend Environment

```bash
# Copy the example environment file
cp apps/backend/.env.example apps/backend/.env

# Edit the file with your Supabase credentials
nano apps/backend/.env
```

Required variables in `apps/backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

PORT=4000
NODE_ENV=development

JWT_SECRET=your_random_secret_key_here
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### 3. Configure Admin Environment

File: `apps/admin/.env.local` (already exists, verify values):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

### 4. Configure Storefront Environment

File: `apps/storefront/.env.local` (already exists, verify values):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

### 5. Run Database Migrations

Using Supabase Dashboard:
1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor"
4. Run all migration files from `/supabase/migrations/` in order

OR using Supabase CLI (if installed):
```bash
supabase db push
```

## Daily Startup (Every Time You Work)

You need **3 terminal windows** running simultaneously:

### Terminal 1: Backend API

```bash
cd apps/backend
pnpm dev
```

Wait for: `Server listening at http://localhost:4000`

### Terminal 2: Admin Dashboard

```bash
cd apps/admin
pnpm dev
```

Wait for: `Ready on http://localhost:3001`

### Terminal 3: Customer Storefront

```bash
cd apps/storefront
pnpm dev
```

Wait for: `Ready on http://localhost:3000`

## Access the Applications

Once all 3 services are running:

- **Customer Storefront**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Backend API**: http://localhost:4000

## Quick Test

### Test Backend Health

```bash
curl http://localhost:4000/api/health
```

Should return: `{"status":"ok"}`

### Test Admin Dashboard

1. Open http://localhost:3001
2. You should see the admin interface

### Test Customer Storefront

1. Open http://localhost:3000
2. You should see the homepage with hero section

## Current System Status

✅ **Phase 0**: Infrastructure Setup - COMPLETE
✅ **Phase 1**: Backend + Admin MVP - COMPLETE
✅ **Phase 2**: Customer Storefront - COMPLETE

### What Works Right Now

**Admin Dashboard** (http://localhost:3001):
- ✅ Category management (create, edit, list)
- ✅ Product management (create, edit, list)
- ✅ Variant management (add, edit, manage inventory)
- ✅ Inventory tracking (quantity, reserved, available)
- ✅ Professional UI with icons

**Customer Storefront** (http://localhost:3000):
- ✅ Homepage with featured products
- ✅ Product listing page
- ✅ Category filtering
- ✅ Product sorting
- ✅ Product detail pages
- ✅ Variant selection
- ✅ Stock status display
- ✅ Quantity selectors
- ✅ Authentic e-commerce design (#FF9900 orange theme)
- ✅ Professional Lucide icons
- ✅ Responsive layouts

**Backend API** (http://localhost:4000):
- ✅ RESTful API endpoints
- ✅ Products CRUD operations
- ✅ Categories CRUD operations
- ✅ Variants management
- ✅ Inventory management
- ✅ Supabase integration

### What's Coming Next

**Phase 3** - Shopping Cart & Checkout:
- Shopping cart functionality
- Cart state management
- Checkout flow
- Address management
- Payment integration (Stripe)
- Inventory reservation

**Phase 4** - Order Management:
- Order tracking for customers
- Admin order dashboard
- Order status updates

**Phase 5** - Advanced Features:
- Real-time inventory updates (WebSocket)
- Cross-device cart sync
- Low stock alerts
- Search functionality
- Image uploads

## Troubleshooting

### "Module not found" errors
```bash
pnpm install
```

### Port already in use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Backend "Cannot connect to Supabase"
- Verify `.env` file exists in `apps/backend/`
- Check Supabase URL and keys are correct
- Ensure Supabase project is active

### No products showing on storefront
- Start the backend server first
- Check backend is running: `curl http://localhost:4000/api/health`
- Create products in admin dashboard
- Ensure products are marked as "active"

## Next Steps

1. ✅ Complete this one-time setup
2. ✅ Start all 3 services
3. ✅ Follow `TEST_WORKFLOW.md` to test end-to-end
4. 🚧 Proceed to Phase 3 (Shopping Cart)

## Support Files

- `SETUP_GUIDE.md` - Detailed setup instructions
- `TEST_WORKFLOW.md` - End-to-end testing guide
- `ecommerce_guide.md` - Architecture overview
- `DESIGN_GUIDELINES.md` - UI/UX guidelines
- `enhancements/` - Detailed feature specifications
