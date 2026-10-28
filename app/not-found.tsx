import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] page-wrap text-center">
      <p className="mono-label text-red mb-4">404</p>
      <h1 className="mb-4">Page not found</h1>
      <p className="text-grey-600 mb-10 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="btn btn-primary">
          Browse vehicles
        </Link>
        <Link href="/contact" className="btn btn-secondary">
          Contact us
        </Link>
      </div>
    </main>
  )
}
