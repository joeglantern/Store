# Admin Dashboard

E-commerce admin dashboard built with Next.js 15, Supabase Auth, and real-time WebSocket features.

## Features

- **Authentication**: Supabase Auth with role-based access control
- **Product Management**: Create, edit, delete products with variants
- **Category Management**: Hierarchical category organization
- **Variant & Inventory**: Track stock levels and manage variants
- **Real-time Notifications**: Live order alerts and low stock warnings via WebSocket
- **Professional Design**: Clean, modern UI following e-commerce best practices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Auth**: Supabase Auth
- **Real-time**: Socket.io Client
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL (default: http://localhost:4000)

### 3. Run Development Server

```bash
pnpm dev
```

The admin dashboard will be available at **http://localhost:3001**

## Authentication

Admin accounts are **invitation-only**. Use the backend API or Supabase dashboard to create admin users with the `admin` or `super_admin` role.

## Real-time Features

The dashboard uses WebSocket connections for:
- **Order Notifications**: Instant alerts for new orders with sound
- **Inventory Updates**: Live stock level changes
- **Low Stock Alerts**: Warnings when products run low
- **Connection Status**: Visual indicator in header
