"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { buildApiUrl } from "@/services/apiUrl";

type SeoSchemaRecord = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  openGraphImage?: string;
  schemaEnabled?: boolean;
};

export function PageSeoSchema() {
  const pathname = usePathname();
  const [seo, setSeo] = useState<SeoSchemaRecord | null>(null);

  useEffect(() => {
    let active = true;
    const url = buildApiUrl(
      `/seo-metadata/resolve?pathname=${encodeURIComponent(pathname || "/")}`,
    );
    if (!url) return;

    fetch(url, { cache: "no-store" })
      .then(async (response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (active) setSeo(payload?.data || null);
      })
      .catch(() => {
        if (active) setSeo(null);
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  if (!seo?.schemaEnabled) return null;

  const canonicalPath = seo.canonicalPath || pathname || "/";
  const canonicalUrl =
    typeof window === "undefined"
      ? canonicalPath
      : new URL(canonicalPath, window.location.origin).toString();
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    url: canonicalUrl,
    ...(seo.openGraphImage
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: seo.openGraphImage,
          },
        }
      : {}),
  };

  return (
    <script
      id="fintaraa-page-seo-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
