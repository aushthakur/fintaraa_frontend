import { Fetch, Post } from "@/hooks/apiUtils";

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string;
};

export type OfferRecord = {
  _id: string;
  title: string;
  lenderName: string;
  productType?: string;
  productCategory?: "loan" | "insurance" | "card";
  rateLabel?: string;
  tenureLabel?: string;
  amountLabel?: string;
  badge?: string;
  description?: string;
  eligibilityCriteria?: string[];
  termsAndConditions?: string[];
  ctaText?: string;
  status?: "draft" | "active" | "expired";
  tags?: string[];
  validFrom?: string;
  validTo?: string;
  eligibility?: Record<string, unknown>;
};

export type EligibleOffersResponse = {
  offers: OfferRecord[];
  snapshot?: {
    age?: number;
    city?: string;
    state?: string;
    totalEmi?: number;
    creditScore?: number;
    monthlyIncome?: number;
    activeObligations?: number;
    employmentType?: string;
    emiToIncomeRatio?: number | null;
  };
};

const unwrap = <T>(response: ApiEnvelope<T> | T): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }
  return response as T;
};

const normalizeList = (payload: unknown): OfferRecord[] => {
  const data = unwrap(payload as ApiEnvelope<unknown>);
  if (Array.isArray(data)) return data as OfferRecord[];
  if (data && typeof data === "object" && Array.isArray((data as any).offers)) {
    return (data as any).offers as OfferRecord[];
  }
  if (data && typeof data === "object" && Array.isArray((data as any).result)) {
    return (data as any).result as OfferRecord[];
  }
  return [];
};

export const fetchPublicOffers = async (params?: {
  productCategory?: string;
  productType?: string;
  limit?: number;
}) => {
  const response = await Fetch<ApiEnvelope<OfferRecord[]>>(
    "offers/public",
    {
      limit: params?.limit || 50,
      ...(params?.productCategory ? { productCategory: params.productCategory } : {}),
      ...(params?.productType ? { productType: params.productType } : {}),
    },
    15000,
    true,
    false,
  );
  return normalizeList(response);
};

export const fetchEligibleOffers = async () => {
  const response = await Fetch<ApiEnvelope<EligibleOffersResponse>>(
    "offers/eligible",
    undefined,
    15000,
    true,
    false,
  );
  const data = unwrap(response);
  return {
    offers: normalizeList(data),
    snapshot: (data as EligibleOffersResponse)?.snapshot,
  };
};

export const applyForOffer = async (
  id: string,
  payload?: { notes?: string; metadata?: Record<string, unknown> },
) => {
  const response = await Post<ApiEnvelope<{ offerId: string }>>(
    `offers/${encodeURIComponent(id)}/apply`,
    {
      status: "applied",
      ...(payload || {}),
    },
    15000,
    true,
  );
  return unwrap(response);
};
