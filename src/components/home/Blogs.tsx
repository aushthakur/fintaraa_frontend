"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Flame,
  Landmark,
  Newspaper,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  fetchWebsiteKnowledge,
  formatKnowledgeDate,
  stripHtml,
  type WebsiteKnowledgeItem,
} from "@/services/websiteKnowledge";

export type EditorialBlog = WebsiteKnowledgeItem & {
  keyTakeaways?: string[];
  trending?: boolean;
  featured?: boolean;
};

const EDITORIAL_STORIES: EditorialBlog[] = [
  {
    title: "How to Choose the Right Personal Loan Without Overpaying",
    slug: "choose-right-personal-loan",
    type: "blog",
    coverImageUrl: "/assets/blogs/blog1.png",
    summary:
      "A low EMI can still be expensive if tenure is stretched too far. Compare APR, processing fees, part-payment rules, and prepayment terms before locking in an offer.",
    category: "Loans",
    readTime: "6 min read",
    publishedAt: "2026-05-10",
    authorName: "Fintaraa Credit Desk",
    authorRole: "Senior Lending Strategist",
    featured: true,
    trending: true,
    keyTakeaways: [
      "A low EMI can mask steep total interest over extended loan tenures.",
      "Compare Annual Percentage Rate (APR) rather than simple interest.",
      "Check indicative fit before triggering multiple hard bureau inquiries.",
    ],
  },
  {
    title: "Practical Ways to Improve Your CIBIL Score Above 800",
    slug: "improve-cibil-score-practical-steps",
    type: "blog",
    coverImageUrl: "/assets/blogs/blog2.png",
    summary:
      "Consistent repayment history, controlled card utilisation below 30%, and periodic dispute reviews build prime borrower credibility.",
    category: "Credit Score",
    readTime: "5 min read",
    publishedAt: "2026-05-06",
    authorName: "Fintaraa Bureau Desk",
    authorRole: "Credit Health Analyst",
    featured: true,
    trending: true,
    keyTakeaways: [
      "Payment history accounts for over 35% of your aggregate CIBIL score.",
      "Maintain credit card utilisation strictly under 30% across all billing cycles.",
      "Dispute closed loans wrongly reported as active within 30 days.",
    ],
  },
  {
    title: "Home Loan Eligibility & Documents Checklist for Fast Approvals",
    slug: "home-loan-eligibility-documents",
    type: "blog",
    coverImageUrl: "/assets/blogs/blog5.png",
    summary:
      "Organize property chain deeds, sanctioned plans, tax receipts, and verified banking cashflows early to eliminate sanction bottlenecks.",
    category: "Loans",
    readTime: "8 min read",
    publishedAt: "2026-04-12",
    authorName: "Fintaraa Mortgage Team",
    authorRole: "Home Loan Specialist",
    trending: true,
    keyTakeaways: [
      "Property legal verification takes up to 60% of total turnaround time.",
      "Keep 6-month clear banking statements with consistent balance buffers.",
    ],
  },
  {
    title: "Term Insurance: Critical Exclusions to Check Before You Buy",
    slug: "term-insurance-before-you-buy",
    type: "blog",
    coverImageUrl: "/assets/blogs/blog3.png",
    summary:
      "Understand coverage amount, 3-year incontestability rules, claim settlement ratios, waiting periods, and critical illness riders before signing.",
    category: "Insurance",
    readTime: "7 min read",
    publishedAt: "2026-04-28",
    authorName: "Fintaraa Insurance Team",
    authorRole: "Actuarial & Claims Research",
    keyTakeaways: [
      "Choose pure term cover equal to at least 15–20x of annual household expenses.",
      "Declare pre-existing conditions truthfully to prevent future claim repudiation.",
    ],
  },
  {
    title: "A Clear Guide to Selecting the Right Credit Card for Your Spends",
    slug: "credit-card-selection-guide",
    type: "blog",
    coverImageUrl: "/assets/blogs/blog4.png",
    summary:
      "The best card is not always the one with the highest advertised reward rate. Match fee waiver thresholds to your authentic monthly lifestyle spends.",
    category: "Credit Cards",
    readTime: "5 min read",
    publishedAt: "2026-04-20",
    authorName: "Fintaraa Cards Desk",
    authorRole: "Payment Products Team",
    keyTakeaways: [
      "Fuel and grocery cards deliver better net value than travel cards for daily spenders.",
      "Always compare annual fee renewal waiver criteria before committing.",
    ],
  },
  {
    title: "Why an Emergency Fund Matters Before Taking Any Large Debt",
    slug: "emergency-fund-before-loan",
    type: "blog",
    coverImageUrl: "/assets/blogs/blog6.png",
    summary:
      "A liquid cash buffer safeguards your credit profile and eliminates high-stress borrowing when unexpected expenses arrive.",
    category: "Financial Planning",
    readTime: "4 min read",
    publishedAt: "2026-04-04",
    authorName: "Fintaraa Money Guide",
    authorRole: "Wealth Advisor",
    keyTakeaways: [
      "Stash 3 to 6 months of essential living expenses in high-yield liquid instruments.",
      "Never lock emergency liquidity in market-volatile or penalty-heavy schemes.",
    ],
  },
  {
    title: "Business Loan Documents and Cash Flow Checks",
    slug: "business-loan-documents-cash-flow-checklist",
    type: "blog",
    coverImageUrl: "/assets/blogs/blog1.png",
    summary:
      "Know the audited records, GST reconciliation, and banking seasonality underwriters review before approving growth capital.",
    category: "Loans",
    readTime: "6 min read",
    publishedAt: "2026-03-28",
    authorName: "Fintaraa SME Desk",
    authorRole: "Commercial Finance Team",
  },
  {
    title: "Gold Loan Valuation and Repayment Structures Explained",
    slug: "gold-loan-valuation-and-repayment-guide",
    type: "blog",
    coverImageUrl: "/assets/blogs/blog2.png",
    summary:
      "Understand karat purity checks, RBI loan-to-value caps, bullet repayment terms, and auction triggers before pledging family gold.",
    category: "Loans",
    readTime: "5 min read",
    publishedAt: "2026-03-22",
    authorName: "Fintaraa Gold Loan Desk",
    authorRole: "Secured Lending Analyst",
  },
  {
    title: "Health Insurance Coverage Checklist: Room Rent Caps & Co-pay",
    slug: "health-insurance-coverage-checklist",
    type: "blog",
    coverImageUrl: "/assets/blogs/blog3.png",
    summary:
      "Room rent capping and proportionate deduction clauses can leave you with surprise hospital bills. Learn what to look out for.",
    category: "Insurance",
    readTime: "7 min read",
    publishedAt: "2026-03-18",
    authorName: "Fintaraa Health Desk",
    authorRole: "Protection Specialist",
  },
  {
    title: "Car Insurance Claim Documents & Cashless Garage Protocol",
    slug: "car-insurance-claim-documents-guide",
    type: "blog",
    coverImageUrl: "/assets/blogs/blog4.png",
    summary:
      "Prepare claim intimation, RC, driving licence, surveyor estimate, and spot photos for zero-delay vehicular settlements.",
    category: "Insurance",
    readTime: "5 min read",
    publishedAt: "2026-03-12",
    authorName: "Fintaraa Motor Desk",
    authorRole: "Claims Advisory",
  },
];

