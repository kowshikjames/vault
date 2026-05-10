'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--surface-low)',
        borderTop: '1.5px solid var(--outline-variant)',
        padding: '3rem 2rem',
        marginTop: '5rem',
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3rem',
        }}
      >
        <div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 20, marginBottom: 12 }}>
            VAULT
          </p>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 14, lineHeight: 1.7 }}>
            Curated streetwear for those who dress beyond ordinary. Find rare thrift,
            premium sneakers, and exclusive accessories.
          </p>
        </div>
        <div>
          <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: 16 }}>Shop</p>
          {[
            { label: 'Thrift Finds', href: '/thrift' },
            { label: 'Sneakers', href: '/sneakers' },
            { label: 'Accessories', href: '/accessories' },
            { label: 'New Arrivals', href: '/new-arrivals' },
          ].map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              style={{ display: 'block', color: 'var(--on-surface-variant)', textDecoration: 'none', fontSize: 14, marginBottom: 8 }}
            >
              {cat.label}
            </Link>
          ))}
        </div>
        <div>
          <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: 16 }}>Connect</p>
          <a
            href="https://instagram.com/vault.store"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', color: 'var(--primary)', textDecoration: 'none', fontSize: 14, marginBottom: 8 }}
          >
            @vault.store on Instagram
          </a>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>
            DM to order · WhatsApp available
          </p>
        </div>
      </div>
      <div
        style={{
          maxWidth: 1440,
          margin: '2rem auto 0',
          paddingTop: '2rem',
          borderTop: '1.5px solid var(--outline-variant)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p className="label-caps" style={{ color: 'var(--outline)', fontSize: 10 }}>
          © 2025 VAULT Store. All Rights Reserved.
        </p>
        <p className="label-caps" style={{ color: 'var(--outline)', fontSize: 10 }}>
          Dress Beyond Ordinary
        </p>
      </div>
    </footer>
  )
}
