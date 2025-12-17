'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiGet, apiPut } from '@/lib/api'
import type { Product } from '@/types/product'
import VariantManager from '@/components/VariantManager'

interface Category {
  id: string
  name: string
  slug: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    category_id: '',
    brand: '',
    is_active: true,
    is_featured: false,
    meta_title: '',
    meta_description: ''
  })

  useEffect(() => {
    fetchProduct()
    fetchCategories()
  }, [])

  const fetchProduct = async () => {
    setLoading(true)
    const response = await apiGet<{ product: Product }>(`/api/products/${productId}`)

    if (response.success && response.data) {
      const product = response.data.product
      setFormData({
        name: product.name,
        description: product.description || '',
        base_price: product.base_price.toString(),
        category_id: product.category_id || '',
        brand: product.brand || '',
        is_active: product.is_active,
        is_featured: product.is_featured,
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || ''
      })
    } else {
      setError(response.error?.message || 'Failed to load product')
    }

    setLoading(false)
  }

  const fetchCategories = async () => {
    const response = await apiGet<{ categories: Category[] }>('/api/categories?limit=100')
    if (response.success && response.data) {
      setCategories(response.data.categories)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    // Validation
    if (!formData.name.trim()) {
      setError('Product name is required')
      setSaving(false)
      return
    }

    if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
      setError('Valid price is required')
      setSaving(false)
      return
    }

    // Prepare data
    const productData = {
      ...formData,
      base_price: parseFloat(formData.base_price),
      category_id: formData.category_id || null,
      brand: formData.brand || null,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null
    }

    const response = await apiPut(`/api/products/${productId}`, productData)

    if (response.success) {
      router.push('/dashboard/products')
    } else {
      setError(response.error?.message || 'Failed to update product')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading product...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-1">
          Update product information
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              placeholder="Enter product description"
            />
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Base Price */}
            <div>
              <label htmlFor="base_price" className="block text-sm font-medium text-gray-700 mb-2">
                Base Price *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-600">$</span>
                <input
                  type="number"
                  id="base_price"
                  name="base_price"
                  value={formData.base_price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              >
                <option value="">No Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              placeholder="Enter brand name"
            />
          </div>

          {/* SEO Fields */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>

            <div className="space-y-4">
              {/* Meta Title */}
              <div>
                <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  id="meta_title"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="SEO title for search engines"
                />
              </div>

              {/* Meta Description */}
              <div>
                <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="SEO description for search engines"
                />
              </div>
            </div>
          </div>

          {/* Status Checkboxes */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h3>

            <div className="space-y-3">
              {/* Is Active */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="is_active" className="ml-3 text-sm font-medium text-gray-700">
                  Active (visible to customers)
                </label>
              </div>

              {/* Is Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="is_featured" className="ml-3 text-sm font-medium text-gray-700">
                  Featured product
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: saving ? undefined : '#FF9900' }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Variant Management */}
      <div className="mt-8">
        <VariantManager productId={productId} />
      </div>
    </div>
  )
}
