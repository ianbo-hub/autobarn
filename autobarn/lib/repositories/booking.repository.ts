/**
 * lib/repositories/booking.repository.ts
 *
 * All Supabase operations for the bookings table.
 * Routes and services never import @supabase/ssr directly — they go through here.
 */

import { createServerClient } from '@/lib/supabase/server'
import type { BookingSchema } from '@/lib/validations'

// ─── Types ────────────────────────────────────────────────────

export interface BookingRow {
  id: string
}

// ─── Queries ──────────────────────────────────────────────────

/**
 * Returns true when an active booking already exists for this
 * email + type + date combination (duplicate guard).
 */
export async function bookingExists(
  email:        string,
  bookingType:  string,
  preferredDate: string,
): Promise<boolean> {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('bookings')
    .select('id')
    .eq('email',          email)
    .eq('booking_type',   bookingType)
    .eq('preferred_date', preferredDate)
    .in('status', ['pending', 'confirmed'])
    .maybeSingle()
  return !!data
}

// ─── Mutations ────────────────────────────────────────────────

/** Inserts a new booking row and returns the generated id. */
export async function insertBooking(data: BookingSchema): Promise<BookingRow> {
  const supabase = await createServerClient()
  const { data: row, error } = await supabase
    .from('bookings')
    .insert({
      first_name:       data.firstName,
      last_name:        data.lastName,
      email:            data.email,
      phone:            data.phone,
      booking_type:     data.bookingType,
      vehicle_interest: data.vehicleInterest ?? null,
      preferred_date:   data.preferredDate,
      preferred_time:   data.preferredTime   ?? null,
      message:          data.message         ?? null,
    })
    .select('id')
    .single()

  if (error) throw error
  return row as BookingRow
}
