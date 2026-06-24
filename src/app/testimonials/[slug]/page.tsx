import type { Metadata } from "next";
import { KnowledgeDetailClient } from "@/components/knowledge/KnowledgeDetailClient";
import { clientTestimonialsConfig } from "@/components/knowledge/knowledgePageConfig";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { siteName } from "@/services/seoConfig";
import { fetchKnowledgeBySlug, stripHtml } from "@/services/websiteKnowledge";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await fetchKnowledgeBySlug(slug);
  const description = item?.summary || item?.excerpt || stripHtml(item?.content || "");

  return getPageSeoMetadata(`/testimonials/${slug}`, {
    title: item?.title ? `${item.title} | Fintaraa Client Story` : "Client Story | Fintaraa",
    description:
      description ||
      "Read Fintaraa client testimonials and assisted financial journey stories.",
    keywords: item?.tags,
    alternates: { canonical: `/testimonials/${slug}` },
    openGraph: {
      title: item?.title || "Fintaraa Client Story",
      description,
      url: `/testimonials/${slug}`,
      type: "article",
      ...(item?.coverImageUrl || item?.authorAvatarUrl
        ? { images: [item.coverImageUrl || item.authorAvatarUrl || ""] }
        : {}),
    },
  });
}

export default async function TestimonialDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await fetchKnowledgeBySlug(slug);
  const description = item?.summary || item?.excerpt || stripHtml(item?.content || "");
  const reviewSchema =
    item && item.type === "testimonial"
      ? {
          "@context": "https://schema.org",
          "@type": "Review",
          itemReviewed: {
            "@type": "Organization",
            name: siteName,
          },
          author: {
            "@type": "Person",
            name: item.authorName || item.title,
          },
          reviewBody: description,
          reviewRating: {
            "@type": "Rating",
            ratingValue: item.rating || 5,
            bestRating: 5,
          },
        }
      : null;

  return (
    <>
      {reviewSchema ? <JsonLd id="testimonial-review-schema" data={reviewSchema} /> : null}
      <KnowledgeDetailClient slug={slug} config={clientTestimonialsConfig} />
    </>
  );
}
