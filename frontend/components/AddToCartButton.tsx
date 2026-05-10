'use client'
import { useCart } from '@/lib/store'
import type { Product } from '@/lib/api'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, openCart } = useCart()
  return (
    <button
      className="btn-primary"
      style={{ width: '100%', fontSize: 13, padding: '16px' }}
      id={`add-to-cart-detail-${product.slug}`}
      onClick={() => { addItem(product); openCart() }}
    >
      Add to Cart
    </button>
  )
}
