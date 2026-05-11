import { getProducts } from '@/lib/api'
import type { Product } from '@/lib/api'
import FilterBar from '@/components/FilterBar'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 60
export const metadata: Metadata = {
  title: 'Accessories — VAULT',
  description: 'Premium watches, luxury bags, and curated jewellery. Editorial mosaic of the finest accessories.',
}

const SUBCATEGORIES = [
  { label: 'Watches', tag: 'watches' },
  { label: 'Bags', tag: 'bags' },
  { label: 'Jewellery', tag: 'jewellery' },
  { label: 'Belts', tag: 'belts' },
]

export default async function AccessoriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  let data = { results: [] as Product[], count: 0 }
  try {
    data = await getProducts({
      category: 'accessories',
      max_price: searchParams.max_price ? Number(searchParams.max_price) : undefined,
      search: searchParams.search,
    })
  } catch {}

  return (
    <>
      {/* Page Header */}
      <div
        style={{
          padding: '4rem 2rem 3rem',
          borderBottom: '1.5px solid var(--outline-variant)',
          background: 'var(--surface-low)',
        }}
      >
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: 12 }}>
            Category — Accessories
          </p>
          <h1 className="display-lg">
            The <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Details</em>
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', marginTop: 12, fontSize: 15 }}>
            Watches, bags, jewellery, and more.{' '}
            <span style={{ color: 'var(--primary)' }}>
              {data.count} piece{data.count !== 1 ? 's' : ''} curated.
            </span>
          </p>
        </div>
      </div>

      {/* Subcategory Nav */}
      <div
        style={{
          display: 'flex',
          gap: '1.5px',
          borderBottom: '1.5px solid var(--outline-variant)',
          background: 'var(--surface-low)',
          overflowX: 'auto',
        }}
      >
        {SUBCATEGORIES.map((sub) => (
          <a
            key={sub.tag}
            href={`/accessories?search=${sub.tag}`}
            className="label-caps"
            style={{
              padding: '14px 24px',
              color: searchParams.search === sub.tag ? 'var(--primary)' : 'var(--on-surface-variant)',
              textDecoration: 'none',
              borderBottom: searchParams.search === sub.tag ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'color 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {sub.label}
          </a>
        ))}
      </div>

      {/* Filter Bar */}
      <Suspense>
        <FilterBar showCondition={false} />
      </Suspense>

      {/* Editorial Mosaic Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5px',
        }}
      >
        {data.results.map((product: Product, i: number) => {
          // First item spans 2 columns for mosaic effect
          const isHero = i === 0 || i === 5
          return (
            <div
              key={product.id}
              style={{ gridColumn: isHero ? 'span 2' : 'span 1' }}
            >
              <a
                href={`/product/${product.slug}`}
                style={{
                  display: 'block',
                  position: 'relative',
                  aspectRatio: isHero ? '16/9' : '3/4',
                  overflow: 'hidden',
                  background: 'var(--surface-container)',
                  textDecoration: 'none',
                }}
              >
                <img
                  src={product.images?.[0] || `https://placehold.co/600x400/221f19/e9e1d7?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  className="product-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(22,19,13,0.95))',
                    padding: '2rem 1.5rem 1.5rem',
                  }}
                >
                  <p style={{ color: 'var(--on-surface)', fontSize: 14, fontWeight: 500 }}>{product.name}</p>
                  <span className="price-display" style={{ fontSize: 20 }}>
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                </div>
              </a>
            </div>
          )
        })}
      </div>

      {data.results.length === 0 && (
        <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
          <p className="label-caps" style={{ color: 'var(--outline)' }}>No accessories found</p>
        </div>
      )}
    </>
  )
}
