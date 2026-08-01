import { buildApiUrl } from "@/services/apiUrl";

export type PublicPartnerType = "bank" | "nbfc" | "insurer";
export type PublicPartnerProductCategory =
  | "loan"
  | "credit_card"
  | "insurance";

export type PublicPartner = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  type: PublicPartnerType;
  productCategories: PublicPartnerProductCategory[];
  productCount: number;
  featured: boolean;
  website: string;
  status: string;
};

export type PublicPartnerProduct = {
  id: string;
  partnerId: string;
  partnerSlug: string;
  name: string;
  code: string;
  category: PublicPartnerProductCategory;
  productType: string;
  interestRateMin?: number;
  interestRateMax?: number;
  processingFee?: number | string;
  minAmount?: number;
  maxAmount?: number;
  minTenureMonths?: number;
  maxTenureMonths?: number;
  eligibility: unknown;
  publication: unknown;
  featured: boolean;
  status: string;
};

export type PublicPartnerFilters = {
  type?: PublicPartnerType;
  category?: PublicPartnerProductCategory;
  search?: string;
  featured?: boolean;
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const stringValue = (...values: unknown[]) => {
  const match = values.find(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
  return typeof match === "string" ? match.trim() : "";
};

const numberValue = (...values: unknown[]): number | undefined => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value.replace(/[^0-9.-]/g, ""));
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
};

const booleanValue = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "yes", "1", "featured"].includes(normalized)) return true;
      if (["false", "no", "0"].includes(normalized)) return false;
    }
    if (typeof value === "number") return value > 0;
  }
  return false;
};

export const slugifyPartnerValue = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const normalizePartnerType = (value: unknown): PublicPartnerType => {
  const normalized = slugifyPartnerValue(value);
  if (normalized.includes("insur")) return "insurer";
  if (normalized.includes("nbfc") || normalized.includes("finance")) {
    return "nbfc";
  }
  return "bank";
};

const normalizeCategory = (
  value: unknown,
): PublicPartnerProductCategory | null => {
  const normalized = slugifyPartnerValue(value);
  if (!normalized) return null;
  if (normalized.includes("insurance") || normalized.includes("insurer")) {
    return "insurance";
  }
  if (normalized.includes("credit-card") || normalized === "card") {
    return "credit_card";
  }
  if (normalized.includes("loan") || normalized === "lending") return "loan";
  return null;
};

const normalizeCategories = (
  value: unknown,
  type: PublicPartnerType,
): PublicPartnerProductCategory[] => {
  const rawValues = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  const normalized = rawValues
    .map((item) =>
      normalizeCategory(isRecord(item) ? item.category || item.name : item),
    )
    .filter((item): item is PublicPartnerProductCategory => Boolean(item));
  const unique = Array.from(new Set(normalized));
  if (!unique.length && type === "insurer") return ["insurance"];
  return unique;
};

const unwrapApiData = (payload: unknown): unknown => {
  let current = payload;
  for (let depth = 0; depth < 3; depth += 1) {
    if (!isRecord(current) || !("data" in current)) break;
    current = current.data;
  }
  return current;
};

const normalizeApiList = (payload: unknown): unknown[] => {
  const data = unwrapApiData(payload);
  if (Array.isArray(data)) return data;
  if (!isRecord(data)) return [];
  for (const key of ["result", "items", "partners", "products", "rows"]) {
    if (Array.isArray(data[key])) return data[key] as unknown[];
  }
  return [];
};

export const normalizePublicPartner = (
  value: unknown,
): PublicPartner | null => {
  if (!isRecord(value)) return null;
  const name = stringValue(value.name, value.partnerName, value.title);
  const slug = slugifyPartnerValue(value.slug || name);
  if (!name || !slug) return null;
  const type = normalizePartnerType(value.type || value.partnerType);
  const categories = normalizeCategories(
    value.availableCategories ||
      value.productCategories ||
      value.categories ||
      value.productsOffered,
    type,
  );
  const nestedLogo = isRecord(value.logo) ? value.logo : null;

  return {
    id: stringValue(value._id, value.id) || slug,
    name,
    slug,
    logo: stringValue(
      nestedLogo?.url,
      nestedLogo?.src,
      value.logo,
      value.logoUrl,
      value.image,
      value.imageUrl,
    ),
    type,
    productCategories: categories,
    productCount:
      numberValue(
        value.productCount,
        value.productsCount,
        value.totalProducts,
      ) || 0,
    featured: booleanValue(value.featured, value.isFeatured),
    website: stringValue(value.website, value.websiteUrl),
    status: stringValue(value.status, value.publicationStatus) || "active",
  };
};

