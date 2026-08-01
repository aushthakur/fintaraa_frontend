"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

type AnalyticsRouteTrackerProps = {
  clarityProjectId?: string;
  gaMeasurementId?: string;
  gtmId?: string;
  metaPixelId?: string;
};

export function AnalyticsRouteTracker({
  clarityProjectId,
  gaMeasurementId,
  gtmId,
  metaPixelId,
}: AnalyticsRouteTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialPageViewHandledByProviderScripts = useRef(true);

  useEffect(() => {
    if (initialPageViewHandledByProviderScripts.current) {
      initialPageViewHandledByProviderScripts.current = false;
      return;
    }

    const query = searchParams.toString();
    const pagePath = `${pathname}${query ? `?${query}` : ""}`;
    const pageLocation = window.location.href;
    const pageTitle = document.title;

    if (gtmId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "virtual_page_view",
        page_location: pageLocation,
        page_path: pagePath,
        page_title: pageTitle,
      });
    }

    if (gaMeasurementId) {
      window.gtag?.("event", "page_view", {
        page_location: pageLocation,
        page_path: pagePath,
        page_title: pageTitle,
      });
    }

    if (metaPixelId) {
      window.fbq?.("track", "PageView");
    }

    if (clarityProjectId) {
      window.clarity?.("set", "page_path", pagePath);
    }
  }, [
    clarityProjectId,
    gaMeasurementId,
    gtmId,
    metaPixelId,
    pathname,
    searchParams,
  ]);

  return null;
}
