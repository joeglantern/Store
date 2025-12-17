'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface ScrollSyncGalleryProps {
  images: Array<{
    id: string
    image_url: string
    alt_text: string | null
    display_order: number
  }>
  productName: string
  activeIndex: number
  onImageClick?: (index: number) => void
}

export default function ScrollSyncGallery({ images, productName, activeIndex, onImageClick }: ScrollSyncGalleryProps) {
  const [isSticky, setIsSticky] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is not intersecting, sidebar is sticky
        setIsSticky(entry.intersectionRatio === 0)
      },
      { threshold: [0, 1] }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [])

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center text-gray-400">
          <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p>No images available</p>
        </div>
      </div>
    )
  }

  const currentImage = images[activeIndex] || images[0]

  return (
    <div className="product-gallery-container">
      {/* Sentinel element for sticky detection */}
      <div ref={sentinelRef} className="sticky-sentinel" style={{ height: '1px' }} />

      {/* Sticky Gallery */}
      <div className={`sticky-gallery ${isSticky ? 'is-sticky' : ''}`}>
        <div className="relative w-full aspect-square bg-white border border-[var(--jl-border)] overflow-hidden">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Zoom>
                <Image
                  src={image.image_url}
                  alt={image.alt_text || `${productName} view ${index + 1}`}
                  width={1200}
                  height={1200}
                  quality={95}
                  priority={index === 0}
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: '1/1' }}
                  unoptimized={false}
                />
              </Zoom>
            </div>
          ))}

          {/* Image Counter Badge (overlay on image) */}
          <div className="absolute top-3 right-3 bg-black/80 text-white px-2.5 py-1 text-xs font-medium z-20">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Strip (like John Lewis) */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onImageClick?.(index)}
              className={`relative flex-shrink-0 w-20 h-20 border-2 transition-all overflow-hidden bg-white ${
                index === activeIndex
                  ? 'border-[var(--jl-black)] shadow-sm'
                  : 'border-[var(--jl-border)] hover:border-gray-400'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.image_url}
                alt={image.alt_text || `${productName} thumbnail ${index + 1}`}
                width={160}
                height={160}
                quality={90}
                className="w-full h-full object-cover"
                style={{ aspectRatio: '1/1' }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
