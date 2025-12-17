'use client'

import { useState, useEffect, useRef } from 'react'
import { useSocketEvent } from '@/hooks/useSocket'

interface Notification {
  id: string
  type: 'order' | 'inventory' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element for notification sound
    audioRef.current = new Audio('/notification.mp3')
  }, [])

  // Listen for new order notifications
  useSocketEvent('new_order', (data: any) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'order',
      title: 'New Order',
      message: `Order #${data.order_id} received`,
      timestamp: new Date(),
      read: false
    }

    setNotifications(prev => [notification, ...prev])
    setUnreadCount(prev => prev + 1)

    // Play sound
    audioRef.current?.play().catch(() => {
      // Ignore if audio playback fails
    })
  })

  // Listen for low stock alerts
  useSocketEvent('low_stock_alert', (data: any) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'inventory',
      title: 'Low Stock Alert',
      message: `${data.product_name} is running low (${data.available} left)`,
      timestamp: new Date(),
      read: false
    }

    setNotifications(prev => [notification, ...prev])
    setUnreadCount(prev => prev + 1)
  })

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const clearAll = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '🛒'
      case 'inventory':
        return '📦'
      default:
        return '🔔'
    }
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          ></div>

          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {notifications.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <span className="text-4xl block mb-2">🔕</span>
                  <p>No notifications</p>
                </div>
              ) : (
                <div>
                  {notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-orange-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
