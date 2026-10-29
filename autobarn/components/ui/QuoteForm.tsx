'use client'

import { useState, useRef } from 'react'

export function QuoteForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const data = Object.fromEntries(new FormData(e.currentTarget))

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, subject: `Quote request — ${data.vehicle || 'general'}` }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
      formRef.current?.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="quote-name" className="label mb-1.5 block">Full name</label>
          <input
            id="quote-name"
            name="name"
            type="text"
            required
            placeholder="Jane Mwangi"
            className="input w-full"
          />
        </div>
        <div>
          <label htmlFor="quote-phone" className="label mb-1.5 block">Phone</label>
          <input
            id="quote-phone"
            name="phone"
            type="tel"
            required
            placeholder="+254 700 000 000"
            className="input w-full"
          />
        </div>
      </div>

      <div>
        <label htmlFor="quote-email" className="label mb-1.5 block">Email</label>
        <input
          id="quote-email"
          name="email"
          type="email"
          placeholder="jane@example.com"
          className="input w-full"
        />
      </div>

      <div>
        <label htmlFor="quote-vehicle" className="label mb-1.5 block">Vehicle of interest</label>
        <input
          id="quote-vehicle"
          name="vehicle"
          type="text"
          placeholder="e.g. Toyota Harrier 2022, or any SUV under 3M"
          className="input w-full"
        />
      </div>

      <div>
        <label htmlFor="quote-message" className="label mb-1.5 block">Additional details</label>
        <textarea
          id="quote-message"
          name="message"
          rows={4}
          placeholder="Budget, preferred colour, financing needed, trade-in…"
          className="input w-full resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending' || status === 'sent'}
        className="btn btn-red self-start py-3 px-8 disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent!' : 'Request a quote'}
      </button>

      {status === 'sent' && (
        <p className="text-sm text-grey-600">
          Thanks — we'll be in touch within 24 hours.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red">
          Something went wrong. Please call us or try again.
        </p>
      )}
    </form>
  )
}
