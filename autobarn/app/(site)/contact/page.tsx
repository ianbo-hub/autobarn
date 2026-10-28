import type { Metadata } from 'next'
import { BookingForm } from '@/components/ui/BookingForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Book a test drive, service appointment or send us a question. AutoBarn Nairobi — we respond within 24 hours.',
}

const FAQ = [
  {
    q: 'Do I need to book a test drive in advance?',
    a: 'Yes — walk-ins are welcome but prior booking guarantees your preferred vehicle and time slot. Use the form above or call us.',
  },
  {
    q: 'What documents do I need to buy a car?',
    a: 'National ID, KRA PIN certificate and proof of address. If financing, your 3 most recent payslips.',
  },
  {
    q: 'Do you offer financing?',
    a: 'We partner with leading Kenyan banks. Terms range from 12–72 months with as little as 20% deposit.',
  },
  {
    q: 'How long does a full detail take?',
    a: 'Regular services: 1–2 hours. Premium services: 4–8 hours depending on the package. We\'ll give an exact ETA at check-in.',
  },
  {
    q: 'Can I sell my car to AutoBarn?',
    a: 'Yes — we buy and trade in vehicles. Book a valuation appointment and we\'ll give you a competitive offer within 24 hours.',
  },
]

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-cream section page-wrap">
        <p className="eyebrow text-grey-600">Get in Touch</p>
        <h1 className="text-cream">Let's talk cars.</h1>
        <p className="text-grey-400 mt-6 max-w-lg">
          We respond to all enquiries within 24 hours. Prefer to call? We're available Mon – Sat, 8 am – 6 pm.
        </p>
      </section>

      {/* Contact info strip */}
      <section className="border-b border-rule">
        <div className="page-wrap py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <a href="tel:+254700000000" className="group flex flex-col gap-1 hover:text-red transition-colors">
            <p className="mono-label text-grey-400">Call us</p>
            <p className="font-display text-xl font-bold uppercase group-hover:text-red">+254 700 000 000</p>
          </a>
          <a href="mailto:hello@autobarn.co.ke" className="group flex flex-col gap-1 hover:text-red transition-colors">
            <p className="mono-label text-grey-400">Email</p>
            <p className="font-display text-xl font-bold uppercase group-hover:text-red">hello@autobarn.co.ke</p>
          </a>
          <div className="flex flex-col gap-1">
            <p className="mono-label text-grey-400">Location</p>
            <p className="font-display text-xl font-bold uppercase">Westlands, Nairobi</p>
          </div>
        </div>
      </section>

      {/* Main layout: form + map */}
      <section id="booking" className="section page-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Booking form */}
          <div>
            <p className="eyebrow">Book a Service</p>
            <h2 className="mb-8">Book or enquire</h2>
            <BookingForm />
          </div>

          {/* Map + hours */}
          <div className="flex flex-col gap-8">
            {/* Google Maps embed */}
            <div className="aspect-video border border-rule overflow-hidden">
              <iframe
                title="AutoBarn location on Google Maps"
                src={`https://maps.google.com/maps?q=Westlands,Nairobi&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale"
              />
            </div>

            {/* Hours */}
            <div className="border border-rule p-6">
              <p className="eyebrow mb-4">Opening Hours</p>
              <dl className="flex flex-col gap-3">
                {[
                  ['Monday – Friday', '8:00 AM – 6:00 PM'],
                  ['Saturday',        '8:00 AM – 4:00 PM'],
                  ['Sunday',          'Closed'],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center border-b border-rule pb-3 last:border-0 last:pb-0">
                    <dt className="text-sm text-grey-600">{day}</dt>
                    <dd className="mono-label">{hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section page-wrap border-t border-rule">
        <p className="eyebrow">FAQ</p>
        <h2 className="mb-12">Common questions</h2>

        <div className="max-w-3xl flex flex-col divide-y divide-rule">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none font-display font-bold uppercase text-lg tracking-tight">
                <span>{q}</span>
                <span
                  aria-hidden="true"
                  className="text-red ml-4 flex-shrink-0 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-grey-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
