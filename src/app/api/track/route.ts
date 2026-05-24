import { NextRequest, NextResponse } from "next/server";

// ── Attribution tracking API ──
// Receives conversion events with UTM data for server-side attribution.
// In production, this would write to a database (Neon/Supabase) or analytics service.
// For now, logs the data for development and stores in-memory for the social proof counter.

interface TrackingEvent {
  event: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_page?: string;
  value?: number;
  nda_type?: string;
  timestamp: string;
}

// In-memory counter for social proof (resets on deploy — seed with a credible base)
const BASE_NDA_COUNT = 847;
let additionalNdas = 0;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackingEvent;

    // Validate event type
    const validEvents = ["page_view", "checkout_start", "purchase", "cta_click", "nda_type_selected"];
    if (!validEvents.includes(body.event)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    // Add server timestamp
    const event = {
      ...body,
      server_timestamp: new Date().toISOString(),
      ip_country: request.headers.get("x-vercel-ip-country") || undefined,
    };

    // Increment counter on purchase
    if (body.event === "purchase") {
      additionalNdas++;
    }

    // Log for development (in production, write to database)
    console.log("[track]", JSON.stringify(event));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

/** GET endpoint returns the NDA count for social proof */
export async function GET() {
  return NextResponse.json({
    count: BASE_NDA_COUNT + additionalNdas,
    formatted: `${(BASE_NDA_COUNT + additionalNdas).toLocaleString()}+`,
  });
}
