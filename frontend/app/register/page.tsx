'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 440 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 32, marginBottom: 12 }}>
            Check your email
          </p>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: 32, fontSize: 14, lineHeight: 1.7 }}>
            We&apos;ve sent a confirmation link to <span style={{ color: 'var(--primary)' }}>{email}</span>.
            Click it to activate your account and start shopping.
          </p>
          <Link href="/login" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    )
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
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 28, color: 'var(--on-surface)', marginBottom: 8 }}>VAULT</p>
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 32, marginBottom: 8 }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>Join the vault. Dress beyond ordinary.</p>
        </div>

        <div style={{ border: '1.5px solid var(--outline-variant)', padding: '2.5rem', background: 'var(--surface-low)' }}>
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: 24 }}>
              <label className="label-caps" style={{ display: 'block', color: 'var(--on-surface-variant)', fontSize: 10, marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@example.com" className="input-vault" id="register-email"
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="label-caps" style={{ display: 'block', color: 'var(--on-surface-variant)', fontSize: 10, marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="Min. 8 characters" className="input-vault" id="register-password"
              />
            </div>
            <div style={{ marginBottom: 32 }}>
              <label className="label-caps" style={{ display: 'block', color: 'var(--on-surface-variant)', fontSize: 10, marginBottom: 8 }}>
                Confirm Password
              </label>
              <input
                type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                required placeholder="••••••••" className="input-vault" id="register-confirm"
              />
            </div>

            {error && (
              <div style={{ background: 'var(--surface-container)', border: '1.5px solid var(--error)', padding: '10px 14px', marginBottom: 20 }}>
                <p style={{ color: 'var(--error)', fontSize: 13 }}>{error}</p>
              </div>
            )}

            <button
              type="submit" className="btn-primary" disabled={loading}
              id="register-submit-btn"
              style={{ width: '100%', fontSize: 12, padding: '15px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="divider" style={{ margin: '24px 0' }} />

          <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: 13 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
