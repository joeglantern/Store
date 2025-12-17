'use client'

import { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'
import { useSocketEvent } from '@/hooks/useSocket'
import type { ProductVariant } from '@/types/product'

interface VariantManagerProps {
  productId: string
}

export default function VariantManager({ productId }: VariantManagerProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price_adjustment: '0',
    is_active: true,
    quantity: '0'
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchVariants()
  }, [productId])

  // Listen for inventory updates via WebSocket
  useSocketEvent(`product:${productId}:inventory_updated`, (data: any) => {
    setVariants(prev =>
      prev.map(v =>
        v.id === data.variant_id && data.inventory
          ? { ...v, inventory: data.inventory }
          : v
      )
    )
  })

  const fetchVariants = async () => {
    setLoading(true)
    const response = await apiGet<{ variants: ProductVariant[] }>(
      `/api/products/${productId}/variants`
    )

    if (response.success && response.data) {
      setVariants(response.data.variants)
    }

    setLoading(false)
  }

  const handleOpenModal = (variant?: ProductVariant) => {
    if (variant) {
      setEditingVariant(variant)
      setFormData({
        name: variant.name,
        sku: variant.sku,
        price_adjustment: variant.price_adjustment.toString(),
        is_active: variant.is_active,
        quantity: variant.inventory?.quantity.toString() || '0'
      })
    } else {
      setEditingVariant(null)
      setFormData({
        name: '',
        sku: '',
        price_adjustment: '0',
        is_active: true,
        quantity: '0'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingVariant(null)
    setFormData({
      name: '',
      sku: '',
      price_adjustment: '0',
      is_active: true,
      quantity: '0'
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = e.target.checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const variantData = {
      product_id: productId,
      name: formData.name,
      sku: formData.sku,
      price_adjustment: parseFloat(formData.price_adjustment),
      is_active: formData.is_active,
      quantity: parseInt(formData.quantity, 10)
    }

    let response

    if (editingVariant) {
      response = await apiPut(`/api/variants/${editingVariant.id}`, variantData)
    } else {
      response = await apiPost('/api/variants', variantData)
    }

    if (response.success) {
      await fetchVariants()
      handleCloseModal()
    } else {
      alert(response.error?.message || 'Failed to save variant')
    }

    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) {
      return
    }

    const response = await apiDelete(`/api/variants/${id}`)

    if (response.success) {
      await fetchVariants()
    } else {
      alert(response.error?.message || 'Failed to delete variant')
    }
  }

  if (loading) {
    return <div className="text-gray-600">Loading variants...</div>
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage different variations and inventory
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors text-sm"
          style={{ backgroundColor: '#FF9900' }}
        >
          Add Variant
        </button>
      </div>

      {/* Variants List */}
      {variants.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-600">No variants yet</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Add your first variant
          </button>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Variant
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Price Adj.
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {variants.map((variant) => (
                <tr key={variant.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {variant.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {variant.sku}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {variant.price_adjustment >= 0 ? '+' : ''}
                    ${variant.price_adjustment.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`font-medium ${
                        (variant.inventory?.available || 0) <= 5
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {variant.inventory?.available || 0} available
                    </span>
                    <span className="text-gray-500 text-xs block">
                      {variant.inventory?.reserved || 0} reserved
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        variant.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {variant.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleOpenModal(variant)}
                        className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(variant.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingVariant ? 'Edit Variant' : 'Add New Variant'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Variant Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Variant Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., Red - Large"
                />
              </div>

              {/* SKU */}
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., PROD-RED-L"
                />
              </div>

              {/* Price and Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price_adjustment" className="block text-sm font-medium text-gray-700 mb-2">
                    Price Adjustment
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-2 text-gray-600">$</span>
                    <input
                      type="number"
                      id="price_adjustment"
                      name="price_adjustment"
                      value={formData.price_adjustment}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    placeholder="0"
                  />
                </div>
              </div>

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
                  Active
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
                  style={{ backgroundColor: saving ? undefined : '#FF9900' }}
                >
                  {saving ? 'Saving...' : editingVariant ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
