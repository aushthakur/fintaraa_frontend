"use client";

import { useEffect, useState } from "react";
import { blogPosts, type BlogPost } from "@/data/blogs";
import { BlogHeroSection } from "@/components/blog/BlogHeroSection";
import { BlogCardSection } from "@/components/blog/BlogCardSection";
import { FeaturedArticleSection } from "./BlogFeatures";
import { NewsletterSubscription } from "./NewsletterSubscription";
import { WhyChooseFintaraa } from "./WhyChooseFintaraa";
import { FaqAccordion } from "../common/FaqAccordion";
import {
  fetchWebsiteKnowledge,
  toBlogPost,
} from "@/services/websiteKnowledge";

function BlogPageSkeleton() {
  return (
    <section className="px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto grid max-w-9xl gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    </section>
  );
}

export function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="bg-white">
      <BlogHeroSection />
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
                    thumbnail: (featured as any).coverImageUrl || "/assets/images/blog-feature.png",
                    readTime: featured.readTime,
                    publishedAt: featured.publishedAt,
                    author: typeof featured.author === "string"
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
          <BlogCardSection posts={posts} />
        </>
      )}
      <NewsletterSubscription />
      <WhyChooseFintaraa />
      <FaqAccordion />
    </main>
  );
}
