import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const eventType: string = body.event_type ?? body.event ?? "unknown";
    const documentId: string = body.document_id ?? body.id ?? "unknown";

    console.log(
      `[SignWell Webhook] event=${eventType} document_id=${documentId}`
    );

    return Response.json({ received: true }, { status: 200 });
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
