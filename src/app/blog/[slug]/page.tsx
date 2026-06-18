import type { Metadata } from "next";
import { BlogDetailClient } from "@/components/blog/BlogDetailClient";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { fetchKnowledgeBySlug, stripHtml } from "@/services/websiteKnowledge";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchKnowledgeBySlug(slug);
  const description =
    post?.excerpt || post?.summary || stripHtml(post?.content || "");

  return getPageSeoMetadata(`/blog/${slug}`, {
    title: post?.title ? `${post.title} | Fintaraa Blog` : "Blog | Fintaraa",
    description:
      description ||
      "Read Fintaraa guides on loans, credit cards, insurance, credit score, and financial services.",
    keywords: post?.tags,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post?.title || "Fintaraa Blog",
      description,
      url: `/blog/${slug}`,
      type: "article",
      ...(post?.coverImageUrl ? { images: [post.coverImageUrl] } : {}),
    },
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
