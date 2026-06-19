import { Fetch, Post } from "@/hooks/apiUtils";

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string;
};

export type CreditCardProduct = {
  _id: string;
  id?: string;
  name: string;
  title?: string;
  subtitle?: string;
  shortDescription?: string;
  bankName: string;
  type?: string;
  image?: string;
  link?: string;
  applyUrl?: string;
  annualFee?: number | string;
  joiningFee?: number | string;
  cardType?: string;
  rewardsType?: string;
  annualFeeBucket?: string;
  incomeRequirementBucket?: string;
  welcomeBenefits?: string;
  rewardStructure?: string;
  cashbackDetails?: string;
  loungeAccess?: string;
  loungeAccessAvailable?: boolean;
  fuelBenefits?: string;
  movieBenefits?: string;
  travelBenefits?: string;
  insuranceBenefits?: string;
  eligibilityCriteria?: string[];
  eligibilityTermsAndConditions?: string[];
  minimumIncome?: number | string;
  creditScoreRequirement?: number | string;
  processingTime?: string;
  cardNetwork?: string;
  featuresList?: string[];
  termsAndConditions?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  featured?: boolean;
  priorityOrder?: number;
};

export type CreditCardFilters = {
  banks: string[];
  cardTypes: string[];
  rewardsTypes: string[];
  networks: string[];
  annualFeeBuckets: string[];
  incomeBuckets: string[];
};

export type EligibilityBreakdown = {
  eligible: boolean;
  score: number;
  message: string;
  checks: Array<{
    key: string;
    label: string;
    required?: number;
    current?: number;
    passed: boolean;
  }>;
};

const unwrap = <T>(response: ApiEnvelope<T> | T): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }
  return response as T;
};

const normalizeList = <T>(payload: unknown): T[] => {
  const data = unwrap(payload as ApiEnvelope<unknown>);
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object" && Array.isArray((data as any).result)) {
    return (data as any).result as T[];
  }
  return [];
};

export const fetchCreditCards = async () => {
  const response = await Fetch<ApiEnvelope<unknown>>(
    "bank-products/public",
    { type: "credit_card", pagination: false },
    15000,
    true,
    false,
  );
  return normalizeList<CreditCardProduct>(response);
};

export const fetchCreditCardFilters = async () => {
  const response = await Fetch<ApiEnvelope<CreditCardFilters>>(
    "bank-products/public/filters",
    { type: "credit_card" },
    15000,
    true,
    false,
  );
  return (
    unwrap(response) || {
      banks: [],
      cardTypes: [],
      rewardsTypes: [],
      networks: [],
      annualFeeBuckets: [],
      incomeBuckets: [],
    }
  );
};

export const trackBankProductClick = (id: string, action: "apply" | "detail") =>
  Post<ApiEnvelope<{ ok: boolean }>>(
    `bank-products/public/${id}/click`,
    { action },
    10000,
    true,
  );

export const fetchCreditCardEligibility = async (id: string) => {
  const response = await Fetch<ApiEnvelope<EligibilityBreakdown>>(
    `bank-products/public/${id}/eligibility`,
    undefined,
    15000,
    true,
    false,
  );
  return unwrap(response);
};
