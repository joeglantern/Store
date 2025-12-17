# 🧭 Must Read Before Coding

## 📋 CRITICAL: Read These Documents First

### Core Planning Documents (Required)
1. **`/Users/qc/Desktop/Files/Store/ecommerce_guide.md`**
   - High-level architecture and requirements
   - Technologies and tech stack
   - Security requirements
   - Project structure

2. **`/Users/qc/Desktop/Files/Store/ecommerce_prompt.md`**
   - Detailed feature requirements
   - Performance and optimization requirements
   - Complete feature list for all apps

3. **`/Users/qc/Desktop/Files/Store/DESIGN_GUIDELINES.md`** 🎨 CRITICAL
   - **Design reference**: `/Users/qc/Desktop/Files/Store/Design inspiration/Store design.webp`
   - Color palette (Orange #FF9900, Dark header)
   - Typography, spacing, components
   - **Must look authentic, NOT AI-generated**
   - Professional e-commerce aesthetic

### Enhancement Documents (Required for Implementation)

**READ ALL ENHANCEMENTS BEFORE WRITING CODE:**

3. **`/Users/qc/Desktop/Files/Store/enhancements/01-authentication-details.md`**
   - Supabase Auth integration (NOT custom JWT)
   - Authentication flows
   - Role-based access control
   - Admin invitation system

4. **`/Users/qc/Desktop/Files/Store/enhancements/02-database-schema.md`**
   - Complete SQL migrations
   - All 14 table definitions
   - RLS policies
   - Database functions for inventory

5. **`/Users/qc/Desktop/Files/Store/enhancements/03-api-specifications.md`**
   - All REST API endpoints
   - Request/response schemas
   - Error handling
   - Rate limiting

6. **`/Users/qc/Desktop/Files/Store/enhancements/04-environment-configuration.md`**
   - Environment variable templates
   - Configuration for all 3 apps
   - Environment validation

7. **`/Users/qc/Desktop/Files/Store/enhancements/05-product-inventory-management.md`**
   - Product-Variant-Inventory relationships
   - Inventory reservation system
   - SKU generation
   - Overselling prevention

8. **`/Users/qc/Desktop/Files/Store/enhancements/06-image-management.md`**
   - Supabase Storage setup
   - Image upload/optimization
   - CDN caching

9. **`/Users/qc/Desktop/Files/Store/enhancements/07-payment-integration.md`**
   - Stripe integration
   - Payment flow
   - Webhook handlers

10. **`/Users/qc/Desktop/Files/Store/enhancements/09-websocket-integration.md`** ⚡ NEW
    - Socket.io setup
    - Real-time features
    - WebSocket authentication
    - Event handlers

11. **`/Users/qc/Desktop/Files/Store/enhancements/08-phased-implementation-plan.md`**
    - Step-by-step implementation phases
    - **Timeline: 2-3 weeks with Claude Code**
    - Task lists per phase
    - Testing checkpoints

---

## 🎯 Implementation Workflow

### Step 1: Read All Documents
- [ ] Read ecommerce_guide.md
- [ ] Read ecommerce_prompt.md
- [ ] **Read DESIGN_GUIDELINES.md** 🎨 (View reference image)
- [ ] Read ALL enhancement documents (01-10)
- [ ] Review phased implementation plan (08)

### Step 2: Confirm Understanding
- [ ] Confirm architecture (monorepo, 3 apps)
- [ ] Confirm tech stack (Next.js, Fastify, Supabase, Socket.io)
- [ ] Confirm features (real-time inventory, order notifications, cart sync)
- [ ] Confirm timeline (2-3 weeks)

### Step 3: Follow Phased Plan
Execute phases sequentially from Enhancement 08:
- [ ] Phase 0: Setup & Infrastructure (2-3 hours)
- [ ] Phase 1: MVP Backend + Admin (2-3 days)
- [ ] Phase 2: Customer Storefront (2-3 days)
- [ ] Phase 3: Cart & Checkout (3-4 days)
- [ ] Phase 4: Admin Order Management (1-2 days)
- [ ] Phase 5: Advanced Features (2-3 days)
- [ ] Phase 6: Optimization & Deployment (1-2 days)

---

## ⚡ Key Technical Decisions (DO NOT DEVIATE)

### Authentication
✅ **Use Supabase Auth exclusively** (NOT custom JWT)
✅ Role-based access: customer, admin, super_admin
✅ Admin accounts are invitation-only

### Database
✅ **Supabase PostgreSQL** with RLS policies
✅ Variant-based product system
✅ Inventory: quantity, reserved, available
✅ Use database functions for inventory operations

### Real-time Features (NEW)
✅ **Socket.io for WebSocket communication**
✅ **Redis adapter for scaling**
✅ Live inventory updates
✅ Order notifications with sound
✅ Cart sync across devices
✅ Live admin dashboard

### Payments
✅ **Stripe** for payment processing
✅ PaymentIntent flow
✅ Webhook handlers for inventory commit/release

### File Structure
✅ **Monorepo** (3 apps: storefront, admin, backend)
✅ Shared packages (ui, utils, config)
✅ WebSocket handlers in `backend/src/websocket/`

---

## 🚫 Common Mistakes to Avoid

❌ **DO NOT** create custom JWT authentication (use Supabase Auth)
❌ **DO NOT** allow public admin registration (invitation-only)
❌ **DO NOT** commit inventory immediately on add-to-cart (reserve on checkout)
❌ **DO NOT** skip WebSocket authentication middleware
❌ **DO NOT** broadcast WebSocket events globally (use rooms)
❌ **DO NOT** skip Redis adapter for WebSocket (needed for scaling)
❌ **DO NOT** skip RLS policies (critical for security)
❌ **DO NOT** skip inventory reservation system (prevents overselling)

---

## 📊 Project Structure Reference

```
root/
  apps/
    storefront/          # Next.js customer website
    admin/              # Next.js admin dashboard
    backend/            # Node.js + Fastify API
      src/
        websocket/      # Socket.io handlers ⚡ NEW
  packages/
    ui/                 # Shared components
    utils/              # Shared utilities
    config/             # Shared config
  supabase/
    migrations/         # SQL migrations
  enhancements/         # All enhancement docs
```

---

## 🔥 Real-time Features Checklist

### Customer Features
- [ ] Live inventory updates on product pages
- [ ] Real-time order status tracking
- [ ] Cross-device cart synchronization
- [ ] WebSocket connection status indicator

### Admin Features
- [ ] Instant new order notifications (with sound)
- [ ] Low stock alerts
- [ ] Live dashboard metrics
- [ ] Real-time order list updates
- [ ] Live order status change broadcasting

---

## 📝 Before Writing ANY Code

1. **Confirm you've read ALL enhancement documents**
2. **View the design reference image** (`Design inspiration/Store design.webp`)
3. **Review DESIGN_GUIDELINES.md for the component you're building**
4. **Ask clarifying questions if anything is unclear**
5. **Reference the specific enhancement document for the feature you're building**
6. **Follow the phased plan (Enhancement 08) sequentially**
7. **Test each phase before moving to the next**

### 🎨 Design Verification (Every UI Component)
Before writing any HTML/CSS/JSX:
- [ ] Checked reference design image
- [ ] Using correct colors (Orange #FF9900, Dark header)
- [ ] Following authentic e-commerce patterns (NOT AI-generated look)
- [ ] Proper spacing and typography
- [ ] Matches the professional, trustworthy aesthetic

---

## 🎯 Timeline Expectations

**Total Time: 2-3 weeks** (with Claude Code assistance)

This is **85% faster** than manual development (17 weeks) because:
- ✅ No learning curve
- ✅ No debugging delays
- ✅ Consistent code quality
- ✅ Immediate implementation

---

## ✅ Success Criteria

Your implementation is successful when:
- [ ] All 3 apps (storefront, admin, backend) are functional
- [ ] Real-time features work (inventory, orders, cart sync)
- [ ] Payment flow works with Stripe
- [ ] Admin receives instant order notifications
- [ ] Customers see live inventory updates
- [ ] Cart syncs across devices
- [ ] All RLS policies are in place
- [ ] All tests pass
- [ ] Deployed to production

---

**🚀 YOU MUST CONSULT THESE DOCUMENTS BEFORE WRITING NEW CODE**

**Ready to start? Begin with Phase 0 from Enhancement 08!**
