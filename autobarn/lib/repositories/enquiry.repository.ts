/**
 * lib/repositories/enquiry.repository.ts
 *
 * All Supabase operations for the enquiries table.
 */

import { createServerClient } from '@/lib/supabase/server'
import type { EnquirySchema } from '@/lib/validations'

// ─── Types ────────────────────────────────────────────────────

export interface EnquiryRow {
  id: string
}

// ─── Mutations ────────────────────────────────────────────────

/** Inserts a new enquiry row and returns the generated id. */
export async function insertEnquiry(data: EnquirySchema): Promise<EnquiryRow> {
  const supabase = await createServerClient()
  const { data: row, error } = await supabase
    .from('enquiries')
    .insert({
      first_name: data.firstName,
      last_name:  data.lastName,
      email:      data.email,
      phone:      data.phone ?? null,
      subject:    data.subject,
      message:    data.message,
    })
    .select('id')
    .single()

  if (error) throw error
  return row as EnquiryRow
}
