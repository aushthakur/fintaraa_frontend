"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RecentBlogCard } from "@/components/home/Blogs";
import {
  fetchWebsiteKnowledge,
  getFallbackBlogKnowledgeItems,
  type WebsiteKnowledgeItem,
} from "@/services/websiteKnowledge";

type ProductBlogCategory = "Loans" | "Insurance";

const BLOG_LIMIT = 3;

const sectionCopy: Record<
  ProductBlogCategory,
  { description: string }
> = {
  Loans: {
    description:
      "Category-wise articles on eligibility, documents, EMI planning, fees, and responsible borrowing.",
  },
  Insurance: {
    description:
      "Category-wise articles on coverage, documents, premium checks, claims, and policy selection.",
  },
};

const sameCategory = (
  item: WebsiteKnowledgeItem,
  category: ProductBlogCategory,
) => (item.category || "").toLowerCase() === category.toLowerCase();

const mergeWithFallback = (
  items: WebsiteKnowledgeItem[],
  fallback: WebsiteKnowledgeItem[],
) => {
  const seen = new Set<string>();
  return [...items, ...fallback]
    .filter((item) => {
      const key = item.slug || item.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, BLOG_LIMIT);
};

function ProductBlogSkeleton() {
  return (
    <div className="flex gap-6 overflow-hidden">
      {Array.from({ length: BLOG_LIMIT }).map((_, index) => (
        <div
          key={index}
          className="h-108 w-[18rem] shrink-0 animate-pulse rounded-2xl bg-slate-100 sm:w-[20rem] md:w-88"
        >
          <div className="h-56 rounded-t-2xl bg-slate-200/70" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-32 rounded bg-white/80" />
            <div className="h-5 rounded bg-white/80" />
            <div className="h-5 w-4/5 rounded bg-white/80" />
            <div className="h-12 rounded bg-white/80" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductRelatedBlogs({
  category,
  productName,
}: {
  category: ProductBlogCategory;
  productName: string;
}) {
  const fallbackPosts = useMemo(
    () => getFallbackBlogKnowledgeItems({ category, limit: BLOG_LIMIT }),
    [category],
  );
  const [posts, setPosts] = useState<WebsiteKnowledgeItem[]>(fallbackPosts);
  const [loading, setLoading] = useState(true);
  const copy = sectionCopy[category];

  useEffect(() => {
    let mounted = true;

    fetchWebsiteKnowledge({
      type: "blog",
      sectionKey: "recent_blogs",
      category,
      limit: 8,
    })
      .then((items) => {
        if (!mounted) return;
        const categoryItems = items.filter((item) =>
          sameCategory(item, category),
        );
        setPosts(mergeWithFallback(categoryItems, fallbackPosts));
      })
      .catch(() => mounted && setPosts(fallbackPosts))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [category, fallbackPosts]);

  return (
    <section className="bg-white px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-[24px] font-extrabold leading-tight tracking-tight text-[#111625] md:text-[28px]">
              {productName} Blogs & Guides
            </h2>
            <p className="mt-2 text-[14px] font-medium leading-6 text-[#667085]">
              {copy.description}
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-[#5b21b6] px-5 text-[13px] font-bold text-white no-underline transition hover:bg-[#4c1d95]"
          >
            View All Blogs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-2">
          {loading ? (
            <ProductBlogSkeleton />
          ) : (
            <div className="flex gap-6 lg:flex-wrap">
              {posts.map((post) => (
                <RecentBlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
