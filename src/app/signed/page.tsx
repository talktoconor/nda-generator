import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NDA Successfully Signed | NDANow",
  description:
    "Your NDA has been successfully signed. Both parties will receive a copy of the executed document via email.",
};

export default function SignedPage() {
  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            NDA<span className="text-blue-600">Now</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-xl mx-auto w-full px-6">
        <div className="text-center py-24 max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
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
          </div>

          <h2 className="text-2xl font-bold mb-3">NDA Successfully Signed</h2>
          <p className="text-gray-500 mb-8">
            Both parties will receive a copy of the fully executed document via
            email from SignWell. No further action is needed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Another NDA
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
