import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity/client'
import { washServicesQuery } from '@/lib/sanity/queries'
import type { WashService } from '@/types'

export const metadata: Metadata = {
  title: 'Car Wash & Detailing',
  description: 'Professional car wash, full detailing, polishing, buffing and premium dry cleaning services in Nairobi.',
}

// ─── PRICING TABLE ────────────────────────────────────────────
const REGULAR = [
  { name: 'Engine Wash',     price: 'KES 1,500', includes: ['Steam clean engine bay', 'Degrease all surfaces', 'Rinse & dry'] },
  { name: 'Exterior Wash',   price: 'KES 800',   includes: ['Hand wash & rinse', 'Wheel cleaning', 'Window squeegee'] },
  { name: 'Interior Clean',  price: 'KES 1,200', includes: ['Vacuum all surfaces', 'Wipe dashboard & panels', 'Clean cup holders'] },
  { name: 'Tyre Gel',        price: 'KES 300',   includes: ['Apply tyre dressing', 'Sidewall protection'] },
  { name: 'Buffing',         price: 'KES 3,500', includes: ['Machine buff', 'Remove light scratches', 'Polish finish'] },
]

const PREMIUM: WashService[] = [
  {
    _id:         'premium_wax',
    tier:        'premium',
    name:        'Waxing & Polishing',
    description: 'Hand-applied carnauba wax for a deep, mirror-like shine with up to 3 months of paint protection.',
    price:       12000,
    duration:    '4–5 hours',
    includes:    ['Machine polish', 'Hand wax application', 'Paint sealant', 'Trim dressing', 'Window treatment'],
  },
  {
    _id:         'premium_detail',
    tier:        'premium_plus',
    name:        'Full Detailing',
    description: 'Comprehensive paint correction, interior deep-clean and paint protection — the complete package.',
    price:       25000,
    duration:    '6–8 hours',
    includes:    ['Clay bar decontamination', 'Two-stage paint correction', 'Ceramic coating prep', 'Full interior shampoo', 'Leather conditioning', 'Engine bay detail', 'Glass polishing'],
  },
  {
    _id:         'premium_dry',
    tier:        'premium',
    name:        'Dry Cleaning',
    description: 'Waterless wash using premium dry-clean solution — ideal for garage queens or eco-conscious owners.',
    price:       5000,
    duration:    '2–3 hours',
    includes:    ['Waterless wash solution', 'Microfibre buff', 'Interior vacuum', 'Dashboard protection'],
  },
]

export default async function WashDetailingPage() {
  // Try fetching live data; fall back to static data above
  let services: WashService[] = []
  try {
    services = await sanityFetch<WashService[]>({ query: washServicesQuery, tags: ['wash'] })
  } catch {
    services = PREMIUM
  }
  const premiumServices = services.length ? services : PREMIUM

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-cream section page-wrap">
        <p className="eyebrow text-grey-600">Services</p>
        <h1 className="text-cream max-w-3xl">Car Wash &amp; Detailing</h1>
        <p className="text-grey-400 mt-6 max-w-xl text-lg">
          Professional-grade products. Meticulous attention. Every car treated like our own.
        </p>
      </section>

      {/* About the wash */}
      <section className="section page-wrap border-b border-rule">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="eyebrow">Who We Are</p>
            <h2 className="mb-6">Precision cleaning, every time.</h2>
            <p className="mb-4">
              Our dedicated detailing bay uses industry-leading compounds and trained technicians
              to restore and protect your vehicle's finish. We use pH-neutral products across
              every service to protect your paintwork from damage.
            </p>
            <p>
              From a quick refresh to a show-quality detail, we have a service for every need and budget.
            </p>
          </div>
          <div className="aspect-video bg-grey-100 border border-rule flex items-center justify-center text-grey-400 text-6xl">
            🚿
          </div>
        </div>
      </section>

      {/* Regular services pricing */}
      <section id="pricing" className="section page-wrap border-b border-rule">
        <p className="eyebrow">Regular Services</p>
        <h2 className="mb-12">Quick &amp; affordable</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REGULAR.map(({ name, price, includes }) => (
            <div key={name} className="border border-rule p-6">
              <p className="mono-label mb-2">Service</p>
              <h3 className="font-display text-xl font-bold uppercase mb-1">{name}</h3>
              <p className="font-display text-2xl font-bold text-red mb-5">{price}</p>
              <ul className="flex flex-col gap-2">
                {includes.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-grey-600">
                    <span className="text-green mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Premium services */}
      <section className="section page-wrap">
        <p className="eyebrow">Premium Services</p>
        <h2 className="mb-12">The full treatment</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {premiumServices.map(svc => (
            <div key={svc._id} className={`border p-8 flex flex-col ${svc.tier === 'premium_plus' ? 'border-ink bg-ink text-cream' : 'border-rule'}`}>
              {svc.tier === 'premium_plus' && (
                <span className="badge badge-red w-fit mb-4">Best Value</span>
              )}
              <p className="mono-label mb-2 opacity-60">Premium</p>
              <h3 className={`font-display text-2xl font-bold uppercase mb-3 ${svc.tier === 'premium_plus' ? 'text-cream' : 'text-ink'}`}>
                {svc.name}
              </h3>
              <p className={`text-sm mb-2 ${svc.tier === 'premium_plus' ? 'text-grey-400' : 'text-grey-600'}`}>
                {svc.description}
              </p>
              <p className="mono-label mb-6 opacity-50">⏱ {svc.duration}</p>
              <ul className="flex flex-col gap-2 mb-8 flex-1">
                {svc.includes.map(item => (
                  <li key={item} className={`flex items-start gap-2 text-sm ${svc.tier === 'premium_plus' ? 'text-grey-400' : 'text-grey-600'}`}>
                    <span className="text-green mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <p className={`font-display text-3xl font-bold mb-4 ${svc.tier === 'premium_plus' ? 'text-cream' : 'text-ink'}`}>
                  KES {svc.price.toLocaleString('en-KE')}
                </p>
                <Link
                  href={`/contact?service=${encodeURIComponent(svc.name)}`}
                  className={`btn w-full justify-center ${svc.tier === 'premium_plus' ? 'btn-red' : 'btn-primary'}`}
                >
                  Book this service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
