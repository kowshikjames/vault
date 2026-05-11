import { getProducts } from '@/lib/api'
import type { Product } from '@/lib/api'
import ProductGrid from '@/components/ProductGrid'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'New Arrivals — VAULT',
  description: 'Freshest drops from VAULT. New pieces added weekly — thrift, sneakers, and accessories.',
}

export default async function NewArrivalsPage() {
  let data = { results: [] as Product[], count: 0 }
  try {
    data = await getProducts({})
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
          <p className="label-caps" style={{ color: 'var(--primary)', marginBottom: 12 }}>
            ✦ Just Dropped
          </p>
          <h1 className="display-lg">New Arrivals</h1>
          <p style={{ color: 'var(--on-surface-variant)', marginTop: 12, fontSize: 15 }}>
            Chronological feed of everything new.{' '}
            <span style={{ color: 'var(--primary)' }}>Updated weekly.</span>
          </p>
        </div>
      </div>

      {/* Instagram-style follow CTA */}
      <div
        style={{
          background: 'var(--surface-container)',
          borderBottom: '1.5px solid var(--outline-variant)',
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: 4 }}>
            Get new drops first
          </p>
          <p style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>
            Follow <span style={{ color: 'var(--primary)' }}>@vault.store</span> on Instagram for
            early access and exclusive drops
          </p>
        </div>
        <a
          href="https://instagram.com/vault.store"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          id="new-arrivals-follow-btn"
          style={{ whiteSpace: 'nowrap' }}
        >
          Follow on Instagram
        </a>
      </div>

      {/* Products — Instagram-style grid */}
      <ProductGrid products={data.results} columns={4} />
    </>
  )
}
