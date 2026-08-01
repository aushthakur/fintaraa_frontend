import { buildApiUrl } from "@/services/apiUrl";

export type HomeBanner = {
  _id?: string;
  eyebrow?: string;
  title: string;
  highlightText?: string;
  description?: string;
  image: string;
  mobileImage?: string;
  imageAlt?: string;
  linkUrl?: string;
  buttonText?: string;
  secondaryLinkUrl?: string;
  secondaryButtonText?: string;
  displayDurationMs?: number;
  contentOverlay?: boolean;
  priority?: number;
};

const isUploadedMediaUrl = (value: string) => /^https?:\/\/\S+$/i.test(value);

const normalise = (item: any): HomeBanner | null => {
  const image = String(item?.image || "").trim();
  const mobileImage = String(item?.mobileImage || "").trim();
  if (
    !isUploadedMediaUrl(image) ||
    (mobileImage && !isUploadedMediaUrl(mobileImage))
  ) {
    return null;
  }

  return {
    _id: item?._id,
    eyebrow: item?.eyebrow || "",
    title: String(item?.title || "Fintaraa Financial Services"),
    highlightText: item?.highlightText || "",
    description: item?.description || "",
    image,
    mobileImage: mobileImage || image,
    imageAlt: item?.imageAlt || item?.title || "Fintaraa homepage banner",
    linkUrl: item?.linkUrl || "",
    buttonText: item?.buttonText || "",
    secondaryLinkUrl: item?.secondaryLinkUrl || "",
    secondaryButtonText: item?.secondaryButtonText || "",
    displayDurationMs: Number(item?.displayDurationMs || 5000),
    contentOverlay: Boolean(item?.contentOverlay),
    priority: Number(item?.priority || 1),
  };
};

export async function fetchHomeBanners(): Promise<HomeBanner[]> {
  const url = buildApiUrl("/banner/public/homepage?limit=10");
  if (!url) return [];

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return [];
    const payload = await response.json();
    const data = payload?.data?.result || payload?.data || payload;
    const rows = Array.isArray(data) ? data : [];
    return rows
      .map(normalise)
      .filter((banner): banner is HomeBanner => Boolean(banner));
  } catch {
    return [];
  }
}
