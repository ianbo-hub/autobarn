'use client'

import {
  createContext, useCallback, useContext, useRef, useState,
} from 'react'
import type { Toast, ToastSeverity } from '@/types'
import { uid } from '@/lib/utils'
import { ToastList } from './Toast'

interface ToastContextValue {
  toast: (message: string, severity?: ToastSeverity, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts]   = useState<Toast[]>([])
  const timers                = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const toast = useCallback(
    (message: string, severity: ToastSeverity = 'info', duration = 4000) => {
      const id = uid()
      const newToast: Toast = { id, message, severity, duration }

      setToasts(prev => {
        // Max 3 visible at once — drop oldest
        const trimmed = prev.length >= 3 ? prev.slice(1) : prev
        return [...trimmed, newToast]
      })

      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastList toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx.toast
}
