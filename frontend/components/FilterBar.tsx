'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

interface FilterBarProps {
  showCondition?: boolean
  showBrand?: boolean
}

const CONDITIONS = ['mint', 'good', 'fair'] as const

export default function FilterBar({ showCondition = true }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const active = (key: string, val: string) => searchParams.get(key) === val

  return (
    <div
      style={{
        display: 'flex',
        gap: '1.5px',
        alignItems: 'center',
        borderBottom: '1.5px solid var(--outline-variant)',
        padding: '0 2rem',
        background: 'var(--surface-low)',
        overflowX: 'auto',
      }}
    >
      {/* Sort */}
      <div style={{ padding: '14px 0', marginRight: 24 }}>
        <span className="label-caps" style={{ color: 'var(--outline)', marginRight: 12 }}>Sort</span>
        {[
          { label: 'Newest', val: '-created_at' },
          { label: 'Price ↑', val: 'price' },
          { label: 'Price ↓', val: '-price' },
        ].map((opt) => (
          <button
            key={opt.val}
            className="label-caps"
            onClick={() => router.push(pathname + '?' + createQueryString('ordering', opt.val))}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active('ordering', opt.val) ? 'var(--primary)' : 'var(--on-surface-variant)',
              marginRight: 16,
              transition: 'color 0.15s',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Condition filter */}
      {showCondition && (
        <div style={{ padding: '14px 0', marginRight: 24, display: 'flex', gap: 12 }}>
          <span className="label-caps" style={{ color: 'var(--outline)', marginRight: 4 }}>Condition</span>
          <button
            className="label-caps"
            onClick={() => router.push(pathname + '?' + createQueryString('condition', ''))}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: !searchParams.get('condition') ? 'var(--primary)' : 'var(--on-surface-variant)',
            }}
          >
            All
          </button>
          {CONDITIONS.map((c) => (
            <button
              key={c}
              className="label-caps"
              onClick={() => router.push(pathname + '?' + createQueryString('condition', c))}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: active('condition', c) ? 'var(--primary)' : 'var(--on-surface-variant)',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Price filter */}
      <div style={{ padding: '14px 0', display: 'flex', gap: 12 }}>
        <span className="label-caps" style={{ color: 'var(--outline)', marginRight: 4 }}>Under</span>
        {[500, 1000, 2000, 5000].map((p) => (
          <button
            key={p}
            className="label-caps"
            onClick={() => router.push(pathname + '?' + createQueryString('max_price', String(p)))}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: active('max_price', String(p)) ? 'var(--primary)' : 'var(--on-surface-variant)',
            }}
          >
            ₹{p.toLocaleString('en-IN')}
          </button>
        ))}
      </div>
    </div>
  )
}
