"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  BookOpenText,
  Clock3,
  FileText,
  Landmark,
  UserRound,
  CreditCard,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { type BlogPost, type BlogAuthor } from "@/data/blogs";
import { formatKnowledgeDate, stripHtml } from "@/services/websiteKnowledge";

type BlogCardPost = BlogPost & {
  coverImageUrl?: string;
  htmlContent?: string;
  summary?: string;
};

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

function normalizeAuthor(author: string | BlogAuthor): BlogAuthor {
  if (typeof author === "string") {
    return {
      name: author,
      role: "Financial Analyst",
      avatar: "/assets/images/user1.png",
    };
  }
  return author;
}

function getCategoryMeta(category: string) {
  return categoryMeta[category] || fallbackCategoryMeta;
}

function getCoverImage(post: BlogCardPost, index: number) {
  return post.coverImageUrl || `/assets/blogs/blog${(index % 6) + 1}.png`;
}

function getExcerpt(post: BlogCardPost) {
  const summary = post.summary || stripHtml(post.htmlContent || "");
  return (
    post.excerpt ||
    summary ||
    "Read practical guidance from Fintaraa experts to compare options, avoid common mistakes, and make confident financial decisions."
  );
}

export function BlogCardSection({
  posts,
  emptyMessage = "No articles are available yet.",
  showViewAll = true,
}: {
  posts: BlogPost[];
  emptyMessage?: string;
  showViewAll?: boolean;
}) {
  const displayPosts = posts as BlogCardPost[];

  return (
    <section className="px-4 pt-4 font-sans antialiased sm:px-6 md:px-8 md:pt-6 lg:px-16">
      <div className="mx-auto max-w-9xl">
        <div className="mb-7 border-b border-[#dfeaf5] pb-5 text-center sm:mb-8">
          <div>
            <h2 className="mt-3 text-[24px] font-extrabold leading-tight tracking-tight text-[#111625] sm:text-[28px]">
              Latest Articles
            </h2>
          </div>
        </div>

        {displayPosts.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {displayPosts.map((post, index) => {
            const authorInfo = normalizeAuthor(post.author);
            const publishedDate = formatKnowledgeDate(post.publishedAt);
            const excerpt = getExcerpt(post);
            const cardCategory = post.category || "Financial Planning";
            const meta = getCategoryMeta(cardCategory);
            const CategoryIcon = meta.icon;

              return (
                <Link
                  key={post.slug || index}
                  href={`/blog/${post.slug}`}
                  className="group block h-full no-underline"
                >
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#dfeaf5] bg-white transition duration-300 group-hover:-translate-y-1 group-hover:border-[#bcd3e8]">
                  <div className="relative h-56 w-full overflow-hidden bg-[#eaf2f9]">
                    <Image
                      src={getCoverImage(post, index)}
                      alt={post.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/5 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-5 p-5 sm:p-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-bold text-[#667085]">
                        <span className="inline-flex items-center gap-1.5 text-[#075cde]">
                          <CategoryIcon className="h-3.5 w-3.5" />
                          {cardCategory}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-[#195585]" />
                          {publishedDate}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5 text-[#12b76a]" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="mt-4 line-clamp-2 text-[19px] font-extrabold leading-tight tracking-tight text-[#111625] transition group-hover:text-[#005ca8]">
                        {post.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-[14px] font-medium leading-6 text-[#667085]">
                        {excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-[#edf2f7] pt-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#eef6ff] shadow-[0_8px_18px_rgba(16,24,40,0.08)]">
                          {authorInfo.avatar ? (
                            <Image
                              src={authorInfo.avatar}
                              alt={authorInfo.name}
                              fill
                              unoptimized
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <UserRound className="m-2 h-6 w-6 text-[#195585]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-bold uppercase tracking-[0.08em] text-[#98a2b3]">
                            By {authorInfo.name}
                          </p>
                          <p className="mt-0.5 truncate text-[13px] font-bold text-[#111625]">
                            {authorInfo.role}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#005ca8] text-white transition group-hover:translate-x-1 group-hover:bg-[#064cb8]">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#bfd3e5] bg-[#f7fbff] px-5 py-12 text-center">
            <BookOpenText className="mx-auto h-7 w-7 text-[#075cde]" />
            <p className="mt-3 text-[14px] font-bold text-[#526b80]">
              {emptyMessage}
            </p>
          </div>
        )}

        {showViewAll && displayPosts.length ? (
          <div className="mt-8 flex justify-center">
            <Link
              href="/blog/all"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#075cde] px-6 text-[14px] font-bold text-white no-underline transition hover:bg-[#064cb8]"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
