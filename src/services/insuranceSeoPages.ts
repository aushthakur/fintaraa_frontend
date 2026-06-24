import {
  buildLoanPath,
  humanizeSlug,
  type ParsedLoanLocation,
} from "@/lib/productRouting";
import { isServerApiReachable } from "./serverApiAvailability";

export type InsuranceSeoTab = {
  key: string;
  label: string;
  title: string;
  description?: string;
  covered?: string[];
  notCovered?: string[];
  bullets?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  filterKeys?: string[];
  sortOrder?: number;
  isActive?: boolean;
};

export type InsuranceSeoFormField = {
  key: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  filterKey?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type InsuranceSeoPageData = {
  _id?: string;
  insuranceType: string;
  insuranceTypeSlug: string;
  title: string;
  subtitle?: string;
  heroTitle?: string;
  heroDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalPath?: string;
  location?: ParsedLoanLocation;
  tabs: InsuranceSeoTab[];
  formFields: InsuranceSeoFormField[];
  filterKeys?: string[];
  badges?: string[];
  isIndexable?: boolean;
  isFallback?: boolean;
};

export type InsuranceSeoLocationPage = Pick<
  InsuranceSeoPageData,
  | "_id"
  | "insuranceType"
  | "insuranceTypeSlug"
  | "title"
  | "subtitle"
  | "canonicalPath"
  | "location"
> & {
  priority?: number;
  updatedAt?: string;
};

type ApiResponse<T> = {
  data?: T;
};

const getBaseUrl = () =>
  (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

const lowerKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const locationLabel = (location: ParsedLoanLocation) =>
  [location.area, location.pincode, location.city, location.state]
    .filter(Boolean)
    .join(", ");

const mergeLocation = (
  requested: ParsedLoanLocation,
  resolved?: Partial<ParsedLoanLocation>,
): ParsedLoanLocation => ({
  country: resolved?.country || requested.country || "India",
  state: resolved?.state || requested.state || "",
  city: resolved?.city || requested.city || "",
  pincode: resolved?.pincode || requested.pincode || "",
  area: resolved?.area || requested.area || "",
});

export const buildFallbackInsuranceSeoPage = (
  insuranceTypeSlug: string,
  location: ParsedLoanLocation,
): InsuranceSeoPageData => {
  const insuranceType = humanizeSlug(insuranceTypeSlug);
  const scoped = locationLabel(location)
    ? `${insuranceType} in ${locationLabel(location)}`
    : insuranceType;

  return {
    _id: `fallback-${insuranceTypeSlug}`,
    insuranceType,
    insuranceTypeSlug,
    title: scoped,
    subtitle:
      "Compare premium, coverage, documents, claim support, and partner plans.",
    heroTitle: `${insuranceType} Compare Plans`,
    heroDescription:
      "Get the right insurance plan with clear coverage, exclusions, documents, and claim support.",
    seoTitle: `${scoped} | Fintaraa`,
    seoDescription: `Compare ${scoped} plans with Fintaraa. Review premium, coverage, documents, claim process, and partner options.`,
    canonicalPath: buildLoanPath(insuranceTypeSlug, location),
    location,
    badges: ["Partner plans", "Claim assistance", "Secure enquiry"],
    filterKeys: ["coverage", "premium", "claims", "documents", "eligibility"],
    tabs: [
      {
        key: "coverage",
        label: "Coverage",
        title: "Understanding your coverage",
        description:
          "Review what is usually covered and what is excluded before choosing a plan.",
        covered: [
          "Hospitalisation or insured event as per policy wording.",
          "Pre and post event expenses where applicable.",
          "Cashless or reimbursement support with network partners.",
          "Emergency assistance and claim guidance.",
        ],
        notCovered: [
          "Waiting period exclusions.",
          "Non-disclosed pre-existing conditions.",
          "Cosmetic or non-covered procedures.",
          "Claims outside policy terms and limits.",
        ],
        filterKeys: ["coverage", "covered", "not_covered"],
        sortOrder: 1,
        isActive: true,
      },
      {
        key: "eligibility",
        label: "Eligibility",
        title: "Eligibility Criteria",
        description:
          "Eligibility depends on age, location, sum insured, declarations, and insurer policy.",
        bullets: [
          "Applicant age and valid KYC details.",
          "Current city, state, pincode, and area.",
          "Accurate health, asset, travel, or business declaration.",
          "Previous policy and claim history where required.",
        ],
        filterKeys: ["eligibility", "age", "sum_insured"],
        sortOrder: 2,
        isActive: true,
      },
      {
        key: "documents",
        label: "Documents",
        title: "Required Documents",
        description:
          "The exact document checklist varies by insurance category and partner policy.",
        bullets: [
          "Identity, contact, and address details.",
          "Previous policy copy for renewals.",
          "Health, asset, travel, or business documents as applicable.",
          "Claim documents where relevant.",
        ],
        filterKeys: ["documents", "kyc", "policy_copy"],
        sortOrder: 3,
        isActive: true,
      },
    ],
    formFields: [
      {
        key: "age",
        label: "Age of insured member",
        type: "number",
        placeholder: "Age",
        required: true,
        filterKey: "age",
        sortOrder: 1,
        isActive: true,
      },
      {
        key: "city",
        label: "City",
        type: "text",
        placeholder: "City",
        required: true,
        filterKey: "city",
        sortOrder: 2,
        isActive: true,
      },
      {
        key: "sumInsured",
        label: "Sum insured",
        type: "select",
        placeholder: "Select cover",
        options: ["3L", "5L", "10L", "25L", "50L"],
        required: true,
        filterKey: "sum_insured",
        sortOrder: 3,
        isActive: true,
      },
      {
        key: "mobile",
        label: "Mobile number",
        type: "tel",
        placeholder: "10-digit mobile",
        required: true,
        filterKey: "mobile",
        sortOrder: 4,
        isActive: true,
      },
    ],
    isIndexable: true,
    isFallback: true,
  };
};

export async function getInsuranceSeoPage(
  insuranceTypeSlug: string,
  location: ParsedLoanLocation,
): Promise<InsuranceSeoPageData> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return buildFallbackInsuranceSeoPage(insuranceTypeSlug, location);
  if (!(await isServerApiReachable(baseUrl))) {
    return buildFallbackInsuranceSeoPage(insuranceTypeSlug, location);
  }

  const params = new URLSearchParams();
  Object.entries(location).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  try {
    const response = await fetch(
      `${baseUrl}/insurance-pages/public/${insuranceTypeSlug}?${params.toString()}`,
      { next: { revalidate: 300 } },
    );
    if (!response.ok) throw new Error("Insurance page request failed");
    const payload = (await response.json()) as ApiResponse<InsuranceSeoPageData>;
    const data = payload.data;
    if (!data) throw new Error("Insurance page missing data");
    return {
      ...data,
      location: mergeLocation(location, data.location),
      tabs: (data.tabs || []).map((tab) => ({
        ...tab,
        key: lowerKey(tab.key || tab.label),
        filterKeys: (tab.filterKeys || []).map(lowerKey),
      })),
      formFields: (data.formFields || []).map((field) => ({
        ...field,
        filterKey: lowerKey(field.filterKey || field.key),
      })),
    };
  } catch {
    return buildFallbackInsuranceSeoPage(insuranceTypeSlug, location);
  }
}

export async function getInsuranceSeoLocationPages(
  insuranceTypeSlug: string,
): Promise<InsuranceSeoLocationPage[]> {
  const baseUrl = getBaseUrl();
  if (!baseUrl || !(await isServerApiReachable(baseUrl))) return [];

  const params = new URLSearchParams({
    insuranceTypeSlug,
    limit: "1000",
  });

  try {
    const response = await fetch(`${baseUrl}/insurance-pages/public?${params}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const payload = (await response.json()) as ApiResponse<
      InsuranceSeoLocationPage[]
    >;
    return Array.isArray(payload.data)
      ? payload.data.map((page) => ({
          ...page,
          location: mergeLocation(
            { country: "India", state: "", city: "", pincode: "", area: "" },
            page.location,
          ),
        }))
      : [];
  } catch {
    return [];
  }
}
