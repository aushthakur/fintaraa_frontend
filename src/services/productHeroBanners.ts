import { buildApiUrl } from "@/services/apiUrl";
import type { HomeBanner } from "@/services/homeBanners";
import { fallbackHomeBanners } from "@/services/homeBanners";

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
}: {
  category: ProductHeroCategory;
  productName: string;
  productSlug: string;
}): HomeBanner[] => {
  if (category === "insurance") {
    return [
      {
        _id: "fallback-product-insurance-cover",
        eyebrow: "Smart protection",
        title: `${productName} Plans`,
        highlightText: "Compare & Apply",
        description:
          "Compare cover, premiums, documents, and guided claim support before you apply.",
        image: "/assets/home/hero-banners/insurance-family-protection.png",
        imageAlt: `${productName} plan comparison`,
        buttonText: `Apply ${productName}`,
        displayDurationMs: 5200,
        priority: 1,
      },
      {
        _id: "fallback-product-insurance-guidance",
        eyebrow: "Assisted insurance journey",
        title: "Choose Better Cover",
        highlightText: "with Expert Help",
        description:
          "Get support across plan comparison, declarations, documentation, and next steps.",
        image: "/assets/home/hero-banners/financial-advisor-family.png",
        imageAlt: "Advisor helping compare insurance options",
        buttonText: "Start application",
        displayDurationMs: 5200,
        priority: 2,
      },
    ];
  }

  return [
    {
      _id: "fallback-product-loan-approval",
      eyebrow: "Fast digital loan journey",
      title: `${productName} Made Simple`,
      highlightText: "Apply Online",
      description:
        "Compare eligibility, documents, EMI comfort, and partner-backed support in one flow.",
      image: "/assets/home/hero-banners/instant-digital-loan.png",
      imageAlt: `${productName} online application`,
      buttonText: `Apply ${productName}`,
      displayDurationMs: 5000,
      priority: 1,
    },
    {
      _id: "fallback-product-loan-support",
      eyebrow: "Guided application support",
      title: "Quick Documentation",
      highlightText: "Clear Next Steps",
      description:
        "Prepare KYC, income, and bank details with a secure assisted application journey.",
      image: "/assets/home/hero-banners/financial-advisor-family.png",
      imageAlt: "Advisor helping with loan documentation",
      buttonText: "Check eligibility",
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
    const banners = Array.isArray(data)
      ? data.map((item, index) => normalise(item, fallback[index] || fallback[0]))
      : [];

    return banners.length ? banners : fallback;
  } catch {
    return fallback;
  }
}
