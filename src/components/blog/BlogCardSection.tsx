"use client";

import Image from "next/image";
import Link from "next/link";
import { type BlogPost, type BlogAuthor } from "@/data/blogs";

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
    <section className="bg-white px-4 py-12 font-sans antialiased md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-50 pb-2">
          <h2 className="text-[22px] font-bold tracking-tight text-[#1a1d25]">
            Latest Article
          </h2>
          <Link
            href="/blog/all"
            className="text-[13.5px] font-bold text-[#005ca8] hover:underline"
          >
            View all
          </Link>
        </div>

        {/* 3-Column Balanced Card Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayPosts.slice(0, 6).map((post, index) => {
            const authorInfo = normalizeAuthor(post.author);
            return (
              <article
                key={post.slug || index}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#e5edf5] bg-white shadow-[0_4px_16px_rgba(22,34,50,0.01)] transition-shadow duration-300 hover:shadow-md"
              >
                {/* Card Thumbnail Container */}
                <div className="relative h-48 w-full bg-gray-50">
                  {/* Visual placeholder using standard Image component */}
                  <Image
                    src={`/assets/blogs/blog${index + 1}.png`}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Card Body Content */}
                <div className="flex flex-1 flex-col justify-between gap-5 p-5">
                  <div className="space-y-4">
                    {/* Article Title */}
                    <h3 className="max-w-xs text-[16px] font-bold leading-snug tracking-tight text-[#000000]">
                      {post.title}
                    </h3>

                    {/* Author Profile & Time Matrix */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      {/* Left profile info */}
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white bg-gray-100">
                          <Image
                            src={authorInfo.avatar}
                            alt={authorInfo.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-[12px] font-bold leading-none text-[#000000]">
                            {authorInfo.name}
                          </h4>
                          <p className="mt-1 text-[10px] font-medium text-[#93a2b2]">
                            {authorInfo.role}
                          </p>
                        </div>
                      </div>

                      {/* Right timestamp meta block */}
                      <div className="flex items-center gap-3 whitespace-nowrap text-[11px] font-medium text-[#93a2b2]">
                        <span>{post.readTime}</span>
                        <span>{post.publishedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Interactive Footer */}
                  <div className="pt-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#005ca8] px-5 text-[12.5px] font-bold text-white no-underline transition-colors hover:bg-[#004b87]"
                    >
                      <span>Read more</span>
                      <span className="mt-0.5 text-[14px] leading-none">→</span>
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