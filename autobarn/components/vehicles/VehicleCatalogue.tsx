'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { NoVehiclesState } from '@/components/ui/EmptyState'
import { formatPrice, formatMileage, cn } from '@/lib/utils'
import type { Vehicle, VehicleFilters } from '@/types'

// ─── FILTER PANEL ─────────────────────────────────────────────
const YEARS = Array.from({ length: 20 }, (_, i) => 2024 - i)
const FUELS = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
const TRANSMISSIONS = ['Automatic', 'Manual']
const COLOURS = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Grey', 'Brown', 'Green']

const PRICE_MIN = 500_000
const PRICE_MAX = 10_000_000
const PRICE_STEP = 100_000

const EMPTY_FILTERS: VehicleFilters = {
  minPrice:     undefined,
  maxPrice:     undefined,
  year:         undefined,
  fuelType:     undefined,
  transmission: undefined,
  maxMileage:   undefined,
  colour:       undefined,
}

// ─── DUAL RANGE PRICE SLIDER ─────────────────────────────────
function PriceRangeSlider({
  minPrice,
  maxPrice,
  onChange,
}: {
  minPrice: number | undefined
  maxPrice: number | undefined
  onChange: (min: number | undefined, max: number | undefined) => void
}) {
  const lo = minPrice ?? PRICE_MIN
  const hi = maxPrice ?? PRICE_MAX

  const loPercent = ((lo - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const hiPercent = ((hi - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

  const fmtShort = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
    return String(n)
  }

  return (
    <div>
      {/* Thumb styles — scoped via class names */}
      <style>{`
        .price-slider-wrap{position:relative;height:24px;display:flex;align-items:center;}
        .price-slider-track{position:absolute;left:0;right:0;height:3px;background:#d4d0c8;}
        .price-slider-fill{position:absolute;height:3px;background:var(--ink);}
        .price-range-input{position:absolute;left:0;width:100%;height:3px;-webkit-appearance:none;appearance:none;background:transparent;pointer-events:none;outline:none;}
        .price-range-input::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;background:var(--ink);border:2px solid var(--cream);box-shadow:0 0 0 1.5px var(--ink);border-radius:0;cursor:grab;pointer-events:all;}
        .price-range-input:active::-webkit-slider-thumb{cursor:grabbing;}
        .price-range-input::-moz-range-thumb{width:16px;height:16px;background:var(--ink);border:2px solid var(--cream);box-shadow:0 0 0 1.5px var(--ink);border-radius:0;cursor:grab;pointer-events:all;border:none;}
      `}</style>

      <div className="flex justify-between text-xs text-grey-600 mb-3">
        <span>KES {fmtShort(lo)}</span>
        <span>{hi >= PRICE_MAX ? 'Any max' : `KES ${fmtShort(hi)}`}</span>
      </div>

      <div className="price-slider-wrap">
        <div className="price-slider-track" />
        <div
          className="price-slider-fill"
          style={{ left: `${loPercent}%`, width: `${hiPercent - loPercent}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={lo}
          onChange={e => {
            const val = +e.target.value
            if (val < hi) onChange(val === PRICE_MIN ? undefined : val, maxPrice)
          }}
          className="price-range-input"
          aria-label="Minimum price"
        />
        {/* Max thumb */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={hi}
          onChange={e => {
            const val = +e.target.value
            if (val > lo) onChange(minPrice, val === PRICE_MAX ? undefined : val)
          }}
          className="price-range-input"
          aria-label="Maximum price"
        />
      </div>
    </div>
  )
}

// ─── FILTER PANEL ─────────────────────────────────────────────
function FilterPanel({
  filters,
  onChange,
}: {
  filters: VehicleFilters
  onChange: (f: Partial<VehicleFilters>) => void
}) {
  return (
    <aside aria-label="Vehicle filters" className="border border-rule p-6 flex flex-col gap-6 h-fit sticky top-24">
      {/* Price slider */}
      <div>
        <p className="label mb-3">Price range (KES)</p>
        <PriceRangeSlider
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={(min, max) => onChange({ minPrice: min, maxPrice: max })}
        />
      </div>

      {/* Year */}
      <div>
        <p className="label mb-3">Year</p>
        <select
          className="input text-sm py-2"
          value={filters.year ?? ''}
          onChange={e => onChange({ year: e.target.value ? +e.target.value : undefined })}
        >
          <option value="">Any year</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Fuel type */}
      <div>
        <p className="label mb-3">Fuel type</p>
        <div className="flex flex-wrap gap-2">
          {FUELS.map(f => (
            <button
              key={f}
              onClick={() => onChange({ fuelType: filters.fuelType?.toLowerCase() === f.toLowerCase() ? undefined : f.toLowerCase() })}
              className={cn(
                'badge border cursor-pointer transition-colors',
                filters.fuelType?.toLowerCase() === f.toLowerCase()
                  ? 'badge-ink'
                  : 'badge-cream hover:badge-ink',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <p className="label mb-3">Transmission</p>
        <div className="flex gap-2">
          {TRANSMISSIONS.map(t => (
            <button
              key={t}
              onClick={() => onChange({ transmission: filters.transmission?.toLowerCase() === t.toLowerCase() ? undefined : t.toLowerCase() })}
              className={cn(
                'badge border cursor-pointer transition-colors',
                filters.transmission?.toLowerCase() === t.toLowerCase() ? 'badge-ink' : 'badge-cream hover:badge-ink',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Max mileage */}
      <div>
        <p className="label mb-3">Max mileage (km)</p>
        <select
          className="input text-sm py-2"
          value={filters.maxMileage ?? ''}
          onChange={e => onChange({ maxMileage: e.target.value ? +e.target.value : undefined })}
        >
          <option value="">Any</option>
          <option value={50000}>Under 50,000</option>
          <option value={100000}>Under 100,000</option>
          <option value={150000}>Under 150,000</option>
          <option value={200000}>Under 200,000</option>
        </select>
      </div>

      {/* Colour swatches */}
      <div>
        <p className="label mb-3">Colour</p>
        <div className="flex flex-wrap gap-2">
          {COLOURS.map(c => (
            <button
              key={c}
              title={c}
              onClick={() => onChange({ colour: filters.colour?.toLowerCase() === c.toLowerCase() ? undefined : c.toLowerCase() })}
              className={cn(
                'w-6 h-6 border-2 transition-all',
                filters.colour?.toLowerCase() === c.toLowerCase() ? 'border-ink scale-110' : 'border-rule',
              )}
              style={{ background: c.toLowerCase() === 'silver' ? '#C0C0C0' : c.toLowerCase() }}
              aria-label={c}
              aria-pressed={filters.colour?.toLowerCase() === c.toLowerCase()}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => onChange(EMPTY_FILTERS)}
        className="btn btn-secondary text-sm py-2"
      >
        Clear all filters
      </button>
    </aside>
  )
}

// ─── VEHICLE CARD ─────────────────────────────────────────────
function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const img = vehicle.images?.[0]

  return (
    <article className="border border-rule group hover:border-ink transition-colors">
      <Link href={`/vehicles/${vehicle.slug}`} aria-label={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-grey-100">
          {img?.url ? (
            <Image
              src={img.url}
              alt={img.alt ?? `${vehicle.make} ${vehicle.model}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-grey-100">
              <svg viewBox="0 0 64 32" fill="none" className="w-16 h-8 text-grey-400" stroke="currentColor" strokeWidth="1.5">
                <rect x="6" y="8" width="52" height="18" rx="3"/>
                <circle cx="16" cy="26" r="5"/>
                <circle cx="48" cy="26" r="5"/>
                <path d="M6 14h6l5-7h18l7 7h8"/>
              </svg>
            </div>
          )}

          {vehicle.status === 'available' && vehicle.badge === 'new_arrival' && (
            <span className="absolute top-3 left-3 badge badge-red">New Arrival</span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="mono-label mb-1">{vehicle.year} · {formatMileage(vehicle.mileage)}</p>
        <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink leading-tight mb-1">
          {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-sm text-grey-600 mb-3">
          {vehicle.trim && `${vehicle.trim} · `}{vehicle.transmission}
        </p>
        <p className="font-display text-2xl font-bold text-ink">
          {formatPrice(vehicle.price)}
        </p>

        <div className="flex gap-2 mt-4">
          <Link
            href={`/vehicles/${vehicle.slug}`}
            className="btn btn-primary flex-1 text-center py-2.5"
          >
            View details
          </Link>
          <Link
            href={`/contact?vehicle=${encodeURIComponent(`${vehicle.year} ${vehicle.make} ${vehicle.model}`)}`}
            className="btn btn-secondary flex-1 text-center py-2.5"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  )
}

// ─── MAIN CATALOGUE ───────────────────────────────────────────
export function VehicleCatalogue({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const [filters, setFilters] = useState<VehicleFilters>({})
  const [, startTransition] = useTransition()

  const updateFilter = (partial: Partial<VehicleFilters>) => {
    startTransition(() => setFilters(prev => ({ ...prev, ...partial })))
  }

  const filtered = initialVehicles.filter(v => {
    if (filters.minPrice   && v.price < filters.minPrice)              return false
    if (filters.maxPrice   && v.price > filters.maxPrice)              return false
    if (filters.year       && v.year !== filters.year)                 return false
    if (filters.fuelType   && v.fuelType?.toLowerCase() !== filters.fuelType)   return false
    if (filters.transmission && v.transmission?.toLowerCase() !== filters.transmission) return false
    if (filters.maxMileage && v.mileage > filters.maxMileage)          return false
    if (filters.colour     && v.colour?.toLowerCase() !== filters.colour)       return false
    return true
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
      <FilterPanel filters={filters} onChange={updateFilter} />

      <div>
        <p className="mono-label text-grey-400 mb-6">
          {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} found
        </p>

        {filtered.length === 0 ? (
          <NoVehiclesState onReset={() => setFilters({})} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(v => <VehicleCard key={v._id} vehicle={v} />)}
          </div>
        )}
      </div>
    </div>
  )
}
