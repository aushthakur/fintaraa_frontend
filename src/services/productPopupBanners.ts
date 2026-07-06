import { buildApiUrl } from "@/services/apiUrl";
import type { HomeBanner } from "@/services/homeBanners";
import { fallbackHomeBanners } from "@/services/homeBanners";
import type { ProductHeroCategory } from "@/services/productHeroBanners";

export type ProductPopupDevice = "web" | "mobile";

const popupTypeByCategory: Record<
  ProductHeroCategory,
  Record<ProductPopupDevice, string>
> = {
  loan: {
    web: "loan_detail_popup_web",
    mobile: "loan_detail_popup_mobile",
  },
  insurance: {
    web: "insurance_detail_popup_web",
    mobile: "insurance_detail_popup_mobile",
  },
};

const fallbackByCategory: Record<ProductHeroCategory, HomeBanner> = {
  loan: {
    ...fallbackHomeBanners[1],
    _id: "fallback-loan-popup",
    title: "Loan offer popup",
    image: "/assets/home/hero-banners/instant-digital-loan.png",
    imageAlt: "Loan application banner",
  },
  insurance: {
    ...fallbackHomeBanners[2],
    _id: "fallback-insurance-popup",
    title: "Insurance offer popup",
    image: "/assets/home/hero-banners/insurance-family-protection.png",
    imageAlt: "Insurance plan banner",
  },
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

export async function fetchProductPopupBanner({
  category,
  device,
  productSlug,
}: {
  category: ProductHeroCategory;
  device: ProductPopupDevice;
  productSlug: string;
}): Promise<HomeBanner | null> {
  const fallback = fallbackByCategory[category];
  const params = new URLSearchParams({
    limit: "1",
    productSlug,
  });
  const url = buildApiUrl(
    `/banner/public/${popupTypeByCategory[category][device]}?${params.toString()}`,
  );

  if (!url) return fallback;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return fallback;

    const payload = await response.json();
    const data = payload?.data?.result || payload?.data || payload;
    if (!Array.isArray(data) || !data.length) return fallback;

    return normalise(data[0], fallback);
  } catch {
    return fallback;
  }
}
