"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BadgeIndianRupee,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileCheck2,
  Landmark,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
  TrendingDown,
  Lock,
  RefreshCw,
  Star,
  IndianRupee,
  Timer,
  Fingerprint,
  CreditCard,
  CircleCheck,
  MessageCircle,
  Building2,
  Percent,
  BarChart3,
  HeartHandshake,
  AlertTriangle,
  CheckCheck,
  X,
} from "lucide-react";
import {
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { getApplyHref } from "@/components/application/flowRegistry";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { WhatsAppConsent } from "@/components/common/WhatsAppConsent";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { CreditScoreSection } from "@/components/home/CreditScoreSection";
import { ProductLocationDirectory } from "@/components/products/ProductLocationDirectory";
import { ProductRelatedBlogs } from "@/components/products/ProductRelatedBlogs";
import { LoanFAQSection } from "@/components/products/loan-detail/LoanFAQSection";
import { LoanStatsBar } from "@/components/products/loan-detail/LoanStatsBar";
import { buildWebsiteConsentPayload } from "@/lib/formConsent";
import { buildApiUrl } from "@/services/apiUrl";
import type {
  LoanSeoLocationPage,
  LoanSeoPageData,
} from "@/services/loanSeoPages";
import type { BankProductLender } from "@/services/bankSeoPages";

const getBankLogoPath = (slug?: string, bankName?: string) => {
  const s = ((slug || "") + " " + (bankName || "")).toLowerCase();
  if (s.includes("hdfc")) return "/assets/banks/HDFC-Bank.png";
  if (s.includes("icici")) return "/assets/banks/ICICI-Bank.png";
  if (s.includes("axis")) return "/assets/banks/axis-bank.png";
  if (s.includes("sbi") || s.includes("state-bank") || s.includes("state bank"))
    return "/assets/banks/State-Bank-of-India.png";
  if (s.includes("kotak")) return "/assets/banks/Kotak-Mahindra-Bank.png";
  if (s.includes("bajaj")) return "/assets/banks/bajaj-finserv.png";
  if (s.includes("baroda")) return "/assets/banks/Bank-of-Baroda.png";
  if (s.includes("indusind")) return "/assets/banks/IndusInd-Bank.png";
  if (s.includes("federal")) return "/assets/banks/Federal-Bank.png";
  if (s.includes("pnb") || s.includes("punjab"))
    return "/assets/banks/Punjab-National-Bank.png";
  if (s.includes("canara")) return "/assets/banks/canara-bank.png";
  if (s.includes("union")) return "/assets/banks/union-bank.png";
  if (s.includes("idfc")) return "/assets/banks/idfc.png";
  if (s.includes("yes")) return "/assets/banks/yes-bank.png";
  return "/assets/banks/hdfc.png";
};

type LeadFormState = {
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  loanAmount: string;
  employmentType: string;
  preferredLender: string;
};

type LeadFormErrors = Partial<
  Record<keyof LeadFormState | "whatsappConsent", string>
>;

const initialLeadForm: LeadFormState = {
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  loanAmount: "",
  employmentType: "",
  preferredLender: "",
};

const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;
const mobileRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const cityRegex = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;

const loanAmountOptions = [
  "Up to Rs 50,000",
  "Rs 50,001 - Rs 1 lakh",
  "Rs 1 lakh - Rs 3 lakh",
  "Rs 3 lakh - Rs 5 lakh",
  "Above Rs 5 lakh",
];

const employmentOptions = ["Salaried", "Self-employed", "Business owner"];
const lendersPerPage = 6;

const dedupeLenders = (lenders: BankProductLender[]) => {
  const unique = new Map<string, BankProductLender>();
  lenders.forEach((lender) => {
    const key = lender.bankSlug || lender.bankName.toLowerCase();
    if (!unique.has(key)) unique.set(key, lender);
  });
  const all = Array.from(unique.values());
  // Lenders with logos appear first, then alpha-sorted within each group
  const withLogo = all.filter((l) => l.logoUrl).sort((a, b) => a.bankName.localeCompare(b.bankName));
  const noLogo = all.filter((l) => !l.logoUrl).sort((a, b) => a.bankName.localeCompare(b.bankName));
  return [...withLogo, ...noLogo];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const coreAdvantages = [
  {
    icon: Zap,
    headline: "Disbursal in under 4 hours",
    body: "From approval to your bank account in a single working session. No branch queues, no physical paperwork.",
    stat: "4 hrs",
    accent: "#7c3aed",
  },
  {
    icon: TrendingDown,
    headline: "Rates starting at 10.49% p.a.",
    body: "Reducing balance interest means you save more every month as your principal shrinks — unlike flat-rate traps.",
    stat: "10.49%",
    accent: "#0ea5e9",
  },
  {
    icon: Lock,
    headline: "Zero collateral, ever",
    body: "No gold, no property deed, no guarantor. Your income profile is all we assess — nothing more.",
    stat: "0 pledge",
    accent: "#10b981",
  },
  {
    icon: RefreshCw,
    headline: "Flexible tenure up to 7 years",
    body: "Pick any repayment horizon from 12 to 84 months. Adjust your EMI to fit your monthly cash flow.",
    stat: "84 mos",
    accent: "#f59e0b",
  },
];

const whyInstantLoan = [
  {
    number: "01",
    title: "When time is the constraint",
    desc: "Medical emergencies, urgent travel, or an unexpected expense that cannot wait for weeks of bank bureaucracy. Instant personal loans bridge the gap between a financial event and its resolution — within hours, not weeks.",
    icon: Timer,
  },
  {
    number: "02",
    title: "When collateral is not an option",
    desc: "Not everyone has gold jewelry, property documents, or FD receipts ready to pledge. An unsecured instant loan requires nothing except proof of income and a clean credit history.",
    icon: Fingerprint,
  },
  {
    number: "03",
    title: "When your credit score works in your favour",
    desc: "A CIBIL score of 700 or above qualifies you for preferential interest rates across our 50+ partner lenders. Your credit discipline is your strongest negotiating tool.",
    icon: BarChart3,
  },
  {
    number: "04",
    title: "When you want to protect existing investments",
    desc: "Breaking a mutual fund or fixed deposit means losing compounding returns. An instant loan lets your investments keep working while you manage an immediate need.",
    icon: CreditCard,
  },
];

const useCases = [
  {
    title: "Wedding & celebrations",
    amount: "Up to 20 Lakhs",
    timeline: "Funds in 24 hours",
    rate: "From 10.49%",
    desc: "Reserve venues, pay vendors, and cover hospitality without liquidating investments or straining savings accumulated over years.",
  },
  {
    title: "Medical emergency",
    amount: "Up to 50 Lakhs",
    timeline: "Emergency disbursal",
    rate: "From 10.49%",
    desc: "When insurance sub-limits fall short of actual hospital bills, a personal loan ensures treatment proceeds without negotiation delays.",
  },
  {
    title: "Home renovation",
    amount: "Up to 40 Lakhs",
    timeline: "Funds in 48 hours",
    rate: "From 10.99%",
    desc: "Upgrade interiors, repair structural issues, or install modern fixtures without disrupting your home loan EMI obligations.",
  },
  {
    title: "Debt consolidation",
    amount: "Up to 30 Lakhs",
    timeline: "Settle within 5 days",
    rate: "From 10.75%",
    desc: "Replace multiple high-interest credit card balances and personal debts with a single lower-rate loan and one manageable EMI.",
  },
  {
    title: "Higher education",
    amount: "Up to 15 Lakhs",
    timeline: "Before admission deadline",
    rate: "From 11.25%",
    desc: "Cover tuition, accommodation, and course material costs for professional certification programs or overseas preparation.",
  },
  {
    title: "Business working capital",
    amount: "Up to 50 Lakhs",
    timeline: "Funds in 48 hours",
    rate: "From 12.00%",
    desc: "Bridge receivable gaps, stock inventory ahead of peak season, or manage short-term cash flow without diluting equity.",
  },
];

const eligibilityCriteria = {
  salaried: [
    { label: "Age", value: "21 to 60 years" },
    { label: "Monthly income", value: "Minimum Rs 15,000 net salary" },
    { label: "Employment", value: "At least 6 months with current employer" },
    { label: "CIBIL score", value: "700 or above (preferred)" },
    { label: "Work experience", value: "Minimum 1 year total experience" },
    { label: "Residency", value: "Indian citizen, resident in India" },
  ],
  selfEmployed: [
    { label: "Age", value: "25 to 65 years" },
    { label: "Annual turnover", value: "Minimum Rs 2 lakh per annum" },
    { label: "Business vintage", value: "At least 2 years in operation" },
    { label: "CIBIL score", value: "720 or above (preferred)" },
    { label: "ITR filing", value: "Last 2 years filed and audited" },
    { label: "Residency", value: "Indian citizen, resident in India" },
  ],
};

const documents = [
  {
    category: "Identity proof",
    items: ["Aadhaar card (e-KYC via DigiLocker)", "PAN card (mandatory for all loans)"],
  },
  {
    category: "Income proof — salaried",
    items: [
      "Last 3 months salary slips",
      "Latest 6 months bank statement",
      "Form 16 or ITR (for higher amounts)",
    ],
  },
  {
    category: "Income proof — self-employed",
    items: [
      "Last 2 years ITR with computation",
      "CA-certified Profit & Loss statement",
      "Latest 12 months business bank statement",
    ],
  },
  {
    category: "Address proof",
    items: [
      "Aadhaar card (serves as address proof)",
      "Utility bill, rent agreement, or passport",
    ],
  },
];

const rateFactors = [
  {
    factor: "CIBIL score above 750",
    impact: "Lowest rate tier",
    direction: "positive",
  },
  {
    factor: "Stable employment — Tier 1 company",
    impact: "Preferential rate",
    direction: "positive",
  },
  {
    factor: "Existing relationship with lender",
    impact: "Pre-approved offer",
    direction: "positive",
  },
  {
    factor: "CIBIL score below 650",
    impact: "Higher rate or rejection",
    direction: "negative",
  },
  {
    factor: "Multiple active loans",
    impact: "Reduced eligibility",
    direction: "negative",
  },
  {
    factor: "Irregular income deposits",
    impact: "Lower sanction amount",
    direction: "negative",
  },
];

const instantVsTraditional = [
  { aspect: "Disbursement time", instant: "4 to 24 hours", traditional: "7 to 21 working days" },
  { aspect: "Physical branch visit", instant: "Not required", traditional: "Mandatory in most cases" },
  { aspect: "Document submission", instant: "Fully digital", traditional: "Physical photocopies needed" },
  { aspect: "Collateral requirement", instant: "Zero", traditional: "May be required" },
  { aspect: "Application mode", instant: "App or website, 10 mins", traditional: "Branch forms, hours" },
  { aspect: "Processing fee", instant: "0.5 to 2% of loan", traditional: "1 to 3% of loan" },
];

const misconceptions = [
  {
    myth: "Instant loans always charge much higher interest than bank loans",
    reality:
      "When applied through an RBI-regulated marketplace like Fintaraa, interest rates on instant personal loans start from 10.49% p.a. — comparable to many traditional bank products — because you are accessing verified partner lenders with competitive rate structures.",
  },
  {
    myth: "Applying for an instant loan harms your CIBIL score",
    reality:
      "Fintaraa performs only a soft credit inquiry during initial eligibility check, which leaves zero footprint on your bureau report. A hard inquiry occurs only when a lender formally processes your selected application.",
  },
  {
    myth: "Instant personal loans are only for small amounts",
    reality:
      "Through Fintaraa's partner network, you can access instant personal loans from Rs 10,000 up to Rs 1 Crore, subject to your income, CIBIL score, employer tier, and the underwriting criteria of the selected lender.",
  },
  {
    myth: "You need an existing relationship with the bank to qualify",
    reality:
      "Our marketplace includes 50+ lenders, many of which offer competitive instant loan products to new customers with strong income profiles and CIBIL scores above 700, regardless of any prior account relationship.",
  },
];

const journeySteps = [
  {
    step: "01",
    title: "Share your requirement",
    desc: "Enter your loan amount, employment type, and city. Takes under 90 seconds.",
    icon: FileCheck2,
    duration: "90 seconds",
  },
  {
    step: "02",
    title: "Compare matched lenders",
    desc: "Review indicative interest rates, processing fees, and maximum sanction amounts from partner banks.",
    icon: BarChart3,
    duration: "Your choice",
  },
  {
    step: "03",
    title: "Receive expert callback",
    desc: "A dedicated Fintaraa loan advisor calls you to confirm eligibility and guide the application.",
    icon: Phone,
    duration: "Within 2 hours",
  },
  {
    step: "04",
    title: "Complete digital verification",
    desc: "Submit documents via DigiLocker e-KYC. No branch visit, no physical paperwork.",
    icon: Fingerprint,
    duration: "3 to 5 minutes",
  },
];

const faqsStatic = [
  {
    question: "What is the minimum CIBIL score required for an instant personal loan?",
    answer:
      "Most lenders in our network prefer a CIBIL score of 700 or above for salaried applicants and 720 or above for self-employed professionals. However, requirements vary by lender. Applicants with lower scores may still qualify with strong income documentation or by selecting lenders with more flexible underwriting criteria.",
  },
  {
    question: "How quickly will the loan amount be credited to my bank account?",
    answer:
      "For eligible applicants with completed digital KYC and verified bank statements, disbursal typically occurs within 4 to 24 hours of final lender approval. Complex cases or applications requiring additional document review may take 2 to 3 working days.",
  },
  {
    question: "Can I prepay or foreclose my instant personal loan before the tenure ends?",
    answer:
      "Yes. Most partner lenders permit part-prepayment and foreclosure after a mandatory lock-in period of 12 to 24 EMIs. Some lenders charge a nominal foreclosure fee of 2 to 5% of the outstanding principal, while select banks offer zero prepayment charges. Your Fintaraa advisor will clarify the specific terms before you sign.",
  },
  {
    question: "Is my personal and financial data safe on the Fintaraa platform?",
    answer:
      "Fintaraa employs 256-bit SSL encryption for all data transmissions. We are compliant with the Digital Personal Data Protection Act (DPDPA) 2023 and share your information only with the lender you select and consent to. We do not sell user data to third parties.",
  },
  {
    question: "What is the difference between a soft credit check and a hard enquiry?",
    answer:
      "A soft credit check, which Fintaraa performs during eligibility matching, is an internal review that does not appear on your CIBIL report and does not affect your score. A hard enquiry occurs when a specific lender formally evaluates your full application and is visible to other lenders. We initiate a hard enquiry only after you select a lender and proceed with a formal application.",
  },
  {
    question: "Can a self-employed person or business owner apply for an instant personal loan?",
    answer:
      "Yes. Self-employed professionals (doctors, CAs, architects) and business owners are eligible provided they can demonstrate a minimum business vintage of 2 years, consistent ITR filing for the last 2 years, and a satisfactory CIBIL score. Some lenders also offer MSME business loans as an alternative for registered enterprises.",
  },
  {
    question: "Does taking an instant personal loan affect my home loan eligibility?",
    answer:
      "Yes, it can. Active personal loan EMIs increase your Fixed Obligation to Income Ratio (FOIR), which lenders evaluate when sanctioning home loans. If you are planning a home loan within 6 to 12 months, consult your Fintaraa advisor on optimal loan sizing and tenure to keep your FOIR below the 50 to 55% threshold.",
  },
  {
    question: "What is the processing fee for an instant personal loan?",
    answer:
      "Processing fees vary by lender and typically range from 0.5% to 3% of the sanctioned loan amount, applied once at disbursement. Some lenders include GST on the processing fee. Your final offer letter from the selected lender will disclose the exact processing fee, prepayment charges, and any other applicable costs before you commit.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function InstantLoanMarketplacePage({
  page,
  lenders,
  locationPages = [],
}: {
  page: LoanSeoPageData;
  lenders: BankProductLender[];
  locationPages?: LoanSeoLocationPage[];
}) {
  const allLenders = useMemo(() => dedupeLenders(lenders), [lenders]);
  const [search, setSearch] = useState("");
  const [visibleLenderCount, setVisibleLenderCount] = useState(lendersPerPage);
  const [leadForm, setLeadForm] = useState(initialLeadForm);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [eligibilityTab, setEligibilityTab] = useState<"salaried" | "selfEmployed">("salaried");
  const [openMythIndex, setOpenMythIndex] = useState<number | null>(0);
  const leadFormRef = useRef<HTMLDivElement>(null);

  const filteredLenders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return allLenders;
    return allLenders.filter((lender) =>
      [lender.bankName, lender.interestRate, lender.loanAmount]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [allLenders, search]);
  const visibleLenders = filteredLenders.slice(0, visibleLenderCount);
  const remainingLenderCount = Math.max(
    filteredLenders.length - visibleLenderCount,
    0,
  );

  const faqItems = useMemo(() => {
    const fromPage = page.tabs
      .flatMap((tab) => tab.faqs || [])
      .filter(
        (faq, index, items) =>
          items.findIndex((item) => item.question === faq.question) === index,
      );
    if (fromPage.length > 0) return fromPage;
    return faqsStatic;
  }, [page.tabs]);

  const updateField = (key: keyof LeadFormState, value: string) => {
    setLeadForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitError("");
    setSubmitSuccess("");
  };

  const validateLead = () => {
    const nextErrors: LeadFormErrors = {};
    const normalizedMobile = leadForm.mobile.trim().replace(/[\s-]/g, "");
    if (!nameRegex.test(leadForm.fullName.trim())) nextErrors.fullName = "Enter a valid full name.";
    if (!mobileRegex.test(normalizedMobile)) nextErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
    if (!emailRegex.test(leadForm.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!cityRegex.test(leadForm.city.trim())) nextErrors.city = "Enter a valid city.";
    if (!leadForm.loanAmount) nextErrors.loanAmount = "Select the required loan amount.";
    if (!leadForm.employmentType) nextErrors.employmentType = "Select your employment type.";
    if (!whatsappConsent) nextErrors.whatsappConsent = "Please accept the communication consent to continue.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    if (!validateLead()) return;
    const url = buildApiUrl("/contact-requests");
    if (!url) { setSubmitError("Lead service is not configured. Please try again later."); return; }
    setIsSubmitting(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: leadForm.fullName.trim(),
          mobile: leadForm.mobile.trim(),
          email: leadForm.email.trim(),
          city: leadForm.city.trim(),
          message: [
            "Instant Loan lead",
            `Required amount: ${leadForm.loanAmount}`,
            `Employment: ${leadForm.employmentType}`,
            `Preferred lender: ${leadForm.preferredLender || "Open to all partners"}`,
            `Page: ${page.canonicalPath || "/products/instant-loan"}`,
          ].join(" | "),
          ...buildWebsiteConsentPayload("instant_loan_marketplace"),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || "We could not submit your request right now.");
      setSubmitSuccess("Request submitted successfully. Our loan expert will contact you shortly.");
      setLeadForm(initialLeadForm);
      setWhatsappConsent(false);
      setErrors({});
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestLenderCallback = (lender: BankProductLender) => {
    setLeadForm((prev) => ({ ...prev, preferredLender: lender.bankName }));
    const heroEl = document.getElementById("hero-lead-form");
    if (heroEl) heroEl.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white text-slate-900 font-sans antialiased">
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10 lg:py-14">
          <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
            {/* Left — hero copy */}
            <div className="max-w-2xl">
              <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] leading-[1.05] tracking-[-0.03em] text-slate-900 font-light">
                Money in your account.<br />
                <span className="text-[#5b21b6] font-light">Not in paperwork.</span>
              </h1>

              <p className="mt-4 text-[16px] leading-[1.7] text-slate-500 max-w-xl font-light">
                Compare instant personal loan offers from 50+ RBI-regulated banks and NBFCs. No collateral. No branch visit. Disbursal within hours of approval.
              </p>

              {/* Key proof points */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {[
                  "From 10.49% p.a.",
                  "Up to Rs 1 Crore",
                  "Disbursal in 4 hours",
                  "Zero collateral",
                  "50+ lenders",
                ].map((point) => (
                  <span
                    key={point}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] text-slate-600"
                  >
                    <CircleCheck className="h-3 w-3 text-[#5b21b6] shrink-0" />
                    {point}
                  </span>
                ))}
              </div>

              {/* Trust row */}
              <div className="mt-8 flex items-center gap-6 flex-wrap">
                <div className="flex -space-x-2">
                  {["H", "I", "S", "A", "K"].map((initial, i) => (
                    <span
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] text-white font-light"
                      style={{ background: ["#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"][i] }}
                    >
                      {initial}
                    </span>
                  ))}
                </div>
                <p className="text-[13px] text-slate-400 font-light">
                  12,45,000+ loans disbursed across India
                </p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-3.5 w-3.5 ${s <= 4 ? "text-amber-400 fill-amber-400" : "text-amber-400/40"}`} />
                  ))}
                  <span className="ml-1 text-[12px] text-slate-400">4.8 / 5</span>
                </div>
              </div>

              {/* Hero Banner Image */}
              <div className="relative mt-8 w-full max-w-2xl lg:max-w-none">
                {/* Soft gradient shadow/glow behind image */}
                {/* <div
                  className="absolute -inset-4 rounded-3xl opacity-40 blur-3xl pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at center, #7c3aed 0%, #a78bfa 45%, transparent 75%)",
                  }}
                  aria-hidden="true"
                /> */}
                <Image
                  src="/images/loans/instant_hero_banner.png"
                  alt="Instant Personal Loan"
                  width={1200}
                  height={675}
                  priority
                  className="relative z-10 w-full h-auto object-contain rounded-2xl drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Right — Lead form */}
            <div
              ref={leadFormRef}
              id="instant-loan-lead-form"
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <p className="text-[10px] tracking-[0.14em] uppercase text-[#5b21b6] mb-1">Free expert callback</p>
              <h2 className="text-[20px] text-slate-900 font-light tracking-tight">Find the right instant loan</h2>
              <p className="mt-1 text-[12px] text-slate-500 leading-5 font-light">
                Share your details. Our team will match you with suitable lenders and call you within 2 hours.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-5 grid gap-3 sm:grid-cols-2">
                <LightLeadInput label="Full Name" value={leadForm.fullName} error={errors.fullName} icon={<User className="h-3.5 w-3.5" />} autoComplete="name" placeholder="Enter full name" onChange={(e) => updateField("fullName", e.target.value)} />
                <LightLeadInput label="Mobile Number" value={leadForm.mobile} error={errors.mobile} icon={<Phone className="h-3.5 w-3.5" />} autoComplete="tel" inputMode="tel" maxLength={14} placeholder="9876543210" onChange={(e) => updateField("mobile", e.target.value)} />
                <LightLeadInput label="Email Address" value={leadForm.email} error={errors.email} icon={<Mail className="h-3.5 w-3.5" />} autoComplete="email" inputMode="email" placeholder="name@example.com" onChange={(e) => updateField("email", e.target.value)} />
                <LightLeadInput label="City" value={leadForm.city} error={errors.city} icon={<MapPin className="h-3.5 w-3.5" />} autoComplete="address-level2" placeholder="Enter city" onChange={(e) => updateField("city", e.target.value)} />
                <LightLeadSelect label="Required Amount" value={leadForm.loanAmount} error={errors.loanAmount} icon={<BadgeIndianRupee className="h-3.5 w-3.5" />} placeholder="Select amount" options={loanAmountOptions} onChange={(v) => updateField("loanAmount", v)} />
                <LightLeadSelect label="Employment Type" value={leadForm.employmentType} error={errors.employmentType} icon={<BriefcaseBusiness className="h-3.5 w-3.5" />} placeholder="Select employment" options={employmentOptions} onChange={(v) => updateField("employmentType", v)} />
                <div className="sm:col-span-2">
                  <LightLeadSelect label="Preferred Bank / NBFC" optional value={leadForm.preferredLender} icon={<Landmark className="h-3.5 w-3.5" />} placeholder="Open to all partner lenders" options={allLenders.map((l) => l.bankName)} onChange={(v) => updateField("preferredLender", v)} />
                </div>

                <div className="sm:col-span-2">
                  <WhatsAppConsent checked={whatsappConsent} error={errors.whatsappConsent} onChange={(checked) => { setWhatsappConsent(checked); setErrors((c) => ({ ...c, whatsappConsent: undefined })); setSubmitError(""); setSubmitSuccess(""); }} />
                </div>

                <div className="sm:col-span-2" aria-live="polite">
                  {submitError && (
                    <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[11px] text-red-600">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{submitError}
                    </p>
                  )}
                  {submitSuccess && (
                    <p className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[11px] text-emerald-700">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />{submitSuccess}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="sm:col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#5b21b6] text-[13px] text-white font-light transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#4c1d95]"
                  style={{ boxShadow: "0 8px 20px rgba(91,33,182,0.28)" }}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {isSubmitting ? "Submitting..." : "Get matched with lenders"}
                </button>

                <p className="sm:col-span-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Encrypted form. No hidden marketplace fee.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────── */}
      <LoanStatsBar />

      {/* ─── FOUR CORE ADVANTAGES ─────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] tracking-[0.14em] uppercase text-purple-600 mb-2">Why Fintaraa instant loan</p>
            <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900 leading-[1.12]">
              The financial bridge you need,<br />
              <span className="text-[#5b21b6]">without the friction</span>
            </h2>
            <p className="mt-3 text-[14px] text-slate-500 font-light leading-relaxed">
              Traditional loan processes were designed for a different era. Instant personal loans through Fintaraa are engineered for the pace of modern life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
            {coreAdvantages.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.headline} className="bg-white p-6 group hover:bg-slate-50 transition-colors">
                  <div
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${item.accent}12`, color: item.accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-[24px] font-light tracking-tight mb-1" style={{ color: item.accent }}>{item.stat}</p>
                  <h3 className="text-[14px] font-normal text-slate-900 leading-snug mb-1.5">{item.headline}</h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-light">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── WHEN YOU NEED AN INSTANT LOAN ───────────────────── */}
      <section className="bg-[#f8faff] border-b border-slate-100 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-[11px] tracking-[0.14em] uppercase text-purple-600 mb-2">The right time to borrow</p>
              <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900 leading-[1.12]">
                When does an instant personal loan make sense?
              </h2>
              <p className="mt-5 text-[15px] text-slate-500 font-light leading-relaxed">
                An instant personal loan is a precision financial instrument. Understanding when to use it — and when not to — is the mark of a financially aware borrower.
              </p>
              <div className="mt-8 p-5 rounded-2xl border border-purple-100 bg-purple-50/60">
                <p className="text-[13px] text-purple-700 font-light leading-relaxed">
                  A personal loan should finance a defined need with a clear repayment plan. If your EMI will exceed 40% of your monthly income, consider borrowing a smaller amount or extending the tenure.
                </p>
              </div>
              
              <div className="mt-8 relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-slate-200/60">
                <Image
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1600"
                  alt="Financial planning and clear repayment"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-0 divide-y divide-slate-100">
              {whyInstantLoan.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={item.number} className="py-7 group">
                    <div className="flex gap-5 items-start">
                      <span className="text-[11px] text-slate-300 font-light shrink-0 mt-1">{item.number}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <Icon className="h-4 w-4" />
                          </span>
                          <h3 className="text-[16px] font-normal text-slate-900">{item.title}</h3>
                        </div>
                        <p className="text-[13.5px] text-slate-500 leading-relaxed font-light">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── LENDER MARKETPLACE ───────────────────────────────── */}
      <section id="instant-loan-lenders" className="bg-white border-b border-slate-100 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header row */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mb-10">
            <div className="max-w-2xl">
              <p className="text-[11px] tracking-[0.14em] uppercase text-purple-600 mb-3">Partner lender directory</p>
              <h2 className="text-[32px] sm:text-[40px] font-light tracking-tight text-slate-900 leading-[1.12]">
                Compare instant loans from all partner banks
              </h2>
              <p className="mt-3 text-[14px] text-slate-500 font-light leading-relaxed">
                50+ RBI-regulated banks and NBFCs — click any lender to see rates, fees, and apply or request a callback.
              </p>
            </div>
            <label className="relative block w-full lg:w-72 shrink-0">
              <span className="sr-only">Search banks and NBFCs</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                placeholder="Search lender..."
                onChange={(e) => { setSearch(e.target.value); setVisibleLenderCount(lendersPerPage); }}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/8 font-light"
              />
            </label>
          </div>

          {/* Stats strip */}
          <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-[11.5px] text-slate-500 font-light">
            <span>{filteredLenders.length} partner lenders{search.trim() ? ` matching "${search.trim()}"` : " — verified directory"}</span>
            <span className="hidden items-center gap-1.5 text-emerald-600 sm:inline-flex">
              <BadgeCheck className="h-3.5 w-3.5" />RBI regulated
            </span>
          </div>

          {/* Lender rows */}
          {filteredLenders.length ? (
            <div className="space-y-3">
              {visibleLenders.map((lender) => (
                <LenderRow
                  key={lender.bankSlug || lender.bankName}
                  lender={lender}
                  onRequestCallback={() => requestLenderCallback(lender)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <Landmark className="mx-auto h-6 w-6 text-slate-300" />
              <p className="mt-3 text-[14px] font-normal text-slate-600">No lender found</p>
              <button type="button" onClick={() => { setSearch(""); setVisibleLenderCount(lendersPerPage); }} className="mt-3 text-[12px] text-[#5b21b6] font-light">Clear search</button>
            </div>
          )}

          {remainingLenderCount > 0 && (
            <div className="mt-6 flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => setVisibleLenderCount((c) => Math.min(c + lendersPerPage * 2, filteredLenders.length))}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-[11.5px] text-slate-600 hover:border-[#5b21b6]/30 hover:text-[#5b21b6] transition font-light"
              >
                Show {Math.min(lendersPerPage * 2, remainingLenderCount)} more
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <p className="text-[10px] text-slate-400 font-light">{remainingLenderCount} more lenders</p>
            </div>
          )}

          <p className="mt-8 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-[11px] text-amber-700 font-light leading-5">
            Rates and terms are indicative. The selected lender will communicate the final offer after eligibility and document checks. Fintaraa does not guarantee approval or a fixed disbursal time.
          </p>
        </div>
      </section>

      {/* ─── INSTANT VS TRADITIONAL COMPARISON ───────────────── */}
      <section className="bg-[#f8faff] border-b border-slate-100 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] tracking-[0.14em] uppercase text-purple-600 mb-2">Side by side</p>
            <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Instant loan vs traditional bank loan
            </h2>
            <p className="mt-4 text-[15px] text-slate-500 font-light leading-relaxed">
              The difference is not just speed. It is the entire borrowing experience redesigned from the ground up.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* Header */}
            <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-slate-100 bg-slate-50">
              <div className="px-6 py-4 text-[11px] tracking-[0.08em] uppercase text-slate-400 font-light">Aspect</div>
              <div className="px-6 py-4 border-l border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.08em] uppercase text-purple-600 font-light">
                  <Zap className="h-3.5 w-3.5" />Instant loan
                </span>
              </div>
              <div className="px-6 py-4 border-l border-slate-100">
                <span className="text-[11px] tracking-[0.08em] uppercase text-slate-400 font-light">Traditional loan</span>
              </div>
            </div>
            {instantVsTraditional.map((row, idx) => (
              <div
                key={row.aspect}
                className={`grid grid-cols-[1fr_1fr_1fr] border-b last:border-0 border-slate-100 ${idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"}`}
              >
                <div className="px-6 py-4 text-[13px] text-slate-600 font-light">{row.aspect}</div>
                <div className="px-6 py-4 border-l border-slate-100">
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-emerald-700 font-light">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />{row.instant}
                  </span>
                </div>
                <div className="px-6 py-4 border-l border-slate-100 text-[13px] text-slate-400 font-light">{row.traditional}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── USE CASES ────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] tracking-[0.14em] uppercase text-purple-600 mb-2">What will you use it for?</p>
            <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Every life goal has a loan that fits
            </h2>
            <p className="mt-4 text-[15px] text-slate-500 font-light leading-relaxed">
              From urgent medical bills to a long-planned wedding — instant personal loans cover the full spectrum of financial needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {useCases.map((uc, idx) => (
              <article
                key={uc.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 transition-all duration-300 hover:border-purple-200 hover:shadow-[0_16px_48px_-12px_rgba(124,58,237,0.12)] hover:-translate-y-1"
              >
                {/* Accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${["#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][idx % 6]}60, transparent)`,
                  }}
                />
                <h3 className="text-[15px] font-normal text-slate-900 mb-3">{uc.title}</h3>
                <p className="text-[12.5px] text-slate-500 leading-relaxed font-light mb-5">{uc.desc}</p>
                <div className="grid grid-cols-3 gap-2 mt-auto">
                  {[{ label: "Max amount", val: uc.amount }, { label: "Timeline", val: uc.timeline }, { label: "Rate from", val: uc.rate }].map((m) => (
                    <div key={m.label} className="rounded-lg bg-slate-50 p-2.5">
                      <p className="text-[9px] tracking-[0.08em] uppercase text-slate-400 mb-0.5 font-light">{m.label}</p>
                      <p className="text-[11px] text-slate-700 font-normal leading-tight">{m.val}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="bg-[#07062e] py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(124,58,237,0.1),transparent)] -z-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[11px] tracking-[0.14em] uppercase text-purple-400 mb-3">Application journey</p>
            <h2 className="text-[32px] sm:text-[42px] font-light tracking-tight text-white leading-[1.12]">
              From requirement to disbursal in 4 steps
            </h2>
            <p className="mt-4 text-[15px] text-white/45 font-light leading-relaxed">
              The entire process is designed to take under 10 minutes of your time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {journeySteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative">
                  {idx < journeySteps.length - 1 && (
                    <div className="hidden lg:block absolute top-9 left-[calc(100%+8px)] w-[calc(100%-16px)] h-px bg-gradient-to-r from-purple-700/40 to-transparent pointer-events-none z-0" />
                  )}
                  <div className="relative z-10 rounded-2xl border border-white/8 bg-white/[0.05] backdrop-blur p-5 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#5b21b6] shadow-sm">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[24px] font-light text-white/8">{step.step}</span>
                    </div>
                    <h3 className="text-[13.5px] font-normal text-white mb-1.5">{step.title}</h3>
                    <p className="text-[11.5px] text-white/40 leading-relaxed font-light mb-3">{step.desc}</p>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/40">
                      <Clock3 className="h-3 w-3" />{step.duration}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <AuthRedirectLink
              href={getApplyHref({ category: "loan", productSlug: "instant-loan", referrer: page.canonicalPath || "/products/instant-loan" })}
              productSlug="instant-loan"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#5b21b6] px-8 text-[13px] text-white no-underline transition hover:bg-[#4c1d95] hover:-translate-y-0.5 font-light"
              style={{ boxShadow: "0 10px 28px rgba(91,33,182,0.28)" }}
            >
              Start your application
              <ArrowRight className="h-4 w-4" />
            </AuthRedirectLink>
          </div>
        </div>
      </section>

      {/* ─── ELIGIBILITY CRITERIA ─────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
            <div>
              <p className="text-[11px] tracking-[0.14em] uppercase text-purple-600 mb-3">Who can apply?</p>
              <h2 className="text-[32px] sm:text-[42px] font-light tracking-tight text-slate-900 leading-[1.12]">
                Eligibility criteria
              </h2>
              <p className="mt-5 text-[15px] text-slate-500 font-light leading-relaxed">
                Eligibility varies slightly by lender, but these are the baseline criteria that apply across most of our 50+ partner banks and NBFCs.
              </p>
              <div className="mt-8 p-5 rounded-2xl border border-slate-100 bg-slate-50">
                <p className="text-[13px] text-slate-500 font-light leading-relaxed">
                  Not meeting all criteria does not necessarily disqualify you. Our advisors help identify lenders with the most suitable underwriting criteria for your specific profile.
                </p>
              </div>
            </div>

            <div>
              {/* Tab selector */}
              <div className="flex rounded-xl bg-slate-100 p-1 mb-6 w-fit">
                {(["salaried", "selfEmployed"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setEligibilityTab(tab)}
                    className={`rounded-lg px-5 py-2 text-[12px] transition font-light ${eligibilityTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    {tab === "salaried" ? "Salaried" : "Self-employed"}
                  </button>
                ))}
              </div>

              <div className="space-y-0 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white overflow-hidden">
                {eligibilityCriteria[eligibilityTab].map((item) => (
                  <div key={item.label} className="grid grid-cols-[160px_1fr] gap-4 px-5 py-4">
                    <span className="text-[12px] text-slate-400 font-light self-center">{item.label}</span>
                    <span className="text-[13px] text-slate-800 font-normal">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DOCUMENTS REQUIRED ───────────────────────────────── */}
      <section className="bg-[#f8faff] border-b border-slate-100 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="text-[11px] tracking-[0.14em] uppercase text-purple-600 mb-3">What you will need</p>
            <h2 className="text-[32px] sm:text-[42px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Documents required
            </h2>
            <p className="mt-4 text-[15px] text-slate-500 font-light leading-relaxed">
              All documents can be submitted digitally via DigiLocker or secure upload. No physical copies or courier required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {documents.map((doc) => (
              <div key={doc.category} className="rounded-2xl border border-slate-100 bg-white p-6">
                <h3 className="text-[13px] font-normal text-slate-700 mb-4 pb-3 border-b border-slate-100">{doc.category}</h3>
                <ul className="space-y-3">
                  {doc.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[13px] text-slate-600 font-light">
                      <CheckCheck className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTEREST RATE FACTORS ────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
            <div className="lg:sticky lg:top-32">
              <p className="text-[11px] tracking-[0.14em] uppercase text-purple-600 mb-3">Understanding your rate</p>
              <h2 className="text-[32px] sm:text-[42px] font-light tracking-tight text-slate-900 leading-[1.12]">
                What determines your interest rate?
              </h2>
              <p className="mt-5 text-[15px] text-slate-500 font-light leading-relaxed">
                Lenders evaluate several factors before arriving at your personal interest rate. These are the primary variables that move your rate higher or lower.
              </p>
              <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50/50 p-5">
                <p className="text-[12px] text-purple-700 font-light leading-relaxed">
                  The published starting rate of 10.49% p.a. is available to applicants with a CIBIL score above 750, salaried employment at a Tier 1 company, and an income above Rs 50,000 per month. Your actual rate may be higher depending on your profile.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {rateFactors.map((factor, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 flex items-start gap-4">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-semibold ${factor.direction === "positive" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {factor.direction === "positive" ? "✓" : "!"}
                  </div>
                  <div>
                    <h3 className="text-[13.5px] text-slate-800 font-medium">{factor.factor}</h3>
                    <p className="mt-0.5 text-[12px] text-slate-500 font-light">{factor.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MYTHS & REALITY ────────────────────────────────── */}
      <section className="bg-[#f8faff] border-b border-slate-100 py-10 sm:py-14 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] tracking-[0.14em] uppercase text-purple-600 mb-2">Clearing the air</p>
            <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Common misconceptions about instant personal loans
            </h2>
            <p className="mt-3 text-[14px] text-slate-500 font-light leading-relaxed">
              Misinformation keeps many eligible borrowers from accessing credit they genuinely need. Here is the truth behind the most common myths.
            </p>
          </div>

          <div className="space-y-2">
            {misconceptions.map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenMythIndex(openMythIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 mt-0.5">
                      <X className="h-3 w-3" />
                    </span>
                    <span className="text-[13.5px] text-slate-700 font-light">{item.myth}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${openMythIndex === idx ? "rotate-180" : ""}`} />
                </button>
                {openMythIndex === idx && (
                  <div className="px-5 pb-4 border-t border-slate-100 pt-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mt-0.5">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                      <p className="text-[13px] text-slate-600 leading-relaxed font-light">{item.reality}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BAND ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-sky-50/50 p-10 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900 leading-[1.15]">
                Ready to compare and apply?
              </h2>
              <p className="mt-3 text-[14px] text-slate-500 font-light leading-relaxed">
                Submit your requirement above or call us directly. A dedicated Fintaraa loan advisor will match you with the most suitable lender for your profile.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => leadFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                className="inline-flex h-13 items-center gap-2 rounded-xl bg-[#5b21b6] px-8 text-[14px] text-white font-light transition hover:bg-[#4c1d95] hover:-translate-y-0.5"
                style={{ boxShadow: "0 10px 28px rgba(91,33,182,0.25)" }}
              >
                Get expert callback
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="tel:+918069195500"
                className="inline-flex h-13 items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 text-[14px] text-slate-700 font-light transition hover:border-purple-300 hover:text-purple-700 no-underline"
              >
                <Phone className="h-4 w-4" />
                Call us now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CREDIT SCORE SECTION ──────────────────────────────── */}
      <CreditScoreSection />

      {/* ─── FAQ ─────────────────────────────────────────────── */}
      <LoanFAQSection faqs={faqItems} title="Instant personal loan — questions answered" />

      {/* ─── RELATED BLOGS ───────────────────────────────────── */}
      <ProductRelatedBlogs category="Loans" productName={page.loanType} />

      {/* ─── LOCATION DIRECTORY ──────────────────────────────── */}
      <ProductLocationDirectory
        productName={page.loanType}
        productSlug={page.loanTypeSlug}
        currentLocation={page.location}
        pages={locationPages}
      />

      {/* ─── APP DOWNLOAD ────────────────────────────────────── */}
      <AppDownloadBanner />
    </div>
  );
}

// ─── Lender Row ───────────────────────────────────────────────────────────────

function LenderRow({
  lender,
  onRequestCallback,
}: {
  lender: BankProductLender;
  onRequestCallback: () => void;
}) {
  const applyHref = getApplyHref({
    category: "loan",
    productSlug: "instant-loan",
    bankSlug: lender.bankSlug,
    referrer: lender.canonicalPath || "/products/instant-loan",
  });

  return (
    <div className="grid grid-cols-[140px_1fr_1fr_1fr_1fr_auto] items-center gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 transition hover:border-[#5b21b6]/20 hover:shadow-[0_6px_24px_-6px_rgba(91,33,182,0.1)]">
      {/* Logo */}
      <div className="flex items-center">
        <Link href={lender.canonicalPath} className="block no-underline">
          <div className="relative flex h-14 w-36 shrink-0 items-center justify-start py-1">
            <Image
              src={lender.logoUrl || getBankLogoPath(lender.bankSlug, lender.bankName)}
              alt={lender.bankName}
              width={150}
              height={46}
              className="max-h-11 w-auto max-w-[140px] object-contain"
              unoptimized
            />
          </div>
        </Link>
      </div>

      {/* Interest rate */}
      <div>
        <p className="text-[9px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Interest rate</p>
        <p className="text-[13px] text-slate-800 font-normal">{lender.interestRate || "—"}</p>
      </div>

      {/* Processing fee */}
      <div>
        <p className="text-[9px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Processing fee</p>
        <p className="text-[13px] text-slate-800 font-normal">{lender.processingFee || "—"}</p>
      </div>

      {/* Loan amount */}
      <div>
        <p className="text-[9px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Loan amount</p>
        <p className="text-[13px] text-slate-800 font-normal">{lender.loanAmount || "—"}</p>
      </div>

      {/* Tenure */}
      <div>
        <p className="text-[9px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Tenure</p>
        <p className="text-[13px] text-slate-800 font-normal">{lender.tenure || "—"}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onRequestCallback}
          className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-4 text-[11.5px] text-slate-600 hover:border-[#5b21b6]/30 hover:text-[#5b21b6] transition font-light whitespace-nowrap"
        >
          Get callback
        </button>
        <AuthRedirectLink
          href={applyHref}
          productSlug="instant-loan"
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#5b21b6] px-4 text-[11.5px] text-white no-underline hover:bg-[#4c1d95] transition font-light whitespace-nowrap"
        >
          Apply now
          <ArrowRight className="h-3.5 w-3.5" />
        </AuthRedirectLink>
      </div>
    </div>
  );
}

// ─── Light Form Inputs ─────────────────────────────────────────────────────────

function LightLeadInput({
  label,
  icon,
  error,
  optional,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
  error?: string;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-slate-600 font-light">
        {label}{!optional && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <span className={`flex h-10 items-center rounded-xl border transition ${error ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-slate-50/50 focus-within:border-[#5b21b6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5b21b6]/10"}`}>
        <span className="ml-3 shrink-0 text-slate-400">{icon}</span>
        <input
          {...props}
          className="h-full min-w-0 flex-1 rounded-xl bg-transparent px-2.5 text-[12px] text-slate-900 outline-none placeholder:text-slate-400 font-light"
        />
      </span>
      {error && <span className="mt-1 block text-[10px] text-red-500 font-light">{error}</span>}
    </label>
  );
}

function LightLeadSelect({
  label,
  icon,
  error,
  optional,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: ReactNode;
  error?: string;
  optional?: boolean;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-slate-600 font-light">
        {label}{!optional && <span className="text-red-500 ml-0.5">*</span>}
        {optional && <span className="ml-1 text-slate-400">(optional)</span>}
      </span>
      <span className={`flex h-10 items-center rounded-xl border transition ${error ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-slate-50/50 focus-within:border-[#5b21b6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5b21b6]/10"}`}>
        <span className="ml-3 shrink-0 text-slate-400">{icon}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full min-w-0 flex-1 rounded-xl bg-transparent px-2.5 text-[12px] text-slate-900 outline-none font-light appearance-none"
        >
          <option value="" className="text-slate-400">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-slate-900 bg-white">{opt}</option>
          ))}
        </select>
        <ChevronDown className="mr-3 h-3.5 w-3.5 text-slate-400 shrink-0 pointer-events-none" />
      </span>
      {error && <span className="mt-1 block text-[10px] text-red-500 font-light">{error}</span>}
    </label>
  );
}
