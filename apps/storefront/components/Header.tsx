'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  User,
  Heart,
  ShoppingCart,
  Lock,
  Search,
  Phone,
  Menu,
  X,
  ChevronDown
} from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="w-full">
      {/* Top Bar - Dark Background */}
      <div className="bg-[#2D2D2D] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10">
            {/* Left Side - Language, Currency, Welcome */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                <span>English</span>
                <ChevronDown size={14} />
              </div>
              <span className="text-gray-500">|</span>
              <div className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                <span>USD</span>
                <ChevronDown size={14} />
              </div>
              <span className="text-gray-500">|</span>
              <span className="text-gray-300">Welcome To Ecommerce</span>
            </div>

            {/* Right Side - Account Links */}
            <div className="hidden md:flex items-center gap-4 text-gray-300">
              <Link href="/account" className="hover:text-white transition-colors flex items-center gap-1.5">
                <User size={14} />
                <span>My Account</span>
              </Link>
              <span className="text-gray-500">|</span>
              <Link href="/wishlist" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Heart size={14} />
                <span>My Wishlist</span>
              </Link>
              <span className="text-gray-500">|</span>
              <Link href="/checkout" className="hover:text-white transition-colors flex items-center gap-1.5">
                <ShoppingCart size={14} />
                <span>Check Out</span>
              </Link>
              <span className="text-gray-500">|</span>
              <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Lock size={14} />
                <span>Log In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Bar - Logo, Search, Phone */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-[var(--jl-primary)] rounded flex items-center justify-center text-white">
                <ShoppingCart size={24} />
              </div>
              <div>
                <div className="text-xl font-bold text-[#333333]">E-Com Shop</div>
                <div className="text-xs text-gray-500">Making eCommerce Better</div>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-2xl">
              <div className="flex w-full">
                <select className="px-4 py-2 border border-r-0 border-gray-300 bg-white text-[#333333] text-sm focus:outline-none focus:border-[var(--jl-primary)] rounded-l">
                  <option>ALL CATEGORIES</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home & Garden</option>
                </select>
                <input
                  type="text"
                  placeholder="Search entire store here..."
                  className="flex-1 px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[var(--jl-primary)] text-[#333333]"
                />
                <button className="px-6 py-2 bg-[var(--jl-primary)] hover:bg-[var(--jl-primary-hover)] text-white font-semibold rounded-r transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Phone CTA */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 bg-[var(--jl-primary)] rounded flex items-center justify-center text-white">
                <Phone size={20} />
              </div>
              <div className="text-sm">
                <div className="text-gray-500 text-xs">CALL US FREE:</div>
                <div className="font-semibold text-[#333333]">+01 123 456 89</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Categories Dropdown */}
            <button className="bg-[var(--jl-primary)] hover:bg-[var(--jl-primary-hover)] text-white px-6 py-3 flex items-center gap-3 font-semibold uppercase text-sm transition-colors">
              <Menu size={18} />
              <span>CATEGORIES</span>
            </button>

            {/* Navigation Menu - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-[var(--jl-primary)] font-semibold uppercase text-sm py-4 border-b-2 border-[var(--jl-primary)]">
                HOME
              </Link>
              <Link href="/about" className="text-[#333333] hover:text-[var(--jl-primary)] font-medium uppercase text-sm py-4 transition-colors">
                ABOUT US
              </Link>
              <Link href="/men" className="text-[#333333] hover:text-[var(--jl-primary)] font-medium uppercase text-sm py-4 transition-colors">
                MEN
              </Link>
              <Link href="/women" className="text-[#333333] hover:text-[var(--jl-primary)] font-medium uppercase text-sm py-4 transition-colors">
                WOMEN
              </Link>
              <Link href="/electronic" className="text-[#333333] hover:text-[var(--jl-primary)] font-medium uppercase text-sm py-4 transition-colors">
                ELECTRONIC
              </Link>
              <Link href="/contact" className="text-[#333333] hover:text-[var(--jl-primary)] font-medium uppercase text-sm py-4 transition-colors">
                CONTACT US
              </Link>
            </nav>

            {/* Cart Button */}
            <Link href="/cart" className="flex items-center gap-3 bg-[var(--jl-black)] hover:bg-gray-800 text-white px-6 py-3 transition-colors">
              <ShoppingCart size={18} />
              <span className="font-semibold uppercase text-sm">MY CART</span>
              <span className="bg-[var(--jl-primary)] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[#333333]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[var(--jl-primary)]"
              />
              <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
            </div>
            <Link href="/" className="block py-2 text-[var(--jl-primary)] font-semibold uppercase text-sm">
              HOME
            </Link>
            <Link href="/about" className="block py-2 text-[#333333] hover:text-[var(--jl-primary)] font-medium uppercase text-sm">
              ABOUT US
            </Link>
            <Link href="/men" className="block py-2 text-[#333333] hover:text-[var(--jl-primary)] font-medium uppercase text-sm">
              MEN
            </Link>
            <Link href="/women" className="block py-2 text-[#333333] hover:text-[var(--jl-primary)] font-medium uppercase text-sm">
              WOMEN
            </Link>
            <Link href="/electronic" className="block py-2 text-[#333333] hover:text-[var(--jl-primary)] font-medium uppercase text-sm">
              ELECTRONIC
            </Link>
            <Link href="/contact" className="block py-2 text-[#333333] hover:text-[var(--jl-primary)] font-medium uppercase text-sm">
              CONTACT US
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
