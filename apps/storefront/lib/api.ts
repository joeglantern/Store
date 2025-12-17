const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

export async function fetchProducts(params?: {
  page?: number
  limit?: number
  category?: string
  search?: string
  sort?: string
}) {
  const queryParams = new URLSearchParams()

  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.category) queryParams.append('category', params.category)
  if (params?.search) queryParams.append('search', params.search)
  if (params?.sort) queryParams.append('sort', params.sort)

  const url = `${BACKEND_URL}/api/v1/products?${queryParams.toString()}`

  try {
    const response = await fetch(url, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return { success: false, error: { message: 'Failed to load products' } }
  }
}

export async function fetchProductBySlug(slug: string) {
  const url = `${BACKEND_URL}/api/v1/products/${slug}`

  try {
    const response = await fetch(url, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch product')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return { success: false, error: { message: 'Failed to load product' } }
  }
}

export async function fetchCategories() {
  const url = `${BACKEND_URL}/api/v1/categories?limit=100`

  try {
    const response = await fetch(url, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { success: false, error: { message: 'Failed to load categories' } }
  }
}
