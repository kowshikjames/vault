const API = process.env.NEXT_PUBLIC_API_URL

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  original_price?: number
  category: { id: string; name: string; slug: string }
  category_slug: string
  condition?: 'mint' | 'good' | 'fair'
  size?: string
  brand?: string
  images: string[]
  tags: string[]
  in_stock: boolean
  is_sold: boolean
  is_featured: boolean
  seller?: {
    id: string
    store_name: string
    instagram_handle?: string
    is_verified: boolean
  }
  created_at: string
}

export interface ProductListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Product[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface OrderPayload {
  phone?: string
  address?: { line1: string; city: string; state: string; pin: string }
  items: Array<{ product_id: string; quantity: number }>
}

async function fetchWithTimeout(url: string, options: RequestInit & { timeout?: number } = {}) {
  // During Vercel build, skip fetches to prevent hanging the build
  if (process.env.VERCEL === '1' && !process.env.NEXT_RUNTIME && typeof window === 'undefined') {
    return new Response(JSON.stringify({ results: [], count: 0 }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { timeout = 5000, ...rest } = options
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(url, { ...rest, signal: controller.signal })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

export async function getProducts(opts?: {
  category?: string
  search?: string
  max_price?: number
  condition?: string
  is_featured?: boolean
}): Promise<ProductListResponse> {
  const params = new URLSearchParams()
  if (opts?.category) params.set('category', opts.category)
  if (opts?.search) params.set('search', opts.search)
  if (opts?.max_price) params.set('max_price', String(opts.max_price))
  if (opts?.condition) params.set('condition', opts.condition)
  if (opts?.is_featured) params.set('is_featured', 'true')

  const res = await fetchWithTimeout(`${API}/api/products/?${params}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function getProduct(slug: string): Promise<Product> {
  const res = await fetchWithTimeout(`${API}/api/products/${slug}/`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Product not found')
  return res.json()
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetchWithTimeout(`${API}/api/categories/`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch categories')
  const data = await res.json()
  return data.results ?? data
}

export async function createOrder(payload: OrderPayload, token: string) {
  const res = await fetchWithTimeout(`${API}/api/orders/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  return res.json()
}
