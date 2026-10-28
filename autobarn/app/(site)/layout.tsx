import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { ToastProvider } from '@/components/ui/ToastContext'
import { CookieBanner } from '@/components/ui/CookieBanner'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </ToastProvider>
  )
}
