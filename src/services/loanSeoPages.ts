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

export type LoanSeoLocationPage = Pick<
  LoanSeoPageData,
  | "_id"
  | "loanType"
  | "loanTypeSlug"
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
    filterKeys: [
      "overview",
      "features",
      "eligibility",
      "documents",
      "steps_to_apply",
      "emi_calculator",
      "fees_and_charges",
      "reviews",
      "faqs",
    ],
    tabs: [
      {
        key: "overview",
        label: "Overview",
        eyebrow: "Loan guide",
        title: `${scoped} overview`,
        description:
          "Use this complete view to understand the loan journey before you submit an application.",
        bullets: [
          "Compare eligibility, documents, EMI, fees, reviews, and FAQs together.",
          "Understand the assisted steps before you start the application.",
          "Prepare KYC, income, and bank details before applying.",
        ],
        stats: [
          { label: "Journey", value: "Digital" },
          { label: "Support", value: "Assisted" },
          { label: "Security", value: "Encrypted" },
        ],
        filterKeys: ["overview", "complete_guide", "loan_guide"],
        sortOrder: 0,
        isActive: true,
      },
      {
        key: "features",
        label: "Features",
        eyebrow: "Highlights",
        title: `${loanType} features`,
        description:
          "Key features depend on lender policy, applicant profile, loan amount, and the selected repayment tenure.",
        bullets: [
          "Digital discovery with guided application support.",
          "Flexible amount and tenure options from eligible partners.",
          "Partner-specific collateral or asset checks where applicable.",
          "Transparent next steps for documentation and verification.",
        ],
        filterKeys: ["features", "benefits"],
        sortOrder: 2,
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
        sortOrder: 3,
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
        sortOrder: 4,
        isActive: true,
      },
      {
        key: "steps_to_apply",
        label: "Steps to Apply",
        eyebrow: "Application process",
        title: `Steps to apply for ${scoped}`,
        description:
          "Follow the guided Fintaraa journey to share details, verify your mobile number, review matched options, and submit documents.",
        bullets: [
          "Start with mobile number, PAN, income, and location details.",
          "Verify OTP and complete the secure assisted application flow.",
          "Review matched partner options before document submission.",
          "Upload requested documents and track follow-up with Fintaraa support.",
        ],
        filterKeys: ["steps_to_apply", "apply", "process", "verification"],
        sortOrder: 5,
        isActive: true,
      },
      {
        key: "emi_calculator",
        label: "EMI Calculator",
        eyebrow: "Repayment view",
        title: `${loanType} EMI planning`,
        description:
          "Estimate EMI comfort before applying by reviewing the loan amount, tenure, and expected interest range.",
        bullets: [
          "Compare monthly EMI against your income and existing obligations.",
          "Shorter tenures can reduce total interest but increase EMI.",
          "Longer tenures can reduce monthly EMI but increase total repayment.",
        ],
        filterKeys: ["emi_calculator", "emi", "repayment"],
        sortOrder: 6,
        isActive: true,
      },
      {
        key: "fees_and_charges",
        label: "Fees & Charges",
        eyebrow: "Cost view",
        title: `${loanType} fees and charges`,
        description:
          "Review interest rate, processing fee, tenure, foreclosure charges, and total repayment before applying.",
        bullets: [
          "Compare EMI comfort and repayment tenure.",
          "Check processing and prepayment terms.",
          "Avoid duplicate applications with multiple lenders.",
        ],
        filterKeys: ["fees", "emi", "repayment"],
        sortOrder: 7,
        isActive: true,
      },
      {
        key: "reviews",
        label: "Reviews",
        eyebrow: "Customer view",
        title: `${loanType} customer reviews`,
        description:
          "Customer experiences can vary by lender, document readiness, and approval policy, but guided support helps keep the process organised.",
        bullets: [
          "Applicants value clear document checklists before lender review.",
          "Guided callbacks help reduce back-and-forth during verification.",
          "EMI and fee visibility helps users compare options more carefully.",
        ],
        filterKeys: ["reviews", "testimonials"],
        sortOrder: 8,
        isActive: true,
      },
      {
        key: "faqs",
        label: "FAQs",
        eyebrow: "Common questions",
        title: `FAQs about ${scoped}`,
        description: `Find answers to common questions about ${loanType}.`,
        bullets: [
          "Quick answers to the most common questions.",
          "Learn about eligibility, documents, and process.",
          "Get clarity before you apply.",
        ],
        faqs: [
          {
            question: `What is the minimum income required for ${loanType}?`,
            answer:
              "Income requirements vary by lender and loan amount. Generally, a stable monthly income or business cash flow is required. Our team will help match you with suitable options during application.",
          },
          {
            question: `How long does ${loanType} approval take?`,
            answer:
              "Approval timelines depend on document verification and lender processing. With complete documents and a strong profile, some applications can be processed within 24-48 hours.",
          },
          {
            question: `Can I apply for ${loanType} with a low credit score?`,
            answer:
              "While a higher credit score improves approval chances, some lenders may consider applications with lower scores based on other factors like income stability and existing relationships.",
          },
        ],
        filterKeys: ["faqs", "questions"],
        sortOrder: 9,
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
    return buildFallbackLoanSeoPage(loanTypeSlug, location);
  }
}

export async function getLoanSeoLocationPages(
  loanTypeSlug: string,
): Promise<LoanSeoLocationPage[]> {
  const baseUrl = getBaseUrl();
  if (!baseUrl || !(await isServerApiReachable(baseUrl))) return [];

  const params = new URLSearchParams({
    loanTypeSlug,
    limit: "1000",
  });

  try {
    const response = await fetch(`${baseUrl}/loan-pages/public?${params}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const payload = (await response.json()) as ApiResponse<LoanSeoLocationPage[]>;
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
