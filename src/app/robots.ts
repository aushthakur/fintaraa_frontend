import type { MetadataRoute } from "next";
import { siteUrl } from "@/services/seoConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account/",
          "/apply/",
          "/login",
          "/cibil-score/report",
          "/application-status",
          "/refer-and-earn",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
