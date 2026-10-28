import type { Metadata, Viewport } from 'next'
import './globals.css'

// ─── METADATA ─────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autobarn.co.ke'),
  title: {
    default:  'AutoBarn — Premium Vehicles & Detailing, Nairobi',
    template: '%s · AutoBarn',
  },
  description:
    'AutoBarn is Nairobi\'s premier vehicle dealership offering quality cars, professional detailing, and car wash services.',
  keywords: ['car dealership Nairobi', 'used cars Kenya', 'car detailing Nairobi', 'AutoBarn'],
  openGraph: {
    type:        'website',
    locale:      'en_KE',
    siteName:    'AutoBarn',
    title:       'AutoBarn — Premium Vehicles & Detailing',
    description: 'Quality vehicles and professional detailing in Nairobi, Kenya.',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'AutoBarn — Premium Vehicles & Detailing',
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  themeColor:    '#FAF7F2',
  width:         'device-width',
  initialScale:  1,
  viewportFit:   'cover',
}

// ─── ROOT LAYOUT ──────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts — loaded via CSS for Babel-compatible dev environment */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant:wght@600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        {/* Skip navigation — allows keyboard and screen-reader users to jump
            straight to the main content without tabbing through the entire nav */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:bg-ink focus:text-cream focus:px-4 focus:py-2 focus:text-sm focus:font-mono focus:uppercase focus:tracking-widest"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
