import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL } from "@/lib/constants";
import { BreadcrumbSchema } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "NDA Glossary — Key Terms & Definitions | NDANow",
  description:
    "Complete glossary of NDA and confidentiality agreement terms. Understand every clause, concept, and legal term used in non-disclosure agreements.",
  openGraph: { title: "NDA Glossary | NDANow", url: `${BASE_URL}/glossary`, siteName: "NDANow" },
  alternates: { canonical: `${BASE_URL}/glossary` },
};

interface GlossaryTerm {
  term: string;
  definition: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: "Non-Disclosure Agreement (NDA)", definition: "A legally binding contract that creates a confidential relationship between parties, obligating one or more parties to keep shared information secret. Also known as a confidentiality agreement (CA) or confidential disclosure agreement (CDA)." },
  { term: "Confidential Information", definition: "Any non-public information designated as confidential by the disclosing party. This typically includes trade secrets, business plans, financial data, customer lists, product specifications, and proprietary technology." },
  { term: "Disclosing Party", definition: "The party that shares or discloses confidential information under an NDA. In a mutual NDA, both parties act as disclosing parties." },
  { term: "Receiving Party", definition: "The party that receives confidential information and agrees to keep it secret. In a mutual NDA, both parties act as receiving parties." },
  { term: "Mutual NDA", definition: "An NDA where both parties share confidential information and both agree to protect each other's disclosures. Also called a bilateral NDA or two-way NDA. Common in partnership discussions and joint ventures." },
  { term: "Unilateral NDA", definition: "An NDA where only one party discloses confidential information and the other party agrees to keep it secret. Also called a one-way NDA. Common in employment and investor pitch contexts." },
  { term: "Trade Secret", definition: "Information that derives independent economic value from not being generally known, is not readily ascertainable, and is subject to reasonable efforts to maintain its secrecy. Trade secrets receive additional legal protection under the Uniform Trade Secrets Act and the Defend Trade Secrets Act." },
  { term: "Consideration", definition: "Something of value exchanged between parties that makes a contract legally binding. In NDAs, consideration may include employment, business opportunities, access to information, or mutual promises of confidentiality." },
  { term: "Term", definition: "The duration of the NDA — how long the agreement remains in effect. Most NDAs have terms of 1-5 years, with 2-3 years being the most common." },
  { term: "Survival Period", definition: "The period after an NDA's term expires or the business relationship ends during which confidentiality obligations continue. For example, an NDA might have a 2-year term with a 3-year survival period." },
  { term: "Exclusions", definition: "Categories of information that are not considered confidential even if shared during the NDA relationship. Standard exclusions include publicly available information, prior knowledge, independently developed information, and third-party disclosures." },
  { term: "Injunctive Relief", definition: "A court order requiring a party to stop specific actions (such as disclosing confidential information). Most NDAs include provisions for injunctive relief because monetary damages may be inadequate to compensate for confidentiality breaches." },
  { term: "Liquidated Damages", definition: "A predetermined amount of money specified in the NDA that the breaching party must pay if they violate the agreement. Must be a reasonable estimate of anticipated damages to be enforceable." },
  { term: "Governing Law", definition: "The state or country whose laws will be used to interpret the NDA and resolve disputes. Choosing a favorable governing law is an important strategic decision." },
  { term: "Jurisdiction", definition: "The court or forum where disputes under the NDA will be resolved. Often (but not always) the same as the governing law state." },
  { term: "Return of Materials", definition: "A clause requiring the receiving party to return or destroy all confidential information (including copies, notes, and electronic files) when the NDA expires or upon the disclosing party's request." },
  { term: "Non-Solicitation", definition: "A provision preventing one party from recruiting or hiring the other party's employees for a specified period. Sometimes included in NDAs but technically a separate restriction." },
  { term: "Non-Compete", definition: "A separate agreement preventing a party from engaging in competing business activities. Non-competes are distinct from NDAs and face stricter enforceability standards. They are banned or restricted in many states." },
  { term: "Severability", definition: "A clause stating that if any provision of the NDA is found unenforceable, the remaining provisions remain in full effect. Protects the overall agreement from being invalidated by a single problematic clause." },
  { term: "Entire Agreement", definition: "A clause stating that the NDA represents the complete agreement between the parties regarding confidentiality, superseding all prior discussions, negotiations, and agreements on the subject." },
  { term: "Assignment", definition: "The transfer of rights or obligations under the NDA to a third party. Most NDAs restrict assignment without the other party's written consent." },
  { term: "Equitable Relief", definition: "Remedies other than monetary damages, such as injunctions or specific performance orders. NDAs typically acknowledge that equitable relief is appropriate because confidentiality breaches cause irreparable harm." },
  { term: "Irreparable Harm", definition: "Damage that cannot be adequately compensated by monetary damages. Confidentiality breaches often constitute irreparable harm because disclosed secrets cannot be made secret again." },
  { term: "Blue Penciling", definition: "A court's practice of modifying an overly broad NDA provision rather than invalidating it entirely. Available in some states, allowing courts to reduce unreasonable terms to reasonable ones." },
  { term: "Clean Room", definition: "A procedure where a separate team develops information independently to avoid allegations of using confidential information obtained under an NDA. Common in technology and software disputes." },
  { term: "Data Room", definition: "A secure physical or virtual location where confidential documents are stored for review during due diligence, particularly in M&A transactions. Virtual data rooms (VDRs) are now standard." },
  { term: "Standstill Clause", definition: "A provision in M&A NDAs preventing the potential buyer from making a hostile bid or acquiring the target's stock during negotiations." },
  { term: "Residuals Clause", definition: "A provision allowing the receiving party to use general knowledge and experience retained in memory after the NDA period, even if initially learned from confidential disclosures. Controversial and often resisted by disclosing parties." },
  { term: "Whistleblower Immunity", definition: "Federal protection under the Defend Trade Secrets Act allowing individuals to disclose trade secrets to government officials or attorneys for the purpose of reporting potential legal violations, regardless of any NDA." },
  { term: "E-Signature", definition: "An electronic signature used to execute an NDA digitally. Legally valid in all 50 US states under the E-SIGN Act and UETA. Creates a verifiable record of when each party signed." },
  { term: "Misappropriation", definition: "The acquisition, use, or disclosure of a trade secret through improper means such as theft, bribery, breach of duty, or espionage. A legal term of art under trade secret statutes." },
  { term: "Reasonable Efforts", definition: "The standard of care required to protect confidential information. The receiving party must exercise at least the same degree of care used to protect their own confidential information of similar importance." },
];

