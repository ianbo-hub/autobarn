'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to an error reporting service here if needed
    console.error(error)
  }, [error])

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] page-wrap text-center">
      <p className="mono-label text-red mb-4">Something went wrong</p>
      <h1 className="mb-4">An error occurred</h1>
      <p className="text-grey-600 mb-10 max-w-md">
        We&apos;re sorry — something went wrong on our end. Please try again.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-secondary">
          Go home
        </Link>
      </div>
    </main>
  )
}
