"use client";

import Image from "next/image";
import Link from "next/link";
import { type BlogPost, type BlogAuthor } from "@/data/blogs";
import { formatKnowledgeDate } from "@/services/websiteKnowledge";

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

export function BlogCardSection({ posts }: { posts: BlogPost[] }) {
  // Graceful fallback to map identical layout content fields from image_e41c5f.jpg
  const placeholderPosts = Array(6)
    .fill(null)
    .map((_, i) => ({
      slug: `sample-post-${i}`,
      title: "10 Smart Ways to Manage Your Monthly Budget",
      thumbnail: `/assets/blogs/blog${i}.png`, // Swappable with real images
      readTime: "5 min read",
      publishedAt: "Jan 15, 2026",
      author: {
        name:
          i % 3 === 0
            ? "Rahul Sharma"
            : i % 3 === 1
              ? "Shivani Sharma"
              : "Shivkumar",
        role: "Financial Analyst",
        avatar: "/assets/images/user1.png",
      },
    }));

  const displayPosts = posts && posts.length > 0 ? posts : placeholderPosts;

  return (
    <section className="bg-white px-4 py-8 font-sans antialiased sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-16">
      <div className="mx-auto max-w-9xl">
        {/* Section Header */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-50 pb-2 sm:mb-8">
          <h2 className="text-xl font-bold tracking-tight text-[#1a1d25] sm:text-2xl md:text-[22px] lg:text-[24px]">
            Latest Article
          </h2>
          <Link
            href="/blog/all"
            className="text-xs font-bold text-[#005ca8] hover:underline sm:text-sm md:text-[13.5px]"
          >
            View all
          </Link>
        </div>

        {/* 3-Column Balanced Card Grid */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {displayPosts.map((post, index) => {
            const authorInfo = normalizeAuthor(post.author);
            const publishedDate = formatKnowledgeDate(post.publishedAt);
            return (
              <article
                key={post.slug || index}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#e5edf5] bg-white shadow-[0_4px_16px_rgba(22,34,50,0.01)] transition-shadow duration-300 hover:shadow-md"
              >
                {/* Card Thumbnail Container - responsive height */}
                <div className="relative h-40 w-full bg-gray-50 sm:h-44 md:h-48 lg:h-52 xl:h-56">
                  {/* Visual placeholder using standard Image component */}
                  <Image
                    src={(post as any).coverImageUrl || `/assets/blogs/blog${index + 1}.png`}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Card Body Content - responsive padding */}
                <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:gap-5 sm:p-5 md:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Article Title - responsive text size */}
                    <h3 className="max-w-xs text-sm font-bold leading-snug tracking-tight text-[#000000] sm:text-base md:text-[16px] lg:text-lg xl:text-xl">
                      {post.title}
                    </h3>

                    {/* Author Profile & Time Matrix */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      {/* Left profile info */}
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white bg-gray-100 sm:h-8 sm:w-8 md:h-9 md:w-9">
                          <Image
                            src={authorInfo.avatar}
                            alt={authorInfo.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold leading-none text-[#000000] sm:text-xs md:text-sm">
                            {authorInfo.name}
                          </h4>
                          <p className="mt-0.5 text-[9px] font-medium text-[#93a2b2] sm:mt-1 sm:text-[10px] md:text-xs">
                            {authorInfo.role}
                          </p>
                        </div>
                      </div>

                      {/* Right timestamp meta block - responsive text */}
                      <div className="flex shrink-0 flex-col items-end gap-1 whitespace-nowrap text-right text-[10px] font-medium leading-tight text-[#93a2b2] sm:text-[11px] md:text-xs lg:text-sm">
                        <span>{post.readTime}</span>
                        <span>{publishedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Interactive Footer */}
                  <div className="pt-1 sm:pt-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#005ca8] px-4 text-[11px] font-bold text-white no-underline transition-colors hover:bg-[#004b87] sm:h-9 sm:gap-2 sm:px-5 sm:text-xs md:text-[13px] lg:text-sm"
                    >
                      <span>Read more</span>
                      <span className="mt-0.5 text-[12px] leading-none sm:text-sm md:text-[14px]">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
