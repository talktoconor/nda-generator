import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/constants";
import { BLOG_POSTS } from "@/lib/blog-data";
import { BLOG_CONTENT } from "@/lib/blog-content";
import { ArticleSchema, BreadcrumbSchema } from "@/components/json-ld";
import { NdaCta } from "@/components/nda-cta";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | NDANow`,
    description: post.description,
    openGraph: { title: post.title, description: post.description, url: `${BASE_URL}/blog/${slug}`, siteName: "NDANow", type: "article" },
    alternates: { canonical: `${BASE_URL}/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const content = BLOG_CONTENT[slug];

  return (
    <div className="min-h-full flex flex-col">
      <ArticleSchema title={post.title} description={post.description} slug={post.slug} datePublished={post.date} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: post.title, href: `/blog/${post.slug}` }]} />

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
        <nav className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          {" / "}
          <Link href="/blog" className="hover:text-gray-600">Blog</Link>
          {" / "}
          <span className="text-gray-500">{post.title}</span>
        </nav>

        <article>
          <h1 className="text-3xl font-bold tracking-tight mb-3">{post.title}</h1>
          <p className="text-sm text-gray-400 mb-8">{post.date}</p>

          {/* Quick Answer box for AEO */}
          {content?.quickAnswer && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
              <p className="text-sm font-medium text-blue-900">Quick Answer</p>
              <p className="text-sm text-blue-800 mt-1">{content.quickAnswer}</p>
            </div>
          )}

          {/* Table of Contents */}
          {content?.tableOfContents && content.tableOfContents.length > 0 && (
            <nav className="bg-gray-50 border border-gray-100 rounded-lg p-5 mb-10">
              <p className="text-sm font-semibold text-gray-700 mb-3">In this article</p>
              <ol className="space-y-1.5">
                {content.tableOfContents.map((item, i) => (
                  <li key={i}>
                    <a
                      href={`#${item.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {i + 1}. {item}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Full article content */}
          {content?.sections ? (
            <div className="prose prose-gray max-w-none">
              {content.sections.map((section, i) => (
                <section key={i} className="mb-10">
                  <h2
                    id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}
                    className="text-xl font-bold text-gray-900 mb-4 scroll-mt-20"
                  >
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((para, j) => (
                    <p key={j} className="text-gray-600 leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                </section>
              ))}

              {/* Mid-article CTA */}
              <NdaCta />

              {/* Sources */}
              {content.sources && content.sources.length > 0 && (
                <section className="mt-10 pt-8 border-t border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Sources</h2>
                  <ul className="space-y-2">
                    {content.sources.map((source, i) => (
                      <li key={i} className="text-sm text-gray-500">
                        {source.url ? (
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {source.text}
                          </a>
                        ) : (
                          source.text
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ) : (
            /* Fallback for posts without full content yet */
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">{post.description}</p>
              <p className="text-gray-600 leading-relaxed mt-4">
                This article is being expanded with expert-level content. Check back soon for the full guide, or create your NDA now using our generator.
              </p>
              <NdaCta />
            </div>
          )}

          {/* Related articles */}
          <section className="mt-12 pt-8 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Related articles</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {BLOG_POSTS.filter((p) => p.slug !== slug)
                .slice(0, 4)
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="block border border-gray-100 rounded-lg p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
                  >
                    <h3 className="font-semibold text-sm mb-1">{p.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
                  </Link>
                ))}
            </div>
          </section>
        </article>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 text-sm text-gray-400">
          <p>NDANow provides document templates for informational purposes only and does not constitute legal advice.</p>
        </div>
      </footer>
    </div>
  );
}
