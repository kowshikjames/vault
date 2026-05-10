'use client'
import { useCart } from '@/lib/store'
import { useEffect } from 'react'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, clearCart, total } = useCart()

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [closeCart])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="overlay" onClick={closeCart} />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(420px, 100vw)',
          background: 'var(--surface-low)',
          borderLeft: '1.5px solid var(--outline-variant)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease',
        }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1.5px solid var(--outline-variant)',
          }}
        >
          <span
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 20 }}
          >
            Your Cart
          </span>
          <button
            onClick={closeCart}
            style={{ background: 'none', border: 'none', color: 'var(--on-surface)', cursor: 'pointer', fontSize: 20 }}
            id="cart-close-btn"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
          {items.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <p className="label-caps" style={{ color: 'var(--outline)' }}>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: '16px 24px',
                  borderBottom: '1.5px solid var(--outline-variant)',
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 100,
                    background: 'var(--surface-container)',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  {item.images?.[0] && (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="product-img"
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, marginBottom: 4, color: 'var(--on-surface)' }}>{item.name}</p>
                  {item.size && (
                    <p className="label-caps" style={{ color: 'var(--outline)', fontSize: 10, marginBottom: 8 }}>
                      Size {item.size}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeItem(item.id)}
                      style={{ width: 24, height: 24, background: 'var(--surface-high)', border: 'none', color: 'var(--on-surface)', cursor: 'pointer', fontSize: 14 }}
                    >−</button>
                    <span style={{ fontSize: 14, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      style={{ width: 24, height: 24, background: 'var(--surface-high)', border: 'none', color: 'var(--on-surface)', cursor: 'pointer', fontSize: 14 }}
                    >+</button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="price-display" style={{ fontSize: 18 }}>
                    ₹{(Number(item.price) * item.qty).toLocaleString('en-IN')}
                  </span>
                  <br />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="label-caps"
                    style={{ background: 'none', border: 'none', color: 'var(--outline)', cursor: 'pointer', fontSize: 10, marginTop: 8 }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1.5px solid var(--outline-variant)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="label-caps" style={{ color: 'var(--on-surface-variant)' }}>Total</span>
              <span className="price-display">₹{total().toLocaleString('en-IN')}</span>
            </div>
            <a
              href="/checkout"
              className="btn-primary"
              style={{ display: 'block', textAlign: 'center', width: '100%' }}
              id="cart-checkout-btn"
            >
              Proceed to Checkout
            </a>
            <button
              onClick={clearCart}
              className="label-caps"
              style={{
                background: 'none', border: 'none', color: 'var(--outline)',
                cursor: 'pointer', fontSize: 10, width: '100%', marginTop: 12, textAlign: 'center',
              }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
