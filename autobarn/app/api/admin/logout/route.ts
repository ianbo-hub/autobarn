/**
 * app/api/admin/logout/route.ts
 *
 * Signs the current user out of Supabase and redirects to /admin/login.
 * Called via a POST form submission from the admin layout header.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  return NextResponse.redirect(
    new URL('/admin/login', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    { status: 303 }, // 303 See Other — correct for POST → GET redirect
  )
}
