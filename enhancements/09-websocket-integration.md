# Enhancement 09: WebSocket Integration (Socket.io)

> **Supplements Section 3 of ecommerce_guide.md**
> Complete real-time communication system using Socket.io for live updates.

---

## Why WebSockets for E-Commerce?

### Business Benefits
✅ **Prevent overselling** - Real-time inventory updates across all clients
✅ **Instant notifications** - Admins see new orders immediately
✅ **Better UX** - No page refresh needed for updates
✅ **Professional feel** - Modern, responsive platform
✅ **Competitive advantage** - Most e-commerce sites lack real-time features
✅ **Admin efficiency** - Live dashboard saves time

### Technical Benefits
✅ **Bi-directional communication** - Server can push updates to clients
✅ **Automatic reconnection** - Socket.io handles connection drops
✅ **Room-based broadcasting** - Target specific users/groups
✅ **Scalable** - Redis adapter for multi-server deployment
✅ **Fallback support** - Auto-falls back to long polling if WebSocket unavailable

---

## Architecture Overview

```
┌─────────────┐         WebSocket         ┌──────────────┐
│  Storefront │◄────────────────────────►│   Backend     │
│   (Client)  │      Socket.io Client     │  Socket.io   │
└─────────────┘                           │    Server    │
                                          └──────┬───────┘
┌─────────────┐         WebSocket                │
│    Admin    │◄────────────────────────────────┤
│   (Client)  │      Socket.io Client            │
└─────────────┘                                  │
                                          ┌──────▼───────┐
                                          │    Redis     │
                                          │   Adapter    │
                                          │ (for scaling)│
                                          └──────────────┘
```

---

## Backend Setup

### 1. Installation

```bash
cd apps/backend
npm install socket.io @socket.io/redis-adapter ioredis
```

### 2. Socket.io Server Configuration

**File**: `backend/src/config/socket.ts`

```typescript
import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import { Server as HTTPServer } from 'http'

export async function setupWebSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.STOREFRONT_URL || 'http://localhost:3000',
        process.env.ADMIN_URL || 'http://localhost:3002'
      ],
      credentials: true
    },
    transports: ['websocket', 'polling']
  })

  // Redis adapter for horizontal scaling
  if (process.env.REDIS_URL) {
    const pubClient = createClient({ url: process.env.REDIS_URL })
    const subClient = pubClient.duplicate()

    await pubClient.connect()
    await subClient.connect()

    io.adapter(createAdapter(pubClient, subClient))
    console.log('✅ Socket.io Redis adapter connected')
  }

  return io
}
```

### 3. WebSocket Authentication Middleware

**File**: `backend/src/websocket/middleware/auth.ts`

```typescript
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function authenticateSocket(
  socket: Socket,
  next: (err?: ExtendedError) => void
) {
  try {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error('Authentication token required'))
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return next(new Error('Invalid authentication token'))
    }

    // Fetch user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, email, full_name')
      .eq('user_id', user.id)
      .single()

    // Attach user data to socket
    socket.data.user = {
      id: user.id,
      email: user.email!,
      role: profile?.role || 'customer',
      full_name: profile?.full_name
    }

    next()
  } catch (error) {
    next(new Error('Authentication failed'))
  }
}
```

### 4. Event Handlers

**File**: `backend/src/websocket/handlers/inventory.ts`

```typescript
import { Server, Socket } from 'socket.io'

export function setupInventoryHandlers(io: Server, socket: Socket) {
  // Customer subscribes to product stock updates
  socket.on('subscribe:product', (productId: string) => {
    socket.join(`product:${productId}`)
    console.log(`User ${socket.data.user.id} subscribed to product ${productId}`)
  })

  socket.on('unsubscribe:product', (productId: string) => {
    socket.leave(`product:${productId}`)
  })

  // Broadcast inventory update to all subscribers
  socket.on('inventory:updated', (data: {
    variantId: string
    productId: string
    available: number
  }) => {
    io.to(`product:${data.productId}`).emit('product:stock-updated', {
      variantId: data.variantId,
      available: data.available,
      timestamp: Date.now()
    })
  })
}
```

