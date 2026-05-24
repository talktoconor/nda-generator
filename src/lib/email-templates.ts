/**
 * Email templates for NDANow transactional and follow-up sequences.
 * All templates return { subject, html } for use with Resend.
 */

const BRAND_COLOR = "#2563eb";
const FOOTER = `
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
    <p>NDANow provides document templates for informational purposes only and does not constitute legal advice.</p>
    <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} NDANow. All rights reserved.</p>
    <p style="margin-top: 4px;"><a href="https://www.ndanow.app" style="color: #6b7280;">ndanow.app</a></p>
  </div>
`;

function wrapEmail(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111827; line-height: 1.6;">
      <div style="margin-bottom: 24px;">
        <span style="font-size: 20px; font-weight: 600; letter-spacing: -0.025em;">NDA<span style="color: ${BRAND_COLOR};">Now</span></span>
      </div>
      ${content}
      ${FOOTER}
    </body>
    </html>
  `;
}

interface PurchaseConfirmationProps {
  disclosingPartyName: string;
  receivingPartyName: string;
  ndaType: string;
  governingState: string;
}

export function purchaseConfirmation(props: PurchaseConfirmationProps) {
  const { disclosingPartyName, receivingPartyName, ndaType, governingState } = props;
  return {
    subject: "Your NDA is ready - NDANow",
    html: wrapEmail(`
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Your NDA is ready!</h1>
      <p>Thanks for choosing NDANow. Your ${ndaType} NDA has been generated and sent for e-signature.</p>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">NDA Details</h3>
        <table style="width: 100%; font-size: 14px;">
          <tr><td style="padding: 4px 0; color: #6b7280;">Type</td><td style="padding: 4px 0; font-weight: 500;">${ndaType === "mutual" ? "Mutual (Two-Way)" : "Unilateral (One-Way)"}</td></tr>
          <tr><td style="padding: 4px 0; color: #6b7280;">Party A</td><td style="padding: 4px 0; font-weight: 500;">${disclosingPartyName}</td></tr>
          <tr><td style="padding: 4px 0; color: #6b7280;">Party B</td><td style="padding: 4px 0; font-weight: 500;">${receivingPartyName}</td></tr>
          <tr><td style="padding: 4px 0; color: #6b7280;">Jurisdiction</td><td style="padding: 4px 0; font-weight: 500;">${governingState}</td></tr>
        </table>
      </div>

      <h2 style="font-size: 18px; font-weight: 600; margin-top: 28px;">Next steps</h2>
      <ol style="padding-left: 20px; font-size: 14px;">
        <li style="margin-bottom: 8px;"><strong>Check your inbox</strong> &mdash; both parties will receive an e-signature request from SignWell.</li>
        <li style="margin-bottom: 8px;"><strong>Sign the NDA</strong> &mdash; click the link in the email and add your electronic signature.</li>
        <li style="margin-bottom: 8px;"><strong>Download</strong> &mdash; once both parties sign, you'll get the executed PDF automatically.</li>
      </ol>

      <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">You can also download a PDF copy anytime from your purchase confirmation page.</p>
    `),
  };
}

export function signingGuide(recipientName: string) {
  return {
    subject: "How to get your NDA signed quickly",
    html: wrapEmail(`
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Quick tips for getting your NDA signed</h1>
      <p>Hi ${recipientName},</p>
      <p>Here are a few tips to make sure your NDA gets signed quickly:</p>

      <div style="margin: 20px 0;">
        <div style="display: flex; margin-bottom: 16px;">
          <div style="min-width: 32px; height: 32px; background: #dbeafe; color: ${BRAND_COLOR}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; margin-right: 12px;">1</div>
          <div>
            <strong>Send a heads-up</strong>
            <p style="margin: 4px 0 0; font-size: 14px; color: #6b7280;">Let the other party know to expect an e-signature request from SignWell. It'll arrive in their inbox shortly.</p>
          </div>
        </div>
        <div style="display: flex; margin-bottom: 16px;">
          <div style="min-width: 32px; height: 32px; background: #dbeafe; color: ${BRAND_COLOR}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; margin-right: 12px;">2</div>
          <div>
            <strong>Check spam folders</strong>
            <p style="margin: 4px 0 0; font-size: 14px; color: #6b7280;">Sometimes signature requests land in spam. Ask both parties to check.</p>
          </div>
        </div>
        <div style="display: flex; margin-bottom: 16px;">
          <div style="min-width: 32px; height: 32px; background: #dbeafe; color: ${BRAND_COLOR}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; margin-right: 12px;">3</div>
          <div>
            <strong>Follow up</strong>
            <p style="margin: 4px 0 0; font-size: 14px; color: #6b7280;">If the NDA hasn't been signed within 48 hours, send a friendly reminder. Most NDAs are signed within 24 hours.</p>
          </div>
        </div>
      </div>

      <p style="font-size: 14px; color: #6b7280;">Need help? Reply to this email and we'll get back to you.</p>
    `),
  };
}

export function followUpUpsell(recipientName: string) {
  return {
    subject: "Need more legal documents?",
    html: wrapEmail(`
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Need more legal documents?</h1>
      <p>Hi ${recipientName},</p>
      <p>You created an NDA with NDANow recently. Many of our customers also need these documents:</p>

      <div style="margin: 20px 0;">
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <strong>Contractor Agreement</strong>
          <p style="font-size: 14px; color: #6b7280; margin: 4px 0;">Define scope, payment terms, and IP ownership with freelancers and contractors.</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <strong>Terms of Service</strong>
          <p style="font-size: 14px; color: #6b7280; margin: 4px 0;">Protect your app or website with professionally drafted ToS.</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <strong>Privacy Policy</strong>
          <p style="font-size: 14px; color: #6b7280; margin: 4px 0;">Stay compliant with GDPR, CCPA, and other privacy regulations.</p>
        </div>
      </div>

      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
        <p style="font-weight: 600; font-size: 18px; margin: 0 0 8px;">Startup Legal Pack</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 16px;">NDA + Contractor Agreement + ToS + Privacy Policy + more</p>
        <p style="font-size: 24px; font-weight: 700; color: ${BRAND_COLOR}; margin: 0 0 4px;">$149 <span style="font-size: 14px; font-weight: 400; color: #9ca3af; text-decoration: line-through;">$224</span></p>
        <p style="font-size: 12px; color: #6b7280; margin: 0 0 16px;">Save 33% vs. buying individually</p>
        <a href="https://www.ndanow.app/pricing" style="display: inline-block; background: ${BRAND_COLOR}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">View Pricing</a>
      </div>

      <p style="font-size: 14px; color: #6b7280;">Coming soon to NDANow. We'll notify you when these documents are available.</p>
    `),
  };
}

export function subscriptionUpsell(recipientName: string) {
  return {
    subject: "Unlimited NDAs for $99/mo - NDANow Business",
    html: wrapEmail(`
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Need NDAs on a regular basis?</h1>
      <p>Hi ${recipientName},</p>
      <p>If you're creating NDAs regularly, our Business plan could save you significant time and money:</p>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 12px; font-size: 18px;">NDANow Business &mdash; $99/mo</h3>
        <ul style="padding-left: 20px; font-size: 14px; margin: 0;">
          <li style="margin-bottom: 6px;">Unlimited NDA generation</li>
          <li style="margin-bottom: 6px;">Custom clause library</li>
          <li style="margin-bottom: 6px;">Multiple export formats (PDF, DOCX)</li>
          <li style="margin-bottom: 6px;">E-signature included on all NDAs</li>
          <li style="margin-bottom: 6px;">NDA tracking dashboard</li>
          <li>Priority support</li>
        </ul>
      </div>

      <p style="font-size: 14px;">That's less than the cost of <strong>two individual NDAs</strong> — create as many as you need.</p>

      <div style="text-align: center; margin: 24px 0;">
        <a href="https://www.ndanow.app/pricing" style="display: inline-block; background: ${BRAND_COLOR}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">Upgrade to Business</a>
      </div>
    `),
  };
}

export function discountOffer(email: string, discountCode: string) {
  return {
    subject: "15% off your first NDA - NDANow",
    html: wrapEmail(`
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Here's 15% off your first NDA</h1>
      <p>Thanks for your interest in NDANow! Use the code below to get 15% off your first NDA.</p>

      <div style="background: #eff6ff; border: 2px dashed ${BRAND_COLOR}; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
        <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">Your discount code</p>
        <p style="font-size: 28px; font-weight: 700; color: ${BRAND_COLOR}; margin: 0; letter-spacing: 0.05em;">${discountCode}</p>
        <p style="font-size: 14px; color: #6b7280; margin: 8px 0 0;">Valid for 48 hours</p>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="https://www.ndanow.app/create" style="display: inline-block; background: ${BRAND_COLOR}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">Create Your NDA Now</a>
      </div>

      <p style="font-size: 14px; color: #6b7280;">Professional NDA in 2 minutes. No lawyer needed. Just $24.65 with your discount.</p>
    `),
  };
}
