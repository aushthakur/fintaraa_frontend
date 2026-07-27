"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaqAccordion } from "../common/FaqAccordion";
import { FeaturedArticleSection } from "./BlogFeatures";
import { WhyChoose } from "@/components/home/WhyChoose";
import { blogPosts, type BlogPost } from "@/data/blogs";
import { NewsletterSubscription } from "./NewsletterSubscription";
import { BlogCardSection } from "@/components/blog/BlogCardSection";
import { fetchWebsiteKnowledge, toBlogPost } from "@/services/websiteKnowledge";

function BlogPageSkeleton() {
  return (
    <section className="px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto grid max-w-9xl gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    </section>
  );
}

export function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const syncFiltersFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveCategory(params.get("category") || "All Articles");
      setSearchQuery(params.get("q") || "");
    };

    syncFiltersFromUrl();
    window.addEventListener("popstate", syncFiltersFromUrl);
    return () => window.removeEventListener("popstate", syncFiltersFromUrl);
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchWebsiteKnowledge({
      type: "blog",
      sectionKey: "recent_blogs",
      limit: 50,
    })
      .then((items) => {
        if (mounted) setPosts(items.length ? items.map(toBlogPost) : blogPosts);
      })
      .catch(() => mounted && setPosts(blogPosts))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const featured = posts[0];
  const categories = useMemo(
    () => [
      "All Articles",
      ...Array.from(
        new Set(posts.map((post) => post.category || "Financial Planning")),
      ),
    ],
    [posts],
  );
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "All Articles" || post.category === activeCategory;
      if (!matchesCategory) return false;
      if (!query) return true;

      const authorName =
        typeof post.author === "string" ? post.author : post.author.name;
      return [
        post.title,
        post.excerpt,
        post.category,
        authorName,
        ...(post.tags || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [activeCategory, posts, searchQuery]);

  const updateFilterUrl = (category: string, query: string) => {
    const params = new URLSearchParams();
    if (category !== "All Articles") params.set("category", category);
    if (query.trim()) params.set("q", query.trim());
    const nextQuery = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`,
    );
  };

  const selectCategory = (category: string) => {
    setActiveCategory(category);
    updateFilterUrl(category, searchQuery);
  };

  const updateSearch = (query: string) => {
    setSearchQuery(query);
    updateFilterUrl(activeCategory, query);
  };

  return (
    <main className="bg-white">
      {/* <BlogHeroSection /> */}
      {loading ? (
        <BlogPageSkeleton />
      ) : (
        <>
          <FeaturedArticleSection
            article={
              featured
                ? {
                    title: featured.title,
                    description: featured.excerpt,
                    category: featured.category,
                    thumbnail:
                      (featured as any).coverImageUrl ||
                      "/assets/images/blog-feature.png",
                    readTime: featured.readTime,
                    publishedAt: featured.publishedAt,
                    author:
                      typeof featured.author === "string"
                        ? {
                            name: featured.author,
                            role: "Financial Analyst",
                            avatar: "/assets/images/user1.png",
                          }
                        : featured.author,
                    slug: featured.slug,
                  }
                : undefined
            }
          />
          <section className="bg-[linear-gradient(90deg,#f7fbff_0%,#eef8ff_50%,#f7fbff_100%)] px-4 py-7 font-sans sm:px-6 md:px-8 lg:px-16">
            <div className="mx-auto max-w-9xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="mt-2 text-[22px] font-extrabold tracking-[-0.02em] text-[#111625]">
                    Browse by category
                  </h2>
                  <p className="mt-1 text-[12px] font-medium text-[#6d8092]">
                    Pick a topic or search across all financial guides.
                  </p>
                </div>
                <label className="relative block w-full md:max-w-xs">
                  <span className="sr-only">Search blog articles</span>
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718397]"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => updateSearch(event.target.value)}
                    placeholder="Search articles"
                    className="h-11 w-full rounded-full bg-white pl-10 pr-10 text-[13px] font-semibold text-[#17354d] outline-none transition placeholder:text-[#98a6b3] focus:bg-[#e8f3ff]"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => updateSearch("")}
                      aria-label="Clear article search"
                      className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#718397] hover:bg-[#eef6ff] hover:text-[#075cde]"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : null}
                </label>
              </div>

              <div
                role="group"
                aria-label="Filter articles by category"
                className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden"
              >
                {categories.map((category) => {
                  const selected = category === activeCategory;
                  return (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => selectCategory(category)}
                      className={`h-10 shrink-0 rounded-full px-4 text-[12px] font-extrabold transition ${
                        selected
                          ? "bg-[#075cde] text-white"
                          : "bg-white/85 text-[#526b80] hover:bg-[#dceeff] hover:text-[#075cde]"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
          <BlogCardSection
            posts={filteredPosts}
            emptyMessage="No articles match this category or search yet."
            showViewAll={
              activeCategory === "All Articles" && !searchQuery.trim()
            }
          />
        </>
      )}
      <NewsletterSubscription />
      <WhyChoose />
      <FaqAccordion />
    </main>
  );
}
