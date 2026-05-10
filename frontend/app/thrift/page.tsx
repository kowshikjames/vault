import { getProducts } from '@/lib/api'
import ProductGrid from '@/components/ProductGrid'
import FilterBar from '@/components/FilterBar'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'Thrift Finds — VAULT',
  description: 'Pre-loved, curated thrift clothing. Mint, Good, and Fair condition pieces sourced with care.',
}

export default async function ThriftPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  let data = { results: [] as any[], count: 0 }
  try {
    data = await getProducts({
      category: 'thrift',
      condition: searchParams.condition,
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
            Category — Thrift
          </p>
          <h1 className="display-lg">Thrift Finds</h1>
          <p style={{ color: 'var(--on-surface-variant)', marginTop: 12, fontSize: 15 }}>
            Pre-loved pieces curated for quality.{' '}
            <span style={{ color: 'var(--primary)' }}>
              {data.count} item{data.count !== 1 ? 's' : ''} available.
            </span>
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Suspense>
        <FilterBar showCondition={true} />
      </Suspense>

      {/* Grid */}
      <ProductGrid products={data.results} columns={4} />
    </>
  )
}
