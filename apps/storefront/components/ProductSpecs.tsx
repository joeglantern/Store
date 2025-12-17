'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

interface ProductSpecsProps {
  description: string | null
  brand: string | null
  selectedVariant: {
    sku: string
    attributes?: Record<string, any>
  } | null
}

export default function ProductSpecs({ description, brand, selectedVariant }: ProductSpecsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: true,
    specifications: false
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="mt-8 border-t border-[var(--jl-border)] pt-8">
      {/* Product Details Section */}
      <div className="border-b border-[var(--jl-border)]">
        <button
          onClick={() => toggleSection('details')}
          className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors px-4 -mx-4"
          aria-expanded={openSections.details}
        >
          <h3 className="text-lg font-semibold text-[var(--jl-text-primary)]">Product Details</h3>
          <ChevronDownIcon className={`w-5 h-5 text-[var(--jl-text-secondary)] transition-transform ${openSections.details ? 'rotate-180' : ''}`} />
        </button>
        {openSections.details && (
          <div className="pb-4 px-4 -mx-4">
            {description && <p className="text-[var(--jl-text-secondary)] leading-relaxed">{description}</p>}
            {brand && (
              <div className="mt-3">
                <span className="text-sm font-medium text-[var(--jl-text-secondary)]">Brand: </span>
                <span className="text-sm text-[var(--jl-text-primary)]">{brand}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Specifications Section */}
      <div className="border-b border-[var(--jl-border)]">
        <button
          onClick={() => toggleSection('specifications')}
          className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors px-4 -mx-4"
          aria-expanded={openSections.specifications}
        >
          <h3 className="text-lg font-semibold text-[var(--jl-text-primary)]">Specifications</h3>
          <ChevronDownIcon className={`w-5 h-5 text-[var(--jl-text-secondary)] transition-transform ${openSections.specifications ? 'rotate-180' : ''}`} />
        </button>
        {openSections.specifications && (
          <div className="pb-4 px-4 -mx-4">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                {selectedVariant && (
                  <tr>
                    <td className="py-2 text-sm font-medium text-[var(--jl-text-secondary)] w-1/3">SKU</td>
                    <td className="py-2 text-sm text-[var(--jl-text-primary)] font-mono">{selectedVariant.sku}</td>
                  </tr>
                )}
                {selectedVariant?.attributes &&
                  Object.entries(selectedVariant.attributes).map(([key, value]) => (
                    <tr key={key}>
                      <td className="py-2 text-sm font-medium text-[var(--jl-text-secondary)] w-1/3 capitalize">
                        {key}
                      </td>
                      <td className="py-2 text-sm text-[var(--jl-text-primary)]">{String(value)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Care Instructions Section */}
      <div>
        <button
          onClick={() => toggleSection('care')}
          className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors px-4 -mx-4"
          aria-expanded={openSections.care}
        >
          <h3 className="text-lg font-semibold text-[var(--jl-text-primary)]">Care Instructions</h3>
          <ChevronDownIcon className={`w-5 h-5 text-[var(--jl-text-secondary)] transition-transform ${openSections.care ? 'rotate-180' : ''}`} />
        </button>
        {openSections.care && (
          <div className="pb-4 px-4 -mx-4">
            <ul className="space-y-2 text-sm text-[var(--jl-text-secondary)]">
              <li>• Machine wash cold with like colors</li>
              <li>• Tumble dry low or hang to dry</li>
              <li>• Do not bleach</li>
              <li>• Iron on low heat if needed</li>
              <li>• Do not dry clean</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