export default function GlossaryPage() {
  // Group terms by first letter
  const grouped = GLOSSARY_TERMS.reduce<Record<string, GlossaryTerm[]>>(
    (acc, term) => {
      const letter = term.term[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(term);
      return acc;
    },
    {}
  );

  const letters = Object.keys(grouped).sort();

  return (
    <div className="min-h-full flex flex-col">
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Glossary", href: "/glossary" }]} />

      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">NDA<span className="text-blue-600">Now</span></Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/blog" className="text-gray-500 hover:text-gray-900">Blog</Link>
            <Link href="/create" className="font-medium text-blue-600 hover:text-blue-700">Create NDA &rarr;</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">NDA Glossary</h1>
        <p className="text-gray-500 mb-6">
          Complete reference of terms, clauses, and legal concepts used in non-disclosure agreements.
        </p>

        {/* Letter navigation */}
        <nav className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-gray-100">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-8 h-8 flex items-center justify-center rounded bg-gray-50 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {letter}
            </a>
          ))}
        </nav>

        {/* Terms */}
        <div className="space-y-10">
          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`}>
              <h2 className="text-lg font-bold text-blue-600 mb-4 scroll-mt-20">{letter}</h2>
              <dl className="space-y-4">
                {grouped[letter].map((item) => (
                  <div key={item.term} className="border-b border-gray-50 pb-4">
                    <dt className="font-semibold text-gray-900 mb-1">{item.term}</dt>
                    <dd className="text-sm text-gray-600 leading-relaxed">{item.definition}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-12">
          <h3 className="font-semibold text-lg mb-2">Ready to create your NDA?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Generate a professionally drafted NDA with all these terms and clauses built in. No legal jargon to decode — we handle it for you.
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
