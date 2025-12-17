import type { Server, Socket } from 'socket.io'

/**
 * Setup admin event handlers
 */
export function setupAdminHandlers(io: Server, socket: Socket) {
  const isAdmin = ['admin', 'super_admin'].includes(socket.data.user.role)

  if (!isAdmin) return

  // Admin subscribes to live metrics
  socket.on('subscribe:metrics', () => {
    socket.join('admin:metrics')
    console.log(`Admin ${socket.data.user.email} subscribed to metrics`)
  })

  // Admin unsubscribes from metrics
  socket.on('unsubscribe:metrics', () => {
    socket.leave('admin:metrics')
    console.log(`Admin ${socket.data.user.email} unsubscribed from metrics`)
  })
}

/**
 * Broadcast metrics update to subscribed admins
 * Called periodically or after significant changes
 */
export function broadcastMetricsUpdate(io: Server, metrics: any) {
  io.to('admin:metrics').emit('admin:metrics-updated', {
    metrics,
    timestamp: Date.now()
  })

  console.log('📊 Broadcasted metrics update to admins')
}

/**
 * Broadcast low stock alert to all admins
 * Called when inventory drops below threshold
 */
export function broadcastLowStockAlert(io: Server, alertData: {
  variantId: string
  productName: string
  variantName: string
  available: number
  threshold: number
}) {
  io.to('admin:room').emit('admin:low-stock', {
    variant: alertData,
    timestamp: Date.now()
  })

  console.log(`⚠️  Broadcasted low stock alert: ${alertData.productName} - ${alertData.variantName}`)
}
