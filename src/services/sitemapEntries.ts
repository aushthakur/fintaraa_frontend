import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";
import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blogs";
import { humanizeSlug, slugifyProduct } from "@/lib/productRouting";
import { buildApiUrl } from "@/services/apiUrl";
import { coreSitemapRoutes, siteUrl } from "@/services/seoConfig";

export type SitemapFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

export type SitemapItem = {
  path: string;
  title?: string;
  priority?: number;
  changeFrequency?: SitemapFrequency;
  lastModified?: string | Date;
};

const privateOrDuplicateRoutes = new Set([
  "/account/profile",
  "/blog/all",
  "/cibil-score/report",
  "/credit-card",
  "/eligibility-results",
  "/login",
  "/partner",
  "/partner-login",
  "/partner/login",
  "/partners/all",
  "/press",
  "/sitemap",
  "/videos",
]);

const privateRoutePrefixes = ["/account/", "/apply/", "/partner/profile/"];

const routeTitle = (routePath: string) => {
  if (routePath === "/") return "Home";
  return routePath
    .split("/")
    .filter(Boolean)
    .map((segment) => humanizeSlug(segment))
    .join(" – ");
};

const shouldIncludeStaticRoute = (routePath: string) =>
  !privateOrDuplicateRoutes.has(routePath) &&
  !privateRoutePrefixes.some((prefix) => routePath.startsWith(prefix));

const discoverStaticRoutes = async (): Promise<SitemapItem[]> => {
  const appDirectory = path.join(process.cwd(), "src", "app");
  const pageFiles: string[] = [];

  const walk = async (directory: string) => {
    const entries = await readdir(directory, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        const absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          await walk(absolute);
          return;
        }
        if (/^page\.(tsx|ts|jsx|js)$/.test(entry.name)) {
          pageFiles.push(absolute);
        }
      }),
    );
  };

  try {
    await walk(appDirectory);
  } catch {
    return [];
  }

  return pageFiles
    .map((file) => {
      const directory = path.relative(appDirectory, path.dirname(file));
      if (!directory || directory === ".") return "/";
      if (directory.includes("[") || directory.includes("]")) return "";
      return `/${directory.split(path.sep).join("/")}`;
    })
    .filter(
      (routePath): routePath is string =>
        Boolean(routePath) && shouldIncludeStaticRoute(routePath),
    )
    .map((routePath) => ({
      path: routePath,
      title: routeTitle(routePath),
      priority: routePath === "/" ? 1 : 0.55,
      changeFrequency: "weekly" as SitemapFrequency,
    }));
};

