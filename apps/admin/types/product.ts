export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  base_price: number
  category_id: string | null
  brand: string | null
  is_active: boolean
  is_featured: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  category?: {
    id: string
    name: string
    slug: string
  }
  variants?: ProductVariant[]
  images?: ProductImage[]
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string
  name: string
  price_adjustment: number
  is_active: boolean
  created_at: string
  updated_at: string
  inventory?: {
    quantity: number
    reserved: number
    available: number
  }
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text: string | null
  display_order: number
  is_primary: boolean
  created_at: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}
