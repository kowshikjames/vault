'use client'
import { useCart } from '@/lib/store'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, total } = useCart()

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 32, marginBottom: 16 }}>
          Your cart is empty
        </p>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: 32 }}>
          Browse the vault and add something you love.
        </p>
        <Link href="/" className="btn-primary" id="cart-empty-shop-btn">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36 }}>Your Cart</h1>
        <button
          onClick={clearCart}
          className="label-caps"
          style={{ background: 'none', border: 'none', color: 'var(--outline)', cursor: 'pointer', fontSize: 11 }}
        >
          Clear All
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }}>
        {/* Items List */}
        <div style={{ borderTop: '1.5px solid var(--outline-variant)' }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto',
                gap: 24,
                padding: '24px 0',
                borderBottom: '1.5px solid var(--outline-variant)',
                alignItems: 'start',
              }}
            >
              {/* Image */}
              <Link href={`/product/${item.slug}`}>
                <div style={{ aspectRatio: '3/4', background: 'var(--surface-container)', overflow: 'hidden' }}>
                  <img
                    src={item.images?.[0] || `https://placehold.co/120x160/221f19/e9e1d7?text=IMG`}
                    alt={item.name}
                    className="product-img"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </Link>

              {/* Details */}
              <div>
                {item.brand && (
                  <p className="label-caps" style={{ color: 'var(--outline)', fontSize: 10, marginBottom: 4 }}>{item.brand}</p>
                )}
                <Link href={`/product/${item.slug}`} style={{ textDecoration: 'none' }}>
                  <p style={{ color: 'var(--on-surface)', fontSize: 16, marginBottom: 8 }}>{item.name}</p>
                </Link>
                {item.size && (
                  <p className="label-caps" style={{ color: 'var(--on-surface-variant)', fontSize: 10, marginBottom: 16 }}>
                    Size: {item.size}
                  </p>
                )}
                {/* Qty */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeItem(item.id)}
                    style={{ width: 32, height: 32, background: 'var(--surface-high)', border: '1.5px solid var(--outline-variant)', color: 'var(--on-surface)', cursor: 'pointer', fontSize: 16 }}
                  >−</button>
                  <span style={{ fontSize: 15, minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    style={{ width: 32, height: 32, background: 'var(--surface-high)', border: '1.5px solid var(--outline-variant)', color: 'var(--on-surface)', cursor: 'pointer', fontSize: 16 }}
                  >+</button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="label-caps"
                    style={{ background: 'none', border: 'none', color: 'var(--outline)', cursor: 'pointer', fontSize: 10, marginLeft: 8 }}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Price */}
              <div style={{ textAlign: 'right' }}>
                <span className="price-display" style={{ fontSize: 22 }}>
                  ₹{(Number(item.price) * item.qty).toLocaleString('en-IN')}
                </span>
                {item.qty > 1 && (
                  <p style={{ color: 'var(--outline)', fontSize: 12, marginTop: 4 }}>
                    ₹{Number(item.price).toLocaleString('en-IN')} each
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ background: 'var(--surface-low)', border: '1.5px solid var(--outline-variant)', padding: '2rem', position: 'sticky', top: 80 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 22, marginBottom: 24 }}>
            Order Summary
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>
              Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)
            </span>
            <span style={{ color: 'var(--on-surface)', fontSize: 14 }}>₹{total().toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <span style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>Shipping</span>
            <span style={{ color: 'var(--primary)', fontSize: 14 }}>
              {total() >= 999 ? 'Free' : '₹99'}
            </span>
          </div>
          <div className="divider" style={{ marginBottom: 24 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <span className="label-caps" style={{ fontSize: 13 }}>Total</span>
            <span className="price-display" style={{ fontSize: 28 }}>
              ₹{(total() + (total() >= 999 ? 0 : 99)).toLocaleString('en-IN')}
            </span>
          </div>
          <Link href="/checkout" className="btn-primary" style={{ display: 'block', textAlign: 'center', width: '100%' }} id="cart-page-checkout-btn">
            Proceed to Checkout
          </Link>
          <Link
            href="/"
            className="label-caps"
            style={{ display: 'block', textAlign: 'center', color: 'var(--outline)', textDecoration: 'none', marginTop: 16, fontSize: 10 }}
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
