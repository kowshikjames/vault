'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 'var(--nav-height)',
      background: 'var(--white)',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'border-color 0.2s',
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{
        width: '100%', maxWidth: 1440, margin: '0 auto',
        padding: '0 32px',
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
      }}>
        {/* Left links */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {[
            { href: '/thrift', label: 'Thrift' },
            { href: '/sneakers', label: 'Sneakers' },
            { href: '/accessories', label: 'Accessories' },
            { href: '/new-arrivals', label: 'New Arrivals', accent: true },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: link.accent ? 'var(--ink)' : 'var(--ink-60)',
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
            onMouseLeave={e => (e.currentTarget.style.color = link.accent ? 'var(--ink)' : 'var(--ink-60)')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', textAlign: 'center' }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
          }}>
            VAULT
          </span>
        </Link>

        {/* Right */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Link href="/seller/dashboard" style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            color: 'var(--ink-60)', textDecoration: 'none', transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-60)')}
          >
            Sell on Vault
          </Link>
          <Link href="/login" style={{
            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
            color: 'var(--ink)', textDecoration: 'none',
          }}>
            Login
          </Link>
        </div>
      </div>
    </nav>
  )
}
