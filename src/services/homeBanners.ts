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
  priority?: number;
};

export const fallbackHomeBanners: HomeBanner[] = [
  {
    _id: "fallback-hero-loans",
    eyebrow: "RBI registered partner network",
    title: "Compare Loans, Insurance & Cards",
    highlightText: "from 30+ Banks",
    description:
      "One secure check. Multiple trusted offers. No CIBIL impact and instant eligibility guidance.",
    image: "/assets/home/hero-banners/financial-advisor-family.png",
    imageAlt: "Fintaraa advisor helping customers compare financial products",
    linkUrl: "/products",
    buttonText: "Explore products",
    secondaryLinkUrl: "/#eligibility-check",
    secondaryButtonText: "Check my eligibility",
    displayDurationMs: 5000,
    priority: 1,
  },
  {
    _id: "fallback-hero-instant-loan",
    eyebrow: "Fast digital loan discovery",
    title: "Get Loan Offers",
    highlightText: "in Minutes",
    description:
      "Compare bank and NBFC options with a secure digital journey built for speed and clarity.",
    image: "/assets/home/hero-banners/instant-digital-loan.png",
    imageAlt: "Professional checking instant digital loan options on mobile",
    linkUrl: "/banks",
    buttonText: "View banks",
    secondaryLinkUrl: "/#eligibility-check",
    secondaryButtonText: "Check eligibility",
    displayDurationMs: 5200,
    priority: 2,
  },
  {
    _id: "fallback-hero-insurance",
    eyebrow: "Protected tomorrow starts today",
    title: "Secure Your Family",
    highlightText: "with Better Cover",
    description:
      "Explore health, life, term, travel, and property insurance options with guided support.",
    image: "/assets/home/hero-banners/insurance-family-protection.png",
    imageAlt: "Family reviewing insurance protection options with advisor",
    linkUrl: "/products/insurance",
    buttonText: "Explore insurance",
    secondaryLinkUrl: "/#eligibility-check",
    secondaryButtonText: "Get guidance",
    displayDurationMs: 5200,
    priority: 3,
  },
  {
    _id: "fallback-hero-credit-card",
    eyebrow: "Smart choices, bigger rewards",
    title: "Find Credit Cards",
    highlightText: "that Reward You",
    description:
      "Pick cards for travel, fuel, shopping, cashback, and premium rewards with one clear flow.",
    image: "/assets/home/hero-banners/credit-card-rewards.png",
    imageAlt: "Professional comparing credit card rewards on mobile",
    linkUrl: "/credit-cards",
    buttonText: "Explore cards",
    secondaryLinkUrl: "/#eligibility-check",
    secondaryButtonText: "Check eligibility",
    displayDurationMs: 5200,
    priority: 4,
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
  mobileImage: localBannerImage(item?.mobileImage || item?.image),
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
