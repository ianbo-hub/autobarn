/**
 * app/api/bookings/route.ts
 *
 * Thin HTTP adapter — all business logic lives in the service layer.
 *
 * POST /api/bookings
 *   Validates the request body, delegates to booking.service,
 *   and returns an appropriate JSON response.
 */

import { NextRequest }                          from 'next/server'
import { bookingSchema }                        from '@/lib/validations'
import { createBooking }                        from '@/lib/services/booking.service'
import { parseJsonBody, created, unprocessable,
         tooManyRequests, conflict, internalError,
         methodNotAllowed }                     from '@/lib/infrastructure/http'
import { getClientIp, rateLimitKey }            from '@/lib/utils'
import { logger }                               from '@/lib/logger'

export async function POST(req: NextRequest) {
  // 1. Parse body
  const parsed = await parseJsonBody(req)
  if (parsed.error) return parsed.error

  // 2. Validate
  const result = bookingSchema.safeParse(parsed.data)
  if (!result.success) {
    return unprocessable('Validation failed.', result.error.flatten().fieldErrors)
  }

  // 3. Run business logic
  const ip      = getClientIp(req)
  const rlKey   = rateLimitKey(ip, 'booking')

  try {
    const outcome = await createBooking(result.data, rlKey)

    if (!outcome.ok) {
      if (outcome.status === 429) return tooManyRequests(outcome.error)
      if (outcome.status === 409) return conflict(outcome.error)
      return internalError(outcome.error)
    }

    return created({ id: outcome.bookingId })
  } catch (err) {
    logger.error('bookings', 'Unexpected error', err)
    return internalError()
  }
}

export async function GET() {
  return methodNotAllowed()
}
