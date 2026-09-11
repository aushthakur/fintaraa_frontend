import type { MetadataRoute } from "next";
import { defaultSeoDescription, siteName } from "@/services/seoConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} Financial Services`,
    short_name: siteName,
    description: defaultSeoDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4c1d95",
    categories: ["finance", "business", "productivity"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
