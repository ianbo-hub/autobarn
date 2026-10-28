/**
 * lib/infrastructure/rate-limit.ts
 *
 * Shared in-memory rate limiter used across all API routes.
 * Each route instantiates its own limiter at module scope so
 * counters are isolated per endpoint.
 *
 * For multi-instance production deployments, swap the backing
 * store for Redis (e.g. @upstash/ratelimit) — the interface stays
 * the same, only the constructor changes.
 */

interface RateLimitEntry {
  count: number
  reset: number
}

export class InMemoryRateLimiter {
  private map = new Map<string, RateLimitEntry>()

  /**
   * @param limit          Maximum requests allowed in the window
   * @param windowMs       Rolling window length in milliseconds
   * @param cleanupEvery   Sweep expired entries every N requests (default 500).
   *                       Prevents the map growing unboundedly on long-running servers.
   */
  constructor(
    private readonly limit:        number,
    private readonly windowMs:     number,
    private readonly cleanupEvery: number = 500,
  ) {}

  private callCount = 0

  /** Remove all entries whose window has already expired. */
  private sweep(): void {
    const now = Date.now()
    for (const [key, entry] of this.map) {
      if (now > entry.reset) this.map.delete(key)
    }
  }

  /**
   * Returns true when the key has exceeded the limit.
   * Increments the counter when under limit.
   */
  isLimited(key: string): boolean {
    // Periodic cleanup so the map doesn't grow unboundedly in long-running processes
    if (++this.callCount % this.cleanupEvery === 0) this.sweep()

    const now   = Date.now()
    const entry = this.map.get(key)

    if (!entry || now > entry.reset) {
      this.map.set(key, { count: 1, reset: now + this.windowMs })
      return false
    }

    if (entry.count >= this.limit) return true

    entry.count++
    return false
  }
}
