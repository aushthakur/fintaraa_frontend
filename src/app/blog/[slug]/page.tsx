import type { Metadata } from "next";
import { BlogDetailClient } from "@/components/blog/BlogDetailClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { fetchKnowledgeBySlug, stripHtml } from "@/services/websiteKnowledge";
import { absoluteUrl, siteName } from "@/services/seoConfig";

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
  const post = await fetchKnowledgeBySlug(slug);
  const description =
    post?.excerpt || post?.summary || stripHtml(post?.content || "");
  const articleSchema = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description,
        image: post.coverImageUrl ? [absoluteUrl(post.coverImageUrl)] : [],
        datePublished: post.publishedAt || post.createdAt,
        dateModified: post.publishedAt || post.createdAt,
        author: {
          "@type": "Person",
          name: post.authorName || "Fintaraa Editorial",
        },
        publisher: {
          "@type": "Organization",
          name: siteName,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/assets/logo/logo.png"),
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": absoluteUrl(`/blog/${slug}`),
        },
      }
    : null;

  return (
    <>
      {articleSchema ? <JsonLd id="blog-article-schema" data={articleSchema} /> : null}
      <BlogDetailClient slug={slug} />
    </>
  );
}
