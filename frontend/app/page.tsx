import { getProducts } from '@/lib/api'
import ProductGrid from '@/components/ProductGrid'
import CategoryGrid from '@/components/CategoryGrid'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let featured = { results: [] as import('@/lib/api').Product[] }
  let newArrivals = { results: [] as import('@/lib/api').Product[] }

  try {
    [featured, newArrivals] = await Promise.all([
      getProducts({ is_featured: true }),
      getProducts({}),
    ])
  } catch (err) {
    console.error('Data fetching failed:', err)
    // API not connected yet — show placeholder UI
  }



  return (
    <>
      {/* Announcement Marquee */}
      <div className="marquee-wrapper marquee-gold" style={{ height: 40 }}>
        <div className="marquee-track">
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="marquee-item label-caps" style={{ fontSize: 11 }}>
              <span>Free delivery on orders above ₹999</span>
              <span style={{ color: 'var(--on-primary)', opacity: 0.5 }}>·</span>
              <span>New drops every Friday</span>
              <span style={{ color: 'var(--on-primary)', opacity: 0.5 }}>·</span>
              <span>DM to buy on Instagram</span>
              <span style={{ color: 'var(--on-primary)', opacity: 0.5 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section
        style={{
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          padding: '5rem 2rem 4rem',
          background: 'var(--white)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <p className="label-caps" style={{ color: 'var(--ink-60)', marginBottom: 24 }}>
              The Vault is Open
            </p>
            <h1 className="display-xl" style={{ marginBottom: 16 }}>
              Dress{' '}
              <em style={{ color: 'var(--ink)', fontStyle: 'italic' }}>Beyond</em>
              <br />
              Ordinary
            </h1>
            <p
              style={{
                color: 'var(--ink-60)',
                fontSize: 18,
                maxWidth: 520,
                marginBottom: 40,
                lineHeight: 1.6,
              }}
            >
              Curated thrift finds, rare sneakers, and exclusive accessories — sourced from
              the best, delivered to you.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link href="/new-arrivals" className="btn-primary" id="hero-new-arrivals-btn">
                Shop New Arrivals
              </Link>
              <Link href="/thrift" className="btn-secondary" id="hero-thrift-btn">
                Browse Thrift
              </Link>
            </div>
          </div>
          
          <div style={{ position: 'relative', height: '600px', width: '100%', background: 'var(--warm-100)' }}>
            <img 
              src="/placeholders/2.jpg" 
              alt="Hero Sneaker" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <CategoryGrid />

      {/* Featured Products */}
      {featured.results.length > 0 && (
        <section style={{ padding: '5rem 0' }}>
          <div style={{ padding: '0 2rem 2rem', maxWidth: 1440, margin: '0 auto' }}>
            <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: 8 }}>
              Handpicked
            </p>
            <h2 className="display-lg">Featured Drops</h2>
          </div>
          <ProductGrid products={featured.results.slice(0, 8)} columns={4} />
        </section>
      )}

      {/* All Products / Latest */}
      {newArrivals.results.length > 0 && (
        <section style={{ padding: '5rem 0' }}>
          <div style={{ padding: '0 2rem 2rem', maxWidth: 1440, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: 8 }}>Latest</p>
              <h2 className="display-lg">Just In</h2>
            </div>
            <Link href="/new-arrivals" className="btn-secondary" style={{ fontSize: 11 }}>
              View All
            </Link>
          </div>
          <ProductGrid products={newArrivals.results.slice(0, 4)} columns={4} />
        </section>
      )}

      {/* Empty state when API isn't connected yet */}
      {featured.results.length === 0 && newArrivals.results.length === 0 && (
        <section style={{ padding: '5rem 2rem', textAlign: 'center' }}>
          <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: 16 }}>
            Backend not connected
          </p>
          <p style={{ color: 'var(--on-surface-variant)', maxWidth: 400, margin: '0 auto', fontSize: 14 }}>
            Connect your Django backend and Supabase to start seeing products here.
          </p>
        </section>
      )}

      {/* Brand Manifesto Marquee */}
      <div className="marquee-wrapper marquee-dark" style={{ background: 'var(--surface-container)' }}>
        <div className="marquee-track" style={{ animationDuration: '40s' }}>
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="marquee-item label-caps" style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>
              <span>Curated · Not Mass Produced</span>
              <span style={{ color: 'var(--primary)' }}> ✦ </span>
              <span>Worn Once · Loved Forever</span>
              <span style={{ color: 'var(--primary)' }}> ✦ </span>
              <span>The Archive Never Closes</span>
              <span style={{ color: 'var(--primary)' }}> ✦ </span>
              <span>Dress Beyond Ordinary</span>
              <span style={{ color: 'var(--primary)' }}> ✦ </span>
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
