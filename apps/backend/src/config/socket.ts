import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import type { Server as HTTPServer } from 'http'

/**
 * Setup Socket.io server with Redis adapter
 */
export async function setupWebSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.STOREFRONT_URL || 'http://localhost:3000',
        process.env.ADMIN_URL || 'http://localhost:3001'
      ],
      credentials: true,
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  })

  // Setup Redis adapter for horizontal scaling (if Redis is configured)
  if (process.env.REDIS_HOST) {
    try {
      const pubClient = createClient({
        socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || '6379', 10)
        },
        password: process.env.REDIS_PASSWORD || undefined
      })

      const subClient = pubClient.duplicate()

      await Promise.all([
        pubClient.connect(),
        subClient.connect()
      ])

      io.adapter(createAdapter(pubClient, subClient))
      console.log('✅ Socket.io Redis adapter connected')
    } catch (error) {
      console.error('Failed to connect Redis adapter:', error)
      console.warn('⚠️  Running Socket.io without Redis adapter (single server only)')
    }
  } else {
    console.warn('⚠️  REDIS_HOST not configured - Socket.io running without Redis adapter')
  }

  // Connection monitoring
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`)
    })
  })

  return io
}

/**
 * Get active connections count
 */
export function getConnectionStats(io: Server) {
  const sockets = io.sockets.sockets.size
  const adminRoom = io.sockets.adapter.rooms.get('admin:room')
  const adminCount = adminRoom ? adminRoom.size : 0

  return {
    total: sockets,
    admins: adminCount,
    customers: sockets - adminCount
  }
}
