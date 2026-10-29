'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { NavLink } from '@/types'

const NAV_LINKS: NavLink[] = [
  { href: '/',                label: 'Vehicles'   },
  { href: '/wash-detailing',  label: 'Detailing'  },
  { href: '/products',        label: 'Products'   },
  { href: '/about',           label: 'About'      },
  { href: '/contact',         label: 'Contact'    },
  { href: '/blog',            label: 'Blog'       },
]

// ── Social icons ──────────────────────────────────────────────
// Update the href values with your actual social URLs
const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/autobarn.ke',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@autobarn.ke',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/autobarn.ke',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/254700000000',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
]

export function Navbar() {
  const pathname    = usePathname()
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'glass-nav--scrolled' : 'glass-nav',
        )}
      >
        <div className="page-wrap">
          <nav
            aria-label="Primary navigation"
            className="flex items-center justify-between h-16 md:h-20"
          >
            {/* Wordmark */}
            <Link
              href="/"
              aria-label="AutoBarn home"
              className="font-display font-black text-xl tracking-[-0.03em] uppercase text-ink hover:text-red transition-colors"
            >
              Auto<span className="text-red">Barn</span>
            </Link>

            {/* Desktop links */}
            <ul role="list" className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'mono-label transition-colors hover:text-red',
                        active ? 'text-ink font-medium' : 'text-grey-600',
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Socials + CTA */}
            <div className="hidden md:flex items-center gap-4">
              {/* Social icons */}
              <div className="flex items-center gap-3 border-r border-rule pr-4 mr-0">
                {SOCIALS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-grey-600 hover:text-ink transition-colors"
                  >
                    {icon}
                  </a>
                ))}
              </div>

              <Link
                href="/contact"
                className="inline-flex btn btn-red text-[10px] py-2 px-5"
              >
                Book a test drive
              </Link>
            </div>

            {/* Hamburger */}
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(v => !v)}
              className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
            >
              <span className={cn('block w-5 h-px bg-ink transition-transform duration-200', open && 'translate-y-[6px] rotate-45')} />
              <span className={cn('block w-5 h-px bg-ink transition-opacity duration-200', open && 'opacity-0')} />
              <span className={cn('block w-5 h-px bg-ink transition-transform duration-200', open && '-translate-y-[6px] -rotate-45')} />
            </button>
          </nav>
        </div>
      </header>

      {/* ── Mobile overlay menu ── */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 z-40 md:hidden flex flex-col',
          'glass-nav--mobile transition-all duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        <div className="h-16" />

        <ul role="list" className="flex-1 flex flex-col justify-center page-wrap gap-6">
          {NAV_LINKS.map(({ href, label }, i) => (
            <li
              key={href}
              style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
              className={cn(
                'transition-all duration-300',
                open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4',
              )}
            >
              <Link
                href={href}
                aria-current={pathname === href ? 'page' : undefined}
                className={cn(
                  'font-display font-bold text-4xl uppercase tracking-tight',
                  'hover:text-red transition-colors block',
                  pathname === href ? 'text-red' : 'text-ink',
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="page-wrap pb-10 flex flex-col gap-6">
          {/* Mobile socials */}
          <div className="flex items-center gap-5">
            {SOCIALS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-grey-600 hover:text-ink transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>

          <Link href="/contact" className="btn btn-red w-full justify-center">
            Book a test drive
          </Link>
        </div>
      </div>

      {/* Page content offset */}
      <div className="h-16 md:h-20" aria-hidden="true" />
    </>
  )
}
