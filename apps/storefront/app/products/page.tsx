'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { fetchProducts, fetchCategories } from '@/lib/api'
import type { Product, Category } from '@/types/product'
import { Package, ShoppingCart } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('name:asc')

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [selectedCategory, sortBy])

  const loadCategories = async () => {
    const response = await fetchCategories()
    if (response.success && response.data) {
      setCategories(response.data.categories)
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    const response = await fetchProducts({
      limit: 24,
      category: selectedCategory || undefined,
      sort: sortBy
    })

    if (response.success && response.data) {
      setProducts(response.data.products)
    }
    setLoading(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-[#666666]">
            <Link href="/" className="hover:text-[var(--jl-primary)]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#333333]">All Products</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="font-bold text-[#333333] mb-4 uppercase text-sm">CATEGORIES</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                    selectedCategory === ''
                      ? 'bg-[var(--jl-primary)] text-white font-medium'
                      : 'text-[#666666] hover:bg-gray-100'
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-[var(--jl-primary)] text-white font-medium'
                        : 'text-[#666666] hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#666666]">
                  {loading ? 'Loading...' : `Showing ${products.length} products`}
                </p>
                <div className="flex items-center gap-4">
                  <label className="text-sm text-[#666666]">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded bg-white text-[#333333] text-sm focus:outline-none focus:border-[var(--jl-primary)]"
                  >
                    <option value="name:asc">Name (A-Z)</option>
                    <option value="name:desc">Name (Z-A)</option>
                    <option value="price:asc">Price (Low to High)</option>
                    <option value="price:desc">Price (High to Low)</option>
                    <option value="created_at:desc">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="text-[#666666]">Loading products...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                <p className="text-[#666666] mb-4">No products found</p>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="text-[var(--jl-primary)] hover:underline font-medium"
                  >
                    View all products
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <div className="w-full h-full bg-gray-200 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                        <Package size={80} strokeWidth={1} className="text-gray-400" />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {product.brand && (
                        <p className="text-xs text-[#999999] uppercase mb-1">
                          {product.brand}
                        </p>
                      )}
                      <h3 className="font-semibold text-[#333333] mb-2 line-clamp-2 group-hover:text-[var(--jl-primary)] transition-colors">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-[#666666] mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[var(--jl-text-primary)]">
                          {formatPrice(product.base_price)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            alert('Add to cart coming soon!')
                          }}
                          className="px-4 py-2 bg-[var(--jl-black)] hover:bg-gray-800 text-white text-sm font-semibold rounded transition-colors flex items-center gap-2"
                        >
                          <ShoppingCart size={16} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#2D2D2D] text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 E-Com Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
