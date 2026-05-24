import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL } from "@/lib/constants";
import { ProductSchema, FAQSchema, BreadcrumbSchema } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Pricing — NDANow | Professional NDAs from $29",
  description:
    "Create legally-sound NDAs starting at $29. Choose Basic, Professional, or Business plans. No subscription required for one-time purchases.",
  openGraph: {
    title: "Pricing — NDANow",
    description: "Professional NDAs from $29. No lawyer needed.",
    url: `${BASE_URL}/pricing`,
    siteName: "NDANow",
    type: "website",
  },
  alternates: { canonical: `${BASE_URL}/pricing` },
};

const tiers = [
  {
    name: "Basic",
    price: "$29",
    period: "one-time",
    description: "Everything you need for a single NDA.",
    cta: "Create NDA",
    href: "/create",
    popular: false,
    features: [
      "Mutual or unilateral NDA",
      "AI-customized clauses",
      "PDF download",
      "E-signature via SignWell",
      "Email delivery to both parties",
      "State-specific governing law",
    ],
  },
  {
    name: "Professional",
    price: "$59",
    period: "one-time",
    description: "Advanced options for complex deals.",
    cta: "Create NDA",
    href: "/create?tier=pro",
    popular: true,
    features: [
      "Everything in Basic",
      "Customizable clauses",
      "DOCX + PDF export",
      "Up to 3 parties",
      "Priority support",
      "Revision included",
    ],
  },
  {
    name: "Business",
    price: "$99",
    period: "/month",
    description: "Unlimited NDAs for growing teams.",
    cta: "Start Free Trial",
    href: "/create?tier=biz",
    popular: false,
    features: [
      "Everything in Professional",
      "Unlimited NDAs",
      "Team access (5 seats)",
      "Template library",
      "Bulk generation",
      "NDA tracking dashboard",
    ],
  },
];

const faqs = [
  { q: "Do I need a subscription to create an NDA?", a: "No. The Basic ($29) and Professional ($59) plans are one-time purchases. You only pay when you need an NDA. The Business plan is a monthly subscription for teams that need unlimited NDAs." },
  { q: "Is the NDA legally binding?", a: "Yes. Our NDAs use standard legal language recognized across all 50 US states. The e-signature functionality through SignWell is legally binding under the ESIGN Act and UETA." },
  { q: "Can I customize the NDA clauses?", a: "The Basic plan uses AI-optimized standard clauses. The Professional and Business plans allow you to customize individual clauses, add special provisions, and modify terms to fit your needs." },
  { q: "What if I need help or the NDA isn't right?", a: "We offer a 30-day money-back guarantee on all plans. If the NDA doesn't meet your needs, contact support for a full refund." },
  { q: "How does e-signature work?", a: "After payment, your NDA is automatically sent to both parties via SignWell for electronic signature. Both parties receive an email with a link to review and sign. Once both sign, everyone gets a copy of the fully executed document." },
];

export default function PricingPage() {
  return (
    <div className="min-h-full flex flex-col">
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Pricing", href: "/pricing" }]} />
      <ProductSchema name="NDA Generator" description="Create legally-sound NDAs in minutes" price="29" />
      <FAQSchema questions={faqs} />

      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            NDA<span className="text-blue-600">Now</span>
          </Link>
          <Link href="/create" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Create NDA &rarr;
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            Pay per NDA or subscribe for unlimited access. No hidden fees. 30-day money-back guarantee.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-xl border-2 p-6 flex flex-col ${
                  tier.popular
                    ? "border-blue-600 shadow-lg shadow-blue-100"
                    : "border-gray-200"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-gray-500 text-sm">{tier.period}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{tier.description}</p>
                <Link
                  href={tier.href}
                  className={`mt-6 block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    tier.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {tier.cta}
                </Link>
                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-3xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-bold mb-10 text-center">Frequently asked questions</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 text-sm text-gray-400">
          <p>30-day money-back guarantee on all plans. NDANow provides document templates for informational purposes only and does not constitute legal advice.</p>
        </div>
      </footer>
    </div>
  );
}
