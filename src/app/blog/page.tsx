import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/blog/BlogIndexPage";
import { blogPosts } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Financial Insights and Blogs",
  description:
    "Read Fintaraa blogs on loans, credit score, credit cards, insurance, eligibility, documents, EMIs, and responsible financial planning.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Financial Insights and Blogs | Fintaraa",
    description:
      "Premium guides on loans, credit score, cards, insurance, documents, and repayment planning.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogIndexPage posts={blogPosts} />;
}
