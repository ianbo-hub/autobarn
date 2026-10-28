/**
 * app/admin/layout.tsx
 *
 * Layout wrapper for all /admin/* pages.
 * Authentication is enforced by middleware.ts — by the time this layout
 * renders, the user is guaranteed to be logged in.
 *
 * Provides the admin shell: a minimal sidebar + top bar.
 */

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'AutoBarn Admin',
  robots: 'noindex, nofollow', // never index admin pages
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Double-check auth (middleware already guards this, but belt-and-suspenders)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen flex flex-col bg-grey-100" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="border-b border-rule bg-cream flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <span
            className="font-display text-xl font-black uppercase tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Auto<span className="text-red">Barn</span>
          </span>
          <span
            className="text-[10px] font-mono uppercase tracking-widest text-grey-400 border border-rule px-2 py-0.5"
          >
            Admin
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-grey-400 hidden sm:block">{user.email}</span>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="btn btn-secondary text-[10px] px-3 py-1.5 min-h-0"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="border-b border-rule bg-cream px-6">
        <div className="flex gap-6">
          {[
            { href: '/admin',            label: 'Overview'  },
            { href: '/admin/bookings',   label: 'Bookings'  },
            { href: '/admin/enquiries',  label: 'Enquiries' },
            { href: '/admin/newsletter', label: 'Newsletter'},
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-mono text-[10px] uppercase tracking-widest py-3 text-grey-600 hover:text-ink border-b-2 border-transparent hover:border-ink transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Main content ────────────────────────────────────────── */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