export const normalizePublicPartnerProduct = (
  value: unknown,
  partner?: Pick<PublicPartner, "id" | "slug">,
): PublicPartnerProduct | null => {
  if (!isRecord(value)) return null;
  const name = stringValue(value.name, value.productName, value.title);
  const productType = stringValue(
    value.productType,
    value.type,
    value.subType,
    name,
  );
  const category = normalizeCategory(value.category || productType);
  if (!name || !category) return null;
  const rate = isRecord(value.interestRate) ? value.interestRate : null;
  const fee = isRecord(value.processingFee) ? value.processingFee : null;

  const id =
    stringValue(value._id, value.id, value.code) ||
    `${partner?.slug || "partner"}-${slugifyPartnerValue(name)}`;

  return {
    id,
    partnerId: stringValue(value.partnerId, value.partner, partner?.id),
    partnerSlug:
      slugifyPartnerValue(value.partnerSlug) || partner?.slug || "",
    name,
    code: stringValue(value.code, value.productCode),
    category,
    productType,
    interestRateMin: numberValue(
      value.interestRateMin,
      value.minInterestRate,
      value.rateMin,
      rate?.min,
      rate?.minimum,
    ),
    interestRateMax: numberValue(
      value.interestRateMax,
      value.maxInterestRate,
      value.rateMax,
      rate?.max,
      rate?.maximum,
    ),
    processingFee:
      numberValue(
        fee?.value,
        value.processingFee,
        value.processingFeePercent,
      ) ??
      (stringValue(fee?.value, value.processingFee, value.processingFeeText) ||
        undefined),
    minAmount: numberValue(
      value.minAmount,
      value.minimumAmount,
      value.amountMin,
    ),
    maxAmount: numberValue(
      value.maxAmount,
      value.maximumAmount,
      value.amountMax,
    ),
    minTenureMonths: numberValue(
      value.minTenureMonths,
      value.minimumTenureMonths,
      value.minTenure,
      value.tenureMinMonths,
    ),
    maxTenureMonths: numberValue(
      value.maxTenureMonths,
      value.maximumTenureMonths,
      value.maxTenure,
      value.tenureMaxMonths,
    ),
    eligibility: value.eligibility || value.eligibilityCriteria || null,
    publication: value.publication || value.publicationSettings || null,
    featured: booleanValue(value.featured, value.isFeatured),
    status: stringValue(value.status, value.publicationStatus) || "active",
  };
};

const fetchPublicJson = async (path: string) => {
  const apiUrl = buildApiUrl(path);
  if (!apiUrl) throw new Error("Partner API base URL is not configured.");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);
  try {
    const options: RequestInit & { next?: { revalidate: number } } = {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    };
    if (typeof window === "undefined") options.next = { revalidate: 300 };
    else options.cache = "no-store";

    const response = await fetch(apiUrl, options);
    if (!response.ok) {
      throw new Error(`Partner API request failed with ${response.status}.`);
    }
    return (await response.json()) as unknown;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchPublicPartners = async (
  filters: PublicPartnerFilters = {},
): Promise<PublicPartner[]> => {
  const params = new URLSearchParams();
  params.set("limit", "100");
  if (filters.type) params.set("type", filters.type);
  if (filters.category) params.set("category", filters.category);
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (typeof filters.featured === "boolean") {
    params.set("featured", String(filters.featured));
  }
  const query = params.toString();
  const payload = await fetchPublicJson(
    `/partners/public${query ? `?${query}` : ""}`,
  );
  return normalizeApiList(payload)
    .map(normalizePublicPartner)
    .filter((partner): partner is PublicPartner => Boolean(partner));
};

export const fetchPublicPartnerBySlug = async (
  slug: string,
): Promise<PublicPartner | null> => {
  const payload = await fetchPublicJson(
    `/partners/public/${encodeURIComponent(slugifyPartnerValue(slug))}`,
  );
  const data = unwrapApiData(payload);
  const partner = isRecord(data) && isRecord(data.partner) ? data.partner : data;
  return normalizePublicPartner(partner);
};

export const fetchPublicPartnerProducts = async (
  partner: Pick<PublicPartner, "id" | "slug">,
): Promise<PublicPartnerProduct[]> => {
  const payload = await fetchPublicJson(
    `/partners/public/${encodeURIComponent(partner.slug)}/products`,
  );
  return normalizeApiList(payload)
    .map((item) => normalizePublicPartnerProduct(item, partner))
    .filter((product): product is PublicPartnerProduct => Boolean(product));
};

export const getPublicPartnerHref = (
  partner: Pick<PublicPartner, "slug" | "type"> &
    Partial<Pick<PublicPartner, "productCategories">>,
  category?: PublicPartnerProductCategory,
  products: PublicPartnerProduct[] = [],
) => {
  const resolvedCategory =
    category ||
    products[0]?.category ||
    partner.productCategories?.[0] ||
    (partner.type === "insurer" ? "insurance" : "loan");

  if (resolvedCategory === "insurance" || partner.type === "insurer") {
    const insuranceProduct = products.find(
      (product) => product.category === "insurance",
    );
    const productSlug = slugifyPartnerValue(
      insuranceProduct?.productType ||
        insuranceProduct?.name ||
        "health-insurance",
    );
    return `/products/${productSlug || "health-insurance"}`;
  }
  if (resolvedCategory === "credit_card") {
    return `/banks/${partner.slug}/credit-card`;
  }
  const loanProduct = products.find((product) => product.category === "loan");
  const productSlug = slugifyPartnerValue(
    loanProduct?.productType || loanProduct?.name || "personal-loan",
  );
  return `/banks/${partner.slug}/${productSlug || "personal-loan"}`;
};
