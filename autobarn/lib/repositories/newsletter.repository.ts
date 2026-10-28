/**
 * lib/repositories/newsletter.repository.ts
 *
 * All Supabase operations for the newsletter_subscribers table.
 */

import { createServerClient } from '@/lib/supabase/server'

// ─── Mutations ────────────────────────────────────────────────

/** Upserts a subscriber by email (idempotent). */
export async function upsertSubscriber(email: string, source: string): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email, source }, { onConflict: 'email' })

  if (error) throw error
}
