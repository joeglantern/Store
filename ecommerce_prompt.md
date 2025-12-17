# Enhanced Development Prompt for Full E-Commerce System

**Goal:** Create a complete, production-grade e-commerce platform using **Next.js** (frontend storefront), **a separate Next.js Admin Dashboard**, and a **Node.js backend** connected to **Supabase**. The system must follow best practices, strong security standards, scalable file structure, excellent performance, SEO optimization, and perfect UI/UX.

---

## **Final Prompt (Copy & Use This):**

I want you to create a complete, production-grade **e-commerce platform** with the following requirements:

---

## **1. Project Overview**

Build an end-to-end e-commerce system consisting of **three separate applications within one monorepo**:

1. **Storefront (Next.js App)** – public website for customers.
2. **Admin Dashboard (Next.js App)** – built and deployed separately; used for managing products, orders, categories, users, discounts, etc.
3. **Backend API (Node.js + Supabase)** – secure backend handling all business logic, authentication, authorization, and database access.

Everything should follow best practices, clean architecture, and a scalable structure.

---

## **2. Technologies & Architecture Requirements**

### **Frontend: Next.js (Storefront + Admin)**

- Next.js App Router
- TypeScript
- Server Components where applicable
- Optimized images (`next/image`)
- Full responsiveness (mobile → tablet → desktop)
- SEO best practices (meta tags, OpenGraph, structured data)
- UI/UX best practices
- Reusable components with clean structure
- Client caching, ISR, and SSR where appropriate
- State management using React Query / Zustand / Context (recommend best option)

### **Backend: Node.js**

- Node.js (latest LTS)
- Express or Fastify (recommend best choice)
- Clean architecture
- Service layer, controller layer, repository layer
- Input validation using Zod or Joi
- JWT authentication + refresh token rotation
- RBAC (roles: customer, admin)
- **Socket.io for real-time communication**
- **Redis for WebSocket scaling, rate limiting, and session management**
- Strong rate limiting
- Logging and monitoring

### **Database: Supabase (PostgreSQL)**

- Auth (email/password + OAuth optional)
- Row-level security policies
- Database schema for:
  - Users
  - Products
  - Categories
  - Variants (size, color, etc.)
  - Orders
  - Shopping cart
  - Wishlists
  - Addresses
  - Payments
  - Inventory tracking
  - Admin roles and permissions

---

## **3. Required Features**

### **Storefront Features**

- User authentication (login/register)
- Home page with banners, deals, recommended products
- Product listings with filtering, sorting, pagination
- Product detail page with variants, stock, reviews
- Cart + wishlist
- Checkout flow
- Address management
- Order tracking
- **Real-time inventory updates** (see stock changes instantly via WebSocket)
- **Live order status tracking** (order updates without page refresh)
- **Cross-device cart synchronization** (cart syncs in real-time across devices)
- Responsive UI
- Optimized loading

### **Admin Dashboard Features (Separate App)**

- Dashboard analytics
- **Live dashboard metrics** (revenue, orders update in real-time)
- Manage products (CRUD)
- Manage categories
- Manage orders
- **Instant new order notifications** (with sound alert via WebSocket)
- Manage inventory
- **Low stock alerts** (real-time notifications when inventory is low)
- Manage discounts and coupons
- User management
- Role and permission management
- Image upload system (Supabase Storage)
- Logs/audit trails
- **Real-time admin collaboration** (see who's editing what)

### **Backend API Features**

- Secure REST API
- Authentication & authorization
- **WebSocket event system** (Socket.io for real-time communication)
- **WebSocket authentication** (secure token-based WebSocket connections)
- Cart and checkout logic
- Order creation
- Payment integration placeholder
- Webhooks handler (optional)
- Inventory lock & release
- **Real-time inventory broadcasting** (notify all connected clients of stock changes)
- **Real-time order notifications** (broadcast new orders to admin clients)
- Admin protected routes
- Image optimization pipeline

---

## **4. Performance & Optimization Requirements**

- Image optimization using Next.js
- Database indexing and optimized queries
- API response caching (HTTP + CDN)
- Avoid large files and heavy bundles
- Lazy loading, code splitting
- Reusable components and modular design
- Minimized CLS and good Lighthouse score
- Preloading critical resources

---

## **5. Security Requirements**

- Rate limiting
- JWT rotation & protection
- **WebSocket authentication** (require valid tokens for WebSocket connections)
- **WebSocket CORS** (only allow trusted origins)
- **Rate limiting for WebSocket events** (prevent event spam)
- Strong Supabase RLS
- Input validation everywhere
- Secure cookies for authentication
- Avoid over-fetching and N+1 queries
- HTTPS only (WSS for WebSocket in production)
- Role-based access for admin
- CSRF protection
- Prevent SQL injection

---

## **6. Project Structure (Monorepo)**

Use a **TurboRepo** or **PNPM workspace** with the following structure:

```
root/
  apps/
    storefront/ (Next.js)
    admin/ (Next.js)
    backend/ (Node.js API)
  packages/
    ui/ (shared components)
    utils/ (shared helpers)
    config/ (shared types & config)
  supabase/
    migrations/
    schemas/
```

Each app should be fully isolated and deployable independently.

---

## **7. Additional Tasks to Include**

- Detailed API documentation (Swagger or Postman)
- **WebSocket event documentation** (all real-time events and their schemas)
- ERD diagram for database
- **Redis setup for WebSocket scaling**
- Deployment strategy for all three apps
- **WebSocket deployment with sticky sessions** (for load balancing)
- CI/CD pipeline plan
- Testing plan (unit tests + integration tests + WebSocket event tests)
- Monitoring/logging suggestions
- **WebSocket connection monitoring** (track active connections, broadcasts)

---



