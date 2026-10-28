import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { sanityFetch } from '@/lib/sanity/client'
import { vehicleListQuery } from '@/lib/sanity/queries'
import { VehicleCardSkeleton } from '@/components/ui/Skeleton'
import { NoVehiclesState } from '@/components/ui/EmptyState'
import { VehicleCatalogue } from '@/components/vehicles/VehicleCatalogue'
import { formatPrice } from '@/lib/utils'
import type { Vehicle } from '@/types'

export const metadata: Metadata = {
  title: 'AutoBarn — Premium Vehicles, Nairobi',
  description: 'Browse quality used and new vehicles at AutoBarn Nairobi. Affordable prices, professional inspection on every car.',
}

// ─── HERO ─────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative w-full h-[92vh] min-h-[560px] overflow-hidden"
    >
      {/* Background — video preferred; falls back to image */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        poster="/images/hero-poster.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink/80"
      />

      {/* Parallax content */}
      <div className="relative h-full flex flex-col justify-end page-wrap pb-16 md:pb-24">
        <p className="eyebrow text-cream/70 mb-4">
          Premium Dealership — Nairobi, Kenya
        </p>
        <h1 className="text-cream leading-none mb-8 max-w-3xl">
          The car you deserve is here.
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="#catalogue" className="btn btn-red text-base py-4 px-8">
            Browse vehicles
          </Link>
          <Link href="/contact" className="btn btn-secondary border-cream text-cream hover:bg-cream hover:text-ink py-4 px-8">
            Request a quote
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── CATALOGUE SECTION ────────────────────────────────────────
async function VehiclesSection() {
  let vehicles: Vehicle[] = []
  try {
    vehicles = await sanityFetch<Vehicle[]>({
      query:     vehicleListQuery,
      tags:      ['vehicles'],
      revalidate: 60,
    })
  } catch {
    // Fail silently — show empty state
  }

  return (
    <section id="catalogue" className="section page-wrap">
      <p className="eyebrow">Our Stock</p>
      <h2 className="mb-12">Browse vehicles</h2>

      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
        </div>
      }>
        <VehicleCatalogue initialVehicles={vehicles} />
      </Suspense>
    </section>
  )
}

// ─── BANNER BAR ───────────────────────────────────────────────
function TrustBanner() {
  const items = [
    { icon: '✓', text: 'Fully inspected'                                 },
    { icon: '✓', text: 'Logbook included'                                },
    { icon: '✓', text: '7-day return guarantee', href: '/terms#returns'  },
    { icon: '✓', text: 'Finance options available'                       },
  ]

  return (
    <div className="bg-ink text-cream border-y border-[#222]">
      <div className="page-wrap py-5">
        <ul
          role="list"
          className="flex flex-wrap justify-center md:justify-between gap-x-10 gap-y-3"
        >
          {items.map(({ icon, text, href }) => (
            <li key={text} className="flex items-center gap-2 mono-label text-grey-400">
              <span className="text-green text-sm">{icon}</span>
              {href ? (
                <a href={href} className="underline-offset-2 hover:underline hover:text-cream transition-colors">
                  {text}
                </a>
              ) : text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBanner />
      <VehiclesSection />
    </>
  )
}
