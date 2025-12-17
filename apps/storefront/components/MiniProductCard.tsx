'use client'

import Image from 'next/image'

interface MiniProductCardProps {
  productName: string
  price: string
  selectedVariantName: string | null
  quantity: number
  onAddToCart: () => void
  isInStock: boolean
  allImages: Array<{
    id: string
    image_url: string
    alt_text?: string | null
  }>
  activeImageIndex: number
  isVisible: boolean
}

export default function MiniProductCard({
  productName,
  price,
  selectedVariantName,
  quantity,
  onAddToCart,
  isInStock,
  allImages,
  activeImageIndex,
  isVisible
}: MiniProductCardProps) {
  // Fallback to first image if activeImageIndex is out of bounds
  const currentImage = allImages[activeImageIndex] || allImages[0]

  if (!currentImage || allImages.length === 0) {
    return null
  }

  return (
    <div className={`mini-card-sticky w-[280px] bg-white border border-[var(--jl-border)] shadow-[var(--jl-shadow-card)] overflow-hidden ${isVisible ? 'mini-card-enter' : ''}`}>
      {/* Thumbnail Image with Counter */}
      <div className="relative border-b border-[var(--jl-border)] bg-white">
        <Image
          src={currentImage.image_url}
          alt={currentImage.alt_text || productName}
          width={560}
          height={560}
          quality={90}
          className="w-full aspect-square object-cover transition-opacity duration-500"
          key={currentImage.id}
        />

        {/* Image Counter Badge */}
        {allImages.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1">
            {activeImageIndex + 1}/{allImages.length}
          </div>
        )}
      </div>

      <div className="p-4">

      {/* Product Info */}
      <h3 className="text-sm font-semibold text-[var(--jl-text-primary)] line-clamp-2 mb-2">
        {productName}
      </h3>

      <p className="text-xl font-bold text-[var(--jl-text-primary)] mb-2">
        {price}
      </p>

      {selectedVariantName && (
        <p className="text-xs text-[var(--jl-text-secondary)] mb-1">
          {selectedVariantName}
        </p>
      )}

      <p className="text-xs text-[var(--jl-text-secondary)] mb-3">
        Qty: {quantity}
      </p>

      {/* Add to Cart Button (Black like JL) */}
      <button
        onClick={onAddToCart}
        disabled={!isInStock}
        className="w-full bg-[var(--jl-black)] text-white py-3 font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isInStock ? 'Add to Cart' : 'Out of Stock'}
      </button>

      </div>
    </div>
  )
}
