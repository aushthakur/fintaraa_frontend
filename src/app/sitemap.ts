import type { MetadataRoute } from "next";
import { slugifyProduct } from "@/lib/productRouting";
import { buildApiUrl } from "@/services/apiUrl";
import { coreSitemapRoutes, siteUrl } from "@/services/seoConfig";
import { blogPosts } from "@/data/blogs";

type SitemapFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

type SitemapItem = {
  path: string;
  priority?: number;
  changeFrequency?: SitemapFrequency;
  lastModified?: string | Date;
};

const now = new Date();

const toEntry = ({
  path,
  priority = 0.5,
  changeFrequency = "weekly",
  lastModified,
}: SitemapItem): MetadataRoute.Sitemap[number] => ({
  url: `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`,
  lastModified: lastModified ? new Date(lastModified) : now,
  changeFrequency,
  priority,
});

const fetchJson = async (path: string) => {
  const url = buildApiUrl(path);
  if (!url) return null;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
};

const unwrapList = (payload: any): any[] => {
  const data = payload?.data || payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

const uniqueByPath = (items: SitemapItem[]) => {
  const map = new Map<string, SitemapItem>();
  items.forEach((item) => {
    if (!item.path) return;
    const normalized =
      item.path.length > 1 ? item.path.replace(/\/+$/, "") : item.path;
    map.set(normalized, { ...item, path: normalized });
  });
  return Array.from(map.values());
};

const fetchProductPages = async (
  endpoint: "loan-pages" | "insurance-pages",
  slugKey: "loanTypeSlug" | "insuranceTypeSlug",
) => {
  const payload = await fetchJson(`/${endpoint}/public?limit=250`);
  return unwrapList(payload)
    .map((item) => ({
      path:
        item?.canonicalPath ||
        (item?.[slugKey] ? `/products/${slugifyProduct(item[slugKey])}` : ""),
      priority: endpoint === "loan-pages" ? 0.78 : 0.74,
      changeFrequency: "weekly" as SitemapFrequency,
      lastModified: item?.updatedAt || item?.createdAt,
    }))
    .filter((item) => item.path);
};

const fetchBlogPages = async () => {
  const payload = await fetchJson(
    "/knowledge?type=blog&limit=250&pagination=false",
  );
  const dynamicBlogs = unwrapList(payload).map((item) => ({
    path: item?.slug ? `/blog/${slugifyProduct(item.slug)}` : "",
    priority: 0.64,
    changeFrequency: "weekly" as SitemapFrequency,
    lastModified: item?.publishedAt || item?.updatedAt || item?.createdAt,
  }));

  const fallbackBlogs = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.62,
    changeFrequency: "monthly" as SitemapFrequency,
    lastModified: post.publishedAt,
  }));

  return [...dynamicBlogs, ...fallbackBlogs].filter((item) => item.path);
};

const fetchKnowledgePages = async (
  type: "press_release" | "video" | "testimonial",
  rootPath: "/press-release" | "/video-testimonials" | "/testimonials",
  priority: number,
) => {
  const payload = await fetchJson(
    `/knowledge?type=${type}&limit=250&pagination=false`,
  );
  return unwrapList(payload)
    .map((item) => ({
      path: item?.slug ? `${rootPath}/${slugifyProduct(item.slug)}` : "",
      priority,
      changeFrequency: "weekly" as SitemapFrequency,
      lastModified: item?.publishedAt || item?.updatedAt || item?.createdAt,
    }))
    .filter((item) => item.path);
};

const fetchBankPages = async () => {
  const payload = await fetchJson(
    "/bank-products/public?type=credit_card&pagination=false",
  );
  const banks = new Set<string>();
  unwrapList(payload).forEach((item) => {
    if (item?.bankName) banks.add(slugifyProduct(item.bankName));
  });

  return Array.from(banks).map((bankSlug) => ({
    path: `/banks/${bankSlug}/credit-card`,
    priority: 0.7,
    changeFrequency: "weekly" as SitemapFrequency,
  }));
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    loanPages,
    insurancePages,
    blogPages,
    pressPages,
    videoPages,
    testimonialPages,
    bankPages,
  ] = await Promise.all([
    fetchProductPages("loan-pages", "loanTypeSlug"),
    fetchProductPages("insurance-pages", "insuranceTypeSlug"),
    fetchBlogPages(),
    fetchKnowledgePages("press_release", "/press-release", 0.62),
    fetchKnowledgePages("video", "/video-testimonials", 0.6),
    fetchKnowledgePages("testimonial", "/testimonials", 0.58),
    fetchBankPages(),
  ]);

  const staticPages = coreSitemapRoutes.map((route) => ({
    path: route.path,
    priority: route.priority,
    changeFrequency: route.changeFrequency as SitemapFrequency,
  }));

  return uniqueByPath([
    ...staticPages,
    ...loanPages,
    ...insurancePages,
    ...blogPages,
    ...pressPages,
    ...videoPages,
    ...testimonialPages,
    ...bankPages,
  ]).map(toEntry);
}
