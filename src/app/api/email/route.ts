import { NextRequest, NextResponse } from "next/server";
import { getResend, EMAIL_FROM } from "@/lib/resend";
import {
  purchaseConfirmation,
  signingGuide,
  followUpUpsell,
  subscriptionUpsell,
  discountOffer,
} from "@/lib/email-templates";

/**
 * POST /api/email
 * Send transactional emails. Accepts:
 *   - type: "purchase" | "signing-guide" | "upsell" | "subscription" | "discount"
 *   - to: recipient email
 *   - data: template-specific data
 *
 * Rate limiting is handled by middleware.
 */
export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { type, to, data } = body;

    if (!type || !to) {
      return NextResponse.json({ error: "Missing type or to" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Validate required data fields per template type
    if (type === "purchase") {
      if (!data?.disclosingPartyName || !data?.receivingPartyName || !data?.ndaType) {
        return NextResponse.json({ error: "Missing required data for purchase email" }, { status: 400 });
      }
    } else if (type === "signing-guide" || type === "upsell" || type === "subscription") {
      if (!data?.recipientName) {
        return NextResponse.json({ error: "Missing recipientName" }, { status: 400 });
      }
    }

    let email: { subject: string; html: string };

    switch (type) {
      case "purchase":
        email = purchaseConfirmation({
          disclosingPartyName: data.disclosingPartyName,
          receivingPartyName: data.receivingPartyName,
          ndaType: data.ndaType,
          governingState: data.governingState,
        });
        break;
      case "signing-guide":
        email = signingGuide(data.recipientName);
        break;
      case "upsell":
        email = followUpUpsell(data.recipientName);
        break;
      case "subscription":
        email = subscriptionUpsell(data.recipientName);
        break;
      case "discount":
        email = discountOffer(to, data.discountCode || "WELCOME15");
        break;
      default:
        return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
    }

    const resend = getResend();
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: email.subject,
      html: email.html,
    });

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
