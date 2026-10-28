/**
 * lib/services/enquiry.service.ts
 *
 * Business logic for enquiry creation.
 * Orchestrates rate limiting → DB insert → email dispatch.
 */

import { InMemoryRateLimiter }       from '@/lib/infrastructure/rate-limit'
import { insertEnquiry }             from '@/lib/repositories/enquiry.repository'
import { sendEnquiryNotification }   from '@/lib/email/enquiry'
import { logger }                    from '@/lib/logger'
import type { EnquirySchema }        from '@/lib/validations'

const limiter = new InMemoryRateLimiter(5, 60_000) // 5 per minute per IP

// ─── Result type ──────────────────────────────────────────────

export type EnquiryServiceResult =
  | { ok: true;  enquiryId: string }
  | { ok: false; status: 429; error: string }
  | { ok: false; status: 500; error: string }

// ─── Service function ─────────────────────────────────────────

export async function createEnquiry(
  data:         EnquirySchema,
  rateLimitKey: string,
): Promise<EnquiryServiceResult> {

  // 1. Rate limit
  if (limiter.isLimited(rateLimitKey)) {
    return { ok: false, status: 429, error: 'Too many requests. Please wait a minute.' }
  }

  // 2. Persist
  const { id: enquiryId } = await insertEnquiry(data)

  // 3. Fire-and-forget email
  sendEnquiryNotification(data, enquiryId)
    .catch(err =>
      logger.error('enquiry.service', 'Email send failed', err, { enquiryId }),
    )

  return { ok: true, enquiryId }
}
