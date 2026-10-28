/**
 * app/api/data-deletion/route.ts
 *
 * Receives data subject requests (right to erasure, access, etc.)
 * and forwards them to the AutoBarn privacy team via email.
 *
 * Kenya Data Protection Act 2019 — right to erasure & data subject rights.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { htmlEscape } from '@/lib/sanitize'
import { getClientIp, rateLimitKey } from '@/lib/utils'
import { serverEnv } from '@/lib/env'
import { InMemoryRateLimiter } from '@/lib/infrastructure/rate-limit'
import { logger } from '@/lib/logger'

// ─── Validation ────────────────────────────────────────────────

const requestSchema = z.object({
  name:        z.string().min(1, 'Name is required').max(120),
  email:       z.string().email('Invalid email address'),
  requestType: z.enum(['erasure', 'access', 'correction', 'other']),
  details:     z.string().max(3000).optional(),
})

const REQUEST_TYPE_LABELS: Record<string, string> = {
  erasure:    'Delete my data (Right to Erasure)',
  access:     'Access my data (Right of Access)',
  correction: 'Correct my data (Right to Rectification)',
  other:      'Other data protection request',
}

// ─── Rate limiting ─────────────────────────────────────────────
// 3 requests per hour — data subject requests aren't frequent

const limiter = new InMemoryRateLimiter(3, 60 * 60 * 1_000)

// ─── Handler ───────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(req)
    if (limiter.isLimited(rateLimitKey(ip, 'data-deletion'))) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    // Parse + validate body
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid request.' },
        { status: 422 },
      )
    }

    const { name, email, requestType, details } = parsed.data
    const requestLabel = REQUEST_TYPE_LABELS[requestType] ?? requestType

    // Send email to privacy team
    const resend    = new Resend(serverEnv.RESEND_API_KEY)
    const fromEmail = serverEnv.RESEND_FROM_EMAIL

    await resend.emails.send({
      from:    fromEmail,
      to:      'privacy@autobarn.co.ke',
      reply_to: email,
      subject: `Data Subject Request — ${requestLabel}`,
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #ddd;">
          <h2 style="font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">
            Data Subject Request
          </h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 8px; color: #666; width: 40%;">Request type</td>
              <td style="padding: 10px 8px; font-weight: bold;">${htmlEscape(requestLabel)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 8px; color: #666;">Name</td>
              <td style="padding: 10px 8px;">${htmlEscape(name)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 8px; color: #666;">Email address</td>
              <td style="padding: 10px 8px;">${htmlEscape(email)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 8px; color: #666; vertical-align: top;">Details</td>
              <td style="padding: 10px 8px;">${
                details
                  ? htmlEscape(details).replace(/\n/g, '<br>')
                  : '<em style="color:#999;">None provided</em>'
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; color: #666;">Submitted at</td>
              <td style="padding: 10px 8px;">${new Date().toISOString()}</td>
            </tr>
          </table>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">
            This request was submitted via autobarn.co.ke/data-deletion.<br>
            Under Kenya DPA 2019, please respond within 30 days.
          </p>
        </div>
      `,
    })

    // Also send an acknowledgement to the requester
    await resend.emails.send({
      from:    fromEmail,
      to:      email,
      subject: 'AutoBarn — Data request received',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #ddd;">
          <h2 style="text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;">Request received</h2>
          <p>Hi ${htmlEscape(name)},</p>
          <p>We have received your data subject request: <strong>${htmlEscape(requestLabel)}</strong>.</p>
          <p>
            Under the Kenya Data Protection Act 2019, we will respond within <strong>30 days</strong>.
            If you have any questions in the meantime, reply to this email or contact us at
            <a href="mailto:privacy@autobarn.co.ke">privacy@autobarn.co.ke</a>.
          </p>
          <p style="margin-top: 24px; color: #666; font-size: 12px;">
            AutoBarn Ltd, Westlands, Nairobi, Kenya<br>
            <a href="https://autobarn.co.ke/privacy-policy" style="color: #e63333;">Privacy Policy</a>
          </p>
        </div>
      `,
    })

    logger.info('data-deletion', 'Data request received', { requestType, ip })

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err) {
    logger.error('data-deletion', 'Unexpected error', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 },
    )
  }
}
