import type { Metadata } from 'next'
import { Suspense } from 'react'
import { sanityFetch } from '@/lib/sanity/client'
import { productListQuery } from '@/lib/sanity/queries'
import { ProductCatalogue } from '@/components/products/ProductCatalogue'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/types'

export const metadata: Metadata = {
  title: 'Detailing Products',
  description: 'Shop professional car detailing products — waxes, microfibre cloths, brushes and more. Available in Nairobi.',
}

export default async function ProductsPage() {
  let products: Product[] = []
  try {
    products = await sanityFetch<Product[]>({ query: productListQuery, tags: ['products'] })
  } catch {
    // Return empty catalogue — client will show empty state
  }

  return (
    <>
      <section className="bg-ink text-cream section page-wrap">
        <p className="eyebrow text-grey-600">Shop</p>
        <h1 className="text-cream">Detailing Products</h1>
        <p className="text-grey-400 mt-6 max-w-lg">
          Professional-grade products used by our own detailers — now available to buy.
        </p>
      </section>

      <section className="section page-wrap">
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        }>
          <ProductCatalogue initialProducts={products} />
        </Suspense>
      </section>
    </>
  )
}
