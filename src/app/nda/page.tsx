import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL } from "@/lib/constants";
import { NDA_TYPES, INDUSTRIES, USE_CASES, US_STATES_SEO } from "@/lib/seo-data";
import { BreadcrumbSchema } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "NDA Templates by Type, Industry & State | NDANow",
  description: "Browse NDA templates by type, industry, use case, or state. Find the right non-disclosure agreement for your specific situation.",
  openGraph: { title: "NDA Templates | NDANow", url: `${BASE_URL}/nda`, siteName: "NDANow" },
  alternates: { canonical: `${BASE_URL}/nda` },
};

function Section({ title, items }: { title: string; items: { slug: string; title: string }[] }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/nda/${item.slug}`}
            className="text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-2 transition-colors"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function NdaIndexPage() {
  return (
    <div className="min-h-full flex flex-col">
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "NDA Templates", href: "/nda" }]} />

      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">NDA<span className="text-blue-600">Now</span></Link>
          <Link href="/create" className="text-sm font-medium text-blue-600 hover:text-blue-700">Create NDA &rarr;</Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">NDA Templates</h1>
        <p className="text-gray-500 mb-10">Browse by type, industry, use case, or state to find the right NDA for your situation.</p>

        <Section title="By NDA Type" items={NDA_TYPES} />
        <Section title="By Industry" items={INDUSTRIES} />
        <Section title="By Use Case" items={USE_CASES} />
        <Section title="By State" items={US_STATES_SEO} />
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 text-sm text-gray-400">
          <p>NDANow provides document templates for informational purposes only and does not constitute legal advice.</p>
        </div>
      </footer>
    </div>
  );
}
