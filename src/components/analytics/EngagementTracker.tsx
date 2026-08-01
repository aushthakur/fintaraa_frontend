"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  captureWebsiteAttribution,
  websiteQueryParams,
  type AttributionQueryParams,
  type WebsiteAttribution,
} from "@/services/attribution";
import { getAuthToken } from "@/hooks/authStorage";

type EventType =
  | "page_view"
  | "click"
  | "popup_impression"
  | "banner_impression";
type Category =
  | "page"
  | "cta"
  | "banner"
  | "popup"
  | "phone"
  | "whatsapp"
  | "footer"
  | "navigation"
  | "other";

type EngagementPayload = {
  eventType: EventType;
  category: Category;
  pageUrl: string;
  pagePath: string;
  elementName?: string;
  elementId?: string;
  placement?: string;
  targetUrl?: string;
  deviceType: "mobile" | "desktop" | "tablet";
  sessionId: string;
  visitorId: string;
  source: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  referrer?: string;
  heatmapProvider?: string;
  queryParams?: AttributionQueryParams;
  landingPage?: string;
  gclid?: string;
  fbclid?: string;
  dsaReferralCode?: string;
};

const SESSION_KEY = "fintaraa_engagement_session";
const VISITOR_KEY = "fintaraa_engagement_visitor";
const eligibleCta =
  /\b(apply|apply now|check eligibility|eligible|calculate emi|get quote|compare plans|connect|contact|call|whatsapp|chat|enquire|get started|submit)\b/i;

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const storageId = (storage: Storage, key: string) => {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const next = createId();
  storage.setItem(key, next);
  return next;
};

const deviceType = (): "mobile" | "desktop" | "tablet" => {
  if (window.innerWidth <= 767) return "mobile";
  if (window.innerWidth <= 1024) return "tablet";
  return "desktop";
};

const nameFor = (element: HTMLElement) =>
  String(
    element.dataset.analyticsName ||
      element.getAttribute("aria-label") ||
      element.getAttribute("title") ||
      element.textContent ||
      element.id ||
      "Unlabelled element",
  )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

const providerEvent = (payload: EngagementPayload) => {
  const eventName =
    payload.eventType === "click"
      ? `engagement_${payload.category}_click`
      : `engagement_${payload.eventType}`;
  const parameters = {
    engagement_category: payload.category,
    element_name: payload.elementName,
    placement: payload.placement,
    page_path: payload.pagePath,
    target_url: payload.targetUrl,
    traffic_source: payload.source,
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...parameters });
  window.gtag?.("event", eventName, parameters);
  if (payload.eventType === "click") {
    window.fbq?.("trackCustom", "EngagementClick", parameters);
  }
  window.clarity?.("event", eventName);
};

const post = (payload: EngagementPayload) => {
  providerEvent(payload);
  const body = JSON.stringify(payload);
  const token = getAuthToken();
  if (!token && navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      "/backend-api/engagement/events",
      new Blob([body], { type: "application/json" }),
    );
    if (sent) return;
  }
  void fetch("/backend-api/engagement/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-Source-Platform": "website",
      "X-Client-Platform": "website",
    },
    body,
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => undefined);
};

const commonPayload = (
  attribution: WebsiteAttribution,
  clarityEnabled: boolean,
): Omit<EngagementPayload, "eventType" | "category"> => ({
  pageUrl: window.location.href,
  pagePath: window.location.pathname,
  deviceType: deviceType(),
  sessionId: storageId(window.sessionStorage, SESSION_KEY),
  visitorId: storageId(window.localStorage, VISITOR_KEY),
  source: attribution.source,
  medium: attribution.medium,
  campaign: attribution.campaign,
  term: attribution.term,
  content: attribution.content,
  referrer: attribution.referrer || document.referrer || undefined,
  heatmapProvider: clarityEnabled ? "clarity" : undefined,
  queryParams: websiteQueryParams(
    new URLSearchParams(window.location.search),
  ),
  landingPage: attribution.landingPage,
  gclid: attribution.gclid,
  fbclid: attribution.fbclid,
  dsaReferralCode: attribution.dsaReferralCode,
});

