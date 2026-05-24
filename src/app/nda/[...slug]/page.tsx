import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/constants";
import { classifySlug, getAllSlugs } from "@/lib/seo-data";
import { getPageContent } from "@/lib/page-content";
import { FAQSchema, BreadcrumbSchema } from "@/components/json-ld";
import { NdaCta, NdaPreview } from "@/components/nda-cta";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { category, data } = classifySlug(slug);
  if (!category) return {};
  const content = getPageContent(category, data);
  const url = `${BASE_URL}/nda/${slug.join("/")}`;
  return {
    title: `${content.h1} | NDANow`,
    description: content.intro.slice(0, 155) + "...",
    openGraph: { title: content.h1, description: content.intro.slice(0, 155), url, siteName: "NDANow", type: "article" },
    alternates: { canonical: url },
  };
}

export default async function NdaPage({ params }: Props) {
  const { slug } = await params;
  const { category, data } = classifySlug(slug);
  if (!category) notFound();

  const content = getPageContent(category, data);
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "NDA", href: "/nda" },
    { name: content.h1.split(" — ")[0], href: `/nda/${slug.join("/")}` },
  ];

  return (
    <div className="min-h-full flex flex-col">
      <BreadcrumbSchema items={breadcrumbs} />
      {content.faqs.length > 0 && <FAQSchema questions={content.faqs} />}

      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            NDA<span className="text-blue-600">Now</span>
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/pricing" className="text-gray-500 hover:text-gray-900">Pricing</Link>
            <Link href="/create" className="font-medium text-blue-600 hover:text-blue-700">Create NDA &rarr;</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <nav className="text-sm text-gray-400 mb-6">
          {breadcrumbs.map((b, i) => (
            <span key={b.href}>
              {i > 0 && " / "}
              <Link href={b.href} className="hover:text-gray-600">{b.name}</Link>
            </span>
          ))}
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">{content.h1}</h1>
        <p className="text-gray-600 leading-relaxed mb-8">{content.intro}</p>

        <NdaCta context={content.ctaContext} />

        {content.sections.map((section) => (
          <div key={section.heading} className="mb-8">
            <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
            <p className="text-gray-600 leading-relaxed">{section.body}</p>
          </div>
        ))}

        <NdaPreview />

        {content.faqs.length > 0 && (
          <div className="mt-12 border-t border-gray-100 pt-10">
            <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {content.faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-medium mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <NdaCta context={content.ctaContext} />
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 text-sm text-gray-400">
          <p>NDANow provides document templates for informational purposes only and does not constitute legal advice.</p>
        </div>
      </footer>
    </div>
  );
}
