/**
 * lib/email/booking.ts
 *
 * Transactional email templates for booking events:
 *  - sendBookingConfirmation  → to the customer
 *  - sendBookingNotification  → to the AutoBarn team
 */

import { FROM, TEAM, sendWithTimeout } from './base'
import { htmlEscape } from '@/lib/sanitize'
import { formatDate, BOOKING_TYPE_LABELS } from '@/lib/formatting'
import type { BookingSchema } from '@/lib/validations'

// ─── Customer confirmation ────────────────────────────────────

export async function sendBookingConfirmation(data: BookingSchema): Promise<void> {
  const serviceLabel = BOOKING_TYPE_LABELS[data.bookingType] ?? data.bookingType

  await sendWithTimeout({
    from:    FROM,
    to:      data.email,
    subject: `Booking Confirmed — ${serviceLabel} · AutoBarn`,
    html: `
      <div style="font-family:Georgia,serif;max-width:580px;margin:0 auto;color:#111">
        <div style="border-bottom:2px solid #111;padding-bottom:16px;margin-bottom:32px">
          <span style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em">
            Auto<span style="color:#E61919">Barn</span>
          </span>
        </div>
        <h1 style="font-size:28px;font-weight:700;margin:0 0 8px">Booking Received</h1>
        <p style="color:#555;margin:0 0 32px">
          We've received your ${htmlEscape(serviceLabel.toLowerCase())} request
          and will confirm shortly.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr style="border-bottom:1px solid #ccc">
            <td style="padding:10px 0;color:#9a9a9a;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">Name</td>
            <td style="padding:10px 0">${htmlEscape(data.firstName)} ${htmlEscape(data.lastName)}</td>
          </tr>
          <tr style="border-bottom:1px solid #ccc">
            <td style="padding:10px 0;color:#9a9a9a;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">Service</td>
            <td style="padding:10px 0">${htmlEscape(serviceLabel)}</td>
          </tr>
          <tr style="border-bottom:1px solid #ccc">
            <td style="padding:10px 0;color:#9a9a9a;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">Date</td>
            <td style="padding:10px 0">${htmlEscape(formatDate(data.preferredDate))}</td>
          </tr>
          ${data.vehicleInterest ? `
          <tr style="border-bottom:1px solid #ccc">
            <td style="padding:10px 0;color:#9a9a9a;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">Vehicle</td>
            <td style="padding:10px 0">${htmlEscape(data.vehicleInterest)}</td>
          </tr>` : ''}
        </table>
        <p style="margin-top:32px;color:#555;font-size:13px">
          Our team will call you on <strong>${htmlEscape(data.phone)}</strong> to confirm.
          Reply to this email with any questions.
        </p>
        <div style="border-top:1px solid #ccc;margin-top:48px;padding-top:16px;font-size:11px;color:#9a9a9a;font-family:monospace">
          AutoBarn · Nairobi, Kenya · autobarn.co.ke
        </div>
      </div>
    `,
  })
}

// ─── Staff notification ───────────────────────────────────────

export async function sendBookingNotification(data: BookingSchema, bookingId: string): Promise<void> {
  const serviceLabel = BOOKING_TYPE_LABELS[data.bookingType] ?? data.bookingType

  await sendWithTimeout({
    from:    FROM,
    to:      TEAM,
    subject: `[Booking] ${serviceLabel} — ${data.firstName} ${data.lastName}`,
    html: `
      <div style="font-family:monospace;max-width:580px;margin:0 auto;font-size:13px;color:#111">
        <h2 style="font-family:Georgia,serif;font-size:20px;margin:0 0 24px">
          New ${htmlEscape(serviceLabel)} Booking
        </h2>
        <p><strong>ID:</strong> ${htmlEscape(bookingId)}</p>
        <p><strong>Name:</strong> ${htmlEscape(data.firstName)} ${htmlEscape(data.lastName)}</p>
        <p><strong>Email:</strong> <a href="mailto:${htmlEscape(data.email)}">${htmlEscape(data.email)}</a></p>
        <p><strong>Phone:</strong> <a href="tel:${htmlEscape(data.phone)}">${htmlEscape(data.phone)}</a></p>
        <p><strong>Date:</strong> ${htmlEscape(formatDate(data.preferredDate))} ${htmlEscape(data.preferredTime ?? '')}</p>
        ${data.vehicleInterest ? `<p><strong>Vehicle:</strong> ${htmlEscape(data.vehicleInterest)}</p>` : ''}
        ${data.message ? `<p><strong>Message:</strong><br>${htmlEscape(data.message).replace(/\n/g, '<br>')}</p>` : ''}
      </div>
    `,
  })
}
