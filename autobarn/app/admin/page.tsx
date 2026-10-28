/**
 * app/admin/page.tsx — Admin dashboard overview
 *
 * Shows summary counts for bookings, enquiries, and newsletter subscribers.
 * Data is fetched server-side with the service-role client so it bypasses RLS.
 */

import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function getStats() {
  const supabase = createAdminClient()

  // Use head: true so Supabase returns only the COUNT — no row data is
  // transferred over the wire, which is significantly cheaper at scale.
  const [
    totalBookings,
    pendingBookings,
    totalEnquiries,
    newEnquiries,
    totalSubscribers,
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
  ])

  return {
    totalBookings:    totalBookings.count    ?? 0,
    pendingBookings:  pendingBookings.count  ?? 0,
    totalEnquiries:   totalEnquiries.count   ?? 0,
    newEnquiries:     newEnquiries.count     ?? 0,
    totalSubscribers: totalSubscribers.count ?? 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    { label: 'Total bookings',  value: stats.totalBookings,    sub: `${stats.pendingBookings} pending`    },
    { label: 'Total enquiries', value: stats.totalEnquiries,   sub: `${stats.newEnquiries} new`           },
    { label: 'Subscribers',     value: stats.totalSubscribers, sub: 'newsletter'                          },
  ]

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Dashboard</span>
        <h1 className="text-3xl font-bold uppercase" style={{ fontFamily: 'var(--font-display)' }}>
          Overview
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {statCards.map(({ label, value, sub }) => (
          <div key={label} className="bg-cream border border-rule p-6">
            <p className="label mb-2">{label}</p>
            <p className="text-4xl font-black" style={{ fontFamily: 'var(--font-display)' }}>
              {value}
            </p>
            <p className="text-xs text-grey-400 mt-1 font-mono">{sub}</p>
          </div>
        ))}
      </div>

      {/* Placeholder — full data tables come in a future build */}
      <div className="border border-rule bg-cream p-8 text-center">
        <p className="text-grey-400 font-mono text-sm">
          Full booking and enquiry management tables — coming soon.
        </p>
        <p className="text-grey-400 text-xs mt-2">
          Manage records directly in your{' '}
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ink"
          >
            Supabase dashboard
          </a>{' '}
          in the meantime.
        </p>
      </div>
    </div>
  )
}