**File**: `backend/src/websocket/handlers/orders.ts`

```typescript
import { Server, Socket } from 'socket.io'

export function setupOrderHandlers(io: Server, socket: Socket) {
  const isAdmin = ['admin', 'super_admin'].includes(socket.data.user.role)

  if (isAdmin) {
    // Admin joins admin room for broadcasts
    socket.join('admin:room')
    console.log(`Admin ${socket.data.user.email} joined admin room`)
  }

  // Customer subscribes to their order updates
  socket.on('subscribe:order', (orderId: string) => {
    socket.join(`order:${orderId}`)
  })

  socket.on('unsubscribe:order', (orderId: string) => {
    socket.leave(`order:${orderId}`)
  })
}

// Broadcast new order to all admins (call from order service)
export function broadcastNewOrder(io: Server, orderData: any) {
  io.to('admin:room').emit('admin:new-order', {
    order: orderData,
    timestamp: Date.now()
  })
}

// Broadcast order status change to customer
export function broadcastOrderStatusChange(
  io: Server,
  orderId: string,
  status: string,
  trackingNumber?: string
) {
  io.to(`order:${orderId}`).emit('order:status-changed', {
    orderId,
    status,
    trackingNumber,
    timestamp: Date.now()
  })
}
```

**File**: `backend/src/websocket/handlers/cart.ts`

```typescript
import { Server, Socket } from 'socket.io'

export function setupCartHandlers(io: Server, socket: Socket) {
  const userId = socket.data.user.id

  // User joins their cart room for cross-device sync
  socket.join(`cart:${userId}`)

  // Broadcast cart update to all user's devices
  socket.on('cart:update', (cartData: any) => {
    socket.to(`cart:${userId}`).emit('cart:synced', {
      cart: cartData,
      updatedBy: socket.id,
      timestamp: Date.now()
    })
  })
}
```

**File**: `backend/src/websocket/handlers/admin.ts`

```typescript
import { Server, Socket } from 'socket.io'

export function setupAdminHandlers(io: Server, socket: Socket) {
  const isAdmin = ['admin', 'super_admin'].includes(socket.data.user.role)

  if (!isAdmin) return

  // Admin subscribes to live metrics
  socket.on('subscribe:metrics', () => {
    socket.join('admin:metrics')
  })

  socket.on('unsubscribe:metrics', () => {
    socket.leave('admin:metrics')
  })
}

// Broadcast metrics update (call from analytics service)
export function broadcastMetricsUpdate(io: Server, metrics: any) {
  io.to('admin:metrics').emit('admin:metrics-updated', {
    metrics,
    timestamp: Date.now()
  })
}

// Broadcast low stock alert
export function broadcastLowStockAlert(io: Server, alertData: any) {
  io.to('admin:room').emit('admin:low-stock', {
    variant: alertData,
    timestamp: Date.now()
  })
}
```

### 5. Main Socket Setup

**File**: `backend/src/websocket/index.ts`

```typescript
import { Server } from 'socket.io'
import { authenticateSocket } from './middleware/auth'
import { setupInventoryHandlers } from './handlers/inventory'
import { setupOrderHandlers } from './handlers/orders'
import { setupCartHandlers } from './handlers/cart'
import { setupAdminHandlers } from './handlers/admin'

export function setupSocketHandlers(io: Server) {
  // Authentication middleware
  io.use(authenticateSocket)

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.data.user.email}`)

    // Setup event handlers
    setupInventoryHandlers(io, socket)
    setupOrderHandlers(io, socket)
    setupCartHandlers(io, socket)
    setupAdminHandlers(io, socket)

    // Disconnect handler
    socket.on('disconnect', (reason) => {
      console.log(`❌ Client disconnected: ${socket.data.user.email} (${reason})`)
    })

    // Error handler
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.data.user.email}:`, error)
    })
  })
}
```

### 6. Integrate with Backend Server

**File**: `backend/src/index.ts`

