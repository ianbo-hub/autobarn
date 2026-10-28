/**
 * app/api/newsletter/route.ts
 *
 * Thin HTTP adapter — all business logic lives in the service layer.
 *
 * POST /api/newsletter
 *   Validates the request body, delegates to newsletter.service,
 *   and returns an appropriate JSON response.
 */

import { NextRequest }                         from 'next/server'
import { newsletterSchema }                    from '@/lib/validations'
import { subscribeToNewsletter }               from '@/lib/services/newsletter.service'
import { parseJsonBody, ok, unprocessable,
         tooManyRequests, internalError,
         methodNotAllowed }                    from '@/lib/infrastructure/http'
import { getClientIp, rateLimitKey }           from '@/lib/utils'
import { logger }                              from '@/lib/logger'

export async function POST(req: NextRequest) {
  // 1. Parse body
  const parsed = await parseJsonBody(req)
  if (parsed.error) return parsed.error

  // 2. Validate
  const result = newsletterSchema.safeParse(parsed.data)
  if (!result.success) {
    return unprocessable('Please provide a valid email.')
  }

  // 3. Run business logic
  const ip    = getClientIp(req)
  const rlKey = rateLimitKey(ip, 'newsletter')

  try {
    const outcome = await subscribeToNewsletter(result.data, rlKey)

    if (!outcome.ok) {
      if (outcome.status === 429) return tooManyRequests(outcome.error)
      return internalError(outcome.error)
    }

    return ok(null)
  } catch (err) {
    logger.error('newsletter', 'Unexpected error', err)
    return internalError()
  }
}

export async function GET() {
  return methodNotAllowed()
}
