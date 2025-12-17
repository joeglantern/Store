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
  created_at: string
  category?: {
    id: string
    name: string
    slug: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  is_active: boolean
  children?: Category[]
}
