'use client'

import { useState } from 'react'
import Image from 'next/image'
import ProductImage from './ProductImage'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface ProductImageGalleryProps {
  images: Array<{
    id: string
    image_url: string
    alt_text: string | null
    display_order: number
  }>
  productName: string
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <ProductImage
        src={null}
        alt={productName}
        priority
        className="w-full rounded-lg border border-gray-200"
      />
    )
  }

  const currentImage = images[currentIndex]

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main Image with Zoom */}
      <div className="relative cursor-zoom-in">
        <Zoom>
          <Image
            src={currentImage.image_url}
            alt={currentImage.alt_text || productName}
            width={800}
            height={800}
            priority={currentIndex === 0}
            className="w-full rounded-lg border border-gray-200 object-cover"
            style={{ aspectRatio: '1/1' }}
          />
        </Zoom>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-20 h-20 rounded border-2 transition-all overflow-hidden ${
                index === currentIndex
                  ? 'border-[#FF9900] ring-2 ring-[#FF9900] ring-opacity-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <ProductImage
                src={image.image_url}
                alt={image.alt_text || `${productName} view ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="text-center text-sm text-gray-500">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
