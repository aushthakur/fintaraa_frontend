"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  Clock3,
  CreditCard,
  FileText,
  Landmark,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import {
  fetchWebsiteKnowledge,
  formatKnowledgeDate,
  stripHtml,
  type WebsiteKnowledgeItem,
} from "@/services/websiteKnowledge";
import {
  CarouselNavigation,
  moveInfiniteCarousel,
} from "./CarouselNavigation";

const fallbackBlogs: WebsiteKnowledgeItem[] = [
  {
    title: "What is a Hard Inquiry vs Soft Inquiry in CIBIL?",
    slug: "hard-inquiry-vs-soft-inquiry",
    type: "blog",
    coverImageUrl: "/assets/banks/visa-card.png",
    summary:
      "Understand how credit enquiries work, why lenders check your report, and how to protect your CIBIL profile.",
    category: "Credit Score",
    readTime: "5 min read",
    publishedAt: "2026-05-18",
    authorName: "Fintaraa Credit Desk",
    authorRole: "Credit Research Team",
  },
  {
    title: "Gold Loan Meaning, Process, Eligibility & Interest Rates",
    slug: "gold-loan-meaning-process-eligibility",
    type: "blog",
    coverImageUrl: "/assets/banks/visa-card.png",
    summary:
      "Compare gold loan eligibility, documents, valuation, repayment options, and lender terms before applying.",
    category: "Loans",
    readTime: "6 min read",
    publishedAt: "2026-05-12",
    authorName: "Fintaraa Editorial",
    authorRole: "Financial Research Desk",
  },
  {
    title: "What is Loan Grading? Types & Loan Grading System Explained",
    slug: "loan-grading-system-explained",
    type: "blog",
    coverImageUrl: "/assets/banks/visa-card.png",
    summary:
      "Learn how lenders assess loan quality, borrower risk, repayment history, and overall credit strength.",
    category: "Financial Planning",
    readTime: "4 min read",
    publishedAt: "2026-05-04",
    authorName: "Fintaraa Editorial",
    authorRole: "Financial Research Desk",
  },
];

type CategoryMeta = {
  icon: LucideIcon;
};

const categoryMeta: Record<string, CategoryMeta> = {
  Loans: {
    icon: Landmark,
  },
  "Credit Score": {
    icon: ShieldCheck,
  },
  Insurance: {
    icon: FileText,
  },
  "Credit Cards": {
    icon: CreditCard,
  },
  "Financial Planning": {
    icon: BookOpenText,
  },
};

const fallbackCategoryMeta: CategoryMeta = {
  icon: BookOpenText,
};

function getCategoryMeta(category?: string) {
  return categoryMeta[category || ""] || fallbackCategoryMeta;
}

function getSummary(post: WebsiteKnowledgeItem) {
  return (
    post.summary ||
    post.excerpt ||
    stripHtml(post.content || "") ||
    "Read practical guidance from Fintaraa experts to compare financial products and make confident decisions."
  );
}

function BlogSkeleton() {
  return (
    <div className="flex gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-100 w-[18rem] shrink-0 animate-pulse rounded-2xl bg-slate-100 sm:w-[20rem] md:w-88"
        >
          <div className="h-48 rounded-t-2xl bg-slate-200/70" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-24 rounded bg-white/80" />
            <div className="h-5 rounded bg-white/80" />
            <div className="h-5 w-4/5 rounded bg-white/80" />
            <div className="h-14 rounded bg-white/80" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecentBlogCard({ post }: { post: WebsiteKnowledgeItem }) {
  const category = post.category || "Financial Planning";
  const meta = getCategoryMeta(category);
  const CategoryIcon = meta.icon;
  const authorName = post.authorName || "Fintaraa Editorial";
  const publishedDate = formatKnowledgeDate(post.publishedAt);
  const summary = getSummary(post);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex w-[18rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#dfeaf5] bg-white no-underline transition-colors duration-300 hover:border-[#bdd4e9] sm:w-[20rem] md:w-88"
    >
      <div className="relative min-h-48 w-full overflow-hidden bg-[#eaf2f9]">
        <Image
          src={post.coverImageUrl || "/assets/banks/visa-card.png"}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 18rem, (max-width: 768px) 20rem, 22rem"
          unoptimized
          draggable={false}
          className="w-full object-cover select-none h-56 transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/5 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-bold text-[#667085]">
            <span className="inline-flex items-center gap-1.5 text-[#075cde]">
              <CategoryIcon className="h-3.5 w-3.5" />
              {category}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-[#195585]" />
              {publishedDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#12b76a]" />
              {post.readTime || "5 min read"}
            </span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-[17px] font-extrabold leading-snug tracking-tight text-[#111625] transition group-hover:text-[#005ca8]">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-6 text-[#667085]">
            {summary}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#edf2f7] pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] text-[#195585]">
              <UserRound className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold uppercase tracking-[0.08em] text-[#98a2b3]">
                By {authorName}
              </p>
              <p className="truncate text-[12px] font-bold text-[#111625]">
                {post.authorRole || "Financial Research Desk"}
              </p>
            </div>
          </div>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#005ca8] text-white transition group-hover:translate-x-1 group-hover:bg-[#064cb8]">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function RecentBlogs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<WebsiteKnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    let mounted = true;
    fetchWebsiteKnowledge({
      type: "blog",
      sectionKey: "recent_blogs",
      limit: 12,
    })
      .then(
        (items) => mounted && setPosts(items.length ? items : fallbackBlogs),
      )
      .catch(() => mounted && setPosts(fallbackBlogs))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (trackRef.current) setTrackWidth(trackRef.current.scrollWidth);
  }, [posts]);

  useAnimationFrame((_, delta) => {
    if (isPaused || !trackWidth) return;
    const nextX = x.get() - 0.8 * (delta / 16);
    const loopThreshold = trackWidth / 3;
    x.set(Math.abs(nextX) >= loopThreshold ? nextX + loopThreshold : nextX);
  });

  const displayPosts = [...posts, ...posts, ...posts];

  return (
    <section className="overflow-hidden select-none bg-white px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mb-2 flex items-center justify-between gap-4">
          <h2 className="text-[24px] font-bold tracking-tight text-[#111625] md:text-[28px]">
            Recent Blogs
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/blog"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#075cde] px-5 text-[13px] font-bold text-white no-underline transition hover:bg-[#064cb8]"
            >
              View All Blogs
              <ArrowRight className="h-4 w-4" />
            </Link>
            <CarouselNavigation
              label="blogs"
              disabled={loading || !trackWidth}
              onPrevious={() =>
                moveInfiniteCarousel({
                  direction: "previous",
                  track: trackRef.current,
                  trackWidth,
                  x,
                  onPauseChange: setIsPaused,
                })
              }
              onNext={() =>
                moveInfiniteCarousel({
                  direction: "next",
                  track: trackRef.current,
                  trackWidth,
                  x,
                  onPauseChange: setIsPaused,
                })
              }
            />
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full overflow-hidden py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {loading ? (
            <BlogSkeleton />
          ) : (
            <motion.div
              ref={trackRef}
              style={{ x, touchAction: "pan-y" }}
              drag="x"
              dragConstraints={{
                left: -((trackWidth || 2000) * (2 / 3)),
                right: 0,
              }}
              dragElastic={0.05}
              onDragStart={() => setIsPaused(true)}
              onDragEnd={() => setIsPaused(false)}
              className="flex w-max cursor-grab gap-6 active:cursor-grabbing"
            >
              {displayPosts.map((post, index) => (
                <RecentBlogCard key={`${post.slug}-${index}`} post={post} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