const fetchJson = async (apiPath: string) => {
  const url = buildApiUrl(apiPath);
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

const itemIdentity = (item: any) =>
  String(
    item?._id ||
      item?.canonicalPath ||
      item?.slug ||
      `${item?.bankSlug || item?.bankName}-${item?.productSlug || ""}`,
  );

const fetchPagedList = async (
  endpoint: string,
  batchSize = 1000,
  maxPages = 100,
) => {
  const items: any[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= maxPages; page += 1) {
    const separator = endpoint.includes("?") ? "&" : "?";
    const payload = await fetchJson(
      `${endpoint}${separator}limit=${batchSize}&page=${page}`,
    );
    const batch = unwrapList(payload);
    if (!batch.length) break;

    let added = 0;
    batch.forEach((item) => {
      const identity = itemIdentity(item);
      if (!identity || seen.has(identity)) return;
      seen.add(identity);
      items.push(item);
      added += 1;
    });

    if (!added || batch.length < batchSize) break;
  }

  return items;
};

const fetchCursorList = async (
  endpoint: string,
  batchSize = 500,
  maxPages = 200,
) => {
  const items: any[] = [];
  const seen = new Set<string>();
  let cursor = "";

  for (let page = 0; page < maxPages; page += 1) {
    const params = new URLSearchParams({
      pagination: "cursor",
      limit: String(batchSize),
    });
    if (cursor) params.set("cursor", cursor);
    const separator = endpoint.includes("?") ? "&" : "?";
    const payload = await fetchJson(`${endpoint}${separator}${params}`);
    const batch = unwrapList(payload);
    if (!batch.length) break;

    let added = 0;
    batch.forEach((item) => {
      const identity = itemIdentity(item);
      if (!identity || seen.has(identity)) return;
      seen.add(identity);
      items.push(item);
      added += 1;
    });

    const nextCursor = String(batch.at(-1)?._id || "");
    if (
      !added ||
      !nextCursor ||
      nextCursor === cursor ||
      batch.length < batchSize
    ) {
      break;
    }
    cursor = nextCursor;
  }

  return items;
};

const uniqueByPath = (items: SitemapItem[]) => {
  const map = new Map<string, SitemapItem>();
  items.forEach((item) => {
    if (!item.path) return;
    const normalized =
      item.path.length > 1 ? item.path.replace(/\/+$/, "") : item.path;
    const existing = map.get(normalized);
    map.set(normalized, {
      ...existing,
      ...item,
      path: normalized,
      title: item.title || existing?.title || routeTitle(normalized),
    });
  });
  return Array.from(map.values()).sort((a, b) =>
    a.path.localeCompare(b.path),
  );
};

const fetchProductPages = async (
  endpoint: "loan-pages" | "insurance-pages",
  slugKey: "loanTypeSlug" | "insuranceTypeSlug",
) => {
  const rows = await fetchPagedList(`/${endpoint}/public`);
  return rows
    .map((item) => {
      const slug = slugifyProduct(String(item?.[slugKey] || ""));
      if (slug === "credit-score-loan") return null;
      const canonicalPath =
        item?.canonicalPath || (slug ? `/products/${slug}` : "");
      if (!canonicalPath) return null;
      return {
        path: canonicalPath,
        title: item?.title || routeTitle(canonicalPath),
        priority: endpoint === "loan-pages" ? 0.78 : 0.74,
        changeFrequency: "weekly" as SitemapFrequency,
        lastModified: item?.updatedAt || item?.createdAt,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
};

const fetchBlogPages = async () => {
  const payload = await fetchJson(
    "/knowledge?type=blog&limit=1000&pagination=false",
  );
  const dynamicBlogs = unwrapList(payload).map((item) => ({
    path: item?.slug ? `/blog/${slugifyProduct(item.slug)}` : "",
    title: item?.title,
    priority: 0.64,
    changeFrequency: "weekly" as SitemapFrequency,
    lastModified: item?.publishedAt || item?.updatedAt || item?.createdAt,
  }));
  const fallbackBlogs = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    title: post.title,
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
    `/knowledge?type=${type}&limit=1000&pagination=false`,
  );
  return unwrapList(payload)
    .map((item) => ({
      path: item?.slug ? `${rootPath}/${slugifyProduct(item.slug)}` : "",
      title: item?.title,
      priority,
      changeFrequency: "weekly" as SitemapFrequency,
      lastModified: item?.publishedAt || item?.updatedAt || item?.createdAt,
    }))
    .filter((item) => item.path);
};

const fetchBankPages = async () => {
  const [seoRows, cardPayload] = await Promise.all([
    fetchCursorList("/bank-pages/public"),
    fetchJson("/bank-products/public?type=credit_card&pagination=false"),
  ]);
  const items: SitemapItem[] = [];
  const bankNames = new Map<string, string>();

  seoRows.forEach((item) => {
    const bankSlug = slugifyProduct(item?.bankSlug || item?.bankName || "");
    const productSlug = slugifyProduct(item?.productSlug || "");
    if (productSlug === "credit-score-loan") return;
    const canonicalPath =
      item?.canonicalPath ||
      (bankSlug && productSlug
        ? `/banks/${bankSlug}/${productSlug}`
        : "");
    if (!canonicalPath) return;
    if (bankSlug) bankNames.set(bankSlug, item?.bankName || humanizeSlug(bankSlug));
    items.push({
      path: canonicalPath,
      title: item?.title || routeTitle(canonicalPath),
      priority: 0.7,
      changeFrequency: "weekly",
      lastModified: item?.updatedAt,
    });
  });

  unwrapList(cardPayload).forEach((item) => {
    const bankSlug = slugifyProduct(item?.bankSlug || item?.bankName || "");
    if (!bankSlug) return;
    bankNames.set(bankSlug, item?.bankName || humanizeSlug(bankSlug));
    items.push({
      path: `/banks/${bankSlug}/credit-card`,
      title: `${item?.bankName || humanizeSlug(bankSlug)} Credit Cards`,
      priority: 0.7,
      changeFrequency: "weekly",
      lastModified: item?.updatedAt,
    });
  });

  bankNames.forEach((bankName, bankSlug) => {
    items.push({
      path: `/banks/${bankSlug}`,
      title: `${bankName} Products`,
      priority: 0.72,
      changeFrequency: "weekly",
    });
  });

  return items;
};

export const getSitemapItems = async (): Promise<SitemapItem[]> => {
  const [
    discoveredStaticPages,
    loanPages,
    insurancePages,
    blogPages,
    pressPages,
    videoPages,
    testimonialPages,
    bankPages,
  ] = await Promise.all([
    discoverStaticRoutes(),
    fetchProductPages("loan-pages", "loanTypeSlug"),
    fetchProductPages("insurance-pages", "insuranceTypeSlug"),
    fetchBlogPages(),
    fetchKnowledgePages("press_release", "/press-release", 0.62),
    fetchKnowledgePages("video", "/video-testimonials", 0.6),
    fetchKnowledgePages("testimonial", "/testimonials", 0.58),
    fetchBankPages(),
  ]);

  const configuredStaticPages: SitemapItem[] = coreSitemapRoutes.map(
    (route) => ({
      path: route.path,
      title: routeTitle(route.path),
      priority: route.priority,
      changeFrequency: route.changeFrequency as SitemapFrequency,
    }),
  );

  return uniqueByPath([
    ...discoveredStaticPages,
    ...configuredStaticPages,
    ...loanPages,
    ...insurancePages,
    ...blogPages,
    ...pressPages,
    ...videoPages,
    ...testimonialPages,
    ...bankPages,
  ]);
};

export const toMetadataSitemap = (
  items: SitemapItem[],
): MetadataRoute.Sitemap =>
  items.map(
    ({
      path: itemPath,
      priority = 0.5,
      changeFrequency = "weekly",
      lastModified,
    }) => ({
      url: `${siteUrl}${itemPath.startsWith("/") ? itemPath : `/${itemPath}`}`,
      lastModified: lastModified ? new Date(lastModified) : new Date(),
      changeFrequency,
      priority,
    }),
  );

export const getSitemapGroup = (itemPath: string) => {
  if (itemPath === "/" || itemPath === "/products" || itemPath === "/banks") {
    return "Main pages";
  }
  if (itemPath.startsWith("/products/")) return "Loans & insurance";
  if (itemPath.startsWith("/banks/")) return "Banks & lending partners";
  if (
    itemPath.startsWith("/blog") ||
    itemPath.startsWith("/press-release") ||
    itemPath.startsWith("/testimonials") ||
    itemPath.startsWith("/video-testimonials") ||
    itemPath === "/knowledge-hub"
  ) {
    return "Knowledge & stories";
  }
  if (
    [
      "/annual-compliance",
      "/cibil-score",
      "/company-registration",
      "/gst-registration",
      "/itr-filing",
      "/msme-registration",
      "/project-report",
      "/roc-filing",
      "/tax-compliance",
      "/tools",
    ].some((prefix) => itemPath.startsWith(prefix))
  ) {
    return "Services & tools";
  }
  return "Company, support & legal";
};
