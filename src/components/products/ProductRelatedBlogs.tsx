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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: BLOG_LIMIT }).map((_, index) => (
        <div
          key={index}
          className="h-96 w-full animate-pulse rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden"
        >
          <div className="h-48 bg-slate-200/70" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-5 rounded bg-slate-200" />
            <div className="h-4 w-4/5 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductRelatedBlogs({
  category,
  productName,
  className,
}: {
  category: ProductBlogCategory;
  productName: string;
  className?: string;
}) {
  const fallbackPosts = useMemo(
    () => getFallbackBlogKnowledgeItems({ category, limit: BLOG_LIMIT }),
    [category],
  );
  const [posts, setPosts] = useState<WebsiteKnowledgeItem[]>(fallbackPosts);
  const [loading, setLoading] = useState(true);

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
    <section className={`py-10 sm:py-14 bg-white border-b border-purple-100/60 ${className || ""}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900 leading-[1.12]">
              {productName} Blogs & Guides
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-[#5B21B6] px-5 text-[13px] font-medium text-white no-underline transition hover:bg-[#4C1D95]"
          >
            View All Blogs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          {loading ? (
            <ProductBlogSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
