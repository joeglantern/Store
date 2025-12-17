'use client'

import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import Link from 'next/link'
import { useSocket } from '@/hooks/useSocket'
import NotificationBell from '@/components/NotificationBell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isConnected } = useSocket()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Products', href: '/dashboard/products', icon: '📦' },
    { name: 'Categories', href: '/dashboard/categories', icon: '🏷️' },
    { name: 'Orders', href: '/dashboard/orders', icon: '🛒' },
    { name: 'Customers', href: '/dashboard/customers', icon: '👥' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Dark background following design guidelines */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">Store Management</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                style={isActive ? { backgroundColor: '#FF9900' } : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <span className="text-lg">🚪</span>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {navigation.find(item => pathname.startsWith(item.href))?.name || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <NotificationBell />

              {/* Connection Status Indicator */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
