'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SellerOnboarding() {
  const router = useRouter()
  const [storeName, setStoreName] = useState('')
  const [igHandle, setIgHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if they already have a profile
    async function checkProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller-profiles/me/`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        if (res.ok) {
          router.push('/seller/dashboard')
        }
      } catch (e) {}
    }
    checkProfile()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller-profiles/me/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          store_name: storeName,
          instagram_handle: igHandle.replace('@', '')
        })
      })

      if (res.ok) {
        router.push('/seller/dashboard')
      } else {
        const data = await res.json()
        setError(JSON.stringify(data))
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: '80px auto', padding: 24 }}>
      <h1 className="display-md" style={{ marginBottom: 12 }}>Create Your Store</h1>
      <p style={{ color: 'var(--ink-60)', marginBottom: 32 }}>
        Set up your seller profile to start listing products on VAULT.
      </p>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ background: 'var(--warm-100)', border: '1px solid var(--error)', padding: 12, marginBottom: 20 }}>
            <p style={{ color: 'var(--error)', fontSize: 13 }}>{error}</p>
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>
            Store Name
          </label>
          <input
            type="text"
            required
            className="input-vault"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="e.g. Archive Finds"
          />
        </div>

        <div style={{ marginBottom: 32 }}>
          <label className="label-caps" style={{ display: 'block', marginBottom: 8, color: 'var(--ink-60)' }}>
            Instagram Handle
          </label>
          <input
            type="text"
            required
            className="input-vault"
            value={igHandle}
            onChange={(e) => setIgHandle(e.target.value)}
            placeholder="@yourstore"
          />
          <p style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 8 }}>
            Buyers will be redirected to your Instagram DMs to purchase.
          </p>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Setting up...' : 'Create Store'}
        </button>
      </form>
    </div>
  )
}