```typescript
import Fastify from 'fastify'
import { setupWebSocket } from './config/socket'
import { setupSocketHandlers } from './websocket'

const app = Fastify({ logger: true })

// ... your existing routes

const PORT = process.env.PORT || 3001

async function start() {
  try {
    // Start HTTP server
    await app.listen({ port: PORT, host: '0.0.0.0' })

    // Setup WebSocket on same server
    const io = await setupWebSocket(app.server)
    setupSocketHandlers(io)

    // Make io available globally for broadcasting from services
    app.decorate('io', io)

    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`🔌 WebSocket ready on ws://localhost:${PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
```

---

## Frontend Setup

### Storefront (Customer)

#### 1. Installation

```bash
cd apps/storefront
npm install socket.io-client
```

#### 2. Socket Client Setup

**File**: `storefront/lib/socket.ts`

```typescript
'use client'

import { io, Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'

let socket: Socket | null = null

export function getSocket(token: string): Socket {
  if (!socket || !socket.connected) {
    socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket')
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected:', reason)
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
    })
  }

  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// React hook for WebSocket
export function useSocket(token: string | null) {
  const [isConnected, setIsConnected] = useState(false)
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null)

  useEffect(() => {
    if (!token) return

    const sock = getSocket(token)
    setSocketInstance(sock)

    const onConnect = () => setIsConnected(true)
    const onDisconnect = () => setIsConnected(false)

    sock.on('connect', onConnect)
    sock.on('disconnect', onDisconnect)

    return () => {
      sock.off('connect', onConnect)
      sock.off('disconnect', onDisconnect)
    }
  }, [token])

  return { socket: socketInstance, isConnected }
}
```

#### 3. Live Inventory Updates

**File**: `storefront/components/ProductStock.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useSocket } from '@/lib/socket'

export function ProductStock({
  productId,
  variantId,
  initialStock
}: {
  productId: string
  variantId: string
  initialStock: number
}) {
  const [stock, setStock] = useState(initialStock)
  const { socket, isConnected } = useSocket(getAuthToken())

  useEffect(() => {
    if (!socket || !isConnected) return

    // Subscribe to product updates
    socket.emit('subscribe:product', productId)

    // Listen for stock updates
    socket.on('product:stock-updated', (data) => {
      if (data.variantId === variantId) {
        setStock(data.available)
      }
    })

    return () => {
      socket.emit('unsubscribe:product', productId)
      socket.off('product:stock-updated')
    }
  }, [socket, isConnected, productId, variantId])

  return (
    <div>
      {stock > 0 ? (
        <p className="text-green-600">
          {stock} in stock {isConnected && '🔴'}
        </p>
      ) : (
        <p className="text-red-600">Out of stock</p>
      )}
    </div>
  )
}
```

#### 4. Order Status Tracking

**File**: `storefront/components/OrderTracking.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useSocket } from '@/lib/socket'

export function OrderTracking({ orderId, initialStatus }: {
  orderId: string
  initialStatus: string
}) {
  const [status, setStatus] = useState(initialStatus)
  const [trackingNumber, setTrackingNumber] = useState<string>()
  const { socket, isConnected } = useSocket(getAuthToken())

  useEffect(() => {
    if (!socket || !isConnected) return

    // Subscribe to order updates
    socket.emit('subscribe:order', orderId)

    // Listen for status changes
    socket.on('order:status-changed', (data) => {
      if (data.orderId === orderId) {
        setStatus(data.status)
        setTrackingNumber(data.trackingNumber)
      }
    })

    return () => {
      socket.emit('unsubscribe:order', orderId)
      socket.off('order:status-changed')
    }
  }, [socket, isConnected, orderId])

  return (
    <div>
      <p>Status: <strong>{status}</strong> {isConnected && '🟢'}</p>
      {trackingNumber && (
        <p>Tracking: {trackingNumber}</p>
      )}
    </div>
  )
}
```

### Admin Dashboard

#### 1. New Order Notifications

**File**: `admin/components/OrderNotifications.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useSocket } from '@/lib/socket'
import { toast } from 'sonner'

