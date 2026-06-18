"use client";

import { type BlogPost } from "@/data/blogs";
import { BlogHeroSection } from "@/components/blog/BlogHeroSection";
import { BlogCardSection } from "@/components/blog/BlogCardSection";
import { FeaturedArticleSection } from "./BlogFeatures";
import { NewsletterSubscription } from "./NewsletterSubscription";
import { WhyChooseFintaraa } from "./WhyChooseFintaraa";
import { FaqAccordion } from "../common/FaqAccordion";

export function BlogIndexPage({ posts }: { posts: BlogPost[] }) {
  return (
    <main className="bg-white">
      <BlogHeroSection />
      <FeaturedArticleSection />
      <BlogCardSection posts={posts} />
      <NewsletterSubscription />
      <WhyChooseFintaraa />
      <FaqAccordion />
    </main>
  );
}
