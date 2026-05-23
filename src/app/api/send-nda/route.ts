import { NextRequest } from "next/server";
import type { NdaData } from "@/lib/nda-template";
import { generateNdaHtml } from "@/lib/nda-html";

export async function POST(request: NextRequest) {
  const { ndaData, sessionId } = (await request.json()) as {
    ndaData: NdaData;
    sessionId: string;
  };

  const apiKey = process.env.SIGNWELL_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "SignWell API key not configured" },
      { status: 500 }
    );
  }

  const html = generateNdaHtml(ndaData);
  const htmlBase64 = Buffer.from(html).toString("base64");

  const isMutual = ndaData.ndaType === "mutual";
  const docName = `${isMutual ? "Mutual" : "Unilateral"} NDA — ${ndaData.disclosingPartyName} & ${ndaData.receivingPartyName}`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch("https://www.signwell.com/api/v1/documents", {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      test_mode: process.env.SIGNWELL_TEST_MODE !== "false",
      name: docName,
      subject: `NDA ready for your signature — ${docName}`,
      message: `Please review and sign this ${isMutual ? "mutual" : ""} Non-Disclosure Agreement. Once both parties have signed, you will each receive a copy of the fully executed document.`,
      files: [
        {
          name: "NDA.html",
          file_base64: htmlBase64,
        },
      ],
      recipients: [
        {
          id: "1",
          name: ndaData.disclosingPartyName,
          email: ndaData.disclosingPartyEmail,
        },
        {
          id: "2",
          name: ndaData.receivingPartyName,
          email: ndaData.receivingPartyEmail,
        },
      ],
      with_signature_page: true,
      apply_signing_order: false,
      reminders: true,
      allow_decline: true,
      expires_in: 14,
      redirect_url: `${baseUrl}/signed`,
      metadata: {
        stripeSessionId: sessionId,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("SignWell error:", err);
    return Response.json(
      { error: "Failed to send NDA for signing" },
      { status: 500 }
    );
  }

  const doc = await res.json();

  return Response.json({
    documentId: doc.id,
    status: "sent",
  });
}
