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

const EMPTY_FILTERS: VehicleFilters = {
  minPrice:     undefined,
  maxPrice:     undefined,
  year:         undefined,
  fuelType:     undefined,
  transmission: undefined,
  maxMileage:   undefined,
  colour:       undefined,
}

function FilterPanel({
  filters,
  onChange,
}: {
  filters: VehicleFilters
  onChange: (f: Partial<VehicleFilters>) => void
}) {
  return (
    <aside aria-label="Vehicle filters" className="border border-rule p-6 flex flex-col gap-6 h-fit sticky top-24">
      <div>
        <p className="label mb-3">Price range (KES)</p>
        <div className="flex items-center gap-2 text-sm text-grey-600">
          <input
            type="number"
            placeholder="Min"
            min={0}
            step={50000}
            value={filters.minPrice ?? ''}
            onChange={e => onChange({ minPrice: e.target.value ? +e.target.value : undefined })}
            className="input w-full text-sm py-2 px-3"
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max"
            min={0}
            step={50000}
            value={filters.maxPrice ?? ''}
            onChange={e => onChange({ maxPrice: e.target.value ? +e.target.value : undefined })}
            className="input w-full text-sm py-2 px-3"
          />
        </div>
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
            <div className="w-full h-full flex items-center justify-center text-grey-400 text-4xl">🚗</div>
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
