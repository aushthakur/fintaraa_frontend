"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Play,
  Quote,
  Star,
} from "lucide-react";
import type { KnowledgePageConfig } from "@/components/knowledge/knowledgePageConfig";
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
    <main className="bg-white px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-96 rounded-3xl bg-[#edf4fb]" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="h-120 rounded-3xl bg-[#edf4fb]" />
          <div className="h-80 rounded-3xl bg-[#edf4fb]" />
        </div>
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
        limit: 6,
      }),
    ])
      .then(([record, list]) => {
        if (!mounted) return;
        if (!record || record.type !== config.type) {
          setMissing(true);
          return;
        }
        setItem(record);
        setRelated(
          list.filter((entry) => entry.slug !== record.slug).slice(0, 4),
        );
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

  return (
    <main className="bg-white text-[#111625]">
      <section className="bg-[#f8fbff] px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href={config.hrefRoot}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dce9f7] bg-white px-4 text-[13px] font-extrabold text-[#005ca8] no-underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {config.title}
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#005ca8]">
                {item.category || config.detailLabel}
              </p>
              <h1 className="mt-3 max-w-4xl text-[32px] font-extrabold tracking-tight text-[#07162d] md:text-[48px]">
                {item.title}
              </h1>
              <p className="mt-4 max-w-3xl text-[15px] font-semibold leading-7 text-[#667085]">
                {summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-[12px] font-bold text-[#667085]">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#005ca8]" />
                  {formatKnowledgeDate(item.publishedAt)}
                </span>
                {item.location ? (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#005ca8]" />
                    {item.location}
                  </span>
                ) : null}
                {item.readTime ? <span>{item.readTime}</span> : null}
              </div>
            </div>

            <div className="rounded-3xl border border-[#dce9f7] bg-white p-5 shadow-[0_14px_38px_rgba(16,24,40,0.05)]">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#98a2b3]">
                Published by
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="relative h-13 w-13 overflow-hidden rounded-full bg-[#eef6ff]">
                  <Image
                    src={item.authorAvatarUrl || config.fallbackImage}
                    alt={item.authorName || item.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[14px] font-extrabold text-[#07162d]">
                    {item.authorName || "Fintaraa Editorial"}
                  </p>
                  <p className="text-[12px] font-semibold text-[#667085]">
                    {item.authorRole || "Fintaraa Desk"}
                  </p>
                </div>
              </div>
              {isVideo || isTestimonial ? (
                <div className="mt-5 flex gap-1 text-[#f97316]">
                  {Array.from({ length: Number(item.rating || 5) }).map(
                    (_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ),
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="relative overflow-hidden rounded-3xl border border-[#e2edf6] bg-[#07162d]">
              {isVideo && item.videoUrl ? (
                <video
                  src={item.videoUrl}
                  controls
                  poster={item.coverImageUrl || config.fallbackImage}
                  className="aspect-video w-full bg-black object-contain"
                />
              ) : (
                <div className="relative h-78 md:h-110">
                  <Image
                    src={
                      item.coverImageUrl ||
                      item.authorAvatarUrl ||
                      config.fallbackImage
                    }
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover"
                    priority
                  />
                  {isTestimonial ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#07162d]/35">
                      <Quote className="h-16 w-16 text-white/80" />
                    </div>
                  ) : null}
                </div>
              )}
              {isVideo && !item.videoUrl ? (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <Play className="h-12 w-12" />
                </div>
              ) : null}
            </div>

            <article
              className="prose prose-slate mt-8 max-w-none prose-headings:font-extrabold prose-headings:text-[#07162d] prose-p:text-[15px] prose-p:font-semibold prose-p:leading-8 prose-p:text-[#536273] prose-li:text-[#536273]"
              dangerouslySetInnerHTML={{
                __html: sanitizeRichText(item.content || `<p>${summary}</p>`),
              }}
            />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-[#dce9f7] bg-[#f8fbff] p-5">
              <h2 className="text-[17px] font-extrabold text-[#07162d]">
                More {config.listingTitle}
              </h2>
              <div className="mt-4 space-y-3">
                {related.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`${config.hrefRoot}/${entry.slug}`}
                    className="flex gap-3 rounded-2xl border border-[#e2edf6] bg-white p-3 text-[#07162d] no-underline transition hover:border-[#005ca8]"
                  >
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-[#eef6ff]">
                      <Image
                        src={
                          entry.coverImageUrl ||
                          entry.authorAvatarUrl ||
                          config.fallbackImage
                        }
                        alt={entry.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[12px] font-extrabold leading-5">
                        {entry.title}
                      </p>
                      <p className="mt-1 text-[10px] font-bold text-[#98a2b3]">
                        {formatKnowledgeDate(entry.publishedAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
