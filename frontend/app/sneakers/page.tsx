import { getProducts } from '@/lib/api'
import ProductGrid from '@/components/ProductGrid'
import FilterBar from '@/components/FilterBar'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'Sneakers — VAULT',
  description: 'Rare deadstock and limited-edition sneakers. Size selectors, brand filters, and raffle drops.',
}

export default async function SneakersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  let data = { results: [] as any[], count: 0 }
  let featured = { results: [] as any[] }
  try {
    ;[data, featured] = await Promise.all([
      getProducts({
        category: 'sneakers',
        max_price: searchParams.max_price ? Number(searchParams.max_price) : undefined,
        search: searchParams.search,
      }),
      getProducts({ category: 'sneakers', is_featured: true }),
    ])
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
            Category — Sneakers
          </p>
          <h1 className="display-lg">
            Rare <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Kicks</em>
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', marginTop: 12, fontSize: 15 }}>
            Deadstock, limited drops, and grail-worthy pairs.{' '}
            <span style={{ color: 'var(--primary)' }}>
              {data.count} pair{data.count !== 1 ? 's' : ''} available.
            </span>
          </p>
        </div>
      </div>

      {/* Featured Drop Banner */}
      {featured.results.length > 0 && (
        <div
          style={{
            background: 'var(--surface-container)',
            borderBottom: '1.5px solid var(--outline-variant)',
            padding: '2rem',
          }}
        >
          <div style={{ maxWidth: 1440, margin: '0 auto' }}>
            <p className="label-caps" style={{ color: 'var(--primary)', marginBottom: 12 }}>
              ✦ Featured Drop
            </p>
            <ProductGrid products={featured.results.slice(0, 3)} columns={3} />
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <Suspense>
        <FilterBar showCondition={false} />
      </Suspense>

      {/* All Sneakers */}
      <ProductGrid products={data.results} columns={4} />
    </>
  )
}
