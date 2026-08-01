"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Play,
  Quote,
  Search,
  Star,
} from "lucide-react";
import type { KnowledgePageConfig } from "@/components/knowledge/knowledgePageConfig";
import { ManagedVideoPlayer } from "@/components/common/ManagedVideoPlayer";
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
    <main className="bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl animate-pulse gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="h-4 w-28 rounded bg-[#edf4fb]" />
          <div className="mt-4 h-12 max-w-3xl rounded bg-[#edf4fb]" />
          <div className="mt-4 h-16 max-w-2xl rounded bg-[#edf4fb]" />
          <div className="mt-8 h-105 rounded-2xl bg-[#edf4fb]" />
        </div>
        <div className="h-96 rounded-2xl bg-[#edf4fb]" />
      </div>
    </main>
  );
}

export function KnowledgeDetailClient({
  slug,
  config,
}: {
  slug: string;
  config: KnowledgePageConfig;
}) {
  const [item, setItem] = useState<WebsiteKnowledgeItem | null>(null);
  const [related, setRelated] = useState<WebsiteKnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      fetchKnowledgeBySlug(slug),
      fetchWebsiteKnowledge({
        type: config.type,
        sectionKey: config.sectionKey,
        limit: 12,
      }),
    ])
      .then(([record, list]) => {
        if (!mounted) return;
        if (!record || record.type !== config.type) {
          setMissing(true);
          return;
        }
        setItem(record);
        setRelated(list.filter((entry) => entry.slug !== record.slug));
      })
      .catch(() => mounted && setMissing(true))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [config.sectionKey, config.type, slug]);

  if (missing) notFound();
  if (loading || !item) return <DetailSkeleton />;

  const summary = item.summary || item.excerpt || stripHtml(item.content || "");
  const isVideo = config.type === "video";
  const isTestimonial = config.type === "testimonial";
  const authorName = item.authorName || "Fintaraa Editorial";
  const authorRole = item.authorRole || "Fintaraa Editorial Desk";
  const categories = Array.from(
    new Set(
      [item, ...related]
        .map((entry) => entry.category || config.detailLabel)
        .filter(Boolean),
    ),
  );
  const relatedTitle =
    config.type === "press_release"
      ? "Related press releases"
      : config.type === "video"
        ? "Related video stories"
        : "Related stories";

  return (
    <main className="bg-white font-sans antialiased text-[#1a1d25]">
      <section className="mx-auto max-w-9xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <div className="min-w-0 space-y-8">
            <header className="space-y-4">
              <span className="block text-[13px] font-bold tracking-wide text-[#005ca8]">
                {item.category || config.detailLabel}
              </span>
              <h1 className="max-w-4xl text-[32px] font-extrabold leading-[1.15] tracking-tight text-black md:text-[42px]">
                {item.title}
              </h1>
              <p className="max-w-3xl text-[15px] font-medium leading-relaxed text-[#7a869a]">
                {summary}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-[#f0f4f8] pb-5 pt-3 text-[12px] font-medium text-[#94a2b3]">
                <div className="flex items-center gap-2.5 text-black">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full bg-[#eef6ff]">
                    <Image
                      src={item.authorAvatarUrl || "/assets/images/user1.png"}
                      alt={authorName}
                      fill
                      unoptimized
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold">{authorName}</p>
                    <p className="text-[10px] font-medium text-[#94a2b3]">
                      {authorRole}
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline">|</span>
                {item.readTime ? <span>{item.readTime}</span> : null}
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatKnowledgeDate(item.publishedAt)}
                </span>
                {item.location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {item.location}
                  </span>
                ) : null}
                {isVideo || isTestimonial ? (
                  <span className="inline-flex gap-0.5 text-[#f97316]">
                    {Array.from({ length: Number(item.rating || 5) }).map(
                      (_, index) => (
                        <Star
                          key={index}
                          className="h-3.5 w-3.5 fill-current"
                        />
                      ),
                    )}
                  </span>
                ) : null}
              </div>
            </header>

            <div className="relative overflow-hidden rounded-2xl bg-[#eef4f8]">
              {isVideo && (item.videoUrl || item.youtubeUrl) ? (
                <ManagedVideoPlayer
                  src={item.videoUrl}
                  youtubeUrl={item.youtubeUrl}
                  title={item.title}
                  poster={item.coverImageUrl || config.fallbackImage}
                />
              ) : (
                <div className="relative h-60 sm:h-80 lg:h-105">
                  <Image
                    src={
                      item.coverImageUrl ||
                      item.authorAvatarUrl ||
                      config.fallbackImage
                    }
                    alt={item.title}
                    fill
                    unoptimized
                    sizes="(max-width: 1023px) 100vw, 900px"
                    className="object-cover"
                    priority
                  />
                  {isVideo && !item.videoUrl && !item.youtubeUrl ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#07162d]/28 text-white">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/22 ring-1 ring-white/55 backdrop-blur-sm">
                        <Play className="ml-0.5 h-6 w-6 fill-current" />
                      </span>
                    </div>
                  ) : null}
                  {isTestimonial ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#07162d]/25">
                      <Quote className="h-14 w-14 text-white/85" />
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <article
              className="prose prose-slate max-w-none prose-headings:font-extrabold prose-headings:text-black prose-p:text-[15px] prose-p:font-medium prose-p:leading-8 prose-p:text-[#4a5568] prose-li:text-[#4a5568]"
              dangerouslySetInnerHTML={{
                __html: sanitizeRichText(item.content || `<p>${summary}</p>`),
              }}
            />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-2xl border border-[#dce9f7] bg-[#eef6ff] p-5">
              <h2 className="text-[16px] font-extrabold tracking-tight text-[#111625]">
                {relatedTitle}
              </h2>
              <div className="mt-4 space-y-3">
                {related.slice(0, 4).map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`${config.hrefRoot}/${entry.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-[#dce9f7] bg-white p-2 text-[#111625] no-underline transition hover:border-[#b7cbe0]"
                  >
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                      <Image
                        src={
                          entry.coverImageUrl ||
                          entry.authorAvatarUrl ||
                          config.fallbackImage
                        }
                        alt={entry.title}
                        fill
                        unoptimized
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-[12px] font-bold leading-4">
                        {entry.title}
                      </h3>
                      <span className="mt-1 block text-[10px] font-medium text-[#94a2b3]">
                        {formatKnowledgeDate(entry.publishedAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#dce9f7] bg-white p-5">
              <h2 className="text-[15px] font-extrabold text-[#111625]">
                Search
              </h2>
              <form action={config.hrefRoot} className="relative mt-3">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718397]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  name="q"
                  aria-label={`Search ${config.listingTitle}`}
                  placeholder="Search stories"
                  className="h-11 w-full rounded-xl border border-[#dce7ef] bg-[#f8fbfd] pl-10 pr-3 text-[12px] font-semibold text-[#17354d] outline-none transition placeholder:text-[#98a6b3] focus:border-[#075cde] focus:bg-white"
                />
              </form>
            </section>

            <section className="rounded-2xl border border-[#dce9f7] bg-white p-5">
              <h2 className="text-[15px] font-extrabold text-[#111625]">
                Categories
              </h2>
              <nav
                aria-label={`${config.detailLabel} categories`}
                className="mt-3 grid gap-1.5"
              >
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`${config.hrefRoot}?category=${encodeURIComponent(category)}`}
                    className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[12px] font-bold text-[#526b80] no-underline transition hover:bg-[#eef6ff] hover:text-[#075cde]"
                  >
                    <span>{category}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </nav>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
