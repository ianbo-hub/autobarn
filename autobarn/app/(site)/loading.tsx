export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-rule border-t-red rounded-full animate-spin" />
        <p className="mono-label text-grey-400">Loading…</p>
      </div>
    </div>
  )
}
