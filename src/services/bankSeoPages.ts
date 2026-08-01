import {
  humanizeSlug,
  slugifyProduct,
  type ParsedLoanLocation,
} from "@/lib/productRouting";
import { bankDirectory } from "@/data/bankDirectory";
import { getTrustedPartnersByCategory } from "@/data/trustedPartners";
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
  isBankOverview?: boolean;
};

export type BankSeoLocationPage = {
  _id?: string;
  bankName: string;
  bankSlug: string;
  productName: string;
  productSlug: string;
  title?: string;
  canonicalPath?: string;
  logoUrl?: string;
  location?: ParsedLoanLocation;
  priority?: number;
  isFeatured?: boolean;
};

export type BankProductLender = {
  bankName: string;
  bankSlug: string;
  productSlug: string;
  logoUrl?: string;
  canonicalPath: string;
  interestRate: string;
  processingFee: string;
  loanAmount: string;
  tenure: string;
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
    location?.state && slugifyProduct(location.state),
    location?.city && slugifyProduct(location.city),
    location?.pincode && slugifyProduct(location.pincode),
    location?.area && slugifyProduct(location.area),
  ].filter(Boolean);
  return parts.join("/");
};

export const buildBankOverviewPath = (bankSlug: string) =>
  ["/banks", slugifyProduct(bankSlug)].filter(Boolean).join("/");

const logoForBank = (bankSlug: string) => {
  if (bankSlug.includes("hdfc")) return "/assets/banks/hdfc.png";
  if (bankSlug.includes("icici")) return "/assets/banks/icici.png";
  if (bankSlug.includes("kotak")) return "/assets/banks/kotak.png";
  if (bankSlug.includes("axis")) return "/assets/banks/axis-bank.png";
  if (bankSlug.includes("indus")) return "/assets/banks/indusind.png";
  if (bankSlug.includes("idfc")) return "/assets/banks/idfc.png";
  if (bankSlug.includes("bajaj")) return "/assets/banks/bajaj.png";
  if (bankSlug.includes("shriram")) return "/assets/banks/shriram.png";
  if (bankSlug.includes("baroda")) return "/assets/banks/bank-of-baroda1.png";
  if (bankSlug.includes("canara")) return "/assets/banks/canara-bank.png";
  if (bankSlug.includes("union")) return "/assets/banks/union-bank.png";
  if (bankSlug.includes("bank-of-india"))
    return "/assets/banks/bank-of-india.png";
  if (bankSlug.includes("indian-bank"))
    return "/assets/banks/indian-bank.png";
  if (bankSlug.includes("central-bank"))
    return "/assets/banks/Central-Bank-of-India.png";
  if (bankSlug.includes("federal")) return "/assets/banks/Federal-Bank.png";
  if (bankSlug.includes("bandhan")) return "/assets/banks/Bandhan-Bank.png";
  if (bankSlug.includes("uco")) return "/assets/banks/UCO-Bank.png";
  if (bankSlug.includes("punjab-and-sind"))
    return "/assets/banks/Punjab-&-Sind-Bank.png";
  if (bankSlug.includes("south-indian"))
    return "/assets/banks/south-indian-bank.png";
  if (bankSlug.includes("idbi")) return "/assets/banks/IDBI-Bank.png";
  if (bankSlug.includes("yes-bank")) return "/assets/banks/yes-bank.png";
  if (bankSlug.includes("sbi") || bankSlug.includes("state-bank"))
    return "/assets/banks/sbi-logo.png";
  if (bankSlug.includes("pnb") || bankSlug.includes("punjab-national"))
    return "/assets/banks/pnb.png";
  return "/assets/banks/indian.png";
};

const bankNameOverrides: Record<string, string> = {
  "hdfc-bank": "HDFC Bank",
  "icici-bank": "ICICI Bank",
  "axis-bank": "Axis Bank",
  "kotak-mahindra-bank": "Kotak Mahindra Bank",
  "idfc-first-bank": "IDFC FIRST Bank",
  "sbi-card": "SBI Card",
  "yes-bank": "YES Bank",
  pnb: "PNB",
};

