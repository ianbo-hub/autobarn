/**
 * lib/email/enquiry.ts
 *
 * Transactional email templates for enquiry events:
 *  - sendEnquiryNotification  → to the AutoBarn team
 */

import { FROM, TEAM, sendWithTimeout } from './base'
import { htmlEscape } from '@/lib/sanitize'
import type { EnquirySchema } from '@/lib/validations'

// ─── Staff notification ───────────────────────────────────────

export async function sendEnquiryNotification(data: EnquirySchema, enquiryId: string): Promise<void> {
  await sendWithTimeout({
    from:    FROM,
    to:      TEAM,
    subject: `[Enquiry] ${data.subject} — ${data.firstName} ${data.lastName}`,
    html: `
      <div style="font-family:monospace;max-width:580px;margin:0 auto;font-size:13px;color:#111">
        <h2 style="font-family:Georgia,serif;font-size:20px;margin:0 0 24px">New Enquiry</h2>
        <p><strong>ID:</strong> ${htmlEscape(enquiryId)}</p>
        <p><strong>Name:</strong> ${htmlEscape(data.firstName)} ${htmlEscape(data.lastName)}</p>
        <p><strong>Email:</strong> <a href="mailto:${htmlEscape(data.email)}">${htmlEscape(data.email)}</a></p>
        ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${htmlEscape(data.phone)}">${htmlEscape(data.phone)}</a></p>` : ''}
        <p><strong>Subject:</strong> ${htmlEscape(data.subject)}</p>
        <p><strong>Message:</strong><br>${htmlEscape(data.message).replace(/\n/g, '<br>')}</p>
      </div>
    `,
  })
}
