# 🚀 E-Commerce Platform Setup Guide

## Prerequisites

- Node.js 18+ and PNPM installed
- Supabase account and project created
- All environment variables configured

## Quick Start

### 1. Install Dependencies

```bash
# From the root directory
pnpm install
```

### 2. Environment Configuration

Ensure these files exist with proper values:

**Backend** (`.env` in `/apps/backend/`):
```env
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server
PORT=4000
NODE_ENV=development

# Security
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Stripe (for Phase 3)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Redis (for WebSocket scaling)
REDIS_URL=redis://localhost:6379
```

**Admin** (`.env.local` in `/apps/admin/`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

**Storefront** (`.env.local` in `/apps/storefront/`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

### 3. Database Setup

Run migrations in Supabase dashboard or using Supabase CLI:

```bash
# If using Supabase CLI
supabase db push
```

Migrations are located in `/supabase/migrations/` and include:
- User profiles table
- Products, categories, variants tables
- Inventory management tables
- Order and cart tables
- RLS policies

### 4. Start All Services

Open 3 terminal windows:

**Terminal 1 - Backend API:**
```bash
cd apps/backend
pnpm dev
# Running at http://localhost:4000
```

**Terminal 2 - Admin Dashboard:**
```bash
cd apps/admin
pnpm dev
# Running at http://localhost:3001
```

**Terminal 3 - Customer Storefront:**
```bash
cd apps/storefront
pnpm dev
# Running at http://localhost:3000
```

## Testing the Full Workflow

### Phase 1: Admin Creates Content

1. **Access Admin Dashboard**
   - Navigate to `http://localhost:3001`
   - Login with admin credentials (or create via Supabase Auth)

2. **Create Categories**
   - Go to Categories section
   - Click "Create Category"
   - Example categories:
     - Men's Fashion (slug: `mens-fashion`)
     - Electronics (slug: `electronics`)
     - Home & Garden (slug: `home-garden`)

3. **Create Products**
   - Go to Products section
   - Click "Create Product"
   - Example product:
     ```
     Name: Classic Men's T-Shirt
     Slug: classic-mens-tshirt
     Description: Comfortable cotton t-shirt
     Brand: Fashion Co.
     Category: Men's Fashion
     Base Price: 29.99
     Is Active: Yes
     ```

4. **Add Product Variants**
   - After creating product, go to variant management
   - Add size/color variants:
     ```
     Variant 1:
     - Name: Small / Black
     - SKU: SHIRT-SM-BLK
     - Price Adjustment: 0
     - Inventory Quantity: 50

     Variant 2:
     - Name: Medium / Blue
     - SKU: SHIRT-MD-BLU
     - Price Adjustment: 0
     - Inventory Quantity: 30
     ```

### Phase 2: Customer Views Products

1. **Access Storefront**
   - Navigate to `http://localhost:3000`
   - Homepage displays featured products (limit 4)

2. **Browse Products**
   - Click "SHOP NOW" or navigate to `/products`
   - Filter by category using sidebar
   - Sort products using dropdown

3. **View Product Details**
   - Click any product card
   - URL: `/products/classic-mens-tshirt`
   - Should see:
     - Product name, brand, description
     - Base price: $29.99
     - Available variants with stock counts
     - Quantity selector
     - "Add to Cart" button (Phase 3 feature)

## Verification Checklist

### Backend API ✅
- [ ] Server starts on port 4000
- [ ] `/api/health` returns 200 OK
- [ ] `/api/products` returns product list
- [ ] `/api/categories` returns category list
- [ ] `/api/products/:slug` returns product details

### Admin Dashboard ✅
- [ ] Runs on port 3001
- [ ] Can create/edit categories
- [ ] Can create/edit products
- [ ] Can manage product variants
- [ ] Can set inventory quantities
- [ ] Real-time inventory updates work

### Customer Storefront ✅
- [ ] Runs on port 3000
- [ ] Homepage loads with featured products
- [ ] Category filtering works
- [ ] Product sorting works
- [ ] Product detail page shows correct data
- [ ] Variant selection updates price
- [ ] Stock status displays correctly

## Current System Capabilities

### ✅ Fully Functional (Phases 0-2)
- Database schema with RLS policies
- Backend REST API with all CRUD operations
- Admin dashboard for content management
- Customer storefront with product browsing
- Category management
- Product variants with inventory tracking
- Authentic e-commerce design with #FF9900 orange theme
- Lucide React icons throughout
- Responsive layouts

### 🚧 Coming in Phase 3 (Shopping Cart & Checkout)
- Shopping cart functionality
- Cart state management
- Checkout flow
- Payment integration with Stripe
- Inventory reservation on checkout

### 🚧 Coming in Phase 4 (Order Management)
- Order tracking for customers
- Admin order dashboard
- Order status updates
- WebSocket real-time notifications

### 🚧 Coming in Phase 5 (Advanced Features)
- Live inventory updates via WebSocket
- Cross-device cart sync
- Low stock alerts
- Search functionality

## Troubleshooting

### "Module not found" errors
```bash
# Run from root directory
pnpm install
```

### Backend connection failed
- Verify backend is running on port 4000
- Check NEXT_PUBLIC_BACKEND_URL in .env.local files
- Ensure CORS_ORIGIN includes frontend URLs

### No products showing
- Verify backend API is returning data: `curl http://localhost:4000/api/products`
- Check browser console for API errors
- Ensure admin has created and activated products

### Supabase errors
- Verify environment variables are correct
- Check RLS policies allow public read access for products
- Ensure migrations have been applied

## Next Steps

Once verification is complete:

1. **Phase 3**: Implement shopping cart and checkout
2. **Phase 4**: Add order management
3. **Phase 5**: Implement WebSocket real-time features
4. **Phase 6**: Optimization and deployment

## Design Compliance

All UI components follow:
- **Colors**: Orange #FF9900, Dark #2D2D2D, Text #333333/#666666/#999999
- **Icons**: Lucide React (no emojis)
- **Patterns**: Authentic e-commerce design (not AI-generated)
- **Reference**: `/Design inspiration/Store design.webp`
- **Guidelines**: `DESIGN_GUIDELINES.md`

## Support

For issues or questions, refer to:
- `ecommerce_guide.md` - Architecture overview
- `ecommerce_prompt.md` - Feature requirements
- `enhancements/` - Detailed specifications for each phase