export function OrderNotifications() {
  const { socket, isConnected } = useSocket(getAuthToken())
  const [newOrdersCount, setNewOrdersCount] = useState(0)

  useEffect(() => {
    if (!socket || !isConnected) return

    // Listen for new orders
    socket.on('admin:new-order', (data) => {
      setNewOrdersCount(prev => prev + 1)

      // Play notification sound
      const audio = new Audio('/notification.mp3')
      audio.play()

      // Show toast
      toast.success(`New Order: ${data.order.order_number}`, {
        description: `Total: $${data.order.total}`,
        action: {
          label: 'View',
          onClick: () => window.location.href = `/admin/orders/${data.order.id}`
        }
      })
    })

    // Listen for low stock alerts
    socket.on('admin:low-stock', (data) => {
      toast.warning('Low Stock Alert', {
        description: `${data.variant.product_name} - ${data.variant.name}: ${data.variant.available} left`
      })
    })

    return () => {
      socket.off('admin:new-order')
      socket.off('admin:low-stock')
    }
  }, [socket, isConnected])

  return (
    <div className="relative">
      🔔
      {newOrdersCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {newOrdersCount}
        </span>
      )}
      {isConnected && <span className="text-green-500">●</span>}
    </div>
  )
}
```

#### 2. Live Dashboard Metrics

**File**: `admin/components/LiveMetrics.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useSocket } from '@/lib/socket'

export function LiveMetrics({ initialMetrics }: {
  initialMetrics: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
  }
}) {
  const [metrics, setMetrics] = useState(initialMetrics)
  const { socket, isConnected } = useSocket(getAuthToken())

  useEffect(() => {
    if (!socket || !isConnected) return

    // Subscribe to metrics updates
    socket.emit('subscribe:metrics')

    // Listen for updates
    socket.on('admin:metrics-updated', (data) => {
      setMetrics(data.metrics)
    })

    return () => {
      socket.emit('unsubscribe:metrics')
      socket.off('admin:metrics-updated')
    }
  }, [socket, isConnected])

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <h3>Total Revenue</h3>
        <p className="text-2xl">${metrics.totalRevenue.toFixed(2)}</p>
      </div>
      <div>
        <h3>Total Orders</h3>
        <p className="text-2xl">{metrics.totalOrders}</p>
      </div>
      <div>
        <h3>Avg Order Value</h3>
        <p className="text-2xl">${metrics.averageOrderValue.toFixed(2)}</p>
      </div>
      {isConnected && <p className="col-span-3 text-green-500 text-sm">● Live updates</p>}
    </div>
  )
}
```

---

## Integration with Services

### Broadcast from Order Service

**File**: `backend/src/services/order.service.ts`

```typescript
import { FastifyInstance } from 'fastify'
import { broadcastNewOrder, broadcastOrderStatusChange } from '../websocket/handlers/orders'

export async function createOrder(app: FastifyInstance, userId: string, orderData: any) {
  // ... create order logic

  const order = await db.from('orders').insert(orderData).select().single()

  // Broadcast to admins
  broadcastNewOrder(app.io, order)

  return order
}

export async function updateOrderStatus(
  app: FastifyInstance,
  orderId: string,
  status: string,
  trackingNumber?: string
) {
  // ... update order logic

  // Broadcast to customer
  broadcastOrderStatusChange(app.io, orderId, status, trackingNumber)
}
```

### Broadcast from Inventory Service

**File**: `backend/src/services/inventory.service.ts`

```typescript
import { FastifyInstance } from 'fastify'

export async function updateInventory(
  app: FastifyInstance,
  variantId: string,
  newQuantity: number
) {
  // Update inventory
  const { data } = await db
    .from('inventory')
    .update({ quantity: newQuantity })
    .eq('variant_id', variantId)
    .select('*, variants(product_id)')
    .single()

  const available = data.quantity - data.reserved

  // Broadcast stock update
  app.io.to(`product:${data.variants.product_id}`).emit('product:stock-updated', {
    variantId,
    available,
    timestamp: Date.now()
  })

  // Check for low stock
  if (available <= data.low_stock_threshold) {
    app.io.to('admin:room').emit('admin:low-stock', {
      variantId,
      available,
      threshold: data.low_stock_threshold
    })
  }
}
```

---

## Security Best Practices

✅ **Authentication required** - All WebSocket connections must authenticate
✅ **Token validation** - Verify JWT/Supabase tokens on connection
✅ **Role-based rooms** - Separate admin and customer rooms
✅ **Rate limiting** - Limit events per second per socket
✅ **Input validation** - Validate all incoming event data
✅ **CORS configuration** - Only allow trusted origins
✅ **Namespace isolation** - Consider separate namespaces for admin/customer
✅ **Monitor connections** - Log and track active connections

---

## Testing

### Unit Tests

```typescript
// backend/tests/websocket/auth.test.ts
import { authenticateSocket } from '@/websocket/middleware/auth'

