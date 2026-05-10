'use client'
import type { Product } from '@/lib/api'

interface Props {
  product: Product
}

export default function BuyButton({ product }: Props) {
  const sellerHandle = product.seller?.instagram_handle || 'vault.store'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
      <a
        href={`https://ig.me/m/${sellerHandle}`}
        target="_blank"
        rel="noopener noreferrer"
        id={`instagram-buy-${product.slug}`}
        className="btn-primary"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          textDecoration: 'none',
          padding: '16px',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
        </svg>
        DM Seller (@{sellerHandle}) to Buy
      </a>
      <p style={{ textAlign: 'center', color: 'var(--ink-40)', fontSize: 11, marginTop: 8 }}>
        You will be redirected to the seller's Instagram to complete the purchase securely.
      </p>
    </div>
  )
}
