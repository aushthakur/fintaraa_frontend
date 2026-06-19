import {
  humanizeSlug,
  slugifyProduct,
  type ParsedLoanLocation,
} from "@/lib/productRouting";
import { isServerApiReachable } from "./serverApiAvailability";

export type BankSeoStat = {
  label: string;
  value: string;
  text?: string;
};

export type BankSeoTab = {
  key: string;
  label: string;
  title?: string;
  description?: string;
  content?: string[];
  bullets?: string[];
  sortOrder?: number;
  isActive?: boolean;
};

export type BankSeoProduct = {
  title: string;
  description?: string;
  ctaLabel?: string;
  href?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type BankSeoRate = {
  loanAmount: string;
  interestRate: string;
  processingFee: string;
  tenure: string;
  sortOrder?: number;
};

export type BankSeoPageData = {
  _id?: string;
  bankName: string;
  bankSlug: string;
  productName: string;
  productSlug: string;
  title: string;
  subtitle?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  trustBadge?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalPath?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  location?: ParsedLoanLocation;
  heroStats: BankSeoStat[];
  bankStats: BankSeoStat[];
  whyApply: string[];
  products: BankSeoProduct[];
  tabs: BankSeoTab[];
  interestRates: BankSeoRate[];
  applyBullets: string[];
  isIndexable?: boolean;
  isFallback?: boolean;
};

type ApiResponse<T> = {
  data?: T;
};

const getBaseUrl = () =>
  (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

const locationLabel = (location: ParsedLoanLocation) =>
  [location.area, location.pincode, location.city, location.state]
    .filter(Boolean)
    .join(", ");

export const buildBankPath = (
  bankSlug: string,
  productSlug: string,
  location?: Partial<ParsedLoanLocation>,
) => {
  const parts = [
    "/banks",
    slugifyProduct(bankSlug),
    slugifyProduct(productSlug),
    location?.country && slugifyProduct(location.country),
    location?.state && slugifyProduct(location.state),
    location?.city && slugifyProduct(location.city),
    location?.pincode && slugifyProduct(location.pincode),
    location?.area && slugifyProduct(location.area),
  ].filter(Boolean);
  return parts.join("/");
};

const logoForBank = (bankSlug: string) => {
  if (bankSlug.includes("hdfc")) return "/assets/banks/hdfc.png";
  if (bankSlug.includes("icici")) return "/assets/banks/icici.png";
  if (bankSlug.includes("kotak")) return "/assets/banks/kotak.png";
  if (bankSlug.includes("sbi")) return "/assets/banks/sbi.png";
  if (bankSlug.includes("pnb")) return "/assets/banks/pnb.png";
  return "/assets/banks/indian.png";
};

export const buildFallbackBankSeoPage = (
  bankSlug: string,
  productSlug: string,
  location: ParsedLoanLocation,
): BankSeoPageData => {
  const bankName = humanizeSlug(bankSlug);
  const productName = humanizeSlug(productSlug);
  const scoped = locationLabel(location)
    ? `${bankName} ${productName} in ${locationLabel(location)}`
    : `${bankName} ${productName}`;

  return {
    _id: `fallback-${bankSlug}-${productSlug}`,
    bankName,
    bankSlug,
    productName,
    productSlug,
    title: scoped,
    subtitle: `Instant ${productName}s from ${bankName} with assisted application support.`,
    logoUrl: logoForBank(bankSlug),
    trustBadge: "Trusted Partner",
    seoTitle: `${scoped} | Fintaraa`,
    seoDescription: `Apply for ${scoped} with Fintaraa. Check eligibility, documents, products, rates, and location-wise support.`,
    canonicalPath: buildBankPath(bankSlug, productSlug, location),
    aboutTitle: `About ${bankName}`,
    aboutDescription: `${bankName} is a trusted financial partner known for customer centric banking solutions and quick loan assistance. With strong branch presence and digital support, ${bankName} offers a wide range of financial products to meet your needs.`,
    location,
    heroStats: [
      { label: "Quick Approval", value: "in 24 hrs" },
      { label: "Attractive Interest Rates", value: "Starts from 10.50% p.a." },
      { label: "Loan Amount", value: "₹50,000 - ₹40 Lakh" },
      { label: "Paperless Process", value: "100% Online" },
    ],
    bankStats: [
      { label: "Founded", value: "1995" },
      { label: "Branches", value: "6,500+" },
      { label: "Presence", value: "1,500+ Cities" },
    ],
    whyApply: [
      "Free & Easy Application",
      "100% Safe & Secure",
      "Multiple Loan Offers",
      "Best Interest Rates",
    ],
    products: [
      {
        title: "Personal Loan",
        description: "Loan up to ₹40 Lakh Interest from 10.50% p.a.",
        href: `/banks/${bankSlug}/personal-loan`,
      },
      {
        title: "Home Loan",
        description: "Loan up to ₹10 Cr Interest from 8.40% p.a.",
        href: `/banks/${bankSlug}/home-loan`,
      },
      {
        title: "Business Loan",
        description: "Loan up to ₹1 Cr Interest from 11.25% p.a.",
        href: `/banks/${bankSlug}/business-loan`,
      },
      {
        title: "Credit Card",
        description: "Lifetime Free Cards Exclusive Rewards",
        href: `/banks/${bankSlug}/credit-card`,
      },
    ],
    tabs: [
      { key: "overview", label: "Overview", sortOrder: 1, isActive: true },
      { key: "interest_rate", label: "Interest Rate", sortOrder: 2, isActive: true },
      { key: "eligibility", label: "Eligibility", sortOrder: 3, isActive: true },
      { key: "document", label: "Document", sortOrder: 4, isActive: true },
      { key: "product", label: "Product", sortOrder: 5, isActive: true },
      { key: "why_bank", label: `Why ${bankName.split(" ")[0]}`, sortOrder: 6, isActive: true },
      { key: "review", label: "Review", sortOrder: 7, isActive: true },
    ],
    interestRates: Array.from({ length: 4 }, (_, index) => ({
      loanAmount: "Up to ₹5 Lakh",
      interestRate: "10.50% onwards",
      processingFee: "Up to 2.50%",
      tenure: "12 - 60 Months",
      sortOrder: index + 1,
    })),
    applyBullets: ["Minimal Documentation", "Quick Disbursal"],
    isIndexable: true,
    isFallback: true,
  };
};

export async function getBankSeoPage(
  bankSlug: string,
  productSlug: string,
  location: ParsedLoanLocation,
): Promise<BankSeoPageData> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return buildFallbackBankSeoPage(bankSlug, productSlug, location);
  if (!(await isServerApiReachable(baseUrl))) {
    return buildFallbackBankSeoPage(bankSlug, productSlug, location);
  }

  const params = new URLSearchParams();
  Object.entries(location).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  try {
    const response = await fetch(
      `${baseUrl}/bank-pages/public/${bankSlug}/${productSlug}?${params.toString()}`,
      { next: { revalidate: 300 } },
    );
    if (!response.ok) throw new Error("Bank page request failed");
    const payload = (await response.json()) as ApiResponse<BankSeoPageData>;
    const data = payload.data;
    if (!data) throw new Error("Bank page missing data");
    return {
      ...data,
      location: { ...location, ...(data.location || {}) },
      tabs: (data.tabs || []).map((tab) => ({
        ...tab,
        key: tab.key
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, ""),
      })),
    };
  } catch {
    return buildFallbackBankSeoPage(bankSlug, productSlug, location);
  }
}
