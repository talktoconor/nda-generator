import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import type { NdaData } from "@/lib/nda-template";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return Response.json({ error: "Missing session_id" }, { status: 400 });
  }

  const session = await getStripe().checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid" && session.metadata?.ndaData) {
    const ndaData: NdaData = JSON.parse(session.metadata.ndaData);
    const tier = session.metadata?.tier || "basic";
    return Response.json({ paid: true, ndaData, tier });
  }

  return Response.json({ paid: false });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tier = "basic", ...ndaData } = body as { tier?: string } & NdaData;

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

  const tierPricing: Record<string, number> = {
    basic: 2900,
    pro: 5900,
    biz: 5900, // TODO: implement subscription mode for business tier
  };
  const amount = tierPricing[tier] || 2900;
  const tierLabel =
    tier === "pro" ? " Professional" : tier === "biz" ? " Business" : "";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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
}
