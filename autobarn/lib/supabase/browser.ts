'use client'

/**
 * lib/supabase/browser.ts
 *
 * Client-side (browser) Supabase client.
 * Used for Supabase Auth flows in 'use client' components (login, signup, etc.).
 * Singleton — returns the same instance on every call to avoid duplicate connections.
 */
import { createBrowserClient } from '@supabase/ssr'

type SupabaseBrowserClient = ReturnType<typeof createBrowserClient>
let _client: SupabaseBrowserClient | null = null

export function createBrowserSupabaseClient(): SupabaseBrowserClient {
  if (_client) return _client
  _client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  return _client
}
