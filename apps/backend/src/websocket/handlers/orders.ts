import type { Server, Socket } from 'socket.io'

/**
 * Setup order event handlers
 */
export function setupOrderHandlers(io: Server, socket: Socket) {
  const isAdmin = ['admin', 'super_admin'].includes(socket.data.user.role)

  // Admin joins admin room for broadcasts
  if (isAdmin) {
    socket.join('admin:room')
    console.log(`Admin ${socket.data.user.email} joined admin room`)
  }

  // Customer subscribes to their order updates
  socket.on('subscribe:order', (orderId: string) => {
    if (!orderId) return

    socket.join(`order:${orderId}`)
    console.log(`User ${socket.data.user.email} subscribed to order ${orderId}`)
  })

  // Customer unsubscribes from order updates
  socket.on('unsubscribe:order', (orderId: string) => {
    if (!orderId) return

    socket.leave(`order:${orderId}`)
    console.log(`User ${socket.data.user.email} unsubscribed from order ${orderId}`)
  })
}

/**
 * Broadcast new order to all admins
 * Called from order service after order creation
 */
export function broadcastNewOrder(io: Server, orderData: any) {
  io.to('admin:room').emit('admin:new-order', {
    order: orderData,
    timestamp: Date.now()
  })

  console.log(`🔔 Broadcasted new order ${orderData.order_number} to admins`)
}

/**
 * Broadcast order status change to customer
 * Called when admin updates order status
 */
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

  console.log(`📝 Broadcasted status change for order ${orderId}: ${status}`)
}