describe('WebSocket Authentication', () => {
  it('should reject connections without token', async () => {
    const socket = createMockSocket({ auth: {} })
    const next = jest.fn()

    await authenticateSocket(socket, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('should accept valid tokens', async () => {
    const socket = createMockSocket({
      auth: { token: VALID_TOKEN }
    })
    const next = jest.fn()

    await authenticateSocket(socket, next)

    expect(next).toHaveBeenCalledWith()
    expect(socket.data.user).toBeDefined()
  })
})
```

### Integration Tests

```typescript
// backend/tests/websocket/integration.test.ts
import { io as Client } from 'socket.io-client'

describe('WebSocket Integration', () => {
  let clientSocket: Socket

  beforeAll(async () => {
    clientSocket = Client('http://localhost:3001', {
      auth: { token: await getTestToken() }
    })

    await new Promise(resolve => clientSocket.on('connect', resolve))
  })

  afterAll(() => {
    clientSocket.disconnect()
  })

  it('should receive inventory updates', (done) => {
    const productId = 'test-product-id'

    clientSocket.emit('subscribe:product', productId)

    clientSocket.on('product:stock-updated', (data) => {
      expect(data.variantId).toBeDefined()
      expect(data.available).toBeGreaterThanOrEqual(0)
      done()
    })

    // Trigger update from another service
    updateInventoryViaAPI(productId)
  })
})
```

---

## Monitoring & Performance

### Connection Monitoring

```typescript
// backend/src/websocket/monitoring.ts
export function setupMonitoring(io: Server) {
  // Log connection stats every minute
  setInterval(() => {
    const sockets = io.sockets.sockets.size
    const adminSockets = io.sockets.adapter.rooms.get('admin:room')?.size || 0

    console.log(`📊 Active connections: ${sockets} (${adminSockets} admins)`)
  }, 60000)

  // Monitor for errors
  io.on('connection', (socket) => {
    socket.on('error', (error) => {
      // Log to monitoring service (Sentry, etc.)
      console.error('Socket error:', error)
    })
  })
}
```

### Performance Tips

✅ Use Redis adapter for multi-server scaling
✅ Implement connection pooling
✅ Rate limit events per socket
✅ Use rooms efficiently (don't broadcast globally)
✅ Clean up disconnected sockets
✅ Monitor memory usage
✅ Implement heartbeat/ping-pong for connection health

---

## Environment Variables

Add to `.env` files:

```bash
# Backend
REDIS_URL=redis://localhost:6379
STOREFRONT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3002

# Storefront
NEXT_PUBLIC_API_URL=http://localhost:3001

# Admin
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Deployment Considerations

### Production Checklist

- [ ] Enable Redis adapter for horizontal scaling
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS for wss:// protocol
- [ ] Implement sticky sessions for load balancing
- [ ] Monitor WebSocket connection health
- [ ] Set connection limits per server
- [ ] Implement graceful shutdown
- [ ] Log WebSocket metrics

### Scaling Strategy

```
                  Load Balancer (sticky sessions)
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    Server 1         Server 2         Server 3
    (Socket.io)      (Socket.io)      (Socket.io)
        │                │                │
        └────────────────┴────────────────┘
                         │
                    Redis Pub/Sub
              (syncs events across servers)
```

---

## Next Steps

- [Phase 0] Setup Socket.io + Redis in backend
- [Phase 1] Implement WebSocket authentication
- [Phase 2] Add client-side socket connection
- [Phase 3] Implement live inventory updates
- [Phase 4] Add admin real-time notifications
- [Phase 5] Polish and optimize WebSocket features
