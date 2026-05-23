import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight">
            NDA<span className="text-blue-600">Now</span>
          </span>
          <Link
            href="/create"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Create NDA &rarr;
          </Link>
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
              fraction of the price.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/create"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your NDA &mdash; $29
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-bold mb-12">How it works</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Fill in the details</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Answer a few simple questions about the parties, purpose,
                  and terms of your NDA.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Review &amp; pay</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Preview your customized NDA, then securely pay $29 through
                  Stripe.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Download your PDF</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Instantly download a professional, ready-to-sign NDA
                  document.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-bold mb-12">
              What&apos;s included
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Mutual or unilateral NDA options",
                "Comprehensive confidentiality clauses",
                "Standard exclusions and carve-outs",
                "Customizable duration and jurisdiction",
                "Return-of-materials provisions",
                "Equitable remedies clause",
                "Signature blocks for both parties",
                "Instant PDF download",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 text-sm text-gray-400">
          <p>
            NDANow provides document templates for informational purposes only
            and does not constitute legal advice. Consult an attorney for
            specific legal guidance.
          </p>
        </div>
      </footer>
    </div>
  );
}
