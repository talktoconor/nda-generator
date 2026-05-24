import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/constants";
import { BLOG_POSTS } from "@/lib/blog-data";
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

  return (
    <div className="min-h-full flex flex-col">
      <ArticleSchema title={post.title} description={post.description} slug={post.slug} datePublished={post.date} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: post.title, href: `/blog/${post.slug}` }]} />

      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">NDA<span className="text-blue-600">Now</span></Link>
          <Link href="/create" className="text-sm font-medium text-blue-600 hover:text-blue-700">Create NDA &rarr;</Link>
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

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
            <p className="text-sm font-medium text-blue-900">Quick Answer</p>
            <p className="text-sm text-blue-800 mt-1">{post.description}</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">{post.description}</p>
            <p className="text-gray-600 leading-relaxed mt-4">
              This article is being expanded with expert-level content. Check back soon for the full guide, or create your NDA now using our generator.
            </p>
          </div>

          <NdaCta />
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
