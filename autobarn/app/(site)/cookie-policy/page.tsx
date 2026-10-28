import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How AutoBarn uses cookies and similar technologies on autobarn.co.ke.',
}

const LAST_UPDATED = '28 October 2024'

export default function CookiePolicyPage() {
  return (
    <>
      <section className="bg-ink text-cream section page-wrap">
        <p className="eyebrow text-grey-600">Legal</p>
        <h1 className="text-cream">Cookie Policy</h1>
        <p className="text-grey-400 mt-4 font-mono text-xs">Last updated: {LAST_UPDATED}</p>
      </section>

      <section className="section page-wrap">
        <div className="max-w-3xl flex flex-col gap-10 text-sm leading-relaxed text-grey-600">

          <p>
            This Cookie Policy explains what cookies are, how AutoBarn Ltd uses them on{' '}
            <strong className="text-ink">autobarn.co.ke</strong>, and how you can manage them.
          </p>

          <CookieSection title="1. What are cookies?">
            <p>
              Cookies are small text files placed on your device when you visit a website. They are widely
              used to make websites work efficiently and to provide information to website owners. Cookies
              cannot harm your device and do not contain personally identifiable information on their own.
            </p>
          </CookieSection>

          <CookieSection title="2. What cookies we use">
            <p>We use the following categories of cookies:</p>

            <CookieTable
              category="Strictly Necessary"
              description="Essential for the website to function. These cannot be disabled."
              cookies={[
                { name: 'sb-auth-token', purpose: 'Supabase authentication session (admin users only)', duration: 'Session' },
                { name: 'cookie_consent', purpose: 'Stores your cookie consent preference', duration: '1 year' },
              ]}
            />

            <CookieTable
              category="Functional"
              description="Remember your preferences and improve your experience. Only set with your consent."
              cookies={[
                { name: 'toast_dismissed', purpose: 'Remembers dismissed notifications', duration: '30 days' },
              ]}
            />

            <CookieTable
              category="Analytics / Performance"
              description="Help us understand how visitors interact with the website. Only set with your consent."
              cookies={[
                { name: '_ga, _gid', purpose: 'Google Analytics (if enabled — not currently active)', duration: '2 years / 24 hours' },
              ]}
            />

            <p className="text-xs text-grey-400 italic">
              Note: Google Maps embeds on our contact page may set cookies from Google when the map is
              loaded. These are subject to{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red hover:underline"
              >
                Google's Privacy Policy
              </a>.
            </p>
          </CookieSection>

          <CookieSection title="3. Your choices">
            <p>
              When you first visit our website, you will see a cookie consent banner. You can choose to:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>
                <strong className="text-ink">Accept all cookies</strong> — we set all categories described above.
              </li>
              <li>
                <strong className="text-ink">Decline non-essential cookies</strong> — we only set strictly necessary
                cookies.
              </li>
            </ul>
            <p>
              You can change your preference at any time by clearing your browser cookies and revisiting
              the site, or by contacting us at{' '}
              <a href="mailto:privacy@autobarn.co.ke" className="text-red hover:underline">
                privacy@autobarn.co.ke
              </a>.
            </p>
          </CookieSection>

          <CookieSection title="4. Managing cookies in your browser">
            <p>
              Most browsers allow you to refuse or delete cookies. Here is how to manage cookies in common
              browsers:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              {[
                ['Chrome', 'Settings → Privacy and security → Cookies and other site data'],
                ['Firefox', 'Settings → Privacy & Security → Cookies and Site Data'],
                ['Safari', 'Preferences → Privacy → Manage Website Data'],
                ['Edge', 'Settings → Cookies and site permissions'],
              ].map(([browser, path]) => (
                <li key={browser}>
                  <strong className="text-ink">{browser}:</strong> {path}
                </li>
              ))}
            </ul>
            <p>
              Please note that disabling certain cookies may affect the functionality of our website.
            </p>
          </CookieSection>

          <CookieSection title="5. More information">
            <p>
              For more information about how we use your personal data, see our{' '}
              <Link href="/privacy-policy" className="text-red hover:underline">Privacy Policy</Link>.
              For data deletion requests, visit our{' '}
              <Link href="/data-deletion" className="text-red hover:underline">data request page</Link>.
            </p>
            <p>
              Contact:{' '}
              <a href="mailto:privacy@autobarn.co.ke" className="text-red hover:underline">
                privacy@autobarn.co.ke
              </a>
            </p>
          </CookieSection>

        </div>
      </section>
    </>
  )
}

function CookieSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2
        className="text-xl font-bold uppercase tracking-tight text-ink border-b border-rule pb-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

function CookieTable({
  category,
  description,
  cookies,
}: {
  category: string
  description: string
  cookies: { name: string; purpose: string; duration: string }[]
}) {
  return (
    <div className="border border-rule">
      <div className="bg-grey-100 px-4 py-3 border-b border-rule">
        <p className="font-mono text-[10px] uppercase tracking-widest text-grey-600">
          {category}
        </p>
        <p className="text-xs text-grey-600 mt-0.5">{description}</p>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-rule">
            <th className="text-left font-mono text-grey-400 px-4 py-2 uppercase tracking-widest text-[10px]">Cookie name</th>
            <th className="text-left font-mono text-grey-400 px-4 py-2 uppercase tracking-widest text-[10px]">Purpose</th>
            <th className="text-left font-mono text-grey-400 px-4 py-2 uppercase tracking-widest text-[10px]">Duration</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map(c => (
            <tr key={c.name} className="border-b border-rule last:border-0">
              <td className="px-4 py-3 font-mono text-ink">{c.name}</td>
              <td className="px-4 py-3 text-grey-600">{c.purpose}</td>
              <td className="px-4 py-3 text-grey-600 whitespace-nowrap">{c.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
