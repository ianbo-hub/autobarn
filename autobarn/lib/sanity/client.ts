import { createClient as _createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { unstable_cache } from 'next/cache'
import { publicEnv } from '@/lib/env'
import { logger } from '@/lib/logger'
import type { SanityImageSource } from '@/types'

const SANITY_FETCH_TIMEOUT_MS = 10_000 // 10 s

// Lazy-load the server-only token so this module can also be imported in
// edge/client contexts where SANITY_API_TOKEN is intentionally absent.
function getSanityToken(): string | undefined {
  if (typeof window !== 'undefined') return undefined          // client — no token
  return process.env.SANITY_API_TOKEN ?? undefined
}

export const sanityClient = _createClient({
  projectId:  publicEnv.SANITY_PROJECT_ID,
  dataset:    publicEnv.SANITY_DATASET,
  apiVersion: publicEnv.SANITY_API_VERSION,
  useCdn:     process.env.NODE_ENV === 'production',
  token:      getSanityToken(),
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// ─── Typed fetch helper with timeout + Next.js ISR cache tags ─

export async function sanityFetch<T>({
  query,
  params = {},
  tags   = [],
  revalidate = 3600,
}: {
  query:      string
  params?:    Record<string, unknown>
  tags?:      string[]
  revalidate?: number | false
}): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), SANITY_FETCH_TIMEOUT_MS)

  try {
    return await sanityClient.fetch<T>(query, params, {
      next:   { revalidate, tags },
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      logger.error('sanity', 'Fetch timed out', err, { query: query.slice(0, 80) })
      throw new Error('Content service timed out. Please refresh.')
    }
    logger.error('sanity', 'Fetch failed', err, { query: query.slice(0, 80) })
    throw err
  } finally {
    clearTimeout(timer)
  }
}

// ─── Cached version for expensive/repeated queries ────────────
// Uses Next.js unstable_cache so the same query result is shared
// across concurrent requests in the same deployment rather than
// each request hitting the Sanity CDN separately.

export function cachedSanityFetch<T>(
  cacheKey: string[],
  fetcher:  () => Promise<T>,
  options?: { revalidate?: number; tags?: string[] },
) {
  return unstable_cache(fetcher, cacheKey, {
    revalidate: options?.revalidate ?? 3600,
    tags:       options?.tags,
  })()
}
