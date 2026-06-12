import {
  buildLoanPath,
  humanizeSlug,
  type ParsedLoanLocation,
} from "@/lib/productRouting";
import { isServerApiReachable } from "./serverApiAvailability";

export type LoanSeoStat = {
  label: string;
  value: string;
};

export type LoanSeoFaq = {
  question: string;
  answer: string;
};

export type LoanSeoTab = {
  key: string;
  label: string;
  eyebrow?: string;
  title: string;
  description?: string;
  bullets?: string[];
  content?: string[];
  stats?: LoanSeoStat[];
  faqs?: LoanSeoFaq[];
  filterKeys?: string[];
  sortOrder?: number;
  isActive?: boolean;
};

export type LoanSeoFormField = {
  key: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  tabKey?: string;
  filterKey?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type LoanSeoPageData = {
  _id?: string;
  loanType: string;
  loanTypeSlug: string;
  title: string;
  subtitle?: string;
  heroTitle?: string;
  heroDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalPath?: string;
  location?: ParsedLoanLocation;
  tabs: LoanSeoTab[];
  formFields: LoanSeoFormField[];
  filterKeys?: string[];
  badges?: string[];
  isIndexable?: boolean;
  isFallback?: boolean;
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

export const buildFallbackLoanSeoPage = (
  loanTypeSlug: string,
  location: ParsedLoanLocation,
): LoanSeoPageData => {
  const loanType = humanizeSlug(loanTypeSlug);
  const scoped = locationLabel(location)
    ? `${loanType} in ${locationLabel(location)}`
    : loanType;

  return {
    _id: `fallback-${loanTypeSlug}`,
    loanType,
    loanTypeSlug,
    title: scoped,
    subtitle:
      "Compare eligibility, documents, repayment terms, and partner-backed offers with guided assistance.",
    heroTitle: `${scoped} made easier`,
    heroDescription:
      "Review requirements, prepare documents, and apply through Fintaraa's secure assisted loan journey.",
    seoTitle: `${scoped} | Fintaraa`,
    seoDescription: `Apply for ${scoped} with Fintaraa. Check eligibility, document requirements, EMI comfort, and assisted partner offers.`,
    canonicalPath: buildLoanPath(loanTypeSlug, location),
    location,
    badges: ["Secure profile", "Partner-backed", "Assisted application"],
    filterKeys: ["overview", "eligibility", "documents", "fees", "apply"],
    tabs: [
      {
        key: "overview",
        label: "Overview",
        eyebrow: "Loan guide",
        title: `${scoped} overview`,
        description:
          "Use this page to understand the loan journey before you submit a complete application.",
        bullets: [
          "Compare eligibility signals and document requirements.",
          "Prepare KYC, income, and bank details before applying.",
          "Continue to the Fintaraa application flow when ready.",
        ],
        stats: [
          { label: "Journey", value: "Digital" },
          { label: "Support", value: "Assisted" },
          { label: "Security", value: "Encrypted" },
        ],
        filterKeys: ["overview", "loan_guide"],
        sortOrder: 1,
        isActive: true,
      },
      {
        key: "eligibility",
        label: "Eligibility",
        eyebrow: "Applicant fit",
        title: `${loanType} eligibility`,
        description:
          "Eligibility can vary by lender, amount, location, credit profile, and income source.",
        bullets: [
          "PAN, Aadhaar, mobile, and basic profile details.",
          "Income, employment, or business proof.",
          "Credit history and current EMI obligations.",
        ],
        filterKeys: ["eligibility", "income", "cibil"],
        sortOrder: 2,
        isActive: true,
      },
      {
        key: "documents",
        label: "Documents",
        eyebrow: "Checklist",
        title: `Documents for ${scoped}`,
        description:
          "The final document list depends on lender and applicant profile, but these documents are commonly requested.",
        bullets: [
          "Identity and address proof.",
          "PAN and recent photograph.",
          "Bank statement and income proof where applicable.",
        ],
        filterKeys: ["documents", "kyc", "income_proof"],
        sortOrder: 3,
        isActive: true,
      },
      {
        key: "fees",
        label: "Fees",
        eyebrow: "Cost view",
        title: `${loanType} charges`,
        description:
          "Review interest rate, processing fee, tenure, foreclosure charges, and total repayment before applying.",
        bullets: [
          "Compare EMI comfort and repayment tenure.",
          "Check processing and prepayment terms.",
          "Avoid duplicate applications with multiple lenders.",
        ],
        filterKeys: ["fees", "emi", "repayment"],
        sortOrder: 4,
        isActive: true,
      },
    ],
    formFields: [
      {
        key: "fullName",
        label: "Full name",
        type: "text",
        placeholder: "Enter your full name",
        required: true,
        filterKey: "full_name",
        sortOrder: 1,
        isActive: true,
      },
      {
        key: "mobile",
        label: "Mobile number",
        type: "tel",
        placeholder: "10-digit mobile number",
        required: true,
        filterKey: "mobile",
        sortOrder: 2,
        isActive: true,
      },
      {
        key: "loanAmount",
        label: "Loan amount",
        type: "number",
        placeholder: "Required amount",
        required: true,
        filterKey: "loan_amount",
        sortOrder: 3,
        isActive: true,
      },
      {
        key: "employmentType",
        label: "Employment type",
        type: "select",
        options: ["Salaried", "Self-employed professional", "Business owner"],
        required: true,
        filterKey: "employment_type",
        sortOrder: 4,
        isActive: true,
      },
      {
        key: "pincode",
        label: "Pincode",
        type: "text",
        placeholder: "Service pincode",
        required: true,
        filterKey: "pincode",
        sortOrder: 5,
        isActive: true,
      },
    ],
    isIndexable: true,
    isFallback: true,
  };
};

export async function getLoanSeoPage(
  loanTypeSlug: string,
  location: ParsedLoanLocation,
): Promise<LoanSeoPageData> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return buildFallbackLoanSeoPage(loanTypeSlug, location);
  if (!(await isServerApiReachable(baseUrl))) {
    return buildFallbackLoanSeoPage(loanTypeSlug, location);
  }

  const params = new URLSearchParams();
  Object.entries(location).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  try {
    const response = await fetch(
      `${baseUrl}/loan-pages/public/${loanTypeSlug}?${params.toString()}`,
      { next: { revalidate: 300 } },
    );
    if (!response.ok) throw new Error("Loan page request failed");
    const payload = (await response.json()) as ApiResponse<LoanSeoPageData>;
    const data = payload.data;
    if (!data) throw new Error("Loan page missing data");
    return {
      ...data,
      location: {
        ...location,
        ...(data.location || {}),
      },
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
    return buildFallbackLoanSeoPage(loanTypeSlug, location);
  }
}
