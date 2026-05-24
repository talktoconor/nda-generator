import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import { OrganizationSchema, HowToSchema, ProductSchema } from "@/components/json-ld";
import { SocialProofCounter, TrustBadges } from "@/components/social-proof";

export const metadata: Metadata = {
  title: "NDANow — Professional NDAs in Minutes | No Lawyer Needed",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "NDANow — Professional NDAs in Minutes",
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    siteName: "NDANow",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "NDANow", description: SITE_DESCRIPTION },
  alternates: { canonical: BASE_URL },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <OrganizationSchema />
      <ProductSchema name="NDA Generator" description="Create legally-sound NDAs in minutes. No lawyer needed." price="29" />
      <HowToSchema
        name="How to create an NDA with NDANow"
        steps={[
          { name: "Fill in the details", text: "Answer a few simple questions about the parties, purpose, and terms of your NDA." },
          { name: "Review and pay", text: "Preview your customized NDA, then securely pay $29 through Stripe." },
          { name: "Sign and download", text: "Both parties sign electronically. Download your professional, ready-to-use NDA." },
        ]}
      />

      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight">
            NDA<span className="text-blue-600">Now</span>
          </span>
          <nav className="flex gap-4 text-sm">
            <Link href="/pricing" className="text-gray-500 hover:text-gray-900">Pricing</Link>
            <Link href="/nda" className="text-gray-500 hover:text-gray-900">Templates</Link>
            <Link href="/blog" className="text-gray-500 hover:text-gray-900">Blog</Link>
            <Link href="/create" className="font-medium text-blue-600 hover:text-blue-700">Create NDA &rarr;</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Professional NDAs
              <br />
              <span className="text-blue-600">without the lawyer fees.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Lawyers charge $300&ndash;$800 for a standard NDA. Ours takes 2
              minutes to customize and costs $29. Same legal language,
              fraction of the price. With built-in e-signature.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/create"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your NDA &mdash; $29
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Pricing
              </Link>
            </div>
            <TrustBadges />
            <SocialProofCounter />
          </div>
        </section>

        <section className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-bold mb-12">How it works</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">1</div>
                <h3 className="font-semibold mb-2">Fill in the details</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Answer a few simple questions about the parties, purpose, and terms of your NDA.</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">2</div>
                <h3 className="font-semibold mb-2">Review &amp; pay</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Preview your customized NDA, then securely pay $29 through Stripe.</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">3</div>
                <h3 className="font-semibold mb-2">Sign &amp; download</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Both parties sign electronically via SignWell. Download your executed NDA instantly.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-bold mb-12">What&apos;s included</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Mutual or unilateral NDA options",
                "Comprehensive confidentiality clauses",
                "Built-in e-signature via SignWell",
                "Customizable duration and jurisdiction",
                "Return-of-materials provisions",
                "Equitable remedies clause",
                "Signature blocks for both parties",
                "Instant PDF download",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-bold mb-6">Browse NDA templates</h2>
            <p className="text-gray-600 mb-8">Find the right NDA for your specific situation.</p>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/nda/mutual-nda" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                <h3 className="font-semibold text-sm mb-1">Mutual NDA</h3>
                <p className="text-xs text-gray-500">Both parties share info</p>
              </Link>
              <Link href="/nda/startup" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                <h3 className="font-semibold text-sm mb-1">Startup NDA</h3>
                <p className="text-xs text-gray-500">Protect your ideas</p>
              </Link>
              <Link href="/nda/hiring-employees" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                <h3 className="font-semibold text-sm mb-1">Employee NDA</h3>
                <p className="text-xs text-gray-500">Onboarding protection</p>
              </Link>
              <Link href="/nda" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                <h3 className="font-semibold text-sm mb-1">All Templates &rarr;</h3>
                <p className="text-xs text-gray-500">170+ options</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-400">
          <p>NDANow provides document templates for informational purposes only and does not constitute legal advice.</p>
          <nav className="flex gap-4">
            <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
            <Link href="/nda" className="hover:text-gray-600">Templates</Link>
            <Link href="/blog" className="hover:text-gray-600">Blog</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
