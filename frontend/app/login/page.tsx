'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(redirect)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--surface)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 28, color: 'var(--on-surface)', marginBottom: 8 }}>
              VAULT
            </p>
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 32, marginBottom: 8 }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>Sign in to your account</p>
        </div>

        <div style={{ border: '1.5px solid var(--outline-variant)', padding: '2.5rem', background: 'var(--surface-low)' }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 24 }}>
              <label className="label-caps" style={{ display: 'block', color: 'var(--on-surface-variant)', fontSize: 10, marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="input-vault"
                id="login-email"
              />
            </div>
            <div style={{ marginBottom: 32 }}>
              <label className="label-caps" style={{ display: 'block', color: 'var(--on-surface-variant)', fontSize: 10, marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-vault"
                id="login-password"
              />
            </div>

            {error && (
              <div style={{ background: 'var(--surface-container)', border: '1.5px solid var(--error)', padding: '10px 14px', marginBottom: 20 }}>
                <p style={{ color: 'var(--error)', fontSize: 13 }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              id="login-submit-btn"
              style={{ width: '100%', fontSize: 12, padding: '15px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="divider" style={{ margin: '24px 0' }} />

          <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: 13 }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
