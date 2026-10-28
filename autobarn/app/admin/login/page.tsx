'use client'

/**
 * app/admin/login/page.tsx
 *
 * Admin login page using Supabase email + password auth.
 *
 * HOW TO CREATE AN ADMIN USER:
 *   1. Go to your Supabase dashboard → Authentication → Users
 *   2. Click "Add user" → enter email + password
 *   3. That user can now log in here
 *
 * The middleware redirects all /admin/* traffic here if not authenticated.
 */

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

// useSearchParams requires a Suspense boundary in Next.js App Router
export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const next         = searchParams.get('next') ?? '/admin'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const supabase = createBrowserSupabaseClient()

  // If already logged in, redirect immediately.
  // supabase is a stable singleton so it's safe to omit from deps.
  // next and router are stable across renders after mount.
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(next)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    router.replace(next)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-100 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span
            className="text-3xl font-black uppercase tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Auto<span className="text-red">Barn</span>
          </span>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-grey-400">
            Staff portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-cream border border-rule p-8">
          <h1
            className="text-xl font-bold uppercase mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Sign in
          </h1>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="you@autobarn.co.ke"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
              />
            </div>

            {error && (
              <p className="text-red text-sm" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-grey-400 mt-6">
          AutoBarn internal portal — unauthorised access prohibited.
        </p>
      </div>
    </div>
  )
}

