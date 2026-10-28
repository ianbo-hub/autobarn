/**
 * app/api/enquiries/route.ts
 *
 * Thin HTTP adapter — all business logic lives in the service layer.
 *
 * POST /api/enquiries
 *   Validates the request body, delegates to enquiry.service,
 *   and returns an appropriate JSON response.
 */

import { NextRequest }                          from 'next/server'
import { enquirySchema }                        from '@/lib/validations'
import { createEnquiry }                        from '@/lib/services/enquiry.service'
import { parseJsonBody, created, unprocessable,
         tooManyRequests, internalError,
         methodNotAllowed }                     from '@/lib/infrastructure/http'
import { getClientIp, rateLimitKey }            from '@/lib/utils'
import { logger }                               from '@/lib/logger'

export async function POST(req: NextRequest) {
  // 1. Parse body
  const parsed = await parseJsonBody(req)
  if (parsed.error) return parsed.error

  // 2. Validate
  const result = enquirySchema.safeParse(parsed.data)
  if (!result.success) {
    return unprocessable('Validation failed.', result.error.flatten().fieldErrors)
  }

  // 3. Run business logic
  const ip    = getClientIp(req)
  const rlKey = rateLimitKey(ip, 'enquiry')

  try {
    const outcome = await createEnquiry(result.data, rlKey)

    if (!outcome.ok) {
      if (outcome.status === 429) return tooManyRequests(outcome.error)
      return internalError(outcome.error)
    }

    return created({ id: outcome.enquiryId })
  } catch (err) {
    logger.error('enquiries', 'Unexpected error', err)
    return internalError()
  }
}

export async function GET() {
  return methodNotAllowed()
}
