export interface LandingPageData {
  slug: string;
  headline: string;
  subheadline: string;
  bullets: string[];
  ctaText: string;
}

export const LANDING_PAGES: LandingPageData[] = [
  {
    slug: "nda",
    headline: "Create a Legally-Sound NDA in 5 Minutes",
    subheadline: "No lawyer needed. Professional NDA with built-in e-signature. From $29.",
    bullets: [
      "AI-customized clauses for your specific situation",
      "Mutual or unilateral — you choose",
      "Both parties sign electronically",
      "Instant PDF download",
      "Enforceable in all 50 states",
    ],
    ctaText: "Create Your NDA Now",
  },
  {
    slug: "mutual-nda",
    headline: "Mutual NDA Generator — Protect Both Parties",
    subheadline: "When both sides share confidential information, you need a mutual NDA. Create one in minutes.",
    bullets: [
      "Equal protection for both parties",
      "Clear obligations and exclusions",
      "Industry-standard legal language",
      "E-signature for both parties",
      "State-specific governing law",
    ],
    ctaText: "Create Mutual NDA",
  },
  {
    slug: "startup-nda",
    headline: "NDA for Startups — Before You Share Your Idea",
    subheadline: "Protect your startup's confidential information before investor pitches, partner discussions, or hiring.",
    bullets: [
      "Tailored for startup scenarios",
      "Covers trade secrets and IP",
      "Fast — ready before your next meeting",
      "Fraction of the cost of a lawyer",
      "Used by thousands of founders",
    ],
    ctaText: "Protect Your Startup",
  },
  {
    slug: "employee-nda",
    headline: "Employee NDA — Protect Your Business Secrets",
    subheadline: "Require NDAs from new hires to safeguard your company's confidential information.",
    bullets: [
      "Onboarding-ready in minutes",
      "Covers trade secrets and client data",
      "Customizable confidentiality scope",
      "E-signature for remote hiring",
      "Enforceable employee obligations",
    ],
    ctaText: "Create Employee NDA",
  },
  {
    slug: "contractor-nda",
    headline: "Contractor NDA — Secure Your IP",
    subheadline: "Before sharing project details with freelancers or contractors, get an NDA signed.",
    bullets: [
      "Works for freelancers and agencies",
      "Protects project-specific information",
      "Unilateral or mutual options",
      "Send and sign in minutes",
      "Clear return-of-materials clause",
    ],
    ctaText: "Create Contractor NDA",
  },
];
