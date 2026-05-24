import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL } from "@/lib/constants";
import { BreadcrumbSchema } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Free NDA Tools | NDANow",
  description:
    "Free tools to help you understand, create, and enforce NDAs. Check enforceability by state, build custom clauses, and compare agreement types.",
  openGraph: {
    title: "Free NDA Tools | NDANow",
    url: `${BASE_URL}/tools`,
    siteName: "NDANow",
  },
  alternates: { canonical: `${BASE_URL}/tools` },
};

const TOOLS = [
  {
    title: "NDA Enforceability Checker",
    description:
      "Enter your state and key NDA terms to get an instant assessment of how enforceable your agreement is. Covers all 50 states.",
    href: "/tools/enforceability-checker",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    badge: "Most Popular",
  },
  {
    title: "NDA vs. Non-Compete vs. Non-Solicitation",
    description:
      "Not sure which agreement you need? Compare NDAs, non-competes, and non-solicitation agreements side-by-side.",
    href: "/blog/nda-vs-non-compete",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    title: "NDA Cost Calculator",
    description:
      "Compare the cost of hiring a lawyer vs. using an online NDA generator. See how much you can save.",
    href: "/blog/how-much-does-nda-cost",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-full flex flex-col">
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Tools", href: "/tools" }]} />

      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            NDA<span className="text-blue-600">Now</span>
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/nda" className="text-gray-500 hover:text-gray-900">Templates</Link>
            <Link href="/blog" className="text-gray-500 hover:text-gray-900">Blog</Link>
            <Link href="/create" className="font-medium text-blue-600 hover:text-blue-700">Create NDA &rarr;</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Free NDA Tools</h1>
        <p className="text-gray-500 mb-10">
          Free tools to help you understand, create, and enforce non-disclosure agreements.
        </p>

        <div className="space-y-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-100 transition-colors">
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-semibold text-lg">{tool.title}</h2>
                    {tool.badge && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-12">
          <h3 className="font-semibold text-lg mb-2">Need a complete NDA?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Generate a professional, legally-sound NDA in 2 minutes. No lawyer needed.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your NDA &mdash; $29
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 text-sm text-gray-400">
          <p>NDANow provides document templates for informational purposes only and does not constitute legal advice.</p>
        </div>
      </footer>
    </div>
  );
}
