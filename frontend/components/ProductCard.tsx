'use client'
import Link from 'next/link'
import type { Product } from '@/lib/api'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const hash = product.name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0
  const placeholders = ['/placeholders/1.jpg', '/placeholders/2.jpg', '/placeholders/3.jpg', '/placeholders/5.jpg']
  const fallbackImage = placeholders[hash % 4]
  
  const primaryImage = product.images?.[0] || fallbackImage
  const isSold = product.is_sold

  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: 'none', display: 'block', position: 'relative' }}
      className="hover-border"
    >
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', background: 'var(--warm-100)' }}>
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.name}
          className="product-img"
          style={{ position: 'absolute', inset: 0, transition: 'transform 0.4s ease' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x533/221f19/e9e1d7?text=${encodeURIComponent(product.name)}`
          }}
        />

        {/* SOLD Overlay Dim */}
        {isSold && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', zIndex: 5 }} />
        )}

        {/* Status Badge */}
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, display: 'flex', gap: 6 }}>
          {isSold ? (
            <span className="badge badge-sold">SOLD</span>
          ) : product.is_featured ? (
            <span className="badge badge-new">New Drop</span>
          ) : null}
        </div>
      </div>

      {/* Product Info Bar */}
      <div style={{ padding: '12px 0', opacity: isSold ? 0.6 : 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {product.brand && (
              <p className="label-caps" style={{ color: 'var(--ink-40)', fontSize: 10, marginBottom: 2 }}>
                {product.brand}
              </p>
            )}
            
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.name}
            </p>
            
            {/* Seller Info */}
            {product.seller && (
              <p className="label-caps" style={{ color: 'var(--ink-40)', fontSize: 9, marginTop: 4 }}>
                by @{product.seller.instagram_handle}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span className="price-display" style={{ fontSize: 15 }}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
