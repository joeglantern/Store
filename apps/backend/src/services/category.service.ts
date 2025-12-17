import { supabase } from '../lib/supabase.js'
import type { Category } from '../types/product.types.js'

export interface CreateCategoryRequest {
  name: string
  slug: string
  description?: string
  parent_id?: string
  image_url?: string
  is_active?: boolean
  display_order?: number
}

export interface UpdateCategoryRequest {
  name?: string
  slug?: string
  description?: string
  parent_id?: string
  image_url?: string
  is_active?: boolean
  display_order?: number
}

interface CategoryWithSubcategories extends Category {
  subcategories?: CategoryWithSubcategories[]
  products_count?: number
}

/**
 * Get all categories with hierarchical structure
 */
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      products(count)
    `)
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  // Build hierarchical tree
  const categories = data as any[]
  const categoryMap = new Map<string, CategoryWithSubcategories>()
  const rootCategories: CategoryWithSubcategories[] = []

  // First pass: Create map of all categories
  categories.forEach(cat => {
    categoryMap.set(cat.id, {
      ...cat,
      products_count: cat.products?.[0]?.count || 0,
      subcategories: []
    })
  })

  // Second pass: Build tree structure
  categories.forEach(cat => {
    const category = categoryMap.get(cat.id)!
    if (cat.parent_id) {
      const parent = categoryMap.get(cat.parent_id)
      if (parent) {
        parent.subcategories!.push(category)
      }
    } else {
      rootCategories.push(category)
    }
  })

  return rootCategories
}

/**
 * Get single category by ID
 */
export async function getCategoryById(id: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Category not found')
    }
    throw new Error(`Failed to fetch category: ${error.message}`)
  }

  return data as Category
}

/**
 * Create new category (Admin only)
 */
export async function createCategory(categoryData: CreateCategoryRequest) {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      ...categoryData,
      is_active: categoryData.is_active ?? true,
      display_order: categoryData.display_order ?? 0
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Category slug already exists')
    }
    throw new Error(`Failed to create category: ${error.message}`)
  }

  return data as Category
}

/**
 * Update category (Admin only)
 */
export async function updateCategory(id: string, categoryData: UpdateCategoryRequest) {
  const { data, error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Category not found')
    }
    if (error.code === '23505') {
      throw new Error('Category slug already exists')
    }
    throw new Error(`Failed to update category: ${error.message}`)
  }

  return data as Category
}

/**
 * Delete category (Admin only)
 */
export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete category: ${error.message}`)
  }

  return { success: true }
}
