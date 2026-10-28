import { z } from 'zod'

const phone = z.string()
  .min(7, 'Phone number too short')
  .max(20, 'Phone number too long')
  .regex(/^[\d\s\+\-\(\)]+$/, 'Invalid phone number')

const name = (field: string) =>
  z.string().min(1, `${field} is required`).max(80, `${field} is too long`)

// ─── BOOKING FORM ─────────────────────────────────────────────

export const bookingSchema = z.object({
  firstName:       name('First name'),
  lastName:        name('Last name'),
  email:           z.string().email('Invalid email address'),
  phone,
  bookingType:     z.enum(['test_drive', 'car_wash', 'detailing', 'enquiry']),
  vehicleInterest: z.string().max(200).optional(),
  preferredDate:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  preferredTime:   z.string().optional(),
  message:         z.string().max(2000).optional(),
  // Kenya DPA 2019 — explicit consent for data processing
  consentToProcess: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to our Privacy Policy to submit this form.' }),
  }),
})

export type BookingSchema = z.infer<typeof bookingSchema>

// ─── ENQUIRY FORM ─────────────────────────────────────────────

export const enquirySchema = z.object({
  firstName: name('First name'),
  lastName:  name('Last name'),
  email:     z.string().email('Invalid email address'),
  phone:     phone.optional(),
  subject:   z.string().min(2, 'Subject too short').max(200, 'Subject too long'),
  message:   z.string().min(10, 'Message too short').max(5000, 'Message too long'),
  // Kenya DPA 2019 — explicit consent for data processing
  consentToProcess: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to our Privacy Policy to submit this form.' }),
  }),
})

export type EnquirySchema = z.infer<typeof enquirySchema>

// ─── NEWSLETTER ───────────────────────────────────────────────

export const newsletterSchema = z.object({
  email:  z.string().email('Invalid email address'),
  source: z.string().optional(),
  // Kenya DPA 2019 — explicit consent for marketing emails
  consentToMarket: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to receive marketing emails to subscribe.' }),
  }),
})

export type NewsletterSchema = z.infer<typeof newsletterSchema>
