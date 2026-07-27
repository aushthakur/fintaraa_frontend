import { buildApiUrl } from "@/services/apiUrl";
import type { HomeBanner } from "@/services/homeBanners";
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

const isUploadedMediaUrl = (value: string) => /^https?:\/\/\S+$/i.test(value);

const normalise = (item: any): HomeBanner | null => {
  const image = String(item?.image || "").trim();
  if (!isUploadedMediaUrl(image)) return null;

  return {
    _id: item?._id,
    eyebrow: item?.eyebrow || "",
    title: String(item?.title || ""),
    highlightText: item?.highlightText || "",
    description: item?.description || "",
    image,
    mobileImage: String(item?.mobileImage || "").trim() || image,
    imageAlt: item?.imageAlt || item?.title || "Product offer banner",
    linkUrl: item?.linkUrl || "",
    buttonText: item?.buttonText || "",
    secondaryLinkUrl: item?.secondaryLinkUrl || "",
    secondaryButtonText: item?.secondaryButtonText || "",
    displayDurationMs: Number(item?.displayDurationMs || 5000),
    priority: Number(item?.priority || 1),
  };
};

export async function fetchProductPopupBanner({
  category,
  device,
  productSlug,
}: {
  category: ProductHeroCategory;
  device: ProductPopupDevice;
  productSlug: string;
}): Promise<HomeBanner | null> {
  const params = new URLSearchParams({
    limit: "1",
    productSlug,
  });
  const url = buildApiUrl(
    `/banner/public/${popupTypeByCategory[category][device]}?${params.toString()}`,
  );

  if (!url) return null;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;

    const payload = await response.json();
    const data = payload?.data?.result || payload?.data || payload;
    const scopedData = Array.isArray(data)
      ? data.filter(
          (item) =>
            String(item?.productSlug || "")
              .trim()
              .toLowerCase() === productSlug,
        )
      : [];

    return scopedData.length ? normalise(scopedData[0]) : null;
  } catch {
    return null;
  }
}
