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
    return Response.json({ paid: true, ndaData });
  }

  return Response.json({ paid: false });
}

export async function POST(request: NextRequest) {
  const body: NdaData = await request.json();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 2900,
          product_data: {
            name: `${body.ndaType === "mutual" ? "Mutual" : "Unilateral"} Non-Disclosure Agreement`,
            description: `NDA between ${body.disclosingPartyName} and ${body.receivingPartyName}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      ndaData: JSON.stringify(body),
    },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/create`,
  });

  return Response.json({ url: session.url });
}
