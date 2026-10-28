/**
 * lib/utils.ts
 *
 * General-purpose client + server utilities.
 *
 * Display-formatting functions and label dictionaries now live in
 * `lib/formatting.ts`. They are re-exported here so all existing
 * `@/lib/utils` imports continue to work without any changes.
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Tailwind class helper ────────────────────────────────────

/** Merge Tailwind classes, resolving conflicts correctly */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── UI helpers ───────────────────────────────────────────────

/** Generate a short random ID (for toasts, keys, etc.) */
export function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

// ─── HTTP / server helpers ────────────────────────────────────

/** Extract the client IP from standard proxy headers */
export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

/** Build a namespaced rate-limit key, e.g. "rl:booking:1.2.3.4" */
export function rateLimitKey(ip: string, action: string): string {
  return `rl:${action}:${ip}`
}

// ─── Re-exports from lib/formatting (backward compat) ─────────
// Any file that already imports these from '@/lib/utils' keeps working.

export {
  formatPrice,
  formatMileage,
  formatDate,
  truncate,
  FUEL_LABELS,
  TRANSMISSION_LABELS,
  BOOKING_TYPE_LABELS,
} from '@/lib/formatting'