const classifyClick = (element: HTMLElement) => {
  const href = String(
    element instanceof HTMLAnchorElement
      ? element.href
      : element.getAttribute("data-href") || "",
  );
  const explicit = element.closest<HTMLElement>("[data-analytics-category]");
  const popup = element.closest<HTMLElement>(
    "[data-analytics-popup], [role='dialog'][aria-modal='true']",
  );
  const banner = element.closest<HTMLElement>("[data-analytics-banner]");
  const footer = element.closest("footer");
  const label = nameFor(element);
  const explicitCategory = explicit?.dataset.analyticsCategory as
    | Category
    | undefined;

  let category: Category | null = explicitCategory || null;
  if (/^tel:/i.test(href)) category = "phone";
  else if (/wa\.me|whatsapp/i.test(href)) category = "whatsapp";
  else if (popup && eligibleCta.test(label)) category = "popup";
  else if (banner) category = "banner";
  else if (footer) category = "footer";
  else if (eligibleCta.test(label)) category = "cta";
  if (!category) return null;

  const container = popup || banner || explicit;
  return {
    category,
    elementName: label,
    elementId: element.id || undefined,
    placement:
      container?.dataset.analyticsPlacement ||
      container?.dataset.analyticsName ||
      (footer ? "site_footer" : undefined),
    targetUrl: href || undefined,
  };
};

export function EngagementTracker({
  clarityEnabled = false,
}: {
  clarityEnabled?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const attributionRef = useRef<WebsiteAttribution | null>(null);

  useEffect(() => {
    attributionRef.current = captureWebsiteAttribution();
  }, []);

  useEffect(() => {
    const attribution =
      attributionRef.current || captureWebsiteAttribution();
    post({
      ...commonPayload(attribution, clarityEnabled),
      eventType: "page_view",
      category: "page",
      elementName: document.title,
    });
  }, [clarityEnabled, pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const element = target.closest<HTMLElement>(
        "a, button, [role='button'], [data-analytics-category]",
      );
      if (!element) return;
      const classified = classifyClick(element);
      if (!classified) return;
      const attribution =
        attributionRef.current || captureWebsiteAttribution();
      post({
        ...commonPayload(attribution, clarityEnabled),
        eventType: "click",
        ...classified,
      });
    };
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, true);
  }, [clarityEnabled]);

  useEffect(() => {
    const seenPopups = new WeakSet<Element>();
    const seenBanners = new WeakSet<Element>();
    const attribution =
      attributionRef.current || captureWebsiteAttribution();
    const record = (
      element: HTMLElement,
      eventType: "popup_impression" | "banner_impression",
      category: "popup" | "banner",
    ) => {
      const metadataElement =
        category === "popup" && !element.hasAttribute("data-analytics-popup")
          ? element.querySelector<HTMLElement>(
              '[data-analytics-category="popup"][data-analytics-placement]',
            ) || element
          : element;
      const placement =
        metadataElement.dataset.analyticsPlacement ||
        metadataElement.dataset.analyticsName ||
        (category === "popup" ? "website_popup" : "website_banner");
      post({
        ...commonPayload(attribution, clarityEnabled),
        eventType,
        category,
        elementName: metadataElement.dataset.analyticsName || placement,
        placement,
      });
    };
    const intersection = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
          record(
            entry.target as HTMLElement,
            "banner_impression",
            "banner",
          );
          intersection.unobserve(entry.target);
        });
      },
      { threshold: [0.35] },
    );
    const scan = (root: ParentNode = document) => {
      root
        .querySelectorAll<HTMLElement>(
          "[data-analytics-popup], [role='dialog'][aria-modal='true']",
        )
        .forEach((element) => {
          if (
            !element.hasAttribute("data-analytics-popup") &&
            element.querySelector("[data-analytics-popup]")
          ) {
            return;
          }
          if (seenPopups.has(element)) return;
          seenPopups.add(element);
          record(element, "popup_impression", "popup");
        });
      root
        .querySelectorAll<HTMLElement>("[data-analytics-banner]")
        .forEach((element) => {
          const slide = element.closest(".swiper-slide");
          if (slide && !slide.classList.contains("swiper-slide-active")) return;
          if (seenBanners.has(element)) return;
          seenBanners.add(element);
          intersection.observe(element);
        });
    };
    const mutation = new MutationObserver((records) => {
      records.forEach((item) => {
        if (item.type === "attributes" && item.target instanceof HTMLElement) {
          if (
            item.attributeName === "class" &&
            !item.target.classList.contains("swiper-slide")
          ) {
            return;
          }
          scan(item.target.parentElement || document);
        }
        item.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) scan(node.parentElement || document);
        });
      });
    });
    scan();
    mutation.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-analytics-banner"],
      childList: true,
      subtree: true,
    });
    return () => {
      mutation.disconnect();
      intersection.disconnect();
    };
  }, [clarityEnabled, pathname]);

  return null;
}
