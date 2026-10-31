import { NextRequest } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { resolveBaseUrl } from "@/lib/base-url";
import type { NdaData } from "@/lib/nda-template";

function errorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: unknown }).message);
  }
  return String(err);
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return Response.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid" && session.metadata?.ndaData) {
      const ndaData: NdaData = JSON.parse(session.metadata.ndaData);
      const tier = session.metadata?.tier || "basic";
      return Response.json({ paid: true, ndaData, tier });
    }

    return Response.json({ paid: false });
  } catch (err) {
    console.error("[checkout] session lookup failed:", errorMessage(err));
    return Response.json(
      { paid: false, error: "Could not verify payment. Please contact support." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { tier: requestedTier, ...ndaData } = body as { tier?: string } & NdaData;
  // Only two tiers are sold. Unknown or retired values (such as the old "biz") fall back to Basic.
  const tier = requestedTier === "pro" ? "pro" : "basic";

  // Validate required fields
  if (
    !ndaData.disclosingPartyName ||
    !ndaData.disclosingPartyEmail ||
    !ndaData.receivingPartyName ||
    !ndaData.receivingPartyEmail ||
    !ndaData.purpose
  ) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    !emailRegex.test(ndaData.disclosingPartyEmail) ||
    !emailRegex.test(ndaData.receivingPartyEmail)
  ) {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Stripe metadata values are limited to 500 chars — leave room for key overhead
  const ndaJson = JSON.stringify(ndaData);
  if (ndaJson.length > 490) {
    return Response.json(
      { error: "Form data too long. Please shorten names or addresses." },
      { status: 400 }
    );
  }

  if (!isStripeConfigured()) {
    console.error("[checkout] STRIPE_SECRET_KEY is not set");
    return Response.json(
      { error: "Payments are temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const amount = tier === "pro" ? 5900 : 2900;
  const tierLabel = tier === "pro" ? " Professional" : "";

  const baseUrl = resolveBaseUrl(request.nextUrl.origin);

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: true,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount,
            product_data: {
              name: `${ndaData.ndaType === "mutual" ? "Mutual" : "Unilateral"}${tierLabel} Non-Disclosure Agreement`,
              description: `NDA between ${ndaData.disclosingPartyName} and ${ndaData.receivingPartyName}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        ndaData: ndaJson,
        tier,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/create`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] session create failed:", errorMessage(err));
    return Response.json(
      { error: "Payments are temporarily unavailable. Please try again shortly." },
      { status: 502 }
    );
  }
}
