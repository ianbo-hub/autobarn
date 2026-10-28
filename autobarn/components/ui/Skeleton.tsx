import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  'aria-label'?: string
}

export function Skeleton({ className, 'aria-label': label }: SkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label={label ?? 'Loading…'}
      className={cn('skeleton rounded-none', className)}
    />
  )
}

// ─── VEHICLE CARD SKELETON ────────────────────────────────────
export function VehicleCardSkeleton() {
  return (
    <div aria-busy="true" className="border border-rule p-0">
      <Skeleton className="w-full aspect-[16/10]" />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-3.5 w-3/5" />
        <Skeleton className="h-3.5 w-2/5 mt-1" />
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  )
}

// ─── PRODUCT CARD SKELETON ────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div aria-busy="true" className="border border-rule">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-6 w-2/5 mt-1" />
        <Skeleton className="h-10 w-full mt-2" />
      </div>
    </div>
  )
}

// ─── BLOG CARD SKELETON ───────────────────────────────────────
export function BlogCardSkeleton() {
  return (
    <div aria-busy="true" className="border border-rule">
      <Skeleton className="w-full aspect-video" />
      <div className="p-5 flex flex-col gap-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-full mt-2" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>
    </div>
  )
}

// ─── PAGE HERO SKELETON ───────────────────────────────────────
export function HeroSkeleton() {
  return (
    <div aria-busy="true" className="w-full h-screen skeleton" />
  )
}
