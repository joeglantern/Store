'use client'

import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  is_active: boolean
  created_at: string
  children?: Category[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: '',
    is_active: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    setError('')

    const response = await apiGet<{ categories: Category[] }>('/api/categories?limit=100')

    if (response.success && response.data) {
      setCategories(response.data.categories)
    } else {
      setError(response.error?.message || 'Failed to load categories')
    }

    setLoading(false)
  }

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description || '',
        parent_id: category.parent_id || '',
        is_active: category.is_active
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        description: '',
        parent_id: '',
        is_active: true
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      description: '',
      parent_id: '',
      is_active: true
    })
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
    setSaving(true)

    const categoryData = {
      ...formData,
      parent_id: formData.parent_id || null
    }

    let response

    if (editingCategory) {
      response = await apiPut(`/api/categories/${editingCategory.id}`, categoryData)
    } else {
      response = await apiPost('/api/categories', categoryData)
    }

    if (response.success) {
      await fetchCategories()
      handleCloseModal()
    } else {
      alert(response.error?.message || 'Failed to save category')
    }

    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also affect products in this category.')) {
      return
    }

    const response = await apiDelete(`/api/categories/${id}`)

    if (response.success) {
      await fetchCategories()
    } else {
      alert(response.error?.message || 'Failed to delete category')
    }
  }

  const renderCategoryRow = (category: Category, level: number = 0) => {
    return (
      <div key={category.id}>
        <div className="flex items-center justify-between py-3 px-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3" style={{ paddingLeft: `${level * 24}px` }}>
            {level > 0 && <span className="text-gray-400">└─</span>}
            <div>
              <div className="font-medium text-gray-900">{category.name}</div>
              {category.description && (
                <div className="text-sm text-gray-600">{category.description}</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                category.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {category.is_active ? 'Active' : 'Inactive'}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenModal(category)}
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Render children */}
        {category.children && category.children.length > 0 && (
          <div>
            {category.children.map(child => renderCategoryRow(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading categories...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">
            Organize your products into categories
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors"
          style={{ backgroundColor: '#FF9900' }}
        >
          Add Category
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No categories found</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: '#FF9900' }}
            >
              Add Your First Category
            </button>
          </div>
        ) : (
          <div>
            {categories.map(category => renderCategoryRow(category))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="Enter category name"
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
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="Enter category description"
                />
              </div>

              {/* Parent Category */}
              <div>
                <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category
                </label>
                <select
                  id="parent_id"
                  name="parent_id"
                  value={formData.parent_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                >
                  <option value="">None (Top Level)</option>
                  {categories
                    .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
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
                  {saving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
