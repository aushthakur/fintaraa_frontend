"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Filter,
  Play,
  Search,
  Star,
} from "lucide-react";
import type { KnowledgePageConfig } from "@/components/knowledge/knowledgePageConfig";
import {
  fetchWebsiteKnowledge,
  formatKnowledgeDate,
  stripHtml,
  type WebsiteKnowledgeItem,
} from "@/services/websiteKnowledge";

function ListingSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="h-92 animate-pulse rounded-2xl border border-[#e2edf6] bg-white"
        >
          <div className="h-48 rounded-t-2xl bg-[#edf4fb]" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-24 rounded bg-[#edf4fb]" />
            <div className="h-5 rounded bg-[#edf4fb]" />
            <div className="h-4 w-4/5 rounded bg-[#edf4fb]" />
            <div className="h-10 w-32 rounded-full bg-[#edf4fb]" />
          </div>
        </div>
      ))}
    </div>
  );
}

const getSummary = (item: WebsiteKnowledgeItem) =>
  item.summary || item.excerpt || stripHtml(item.content || "");

export function KnowledgeListingPage({
  config,
}: {
  config: KnowledgePageConfig;
}) {
  const [items, setItems] = useState<WebsiteKnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    let mounted = true;

    queueMicrotask(() => {
      if (!mounted) return;
      setLoading(true);
      setError("");

      fetchWebsiteKnowledge({
        type: config.type,
        sectionKey: config.sectionKey,
        limit: 50,
      })
        .then((data) => mounted && setItems(data))
        .catch(
          () => mounted && setError("Content could not be loaded right now."),
        )
        .finally(() => mounted && setLoading(false));
    });

    return () => {
      mounted = false;
    };
  }, [config.sectionKey, config.type]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(items.map((item) => item.category).filter(Boolean)),
      ) as string[],
    [items],
  );

  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesSearch =
        !search ||
        [item.title, item.summary, item.excerpt, item.category, item.authorName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [category, items, query]);

  return (
    <main className="bg-white text-[#111625]">
      <section className="border-b border-[#edf2f7] bg-[#f8fbff] px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#005ca8]">
              {config.eyebrow}
            </p>
            <h1 className="mt-3 max-w-4xl text-[34px] font-extrabold tracking-tight text-[#07162d] md:text-[52px]">
              {config.title}
            </h1>
            <p className="mt-4 max-w-3xl text-[15px] font-semibold leading-7 text-[#667085] md:text-[17px]">
              {config.description}
            </p>
          </div>
          <div className="rounded-2xl border border-[#dce9f7] bg-white p-5 shadow-[0_14px_38px_rgba(16,24,40,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f4ff] text-[#005ca8]">
                <Filter className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[13px] font-extrabold text-[#07162d]">
                  {items.length || 50} premium entries
                </p>
                <p className="text-[12px] font-semibold text-[#667085]">
                  Searchable, category-ready, and SEO-friendly.
                </p>
              </div>
            </div>
            <div className="mt-5 flex h-11 items-center rounded-full border border-[#dce9f7] bg-[#f8fbff] px-4">
              <Search className="h-4 w-4 shrink-0 text-[#98a2b3]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search stories"
                className="ml-2 w-full bg-transparent text-[13px] font-semibold outline-none placeholder:text-[#98a2b3]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="mb-7 flex flex-col gap-4 border-b border-[#edf2f7] pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[24px] font-extrabold text-[#07162d] md:text-[30px]">
                {config.listingTitle}
              </h2>
              <p className="mt-2 text-[13px] font-semibold text-[#667085]">
                Showing {filteredItems.length} of {items.length} records.
              </p>
            </div>
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={`shrink-0 rounded-full border px-4 py-2 text-[12px] font-extrabold ${
                  category === "all"
                    ? "border-[#005ca8] bg-[#005ca8] text-white"
                    : "border-[#dce9f7] bg-white text-[#536273]"
                }`}
              >
                All
              </button>
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[12px] font-extrabold ${
                    category === item
                      ? "border-[#005ca8] bg-[#005ca8] text-white"
                      : "border-[#dce9f7] bg-white text-[#536273]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loading ? <ListingSkeleton /> : null}

          {error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-[14px] font-bold text-red-700">
              {error}
            </div>
          ) : null}

          {!loading && !error ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => {
                const summary = getSummary(item);
                const isVideo = config.type === "video";
                const isTestimonial = config.type === "testimonial";
                return (
                  <article
                    key={item.slug}
                    className="flex min-h-96 flex-col overflow-hidden rounded-2xl border border-[#e2edf6] bg-white shadow-[0_10px_32px_rgba(16,24,40,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_42px_rgba(16,24,40,0.07)]"
                  >
                    <Link
                      href={`${config.hrefRoot}/${item.slug}`}
                      className="block no-underline"
                    >
                      <div className="relative h-52 overflow-hidden bg-[#eef6ff]">
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
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#07162d]/55 via-transparent to-transparent" />
                        {isVideo ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/25 text-white ring-1 ring-white/40 backdrop-blur-sm">
                              <Play className="ml-0.5 h-6 w-6 fill-current" />
                            </span>
                          </div>
                        ) : null}
                        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-[#005ca8]">
                          {item.category || config.detailLabel}
                        </span>
                      </div>
                    </Link>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-[#98a2b3]">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatKnowledgeDate(item.publishedAt)}
                          </span>
                          {item.location ? <span>{item.location}</span> : null}
                          {isTestimonial || isVideo ? (
                            <span className="inline-flex items-center gap-0.5 text-[#f97316]">
                              {Array.from({
                                length: Number(item.rating || 5),
                              }).map((_, ratingIndex) => (
                                <Star
                                  key={`${item.slug}-${ratingIndex}`}
                                  className="h-3 w-3 fill-current"
                                />
                              ))}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-3 line-clamp-2 text-[19px] font-extrabold leading-7 text-[#07162d]">
                          {item.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-[13px] font-semibold leading-6 text-[#667085]">
                          {summary}
                        </p>
                        {item.tags?.length ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={`${item.slug}-${tag}`}
                                className="rounded-full bg-[#eef6ff] px-3 py-1 text-[11px] font-extrabold text-[#005ca8]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <Link
                        href={`${config.hrefRoot}/${item.slug}`}
                        className="mt-5 inline-flex h-10 w-fit items-center justify-center gap-2 rounded-full bg-[#005ca8] px-5 text-[12px] font-extrabold text-white no-underline transition hover:bg-[#004b87]"
                      >
                        {item.buttonLabel || config.primaryAction}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          {!loading && !error && !filteredItems.length ? (
            <div className="rounded-2xl border border-[#e2edf6] bg-[#f8fbff] p-8 text-center">
              <p className="text-[16px] font-extrabold text-[#07162d]">
                No matching content found.
              </p>
              <p className="mt-2 text-[13px] font-semibold text-[#667085]">
                Try a different search term or category.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
