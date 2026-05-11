'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditProduct() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id

  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(true)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    condition: 'mint',
    size: '',
    brand: '',
    category: '',
    image_url: '',
    is_sold: false
  })

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      try {
        // Fetch categories
        const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/`)
        const catData = await catRes.json()
        setCategories(catData.results || [])

        // Fetch product
        const prodRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller-products/${productId}/`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        if (!prodRes.ok) {
          router.push('/seller/dashboard')
          return
        }
        const product = await prodRes.json()
        
        setFormData({
          name: product.name,
          description: product.description || '',
          price: product.price,
          condition: product.condition || 'mint',
          size: product.size || '',
          brand: product.brand || '',
          category: product.category?.id || '',
          image_url: product.images?.[0] || '',
          is_sold: product.is_sold
        })
      } catch {
      } finally {
        setInitLoading(false)
      }
    }
    loadData()
  }, [productId, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller-products/${productId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ...formData,
          images: formData.image_url ? [formData.image_url] : []
        })
      })

      if (res.ok) {
        router.push('/seller/dashboard')
      } else {
        alert('Failed to update product.')
      }
    } catch {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this listing?')) return
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller-products/${productId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      if (res.ok) {
        router.push('/seller/dashboard')
      }
    } catch {
      alert('Failed to delete')
    }
  }

  if (initLoading) return <div style={{ padding: '80px 24px', textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className="display-md">Edit Listing</h1>
        <Link href="/seller/dashboard" className="btn-ghost">← Back</Link>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
        
        {/* Mark Sold Toggle */}
        <div style={{ background: formData.is_sold ? 'var(--warm-200)' : 'var(--off-white)', border: '1px solid var(--border)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontWeight: 600, fontSize: 16 }}>Status: {formData.is_sold ? 'SOLD' : 'ACTIVE'}</h3>
            <p style={{ color: 'var(--ink-60)', fontSize: 13, marginTop: 4 }}>
              {formData.is_sold ? "This item is marked as sold and hidden from public search." : "This item is live and available for purchase."}
            </p>
          </div>
          <button 
            type="button" 
            onClick={() => setFormData({...formData, is_sold: !formData.is_sold})}
            className={formData.is_sold ? "btn-secondary" : "btn-primary"}
          >
            {formData.is_sold ? 'Mark as Active' : 'Mark as Sold'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div>
            <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>Product Title</label>
            <input required type="text" className="input-vault" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>Price (₹)</label>
            <input required type="number" className="input-vault" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>Description</label>
          <textarea className="input-vault" style={{ minHeight: 120 }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <div>
            <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>Condition</label>
            <select className="input-vault" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
              <option value="mint">Mint / Deadstock</option>
              <option value="good">Good / Light Wear</option>
              <option value="fair">Fair / Visible Flaws</option>
            </select>
          </div>
          <div>
            <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>Size</label>
            <input type="text" className="input-vault" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
          </div>
          <div>
            <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>Category</label>
            <select className="input-vault" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>Image URL</label>
          <input type="url" className="input-vault" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
        </div>

        <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" className="btn-ghost" style={{ color: 'var(--error)' }} onClick={handleDelete}>
            Delete Listing
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  )
}
