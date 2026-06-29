import { buildApiUrl } from "@/services/apiUrl";

export type HomeBanner = {
  _id?: string;
  eyebrow?: string;
  title: string;
  highlightText?: string;
  description?: string;
  image: string;
  imageAlt?: string;
  linkUrl?: string;
  buttonText?: string;
  secondaryLinkUrl?: string;
  secondaryButtonText?: string;
  displayDurationMs?: number;
  priority?: number;
};

export const fallbackHomeBanners: HomeBanner[] = [
  {
    eyebrow: "RBI registered partner network",
    title: "Compare Loans, Insurance & Cards",
    highlightText: "from 30+ Banks",
    description:
      "One secure check. Multiple trusted offers. No CIBIL impact and instant eligibility guidance.",
    image: "/assets/images/hero1.png",
    imageAlt: "Fintaraa advisor helping customers compare financial products",
    linkUrl: "/products",
    buttonText: "Explore products",
    secondaryLinkUrl: "/#eligibility-check",
    secondaryButtonText: "Check my eligibility",
    displayDurationMs: 5000,
  },
];

const localBannerImage = (image?: string) => {
  if (!image) return fallbackHomeBanners[0].image;
  return image.includes("/assets/refer/header.png")
    ? "/assets/refer/header-credit-cards.png"
    : image;
};

const normalise = (item: any): HomeBanner => ({
  _id: item?._id,
  eyebrow: item?.eyebrow || "",
  title: String(item?.title || "Fintaraa Financial Services"),
  highlightText: item?.highlightText || "",
  description: item?.description || "",
  image: localBannerImage(item?.image),
  imageAlt: item?.imageAlt || item?.title || fallbackHomeBanners[0].imageAlt,
  linkUrl: item?.linkUrl || "",
  buttonText: item?.buttonText || "",
  secondaryLinkUrl: item?.secondaryLinkUrl || "",
  secondaryButtonText: item?.secondaryButtonText || "",
  displayDurationMs: Number(item?.displayDurationMs || 5000),
  priority: Number(item?.priority || 1),
});

export async function fetchHomeBanners(): Promise<HomeBanner[]> {
  const url = buildApiUrl("/banner/public/homepage?limit=10");
  if (!url) return fallbackHomeBanners;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return fallbackHomeBanners;
    const payload = await response.json();
    const data = payload?.data?.result || payload?.data || payload;
    const banners = Array.isArray(data) ? data.map(normalise) : [];
    return banners.length ? banners : fallbackHomeBanners;
  } catch {
    return fallbackHomeBanners;
  }
}
