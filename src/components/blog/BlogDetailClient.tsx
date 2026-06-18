"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, Link2 } from "lucide-react";
import { NewsletterSubscription } from "@/components/blog/NewsletterSubscription";
import { WhyChooseFintaraa } from "@/components/blog/WhyChooseFintaraa";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import {
  fetchKnowledgeBySlug,
  fetchWebsiteKnowledge,
  formatKnowledgeDate,
  sanitizeRichText,
  stripHtml,
  type WebsiteKnowledgeItem,
} from "@/services/websiteKnowledge";

function DetailSkeleton() {
  return (
    <main className="bg-white px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-72 rounded-3xl bg-slate-100" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            <div className="h-5 w-32 rounded bg-slate-100" />
            <div className="h-12 rounded bg-slate-100" />
            <div className="h-24 rounded bg-slate-100" />
            <div className="h-96 rounded bg-slate-100" />
          </div>
          <div className="h-72 rounded-2xl bg-slate-100" />
        </div>
      </div>
    </main>
  );
}

export function BlogDetailClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<WebsiteKnowledgeItem | null>(null);
  const [related, setRelated] = useState<WebsiteKnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!slug) return;

    Promise.all([
      fetchKnowledgeBySlug(slug),
      fetchWebsiteKnowledge({ type: "blog", sectionKey: "recent_blogs", limit: 5 }),
    ])
      .then(([item, items]) => {
        if (!mounted) return;
        if (!item) {
          setMissing(true);
          return;
        }
        setPost(item);
        setRelated(items.filter((entry) => entry.slug !== item.slug).slice(0, 3));
      })
      .catch(() => mounted && setMissing(true))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (missing) notFound();
  if (loading || !post) return <DetailSkeleton />;

  const authorName = post.authorName || "Fintaraa Editorial";
  const authorRole = post.authorRole || "Financial Research Desk";
  const authorAvatar = post.authorAvatarUrl || "/assets/images/user1.png";
  const description = post.excerpt || post.summary || stripHtml(post.content || "");

  return (
    <main className="bg-white font-sans antialiased text-[#1a1d25]">
      <div className="absolute left-0 top-0 -z-10 h-44 w-44 rounded-br-full bg-[#edf5fd] opacity-70" />

      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8 lg:px-16">
        <div className="relative h-60 w-full overflow-hidden rounded-3xl border border-gray-100 shadow-xs md:h-95">
          <Image
            src={post.coverImageUrl || "/assets/blogs/blog1.png"}
            alt={post.title}
            fill
            unoptimized
            className="object-cover"
            priority
          />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-16">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="block text-[13px] font-bold tracking-wide text-[#005ca8]">
                {post.category || "Financial Planning"}
              </span>
              <h1 className="text-[32px] font-extrabold leading-[1.15] tracking-tight text-black md:text-[42px]">
                {post.title}
              </h1>
              <p className="max-w-3xl text-[15px] font-medium leading-relaxed text-[#7a869a]">
                {description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0f4f8] pb-5 pt-4">
                <div className="flex flex-wrap items-center gap-5 text-[12.5px] font-medium text-[#94a2b3]">
                  <div className="flex items-center gap-2.5 text-black">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                      <Image
                        src={authorAvatar}
                        alt={authorName}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold">{authorName}</div>
                      <div className="text-[10px] font-medium text-[#94a2b3]">
                        {authorRole}
                      </div>
                    </div>
                  </div>
                  <span className="hidden sm:inline">|</span>
                  <span>{post.readTime || "5 min read"}</span>
                  <span>{formatKnowledgeDate(post.publishedAt)}</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>1.2k</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-[#94a2b3]">
                    Share
                  </span>
                  <button className="text-[#4a5568] transition-opacity hover:opacity-80">
                    <Link2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <article
              className="prose prose-slate max-w-none prose-headings:font-extrabold prose-headings:text-black prose-p:text-[15px] prose-p:font-medium prose-p:leading-8 prose-p:text-[#4a5568] prose-li:text-[#4a5568]"
              dangerouslySetInnerHTML={{
                __html: sanitizeRichText(post.content || `<p>${description}</p>`),
              }}
            />
          </div>

          <aside className="space-y-5 rounded-2xl border border-[#dce9f7] bg-[#eef6ff] p-5 lg:sticky lg:top-24">
            <div>
              <h3 className="text-[15px] font-bold tracking-tight text-black">
                Expert Insight
              </h3>
              <p className="mt-2 text-[12.5px] font-medium leading-relaxed text-[#7a869a]">
                Use the article as a guide, then compare actual offers and terms before applying.
              </p>
            </div>
            <div className="border-t border-[#dce9f7] pt-4">
              <h4 className="text-[14px] font-bold text-[#7a869a]">
                Related Articles
              </h4>
              <div className="mt-3 space-y-3">
                {related.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-[#dce9f7] bg-white p-2 no-underline transition-colors hover:border-[#b7cbe0]"
                  >
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                      <Image
                        src={article.coverImageUrl || "/assets/blogs/blog1.png"}
                        alt={article.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h5 className="truncate text-[12.5px] font-bold leading-snug text-black">
                        {article.title}
                      </h5>
                      <span className="mt-1 block text-[10px] font-medium text-[#94a2b3]">
                        {article.readTime || "5 min read"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
      <NewsletterSubscription />
      <WhyChooseFintaraa />
      <FaqAccordion />
    </main>
  );
}
