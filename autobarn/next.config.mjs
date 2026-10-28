/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC native compiler (falls back to Babel) for environments where SWC crashes
  swcMinify: false,
  experimental: {
    forceSwcTransforms: false,
  },

  // Don't leak the Next.js version via the X-Powered-By response header
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ─── Security headers ──────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Clickjacking protection
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Referrer
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          // HSTS — tell browsers to always use HTTPS (1 year, include subdomains)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // Prevent cross-domain policy files from granting additional permissions
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          // ── Content Security Policy ─────────────────────────────────
          // Restricts what resources the browser can load and where
          // scripts can connect to. This is the primary XSS defence.
          //
          // NOTE: 'unsafe-inline' and 'unsafe-eval' are required because
          // Next.js with Babel injects inline scripts for hydration.
          // Once the project upgrades to Next.js SWC with nonce support,
          // both directives can be removed for stricter protection.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js Babel mode needs unsafe-inline + unsafe-eval for hydration scripts
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Tailwind/Next.js global CSS + Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Google Fonts files
              "font-src 'self' https://fonts.gstatic.com",
              // Images from Cloudinary and Sanity CDN; data: for base64 inline images
              "img-src 'self' blob: data: https://res.cloudinary.com https://cdn.sanity.io",
              // API / WebSocket origins: Supabase, Sanity, Algolia, Resend
              [
                "connect-src 'self'",
                'https://*.supabase.co',
                'wss://*.supabase.co',
                'https://*.sanity.io',
                'https://*.algolia.net',
                'https://*.algolia.io',
                'https://*.algolianet.com',
                'https://api.resend.com',
              ].join(' '),
              // No plugins (Flash, Java, etc.)
              "object-src 'none'",
              // Allow Google Maps embeds; deny all other framing of this site
              "frame-src https://maps.google.com https://www.google.com",
              "frame-ancestors 'none'",
              // Restrict <base href> hijacking
              "base-uri 'self'",
              // Forms can only POST to same origin
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // ── CORS for API routes ──────────────────────────────────────
      // Expose standard headers so the browser knows the response is safe.
      // The actual cross-origin blocking is done in middleware.ts.
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ]
  },
}

export default nextConfig
