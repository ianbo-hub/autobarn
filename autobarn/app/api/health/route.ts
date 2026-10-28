// ─── Health Check Endpoint ────────────────────────────────────
//
// GET /api/health
//
// Used by UptimeRobot / Better Uptime / Vercel checks.
// Returns 200 when all critical services are reachable, 503 otherwise.
// Keep latency low — uptime monitors call this every 60 s.
//
// SECURITY: Only a minimal status is exposed publicly.
// Internal details (latency, error messages, version) are never
// included in the response to prevent infrastructure fingerprinting.
//

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

interface ServiceCheck {
  ok: boolean
}

async function checkDatabase(): Promise<ServiceCheck> {
  try {
    const supabase = await createServerClient()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .select('id', { count: 'exact', head: true })
      .limit(1)
    if (error && !error.message.includes('0 rows')) {
      return { ok: false }
    }
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

async function checkSanity(): Promise<ServiceCheck> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!projectId || projectId === 'placeholder') {
    return { ok: true }   // not configured yet — don't fail the check
  }
  try {
    const res = await fetch(`https://${projectId}.api.sanity.io/v1/ping`, {
      signal: AbortSignal.timeout(5_000),
      next:   { revalidate: 0 },
    })
    return { ok: res.ok }
  } catch {
    return { ok: false }
  }
}

export async function GET() {
  const [database, sanity] = await Promise.all([
    checkDatabase(),
    checkSanity(),
  ])

  const allOk = database.ok && sanity.ok

  // Minimal public response — no latencies, versions, or error messages
  return NextResponse.json(
    { status: allOk ? 'ok' : 'degraded' },
    {
      status:  allOk ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  )
}

// Disallow HEAD polling from consuming a cold-start unnecessarily
export async function HEAD() {
  return new Response(null, { status: 200 })
}
