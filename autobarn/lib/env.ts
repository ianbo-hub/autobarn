/**
 * lib/env.ts
 *
 * Runtime environment-variable validation.
 *
 * – Crashes the server immediately (at module-import time) if any required
 *   server-side variable is missing, so you get a clear error on startup
 *   instead of a cryptic 500 halfway through a request.
 *
 * – Guards server-only secrets (no NEXT_PUBLIC_ prefix) from being accessed
 *   inside browser code. Importing serverEnv in a 'use client' component
 *   throws at runtime, preventing accidental exposure.
 *
 * USAGE
 *   Server components / API routes:
 *     import { serverEnv, publicEnv } from '@/lib/env'
 *
 *   Client components:
 *     import { publicEnv } from '@/lib/env'   ← only public vars
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

function requireServerVar(key: string): string {
  if (typeof window !== 'undefined') {
    // This path executes in the browser bundle — leak blocked.
    throw new Error(
      `[env] Security error: server-only variable "${key}" was accessed on the client. ` +
      `Remove this import from any 'use client' component.`,
    )
  }
  const val = process.env[key]
  if (!val || val.trim() === '') {
    throw new Error(
      `[env] Missing required server environment variable: ${key}\n` +
      `  • Development: add it to .env.local\n` +
      `  • Production:  add it to your deployment secrets (Vercel / Railway / etc.)`,
    )
  }
  return val.trim()
}

function requirePublicVar(key: string): string {
  const val = process.env[key]
  if (!val || val.trim() === '') {
    throw new Error(
      `[env] Missing required environment variable: ${key}\n` +
      `  • Development: add it to .env.local\n` +
      `  • Production:  add it to your deployment variables`,
    )
  }
  return val.trim()
}

function optionalVar(key: string, fallback = ''): string {
  return (process.env[key] ?? fallback).trim()
}

// ─── Public variables (safe in browser and server) ───────────────────────────
// These are bundled into the client JS by Next.js (NEXT_PUBLIC_ prefix).
// Never put secrets here.

export const publicEnv = {
  SUPABASE_URL:          requirePublicVar('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY:     requirePublicVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  SANITY_PROJECT_ID:     requirePublicVar('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  SANITY_DATASET:        optionalVar('NEXT_PUBLIC_SANITY_DATASET', 'production'),
  SANITY_API_VERSION:    optionalVar('NEXT_PUBLIC_SANITY_API_VERSION', '2024-01-01'),
  ALGOLIA_APP_ID:        optionalVar('NEXT_PUBLIC_ALGOLIA_APP_ID'),
  ALGOLIA_SEARCH_KEY:    optionalVar('NEXT_PUBLIC_ALGOLIA_SEARCH_KEY'),
  CLOUDINARY_CLOUD_NAME: optionalVar('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'),
  SITE_URL:              optionalVar('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),
  GOOGLE_MAPS_KEY:       optionalVar('NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY'),
} as const

// ─── Server-only variables ───────────────────────────────────────────────────
// These are NEVER bundled into client JS.
// Accessing this export from a 'use client' component throws immediately.

export const serverEnv = {
  SUPABASE_SERVICE_ROLE_KEY: requireServerVar('SUPABASE_SERVICE_ROLE_KEY'),
  SANITY_API_TOKEN:           requireServerVar('SANITY_API_TOKEN'),
  RESEND_API_KEY:             requireServerVar('RESEND_API_KEY'),
  RESEND_FROM_EMAIL:          optionalVar('RESEND_FROM_EMAIL', 'bookings@autobarn.co.ke'),
  ALGOLIA_ADMIN_KEY:          optionalVar('ALGOLIA_ADMIN_KEY'),
  CLOUDINARY_API_KEY:         optionalVar('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET:      optionalVar('CLOUDINARY_API_SECRET'),
} as const
