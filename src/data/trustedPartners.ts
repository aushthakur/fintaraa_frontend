import { bankDirectory } from "./bankDirectory";

export const trustedPartnerCategoryTabs = [
  { key: "all", label: "All" },
  { key: "loan", label: "Loans" },
  { key: "insurance", label: "Insurance" },
  { key: "credit-card", label: "Credit Card" },
  { key: "credit-bureau", label: "Credit Bureau" },
] as const;

export type TrustedPartnerCategoryKey =
  (typeof trustedPartnerCategoryTabs)[number]["key"];

export type TrustedPartnerCapability = Exclude<
  TrustedPartnerCategoryKey,
  "all"
>;

export type TrustedPartner = {
  name: string;
  slug: string;
  logo: string;
  type: "Bank" | "NBFC" | "Insurer";
  categories: TrustedPartnerCapability[];
  defaultProductSlug?: string;
};

const corePartnerCapabilities: Record<string, TrustedPartnerCapability[]> = {
  "sbi-card": ["loan", "insurance", "credit-card", "credit-bureau"],
  "hdfc-bank": ["loan", "insurance", "credit-card", "credit-bureau"],
  "icici-bank": ["loan", "insurance", "credit-card", "credit-bureau"],
  "axis-bank": ["loan", "credit-card", "credit-bureau"],
  "kotak-mahindra-bank": ["loan", "insurance", "credit-card", "credit-bureau"],
  "indusind-bank": ["loan", "credit-card", "credit-bureau"],
  "idfc-first-bank": ["loan", "credit-card", "credit-bureau"],
};

const corePartners: TrustedPartner[] = bankDirectory.map((bank) => ({
  name: bank.name,
  slug: bank.slug,
  logo: bank.logo,
  type: "Bank",
  categories: corePartnerCapabilities[bank.slug] || ["loan"],
  defaultProductSlug: bank.slug === "sbi-card" ? "credit-card" : "personal-loan",
}));

const additionalTrustedPartners: TrustedPartner[] = [
  {
    name: "Bank of Baroda",
    slug: "bank-of-baroda",
    logo: "/assets/banks/bank-of-baroda1.png",
    type: "Bank",
    categories: ["loan", "insurance", "credit-card"],
  },
  {
    name: "Punjab National Bank",
    slug: "punjab-national-bank",
    logo: "/assets/banks/pnb.png",
    type: "Bank",
    categories: ["loan", "credit-card", "credit-bureau"],
  },
  {
    name: "Canara Bank",
    slug: "canara-bank",
    logo: "/assets/banks/canara-bank.png",
    type: "Bank",
    categories: ["loan", "credit-card"],
  },
  {
    name: "Union Bank of India",
    slug: "union-bank-of-india",
    logo: "/assets/banks/union-bank.png",
    type: "Bank",
    categories: ["loan", "insurance"],
  },
  {
    name: "Bank of India",
    slug: "bank-of-india",
    logo: "/assets/banks/bank-of-india.png",
    type: "Bank",
    categories: ["loan", "credit-bureau"],
  },
  {
    name: "Indian Bank",
    slug: "indian-bank",
    logo: "/assets/banks/indian-bank.png",
    type: "Bank",
    categories: ["loan", "credit-card"],
  },
  {
    name: "Central Bank of India",
    slug: "central-bank-of-india",
    logo: "/assets/banks/Central-Bank-of-India.png",
    type: "Bank",
    categories: ["loan"],
  },
  {
    name: "Federal Bank",
    slug: "federal-bank",
    logo: "/assets/banks/Federal-Bank.png",
    type: "Bank",
    categories: ["loan", "insurance", "credit-card"],
  },
  {
    name: "Bandhan Bank",
    slug: "bandhan-bank",
    logo: "/assets/banks/Bandhan-Bank.png",
    type: "Bank",
    categories: ["loan", "credit-card"],
  },
  {
    name: "UCO Bank",
    slug: "uco-bank",
    logo: "/assets/banks/UCO-Bank.png",
    type: "Bank",
    categories: ["loan"],
  },
  {
    name: "Punjab & Sind Bank",
    slug: "punjab-and-sind-bank",
    logo: "/assets/banks/Punjab-&-Sind-Bank.png",
    type: "Bank",
    categories: ["loan"],
  },
  {
    name: "South Indian Bank",
    slug: "south-indian-bank",
    logo: "/assets/banks/south-indian-bank.png",
    type: "Bank",
    categories: ["loan", "credit-card"],
  },
  {
    name: "IDBI Bank",
    slug: "idbi-bank",
    logo: "/assets/banks/IDBI-Bank.png",
    type: "Bank",
    categories: ["loan", "credit-card", "credit-bureau"],
  },
  {
    name: "YES Bank",
    slug: "yes-bank",
    logo: "/assets/banks/yes-bank.png",
    type: "Bank",
    categories: ["loan", "insurance", "credit-card", "credit-bureau"],
  },
  {
    name: "Bajaj Finserv",
    slug: "bajaj-finserv",
    logo: "/assets/banks/bajaj.png",
    type: "NBFC",
    categories: ["loan", "insurance", "credit-bureau"],
  },
  {
    name: "Shriram Finance",
    slug: "shriram-finance",
    logo: "/assets/banks/shriram.png",
    type: "NBFC",
    categories: ["loan", "insurance", "credit-bureau"],
  },
];

export const trustedPartners: TrustedPartner[] = [
  ...corePartners,
  ...additionalTrustedPartners,
];

export const getTrustedPartnersByCategory = (
  category: TrustedPartnerCategoryKey,
) =>
  category === "all"
    ? trustedPartners
    : trustedPartners.filter((partner) => partner.categories.includes(category));

export const getTrustedPartnerHref = (
  partner: TrustedPartner,
  activeCategory: TrustedPartnerCategoryKey,
) => {
  if (activeCategory === "all") {
    return partner.type === "Insurer"
      ? "/products/health-insurance"
      : `/banks/${partner.slug}`;
  }
  if (activeCategory === "credit-bureau") return "/cibil-score";
  if (activeCategory === "insurance") return "/products/health-insurance";

  const productSlug =
    activeCategory === "credit-card" && partner.categories.includes("credit-card")
      ? "credit-card"
      : partner.defaultProductSlug || "personal-loan";

  return `/banks/${partner.slug}/${productSlug}`;
};
