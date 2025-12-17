'use client'

import { useEffect, useState, useRef } from 'react'

interface StickyAddToCartProps {
  productName: string
  price: string
  selectedVariantName: string | null
  quantity: number
  onAddToCart: () => void
  isInStock: boolean
  mainButtonRef?: React.RefObject<HTMLButtonElement>
}

export default function StickyAddToCart({
  productName,
  price,
  selectedVariantName,
  quantity,
  onAddToCart,
  isInStock,
  mainButtonRef
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!mainButtonRef?.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky when main button is not visible
        setIsVisible(!entry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: '-80px 0px 0px 0px' // Account for header height
      }
    )

    observer.observe(mainButtonRef.current)

    return () => {
      observer.disconnect()
    }
  }, [mainButtonRef])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--jl-border)] shadow-[var(--jl-shadow-card)] z-40 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[var(--jl-text-primary)] truncate">
              {productName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-[var(--jl-text-secondary)]">
              <span className="font-bold text-[var(--jl-text-primary)]">{price}</span>
              {selectedVariantName && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="truncate">{selectedVariantName}</span>
                </>
              )}
              <span className="text-gray-400">•</span>
              <span>Qty: {quantity}</span>
            </div>
          </div>

          {/* Add to Cart Button (Black like JL) */}
          <button
            onClick={onAddToCart}
            disabled={!isInStock}
            className="flex-shrink-0 px-6 py-3 bg-[var(--jl-black)] hover:bg-gray-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <span className="hidden sm:inline">
              {isInStock ? 'Add to Cart' : 'Out of Stock'}
            </span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>
  )
}
