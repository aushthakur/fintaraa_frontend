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
    eyebrow: "Fintaraa Financial Services",
    title: "Get the Best Loan, Insurance & Credit Card",
    highlightText: "Fast & Free",
    description: "Compare offers from 30+ banks and NBFCs. Apply in minutes.",
    image: "/assets/refer/header.png",
    imageAlt: "Banking services application view dashboard",
    linkUrl: "/products",
    buttonText: "View All Products",
    secondaryLinkUrl: "/products",
    secondaryButtonText: "Check Eligibility Free",
    displayDurationMs: 5000,
  },
];

const normalise = (item: any): HomeBanner => ({
  _id: item?._id,
  eyebrow: item?.eyebrow || "",
  title: String(item?.title || "Fintaraa Financial Services"),
  highlightText: item?.highlightText || "",
  description: item?.description || "",
  image: item?.image || fallbackHomeBanners[0].image,
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
