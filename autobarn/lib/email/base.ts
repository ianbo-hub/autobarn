/**
 * lib/email/base.ts
 *
 * Shared email infrastructure: Resend client, constants, and the
 * `sendWithTimeout` wrapper used by all domain email modules.
 */

import { Resend } from 'resend'
import { serverEnv } from '@/lib/env'
import { logger } from '@/lib/logger'

export const resend = new Resend(serverEnv.RESEND_API_KEY)
export const FROM   = serverEnv.RESEND_FROM_EMAIL
export const TEAM   = 'team@autobarn.co.ke'

const EMAIL_TIMEOUT_MS = 8_000

/**
 * Wraps a Resend send call with a hard timeout so a slow SMTP
 * handshake never blocks the API route response indefinitely.
 */
export async function sendWithTimeout(
  payload: Parameters<typeof resend.emails.send>[0],
): Promise<void> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Email send timed out')), EMAIL_TIMEOUT_MS),
  )
  const result = await Promise.race([resend.emails.send(payload), timeout])
  if (result && 'error' in result && result.error) {
    logger.error('email', 'Resend API error', result.error)
  }
}
