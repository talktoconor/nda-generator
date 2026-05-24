import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
let requestCount = 0;

const WINDOW_MS = 60 * 1000; // 1 minute

function getLimit(pathname: string): number {
  if (
    pathname.startsWith("/api/checkout") ||
    pathname.startsWith("/api/send-nda")
  ) {
    return 5;
  }
  if (
    pathname.startsWith("/api/subscribe") ||
    pathname.startsWith("/api/email")
  ) {
    return 10;
  }
  return 30;
}

function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

export function proxy(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  const pathname = request.nextUrl.pathname;
  const limit = getLimit(pathname);
  const now = Date.now();

  // Periodically clean up old entries
  requestCount++;
  if (requestCount % 100 === 0) {
    cleanupOldEntries();
  }

  const key = `${ip}:${pathname}`;
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return NextResponse.next();
  }

  if (entry.count >= limit) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((entry.resetTime - now) / 1000)),
        },
      }
    );
  }

  entry.count++;
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
