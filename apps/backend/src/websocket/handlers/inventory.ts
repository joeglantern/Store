import type { Server, Socket } from 'socket.io'

/**
 * Setup inventory event handlers
 */
export function setupInventoryHandlers(io: Server, socket: Socket) {
  // Customer subscribes to product stock updates
  socket.on('subscribe:product', (productId: string) => {
    if (!productId) return

    socket.join(`product:${productId}`)
    console.log(`User ${socket.data.user.email} subscribed to product ${productId}`)
  })

  // Customer unsubscribes from product updates
  socket.on('unsubscribe:product', (productId: string) => {
    if (!productId) return

    socket.leave(`product:${productId}`)
    console.log(`User ${socket.data.user.email} unsubscribed from product ${productId}`)
  })
}

/**
 * Broadcast inventory update to all subscribers
 * Called from inventory service after stock change
 */
export function broadcastInventoryUpdate(
  io: Server,
  data: {
    variantId: string
    productId: string
    available: number
    quantity: number
    reserved: number
  }
) {
  io.to(`product:${data.productId}`).emit('product:stock-updated', {
    variantId: data.variantId,
    available: data.available,
    quantity: data.quantity,
    reserved: data.reserved,
    timestamp: Date.now()
  })

  console.log(`📦 Broadcasted stock update for product ${data.productId}`)
}
