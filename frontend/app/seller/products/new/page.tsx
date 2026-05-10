'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    condition: 'mint',
    size: '',
    brand: '',
    category: '',
    image_url: ''
  })

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/`)
        const data = await res.json()
        setCategories(data.results || [])
        if (data.results && data.results.length > 0) {
          setFormData(f => ({ ...f, category: data.results[0].id }))
        }
      } catch (e) {}
    }
    fetchCategories()
  }, [])

  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>([])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not logged in')

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
      const filePath = `private/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('vault-media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('vault-media')
        .getPublicUrl(filePath)

      setImages(prev => [...prev, publicUrl])
    } catch (err: any) {
      console.error(err)
      alert('Upload failed: ' + (err.message || 'Check if "vault-media" bucket exists in Supabase Storage'))
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller-products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ...formData,
          slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000),
          images: images
        })
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/product/${data.slug}`)
      } else {
        const errData = await res.json()
        console.error(errData)
        alert('Failed to add product: ' + JSON.stringify(errData))
      }
    } catch (err) {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className="display-md">Add New Listing</h1>
        <Link href="/seller/dashboard" className="btn-ghost">← Back to Dashboard</Link>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div>
            <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>Product Title</label>
            <input required type="text" className="input-vault" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Vintage Nike Windbreaker" />
          </div>
          <div>
            <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>Price (₹)</label>
            <input required type="number" className="input-vault" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. 2499" />
          </div>
        </div>

        <div>
          <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>Description</label>
          <textarea className="input-vault" style={{ minHeight: 120 }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the item, flaws, fit, etc."></textarea>
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
            <input type="text" className="input-vault" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} placeholder="e.g. Mens L" />
          </div>
          <div>
            <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>Category</label>
            <select className="input-vault" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>Product Images</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginBottom: 12 }}>
            {images.map((url, i) => (
              <div key={i} style={{ aspectRatio: '1', position: 'relative', background: 'var(--warm-100)' }}>
                <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  type="button"
                  onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                  style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
            ))}
            <label 
              style={{ 
                aspectRatio: '1', 
                border: '2px dashed var(--border)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                flexDirection: 'column',
                gap: 8,
                color: 'var(--ink-40)'
              }}
            >
              <input type="file" hidden accept="image/*" onChange={handleFileUpload} disabled={uploading} />
              <span style={{ fontSize: 24 }}>+</span>
              <span style={{ fontSize: 10 }} className="label-caps">{uploading ? 'Uploading...' : 'Add Image'}</span>
            </label>
          </div>
          <p style={{ fontSize: 11, color: 'var(--ink-40)' }}>Upload at least one high-quality photo of your item.</p>
        </div>

        <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <button type="submit" className="btn-primary" disabled={loading || uploading}>
            {loading ? 'Publishing...' : 'Publish Listing'}
          </button>
        </div>

      </form>
    </div>
  )
}
