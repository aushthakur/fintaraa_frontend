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

export const slugifyCreditCardValue = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getCreditCardId = (card: Partial<CreditCardProduct>) =>
  card._id || card.id || "";

export const buildCreditCardBankPath = (bankName: string) =>
  `/credit-cards/${slugifyCreditCardValue(bankName)}`;

export const buildCreditCardTypePath = (bankName: string, cardType?: string) =>
  `${buildCreditCardBankPath(bankName)}/${slugifyCreditCardValue(
    cardType || "credit-card",
  )}`;

export const buildCreditCardDetailPath = (card: CreditCardProduct) => {
  const id = getCreditCardId(card);
  const cardSlug = [slugifyCreditCardValue(card.name), id].filter(Boolean).join("-");
  return `${buildCreditCardTypePath(card.bankName, card.cardType)}/${cardSlug}`;
};

export const buildCreditCardEligibilityPath = (card: CreditCardProduct) =>
  `${buildCreditCardDetailPath(card)}/eligibility`;

const creditCardBankApplyUrls: Record<string, string> = {
  "sbi-card": "https://www.sbicard.com/en/personal/credit-cards.page",
  "state-bank-of-india": "https://www.sbicard.com/en/personal/credit-cards.page",
  "hdfc-bank": "https://www.hdfcbank.com/personal/pay/cards/credit-cards",
  "icici-bank": "https://www.icicibank.com/personal-banking/cards/credit-card",
  "axis-bank": "https://www.axisbank.com/retail/cards/credit-card",
  "kotak-mahindra-bank":
    "https://www.kotak.com/en/personal-banking/cards/credit-cards.html",
  "indusind-bank": "https://www.indusind.com/in/en/personal/cards/credit-card.html",
  "idfc-first-bank": "https://www.idfcfirstbank.com/credit-card",
};

export const getCreditCardBankApplyUrl = (bankName?: string) =>
  creditCardBankApplyUrls[slugifyCreditCardValue(bankName)] || "";

const normalizeCreditCardApplyUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) return trimmed;
  if (/^(www\.|[a-z0-9-]+\.[a-z]{2,})(\/|$)/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

export const getCreditCardApplyUrl = (
  card: Partial<CreditCardProduct>,
  fallback = "/credit-cards",
) =>
  normalizeCreditCardApplyUrl(
    String(
      card.applyUrl ||
        card.link ||
        getCreditCardBankApplyUrl(card.bankName) ||
        fallback,
    ),
  );

export const parseCreditCardIdFromSlug = (segment = "") => {
  const decoded = decodeURIComponent(segment);
  const match = decoded.match(/([a-f0-9]{24})$/i);
  return match?.[1] || decoded;
};

export const isSameCreditCardBank = (bankSlug: string, bankName: string) =>
  slugifyCreditCardValue(bankSlug) === slugifyCreditCardValue(bankName);

export const isSameCreditCardType = (typeSlug: string, cardType?: string) => {
  if (!typeSlug) return true;
  const normalized = slugifyCreditCardValue(cardType || "credit-card");
  const requested = slugifyCreditCardValue(typeSlug);
  return (
    normalized === requested ||
    normalized.includes(requested) ||
    requested.includes(normalized)
  );
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

export const fetchCreditCardById = async (id: string) => {
  const response = await Fetch<ApiEnvelope<CreditCardProduct>>(
    `bank-products/public/${id}`,
    undefined,
    15000,
    true,
    false,
  );
  return unwrap(response);
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
