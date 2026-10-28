/**
 * lib/formatting.ts
 *
 * Pure display-formatting utilities: currencies, numbers, dates, labels.
 * No network, no side effects — safe to import from both server and client.
 */

// ─── Currency / Numbers ───────────────────────────────────────

/** Format a number as KES currency, e.g. 2 500 000 → "KES 2,500,000" */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style:                 'currency',
    currency:              'KES',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format a kilometre value with commas, e.g. 12500 → "12,500 km" */
export function formatMileage(km: number): string {
  return new Intl.NumberFormat('en-KE').format(km) + ' km'
}

/** Truncate text to n characters, appending an ellipsis when truncated */
export function truncate(text: string, n: number): string {
  return text.length > n ? text.slice(0, n).trimEnd() + '…' : text
}

// ─── Dates ────────────────────────────────────────────────────

/** Format an ISO date string for display, e.g. "1 January 2025" */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-KE', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  }).format(new Date(iso))
}

// ─── Domain label dictionaries ────────────────────────────────

export const FUEL_LABELS: Record<string, string> = {
  petrol:   'Petrol',
  diesel:   'Diesel',
  hybrid:   'Hybrid',
  electric: 'Electric',
}

export const TRANSMISSION_LABELS: Record<string, string> = {
  automatic: 'Automatic',
  manual:    'Manual',
}

export const BOOKING_TYPE_LABELS: Record<string, string> = {
  test_drive: 'Test Drive',
  car_wash:   'Car Wash',
  detailing:  'Detailing',
  enquiry:    'General Enquiry',
}
