import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  heading: string
  subtext: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, heading, subtext, action, className }: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-label={heading}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'border border-rule py-20 px-8',
        className,
      )}
    >
      {icon && (
        <div className="text-grey-400 mb-6 text-5xl leading-none" aria-hidden="true">
          {icon}
        </div>
      )}

      <p className="eyebrow justify-center w-fit mx-auto">No Results</p>

      <h3 className="font-display text-2xl font-bold uppercase tracking-tight mt-2 mb-3 text-ink max-w-sm">
        {heading}
      </h3>
      <p className="text-grey-600 text-sm leading-relaxed max-w-xs">
        {subtext}
      </p>

      {action && <div className="mt-8">{action}</div>}
    </div>
  )
}

// ─── PRESET VARIANTS ──────────────────────────────────────────

export function NoVehiclesState({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon="🚗"
      heading="No vehicles found"
      subtext="Try adjusting your filters — we add new stock regularly."
      action={
        onReset && (
          <button onClick={onReset} className="btn btn-secondary">
            Clear filters
          </button>
        )
      }
    />
  )
}

export function NoProductsState({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon="🧴"
      heading="No products match"
      subtext="Try a different category or clear the price filter."
      action={
        onReset && (
          <button onClick={onReset} className="btn btn-secondary">
            Reset filters
          </button>
        )
      }
    />
  )
}

export function NoBlogState() {
  return (
    <EmptyState
      icon="📰"
      heading="No posts yet"
      subtext="We're working on articles about car care, buying guides, and more. Check back soon."
    />
  )
}

export function SearchEmptyState({ query }: { query: string }) {
  return (
    <EmptyState
      icon="🔍"
      heading={`Nothing for "${query}"`}
      subtext="We couldn't find what you're looking for. Try different keywords or browse all vehicles."
      action={
        <a href="/" className="btn btn-secondary">
          Browse all vehicles
        </a>
      }
    />
  )
}
