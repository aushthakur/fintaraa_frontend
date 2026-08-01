import {
  insuranceProductCatalog,
  loanProductCatalog,
  type ProductCatalogItem,
} from "@/data/productCatalog";
import { buildApiUrl } from "@/services/apiUrl";

export type ProductCatalog = {
  loans: ProductCatalogItem[];
  insurance: ProductCatalogItem[];
};

export type PublicProductPage = {
  _id?: string;
  loanType?: string;
  loanTypeSlug?: string;
  insuranceType?: string;
  insuranceTypeSlug?: string;
  title?: string;
  subtitle?: string;
  canonicalPath?: string;
  priority?: number;
  updatedAt?: string;
};

type CatalogApiRow = PublicProductPage;

export type PublicLoanProductPage = PublicProductPage & {
  loanType: string;
  loanTypeSlug: string;
};

export type PublicInsuranceProductPage = PublicProductPage & {
  insuranceType: string;
  insuranceTypeSlug: string;
};

const fallbackCatalog: ProductCatalog = {
  loans: loanProductCatalog,
  insurance: insuranceProductCatalog,
};

const excludedLoanSlugs = new Set(["credit-score-loan"]);
const canonicalLoanSlugAliases: Record<string, string> = {
  "balance-transfer-loan": "balance-transfer-top-up-loan",
  "balance-transfer-and-top-up-loan": "balance-transfer-top-up-loan",
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const inferLoanGroup = (slug: string) => {
  if (
    ["vehicle", "car", "two-wheeler", "used-car"].some((part) =>
      slug.includes(part),
    )
  ) {
    return "vehicle";
  }
  if (
    [
      "business",
      "working-capital",
      "industrial",
      "machinery",
      "commercial",
      "agriculture",
      "dod",
      "od-loan",
    ].some((part) => slug.includes(part))
  ) {
    return "business";
  }
  if (
    ["home", "property", "gold", "security", "balance-transfer", "top-up"].some(
      (part) => slug.includes(part),
    )
  ) {
    return "secured";
  }
  return "personal";
};

const inferInsuranceGroup = (slug: string) => {
  if (["vehicle", "car", "bike", "travel"].some((part) => slug.includes(part))) {
    return "motor";
  }
  if (
    ["home", "property", "shop", "stock", "machinery"].some((part) =>
      slug.includes(part),
    )
  ) {
    return "property";
  }
  return "life-health";
};

const normaliseRows = (
  rows: CatalogApiRow[],
  kind: "loan" | "insurance",
  fallback: ProductCatalogItem[],
) => {
  const fallbackBySlug = new Map(fallback.map((item) => [item.slug, item]));
  const products = new Map<string, ProductCatalogItem>(fallbackBySlug);
  const seenApiSlugs = new Set<string>();

  rows.forEach((row) => {
    const rawName =
      kind === "loan" ? String(row.loanType || "") : String(row.insuranceType || "");
    const incomingSlug = slugify(
      kind === "loan"
        ? String(row.loanTypeSlug || rawName)
        : String(row.insuranceTypeSlug || rawName),
    );
    const slug =
      kind === "loan"
        ? canonicalLoanSlugAliases[incomingSlug] || incomingSlug
        : incomingSlug;
    if (
      !slug ||
      seenApiSlugs.has(slug) ||
      (kind === "loan" && excludedLoanSlugs.has(slug))
    )
      return;
    seenApiSlugs.add(slug);

    const known = fallbackBySlug.get(slug);
    products.set(slug, {
      name: known?.name || rawName.trim() || slug,
      slug,
      group:
        known?.group ||
        (kind === "loan" ? inferLoanGroup(slug) : inferInsuranceGroup(slug)),
    });
  });

  return Array.from(products.values());
};

const readRows = async (path: string) => {
  const url = buildApiUrl(path);
  if (!url) return [];
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return [];
  const payload = await response.json();
  const rows = payload?.data?.result || payload?.data || payload;
  return Array.isArray(rows) ? (rows as CatalogApiRow[]) : [];
};

let cachedCatalog: ProductCatalog | null = null;
let catalogRequest: Promise<ProductCatalog> | null = null;

export const getFallbackProductCatalog = () => fallbackCatalog;

export const fetchPublicProductPages = async (): Promise<{
  loans: PublicLoanProductPage[];
  insurance: PublicInsuranceProductPage[];
}> => {
  const [loanRows, insuranceRows] = await Promise.all([
    readRows("/loan-pages/public?catalogOnly=true&limit=250"),
    readRows("/insurance-pages/public?catalogOnly=true&limit=250"),
  ]);

  return {
    loans: loanRows.filter(
      (row): row is PublicLoanProductPage =>
        Boolean(row.loanType && row.loanTypeSlug) &&
        !excludedLoanSlugs.has(slugify(String(row.loanTypeSlug))),
    ),
    insurance: insuranceRows.filter(
      (row): row is PublicInsuranceProductPage =>
        Boolean(row.insuranceType && row.insuranceTypeSlug),
    ),
  };
};

export const fetchProductCatalog = async (): Promise<ProductCatalog> => {
  if (cachedCatalog) return cachedCatalog;
  if (catalogRequest) return catalogRequest;

  catalogRequest = Promise.all([
    readRows("/loan-pages/public?catalogOnly=true&limit=250"),
    readRows("/insurance-pages/public?catalogOnly=true&limit=250"),
  ])
    .then(([loans, insurance]) => {
      cachedCatalog = {
        loans: normaliseRows(loans, "loan", loanProductCatalog),
        insurance: normaliseRows(
          insurance,
          "insurance",
          insuranceProductCatalog,
        ),
      };
      return cachedCatalog;
    })
    .catch(() => fallbackCatalog)
    .finally(() => {
      catalogRequest = null;
    });

  return catalogRequest;
};
