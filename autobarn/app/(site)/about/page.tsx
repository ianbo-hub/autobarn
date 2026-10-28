import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about AutoBarn — Nairobi\'s trusted vehicle dealership and detailing specialist since 2010.',
}

const VALUES = [
  { icon: '🔍', title: 'Transparency',  body: 'Every vehicle comes with a full inspection report and service history. No hidden surprises.' },
  { icon: '🛡️', title: 'Integrity',     body: 'We tell you what we know — and what we don\'t. Honest advice over a quick sale, every time.' },
  { icon: '✨', title: 'Quality',        body: 'We stock only vehicles that meet our 120-point inspection standard. Average age under 5 years.' },
  { icon: '🤝', title: 'Partnership',   body: 'A car purchase is a big decision. We stay with you from first enquiry through every service interval.' },
]

const TIMELINE = [
  { year: '2010', event: 'AutoBarn founded in Westlands with a 12-car lot and 3 staff.' },
  { year: '2014', event: 'Launched professional detailing bay. First KES 1M revenue month.' },
  { year: '2017', event: 'Expanded to current 80-car showroom. Added import sourcing from Japan.' },
  { year: '2020', event: 'Launched online catalogue. Delivered 50% of sales contact-free during COVID.' },
  { year: '2023', event: 'Added EV inventory and Kenya\'s first on-site EV charging bay.' },
  { year: '2024', event: 'Over 4,000 vehicles sold since founding. Recognised as a top-rated dealership on Google Reviews.' },
]

const OPEN_ROLES = [
  { title: 'Vehicle Sales Executive',  type: 'Full-time', location: 'Westlands, Nairobi' },
  { title: 'Detailing Technician',     type: 'Full-time', location: 'Westlands, Nairobi' },
  { title: 'Digital Marketing Intern', type: 'Internship', location: 'Remote / Hybrid' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-cream section page-wrap">
        <p className="eyebrow text-grey-600">Our Story</p>
        <h1 className="text-cream max-w-3xl">Built on trust, driven by passion.</h1>
        <p className="text-grey-400 mt-6 max-w-xl text-lg leading-relaxed">
          Since 2010, AutoBarn has been Nairobi's benchmark for quality vehicles and professional car care.
        </p>
      </section>

      {/* Mission */}
      <section className="section page-wrap border-b border-rule">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="eyebrow">Mission</p>
            <h2 className="mb-6">Every Kenyan deserves a car they can rely on.</h2>
            <p className="mb-4">
              We exist to make vehicle ownership simpler, safer and more transparent. Every car
              we sell has passed a rigorous 120-point check, and we stand behind every vehicle
              with a 7-day return guarantee.
            </p>
            <p>
              Our detailing team keeps those cars immaculate long after the sale — because a well-maintained
              car is a safer, more valuable car.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {VALUES.map(({ icon, title, body }) => (
              <div key={title} className="border border-rule p-5">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-display text-lg font-bold uppercase mb-2">{title}</h3>
                <p className="text-sm text-grey-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History timeline */}
      <section className="section page-wrap border-b border-rule">
        <p className="eyebrow">History</p>
        <h2 className="mb-12">How we got here</h2>

        <div className="relative border-l border-rule ml-4">
          {TIMELINE.map(({ year, event }) => (
            <div key={year} className="pl-8 pb-10 relative">
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-red rounded-none border-2 border-red" />
              <p className="mono-label text-red mb-1">{year}</p>
              <p className="text-grey-600">{event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Careers */}
      <section id="careers" className="section page-wrap border-b border-rule">
        <p className="eyebrow">Careers</p>
        <h2 className="mb-4">Open positions</h2>
        <p className="text-grey-600 mb-10 max-w-lg">
          We're growing. If you're passionate about cars and customer service, we want to hear from you.
        </p>

        <div className="flex flex-col gap-4">
          {OPEN_ROLES.map(({ title, type, location }) => (
            <div key={title} className="border border-rule p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-bold uppercase">{title}</h3>
                <div className="flex gap-3 mt-2">
                  <span className="badge badge-cream">{type}</span>
                  <span className="mono-label text-grey-400">{location}</span>
                </div>
              </div>
              <Link href="/contact?subject=careers" className="btn btn-primary shrink-0">
                Apply now
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Work with us CTA */}
      <section className="section page-wrap">
        <div className="bg-ink text-cream p-12 md:p-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="eyebrow text-grey-600 mb-4">Partner</p>
            <h2 className="text-cream mb-4">Want to work with us?</h2>
            <p className="text-grey-400 max-w-md">
              We collaborate with logistics partners, finance providers, insurance firms and content creators.
              Let's build something together.
            </p>
          </div>
          <Link href="/contact?subject=partnership" className="btn btn-red shrink-0">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  )
}
