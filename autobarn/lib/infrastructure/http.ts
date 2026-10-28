/**
 * lib/infrastructure/http.ts
 *
 * Thin helpers for building consistent JSON responses from API routes.
 * All routes should use these instead of calling NextResponse.json directly,
 * so the response shape stays uniform and can be changed in one place.
 */

import { NextResponse } from 'next/server'
import type { ApiError, ApiSuccess } from '@/types'

// ─── Success responses ────────────────────────────────────────

/** 200 OK with a data payload */
export function ok<T>(data: T): NextResponse<ApiSuccess<T>> {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data }, { status: 200 })
}

/** 201 Created with a data payload */
export function created<T>(data: T): NextResponse<ApiSuccess<T>> {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data }, { status: 201 })
}

// ─── Error responses ──────────────────────────────────────────

/** Generic error response */
export function apiError(
  message: string,
  status:  number,
  details?: Record<string, string[]>,
): NextResponse<ApiError> {
  const body: ApiError = { success: false, error: message }
  if (details) body.details = details
  return NextResponse.json<ApiError>(body, { status })
}

// ─── Shortcuts for common HTTP error codes ────────────────────

export const badRequest       = (msg = 'Invalid JSON body.')  => apiError(msg, 400)
export const unprocessable    = (msg: string, details?: Record<string, string[]>) => apiError(msg, 422, details)
export const tooManyRequests  = (msg = 'Too many requests. Please try again later.') => apiError(msg, 429)
export const conflict         = (msg: string) => apiError(msg, 409)
export const internalError    = (msg = 'Internal server error.') => apiError(msg, 500)
export const methodNotAllowed = (msg = 'Method not allowed.') => apiError(msg, 405)

// ─── Body parser ─────────────────────────────────────────────

/**
 * Safely parse the request JSON body.
 * Returns `{ data }` on success or `{ error }` with a 400 response on failure.
 */
export async function parseJsonBody(
  req: Request,
): Promise<{ data: unknown; error?: never } | { data?: never; error: NextResponse<ApiError> }> {
  try {
    const data = await req.json()
    return { data }
  } catch {
    return { error: badRequest() }
  }
}
