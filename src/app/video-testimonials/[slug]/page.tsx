import type { Metadata } from "next";
import { KnowledgeDetailClient } from "@/components/knowledge/KnowledgeDetailClient";
import { videoTestimonialsConfig } from "@/components/knowledge/knowledgePageConfig";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { absoluteUrl, siteName } from "@/services/seoConfig";
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

  return getPageSeoMetadata(`/video-testimonials/${slug}`, {
    title: item?.title ? `${item.title} | Fintaraa Video Testimonial` : "Video Testimonial | Fintaraa",
    description:
      description ||
      "Watch Fintaraa customer video testimonials and assisted financial journey stories.",
    keywords: item?.tags,
    alternates: { canonical: `/video-testimonials/${slug}` },
    openGraph: {
      title: item?.title || "Fintaraa Video Testimonial",
      description,
      url: `/video-testimonials/${slug}`,
      type: "video.other",
      ...(item?.coverImageUrl ? { images: [item.coverImageUrl] } : {}),
    },
  });
}

export default async function VideoTestimonialDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await fetchKnowledgeBySlug(slug);
  const description = item?.summary || item?.excerpt || stripHtml(item?.content || "");
  const videoSchema =
    item && item.type === "video"
      ? {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: item.title,
          description,
          thumbnailUrl: item.coverImageUrl ? [absoluteUrl(item.coverImageUrl)] : [],
          uploadDate: item.publishedAt || item.createdAt,
          contentUrl: item.videoUrl,
          publisher: {
            "@type": "Organization",
            name: siteName,
            logo: {
              "@type": "ImageObject",
              url: absoluteUrl("/assets/logo/logo.png"),
            },
          },
        }
      : null;

  return (
    <>
      {videoSchema ? <JsonLd id="video-testimonial-schema" data={videoSchema} /> : null}
      <KnowledgeDetailClient slug={slug} config={videoTestimonialsConfig} />
    </>
  );
}
