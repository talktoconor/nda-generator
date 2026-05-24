import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!);
  }
  return _resend;
}

// Use onboarding@resend.dev until ndanow.app is added as a verified sending domain in Resend
export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "NDANow <onboarding@resend.dev>";
