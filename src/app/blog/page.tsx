import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL } from "@/lib/constants";
import { BLOG_POSTS } from "@/lib/blog-data";
import { BreadcrumbSchema } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "NDA Blog — Guides & Legal Tips | NDANow",
  description: "Expert guides on NDAs, confidentiality agreements, and protecting your business. Learn everything about non-disclosure agreements.",
  openGraph: { title: "NDA Blog | NDANow", url: `${BASE_URL}/blog`, siteName: "NDANow" },
  alternates: { canonical: `${BASE_URL}/blog` },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-full flex flex-col">
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }]} />

      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">NDA<span className="text-blue-600">Now</span></Link>
          <Link href="/create" className="text-sm font-medium text-blue-600 hover:text-blue-700">Create NDA &rarr;</Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">NDA Blog</h1>
        <p className="text-gray-500 mb-10">Expert guides on NDAs, confidentiality, and protecting your business.</p>

        <div className="space-y-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block border border-gray-100 rounded-lg p-5 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
            >
              <h2 className="font-semibold mb-1">{post.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{post.description}</p>
              <span className="text-xs text-gray-400 mt-2 block">{post.date}</span>
            </Link>
          ))}
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
