import { buildApiUrl } from "@/services/apiUrl";
import type { HomeBanner } from "@/services/homeBanners";

export type ProductHeroCategory = "loan" | "insurance";

const bannerTypeByCategory: Record<ProductHeroCategory, string> = {
  loan: "loan_detail",
  insurance: "insurance_detail",
};

const isUploadedMediaUrl = (value: string) => /^https?:\/\/\S+$/i.test(value);

const normalise = (item: any): HomeBanner | null => {
  const image = String(item?.image || "").trim();
  const mobileImage = String(item?.mobileImage || "").trim();

  // Product detail banners are responsive records. Do not silently substitute
  // a local or desktop image when the required backend asset is missing.
  if (!isUploadedMediaUrl(image) || !isUploadedMediaUrl(mobileImage)) {
    return null;
  }

  return {
    _id: item?._id,
    eyebrow: item?.eyebrow || "",
    title: String(item?.title || ""),
    highlightText: item?.highlightText || "",
    description: item?.description || "",
    image,
    mobileImage,
    imageAlt: item?.imageAlt || item?.title || "Product banner",
    linkUrl: item?.linkUrl || "",
    buttonText: item?.buttonText || "",
    secondaryLinkUrl: item?.secondaryLinkUrl || "",
    secondaryButtonText: item?.secondaryButtonText || "",
    displayDurationMs: Number(item?.displayDurationMs || 5000),
    priority: Number(item?.priority || 1),
  };
};

export async function fetchProductHeroBanners({
  category,
  productSlug,
}: {
  category: ProductHeroCategory;
  productSlug: string;
}): Promise<HomeBanner[]> {
  const params = new URLSearchParams({
    limit: "20",
    productSlug,
  });
  const url = buildApiUrl(
    `/banner/public/${bannerTypeByCategory[category]}?${params.toString()}`,
  );

  if (!url) return [];

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return [];

    const payload = await response.json();
    const data = payload?.data?.result || payload?.data || payload;
    const rows = Array.isArray(data) ? data : [];

    return rows
      .filter(
        (item) =>
          String(item?.productSlug || "")
            .trim()
            .toLowerCase() === productSlug,
      )
      .map(normalise)
      .filter((banner): banner is HomeBanner => Boolean(banner));
  } catch {
    return [];
  }
}
