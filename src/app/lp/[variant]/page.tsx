import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LANDING_PAGES } from "@/lib/lp-data";

export function generateStaticParams() {
  return LANDING_PAGES.map((lp) => ({ variant: lp.slug }));
}

type Props = { params: Promise<{ variant: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { variant } = await params;
  const lp = LANDING_PAGES.find((p) => p.slug === variant);
  if (!lp) return {};
  return {
    title: lp.headline,
    description: lp.subheadline,
    robots: { index: false, follow: false },
  };
}

export default async function LandingPage({ params }: Props) {
  const { variant } = await params;
  const lp = LANDING_PAGES.find((p) => p.slug === variant);
  if (!lp) notFound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-16">
      <div className="max-w-xl w-full text-center">
        <span className="text-xl font-semibold tracking-tight mb-8 block">
          NDA<span className="text-blue-600">Now</span>
        </span>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4">
          {lp.headline}
        </h1>
        <p className="text-lg text-gray-600 mb-8">{lp.subheadline}</p>

        <Link
          href="/create"
          className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          {lp.ctaText} &rarr;
        </Link>

        <ul className="mt-10 text-left space-y-3 max-w-sm mx-auto">
          {lp.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-gray-700">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-center justify-center gap-6 text-xs text-gray-400">
          <span>SSL Secured</span>
          <span>30-Day Guarantee</span>
          <span>Legally Sound</span>
        </div>
      </div>
    </div>
  );
}
