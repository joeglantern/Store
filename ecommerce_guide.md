# Full Development Guide for the E-Commerce Platform

This document defines **exact instructions**, **file structure**, **architecture**, and **implementation guidelines** so that **Claude, ChatGPT, or any developer** can follow it without missing anything. It is designed to be a complete blueprint for the entire e-commerce system.

---

# 1. Project Overview

This project is a full e-commerce system built in a **monorepo** containing three independent applications:

```
root/
  apps/
    storefront/   → Next.js customer-facing website
    admin/        → Next.js admin dashboard (deployed separately)
    backend/      → Node.js API server connected to Supabase
  packages/
    ui/           → shared UI components
    utils/        → shared helpers & utilities
    config/       → shared types & config
  supabase/
    migrations/   → SQL migrations
    schemas/      → schema definition files
```

All apps share packages but **deploy independently**.

---

# 2. Technologies

### Frontend (Both Storefront + Admin)
- **Next.js App Router**
- TypeScript
- React Server Components where possible
- TailwindCSS or ShadCN (recommended)
- React Query (recommended state management)
- Next/Image optimization
- SEO: metadata, structured data, sitemap, robots
- Full responsiveness

### Backend
- Node.js (LTS)
- Fastify (recommended for speed)
- Clean Architecture: controllers → services → repositories
- Zod for validation
- JWT Access + Refresh tokens
- **Socket.io for real-time features**
- **Redis for WebSocket scaling + rate limiting + session blacklists**
- Swagger documentation

### Supabase
- Postgres database
- Supabase Auth
- RLS (Row Level Security)
- Supabase Storage for images

---

# 3. Backend API Requirements

### Authentication
- Register
- Login
- Refresh token rotation
- Logout
- Role based access (customer, admin)

### Products
- CRUD products
- Variants (size, color)
- Stock and inventory logic
- Images stored in Supabase storage

### Categories
- CRUD categories
- Category tree or flat categories

### Cart
- Add/remove/update cart items
- Real-time stock check

### Checkout
- Address management
- Order creation
- Payment placeholder functions
- Inventory lock/unlock system

### Orders
- Order tracking
- Admin order management

### Admin Exclusive Features
- User management
- Role assignment
- Audit logs
- Discount & coupon system

### Real-time Features (WebSocket)
- **Live inventory updates** - Customers see stock changes instantly
- **Order notifications** - Admins receive instant new order alerts with sound
- **Cart synchronization** - Cart syncs across devices in real-time
- **Order status tracking** - Customers see live order status updates
- **Live dashboard metrics** - Admin dashboard updates in real-time
- **Low stock alerts** - Immediate notifications when inventory is low
- **Admin collaboration** - See who's editing what in real-time

---

# 4. Frontend Storefront Requirements

### Pages
- Home page with banner, featured products
- Category listing
- Product details page
- Cart page
- Checkout flow
- User profile (orders, addresses)

### UI/UX Guidelines
- Lightweight components
- Lazy load non-critical sections
- Avoid layout shift (CLS)
- Smooth skeleton loaders

### Performance
- Server-side data fetch (RSC)
- ISR for product pages
- Code splitting
- Good Lighthouse score

---

# 5. Admin Dashboard Requirements

### Key Modules
- Product manager (CRUD)
- Category manager
- Orders dashboard
- Inventory dashboard
- Discounts module
- Analytics dashboard
- Logs

### UI/UX
- Use ShadCN or a stable UI system
- Keep pages modular
- Include: tables, forms, charts

### Performance
- Avoid large bundle sizes using server components
- Heavy analytics should be async-loaded

---

# 6. Database Schema (Supabase)

### Tables Required
- users
- profiles (additional metadata)
- categories
- products
- product_images
- variants
- inventory
- carts
- cart_items
- orders
- order_items
- addresses
- discounts
- logs

### RLS Policies
- Users can only access their own carts, orders, addresses
- Admin role has full access

---

# 7. Security Requirements
- Rate limiting using Redis or Fastify built-in
- JWT rotation
- HttpOnly cookies
- CSRF protection for web
- Data validation using Zod
- Strong RLS on Supabase
- Hash all sensitive data

---

# 8. Project Structure in Detail

```
root/
  apps/
    storefront/
      app/
      components/
      hooks/
      lib/
      public/
      styles/
      types/

    admin/
      app/
      components/
      modules/  ← product, orders, discounts, etc.
      hooks/
      lib/
      public/
      types/

    backend/
      src/
        controllers/
        services/
        repositories/
        routes/
        middlewares/
        websocket/       ← Socket.io handlers & events
          handlers/
          middleware/
          index.ts
        utils/
        schemas/  ← zod
        config/
        index.ts
      tests/

  packages/
    ui/         ← shared UI components
    utils/      ← shared helpers
    config/     ← shared constants & types

  supabase/
    migrations/
    schemas/
```

---

# 9. Deployment Plan

### Storefront (Next.js)
- Deploy to Vercel or Netlify
- Use ISR for products & categories
- CDN caching for images

### Admin
- Deploy separately (Vercel/Netlify)
- Only accessible with admin roles

### Backend
- Deploy to Railway / Render / Fly.io
- Add environment variables
- Use a domain like `api.example.com`

### Supabase
- Hosted on Supabase cloud
- Automate migrations

---

# 10. CI/CD
- GitHub Actions pipeline
- Lint + Type check + Tests on PR
- Automatic deployments

---

# 11. API Documentation
- Use Swagger (OpenAPI)
- Define all endpoints
- Include request/response examples

---

# 12. Testing Strategy

### Backend
- Unit tests: services + utils
- Integration tests: API endpoints

### Frontend
- Component tests (React Testing Library)
- E2E tests (Playwright / Cypress)

---

# 13. Monitoring & Logging
- Use Supabase logs for DB
- Backend: use pino or Winston
- Uptime monitoring (UptimeRobot)
- Error tracking (Sentry)

---

# 14. Development Checklist

- [ ] Setup monorepo (Turbo or PNPM workspaces)
- [ ] Create Supabase project
- [ ] Design schema & migrations
- [ ] **Setup Socket.io + Redis for real-time features**
- [ ] Implement backend API modules one by one
- [ ] **Implement WebSocket event handlers**
- [ ] Implement storefront pages
- [ ] **Add Socket.io client to storefront & admin**
- [ ] Implement cart + checkout logic
- [ ] Build admin dashboard modules
- [ ] **Add real-time notifications & live updates**
- [ ] Add environment variables
- [ ] Setup logging & security layers
- [ ] Add tests
- [ ] Deploy everything

---

This guide is complete and structured so **Claude or any LLM** can follow it without missing a single step.