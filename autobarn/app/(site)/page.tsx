import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { sanityFetch } from '@/lib/sanity/client'
import { vehicleListQuery } from '@/lib/sanity/queries'
import { VehicleCardSkeleton } from '@/components/ui/Skeleton'
import { VehicleCatalogue } from '@/components/vehicles/VehicleCatalogue'
import { QuoteForm } from '@/components/ui/QuoteForm'
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

      {/* Content */}
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
          <Link href="#quote" className="btn btn-secondary border-cream text-cream hover:bg-cream hover:text-ink py-4 px-8">
            Request a quote
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── PARTNERS BANNER ──────────────────────────────────────────
const PARTNERS = [
  { name: 'KCB Bank',               category: 'Financing'  },
  { name: 'Equity Bank',            category: 'Financing'  },
  { name: 'Standard Chartered',     category: 'Financing'  },
  { name: 'Stanbic Bank',           category: 'Financing'  },
  { name: 'Jubilee Insurance',      category: 'Insurance'  },
  { name: 'APA Insurance',          category: 'Insurance'  },
]

function PartnersBanner() {
  return (
    <div className="bg-ink text-cream border-y border-[#222] overflow-hidden">
      <div className="page-wrap py-6">
        <p className="mono-label text-grey-600 text-center mb-5 tracking-widest text-[10px]">
          TRUSTED PARTNERS
        </p>
        <ul
          role="list"
          className="flex flex-wrap justify-center md:justify-between items-center gap-x-10 gap-y-4"
        >
          {PARTNERS.map(({ name, category }) => (
            <li key={name} className="flex flex-col items-center gap-1">
              <span className="font-display font-bold text-sm uppercase tracking-tight text-cream/90">
                {name}
              </span>
              <span className="mono-label text-[9px] text-grey-600 tracking-widest">
                {category}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
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

// ─── QUOTE SECTION ────────────────────────────────────────────
function QuoteSection() {
  return (
    <section id="quote" className="section page-wrap border-t border-rule">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <p className="eyebrow">Get a quote</p>
          <h2 className="mb-4">Tell us what you need.</h2>
          <p className="text-grey-600 leading-relaxed max-w-md">
            Share your requirements and budget and we'll find you the best match from
            our stock — or source it directly from Japan.
          </p>
          <ul className="mt-8 flex flex-col gap-3 text-sm text-grey-600">
            {[
              'Response within 24 hours',
              'No-obligation quote',
              'Finance pre-qualification available',
              'Trade-in valuations welcome',
            ].map(item => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-4 h-4 border border-ink flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5" stroke="currentColor" strokeWidth="2">
                    <path d="M2 6l3 3 5-5"/>
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-rule p-8">
          <QuoteForm />
        </div>
      </div>
    </section>
  )
}

// ─── REVIEWS SECTION ─────────────────────────────────────────
function ReviewsSection() {
  // Reviews will be populated from Google Business / Sanity
  return (
    <section className="section page-wrap border-t border-rule bg-cream">
      <p className="eyebrow">Reviews</p>
      <h2 className="mb-12">What our customers say</h2>

      {/* Empty state — reviews to be added */}
      <div className="flex items-center justify-center py-16 border border-dashed border-rule">
        <p className="mono-label text-grey-400">Customer reviews coming soon.</p>
      </div>
    </section>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnersBanner />
      <VehiclesSection />
      <QuoteSection />
      <ReviewsSection />
    </>
  )
}