type CategoryMeta = {
  icon: LucideIcon;
  color: string;
};

const categoryMeta: Record<string, CategoryMeta> = {
  Loans: {
    icon: Landmark,
    color: "#5b21b6",
  },
  "Credit Score": {
    icon: ShieldCheck,
    color: "#0f766e",
  },
  Insurance: {
    icon: FileText,
    color: "#c2410c",
  },
  "Credit Cards": {
    icon: CreditCard,
    color: "#4338ca",
  },
  "Financial Planning": {
    icon: BookOpenText,
    color: "#b45309",
  },
};

const fallbackCategoryMeta: CategoryMeta = {
  icon: BookOpenText,
  color: "#5b21b6",
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

/**
 * Compatibility export for ProductRelatedBlogs and other consumers
 */
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
      className="group flex w-[18rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#dfeaf5] bg-white no-underline transition-all duration-300 hover:border-[#5b21b6]/40 hover:shadow-lg sm:w-[20rem] md:w-88"
    >
      <div className="relative min-h-48 w-full overflow-hidden bg-[#eaf2f9]">
        <Image
          src={post.coverImageUrl || "/assets/blogs/blog1.png"}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 18rem, (max-width: 768px) 20rem, 22rem"
          unoptimized
          draggable={false}
          className="w-full object-cover select-none h-56 transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#5b21b6] shadow-xs backdrop-blur-xs">
          <CategoryIcon className="h-3 w-3" />
          {category}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-bold text-[#667085]">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3 text-[#5b21b6]" />
              {publishedDate}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3 w-3 text-[#12b76a]" />
              {post.readTime || "5 min read"}
            </span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-[17px] font-extrabold leading-snug tracking-tight text-[#111625] transition group-hover:text-[#5b21b6]">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-6 text-[#667085]">
            {summary}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#edf2f7] pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3e8ff] text-[#5b21b6]">
              <UserRound className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[#98a2b3]">
                By {authorName}
              </p>
              <p className="truncate text-[11px] font-bold text-[#111625]">
                {post.authorRole || "Financial Research Desk"}
              </p>
            </div>
          </div>
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5b21b6] text-white transition group-hover:translate-x-1 group-hover:bg-[#4c1d95]">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

const CATEGORIES = [
  "All Insights",
  "Loans",
  "Credit Score",
  "Credit Cards",
  "Insurance",
  "Financial Planning",
] as const;

const TRENDING_TAGS = [
  "CIBIL 800+ Blueprint",
  "Repo-Linked Rates",
  "0% Forex Cards",
  "Term Insurance Incontestability",
  "Emergency Fund Buffer",
  "Part-Payment Strategy",
];

export function RecentBlogs() {
  const [posts, setPosts] = useState<EditorialBlog[]>(EDITORIAL_STORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Insights");

  useEffect(() => {
    let mounted = true;
    fetchWebsiteKnowledge({
      type: "blog",
      sectionKey: "recent_blogs",
      limit: 12,
    })
      .then((items) => {
        if (!mounted || !items || !items.length) return;
        // Merge API data with local rich editorial data
        const merged: EditorialBlog[] = items.map((apiItem, idx) => {
          const matchedFallback = EDITORIAL_STORIES.find(
            (fb) => fb.slug === apiItem.slug || fb.title.toLowerCase() === apiItem.title.toLowerCase()
          );
          const fallbackCover = EDITORIAL_STORIES[idx % EDITORIAL_STORIES.length].coverImageUrl;
          return {
            ...apiItem,
            coverImageUrl: apiItem.coverImageUrl || matchedFallback?.coverImageUrl || fallbackCover,
            keyTakeaways: matchedFallback?.keyTakeaways || [
              "Carefully review APR, processing charges and reset terms.",
              "Verify eligibility benchmarks before applying.",
            ],
            readTime: apiItem.readTime || matchedFallback?.readTime || "5 min read",
            authorRole: apiItem.authorRole || matchedFallback?.authorRole || "Financial Research Desk",
          };
        });

        // Ensure we have at least full set
        if (merged.length < EDITORIAL_STORIES.length) {
          const slugs = new Set(merged.map((m) => m.slug));
          EDITORIAL_STORIES.forEach((fb) => {
            if (!slugs.has(fb.slug)) merged.push(fb);
          });
        }
        setPosts(merged);
      })
      .catch(() => {
        if (mounted) setPosts(EDITORIAL_STORIES);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Filter posts based on tab
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All Insights") return posts;
    return posts.filter((p) => (p.category || "").toLowerCase() === selectedCategory.toLowerCase());
  }, [posts, selectedCategory]);

  // Lead Cover Story
  const coverStory = filteredPosts[0] || EDITORIAL_STORIES[0];

  // Secondary Featured Stories (2 items)
  const secondaryStories = filteredPosts.slice(1, 3);

  // Quick Reads Wire (4 items)
  const wireStories = filteredPosts.slice(3, 7).length >= 3
    ? filteredPosts.slice(3, 7)
    : posts.filter((p) => p.slug !== coverStory.slug).slice(0, 4);

  // Bottom Grid Stories (4 items)
  const bottomGridStories = filteredPosts.slice(3, 7).length >= 4
    ? filteredPosts.slice(3, 7)
    : posts.slice(2, 6);

  const coverMeta = getCategoryMeta(coverStory.category);
  const CoverCategoryIcon = coverMeta.icon;

  return (
    <section className="bg-white py-10 sm:py-14 select-none border-t border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* 1. TIMES OF INDIA EDITORIAL MASTHEAD & EDITION BAR                         */}
        {/* ========================================================================= */}
        <div className="border-b-2 border-slate-900 pb-3 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            <div className="flex items-center gap-3">
              <span className="font-normal normal-case text-slate-700 text-[13px] tracking-normal">
                The Fintaraa Chronicle
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="hidden sm:inline text-slate-600 font-medium">
                National Financial Desk • Daily Intelligence
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 text-red-600 font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                LIVE WIRE
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SECTION HEADER & DYNAMIC CATEGORY FILTER TABS                          */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center justify-center p-1 rounded-md bg-[#f3e8ff] text-[#5b21b6]">
                <Newspaper className="h-4 w-4" />
              </span>
              <span className="text-[12px] font-extrabold uppercase tracking-widest text-[#5b21b6]">
                Research &amp; Editorial Desk
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight text-slate-900 leading-tight">
              Financial Insights That Actually Help
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl font-medium">
              Clear, uncompromised reporting &amp; borrowing playbooks decoded by independent financial editors.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-[#5b21b6] px-4 py-2 text-[12px] font-bold text-white shadow-xs transition hover:bg-[#4c1d95] no-underline"
            >
              <span>View All 30+ Insights</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Category Filter Pills (TOI Section Tabs) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 mb-5">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#5b21b6] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Trending Dispatches Ticker (TOI / ET Breaking News Style) */}
        <div className="mb-8 rounded-lg bg-linear-to-r from-purple-50 via-slate-50 to-purple-50/50 p-2.5 sm:px-4 border border-purple-100 flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-extrabold text-[#5b21b6] shrink-0 uppercase tracking-wide text-[11px]">
            <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
            <span>Trending Topics:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {TRENDING_TAGS.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200/80 shadow-2xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. INNOVATIVE 3-COLUMN TIMES OF INDIA BROADSHEET FRONT PAGE               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:divide-x lg:divide-slate-200">
          
          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 1: THE LEAD COVER STORY (5 Cols on Desktop - 41%)               */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col justify-between group">
            <Link href={`/blog/${coverStory.slug}`} className="block no-underline">
              {/* Cover Photo */}
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                <Image
                  src={coverStory.coverImageUrl || "/assets/blogs/blog1.png"}
                  alt={coverStory.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  unoptimized
                  draggable={false}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    Cover Story
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#5b21b6] backdrop-blur-xs shadow-sm">
                    <CoverCategoryIcon className="h-3 w-3" />
                    {coverStory.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs font-medium">
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <Clock3 className="h-3 w-3 text-emerald-400" />
                    {coverStory.readTime || "6 min read"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <CalendarDays className="h-3 w-3 text-purple-300" />
                    {formatKnowledgeDate(coverStory.publishedAt)}
                  </span>
                </div>
              </div>

              {/* Title & Excerpt */}
              <div className="mt-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight group-hover:text-[#5b21b6] transition-colors">
                  {coverStory.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
                  {getSummary(coverStory)}
                </p>
              </div>
            </Link>

            {/* TOI Exclusive: "Key Takeaways" Editorial Box */}
            {coverStory.keyTakeaways && coverStory.keyTakeaways.length > 0 && (
              <div className="mt-4 rounded-xl bg-purple-50/70 border border-purple-100/90 p-3.5 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#5b21b6] text-[10px] mb-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#5b21b6]" />
                  Key Takeaways (Editor&apos;s Brief)
                </div>
                <ul className="space-y-1.5">
                  {coverStory.keyTakeaways.slice(0, 3).map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed text-slate-700">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#5b21b6] shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Author Byline & Read CTA */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-[#f3e8ff] text-[#5b21b6] font-bold flex items-center justify-center text-xs">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {coverStory.authorName || "Fintaraa Credit Desk"}
                  </p>
                  <p className="text-[10px] font-medium text-slate-500">
                    {coverStory.authorRole || "Senior Lending Strategist"}
                  </p>
                </div>
              </div>

              <Link
                href={`/blog/${coverStory.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5b21b6] hover:text-[#4c1d95] transition group-hover:translate-x-0.5 no-underline"
              >
                <span>Read Analysis</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 2: SECONDARY FEATURED HEADLINES (4 Cols on Desktop - 33%)       */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-4 lg:pl-8 flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#5b21b6]" />
                Top Developing Stories
              </span>
              <span className="text-[11px] font-semibold text-slate-400">In-Depth</span>
            </div>

            {secondaryStories.map((story, index) => {
              const meta = getCategoryMeta(story.category);
              const Icon = meta.icon;
              return (
                <article key={story.slug} className="group">
                  <Link href={`/blog/${story.slug}`} className="block no-underline">
                    <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-slate-100 shadow-2xs">
                      <Image
                        src={story.coverImageUrl || `/assets/blogs/blog${index + 2}.png`}
                        alt={story.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 30vw"
                        unoptimized
                        draggable={false}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-[#5b21b6] shadow-2xs">
                          <Icon className="h-3 w-3" />
                          {story.category}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {story.readTime || "5 min read"}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mb-1">
                        <CalendarDays className="h-3 w-3" />
                        <span>{formatKnowledgeDate(story.publishedAt)}</span>
                      </div>
                      <h4 className="text-[16px] font-bold text-slate-900 leading-snug group-hover:text-[#5b21b6] transition-colors line-clamp-2">
                        {story.title}
                      </h4>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                        {getSummary(story)}
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs font-semibold text-[#5b21b6]">
                      <span className="text-[11px] text-slate-500 font-medium">By {story.authorName || "Editorial"}</span>
                      <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Story <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                  {index === 0 && <div className="mt-5 border-b border-slate-200" />}
                </article>
              );
            })}
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 3: THE WIRE / FAST READS & OPINION (3 Cols on Desktop - 25%)    */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-3 lg:pl-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  Fast Reads Wire
                </span>
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                  &lt; 5 Min
                </span>
              </div>

              {/* Numbered Listicle (TOI / ET Style List) */}
              <div className="divide-y divide-slate-100">
                {wireStories.map((post, index) => {
                  const meta = getCategoryMeta(post.category);
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group block py-3 no-underline transition-colors hover:bg-slate-50/80 rounded-lg px-2"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-serif text-2xl font-black text-slate-300 group-hover:text-[#5b21b6] transition-colors leading-none pt-0.5">
                          0{index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span
                            className="inline-block text-[10px] font-bold uppercase tracking-wider mb-1"
                            style={{ color: meta.color }}
                          >
                            {post.category}
                          </span>
                          <h5 className="text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#5b21b6] transition-colors">
                            {post.title}
                          </h5>
                          <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                            <span>{post.readTime || "4 min read"}</span>
                            <span>•</span>
                            <span className="text-[#5b21b6] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                              View <ArrowRight className="h-2.5 w-2.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* TOI Style "Financial Rule of Thumb / Did You Know" Box */}
            <div className="mt-6 rounded-xl bg-slate-900 p-4 text-white shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#5b21b6]/30 rounded-full blur-xl" />
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-400 mb-1.5">
                <Sparkles className="h-3 w-3" />
                <span>Financial Rule of Thumb</span>
              </div>
              <p className="text-xs font-medium leading-relaxed text-slate-200">
                “Keeping your total credit card utilisation strictly below <span className="text-amber-300 font-bold">30%</span> accounts for over 30% of your CIBIL rating algorithm.”
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Fintaraa Bureau Advisory</span>
                <Link href="/credit-score" className="text-purple-300 font-bold hover:underline">
                  Check Score Free →
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. BOTTOM 4-CARD EDITORIAL GRID ("MORE FRONT PAGE STORIES")               */}
        {/* ========================================================================= */}
        <div className="mt-10 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#5b21b6]" />
              More Essential Reads from Fintaraa Editors
            </h3>
            <Link
              href="/blog"
              className="text-xs font-bold text-[#5b21b6] hover:text-[#4c1d95] flex items-center gap-1"
            >
              Browse Archive <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bottomGridStories.map((post, idx) => {
              const meta = getCategoryMeta(post.category);
              const Icon = meta.icon;
              return (
                <Link
                  key={`${post.slug}-${idx}`}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs hover:border-purple-300 hover:shadow-md transition-all duration-300 no-underline flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-slate-100 mb-3">
                      <Image
                        src={post.coverImageUrl || `/assets/blogs/blog${(idx % 6) + 1}.png`}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized
                        draggable={false}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold text-[#5b21b6]">
                        <Icon className="h-2.5 w-2.5" />
                        {post.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 mb-1.5">
                      <Clock3 className="h-3 w-3 text-emerald-600" />
                      <span>{post.readTime || "5 min read"}</span>
                      <span>•</span>
                      <span>{formatKnowledgeDate(post.publishedAt)}</span>
                    </div>

                    <h4 className="text-[14px] font-bold text-slate-900 leading-snug group-hover:text-[#5b21b6] transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {getSummary(post)}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium truncate max-w-[120px]">
                      {post.authorName || "Editorial Desk"}
                    </span>
                    <span className="font-bold text-[#5b21b6] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
