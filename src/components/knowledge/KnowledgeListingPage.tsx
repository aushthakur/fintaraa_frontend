"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Filter,
  MapPin,
  Play,
  Quote,
  Search,
  ShieldCheck,
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
    <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 xl:grid-cols-3">
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

function RatingStars({
  rating,
  className = "h-4 w-4",
}: {
  rating: number;
  className?: string;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-0.5"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const fill = Math.max(0, Math.min(1, rating - index)) * 100;
        return (
          <span key={index} className={`relative block ${className}`}>
            <Star className="absolute inset-0 h-full w-full fill-[#e4e7ec] text-[#e4e7ec]" />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill}%` }}
            >
              <Star className={`fill-[#f59e0b] text-[#f59e0b] ${className}`} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function TestimonialRatingOverview({
  items,
}: {
  items: WebsiteKnowledgeItem[];
}) {
  const total = items.length;
  const average = total
    ? items.reduce((sum, item) => sum + Number(item.rating || 5), 0) / total
    : 5;
  const recommendation = total
    ? Math.round(
        (items.filter((item) => Number(item.rating || 5) >= 4).length / total) *
          100,
      )
    : 100;
  const distribution = [5, 4, 3, 2, 1].map((value) => {
    const count = items.filter(
      (item) => Math.round(Number(item.rating || 5)) === value,
    ).length;
    return {
      value,
      percentage: total
        ? Math.round((count / total) * 100)
        : value === 5
          ? 100
          : 0,
    };
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Customer rating summary"
      className="mt-6 grid gap-6 rounded-2xl border border-[#dce9f7] bg-[#f8fbff] p-5 sm:p-6 lg:grid-cols-[280px_minmax(0,1fr)_190px] lg:items-center"
    >
      <div className="flex items-center gap-5 lg:border-r lg:border-[#dce9f7] lg:pr-7">
        <strong className="text-[48px] font-extrabold leading-none tracking-tighter text-[#07162d] sm:text-[56px]">
          {average.toFixed(1)}
        </strong>
        <div>
          <RatingStars rating={average} className="h-4.5 w-4.5" />
          <p className="mt-2 text-[12px] font-bold text-[#667085]">
            Based on {total} verified {total === 1 ? "story" : "stories"}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {distribution.map(({ value, percentage }) => (
          <div
            key={value}
            className="grid grid-cols-[42px_minmax(0,1fr)_40px] items-center gap-3 text-[12px] font-bold text-[#536273]"
          >
            <span>{value} star</span>
            <span className="h-2 overflow-hidden rounded-full bg-[#e4e7ec]">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: `${percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: (5 - value) * 0.05 }}
                className="block h-full rounded-full bg-[#f59e0b]"
              />
            </span>
            <span className="text-right text-[#7a8898]">{percentage}%</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#cfe7da] bg-white p-4 text-center">
        <ShieldCheck className="mx-auto h-6 w-6 text-[#0a8f55]" />
        <p className="mt-2 text-[22px] font-extrabold text-[#07162d]">
          {recommendation}%
        </p>
        <p className="mt-1 text-[11px] font-bold leading-5 text-[#667085]">
          of customers rated their experience 4 stars or higher
        </p>
      </div>
    </motion.section>
  );
}

function TestimonialListingCard({ item }: { item: WebsiteKnowledgeItem }) {
  return (
    <article className="flex h-full min-h-58 flex-col justify-start rounded-xl border border-[#e2edf8] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[16px] font-bold leading-tight text-[#07162d]">
            {item.authorName || item.title}
          </h3>
          <p className="mt-0.5 text-[12px] font-bold text-[#8090a4]">
            {item.location || "India"}
          </p>
        </div>
        <RatingStars
          rating={Number(item.rating || 5)}
          className="h-3.5 w-3.5"
        />
      </div>

      <p className="mt-5 text-[14px] font-semibold leading-relaxed text-[#52657d]">
        {getSummary(item)}
      </p>

      {item.tags?.length ? (
        <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-[#087443]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function VideoTestimonialListingCard({
  item,
  href,
  fallbackImage,
}: {
  item: WebsiteKnowledgeItem;
  href: string;
  fallbackImage: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-90 w-full flex-col overflow-hidden rounded-2xl border border-[#dfeaf5] bg-white text-left no-underline outline-none transition-colors duration-300 hover:border-[#bcd3e8]"
    >
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-slate-950">
        <Image
          src={item.coverImageUrl || fallbackImage}
          alt={item.authorName || item.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#075cde] ring-8 ring-white/20 transition group-hover:scale-105">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-[18px] font-extrabold leading-tight text-white">
            {item.authorName || item.title}
          </h3>
          {item.location ? (
            <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-bold text-white/80">
              <MapPin className="h-3.5 w-3.5" />
              {item.location}
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-widest text-[#98a2b3]">
                <Quote className="h-3.5 w-3.5 text-[#075cde]" />
                Story
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#075cde]">
                <ShieldCheck className="h-3.5 w-3.5" />
                {item.category || "Customer Story"}
              </span>
            </div>
            <RatingStars
              rating={Number(item.rating || 5)}
              className="h-3.5 w-3.5"
            />
          </div>
          <p className="mt-3 line-clamp-3 text-[14px] font-semibold leading-6 text-[#667085]">
            {getSummary(item) ||
              "A Fintaraa customer shares how comparison and assisted guidance helped them choose confidently."}
          </p>
        </div>
        <span className="absolute bottom-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#075cde] text-white transition group-hover:translate-x-1 group-hover:bg-[#064cb8]">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function ListingSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex h-11 w-full items-center rounded-xl border border-[#dce9f7] bg-white px-4 md:max-w-xs">
      <Search className="h-4 w-4 shrink-0 text-[#98a2b3]" />
      <span className="sr-only">Search stories</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search stories"
        className="ml-2 w-full bg-transparent text-[13px] font-semibold text-[#17354d] outline-none placeholder:text-[#98a2b3]"
      />
    </label>
  );
}

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
  const [visibleCount, setVisibleCount] = useState(6);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncFiltersFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") || "");
      setCategory(params.get("category") || "all");
    };

    syncFiltersFromUrl();
    window.addEventListener("popstate", syncFiltersFromUrl);
    return () => window.removeEventListener("popstate", syncFiltersFromUrl);
  }, []);

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

  const displayedItems =
    config.type === "testimonial"
      ? filteredItems.slice(0, visibleCount)
      : filteredItems;
  const hasMoreTestimonials =
    config.type === "testimonial" && visibleCount < filteredItems.length;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMoreTestimonials) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + 6, filteredItems.length),
          );
        }
      },
      { rootMargin: "180px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredItems.length, hasMoreTestimonials, visibleCount]);

  const updateFilterUrl = (nextCategory: string, nextQuery: string) => {
    const params = new URLSearchParams();
    if (nextCategory !== "all") params.set("category", nextCategory);
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    const search = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${search ? `?${search}` : ""}`,
    );
  };

  const selectCategory = (nextCategory: string) => {
    setCategory(nextCategory);
    setVisibleCount(6);
    updateFilterUrl(nextCategory, query);
  };

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    setVisibleCount(6);
    updateFilterUrl(category, nextQuery);
  };

  return (
    <main className="bg-white text-[#111625]">
      {!config.hideListingIntro ? (
        <section className="border-b border-[#edf2f7] bg-[#f8fbff] px-4 py-12 md:px-6 lg:px-8">
          <div className="mx-auto grid max-w-9xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-[34px] font-extrabold tracking-tight text-[#07162d] md:text-[52px]">
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
              <div className="mt-5">
                <ListingSearch value={query} onChange={updateQuery} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section
        className={`px-4 md:px-6 lg:px-8 ${config.hideListingIntro ? "py-7 md:py-9" : "py-10"}`}
      >
        <div className="mx-auto max-w-9xl">
          <div className="mb-5 flex flex-col gap-4 border-b border-[#edf2f7] pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[24px] font-extrabold text-[#07162d] md:text-[30px]">
                {config.listingTitle}
              </h2>
              <p className="mt-2 text-[13px] font-semibold text-[#667085]">
                Showing {filteredItems.length} of {items.length} records.
              </p>
            </div>
            {config.hideListingIntro ? (
              <ListingSearch value={query} onChange={updateQuery} />
            ) : null}
          </div>

          {config.type === "testimonial" && !loading && !error ? (
            <TestimonialRatingOverview items={items} />
          ) : null}

          {categories.length ? (
            <div
              className={`flex max-w-full gap-2 overflow-x-auto pb-1 ${
                config.type === "testimonial" ? "mt-7" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => selectCategory("all")}
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
                  onClick={() => selectCategory(item)}
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
          ) : null}

          {loading ? <ListingSkeleton /> : null}

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-6 text-[14px] font-bold text-red-700">
              {error}
            </div>
          ) : null}

          {!loading && !error ? (
            <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 xl:grid-cols-4">
              {displayedItems.map((item, index) => {
                const summary = getSummary(item);
                const isVideo = config.type === "video";
                const isTestimonial = config.type === "testimonial";

                if (isTestimonial) {
                  return (
                    <motion.div
                      key={item.slug}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.12 }}
                      transition={{
                        duration: 0.5,
                        delay: (index % 3) * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="h-full"
                    >
                      <TestimonialListingCard item={item} />
                    </motion.div>
                  );
                }

                if (isVideo) {
                  return (
                    <motion.div
                      key={item.slug}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.12 }}
                      transition={{
                        duration: 0.5,
                        delay: (index % 3) * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="h-full"
                    >
                      <VideoTestimonialListingCard
                        item={item}
                        href={`${config.hrefRoot}/${item.slug}`}
                        fallbackImage={config.fallbackImage}
                      />
                    </motion.div>
                  );
                }

                return (
                  <motion.article
                    key={item.slug}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{
                      duration: 0.5,
                      delay: (index % 3) * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
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
                  </motion.article>
                );
              })}
            </div>
          ) : null}

          {hasMoreTestimonials ? (
            <div
              ref={loadMoreRef}
              className="mt-8 flex h-12 items-center justify-center"
              aria-label="Loading more customer stories"
            >
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#dce9f7] border-t-[#075cde]" />
            </div>
          ) : null}

          {!loading && !error && !filteredItems.length ? (
            <div className="mt-5 rounded-2xl border border-[#e2edf6] bg-[#f8fbff] p-8 text-center">
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
