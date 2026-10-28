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

export function Navbar() {
  const pathname    = usePathname()
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  // Detect scroll for glass intensity
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Prevent body scroll when mobile menu open
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
          // ── Liquid glass base ──
          scrolled
            ? 'glass-nav--scrolled'
            : 'glass-nav',
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
            <ul
              role="list"
              className="hidden md:flex items-center gap-8"
            >
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

            {/* CTA + hamburger */}
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className="hidden md:inline-flex btn btn-red text-[10px] py-2 px-5"
              >
                Book a test drive
              </Link>

              {/* Hamburger */}
              <button
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen(v => !v)}
                className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
              >
                <span className={cn(
                  'block w-5 h-px bg-ink transition-transform duration-200',
                  open && 'translate-y-[6px] rotate-45',
                )} />
                <span className={cn(
                  'block w-5 h-px bg-ink transition-opacity duration-200',
                  open && 'opacity-0',
                )} />
                <span className={cn(
                  'block w-5 h-px bg-ink transition-transform duration-200',
                  open && '-translate-y-[6px] -rotate-45',
                )} />
              </button>
            </div>
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
        {/* Spacer for navbar height */}
        <div className="h-16" />

        <ul
          role="list"
          className="flex-1 flex flex-col justify-center page-wrap gap-6"
        >
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

        <div className="page-wrap pb-10">
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
