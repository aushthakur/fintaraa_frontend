import { buildApiUrl } from "@/services/apiUrl";
import type { HomeBanner } from "@/services/homeBanners";
import { fallbackHomeBanners } from "@/services/homeBanners";
import loanBannerCatalogData from "@/data/loanBannerCatalog.json";
import insuranceBannerCatalogData from "@/data/insuranceBannerCatalog.json";

export type ProductHeroCategory = "loan" | "insurance";

const bannerTypeByCategory: Record<ProductHeroCategory, string> = {
  loan: "loan_detail",
  insurance: "insurance_detail",
};

const localBannerImage = (image?: string, fallback?: string) => {
  if (!image) return fallback || fallbackHomeBanners[0].image;
  return image.includes("/assets/refer/header.png")
    ? "/assets/refer/header-credit-cards.png"
    : image;
};

const normalise = (item: any, fallback: HomeBanner): HomeBanner => ({
  _id: item?._id,
  eyebrow: item?.eyebrow || "",
  title: String(item?.title || fallback.title),
  highlightText: item?.highlightText || "",
  description: item?.description || "",
  image: localBannerImage(item?.image, fallback.image),
  mobileImage: localBannerImage(
    item?.mobileImage,
    fallback.mobileImage || fallback.image,
  ),
  imageAlt: item?.imageAlt || item?.title || fallback.imageAlt,
  linkUrl: item?.linkUrl || "",
  buttonText: item?.buttonText || "",
  secondaryLinkUrl: item?.secondaryLinkUrl || "",
  secondaryButtonText: item?.secondaryButtonText || "",
  displayDurationMs: Number(item?.displayDurationMs || 5000),
  priority: Number(item?.priority || 1),
});

export const getFallbackProductHeroBanners = ({
  category,
  productName,
  productSlug,
}: {
  category: ProductHeroCategory;
  productName: string;
  productSlug: string;
}): HomeBanner[] => {
  if (category === "insurance") {
    const profile = (
      insuranceBannerCatalogData as Array<{
        slug: string;
        name: string;
        eyebrow: string;
        title: string;
        description: string;
      }>
    ).find((item) => item.slug === productSlug);
    const resolvedName = profile?.name || productName;
    const renderedBase = `/assets/insurance-banners/rendered/${productSlug}`;
    return [
      {
        _id: `fallback-${productSlug}-01`,
        eyebrow: profile?.eyebrow || "SMART PROTECTION",
        title: profile?.title || `${resolvedName} Made Clearer`,
        description:
          profile?.description ||
          `Compare ${resolvedName.toLowerCase()} coverage, exclusions, documents and supported options in one secure flow.`,
        image: `${renderedBase}-01-desktop.webp`,
        mobileImage: `${renderedBase}-01-mobile.webp`,
        imageAlt: `${profile?.title || resolvedName}. Compare coverage and apply.`,
        buttonText: "Apply Now",
        secondaryLinkUrl: "#insurance-compare-plans",
        secondaryButtonText: "Compare Plans",
        displayDurationMs: 5200,
        priority: 1,
      },
      {
        _id: `fallback-${productSlug}-02`,
        eyebrow: `Assisted ${resolvedName} journey`,
        title: `Choose ${resolvedName} with Expert Guidance`,
        description:
          "Compare coverage, exclusions, documents and next steps through one secure guided journey.",
        image: `${renderedBase}-02-desktop.webp`,
        mobileImage: `${renderedBase}-02-mobile.webp`,
        imageAlt: `Advisor helping compare ${resolvedName.toLowerCase()} options.`,
        buttonText: "Get Expert Help",
        secondaryLinkUrl: "#insurance-documents",
        secondaryButtonText: "View Documents",
        displayDurationMs: 5200,
        priority: 2,
      },
    ];
  }

  const profile = (
    loanBannerCatalogData as Array<{
      slug: string;
      name: string;
      eyebrow: string;
      title: string;
      description: string;
    }>
  ).find((item) => item.slug === productSlug);
  const resolvedName = profile?.name || productName;
  const renderedBase = `/assets/loan-banners/rendered/${productSlug}`;

  return [
    {
      _id: `fallback-${productSlug}-01`,
      eyebrow: profile?.eyebrow || "SMART LOAN OPTIONS",
      title: profile?.title || `${resolvedName} Made Simple`,
      description:
        profile?.description ||
        `Compare ${resolvedName.toLowerCase()} eligibility, documents and partner-backed options in one secure flow.`,
      image: `${renderedBase}-01-desktop.webp`,
      mobileImage: `${renderedBase}-01-mobile.webp`,
      imageAlt: `${profile?.title || resolvedName}. Apply now or calculate EMI.`,
      buttonText: "Apply Now",
      secondaryLinkUrl: "#loan-emi-calculator",
      secondaryButtonText: "Calculate EMI",
      displayDurationMs: 5000,
      priority: 1,
    },
    {
      _id: `fallback-${productSlug}-02`,
      eyebrow: `Assisted ${resolvedName} journey`,
      title: `Your ${resolvedName} Journey, Made Simpler`,
      description:
        "Check eligibility, prepare documents and compare partner options through one secure guided journey.",
      image: `${renderedBase}-02-desktop.webp`,
      mobileImage: `${renderedBase}-02-mobile.webp`,
      imageAlt: `Assisted ${resolvedName} eligibility and document journey.`,
      buttonText: "Check Eligibility",
      secondaryLinkUrl: "#loan-documents",
      secondaryButtonText: "View Documents",
      displayDurationMs: 5200,
      priority: 2,
    },
  ];
};

export async function fetchProductHeroBanners({
  category,
  productName,
  productSlug,
}: {
  category: ProductHeroCategory;
  productName: string;
  productSlug: string;
}): Promise<HomeBanner[]> {
  const fallback = getFallbackProductHeroBanners({
    category,
    productName,
    productSlug,
  });
  const params = new URLSearchParams({
    limit: "10",
    productSlug,
  });
  const url = buildApiUrl(
    `/banner/public/${bannerTypeByCategory[category]}?${params.toString()}`,
  );

  if (!url) return fallback;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return fallback;

    const payload = await response.json();
    const data = payload?.data?.result || payload?.data || payload;
    const rows = Array.isArray(data) ? data : [];
    const exactProductRows = rows.filter(
      (item) =>
        String(item?.productSlug || "").trim().toLowerCase() === productSlug,
    );
    const genericRows = rows.filter(
      (item) => !String(item?.productSlug || "").trim(),
    );
    // A generic insurance banner must not replace the product-specific artwork.
    const scopedData = exactProductRows.length
      ? exactProductRows
      : category === "insurance"
        ? []
        : genericRows;
    const banners = scopedData
      .slice(0, 2)
      .map((item, index) => normalise(item, fallback[index] || fallback[0]));

    if (!banners.length) return fallback;
    if (banners.length === 1) return [banners[0], fallback[1]];
    return banners;
  } catch {
    return fallback;
  }
}
