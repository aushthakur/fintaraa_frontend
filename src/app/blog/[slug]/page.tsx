import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserRound,
} from "lucide-react";
import { BlogVisual } from "@/components/blog/BlogVisual";
import { blogPosts, getBlogPost, latestBlogPosts } from "@/data/blogs";

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Not Found",
      alternates: { canonical: "/blog" },
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.category, ...post.tags, "Fintaraa", "Financial Insights"],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | Fintaraa`,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const related = latestBlogPosts
    .filter((item) => item.slug !== post.slug)
    .filter((item) => item.category === post.category)
    .concat(latestBlogPosts.filter((item) => item.slug !== post.slug))
    .filter(
      (item, index, list) =>
        list.findIndex((candidate) => candidate.slug === item.slug) === index,
    )
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Fintaraa",
    },
    mainEntityOfPage: `https://fintaraa.com/blog/${post.slug}`,
  };

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-extrabold text-[#195585] no-underline shadow-[0_10px_28px_rgba(25,85,133,0.08)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blogs
          </Link>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-stretch">
            <div className="flex flex-col justify-center">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#195585]">
                {post.category}
              </p>
              <h1 className="mt-4 max-w-4xl text-[38px] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#07162d] md:text-[58px]">
                {post.title}
              </h1>
              <p className="mt-5 max-w-3xl text-[17px] font-semibold leading-8 text-[#475467]">
                {post.excerpt}
              </p>
              <div className="mt-7 flex flex-wrap gap-4 text-[13px] font-semibold text-[#667085]">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
                  <UserRound className="h-4 w-4 text-[#195585]" />
                  {post.author}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
                  <CalendarDays className="h-4 w-4 text-[#195585]" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
                  <Clock3 className="h-4 w-4 text-[#195585]" />
                  {post.readTime}
                </span>
              </div>
            </div>
            <div className="overflow-hidden rounded-[28px] bg-white">
              <BlogVisual
                title={post.title}
                accent={post.accent}
                category={post.category}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <article className="bg-white border border-gray-200 px-5 py-8 md:px-10 md:py-12">
            <div className="grid gap-10">
              {post.body.map((section, index) => (
                <section key={section.heading}>
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef8ff] text-[13px] font-extrabold text-[#195585]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="text-[28px] font-extrabold leading-tight text-[#07162d]">
                        {section.heading}
                      </h2>
                      <div className="mt-4 grid gap-4">
                        {section.content.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="text-[16px] font-medium leading-8 text-[#475467]"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 bg-[#f8fcff] p-5">
              <CheckCircle2 className="h-6 w-6 text-[#12b76a]" />
              <h3 className="mt-4 text-[22px] font-extrabold text-[#07162d]">
                Fintaraa note
              </h3>
              <p className="mt-2 text-[14px] font-medium leading-7 text-[#667085]">
                This article is for general financial education. Final product
                eligibility, pricing, approval, disbursal, insurance issuance,
                and documentation requirements are determined by the respective
                regulated partner.
              </p>
            </div>
          </article>

          <aside className="h-fit bg-white p-5 shadow-[0_18px_45px_rgba(25,85,133,0.08)] lg:sticky lg:top-28">
            <h2 className="text-[20px] font-extrabold text-[#07162d]">
              Related reads
            </h2>
            <div className="mt-5 grid gap-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group block border-b border-[#edf2f7] pb-4 text-[#07162d] no-underline last:border-b-0 last:pb-0"
                >
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#195585]">
                    {item.category}
                  </p>
                  <h3 className="mt-2 text-[15px] font-extrabold leading-5 group-hover:text-[#195585]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[12px] font-semibold leading-5 text-[#667085]">
                    {item.readTime} · {formatDate(item.publishedAt)}
                  </p>
                </Link>
              ))}
            </div>
            <Link
              href="/blog"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-[#195585] px-4 text-[13px] font-extrabold text-white no-underline"
            >
              View all blogs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
