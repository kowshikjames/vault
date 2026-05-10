'use client'
import { useState } from 'react'
import { useCart } from '@/lib/store'
import { createOrder } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    phone: '',
    line1: '',
    city: '',
    state: '',
    pin: '',
  })

  const shipping = total() >= 999 ? 0 : 99
  const grandTotal = total() + shipping

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login?redirect=/checkout')
        return
      }
      const payload = {
        phone: form.phone,
        address: { line1: form.line1, city: form.city, state: form.state, pin: form.pin },
        items: items.map((i) => ({ product_id: i.id, quantity: i.qty })),
      }
      const result = await createOrder(payload, session.access_token)
      if (result.id) {
        clearCart()
        router.push(`/order-success?id=${result.id}`)
      } else {
        setError('Order failed. Please try again or DM us on Instagram.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 28, marginBottom: 16 }}>Nothing to checkout</p>
        <a href="/" className="btn-primary">Go Shopping</a>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, marginBottom: 40 }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }}>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 32 }}>
            <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: 20 }}>Contact</p>
            <div>
              <label className="label-caps" style={{ display: 'block', color: 'var(--on-surface-variant)', fontSize: 10, marginBottom: 8 }}>
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="input-vault"
                id="checkout-phone"
              />
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: 20 }}>Shipping Address</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label className="label-caps" style={{ display: 'block', color: 'var(--on-surface-variant)', fontSize: 10, marginBottom: 8 }}>
                  Address Line
                </label>
                <input name="line1" required value={form.line1} onChange={handleChange} placeholder="123, Street Name, Area" className="input-vault" id="checkout-line1" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className="label-caps" style={{ display: 'block', color: 'var(--on-surface-variant)', fontSize: 10, marginBottom: 8 }}>City</label>
                  <input name="city" required value={form.city} onChange={handleChange} placeholder="Mumbai" className="input-vault" id="checkout-city" />
                </div>
                <div>
                  <label className="label-caps" style={{ display: 'block', color: 'var(--on-surface-variant)', fontSize: 10, marginBottom: 8 }}>State</label>
                  <input name="state" required value={form.state} onChange={handleChange} placeholder="Maharashtra" className="input-vault" id="checkout-state" />
                </div>
              </div>
              <div>
                <label className="label-caps" style={{ display: 'block', color: 'var(--on-surface-variant)', fontSize: 10, marginBottom: 8 }}>PIN Code</label>
                <input name="pin" required value={form.pin} onChange={handleChange} placeholder="400001" className="input-vault" id="checkout-pin" style={{ maxWidth: 160 }} />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: 'var(--surface-container)', border: '1.5px solid var(--error)', padding: '12px 16px', marginBottom: 20 }}>
              <p style={{ color: 'var(--error)', fontSize: 13 }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            id="checkout-submit-btn"
            style={{ width: '100%', fontSize: 13, padding: '16px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Placing Order...' : `Place Order · ₹${grandTotal.toLocaleString('en-IN')}`}
          </button>
        </form>

        {/* Summary */}
        <div style={{ background: 'var(--surface-low)', border: '1.5px solid var(--outline-variant)', padding: '1.5rem', position: 'sticky', top: 80 }}>
          <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: 16 }}>Order Summary</p>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', flex: 1 }}>
                {item.name} <span style={{ color: 'var(--outline)' }}>×{item.qty}</span>
              </p>
              <span style={{ fontSize: 13, color: 'var(--on-surface)' }}>₹{(Number(item.price) * item.qty).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="divider" style={{ margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--on-surface-variant)', fontSize: 13 }}>Shipping</span>
            <span style={{ color: shipping === 0 ? 'var(--primary)' : 'var(--on-surface)', fontSize: 13 }}>
              {shipping === 0 ? 'Free' : `₹${shipping}`}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="label-caps" style={{ fontSize: 12 }}>Total</span>
            <span className="price-display" style={{ fontSize: 24 }}>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
