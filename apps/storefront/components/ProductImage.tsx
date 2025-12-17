import Image from 'next/image'
import { Package } from 'lucide-react'

interface ProductImageProps {
  src?: string | null
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  fill?: boolean
}

export default function ProductImage({
  src,
  alt,
  width = 800,
  height = 800,
  priority = false,
  className = '',
  fill = false
}: ProductImageProps) {
  // Show placeholder if no image
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ aspectRatio: '1/1' }}
      >
        <Package className="w-24 h-24 text-gray-400" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '1/1' }}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={(e) => {
          // Fallback to placeholder on error
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          if (target.parentElement) {
            target.parentElement.innerHTML = `
              <div class="flex items-center justify-center bg-gray-100 w-full h-full">
                <svg class="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            `
          }
        }}
      />
    </div>
  )
}
