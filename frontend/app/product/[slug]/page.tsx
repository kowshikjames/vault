import { getProduct, getProducts } from '@/lib/api'
import BuyButton from '@/components/BuyButton'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params
    const product = await getProduct(slug)
    return {
      title: `${product.name} — VAULT`,
      description: product.description || `${product.name} — ${product.brand || ''} · ₹${product.price}`,
    }
  } catch {
    return { title: 'Product — VAULT' }
  }
}



export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let product: any
  try {
    product = await getProduct(slug)
  } catch {
    notFound()
  }

  const CONDITION_LABEL: Record<string, string> = {
    mint: 'Mint — Near perfect, worn once or never',
    good: 'Good — Minor signs of wear, well maintained',
    fair: 'Fair — Noticeable wear, priced accordingly',
  }

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '2rem' }}>
      {/* Breadcrumb */}
      <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: 24, fontSize: 10 }}>
        <a href="/" style={{ color: 'var(--outline)', textDecoration: 'none' }}>Home</a>
        {' / '}
        <a href={`/${product.category_slug}`} style={{ color: 'var(--outline)', textDecoration: 'none' }}>
          {product.category?.name}
        </a>
        {' / '}
        <span style={{ color: 'var(--on-surface-variant)' }}>{product.name}</span>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        {/* Image Gallery */}
        <div>
          {/* Main Image */}
          <div
            style={{
              aspectRatio: '3/4',
              background: 'var(--surface-container)',
              overflow: 'hidden',
              marginBottom: '1.5px',
            }}
          >
            <img
              src={product.images?.[0] || (() => {
                const hash = product.name?.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) || 0
                const placeholders = ['/placeholders/1.jpg', '/placeholders/2.jpg', '/placeholders/3.jpg', '/placeholders/5.jpg']
                return placeholders[hash % 4]
              })()}
              alt={product.name}
              className="product-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              id="product-main-image"
            />
          </div>

          {/* Thumbnail strip */}
          {product.images?.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(product.images.length, 4)}, 1fr)`, gap: '1.5px' }}>
              {product.images.slice(1, 5).map((img: string, i: number) => (
                <div key={i} style={{ aspectRatio: '1', background: 'var(--surface-container)', overflow: 'hidden' }}>
                  <img src={img} alt={`${product.name} view ${i + 2}`} className="product-img" style={{ width: '100%', height: '100%' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ paddingTop: '1rem' }}>
          {/* Brand & Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            {product.brand && (
              <p className="label-caps" style={{ color: 'var(--ink-40)' }}>{product.brand}</p>
            )}
            {product.is_sold ? (
              <span className="badge badge-sold">Sold Out</span>
            ) : product.is_featured ? (
              <span className="badge badge-new">New Drop</span>
            ) : null}
          </div>

          {/* Seller / Store Name */}
          {product.seller && (
             <div style={{ marginBottom: 12 }}>
                <a href={`https://instagram.com/${product.seller.instagram_handle}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--warm-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>
                    {product.seller.store_name.charAt(0)}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-60)' }}>{product.seller.store_name}</span>
                </a>
             </div>
          )}

          {/* Name */}
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, lineHeight: 1.1, marginBottom: 16 }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
            <span className="price-display" style={{ fontSize: 40 }}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.original_price && (
              <span style={{ fontSize: 18, color: 'var(--outline)', textDecoration: 'line-through' }}>
                ₹{Number(product.original_price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="divider" style={{ marginBottom: 24 }} />

          {/* Size & Condition */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5px', marginBottom: 24 }}>
            {product.size && (
              <div style={{ background: 'var(--surface-container)', padding: '16px' }}>
                <p className="label-caps" style={{ color: 'var(--outline)', fontSize: 10, marginBottom: 6 }}>Size</p>
                <p style={{ color: 'var(--on-surface)', fontWeight: 500, fontSize: 18 }}>{product.size}</p>
              </div>
            )}
            {product.condition && (
              <div style={{ background: 'var(--surface-container)', padding: '16px' }}>
                <p className="label-caps" style={{ color: 'var(--outline)', fontSize: 10, marginBottom: 6 }}>Condition</p>
                <span className={`badge badge-${product.condition}`}>{product.condition}</span>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: 11, marginTop: 6 }}>
                  {CONDITION_LABEL[product.condition]}
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="label-caps"
                  style={{
                    background: 'var(--surface-high)',
                    color: 'var(--on-surface-variant)',
                    padding: '4px 10px',
                    fontSize: 10,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.7, marginBottom: 32, fontSize: 15 }}>
              {product.description}
            </p>
          )}

          <div className="divider" style={{ marginBottom: 24 }} />

          {/* Buy Actions */}
          {!product.is_sold ? (
            <BuyButton product={product} />
          ) : (
            <div style={{ background: 'var(--surface-container)', padding: '20px', textAlign: 'center' }}>
              <p className="label-caps" style={{ color: 'var(--error)', marginBottom: 8 }}>Sold Out</p>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: 13 }}>
                DM us on Instagram to get notified if this item is restocked.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
