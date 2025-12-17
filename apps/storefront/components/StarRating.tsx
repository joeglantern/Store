'use client'

import { StarIcon } from '@heroicons/react/24/solid'

interface StarRatingProps {
  rating: number // 0-5
  reviewCount?: number
  size?: 'sm' | 'md'
  showCount?: boolean
}

export default function StarRating({
  rating,
  reviewCount = 0,
  size = 'md',
  showCount = true
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4'
  }

  const iconSize = sizeClasses[size]

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`${iconSize} ${
              star <= Math.round(rating)
                ? 'text-[var(--jl-rating)]'
                : 'text-gray-200'
            }`}
          />
        ))}
      </div>

      <span className="text-sm font-medium text-[var(--jl-text-primary)]">
        {rating.toFixed(1)}
      </span>

      {showCount && reviewCount > 0 && (
        <span className="text-sm text-[var(--jl-text-secondary)]">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}
