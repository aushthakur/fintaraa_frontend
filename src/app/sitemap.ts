import type { MetadataRoute } from "next";
import {
  getSitemapItems,
  toMetadataSitemap,
} from "@/services/sitemapEntries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return toMetadataSitemap(await getSitemapItems());
}
