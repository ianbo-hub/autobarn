/**
 * lib/services/newsletter.service.ts
 *
 * Business logic for newsletter subscription.
 * Orchestrates rate limiting → upsert.
 */

import { InMemoryRateLimiter }  from '@/lib/infrastructure/rate-limit'
import { upsertSubscriber }     from '@/lib/repositories/newsletter.repository'
import type { NewsletterSchema } from '@/lib/validations'

const limiter = new InMemoryRateLimiter(2, 3_600_000) // 2 per hour per IP

// ─── Result type ──────────────────────────────────────────────

export type NewsletterServiceResult =
  | { ok: true }
  | { ok: false; status: 429; error: string }
  | { ok: false; status: 500; error: string }

// ─── Service function ─────────────────────────────────────────

export async function subscribeToNewsletter(
  data:         NewsletterSchema,
  rateLimitKey: string,
): Promise<NewsletterServiceResult> {

  // 1. Rate limit
  if (limiter.isLimited(rateLimitKey)) {
    return { ok: false, status: 429, error: 'Already subscribed or too many requests.' }
  }

  // 2. Persist (upsert is idempotent — re-subscribing is fine)
  await upsertSubscriber(data.email, data.source ?? 'website')

  return { ok: true }
}
