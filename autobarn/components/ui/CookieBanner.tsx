'use client'

/**
 * components/ui/CookieBanner.tsx
 *
 * Cookie consent banner.  Stores the user's choice in localStorage under
 * the key 'cookie_consent' with value 'accepted' | 'declined'.
 *
 * Usage: render once in the site layout (app/(site)/layout.tsx).
 * The banner is suppressed until the JS hydrates, so there is no flash on
 * subsequent visits.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'cookie_consent'
type Consent = 'accepted' | 'declined' | null

/** Read the stored consent value, returning null on any error */
function readConsent(): Consent {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'accepted' || v === 'declined') return v
  } catch {
    // localStorage blocked (private window, etc.)
  }
  return null
}

/** Persist the consent choice, ignoring errors */
function writeConsent(value: 'accepted' | 'declined'): void {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // ignore
  }
}

export function CookieBanner() {
  // null = unknown (banner hidden until we've checked storage)
  const [consent, setConsent] = useState<Consent>(null)
  const [visible, setVisible] = useState(false)

  // After hydration: check storage.  If there's no stored choice, show the banner.
  useEffect(() => {
    const stored = readConsent()
    if (stored === null) {
      // Small delay avoids flash on initial page render
      const timer = setTimeout(() => setVisible(true), 600)
      return () => clearTimeout(timer)
    }
    setConsent(stored)
  }, [])

  const handleAccept = () => {
    writeConsent('accepted')
    setConsent('accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    writeConsent('declined')
    setConsent('declined')
    setVisible(false)
  }

  if (!visible || consent !== null) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className={[
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-ink text-cream border-t border-[#333]',
        'transition-transform duration-300',
        visible ? 'translate-y-0' : 'translate-y-full',
      ].join(' ')}
    >
      <div className="page-wrap py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
        {/* Text */}
        <p className="text-sm text-grey-400 flex-1 leading-relaxed">
          We use cookies to keep our site working and to understand how you use it.{' '}
          <Link href="/cookie-policy" className="text-cream underline underline-offset-2 hover:text-red transition-colors">
            Cookie Policy
          </Link>
          {' '}·{' '}
          <Link href="/privacy-policy" className="text-cream underline underline-offset-2 hover:text-red transition-colors">
            Privacy Policy
          </Link>
        </p>

        {/* Buttons */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="btn btn-secondary text-xs px-4 py-2 min-h-0"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="btn btn-red text-xs px-4 py-2 min-h-0"
          >
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Utility hook — use in analytics/tracking code to check consent before
 * sending any non-essential data.
 *
 * Example:
 *   const consented = useCookieConsent()
 *   if (consented) { initGoogleAnalytics() }
 */
export function useCookieConsent(): boolean {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    setConsented(readConsent() === 'accepted')
  }, [])

  return consented
}
