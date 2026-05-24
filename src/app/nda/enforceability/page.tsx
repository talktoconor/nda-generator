import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL } from "@/lib/constants";
import { BreadcrumbSchema, FAQSchema } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "NDA Enforceability by State — 50-State Guide (2026) | NDANow",
  description:
    "Are NDAs enforceable in your state? Complete 50-state enforceability matrix covering NDA laws, trade secret statutes, and key considerations for every US state.",
  openGraph: {
    title: "NDA Enforceability by State | NDANow",
    url: `${BASE_URL}/nda/enforceability`,
    siteName: "NDANow",
    type: "article",
  },
  alternates: { canonical: `${BASE_URL}/nda/enforceability` },
};

interface StateEnforceability {
  state: string;
  abbr: string;
  slug: string;
  enforceability: "Strong" | "Moderate" | "Strict Scrutiny";
  utsa: boolean;
  dtsa: boolean;
  notes: string;
}

const STATES: StateEnforceability[] = [
  { state: "Alabama", abbr: "AL", slug: "alabama", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs with reasonable terms." },
  { state: "Alaska", abbr: "AK", slug: "alaska", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Limited NDA case law but generally enforced." },
  { state: "Arizona", abbr: "AZ", slug: "arizona", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts apply blue-penciling to overly broad NDAs." },
  { state: "Arkansas", abbr: "AR", slug: "arkansas", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. NDAs enforceable with reasonable scope." },
  { state: "California", abbr: "CA", slug: "california", enforceability: "Strict Scrutiny", utsa: true, dtsa: true, notes: "NDAs enforceable but courts apply strict scrutiny. Non-compete provisions void under Bus. & Prof. Code 16600." },
  { state: "Colorado", abbr: "CO", slug: "colorado", enforceability: "Moderate", utsa: true, dtsa: true, notes: "Adopted UTSA. Recent legislation restricts non-competes for workers under $101,250/year." },
  { state: "Connecticut", abbr: "CT", slug: "connecticut", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs with standard reasonableness review." },
  { state: "Delaware", abbr: "DE", slug: "delaware", enforceability: "Strong", utsa: true, dtsa: true, notes: "Business-friendly. Courts routinely enforce NDAs. Popular governing law choice." },
  { state: "Florida", abbr: "FL", slug: "florida", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA (Fla. Stat. 688.001-009). Courts enforce NDAs and may blue-pencil overbroad terms." },
  { state: "Georgia", abbr: "GA", slug: "georgia", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. 2011 constitutional amendment strengthened restrictive covenant enforceability." },
  { state: "Hawaii", abbr: "HI", slug: "hawaii", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. NDAs enforceable with reasonable terms." },
  { state: "Idaho", abbr: "ID", slug: "idaho", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs with reasonable restrictions." },
  { state: "Illinois", abbr: "IL", slug: "illinois", enforceability: "Moderate", utsa: true, dtsa: true, notes: "Adopted UTSA. Requires adequate consideration for employee NDAs. Recent reforms restrict non-competes." },
  { state: "Indiana", abbr: "IN", slug: "indiana", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts apply blue-penciling to modify overbroad provisions." },
  { state: "Iowa", abbr: "IA", slug: "iowa", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. NDAs enforceable with standard reasonableness requirements." },
  { state: "Kansas", abbr: "KS", slug: "kansas", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs with reasonable terms." },
  { state: "Kentucky", abbr: "KY", slug: "kentucky", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts apply reasonableness standard to NDA terms." },
  { state: "Louisiana", abbr: "LA", slug: "louisiana", enforceability: "Moderate", utsa: true, dtsa: true, notes: "Adopted UTSA. Civil law jurisdiction with unique contract rules. NDAs generally enforced." },
  { state: "Maine", abbr: "ME", slug: "maine", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. NDAs enforceable with reasonable scope and duration." },
  { state: "Maryland", abbr: "MD", slug: "maryland", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs and apply blue-penciling." },
  { state: "Massachusetts", abbr: "MA", slug: "massachusetts", enforceability: "Moderate", utsa: true, dtsa: true, notes: "Adopted UTSA. 2018 Non-Compete Reform Act imposes requirements on restrictive covenants." },
  { state: "Michigan", abbr: "MI", slug: "michigan", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs with reasonable restrictions." },
  { state: "Minnesota", abbr: "MN", slug: "minnesota", enforceability: "Moderate", utsa: true, dtsa: true, notes: "Adopted UTSA. 2023 law bans most non-competes. NDAs remain enforceable." },
  { state: "Mississippi", abbr: "MS", slug: "mississippi", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs with reasonable terms." },
  { state: "Missouri", abbr: "MO", slug: "missouri", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs and apply reasonableness standards." },
  { state: "Montana", abbr: "MT", slug: "montana", enforceability: "Moderate", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts may scrutinize NDAs more closely. Non-competes limited." },
  { state: "Nebraska", abbr: "NE", slug: "nebraska", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. NDAs enforceable; courts apply reasonableness standard." },
  { state: "Nevada", abbr: "NV", slug: "nevada", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Business-friendly courts enforce NDAs with reasonable terms." },
  { state: "New Hampshire", abbr: "NH", slug: "new-hampshire", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. NDAs enforceable with standard requirements." },
  { state: "New Jersey", abbr: "NJ", slug: "new-jersey", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs; well-developed restrictive covenant case law." },
  { state: "New Mexico", abbr: "NM", slug: "new-mexico", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. NDAs enforceable with reasonable scope and duration." },
  { state: "New York", abbr: "NY", slug: "new-york", enforceability: "Strong", utsa: false, dtsa: true, notes: "Has not adopted UTSA but has robust common law trade secret protection. Popular governing law choice. NDAs strongly enforced." },
  { state: "North Carolina", abbr: "NC", slug: "north-carolina", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs and apply blue-penciling to modify overbroad terms." },
  { state: "North Dakota", abbr: "ND", slug: "north-dakota", enforceability: "Moderate", utsa: true, dtsa: true, notes: "Adopted UTSA. Non-competes generally void. NDAs remain enforceable for confidential information." },
  { state: "Ohio", abbr: "OH", slug: "ohio", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs with reasonable restrictions." },
  { state: "Oklahoma", abbr: "OK", slug: "oklahoma", enforceability: "Moderate", utsa: true, dtsa: true, notes: "Adopted UTSA. Non-competes largely unenforceable. NDAs for confidential info are enforceable." },
  { state: "Oregon", abbr: "OR", slug: "oregon", enforceability: "Moderate", utsa: true, dtsa: true, notes: "Adopted UTSA. Restrictive covenant reforms require consideration and limit duration." },
  { state: "Pennsylvania", abbr: "PA", slug: "pennsylvania", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs with reasonable scope and consideration." },
  { state: "Rhode Island", abbr: "RI", slug: "rhode-island", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. NDAs enforceable with standard requirements." },
  { state: "South Carolina", abbr: "SC", slug: "south-carolina", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs with reasonable restrictions." },
  { state: "South Dakota", abbr: "SD", slug: "south-dakota", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. NDAs enforceable with reasonable terms." },
  { state: "Tennessee", abbr: "TN", slug: "tennessee", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs and may blue-pencil overbroad provisions." },
  { state: "Texas", abbr: "TX", slug: "texas", enforceability: "Moderate", utsa: true, dtsa: true, notes: "Adopted UTSA. Restrictive covenants must be ancillary to an enforceable agreement. Additional consideration may be needed for existing employees." },
  { state: "Utah", abbr: "UT", slug: "utah", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Business-friendly courts enforce NDAs with reasonable terms." },
  { state: "Vermont", abbr: "VT", slug: "vermont", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. NDAs enforceable with standard reasonableness review." },
  { state: "Virginia", abbr: "VA", slug: "virginia", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs with reasonable restrictions." },
  { state: "Washington", abbr: "WA", slug: "washington", enforceability: "Moderate", utsa: true, dtsa: true, notes: "Adopted UTSA. Non-compete reforms limit enforceability for workers under $116,594/year. NDAs remain enforceable." },
  { state: "West Virginia", abbr: "WV", slug: "west-virginia", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. NDAs enforceable with reasonable terms." },
  { state: "Wisconsin", abbr: "WI", slug: "wisconsin", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. Courts enforce NDAs with reasonable scope and duration." },
  { state: "Wyoming", abbr: "WY", slug: "wyoming", enforceability: "Strong", utsa: true, dtsa: true, notes: "Adopted UTSA. NDAs enforceable with standard requirements." },
  { state: "Washington D.C.", abbr: "DC", slug: "washington-dc", enforceability: "Moderate", utsa: true, dtsa: true, notes: "Adopted UTSA. 2021 Ban on Non-Compete Agreements Amendment Act restricts non-competes. NDAs enforceable." },
];

const FAQS = [
  { q: "Are NDAs enforceable in all 50 states?", a: "Yes. NDAs are enforceable in all 50 US states and Washington D.C. when properly drafted with reasonable terms, clear definitions, and valid consideration. Some states apply stricter scrutiny to certain provisions." },
  { q: "What makes an NDA unenforceable?", a: "Common reasons include overly broad definitions of confidential information, unreasonable duration, lack of consideration, missing essential terms, and attempting to restrict information that is not genuinely confidential." },
  { q: "What is the difference between UTSA and DTSA?", a: "The Uniform Trade Secrets Act (UTSA) is a model state law adopted by 48 states. The Defend Trade Secrets Act (DTSA) is a federal law providing a federal cause of action for trade secret misappropriation. Both work alongside NDAs." },
  { q: "Which states have the strictest NDA rules?", a: "California applies the strictest scrutiny to restrictive covenants. Minnesota, North Dakota, and Oklahoma have also enacted significant restrictions on non-competes, though NDAs for confidential information remain enforceable." },
  { q: "Do I need a state-specific NDA?", a: "While a well-drafted NDA is enforceable in any state, choosing the right governing law and including state-appropriate terms strengthens your agreement. NDANow automatically generates NDAs with your selected state as the governing jurisdiction." },
];

export default function EnforceabilityPage() {
  const strongCount = STATES.filter((s) => s.enforceability === "Strong").length;
  const moderateCount = STATES.filter((s) => s.enforceability === "Moderate").length;
  const strictCount = STATES.filter((s) => s.enforceability === "Strict Scrutiny").length;

  return (
    <div className="min-h-full flex flex-col">
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "NDA Templates", href: "/nda" },
          { name: "Enforceability by State", href: "/nda/enforceability" },
        ]}
      />
      <FAQSchema questions={FAQS} />

      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">NDA<span className="text-blue-600">Now</span></Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/nda" className="text-gray-500 hover:text-gray-900">Templates</Link>
            <Link href="/blog" className="text-gray-500 hover:text-gray-900">Blog</Link>
            <Link href="/create" className="font-medium text-blue-600 hover:text-blue-700">Create NDA &rarr;</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <nav className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          {" / "}
          <Link href="/nda" className="hover:text-gray-600">NDA Templates</Link>
          {" / "}
          <span className="text-gray-500">Enforceability by State</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight mb-3">NDA Enforceability by State</h1>
        <p className="text-gray-500 mb-4 max-w-2xl">
          NDAs are enforceable in all 50 US states when properly drafted. This guide covers the enforceability landscape, trade secret statutes, and key considerations for every state.
        </p>

        {/* Quick Answer */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 max-w-2xl">
          <p className="text-sm font-medium text-blue-900">Quick Answer</p>
          <p className="text-sm text-blue-800 mt-1">
            NDAs are legally enforceable in all 50 US states and D.C. {strongCount} states have strong enforcement standards, {moderateCount} apply moderate scrutiny (often due to non-compete restrictions that do not affect NDAs), and {strictCount} state (California) applies strict scrutiny to restrictive covenants.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            Strong ({strongCount})
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            Moderate ({moderateCount})
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            Strict Scrutiny ({strictCount})
          </span>
        </div>

        {/* State table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg mb-12">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">State</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Enforceability</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">UTSA</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">DTSA</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {STATES.map((s) => (
                <tr key={s.abbr} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/nda/${s.slug}`} className="text-blue-600 hover:underline">
                      {s.state}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                        s.enforceability === "Strong"
                          ? "bg-green-50 text-green-700"
                          : s.enforceability === "Moderate"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          s.enforceability === "Strong"
                            ? "bg-green-500"
                            : s.enforceability === "Moderate"
                            ? "bg-yellow-500"
                            : "bg-red-400"
                        }`}
                      />
                      {s.enforceability}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.utsa ? (
                      <span className="text-green-600">&#10003;</span>
                    ) : (
                      <span className="text-gray-300">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-green-600">&#10003;</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed max-w-xs">
                    {s.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key definitions */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Key terms</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-1">UTSA — Uniform Trade Secrets Act</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                A model law adopted by 48 states (all except New York and North Carolina, which use common law). Provides a consistent framework for defining and protecting trade secrets at the state level.
              </p>
            </div>
            <div className="border border-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-1">DTSA — Defend Trade Secrets Act</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Federal law enacted in 2016 providing a federal cause of action for trade secret misappropriation. Applies in all 50 states and includes whistleblower immunity protections.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details key={faq.q} className="border border-gray-100 rounded-lg">
                <summary className="px-4 py-3 cursor-pointer font-medium text-sm hover:bg-gray-50">
                  {faq.q}
                </summary>
                <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-2">Create a state-specific NDA</h3>
          <p className="text-sm text-gray-600 mb-4">
            NDANow generates NDAs with your selected state as the governing jurisdiction. Professional clauses, built-in e-signature, ready in under 5 minutes.
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
