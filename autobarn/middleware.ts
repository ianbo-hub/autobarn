/**
 * middleware.ts
 *
 * Runs on every request (except static assets).
 * Responsibilities:
 *  1. Legacy URL redirects  (308 permanent)
 *  2. CORS guard on /api/*  (block cross-origin browser requests)
 *  3. Admin auth guard      (/admin/* requires a Supabase session)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Skip Next.js internals and static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|videos/).*)'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. Legacy redirects ───────────────────────────────────────
  if (pathname === '/home')
    return NextResponse.redirect(new URL('/', request.url), 308)
  if (pathname === '/vehicles')
    return NextResponse.redirect(new URL('/', request.url), 308)
  if (pathname === '/services')
    return NextResponse.redirect(new URL('/wash-detailing', request.url), 308)

  // ── 2. CORS: block cross-origin requests to API routes ────────
  // Browsers send an Origin header on cross-origin requests.
  // If it doesn't match our site, reject it before the route runs.
  if (pathname.startsWith('/api/')) {
    const origin  = request.headers.get('origin')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const isLocal = origin?.startsWith('http://localhost') || origin?.startsWith('http://127.0.0.1')

    if (origin && !origin.startsWith(siteUrl) && !isLocal) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  // ── 3. Admin route auth guard ─────────────────────────────────
  if (pathname.startsWith('/admin')) {
    // If Supabase is not configured, redirect to login for safety
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      if (pathname !== '/admin/login') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      return NextResponse.next()
    }

    let response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet: Array<{ name: string; value: string; options?: object }>) => {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]),
            )
          },
        },
      },
    )

    // getUser() validates the JWT against Supabase — safe against forged cookies
    const { data: { user } } = await supabase.auth.getUser()

    // Allow unauthenticated access to the login page itself
    if (pathname === '/admin/login') {
      if (user) {
        // Already authenticated → go straight to dashboard
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return response
    }

    // Every other /admin/* path requires a valid session
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('next', pathname) // preserve intended destination
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  return NextResponse.next()
}
