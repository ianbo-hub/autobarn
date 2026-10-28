import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'AutoBarn terms and conditions governing vehicle purchases, bookings, and services.',
}

const LAST_UPDATED = '28 October 2024'

export default function TermsPage() {
  return (
    <>
      <section className="bg-ink text-cream section page-wrap">
        <p className="eyebrow text-grey-600">Legal</p>
        <h1 className="text-cream">Terms &amp; Conditions</h1>
        <p className="text-grey-400 mt-4 font-mono text-xs">Last updated: {LAST_UPDATED}</p>
      </section>

      <section className="section page-wrap">
        <div className="max-w-3xl flex flex-col gap-10 text-sm leading-relaxed text-grey-600">

          <p>
            These terms and conditions govern your use of the AutoBarn website and any vehicle purchase,
            booking, or service arranged through AutoBarn Ltd (<strong className="text-ink">"AutoBarn"</strong>).
            By using our website or services you agree to these terms.
          </p>

          <TermsSection title="1. About AutoBarn">
            <p>
              AutoBarn Ltd is a vehicle dealership and detailing service operating from Westlands, Nairobi,
              Kenya. Company registration and contact details are available on request.
            </p>
          </TermsSection>

          <TermsSection title="2. Bookings and enquiries">
            <p>
              Submitting a booking or enquiry form on our website does not constitute a binding contract.
              A contract is formed only when AutoBarn confirms your booking in writing (by email or phone).
              AutoBarn reserves the right to decline any booking at its discretion.
            </p>
          </TermsSection>

          <TermsSection title="3. Vehicle information">
            <p>
              Vehicle descriptions, specifications, and pricing displayed on our website are provided for
              information purposes and may be subject to change. All vehicles are subject to prior sale.
              We make reasonable efforts to ensure accuracy but do not warrant that all information is
              error-free. Contact us to confirm current availability and pricing before making a decision.
            </p>
            <p>
              Claims such as "fully inspected" and "120-point inspection" refer to AutoBarn's internal
              pre-sale vehicle inspection process. Documentation is available on request.
            </p>
          </TermsSection>

          <TermsSection id="returns" title="4. 7-Day return policy">
            <p>
              AutoBarn offers a 7-day return period for eligible vehicle purchases. The following
              conditions apply:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>The vehicle must be returned in the same condition as sold, with no additional mileage exceeding 200 km.</li>
              <li>The return must be initiated within 7 calendar days of the vehicle handover date.</li>
              <li>The vehicle must not have been in an accident, damaged, or modified after purchase.</li>
              <li>The original logbook, all keys, and any accessories provided at sale must be returned.</li>
              <li>The return policy does not apply to vehicles purchased at auction or under a trade-in arrangement.</li>
              <li>Refunds will be processed within 14 business days via the original payment method, less any agreed deductions.</li>
            </ul>
            <p>
              To initiate a return, contact us within the 7-day window at{' '}
              <a href="mailto:hello@autobarn.co.ke" className="text-red hover:underline">
                hello@autobarn.co.ke
              </a>{' '}
              or call <a href="tel:+254700000000" className="text-red hover:underline">+254 700 000 000</a>.
            </p>
          </TermsSection>

          <TermsSection title="5. Test drives">
            <p>
              Test drives are available by appointment. You must hold a valid Kenya driving licence (or
              equivalent). Drivers must be 18 years of age or older. AutoBarn reserves the right to
              decline a test drive request.
            </p>
          </TermsSection>

          <TermsSection title="6. Detailing and wash services">
            <p>
              Service pricing on our website is indicative. Final pricing may vary based on vehicle
              condition and size assessed at check-in. We will inform you of any price difference before
              proceeding. Payment is due on completion of service.
            </p>
          </TermsSection>

          <TermsSection title="7. Finance">
            <p>
              Finance options are provided through third-party lenders. AutoBarn is not a lender and
              does not offer financial advice. Finance is subject to lender approval, terms, and eligibility.
              "Finance options available" indicates that we facilitate introductions to partner lenders —
              approval is not guaranteed.
            </p>
          </TermsSection>

          <TermsSection title="8. Intellectual property">
            <p>
              All content on autobarn.co.ke, including text, images, logos, and design, is owned by
              AutoBarn Ltd or its licensors and is protected by copyright. You may not reproduce or
              redistribute content without written permission.
            </p>
          </TermsSection>

          <TermsSection title="9. Limitation of liability">
            <p>
              To the fullest extent permitted by Kenyan law, AutoBarn's liability for any claim arising
              from use of our website or services is limited to the value of the transaction in question.
              We are not liable for indirect or consequential losses.
            </p>
          </TermsSection>

          <TermsSection title="10. Governing law">
            <p>
              These terms are governed by the laws of Kenya. Any disputes shall be subject to the
              exclusive jurisdiction of the courts of Kenya.
            </p>
          </TermsSection>

          <TermsSection title="11. Changes">
            <p>
              AutoBarn may update these terms at any time. Continued use of our website or services after
              changes constitutes acceptance of the updated terms. The date at the top of this page reflects
              the most recent revision.
            </p>
          </TermsSection>

          <TermsSection title="12. Contact">
            <p>
              Questions about these terms: <a href="mailto:hello@autobarn.co.ke" className="text-red hover:underline">hello@autobarn.co.ke</a>
              <br />
              AutoBarn Ltd, Westlands, Nairobi, Kenya
            </p>
            <p>
              See also:{' '}
              <Link href="/privacy-policy" className="text-red hover:underline">Privacy Policy</Link>
              {' '}·{' '}
              <Link href="/cookie-policy" className="text-red hover:underline">Cookie Policy</Link>
            </p>
          </TermsSection>

        </div>
      </section>
    </>
  )
}

function TermsSection({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="flex flex-col gap-4 scroll-mt-8">
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
