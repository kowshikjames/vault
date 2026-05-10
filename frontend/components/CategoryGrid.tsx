'use client'
import Link from 'next/link'

const CATEGORIES = [
  { slug: 'thrift', label: 'Thrift Finds', sub: 'Pre-loved · Curated · Authentic', image: '/placeholders/1.jpg' },
  { slug: 'sneakers', label: 'Sneakers', sub: 'Rare Drops · Deadstock · Limited', image: '/placeholders/2.jpg' },
  { slug: 'accessories', label: 'Accessories', sub: 'Watches · Bags · Jewellery', image: '/placeholders/3.jpg' },
  { slug: 'new-arrivals', label: 'New Arrivals', sub: 'Just Dropped · Fresh Picks', image: '/placeholders/5.jpg' },
]

export default function CategoryGrid() {
  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: 'var(--border)',
        }}
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="cat-tile"
              style={{
                position: 'relative',
                background: 'var(--white)',
                padding: '3rem 2rem',
                minHeight: 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              {/* Background Image */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <img 
                  src={cat.image} 
                  alt={cat.label} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  className="cat-bg-img"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)' }} />
              </div>

              <div style={{ position: 'relative', zIndex: 10 }}>
                <p className="label-caps" style={{ color: 'var(--white)', opacity: 0.8, marginBottom: 8, fontSize: 10 }}>
                  {cat.sub}
                </p>
                <h2 className="headline-md" style={{ color: 'var(--white)' }}>
                  {cat.label}
                </h2>
                <p
                  className="label-caps"
                  style={{ color: 'var(--white)', marginTop: 16, fontSize: 10 }}
                >
                  Shop Now →
                </p>
              </div>
            </div>
            
            <style jsx>{`
              .cat-tile:hover .cat-bg-img {
                transform: scale(1.05);
              }
            `}</style>
          </Link>
        ))}
      </div>
    </section>
  )
}
