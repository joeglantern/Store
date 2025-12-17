import { getSession } from './auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

async function getAuthHeaders() {
  const session = await getSession()
  if (!session?.access_token) {
    throw new Error('Not authenticated')
  }

  return {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  }
}

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'GET',
      headers,
      cache: 'no-store'
    })

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch data'
      }
    }
  }
}

export async function apiPost<T>(
  endpoint: string,
  data: any
): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to post data'
      }
    }
  }
}

export async function apiPut<T>(
  endpoint: string,
  data: any
): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    })

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to update data'
      }
    }
  }
}

export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    })

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to delete data'
      }
    }
  }
}
