'use client'

/**
 * app/(site)/data-deletion/page.tsx
 *
 * Data subject request form — right to erasure under Kenya DPA 2019.
 * Submits to /api/data-deletion which sends an email to the privacy team.
 */

import { useState } from 'react'
import Link from 'next/link'

type RequestType = 'erasure' | 'access' | 'correction' | 'other'

const REQUEST_TYPES: { value: RequestType; label: string; description: string }[] = [
  {
    value: 'erasure',
    label: 'Delete my data',
    description: 'Request that AutoBarn erases all personal data held about you.',
  },
  {
    value: 'access',
    label: 'Access my data',
    description: 'Request a copy of the personal data AutoBarn holds about you.',
  },
  {
    value: 'correction',
    label: 'Correct my data',
    description: 'Ask AutoBarn to correct inaccurate personal data.',
  },
  {
    value: 'other',
    label: 'Other request',
    description: 'Any other data protection request or question.',
  },
]

export default function DataDeletionPage() {
  const [name,        setName]        = useState('')
  const [email,       setEmail]       = useState('')
  const [requestType, setRequestType] = useState<RequestType>('erasure')
  const [details,     setDetails]     = useState('')
  const [loading,     setLoading]     = useState(false)
  const [status,      setStatus]      = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg,    setErrorMsg]    = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setStatus('idle')

    try {
      const res = await fetch('/api/data-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, requestType, details }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Submission failed')
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="bg-ink text-cream section page-wrap">
        <p className="eyebrow text-grey-600">Your Rights</p>
        <h1 className="text-cream">Data Request</h1>
        <p className="text-grey-400 mt-6 max-w-lg">
          Under the Kenya Data Protection Act 2019, you have the right to access, correct, or request
          deletion of your personal data. Use this form to submit a request.
        </p>
      </section>

      <section className="section page-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Form */}
          <div>
            {status === 'success' ? (
              <div className="border border-rule p-8 bg-cream">
                <p className="mono-label text-green mb-2">✓ Request submitted</p>
                <h2 className="mb-4">We've received your request.</h2>
                <p className="text-grey-600 text-sm leading-relaxed">
                  We will respond to your data request within{' '}
                  <strong className="text-ink">30 days</strong> as required by the Kenya DPA 2019.
                  A confirmation has been sent to the email address you provided.
                </p>
                <p className="text-grey-600 text-sm mt-4">
                  Questions? Email{' '}
                  <a href="mailto:privacy@autobarn.co.ke" className="text-red hover:underline">
                    privacy@autobarn.co.ke
                  </a>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                {/* Full name */}
                <div>
                  <label htmlFor="ddr-name" className="label">Full name *</label>
                  <input
                    id="ddr-name"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input"
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="ddr-email" className="label">Email address *</label>
                  <input
                    id="ddr-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input"
                    autoComplete="email"
                  />
                </div>

                {/* Request type */}
                <fieldset>
                  <legend className="label mb-3">Type of request *</legend>
                  <div className="flex flex-col gap-3">
                    {REQUEST_TYPES.map(({ value, label, description }) => (
                      <label
                        key={value}
                        className={[
                          'flex gap-3 p-4 border cursor-pointer transition-colors',
                          requestType === value
                            ? 'border-ink bg-grey-100'
                            : 'border-rule hover:border-grey-600',
                        ].join(' ')}
                      >
                        <input
                          type="radio"
                          name="requestType"
                          value={value}
                          checked={requestType === value}
                          onChange={() => setRequestType(value)}
                          className="mt-0.5 flex-shrink-0 accent-red"
                        />
                        <span>
                          <span className="block text-sm font-bold text-ink">{label}</span>
                          <span className="block text-xs text-grey-600 mt-0.5">{description}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Details */}
                <div>
                  <label htmlFor="ddr-details" className="label">
                    Additional details
                    <span className="text-grey-400 font-normal ml-1">(optional)</span>
                  </label>
                  <textarea
                    id="ddr-details"
                    rows={4}
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    placeholder="Any relevant details about your request…"
                    className="input resize-none"
                  />
                </div>

                {/* Error */}
                {status === 'error' && (
                  <p className="text-red text-sm" role="alert">{errorMsg}</p>
                )}

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    disabled={loading || !name.trim() || !email.trim()}
                    className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting…' : 'Submit request'}
                  </button>
                  <p className="mt-3 text-xs text-grey-400">
                    We will respond within 30 days. Fields marked * are required.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <div className="flex flex-col gap-6">
            <div className="border border-rule p-6">
              <p className="eyebrow mb-3">Your rights</p>
              <ul className="flex flex-col gap-3 text-sm text-grey-600">
                {[
                  ['Right to erasure', 'Ask us to delete your personal data.'],
                  ['Right of access', 'Get a copy of the data we hold.'],
                  ['Right to rectification', 'Correct inaccurate information.'],
                  ['Right to object', 'Object to direct marketing at any time.'],
                  ['Right to portability', 'Receive your data in a portable format.'],
                ].map(([right, desc]) => (
                  <li key={right} className="border-b border-rule pb-3 last:border-0 last:pb-0">
                    <span className="block font-bold text-ink text-xs font-mono uppercase tracking-wider">{right}</span>
                    <span className="text-xs mt-0.5">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-rule p-6 bg-grey-100">
              <p className="eyebrow mb-2">Response time</p>
              <p className="text-sm text-grey-600">
                Under the Kenya Data Protection Act 2019, we are required to respond to data subject
                requests within <strong className="text-ink">30 days</strong>.
              </p>
              <p className="text-sm text-grey-600 mt-3">
                You also have the right to lodge a complaint with the{' '}
                <strong className="text-ink">Office of the Data Protection Commissioner (ODPC)</strong> at{' '}
                <a
                  href="https://www.odpc.go.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red hover:underline"
                >
                  odpc.go.ke
                </a>.
              </p>
            </div>

            <p className="text-xs text-grey-400">
              See also:{' '}
              <Link href="/privacy-policy" className="text-red hover:underline">Privacy Policy</Link>
              {' '}·{' '}
              <Link href="/cookie-policy" className="text-red hover:underline">Cookie Policy</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
