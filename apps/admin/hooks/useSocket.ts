'use client'

import { useEffect, useState, useCallback } from 'react'
import { Socket } from 'socket.io-client'
import { socketManager } from '@/lib/socket'

interface UseSocketReturn {
  socket: Socket | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

export function useSocket(): UseSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const connect = useCallback(async () => {
    try {
      const socketInstance = await socketManager.connect()
      setSocket(socketInstance)
      setIsConnected(socketInstance.connected)

      // Update connection status on events
      socketInstance.on('connect', () => setIsConnected(true))
      socketInstance.on('disconnect', () => setIsConnected(false))
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      setIsConnected(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    socketManager.disconnect()
    setSocket(null)
    setIsConnected(false)
  }, [])

  // Auto-connect on mount
  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    socket,
    isConnected,
    connect,
    disconnect
  }
}

// Hook for listening to specific events
export function useSocketEvent<T = any>(
  eventName: string,
  handler: (data: T) => void
) {
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    socket.on(eventName, handler)

    return () => {
      socket.off(eventName, handler)
    }
  }, [socket, eventName, handler])
}

// Hook for joining/leaving rooms
export function useSocketRoom(roomName: string | null) {
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!socket || !isConnected || !roomName) return

    // Join room
    socket.emit('join_room', roomName)

    return () => {
      // Leave room on cleanup
      socket.emit('leave_room', roomName)
    }
  }, [socket, isConnected, roomName])
}
