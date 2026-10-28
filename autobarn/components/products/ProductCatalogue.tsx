'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { NoProductsState } from '@/components/ui/EmptyState'
import { formatPrice, cn } from '@/lib/utils'
import { useToast } from '@/components/ui/ToastContext'
import type { Product } from '@/types'

const CATEGORIES = ['All', 'Wax', 'Microfibre Cloth', 'Detailing Brush', 'Others']
const COLOURS_FILTER = ['All', 'Black', 'Blue', 'Red', 'Yellow', 'White', 'Orange']

function ProductCard({ product }: { product: Product }) {
  const toast = useToast()
  const img   = product.images?.[0]

  const handleEnquire = () => {
    toast(`Enquiry sent for <b>${product.name}</b>`, 'success')
  }

  return (
    <article className="border border-rule group hover:border-ink transition-colors flex flex-col">
      <div className="relative aspect-square bg-grey-100 overflow-hidden">
        {img ? (
          <Image
            src={img.url}
            alt={img.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-grey-400">🧴</div>
        )}
        {product.onSale && (
          <span className="absolute top-2 left-2 badge badge-red">Sale</span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="mono-label mb-1">{product.category}</p>
        <h3 className="font-display text-lg font-bold uppercase leading-tight mb-2 text-ink">{product.name}</h3>
        <p className="text-sm text-grey-600 line-clamp-2 flex-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="font-display text-xl font-bold text-ink">{formatPrice(product.price)}</p>
          <button onClick={handleEnquire} className="btn btn-secondary py-2 px-4 text-[10px]">
            Enquire
          </button>
        </div>
      </div>
    </article>
  )
}

export function ProductCatalogue({ initialProducts }: { initialProducts: Product[] }) {
  const [category, setCategory]   = useState('All')
  const [colour, setColour]       = useState('All')
  const [maxPrice, setMaxPrice]   = useState<number | undefined>()
  const [showSaleOnly, setShowSaleOnly] = useState(false)
  const [, startTransition] = useTransition()

  const filtered = initialProducts.filter(p => {
    if (category !== 'All' && p.category !== category)       return false
    if (colour !== 'All'   && p.colour !== colour)           return false
    if (maxPrice           && p.price > maxPrice)            return false
    if (showSaleOnly       && !p.onSale)                     return false
    return true
  })

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-rule items-end">
        {/* Category chips */}
        <div>
          <p className="label mb-2">Category</p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => startTransition(() => setCategory(c))}
                className={cn(
                  'badge border cursor-pointer transition-colors',
                  category === c ? 'badge-ink' : 'badge-cream hover:badge-ink',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Max price */}
        <div>
          <p className="label mb-2">Max price (KES)</p>
          <select
            className="input text-sm py-2 w-40"
            value={maxPrice ?? ''}
            onChange={e => startTransition(() => setMaxPrice(e.target.value ? +e.target.value : undefined))}
          >
            <option value="">Any</option>
            <option value={500}>500</option>
            <option value={1000}>1,000</option>
            <option value={2500}>2,500</option>
            <option value={5000}>5,000</option>
          </select>
        </div>

        {/* Special offers toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showSaleOnly}
            onChange={e => startTransition(() => setShowSaleOnly(e.target.checked))}
            className="w-4 h-4 accent-red"
          />
          <span className="mono-label">Special offers only</span>
        </label>
      </div>

      {/* Colour filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {COLOURS_FILTER.map(c => (
          <button
            key={c}
            onClick={() => startTransition(() => setColour(c))}
            className={cn(
              'badge border cursor-pointer transition-colors',
              colour === c ? 'badge-ink' : 'badge-cream hover:badge-ink',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mono-label text-grey-400 mb-6">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <NoProductsState onReset={() => { setCategory('All'); setColour('All'); setMaxPrice(undefined); setShowSaleOnly(false) }} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  )
}
