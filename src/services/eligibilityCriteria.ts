import { slugifyProduct } from "@/lib/productRouting";
import { buildApiUrl } from "./apiUrl";
import { isServerApiReachable } from "./serverApiAvailability";

export type EligibilityTerm = {
  label: string;
  value: string;
};

export type EligibilityCheck = {
  label: string;
  requirement: string;
  provided: string;
  passed: boolean;
};

export type EligibilityCriteriaResult = {
  _id: string;
  loanType: string;
  bankName: string;
  salaryType: string;
  cibilScore?: number;
  roi?: number;
  processingFees?: number;
  loginFees?: string;
  insurance?: string;
  minAge?: number;
  maxAge?: number;
  maxTenureYears?: number;
  maximumLoanAmount?: number;
  companyCategory?: string[];
  remarks?: string;
  eligible: boolean;
  matchScore: number;
  checks: EligibilityCheck[];
  terms: EligibilityTerm[];
};

export type EligibilitySearchParams = {
  loanType?: string;
  amount?: string | number;
  salaryType?: string;
  cibilScore?: string | number;
  tenureYears?: string | number;
  bank?: string;
  q?: string;
  limit?: string | number;
};

export type EligibilitySearchResponse = {
  filters: {
    loanType?: string;
    salaryType?: string;
    amount?: number | null;
    cibilScore?: number | null;
    tenureYears?: number | null;
    bank?: string;
    q?: string;
  };
  total: number;
  eligibleCount: number;
  results: EligibilityCriteriaResult[];
};

type ApiResponse<T> = {
  data?: T;
};

const emptyEligibilityResponse: EligibilitySearchResponse = {
  filters: {},
  total: 0,
  eligibleCount: 0,
  results: [],
};

const getBaseUrl = () =>
  (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

export const loanTypeToSlug = (value: string) =>
  slugifyProduct(value.replace(/([a-z])([A-Z])/g, "$1 $2"));

export const loanTypeToLabel = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export async function searchEligibilityCriteria(
  params: EligibilitySearchParams,
): Promise<EligibilitySearchResponse> {
  const baseUrl = getBaseUrl();
  if (!baseUrl || !(await isServerApiReachable(baseUrl))) {
    return emptyEligibilityResponse;
  }

  const apiUrl = buildApiUrl("/eligibility-criteria/public/search");
  if (!apiUrl) return emptyEligibilityResponse;

  const url = new URL(apiUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) return emptyEligibilityResponse;
    const json = (await response.json()) as ApiResponse<EligibilitySearchResponse>;
    return json.data || emptyEligibilityResponse;
  } catch {
    return emptyEligibilityResponse;
  }
}
