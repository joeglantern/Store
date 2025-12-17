export default function DashboardPage() {
  const stats = [
    {
      label: 'Total Products',
      value: '0',
      icon: '📦',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      label: 'Total Orders',
      value: '0',
      icon: '🛒',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      label: 'Total Revenue',
      value: '$0',
      icon: '💰',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      label: 'Total Customers',
      value: '0',
      icon: '👥',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
  ]

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your e-commerce store from here
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white border rounded-lg p-6 ${stat.color}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-sm font-medium opacity-80 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/products/new"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-semibold text-gray-900">Add Product</p>
              <p className="text-sm text-gray-600">Create a new product</p>
            </div>
          </a>

          <a
            href="/dashboard/categories"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <span className="text-2xl">🏷️</span>
            <div>
              <p className="font-semibold text-gray-900">Manage Categories</p>
              <p className="text-sm text-gray-600">Organize your products</p>
            </div>
          </a>

          <a
            href="/dashboard/orders"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-semibold text-gray-900">View Orders</p>
              <p className="text-sm text-gray-600">Process customer orders</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
