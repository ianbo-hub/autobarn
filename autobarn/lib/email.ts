/**
 * lib/email.ts  (barrel re-export — preserved for backward compatibility)
 *
 * Email logic has been split into domain modules under lib/email/:
 *   lib/email/base.ts     — shared client, constants, sendWithTimeout
 *   lib/email/booking.ts  — booking confirmation + staff notification
 *   lib/email/enquiry.ts  — enquiry staff notification
 *
 * Any code that still imports from '@/lib/email' continues to work.
 */

export { sendBookingConfirmation, sendBookingNotification } from '@/lib/email/booking'
export { sendEnquiryNotification }                          from '@/lib/email/enquiry'
export { resend, FROM, TEAM, sendWithTimeout }              from '@/lib/email/base'
