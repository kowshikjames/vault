'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SellerDashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<{ store_name: string; instagram_handle: string } | null>(null)
  const [products, setProducts] = useState<Array<{ id: string; name: string; price: string; condition: string; size: string; images: string[]; is_sold: boolean }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      try {
        // Fetch profile
        const profRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller-profiles/me/`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        if (profRes.status === 404) {
          router.push('/seller/onboarding')
          return
        }
        setProfile(await profRes.json())

        // Fetch products
        const prodRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller-products/`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        const prodData = await prodRes.json()
        setProducts(prodData.results || [])

      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [router])

  if (loading) return <div style={{ padding: '80px 24px', textAlign: 'center' }}>Loading...</div>
  if (!profile) return null

  return (
    <div style={{ maxWidth: 1000, margin: '60px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
        <div>
          <p className="label-caps" style={{ color: 'var(--ink-40)', marginBottom: 8 }}>Seller Dashboard</p>
          <h1 className="display-md">{profile.store_name}</h1>
          <p style={{ color: 'var(--ink-60)', marginTop: 8 }}>@{profile.instagram_handle}</p>
        </div>
        <Link href="/seller/products/new" className="btn-primary">
          + Add Listing
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
        {products.length === 0 ? (
          <div style={{ background: 'var(--white)', padding: '60px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--ink-60)', marginBottom: 16 }}>You haven&apos;t added any listings yet.</p>
            <Link href="/seller/products/new" className="btn-secondary">Upload First Item</Link>
          </div>
        ) : (
          products.map(p => (
            <div key={p.id} style={{ background: 'var(--white)', padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <div style={{ width: 60, height: 60, background: 'var(--warm-100)' }}>
                  {p.images && p.images[0] && <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: 16 }}>{p.name}</h3>
                  <p style={{ color: 'var(--ink-60)', fontSize: 13, marginTop: 4 }}>₹{p.price} · {p.condition} · {p.size}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                {p.is_sold ? (
                  <span className="badge badge-sold">SOLD</span>
                ) : (
                  <span className="badge badge-good">ACTIVE</span>
                )}
                <Link href={`/seller/products/${p.id}/edit`} className="btn-ghost" style={{ fontSize: 13 }}>Edit</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
