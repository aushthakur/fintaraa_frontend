import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { BlogIndexPage } from "@/components/blog/BlogIndexPage";

const fallbackMetadata: Metadata = {
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

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/blog", fallbackMetadata);
}

export default function BlogPage() {
  return <BlogIndexPage />;
}
