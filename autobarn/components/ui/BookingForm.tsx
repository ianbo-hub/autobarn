'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookingSchema } from '@/lib/validations'
import { useToast } from './ToastContext'
import type { BookingFormData } from '@/types'

const SUBMIT_TIMEOUT_MS = 30_000 // 30 s — give up if server is unresponsive

interface BookingFormProps {
  vehicleInterest?: string
  defaultType?: BookingFormData['bookingType']
  onSuccess?: () => void
}

const BOOKING_TYPES = [
  { value: 'test_drive',   label: 'Test Drive'    },
  { value: 'car_wash',     label: 'Car Wash'      },
  { value: 'detailing',    label: 'Detailing'     },
  { value: 'enquiry',      label: 'General Enquiry' },
] as const

export function BookingForm({ vehicleInterest, defaultType = 'test_drive', onSuccess }: BookingFormProps) {
  const toast          = useToast()
  const [loading, setLoading] = useState(false)
  // Prevents double-submit: if a request is already in-flight we bail out immediately.
  const inflightRef    = useRef(false)
  const abortRef       = useRef<AbortController | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      bookingType:     defaultType,
      vehicleInterest: vehicleInterest ?? '',
    },
  })

  const bookingType = watch('bookingType')

  const onSubmit = async (data: BookingFormData) => {
    // Hard guard: React's synthetic event de-duplication is not enough
    // when the user rapidly taps the button before the state re-render.
    if (inflightRef.current) return
    inflightRef.current = true

    // Abort any stale controller from a previous attempt
    abortRef.current?.abort()
    const controller     = new AbortController()
    abortRef.current     = controller

    // Auto-cancel if the server hasn't responded in SUBMIT_TIMEOUT_MS
    const timer = setTimeout(() => controller.abort('timeout'), SUBMIT_TIMEOUT_MS)

    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
        signal:  controller.signal,
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error ?? 'Something went wrong')

      toast('Booking request received — we\'ll confirm via email shortly.', 'success')
      reset()
      onSuccess?.()
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        toast('Request timed out. Check your connection and try again.', 'error')
      } else {
        toast(err instanceof Error ? err.message : 'Failed to submit. Please try again.', 'error')
      }
    } finally {
      clearTimeout(timer)
      setLoading(false)
      inflightRef.current = false
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Booking form"
      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
    >
      {/* First name */}
      <div>
        <label htmlFor="bf-first" className="label">First name *</label>
        <input
          id="bf-first"
          type="text"
          autoComplete="given-name"
          className={`input ${errors.firstName ? 'error' : ''}`}
          {...register('firstName')}
        />
        {errors.firstName && (
          <p className="mt-1 text-red text-xs">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last name */}
      <div>
        <label htmlFor="bf-last" className="label">Last name *</label>
        <input
          id="bf-last"
          type="text"
          autoComplete="family-name"
          className={`input ${errors.lastName ? 'error' : ''}`}
          {...register('lastName')}
        />
        {errors.lastName && (
          <p className="mt-1 text-red text-xs">{errors.lastName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="bf-email" className="label">Email *</label>
        <input
          id="bf-email"
          type="email"
          autoComplete="email"
          className={`input ${errors.email ? 'error' : ''}`}
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-red text-xs">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="bf-phone" className="label">Phone *</label>
        <input
          id="bf-phone"
          type="tel"
          autoComplete="tel"
          placeholder="+254 7XX XXX XXX"
          className={`input ${errors.phone ? 'error' : ''}`}
          {...register('phone')}
        />
        {errors.phone && (
          <p className="mt-1 text-red text-xs">{errors.phone.message}</p>
        )}
      </div>

      {/* Booking type */}
      <div>
        <label htmlFor="bf-type" className="label">Service *</label>
        <select
          id="bf-type"
          className={`input ${errors.bookingType ? 'error' : ''}`}
          {...register('bookingType')}
        >
          {BOOKING_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {errors.bookingType && (
          <p className="mt-1 text-red text-xs">{errors.bookingType.message}</p>
        )}
      </div>

      {/* Vehicle interest */}
      <div>
        <label htmlFor="bf-vehicle" className="label">Vehicle of interest</label>
        <input
          id="bf-vehicle"
          type="text"
          placeholder="e.g. Toyota Land Cruiser 200"
          className="input"
          {...register('vehicleInterest')}
        />
      </div>

      {/* Preferred date */}
      <div>
        <label htmlFor="bf-date" className="label">Preferred date *</label>
        <input
          id="bf-date"
          type="date"
          min={new Date().toISOString().split('T')[0]}
          className={`input ${errors.preferredDate ? 'error' : ''}`}
          {...register('preferredDate')}
        />
        {errors.preferredDate && (
          <p className="mt-1 text-red text-xs">{errors.preferredDate.message}</p>
        )}
      </div>

      {/* Preferred time */}
      <div>
        <label htmlFor="bf-time" className="label">Preferred time</label>
        <select id="bf-time" className="input" {...register('preferredTime')}>
          <option value="">Any time</option>
          <option value="morning">Morning (8am – 12pm)</option>
          <option value="afternoon">Afternoon (12pm – 4pm)</option>
          <option value="late">Late (4pm – 6pm)</option>
        </select>
      </div>

      {/* Message — full width */}
      <div className="sm:col-span-2">
        <label htmlFor="bf-msg" className="label">Message</label>
        <textarea
          id="bf-msg"
          rows={4}
          placeholder="Any specific requirements or questions…"
          className="input resize-none"
          {...register('message')}
        />
      </div>

      {/* Age declaration — shown for test drives (Kenya requires 18+ driving licence) */}
      {bookingType === 'test_drive' && (
        <div className="sm:col-span-2 bg-grey-100 border border-rule p-4 text-xs text-grey-600">
          <strong className="text-ink">Test drives:</strong> You must hold a valid Kenya driving licence
          and be 18 years of age or older to participate in a test drive. AutoBarn reserves the right
          to verify your licence before the drive.
        </div>
      )}

      {/* Privacy consent — required under Kenya DPA 2019 */}
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 flex-shrink-0 w-4 h-4 border border-rule accent-red"
            {...register('consentToProcess')}
          />
          <span className="text-xs text-grey-600 leading-relaxed">
            I agree that AutoBarn may process my personal data to handle this booking request, in
            accordance with the{' '}
            <a href="/privacy-policy" className="text-red hover:underline" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>. *
          </span>
        </label>
        {errors.consentToProcess && (
          <p className="mt-1 text-red text-xs">{errors.consentToProcess.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-red w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending…' : 'Submit booking request'}
        </button>
        <p className="mt-3 text-xs text-grey-400">
          We respond within 24 hours. Fields marked * are required.
        </p>
      </div>
    </form>
  )
}
