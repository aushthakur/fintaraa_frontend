import type { Metadata } from "next";
import { buildApiUrl } from "@/services/apiUrl";

type SeoMetadataRecord = {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
};

const normalizePathname = (pathname: string) => {
  const clean = (pathname || "/").split("?")[0] || "/";
  const withSlash = clean.startsWith("/") ? clean : `/${clean}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : withSlash;
};

const firstTitle = (title: Metadata["title"]) => {
  if (!title) return undefined;
  if (typeof title === "string") return title;
  if ("absolute" in title && title.absolute) return String(title.absolute);
  if ("default" in title && title.default) return String(title.default);
  return undefined;
};

export async function getPageSeoMetadata(
  pathname: string,
  fallback: Metadata = {},
): Promise<Metadata> {
  const normalizedPathname = normalizePathname(pathname);
  const fallbackTitle = firstTitle(fallback.title);
  const fallbackDescription = fallback.description || "";

  const url = buildApiUrl(
    `/seo-metadata/resolve?pathname=${encodeURIComponent(normalizedPathname)}`,
  );

  if (!url) {
    return {
      ...fallback,
      alternates: { ...fallback.alternates, canonical: normalizedPathname },
    };
  }

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });

    if (!response.ok) {
      return {
        ...fallback,
        alternates: { ...fallback.alternates, canonical: normalizedPathname },
      };
    }

    const payload = await response.json();
    const seo = (payload?.data || {}) as SeoMetadataRecord;
    const title = seo.title || fallbackTitle;
    const description = seo.description || fallbackDescription;
    const canonical = seo.canonicalPath || normalizedPathname;

    return {
      ...fallback,
      title,
      description,
      keywords: seo.keywords?.length ? seo.keywords : fallback.keywords,
      alternates: {
        ...fallback.alternates,
        canonical,
      },
      robots:
        seo.robotsIndex === false || seo.robotsFollow === false
          ? {
              index: seo.robotsIndex !== false,
              follow: seo.robotsFollow !== false,
            }
          : fallback.robots,
      openGraph: {
        ...(typeof fallback.openGraph === "object" ? fallback.openGraph : {}),
        title: seo.openGraphTitle || title,
        description: seo.openGraphDescription || description,
        url: canonical,
        type: "website",
        ...(seo.openGraphImage ? { images: [seo.openGraphImage] } : {}),
      },
      twitter: {
        ...(typeof fallback.twitter === "object" ? fallback.twitter : {}),
        title: seo.twitterTitle || seo.openGraphTitle || title,
        description:
          seo.twitterDescription || seo.openGraphDescription || description,
        ...(seo.twitterImage || seo.openGraphImage
          ? { images: [seo.twitterImage || seo.openGraphImage || ""] }
          : {}),
      },
    };
  } catch {
    return {
      ...fallback,
      alternates: { ...fallback.alternates, canonical: normalizedPathname },
    };
  }
}
