// Product-related TypeScript types

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  base_price: number
  is_active: boolean
  is_featured: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text: string | null
  display_order: number
  created_at: string
}

export interface Variant {
  id: string
  product_id: string
  sku: string
  name: string
  attributes: Record<string, any>
  price_adjustment: number
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Inventory {
  id: string
  variant_id: string
  quantity: number
  reserved: number
  low_stock_threshold: number
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  image_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

// Request/Response types
export interface CreateProductRequest {
  name: string
  slug: string
  description?: string
  category_id?: string
  base_price: number
  is_active?: boolean
  is_featured?: boolean
  meta_title?: string
  meta_description?: string
}

export interface UpdateProductRequest {
  name?: string
  slug?: string
  description?: string
  category_id?: string
  base_price?: number
  is_active?: boolean
  is_featured?: boolean
  meta_title?: string
  meta_description?: string
}

export interface ProductListQuery {
  page?: number
  limit?: number
  category_id?: string
  is_featured?: boolean
  search?: string
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
}

export interface ProductWithRelations extends Product {
  category?: Category
  images?: ProductImage[]
  variants?: VariantWithInventory[]
  variants_count?: number
}

export interface VariantWithInventory extends Variant {
  inventory?: {
    quantity: number
    reserved: number
    available: number
  }
}
