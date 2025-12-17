'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import ScrollSyncGallery from '@/components/ScrollSyncGallery'
import ProductSpecs from '@/components/ProductSpecs'
import MiniProductCard from '@/components/MiniProductCard'
import StarRating from '@/components/StarRating'
import { fetchProductBySlug } from '@/lib/api'
import {
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  MinusIcon,
  PlusIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

// Debounce hook to prevent rapid state updates
const useDebounce = (value: number, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface ProductDetail {
  id: string
  name: string
  slug: string
  description: string | null
  base_price: number
  brand: string | null
  category?: {
    id: string
    name: string
    slug: string
  }
  images?: Array<{
    id: string
    image_url: string
    alt_text: string | null
    display_order: number
  }>
  variants?: Array<{
    id: string
    name: string
    sku: string
    price_adjustment: number
    is_active: boolean
    inventory?: {
      available: number
      reserved: number
      quantity: number
    }
  }>
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [pendingImageIndex, setPendingImageIndex] = useState(0)
  const debouncedImageIndex = useDebounce(pendingImageIndex, 150)
  const [isDesktop, setIsDesktop] = useState(false)
  const [layoutPhase, setLayoutPhase] = useState<'phase1' | 'phase2'>('phase1')
  const mainButtonRef = useRef<HTMLButtonElement>(null)
  const sectionRefs = useRef<Map<number, HTMLElement>>(new Map())
  const overviewSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    loadProduct()
  }, [slug])

  // Detect desktop for scroll-sync (only enable on desktop ≥1024px)
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Force Phase 1 on mobile
  useEffect(() => {
    if (!isDesktop) {
      setLayoutPhase('phase1')
    }
  }, [isDesktop])

  // Keyboard navigation: Escape to return to Phase 1
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && layoutPhase === 'phase2') {
        overviewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [layoutPhase])

  // Debug: Log layout phase changes
  useEffect(() => {
    console.log('🎯 Current Layout Phase:', layoutPhase)
  }, [layoutPhase])

  // Phase detection: Observe when overview section scrolls out of view
  useEffect(() => {
    if (!isDesktop || !overviewSectionRef.current) {
      console.log('❌ Phase detection DISABLED:', { isDesktop, hasRef: !!overviewSectionRef.current })
      return
    }

    console.log('✅ Phase detection ENABLED - watching overview section')

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('📍 Intersection Event:', {
          top: entry.boundingClientRect.top,
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio
        })

        // When overview scrolls out of view (above viewport) → Phase 2
        if (entry.boundingClientRect.top < 0 && !entry.isIntersecting) {
          console.log('🔄 SWITCHING TO PHASE 2')
          setLayoutPhase('phase2')
        } else if (entry.isIntersecting) {
          console.log('🔄 SWITCHING TO PHASE 1')
          setLayoutPhase('phase1')
        }
      },
      {
        threshold: 0,
        rootMargin: '-160px 0px 0px 0px' // Account for header height
      }
    )

    observer.observe(overviewSectionRef.current)
    return () => {
      console.log('🧹 Phase detection observer disconnected')
      observer.disconnect()
    }
  }, [isDesktop])

  // Scroll-sync: Observe sections and update active image
  useEffect(() => {
    if (!isDesktop) return // Don't observe on mobile

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Find which image this section maps to
            for (const [imageIndex, element] of sectionRefs.current.entries()) {
              if (element === entry.target) {
                setPendingImageIndex(imageIndex)
                break
              }
            }
          }
        })
      },
      {
        threshold: 0.3, // Section must be 30% visible (more responsive)
        rootMargin: '-160px 0px -50px 0px' // Account for header height
      }
    )

    // Observe all sections in the map
    sectionRefs.current.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [product, isDesktop])

  const loadProduct = async () => {
    setLoading(true)
    const response = await fetchProductBySlug(slug)

    if (response.success && response.data) {
      setProduct(response.data)
      // Auto-select first available variant
      if (response.data.variants?.length > 0) {
        const firstAvailable = response.data.variants.find(
          (v: any) => v.is_active && (v.inventory?.available || 0) > 0
        )
        if (firstAvailable) {
          setSelectedVariant(firstAvailable.id)
        }
      }
    }
    setLoading(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getCurrentPrice = () => {
    if (!product) return 0
    if (!selectedVariant) return product.base_price

    const variant = product.variants?.find((v) => v.id === selectedVariant)
    return product.base_price + (variant?.price_adjustment || 0)
  }

  const getSelectedVariantStock = () => {
    if (!selectedVariant || !product?.variants) return 0
    const variant = product.variants.find((v) => v.id === selectedVariant)
    return variant?.inventory?.available || 0
  }

  const handleAddToCart = () => {
    // Cart functionality will be implemented in Phase 3
    alert('Add to cart functionality coming in Phase 3!')
  }

  const handleThumbnailClick = (index: number) => {
    setPendingImageIndex(index)
    // Scroll to the corresponding section
    const sectionElement = sectionRefs.current.get(index)
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Memoize expensive computations for MiniProductCard
  const miniCardProps = useMemo(() => ({
    productName: product?.name || '',
    price: formatPrice(getCurrentPrice()),
    selectedVariantName: selectedVariant
      ? product?.variants?.find((v) => v.id === selectedVariant)?.name || null
      : null,
    quantity,
    onAddToCart: handleAddToCart,
    isInStock: getSelectedVariantStock() > 0,
    allImages: product?.images || [],
    activeImageIndex: debouncedImageIndex,
    isVisible: layoutPhase === 'phase2'
  }), [product, selectedVariant, quantity, debouncedImageIndex, layoutPhase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-[var(--jl-text-secondary)]">Loading product...</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <Link
              href="/products"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Back to products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const selectedVariantStock = getSelectedVariantStock()
  const isInStock = selectedVariantStock > 0

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[var(--jl-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm text-[#666666]">
            <Link href="/" className="hover:text-[var(--jl-primary)]">Home</Link>
            <ChevronRightIcon className="w-4 h-4 mx-2" />
            <Link href="/products" className="hover:text-[var(--jl-primary)]">Products</Link>
            {product.category && (
              <>
                <ChevronRightIcon className="w-4 h-4 mx-2" />
                <span className="text-[var(--jl-text-primary)]">{product.category.name}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Screen reader announcement for phase changes */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {layoutPhase === 'phase2' && 'Viewing detailed product information'}
          {layoutPhase === 'phase1' && 'Viewing product overview'}
        </div>

        {/* Sticky Sidebar Layout - Dynamic based on phase */}
        <div className={`grid grid-cols-1 gap-8 transition-all duration-300 ${
          layoutPhase === 'phase1'
            ? 'lg:grid-cols-[40%_60%]'
            : 'lg:grid-cols-[280px_1fr]'
        }`}>
          {/* Left Column - Gallery in Phase 1, Mini Card in Phase 2 */}
          <div>
            {layoutPhase === 'phase1' ? (
              <ScrollSyncGallery
                images={product.images || []}
                productName={product.name}
                activeIndex={debouncedImageIndex}
                onImageClick={handleThumbnailClick}
              />
            ) : (
              <MiniProductCard {...miniCardProps} />
            )}
          </div>

          {/* Right: Scrollable Content Sections */}
          <div className="space-y-12">
            {/* Section 1: Product Overview */}
            <section
              ref={(el) => {
                if (el) {
                  sectionRefs.current.set(0, el)
                  overviewSectionRef.current = el
                }
              }}
            >
              <div className="bg-white border border-[var(--jl-border)] rounded-lg p-8">
              {product.brand && (
                <p className="text-xs text-[#999999] uppercase mb-2">{product.brand}</p>
              )}
              <h1 className="text-3xl font-bold text-[var(--jl-text-primary)] mb-4">{product.name}</h1>

              {/* Price & Rating */}
              <div className="mb-2">
                <span className="text-3xl font-bold text-[var(--jl-text-primary)]">
                  {formatPrice(getCurrentPrice())}
                </span>
              </div>

              <div className="mb-6">
                <StarRating rating={4.5} reviewCount={128} size="sm" />
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {isInStock ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-[var(--jl-success)]">
                    <span className="w-2 h-2 bg-[var(--jl-success)] rounded-full mr-2" />
                    In Stock ({selectedVariantStock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-[var(--jl-error)]">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Variants (Simple rectangular buttons like JL) */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-semibold text-[var(--jl-text-primary)] mb-3">Select Size</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const variantStock = variant.inventory?.available || 0
                      const variantAvailable = variant.is_active && variantStock > 0
                      const isSelected = selectedVariant === variant.id

                      return (
                        <button
                          key={variant.id}
                          onClick={() => variantAvailable && setSelectedVariant(variant.id)}
                          disabled={!variantAvailable}
                          className={`min-w-[60px] px-4 py-2 border text-center font-medium transition-colors ${
                            isSelected
                              ? 'bg-[var(--jl-black)] text-white border-[var(--jl-black)]'
                              : variantAvailable
                              ? 'bg-white text-[var(--jl-text-primary)] border-[var(--jl-border)] hover:border-[var(--jl-black)]'
                              : 'border-[var(--jl-border)] bg-gray-50 cursor-not-allowed opacity-50 text-[var(--jl-text-secondary)] line-through'
                          }`}
                        >
                          {variant.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h2 className="font-semibold text-[var(--jl-text-primary)] mb-3 text-sm uppercase">Quantity</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center border border-[var(--jl-border)] rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedVariantStock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-10 text-center border border-[var(--jl-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--jl-primary)] focus:ring-opacity-50 text-[var(--jl-text-primary)]"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariantStock, quantity + 1))}
                    disabled={quantity >= selectedVariantStock}
                    className="w-10 h-10 flex items-center justify-center border border-[var(--jl-border)] rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button (Black like JL) */}
              <button
                ref={mainButtonRef}
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="w-full py-3.5 bg-[var(--jl-black)] hover:bg-gray-800 text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              </div>
            </section>

            {/* Section 2: Product Specifications (syncs with image 2) */}
            <section ref={(el) => el && sectionRefs.current.set(1, el)}>
              <div className="bg-white border border-[var(--jl-border)] rounded-lg p-8">
                <h2 className="text-2xl font-bold text-[var(--jl-text-primary)] mb-6">Product Details</h2>
                <ProductSpecs
                  description={product.description}
                  brand={product.brand}
                  selectedVariant={
                    selectedVariant
                      ? product.variants?.find((v) => v.id === selectedVariant) || null
                      : null
                  }
                />
              </div>
            </section>

            {/* Section 3: Shipping & Returns (syncs with image 3) */}
            <section ref={(el) => el && sectionRefs.current.set(2, el)}>
              <div className="bg-white border border-[var(--jl-border)] p-8">
                <h2 className="text-xl font-semibold text-[var(--jl-text-primary)] mb-4">Delivery & Returns</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 py-2">
                    <TruckIcon className="w-5 h-5 text-[var(--jl-text-secondary)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-[var(--jl-text-primary)] text-sm">Free Delivery</h3>
                      <p className="text-sm text-[var(--jl-text-secondary)]">Free standard shipping on orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-2">
                    <ArrowPathIcon className="w-5 h-5 text-[var(--jl-text-secondary)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-[var(--jl-text-primary)] text-sm">Easy Returns</h3>
                      <p className="text-sm text-[var(--jl-text-secondary)]">Return within 30 days for a full refund</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-2">
                    <ShieldCheckIcon className="w-5 h-5 text-[var(--jl-text-secondary)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-[var(--jl-text-primary)] text-sm">Quality Guarantee</h3>
                      <p className="text-sm text-[var(--jl-text-secondary)]">1-year warranty covering defects</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
