import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How AutoBarn collects, uses and protects your personal data under the Kenya Data Protection Act 2019.',
}

const LAST_UPDATED = '28 October 2024'

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-ink text-cream section page-wrap">
        <p className="eyebrow text-grey-600">Legal</p>
        <h1 className="text-cream">Privacy Policy</h1>
        <p className="text-grey-400 mt-4 font-mono text-xs">Last updated: {LAST_UPDATED}</p>
      </section>

      {/* Body */}
      <section className="section page-wrap">
        <div className="max-w-3xl prose-legal">
          <Legal />
        </div>
      </section>
    </>
  )
}

function Legal() {
  return (
    <div className="flex flex-col gap-10 text-sm leading-relaxed text-grey-600">

      <p>
        AutoBarn Ltd (<strong className="text-ink">"AutoBarn"</strong>, <strong className="text-ink">"we"</strong>,{' '}
        <strong className="text-ink">"us"</strong> or <strong className="text-ink">"our"</strong>) is committed to
        protecting the personal information you share with us. This Privacy Policy explains what data we collect,
        why we collect it, how we use it and your rights under the{' '}
        <strong className="text-ink">Kenya Data Protection Act 2019 (DPA 2019)</strong>.
      </p>

      <p>
        This policy applies to our website at <strong className="text-ink">autobarn.co.ke</strong>, our booking
        and enquiry forms, and any communications between you and AutoBarn.
      </p>

      {/* 1 */}
      <Section title="1. Who we are">
        <p>
          <strong className="text-ink">Data Controller:</strong> AutoBarn Ltd, Westlands, Nairobi, Kenya.
        </p>
        <p>
          <strong className="text-ink">Contact:</strong>{' '}
          <a href="mailto:privacy@autobarn.co.ke" className="text-red hover:underline">
            privacy@autobarn.co.ke
          </a>
        </p>
        <p>
          We are registered as a data controller under the Kenya Data Protection Act 2019. For data
          deletion or access requests see our{' '}
          <Link href="/data-deletion" className="text-red hover:underline">data deletion page</Link>.
        </p>
      </Section>

      {/* 2 */}
      <Section title="2. What data we collect">
        <p>We collect the following categories of personal data:</p>
        <Table
          headers={['Category', 'Examples', 'Source']}
          rows={[
            ['Identity data', 'First name, last name', 'You, via booking / enquiry forms'],
            ['Contact data', 'Email address, phone number', 'You, via forms'],
            ['Transaction data', 'Vehicle interest, booking type, preferred date', 'You, via forms'],
            ['Communication data', 'Messages you send us', 'You, via forms'],
            ['Technical data', 'IP address, browser type, pages visited', 'Automatic — cookies & logs'],
            ['Marketing data', 'Email newsletter subscription, source', 'You, via newsletter sign-up'],
          ]}
        />
        <p>
          We do <strong className="text-ink">not</strong> collect special categories of data (health, biometrics,
          political views, etc.) and we do <strong className="text-ink">not</strong> knowingly collect personal
          data from children under 18. If you are under 18, please ask a parent or guardian to contact us on
          your behalf.
        </p>
      </Section>

      {/* 3 */}
      <Section title="3. Why we collect your data (legal basis)">
        <Table
          headers={['Purpose', 'Legal basis (DPA 2019)']}
          rows={[
            ['Process your booking or enquiry', 'Performance of a contract / legitimate interest'],
            ['Send booking confirmation emails', 'Performance of a contract'],
            ['Respond to your enquiries', 'Legitimate interest'],
            ['Send marketing emails (newsletter)', 'Consent — you can unsubscribe at any time'],
            ['Improve website and services', 'Legitimate interest'],
            ['Comply with legal obligations', 'Legal obligation'],
          ]}
        />
      </Section>

      {/* 4 */}
      <Section title="4. Third-party services (data processors)">
        <p>
          We use the following third-party services to operate our website. Each acts as a data processor
          under our instructions and is bound by data processing agreements:
        </p>
        <Table
          headers={['Service', 'Purpose', 'Data shared', 'Location']}
          rows={[
            ['Supabase', 'Database & authentication', 'All form data, auth tokens', 'EU / US (AWS)'],
            ['Resend', 'Transactional email delivery', 'Name, email, booking details', 'US'],
            ['Algolia', 'Vehicle search', 'Search queries (no PII)', 'US / EU'],
            ['Cloudinary', 'Vehicle image hosting', 'No personal data', 'US'],
            ['Sanity', 'Content management', 'No personal data', 'US'],
            ['Google Maps', 'Embedded location map', 'IP address (browser-direct)', 'US'],
          ]}
        />
        <p>
          Data transferred outside Kenya is subject to adequate safeguards as required under the DPA 2019,
          including Standard Contractual Clauses where applicable.
        </p>
      </Section>

      {/* 5 */}
      <Section title="5. How long we keep your data">
        <Table
          headers={['Data type', 'Retention period']}
          rows={[
            ['Booking and enquiry records', '3 years from the date of booking or last contact'],
            ['Newsletter subscriptions', 'Until you unsubscribe'],
            ['Server / access logs', '90 days'],
            ['Cookie data', 'See our Cookie Policy'],
          ]}
        />
        <p>
          After the retention period, your data is securely deleted or anonymised unless we are required
          by law to retain it longer.
        </p>
      </Section>

      {/* 6 */}
      <Section title="6. Cookies">
        <p>
          We use cookies and similar technologies. For full details see our{' '}
          <Link href="/cookie-policy" className="text-red hover:underline">Cookie Policy</Link>.
          You can manage your cookie preferences at any time via the cookie banner on our website.
        </p>
      </Section>

      {/* 7 */}
      <Section title="7. Your rights under the DPA 2019">
        <p>You have the following rights regarding your personal data:</p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li><strong className="text-ink">Right of access</strong> — request a copy of the personal data we hold about you.</li>
          <li><strong className="text-ink">Right to rectification</strong> — ask us to correct inaccurate data.</li>
          <li><strong className="text-ink">Right to erasure</strong> — ask us to delete your personal data (subject to legal retention obligations).</li>
          <li><strong className="text-ink">Right to object</strong> — object to processing based on legitimate interest, including direct marketing.</li>
          <li><strong className="text-ink">Right to data portability</strong> — receive your data in a structured, machine-readable format.</li>
          <li><strong className="text-ink">Right to withdraw consent</strong> — where processing is based on consent, withdraw it at any time.</li>
        </ul>
        <p>
          To exercise these rights, use our{' '}
          <Link href="/data-deletion" className="text-red hover:underline">data request form</Link>{' '}
          or email{' '}
          <a href="mailto:privacy@autobarn.co.ke" className="text-red hover:underline">
            privacy@autobarn.co.ke
          </a>.
          We will respond within 30 days.
        </p>
        <p>
          You also have the right to lodge a complaint with the{' '}
          <strong className="text-ink">Office of the Data Protection Commissioner (ODPC)</strong> at{' '}
          <a
            href="https://www.odpc.go.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red hover:underline"
          >
            odpc.go.ke
          </a>.
        </p>
      </Section>

      {/* 8 */}
      <Section title="8. Security">
        <p>
          We apply technical and organisational measures to protect your data, including encrypted data
          transmission (HTTPS/TLS), access controls, and regular security reviews. No method of transmission
          over the internet is 100% secure; we cannot guarantee absolute security.
        </p>
      </Section>

      {/* 9 */}
      <Section title="9. Links to other websites">
        <p>
          Our website may link to third-party websites. This policy does not apply to those sites. We
          encourage you to review the privacy policies of any external sites you visit.
        </p>
      </Section>

      {/* 10 */}
      <Section title="10. Changes to this policy">
        <p>
          We may update this policy from time to time. Material changes will be highlighted on this page
          with an updated "Last updated" date. Continued use of our website after changes constitutes
          acceptance of the revised policy.
        </p>
      </Section>

      {/* 11 */}
      <Section title="11. Contact us">
        <p>
          For privacy-related questions, contact us at:{' '}
          <a href="mailto:privacy@autobarn.co.ke" className="text-red hover:underline">
            privacy@autobarn.co.ke
          </a>
          <br />
          AutoBarn Ltd, Westlands, Nairobi, Kenya
        </p>
      </Section>

    </div>
  )
}

// ─── Helper components ────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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

function Table({
  headers,
  rows,
}: {
  headers: string[]
  rows: string[][]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border border-rule">
        <thead>
          <tr className="bg-grey-100">
            {headers.map(h => (
              <th
                key={h}
                className="text-left font-mono uppercase tracking-widest text-grey-600 px-4 py-3 border-b border-rule"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-rule last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-grey-600 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
