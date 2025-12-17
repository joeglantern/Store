import { supabase } from '../lib/supabase.js'
import type {
  Product,
  ProductWithRelations,
  CreateProductRequest,
  UpdateProductRequest,
  ProductListQuery
} from '../types/product.types.js'

/**
 * Get paginated list of products
 */
export async function getProducts(query: ProductListQuery) {
  const {
    page = 1,
    limit = 20,
    category_id,
    is_featured,
    search,
    sort = 'newest'
  } = query

  const offset = (page - 1) * Math.min(limit, 100)
  const pageLimit = Math.min(limit, 100)

  let dbQuery = supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, image_url, alt_text, display_order),
      variants:variants(count)
    `, { count: 'exact' })
    .eq('is_active', true)

  // Filters
  if (category_id) {
    dbQuery = dbQuery.eq('category_id', category_id)
  }

  if (is_featured !== undefined) {
    dbQuery = dbQuery.eq('is_featured', is_featured)
  }

  if (search) {
    dbQuery = dbQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // Sorting
  switch (sort) {
    case 'price_asc':
      dbQuery = dbQuery.order('base_price', { ascending: true })
      break
    case 'price_desc':
      dbQuery = dbQuery.order('base_price', { ascending: false })
      break
    case 'newest':
      dbQuery = dbQuery.order('created_at', { ascending: false })
      break
    case 'popular':
      // TODO: Implement popularity sorting (based on order count)
      dbQuery = dbQuery.order('created_at', { ascending: false })
      break
  }

  dbQuery = dbQuery.range(offset, offset + pageLimit - 1)

  const { data, error, count } = await dbQuery

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  return {
    products: data as ProductWithRelations[],
    pagination: {
      current_page: page,
      total_pages: Math.ceil((count || 0) / pageLimit),
      total_items: count || 0,
      items_per_page: pageLimit,
      has_next: offset + pageLimit < (count || 0),
      has_prev: page > 1
    }
  }
}

/**
 * Get single product by slug
 */
export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, image_url, alt_text, display_order),
      variants:variants(
        *,
        inventory(quantity, reserved)
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Product not found')
    }
    throw new Error(`Failed to fetch product: ${error.message}`)
  }

  // Calculate available stock for each variant
  const product = data as ProductWithRelations
  if (product.variants) {
    product.variants = product.variants.map(variant => ({
      ...variant,
      inventory: variant.inventory ? {
        ...variant.inventory,
        available: variant.inventory.quantity - variant.inventory.reserved
      } : undefined
    }))
  }

  return product
}

/**
 * Create new product (Admin only)
 */
export async function createProduct(productData: CreateProductRequest) {
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...productData,
      is_active: productData.is_active ?? true,
      is_featured: productData.is_featured ?? false
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Product slug already exists')
    }
    throw new Error(`Failed to create product: ${error.message}`)
  }

  return data as Product
}

/**
 * Update product (Admin only)
 */
export async function updateProduct(id: string, productData: UpdateProductRequest) {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Product not found')
    }
    if (error.code === '23505') {
      throw new Error('Product slug already exists')
    }
    throw new Error(`Failed to update product: ${error.message}`)
  }

  return data as Product
}

/**
 * Delete product (Admin only)
 */
export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`)
  }

  return { success: true }
}
