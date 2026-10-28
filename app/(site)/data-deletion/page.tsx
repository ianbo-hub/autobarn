import type { Metadata } from 'next'
import { DataRequestForm } from '@/components/ui/DataRequestForm'

export const metadata: Metadata = {
  title: 'Data Request',
  description: 'Exercise your rights under the Kenya Data Protection Act 2019. Request access, correction or deletion of your personal data.',
}

export default function DataDeletionPage() {
  return (
    <>
      <section className="bg-ink text-cream section page-wrap">
        <p className="eyebrow text-grey-600">Your Rights</p>
        <h1 className="text-cream">Data Request</h1>
        <p className="text-grey-400 mt-6 max-w-lg">
          Under the Kenya Data Protection Act 2019, you have the right to access, correct, or request
          deletion of your personal data. Use this form to submit a request.
        </p>
      </section>

      <DataRequestForm />
    </>
  )
}
