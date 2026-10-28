import Link from 'next/link'

const NAV = [
  { heading: 'Vehicles',  links: [
    { href: '/', label: 'All Stock' },
    { href: '/?fuel=electric', label: 'Electric' },
    { href: '/?fuel=hybrid', label: 'Hybrid' },
    { href: '/contact', label: 'Request a Quote' },
  ]},
  { heading: 'Services',  links: [
    { href: '/wash-detailing', label: 'Car Wash & Detailing' },
    { href: '/wash-detailing#pricing', label: 'Pricing' },
    { href: '/products', label: 'Detailing Products' },
    { href: '/contact#booking', label: 'Book a Service' },
  ]},
  { heading: 'Company',   links: [
    { href: '/about', label: 'About Us' },
    { href: '/about#careers', label: 'Careers' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
    { href: '/data-deletion', label: 'Data Request' },
  ]},
]

const SOCIAL = [
  { href: 'https://www.instagram.com/autobarnke', label: 'Instagram', icon: 'IG' },
  { href: 'https://www.facebook.com/autobarnke',  label: 'Facebook',  icon: 'FB' },
  { href: 'https://twitter.com/autobarnke',       label: 'Twitter/X', icon: 'X' },
  { href: 'https://wa.me/254700000000',           label: 'WhatsApp',  icon: 'WA' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-cream border-t border-[#222]">
      {/* ── Top strip — contact callouts ── */}
      <div className="border-b border-[#222]">
        <div className="page-wrap py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="mono-label text-grey-400 mb-1">Call us</p>
            <a
              href="tel:+254700000000"
              className="font-display text-2xl font-bold uppercase tracking-tight hover:text-red transition-colors"
            >
              +254 700 000 000
            </a>
          </div>
          <div>
            <p className="mono-label text-grey-400 mb-1">Email</p>
            <a
              href="mailto:hello@autobarn.co.ke"
              className="font-display text-2xl font-bold uppercase tracking-tight hover:text-red transition-colors"
            >
              hello@autobarn.co.ke
            </a>
          </div>
          <div>
            <p className="mono-label text-grey-400 mb-1">Visit us</p>
            <p className="font-display text-2xl font-bold uppercase tracking-tight leading-tight">
              Westlands, Nairobi<br />
              <span className="text-grey-600 text-base">Mon – Sat, 8 am – 6 pm</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Main nav grid ── */}
      <div className="page-wrap py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Brand column */}
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            aria-label="AutoBarn home"
            className="font-display font-black text-2xl uppercase tracking-tight hover:text-red transition-colors"
          >
            Auto<span className="text-red">Barn</span>
          </Link>
          <p className="text-grey-600 text-sm leading-relaxed max-w-[220px]">
            Premium vehicles and professional detailing services in Nairobi, Kenya.
          </p>
          {/* Social icons */}
          <div className="flex gap-3">
            {SOCIAL.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 border border-[#333] flex items-center justify-center font-mono text-[10px] text-grey-400 hover:border-red hover:text-red transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {NAV.map(({ heading, links }) => (
          <div key={heading}>
            <p className="mono-label text-grey-600 mb-5">{heading}</p>
            <ul role="list" className="flex flex-col gap-3">
              {links.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-grey-400 hover:text-cream transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#222]">
        <div className="page-wrap py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="mono-label text-grey-600">
            © {year} AutoBarn Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 flex-wrap justify-center sm:justify-end">
            <Link href="/privacy-policy" className="mono-label text-grey-600 hover:text-cream transition-colors">
              Privacy
            </Link>
            <Link href="/cookie-policy" className="mono-label text-grey-600 hover:text-cream transition-colors">
              Cookies
            </Link>
            <Link href="/terms" className="mono-label text-grey-600 hover:text-cream transition-colors">
              Terms
            </Link>
            <Link href="/data-deletion" className="mono-label text-grey-600 hover:text-cream transition-colors">
              Data Request
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
