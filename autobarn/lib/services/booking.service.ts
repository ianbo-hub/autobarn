/**
 * lib/services/booking.service.ts
 *
 * Business logic for booking creation.
 * Orchestrates rate limiting → duplicate guard → DB insert → email dispatch.
 *
 * API routes call this function and only deal with HTTP concerns
 * (parsing bodies, returning responses). All business rules live here.
 */

import { InMemoryRateLimiter }                    from '@/lib/infrastructure/rate-limit'
import { bookingExists, insertBooking }            from '@/lib/repositories/booking.repository'
import { sendBookingConfirmation,
         sendBookingNotification }                 from '@/lib/email/booking'
import { logger }                                  from '@/lib/logger'
import type { BookingSchema }                      from '@/lib/validations'

// One limiter instance per server process — counters survive across requests.
const limiter = new InMemoryRateLimiter(3, 60_000) // 3 per minute per IP

// ─── Result type ──────────────────────────────────────────────

export type BookingServiceResult =
  | { ok: true;  bookingId: string }
  | { ok: false; status: 429; error: string }
  | { ok: false; status: 409; error: string }
  | { ok: false; status: 500; error: string }

// ─── Service function ─────────────────────────────────────────

export async function createBooking(
  data:           BookingSchema,
  rateLimitKey:   string,
): Promise<BookingServiceResult> {

  // 1. Rate limit
  if (limiter.isLimited(rateLimitKey)) {
    return {
      ok:     false,
      status: 429,
      error:  'Too many requests. Please wait a minute and try again.',
    }
  }

  // 2. Duplicate guard
  const duplicate = await bookingExists(
    data.email,
    data.bookingType,
    data.preferredDate,
  )
  if (duplicate) {
    return {
      ok:     false,
      status: 409,
      error:  'You already have a booking of this type on that date. Check your email for details.',
    }
  }

  // 3. Persist
  const { id: bookingId } = await insertBooking(data)

  // 4. Fire-and-forget emails — don't block the HTTP response
  Promise.all([
    sendBookingConfirmation(data),
    sendBookingNotification(data, bookingId),
  ]).catch(err =>
    logger.error('booking.service', 'Email send failed', err, { bookingId }),
  )

  return { ok: true, bookingId }
}
