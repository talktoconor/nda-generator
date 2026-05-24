import { NextRequest, NextResponse } from "next/server";
import { getResend, EMAIL_FROM } from "@/lib/resend";
import { discountOffer } from "@/lib/email-templates";

/**
 * POST /api/subscribe
 * Capture email from exit-intent popup, send 15% discount code.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Store lead (log for now — integrate with Resend audience or DB later)
    console.log(`[LEAD] ${email} captured at ${new Date().toISOString()}`);

    // Send discount email if Resend is configured
    if (process.env.RESEND_API_KEY) {
      const resend = getResend();
      const template = discountOffer(email, "WELCOME15");
      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: template.subject,
        html: template.html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
