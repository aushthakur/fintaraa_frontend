import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { absoluteUrl, siteName } from "@/services/seoConfig";
import { fetchKnowledgeBySlug, stripHtml } from "@/services/websiteKnowledge";
import { pressReleaseConfig } from "@/components/knowledge/knowledgePageConfig";
import { KnowledgeDetailClient } from "@/components/knowledge/KnowledgeDetailClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await fetchKnowledgeBySlug(slug);
  const description =
    item?.summary || item?.excerpt || stripHtml(item?.content || "");

  return getPageSeoMetadata(`/press-release/${slug}`, {
    title: item?.title
      ? `${item.title} | Fintaraa Press Release`
      : "Press Release | Fintaraa",
    description:
      description ||
      "Read Fintaraa press releases, media updates, and company announcements.",
    keywords: item?.tags,
    alternates: { canonical: `/press-release/${slug}` },
    openGraph: {
      title: item?.title || "Fintaraa Press Release",
      description,
      url: `/press-release/${slug}`,
      type: "article",
      ...(item?.coverImageUrl ? { images: [item.coverImageUrl] } : {}),
    },
  });
}

export default async function PressReleaseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await fetchKnowledgeBySlug(slug);
  const description =
    item?.summary || item?.excerpt || stripHtml(item?.content || "");
  const articleSchema =
    item && item.type === "press_release"
      ? {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: item.title,
          description,
          image: item.coverImageUrl ? [absoluteUrl(item.coverImageUrl)] : [],
          datePublished: item.publishedAt || item.createdAt,
          dateModified: item.publishedAt || item.createdAt,
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
            "@id": absoluteUrl(`/press-release/${slug}`),
          },
        }
      : null;

  return (
    <>
      {articleSchema ? (
        <JsonLd id="press-release-schema" data={articleSchema} />
      ) : null}
      <KnowledgeDetailClient slug={slug} config={pressReleaseConfig} />
    </>
  );
}