const humanizeBankName = (bankSlug: string) =>
  bankNameOverrides[slugifyProduct(bankSlug)] || humanizeSlug(bankSlug);

export const buildFallbackBankSeoPage = (
  bankSlug: string,
  productSlug: string,
  location: ParsedLoanLocation,
): BankSeoPageData => {
  const bankName = humanizeBankName(bankSlug);
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

const defaultBankProducts = (bankSlug: string): BankSeoProduct[] => [
  {
    title: "Personal Loan",
    description: "Loan up to ₹40 Lakh Interest from 10.50% p.a.",
    href: `/banks/${bankSlug}/personal-loan`,
  },
  {
    title: "Instant Loan",
    description: "Fast digital loan discovery and assisted application.",
    href: `/banks/${bankSlug}/instant-loan`,
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
];

export const buildFallbackBankOverviewPage = (
  bankSlug: string,
): BankSeoPageData => {
  const bankName = humanizeBankName(bankSlug);

  return {
    _id: `fallback-${bankSlug}-overview`,
    bankName,
    bankSlug,
    productName: "Products",
    productSlug: "",
    title: bankName,
    subtitle: `Compare loans, credit cards, eligibility, documents, and assisted application options from ${bankName}.`,
    logoUrl: logoForBank(bankSlug),
    trustBadge: "Trusted Partner",
    seoTitle: `${bankName} Products | Fintaraa`,
    seoDescription: `Explore ${bankName} loan and credit-card products with Fintaraa. Compare eligibility, documents, rates, and assisted application support.`,
    canonicalPath: buildBankOverviewPath(bankSlug),
    aboutTitle: `About ${bankName}`,
    aboutDescription: `${bankName} is a trusted financial partner available on Fintaraa for loan, card, and assisted financial product discovery.`,
    location: {
      country: "India",
      state: "",
      city: "",
      pincode: "",
      area: "",
    },
    heroStats: [
      { label: "Product Options", value: "Loans & Cards" },
      { label: "Application", value: "Assisted Digital" },
      { label: "Eligibility", value: "Profile Based" },
      { label: "Support", value: "Fintaraa Guided" },
    ],
    bankStats: [
      { label: "Category", value: "Bank Partner" },
      { label: "Presence", value: "India" },
      { label: "Journey", value: "Digital + Assisted" },
    ],
    whyApply: [
      "Compare multiple products from one bank",
      "Check eligibility before applying",
      "Continue with assisted Fintaraa support",
      "Review documents and next steps clearly",
    ],
    products: defaultBankProducts(bankSlug),
    tabs: [
      { key: "overview", label: "Overview", sortOrder: 1, isActive: true },
      { key: "product", label: "Products", sortOrder: 2, isActive: true },
      { key: "eligibility", label: "Eligibility", sortOrder: 3, isActive: true },
      { key: "document", label: "Documents", sortOrder: 4, isActive: true },
      { key: "why_bank", label: `Why ${bankName.split(" ")[0]}`, sortOrder: 5, isActive: true },
      { key: "review", label: "Review", sortOrder: 6, isActive: true },
    ],
    interestRates: [],
    applyBullets: ["Choose a product", "Check eligibility", "Apply digitally"],
    isIndexable: true,
    isFallback: true,
    isBankOverview: true,
  };
};

const buildBankOverviewFromPages = (
  bankSlug: string,
  pages: BankSeoLocationPage[],
) => {
  const first = pages[0];
  const fallback = buildFallbackBankOverviewPage(bankSlug);
  if (!first) return fallback;
  const bankName = first.bankName || fallback.bankName;

  const productsBySlug = new Map<string, BankSeoProduct>();
  pages.forEach((page) => {
    if (!page.productSlug) return;
    productsBySlug.set(page.productSlug, {
      title: page.productName || humanizeSlug(page.productSlug),
      description: `Open ${page.bankName || fallback.bankName} ${page.productName || humanizeSlug(page.productSlug)} details.`,
      href: `/banks/${bankSlug}/${page.productSlug}`,
    });
  });

  const mergedProducts = [
    ...Array.from(productsBySlug.values()),
    ...defaultBankProducts(bankSlug),
  ];
  const seen = new Set<string>();
  const products = mergedProducts.filter((product) => {
    const key = slugifyProduct(product.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    ...fallback,
    bankName,
    title: bankName,
    subtitle: `Compare loans, credit cards, eligibility, documents, and assisted application options from ${bankName}.`,
    seoTitle: `${bankName} Products | Fintaraa`,
    seoDescription: `Explore ${bankName} loan and credit-card products with Fintaraa. Compare eligibility, documents, rates, and assisted application support.`,
    aboutTitle: `About ${bankName}`,
    aboutDescription: `${bankName} is a trusted financial partner available on Fintaraa for loan, card, and assisted financial product discovery.`,
    tabs: fallback.tabs.map((tab) =>
      tab.key === "why_bank"
        ? { ...tab, label: `Why ${bankName.split(" ")[0]}` }
        : tab,
    ),
    logoUrl: first.logoUrl || fallback.logoUrl,
    products,
    isFallback: false,
  };
};

export async function getBankOverviewPage(
  bankSlug: string,
): Promise<BankSeoPageData> {
  const baseUrl = getBaseUrl();
  if (!baseUrl || !(await isServerApiReachable(baseUrl))) {
    return buildFallbackBankOverviewPage(bankSlug);
  }

  const params = new URLSearchParams({
    bankSlug: slugifyProduct(bankSlug),
    limit: "200",
  });

  try {
    const response = await fetch(`${baseUrl}/bank-pages/public?${params}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) throw new Error("Bank overview request failed");
    const payload = (await response.json()) as ApiResponse<BankSeoLocationPage[]>;
    const pages = Array.isArray(payload.data) ? payload.data : [];
    return buildBankOverviewFromPages(slugifyProduct(bankSlug), pages);
  } catch {
    return buildFallbackBankOverviewPage(bankSlug);
  }
}

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

export async function getBankSeoLocationPages(
  bankSlug: string,
  productSlug: string,
): Promise<BankSeoLocationPage[]> {
  const baseUrl = getBaseUrl();
  if (!baseUrl || !(await isServerApiReachable(baseUrl))) return [];

  const params = new URLSearchParams({
    bankSlug: slugifyProduct(bankSlug),
    productSlug: slugifyProduct(productSlug),
    limit: "500",
  });

  try {
    const response = await fetch(`${baseUrl}/bank-pages/public?${params}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) throw new Error("Bank page list request failed");
    const payload = (await response.json()) as ApiResponse<BankSeoLocationPage[]>;
    return Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
}

const instantLoanSpecialistLenders = [
  { name: "L&T Finance", slug: "l-and-t-finance" },
  { name: "Credit Saison", slug: "credit-saison" },
  {
    name: "Aditya Birla Finance Limited",
    slug: "aditya-birla-finance-limited",
  },
  { name: "InCred Finance", slug: "incred-finance" },
  { name: "WeRize", slug: "werize" },
  { name: "Tata Capital", slug: "tata-capital" },
  { name: "Piramal Finance", slug: "piramal-finance" },
  { name: "SMFG India Credit", slug: "smfg-fullerton" },
];

const fallbackProductLenders = (productSlug: string): BankProductLender[] => {
  const directory =
    productSlug === "instant-loan"
      ? [
          ...getTrustedPartnersByCategory("loan").map((partner) => ({
            name: partner.name,
            slug: partner.slug,
            logo: partner.logo,
          })),
          ...instantLoanSpecialistLenders.map((partner) => ({
            ...partner,
            logo: undefined,
          })),
        ]
      : bankDirectory;
  const unique = new Map<string, BankProductLender>();

  directory.forEach((bank) => {
    const bankSlug = slugifyProduct(bank.slug);
    unique.set(bankSlug, {
    bankName: bank.name,
      bankSlug,
    productSlug,
    logoUrl: bank.logo,
      canonicalPath: buildBankPath(bankSlug, productSlug),
    interestRate: "Check lender details",
    processingFee: "As per lender policy",
    loanAmount: "Profile based",
    tenure: "Flexible tenure",
    });
  });

  return Array.from(unique.values());
};

const mergeProductLenders = (
  fallback: BankProductLender[],
  configured: BankProductLender[],
) => {
  const merged = new Map(
    fallback.map((lender) => [lender.bankSlug, lender] as const),
  );
  configured.forEach((lender) => merged.set(lender.bankSlug, lender));
  return Array.from(merged.values()).sort((first, second) =>
    first.bankName.localeCompare(second.bankName),
  );
};

const isRootBankPage = (page: BankSeoLocationPage) => {
  const location = page.location || ({} as ParsedLoanLocation);
  return !location.state && !location.city && !location.pincode && !location.area;
};

export async function getBankProductLenders(
  productSlug: string,
): Promise<BankProductLender[]> {
  const normalizedProductSlug = slugifyProduct(productSlug);
  const fallback = fallbackProductLenders(normalizedProductSlug);
  const baseUrl = getBaseUrl();

  if (!baseUrl || !(await isServerApiReachable(baseUrl))) return fallback;

  try {
    const params = new URLSearchParams({
      productSlug: normalizedProductSlug,
      limit: "500",
    });
    const response = await fetch(`${baseUrl}/bank-pages/public?${params}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) throw new Error("Bank product list request failed");

    const payload = (await response.json()) as ApiResponse<
      BankSeoLocationPage[]
    >;
    const pages = Array.isArray(payload.data) ? payload.data : [];
    const roots = new Map<string, BankSeoLocationPage>();

    pages.forEach((page) => {
      if (!page.bankSlug || !isRootBankPage(page)) return;
      roots.set(slugifyProduct(page.bankSlug), page);
    });

    if (!roots.size) return fallback;

    const lenders = await Promise.all(
      Array.from(roots.values()).map(async (summary) => {
        const bankSlug = slugifyProduct(summary.bankSlug);
        try {
          const detailResponse = await fetch(
            `${baseUrl}/bank-pages/public/${bankSlug}/${normalizedProductSlug}`,
            { next: { revalidate: 300 } },
          );
          if (!detailResponse.ok) throw new Error("Bank product request failed");
          const detailPayload =
            (await detailResponse.json()) as ApiResponse<BankSeoPageData>;
          const detail = detailPayload.data;
          const firstRate = detail?.interestRates?.[0];
          const stat = (label: string) =>
            detail?.heroStats?.find((item) =>
              item.label.toLowerCase().includes(label),
            )?.value;

          return {
            bankName: detail?.bankName || summary.bankName,
            bankSlug,
            productSlug: normalizedProductSlug,
            logoUrl: detail?.logoUrl || summary.logoUrl,
            canonicalPath:
              detail?.canonicalPath ||
              summary.canonicalPath ||
              buildBankPath(bankSlug, normalizedProductSlug),
            interestRate:
              firstRate?.interestRate ||
              stat("interest") ||
              "Check lender details",
            processingFee:
              firstRate?.processingFee || "As per lender policy",
            loanAmount:
              firstRate?.loanAmount || stat("amount") || "Profile based",
            tenure: firstRate?.tenure || stat("tenure") || "Flexible tenure",
          } satisfies BankProductLender;
        } catch {
          return {
            bankName: summary.bankName,
            bankSlug,
            productSlug: normalizedProductSlug,
            logoUrl: summary.logoUrl,
            canonicalPath:
              summary.canonicalPath ||
              buildBankPath(bankSlug, normalizedProductSlug),
            interestRate: "Check lender details",
            processingFee: "As per lender policy",
            loanAmount: "Profile based",
            tenure: "Flexible tenure",
          } satisfies BankProductLender;
        }
      }),
    );

    return mergeProductLenders(fallback, lenders);
  } catch {
    return fallback;
  }
}
