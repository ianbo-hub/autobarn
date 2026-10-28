// Server-side Supabase client — use in Server Components, API Routes, Server Actions
import { createServerClient as _createServerClient } from '@supabase/ssr'
import { createClient as _createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()          { return cookieStore.getAll() },
        setAll(toSet: Array<{ name: string; value: string; options?: object }>) {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookies can't be set; ignore
          }
        },
      },
    },
  )
}

// Named alias used by API routes
export const createServerClient = createClient

/**
 * Service-role (admin) Supabase client.
 *
 * ⚠️  Bypasses Row Level Security — only call from verified server-side code.
 *     Never expose the service-role key to the client bundle.
 */
export function createAdminClient() {
  return _createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}
