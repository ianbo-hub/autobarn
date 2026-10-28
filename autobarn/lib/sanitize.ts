/**
 * lib/sanitize.ts
 *
 * XSS prevention utilities.
 *
 * htmlEscape  — Escapes HTML special characters so user input can be safely
 *               embedded in an HTML string (e.g. email templates). Use this
 *               any time you interpolate user data into a raw HTML string.
 *
 * stripTags   — Removes all HTML tags from a string (for plain-text contexts).
 *
 * sanitizeText — Trims whitespace + strips tags; use for DB storage of
 *               free-text fields that should never contain HTML.
 */

const HTML_ENTITY_MAP: Record<string, string> = {
  '&':  '&amp;',
  '<':  '&lt;',
  '>':  '&gt;',
  '"':  '&quot;',
  "'":  '&#x27;',
  '/':  '&#x2F;',
  '`':  '&#x60;',
  '=':  '&#x3D;',
}

/**
 * Escapes a value for safe insertion into an HTML string.
 * Converts &, <, >, ", ', /, `, = to HTML entities.
 *
 * @example
 *   `<p>${htmlEscape(user.message)}</p>`
 *   // user.message = '<script>alert(1)</script>'
 *   // → <p>&lt;script&gt;alert(1)&lt;&#x2F;script&gt;</p>
 */
export function htmlEscape(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).replace(/[&<>"'`=/]/g, char => HTML_ENTITY_MAP[char] ?? char)
}

/**
 * Removes all HTML/XML tags from a string.
 * Useful for stripping any markup before displaying text in a plain-text context.
 */
export function stripTags(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).replace(/<[^>]*>/g, '')
}

/**
 * Sanitizes a free-text input for safe storage:
 *   1. Converts to string
 *   2. Strips HTML tags
 *   3. Trims surrounding whitespace
 *   4. Collapses consecutive whitespace > 2 newlines into 2 (prevents spam formatting)
 */
export function sanitizeText(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/<[^>]*>/g, '')      // strip HTML tags
    .trim()
    .replace(/\n{3,}/g, '\n\n')   // collapse excessive newlines
}
