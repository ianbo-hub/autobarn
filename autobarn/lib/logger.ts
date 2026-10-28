// ─── AutoBarn Structured Logger ───────────────────────────────
//
// Writes structured JSON to stdout/stderr in production so that
// log aggregators (Vercel Log Drains, Logtail, Sentry, Datadog)
// can parse fields without regex hacks.
//
// In development it pretty-prints for readability.
// To wire up Sentry: import * as Sentry from '@sentry/nextjs' and
// call Sentry.captureException(err) inside logError.
//

type Level = 'info' | 'warn' | 'error'

interface LogEntry {
  level:     Level
  service:   string
  message:   string
  ts:        string
  [key: string]: unknown
}

const isDev = process.env.NODE_ENV !== 'production'

function emit(level: Level, service: string, message: string, meta?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    service,
    message,
    ts: new Date().toISOString(),
    ...meta,
  }

  if (isDev) {
    const prefix = level === 'error' ? '🔴' : level === 'warn' ? '🟡' : '🟢'
    const extra  = meta ? ' ' + JSON.stringify(meta) : ''
    const fn     = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
    fn(`${prefix} [${service}] ${message}${extra}`)
  } else {
    const fn = level === 'error' ? console.error : console.log
    fn(JSON.stringify(entry))
  }
}

export const logger = {
  info:  (service: string, message: string, meta?: Record<string, unknown>) =>
    emit('info', service, message, meta),
  warn:  (service: string, message: string, meta?: Record<string, unknown>) =>
    emit('warn', service, message, meta),
  error: (service: string, message: string, err?: unknown, meta?: Record<string, unknown>) => {
    const errMeta: Record<string, unknown> = { ...meta }
    if (err instanceof Error) {
      errMeta.errorMessage = err.message
      errMeta.errorName    = err.name
      if (err.stack && isDev) errMeta.stack = err.stack
    } else if (err !== undefined) {
      errMeta.error = String(err)
    }
    emit('error', service, message, errMeta)
  },
}
