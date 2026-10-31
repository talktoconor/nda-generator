/**
 * Resolve the site's public origin (scheme + host, no trailing slash).
 *
 * Order: a sanitized NEXT_PUBLIC_BASE_URL, then the current request's origin,
 * then Vercel's deployment URL, then localhost. The env value is normalized so
 * a missing scheme, stray quotes, whitespace or a trailing slash cannot
 * produce an invalid URL (Stripe rejects those with "Not a valid URL").
 */
export function resolveBaseUrl(requestOrigin?: string | null): string {
  const raw = (process.env.NEXT_PUBLIC_BASE_URL || "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "");

  if (raw) {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      return new URL(withScheme).origin;
    } catch {
      // fall through to runtime sources
    }
  }

  if (requestOrigin && /^https?:\/\//i.test(requestOrigin)) {
    return requestOrigin.replace(/\/+$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
