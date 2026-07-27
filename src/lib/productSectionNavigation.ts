"use client";

export const PRODUCT_SECTION_NAVIGATION_EVENT =
  "fintaraa:product-section-navigation";

export type ProductSectionNavigationDetail = {
  href: string;
  sectionId: string;
};

const sectionIdFromHref = (href: string) => {
  if (!href.startsWith("#")) return "";

  try {
    return decodeURIComponent(href.slice(1));
  } catch {
    return href.slice(1);
  }
};

export const scrollToProductSection = (
  href: string,
  remainingAttempts = 30,
) => {
  const sectionId = sectionIdFromHref(href);
  if (!sectionId) return;

  const target = document.getElementById(sectionId);
  if (target) {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    return;
  }

  if (remainingAttempts > 0) {
    window.setTimeout(
      () => scrollToProductSection(href, remainingAttempts - 1),
      50,
    );
  }
};

export const navigateToProductSection = (href: string) => {
  const sectionId = sectionIdFromHref(href);
  if (!sectionId) return;

  const detail: ProductSectionNavigationDetail = { href, sectionId };
  window.dispatchEvent(
    new CustomEvent<ProductSectionNavigationDetail>(
      PRODUCT_SECTION_NAVIGATION_EVENT,
      { detail },
    ),
  );

  if (window.location.hash === href) {
    window.history.replaceState(null, "", href);
  } else {
    window.history.pushState(null, "", href);
  }

  scrollToProductSection(href);
};
