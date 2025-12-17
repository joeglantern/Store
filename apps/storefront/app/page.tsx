'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShoppingCart, Package, MapPin, Phone as PhoneIcon, Mail } from 'lucide-react'
import { fetchProducts } from '@/lib/api'
import type { Product } from '@/types/product'

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    setLoading(true)
    const response = await fetchProducts({ limit: 4 })
    if (response.success && response.data) {
      setFeaturedProducts(response.data.products)
    }
    setLoading(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const slides = [
    {
      title: 'FASHION FOR MEN',
      description: 'That this group would somehow form a family that\'s the way we all became the Brady Bunch. Love exciting and new. Come aboard were expecting you. Love life\'s sweetest reward Let it flow it floats back to you!',
      buttonText: 'SHOP NOW'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Carousel Section */}
      <section className="bg-gray-100 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
            {/* Left Side - Text Content */}
            <div className="flex items-center px-8 lg:px-16 py-16">
              <div className="max-w-lg">
                {/* Navigation Arrows - Left */}
                <button
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded flex items-center justify-center text-gray-600 hover:text-[#FF9900] transition-all shadow-md z-10"
                >
                  <ChevronLeft size={24} />
                </button>

                <h1 className="text-4xl lg:text-5xl font-bold text-[#333333] mb-6 uppercase">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-[#666666] mb-8 leading-relaxed">
                  {slides[currentSlide].description}
                </p>
                <Link
                  href="/products"
                  className="inline-block px-8 py-3 border-2 border-[#333333] text-[#333333] hover:bg-[#333333] hover:text-white font-semibold uppercase text-sm transition-all"
                >
                  {slides[currentSlide].buttonText}
                </Link>

                {/* Carousel Indicators */}
                <div className="flex items-center gap-2 mt-12">
                  <div className="w-3 h-3 rounded-full bg-[#FF9900]"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
              </div>
            </div>

            {/* Right Side - Product Image */}
            <div className="relative flex items-center justify-center bg-gray-100 p-8">
              <div className="relative w-full max-w-md aspect-square">
                {/* Placeholder for product image */}
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  <Package size={120} strokeWidth={1} />
                </div>
              </div>

              {/* Navigation Arrow - Right */}
              <button
                onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded flex items-center justify-center text-gray-600 hover:text-[#FF9900] transition-all shadow-md z-10"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Deals Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#333333] uppercase">HOT DEALS</h2>
              <div className="w-24 h-1 bg-[#FF9900] mt-2"></div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 border border-gray-300 hover:border-[#FF9900] hover:text-[#FF9900] rounded flex items-center justify-center transition-all">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 border border-gray-300 hover:border-[#FF9900] hover:text-[#FF9900] rounded flex items-center justify-center transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-12 text-[#666666]">Loading products...</div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#666666] mb-4">No products available yet</p>
              <p className="text-sm text-[#999999]">Admin can add products from the dashboard</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gray-200 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <Package size={80} strokeWidth={1} className="text-gray-400" />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {product.brand && (
                      <p className="text-xs text-[#999999] uppercase mb-1">{product.brand}</p>
                    )}
                    <h3 className="font-semibold text-[#333333] mb-2 line-clamp-2 group-hover:text-[#FF9900] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-lg font-bold text-[#FF9900]">
                        {formatPrice(product.base_price)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          alert('Add to cart coming in Phase 3!')
                        }}
                        className="px-4 py-2 bg-[#FF9900] hover:bg-[#E68A00] text-white text-sm font-semibold rounded transition-colors flex items-center gap-2"
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
      </section>

      {/* Footer */}
      <footer className="bg-[#2D2D2D] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-bold mb-4">E-Com Shop</h3>
              <p className="text-gray-400 text-sm">
                Your trusted source for quality products at great prices.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 uppercase text-sm">QUICK LINKS</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors">Returns Policy</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold mb-4 uppercase text-sm">CUSTOMER SERVICE</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/account" className="text-gray-400 hover:text-white transition-colors">My Account</Link></li>
                <li><Link href="/orders" className="text-gray-400 hover:text-white transition-colors">Order History</Link></li>
                <li><Link href="/wishlist" className="text-gray-400 hover:text-white transition-colors">Wishlist</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4 uppercase text-sm">CONTACT US</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>123 Main Street, City, State 12345</span>
                </li>
                <li className="flex items-center gap-2">
                  <PhoneIcon size={16} />
                  <span>+01 123 456 89</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>support@ecomshop.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 E-Com Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
