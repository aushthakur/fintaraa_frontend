"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Search,
  TrendingUp,
} from "lucide-react";
import { BlogVisual } from "@/components/blog/BlogVisual";
import { blogCategories, latestBlogPosts, type BlogPost } from "@/data/blogs";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BlogIndexPage({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const featured = posts.find((post) => post.featured) || posts[0];
  const latest = latestBlogPosts.slice(0, 4);

  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const matchesQuery =
        !normalized ||
        post.title.toLowerCase().includes(normalized) ||
        post.excerpt.toLowerCase().includes(normalized) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalized));
      return matchesCategory && matchesQuery;
    });
  }, [category, posts, query]);

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden px-4 pb-10 pt-10 md:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-0 top-7 hidden h-30 w-30 rotate-45 bg-[#d8ecff] md:block" />
        <div className="relative mx-auto grid max-w-9xl gap-8 lg:grid-cols-[1fr_0.86fr] lg:items-center">
          <div>
            <h1 className="max-w-4xl text-[42px] font-black leading-tight tracking-[-0.03em] text-[#005ca8] md:text-[58px]">
              Fintaraa Blogs & Financial Insights
            </h1>
            <p className="mt-4 max-w-2xl text-[20px] font-medium leading-8 text-[#111827]">
              Simple guides on loans, credit score, cards, insurance,
              eligibility, documents, and repayment planning.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-[#005ca8]">
              {["Loan guides", "Credit health", "Insurance basics"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#d7dfe8] bg-white px-4 py-2 text-[13px] font-black"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <Link
            href={`/blog/${featured.slug}`}
            className="block rounded-xl border border-[#d7dfe8] bg-white p-4 no-underline shadow-[0_18px_45px_rgba(16,24,40,0.10)]"
          >
            <BlogVisual
              title={featured.title}
              accent={featured.accent}
              category="Featured insight"
            />
            <div className="flex items-center justify-between gap-4 pt-4">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[#005ca8]">
                  {featured.category}
                </p>
                <p className="mt-1 text-[13px] font-semibold text-[#667085]">
                  {featured.readTime} · {formatDate(featured.publishedAt)}
                </p>
              </div>
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#13a653] text-white">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="px-4 pb-16 pt-8 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-8 lg:grid-cols-[1fr_21rem]">
          <div className="min-w-0">
            <div className="sticky top-28 z-20 mb-7 rounded-xl border border-[#d7dfe8] bg-white p-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <label className="relative block max-w-xl flex-1">
                  <Search className="absolute left-0 top-3.5 h-4 w-4 text-[#8b95a3]" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search loans, credit score, cards..."
                    className="h-11 w-full border-0 border-b border-[#d9dfe8] bg-transparent pl-7 text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#8b95a3] focus:border-[#005ca8]"
                  />
                </label>
                <div className="flex gap-2 overflow-x-auto">
                  {blogCategories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold transition ${
                        category === item
                          ? "bg-[#005ca8] text-white"
                          : "bg-[#e8f4ff] text-[#005ca8] hover:bg-[#d8ecff]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {filteredPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-[#d7dfe8] bg-white p-5 lg:sticky lg:top-28">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#005ca8]" />
              <h2 className="text-[20px] font-black text-[#2a2f36]">
                Latest posts
              </h2>
            </div>
            <div className="mt-5 grid gap-4">
              {latest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block border-b border-[#edf2f7] pb-4 text-[#111827] no-underline last:border-b-0 last:pb-0"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#005ca8]">
                    {post.category}
                  </p>
                  <h3 className="mt-2 text-[15px] font-black leading-5 group-hover:text-[#005ca8]">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex items-center gap-2 text-[12px] font-semibold text-[#667085]">
                    <Clock3 className="h-3.5 w-3.5" />
                    {post.readTime}
                  </p>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-[#d7dfe8] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(16,24,40,0.10)]">
      <Link href={`/blog/${post.slug}`} className="block no-underline">
        <BlogVisual
          title={post.title}
          accent={post.accent}
          category={post.category}
          compact
        />
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-3 text-[12px] font-semibold text-[#667085]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-[#005ca8]" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#005ca8]" />
              {post.readTime}
            </span>
          </div>
          <h2 className="mt-4 text-[22px] font-black leading-tight text-[#111827] transition group-hover:text-[#005ca8]">
            {post.title}
          </h2>
          <p className="mt-3 text-[14px] font-medium leading-7 text-[#667085]">
            {post.excerpt}
          </p>
          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#e8f4ff] px-3 py-1 text-[11px] font-black text-[#005ca8]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#13a653] text-white">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
