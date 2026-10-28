'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { Toast, ToastSeverity } from '@/types'
import { cn } from '@/lib/utils'

// ─── SEVERITY CONFIG ──────────────────────────────────────────
const config: Record<ToastSeverity, { border: string; icon: string; iconColor: string }> = {
  success: { border: 'border-l-green',  icon: '✓', iconColor: 'text-green' },
  warning: { border: 'border-l-amber',  icon: '⚠', iconColor: 'text-amber' },
  error:   { border: 'border-l-red',    icon: '✕', iconColor: 'text-red'   },
  info:    { border: 'border-l-[#9A9A9A]', icon: 'ℹ', iconColor: 'text-[#9A9A9A]' },
}

// ─── SINGLE TOAST ─────────────────────────────────────────────
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const { border, icon, iconColor } = config[toast.severity]
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startTimer = useCallback(() => {
    if (toast.duration && toast.duration > 0) {
      timerRef.current = setTimeout(() => onDismiss(toast.id), toast.duration)
    }
  }, [toast, onDismiss])

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  useEffect(() => {
    startTimer()
    return clearTimer
  }, [startTimer])

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'animate-slide-in-r flex items-start gap-3 bg-ink text-cream',
        'border-l-4 p-3 pl-4 shadow-lg max-w-sm w-full',
        border,
      )}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
    >
      <span className={cn('text-base leading-none mt-0.5 flex-shrink-0', iconColor)}>
        {icon}
      </span>
      <span className="text-sm leading-snug flex-1">
        {toast.message}
      </span>
      <button
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="text-grey-400 hover:text-cream transition-colors ml-auto pl-2 text-lg leading-none flex-shrink-0"
      >
        ×
      </button>
    </div>
  )
}

// ─── TOAST LIST (portal target) ───────────────────────────────
export function ToastList({
  toasts,
  onDismiss,
}: {
  toasts: Toast[]
  onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 items-end"
      style={{ paddingRight: 'env(safe-area-inset-right, 0px)' }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
