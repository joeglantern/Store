import type { Server } from 'socket.io'
import { authenticateSocket } from './middleware/auth.js'
import { setupInventoryHandlers } from './handlers/inventory.js'
import { setupOrderHandlers } from './handlers/orders.js'
import { setupAdminHandlers } from './handlers/admin.js'

/**
 * Setup all WebSocket handlers and middleware
 */
export function setupSocketHandlers(io: Server) {
  // Authentication middleware (runs before connection)
  io.use(authenticateSocket)

  // Connection handler
  io.on('connection', (socket) => {
    const user = socket.data.user
    console.log(`✅ WebSocket connected: ${user.email} (${user.role})`)

    // Setup event handlers for this socket
    setupInventoryHandlers(io, socket)
    setupOrderHandlers(io, socket)
    setupAdminHandlers(io, socket)

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to WebSocket server',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      timestamp: Date.now()
    })

    // Disconnect handler
    socket.on('disconnect', (reason) => {
      console.log(`❌ WebSocket disconnected: ${user.email} (${reason})`)
    })

    // Error handler
    socket.on('error', (error) => {
      console.error(`WebSocket error for ${user.email}:`, error)
    })

    // Ping/Pong for connection health
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() })
    })
  })

  // Global error handler
  io.on('error', (error) => {
    console.error('Socket.io server error:', error)
  })

  console.log('✅ WebSocket handlers configured')
}

// Re-export broadcast functions for easy access
export { broadcastInventoryUpdate } from './handlers/inventory.js'
export { broadcastNewOrder, broadcastOrderStatusChange } from './handlers/orders.js'
export { broadcastMetricsUpdate, broadcastLowStockAlert } from './handlers/admin.js'
