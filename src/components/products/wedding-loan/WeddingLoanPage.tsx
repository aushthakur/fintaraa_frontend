"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BadgeIndianRupee,
  Building,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  FileCheck2,
  FileSpreadsheet,
  HelpCircle,
  Info,
  Layers,
  Loader2,
  Mail,
  MapPin,
  Heart,
  ShieldCheck,
  Sparkles,
  Sliders,
  User,
  Phone,
  X,
  Camera,
  Utensils,
  Gem,
  Music,
} from "lucide-react";
import { FormEvent, InputHTMLAttributes, ReactNode, useMemo, useState } from "react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { getApplyHref } from "@/components/application/flowRegistry";
import { WhatsAppConsent } from "@/components/common/WhatsAppConsent";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { ProductLocationDirectory } from "@/components/products/ProductLocationDirectory";
import { ProductRelatedBlogs } from "@/components/products/ProductRelatedBlogs";
import { LoanFAQSection } from "@/components/products/loan-detail/LoanFAQSection";
import { buildWebsiteConsentPayload } from "@/lib/formConsent";
import { buildApiUrl } from "@/services/apiUrl";
import type { LoanSeoLocationPage, LoanSeoPageData } from "@/services/loanSeoPages";
import type { BankProductLender } from "@/services/bankSeoPages";

const defaultWeddingLenders: BankProductLender[] = [
  {
    bankName: "HDFC Bank Personal Loan for Wedding",
    bankSlug: "hdfc-bank",
    productSlug: "wedding-loan",
    interestRate: "From 10.50% p.a.",
    processingFee: "Up to 1.50% + GST",
    loanAmount: "Up to ₹50 Lakhs",
    tenure: "Up to 6 years",
    canonicalPath: "/products/wedding-loan/hdfc-bank",
  },
  {
    bankName: "ICICI Bank Marriage Loan",
    bankSlug: "icici-bank",
    productSlug: "wedding-loan",
    interestRate: "From 10.75% p.a.",
    processingFee: "Up to 2.00%",
    loanAmount: "Up to ₹40 Lakhs",
    tenure: "Up to 5 years",
    canonicalPath: "/products/wedding-loan/icici-bank",
  },
  {
    bankName: "Axis Bank Wedding Loan",
    bankSlug: "axis-bank",
    productSlug: "wedding-loan",
    interestRate: "From 10.99% p.a.",
    processingFee: "1.00% to 2.00%",
    loanAmount: "Up to ₹40 Lakhs",
    tenure: "Up to 5 years",
    canonicalPath: "/products/wedding-loan/axis-bank",
  },
  {
    bankName: "State Bank of India (SBI) Personal Loan",
    bankSlug: "sbi",
    productSlug: "wedding-loan",
    interestRate: "From 9.60% p.a.",
    processingFee: "0.50% to 1.00%",
    loanAmount: "Up to ₹20 Lakhs",
    tenure: "Up to 7 years",
    canonicalPath: "/products/wedding-loan/sbi",
  },
  {
    bankName: "Kotak Mahindra Marriage Loan",
    bankSlug: "kotak-bank",
    productSlug: "wedding-loan",
    interestRate: "From 10.99% p.a.",
    processingFee: "Up to 1.50%",
    loanAmount: "Up to ₹30 Lakhs",
    tenure: "Up to 5 years",
    canonicalPath: "/products/wedding-loan/kotak-bank",
  },
  {
    bankName: "Bajaj Finserv Flexi Marriage Loan",
    bankSlug: "bajaj-finserv",
    productSlug: "wedding-loan",
    interestRate: "From 11.00% p.a.",
    processingFee: "Up to 2.99%",
    loanAmount: "Up to ₹40 Lakhs",
    tenure: "Up to 8 years",
    canonicalPath: "/products/wedding-loan/bajaj-finserv",
  },
];

const weddingExpenseCategories = [
  "Venue Booking and Catering",
  "Jewelry and Bridal Apparel",
  "Photography and Videography",
  "Event Decor and Stage Setup",
  "Guest Accommodation and Travel",
  "Honeymoon and Travel Packages",
  "Comprehensive Wedding Expenses",
];

const budgetOptions = [
  "Below ₹2 Lakhs",
  "₹2–5 Lakhs",
  "₹5–10 Lakhs",
  "₹10–20 Lakhs",
  "₹20–35 Lakhs",
  "Above ₹35 Lakhs",
];

const employmentOptions = [
  "Salaried Employee",
  "Self-Employed Professional",
  "Business Owner",
  "Government Servant",
];

const weddingFaqs = [
  {
    question: "What is a wedding loan?",
    answer: "A wedding loan is an unsecured personal loan designed to cover marriage-related expenses including venue bookings, catering, bridal apparel, jewelry purchases, photography, guest hospitality, and event arrangements.",
  },
  {
    question: "What is the maximum loan amount available for a wedding in India?",
    answer: "Sanctioned loan amounts generally range from ₹1 Lakh up to ₹50 Lakhs, depending on the applicant monthly income, employment profile, credit score, and existing debt obligations.",
  },
  {
    question: "Is collateral required to secure a wedding loan?",
    answer: "No. Wedding loans offered through Fintaraa partner institutions are 100 percent collateral-free personal loans requiring zero asset pledge or property security.",
  },
  {
    question: "What interest rates apply to wedding personal loans?",
    answer: "Indicative interest rates range from 9.60 percent to 16.00 percent per annum depending on credit score profile, employer categorization, and lender risk assessment.",
  },
  {
    question: "How quickly are wedding loan funds disbursed?",
    answer: "Upon digital verification of KYC and income documents, pre-approved applicants can receive loan disbursal into their bank account within 24 to 48 hours.",
  },
  {
    question: "Can both the bride and groom apply jointly for a higher loan sanction?",
    answer: "Yes. Co-applicant options with family members or spouses allow pooling of incomes, which enhances overall loan eligibility and sanction limits.",
  },
  {
    question: "What documents are required to apply for a wedding loan?",
    answer: "Essential documents include PAN card, Aadhaar card or identity proof, last 3 to 6 months bank statements, last 3 months salary slips or Income Tax Returns for self-employed applicants.",
  },
  {
    question: "Can a wedding loan be prepaid before the tenure completes?",
    answer: "Yes. Most partner banks permit partial or full prepayment after a mandatory lock-in period, subject to standard lender foreclosure policies.",
  },
];

type LeadFormState = {
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  weddingBudget: string;
  expenseType: string;
  employmentType: string;
  preferredLender: string;
};

const initialLeadForm: LeadFormState = {
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  weddingBudget: "",
  expenseType: "",
  employmentType: "",
  preferredLender: "",
};

type LeadFormErrors = Partial<Record<keyof LeadFormState | "whatsappConsent", string>>;

export function WeddingLoanPage({
  page,
  lenders = [],
  locationPages = [],
}: {
  page: LoanSeoPageData;
  lenders?: BankProductLender[];
  locationPages?: LoanSeoLocationPage[];
}) {
  const displayLenders = useMemo(() => {
    if (lenders && lenders.length > 0) return lenders;
    return defaultWeddingLenders;
  }, [lenders]);

  const [leadForm, setLeadForm] = useState(initialLeadForm);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [lenderSearch, setLenderSearch] = useState("");
  const [docTab, setDocTab] = useState<"eligibility" | "documents">("eligibility");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Expense Planner Calculator state
  const [guestCount, setGuestCount] = useState(300);
  const [venueTier, setVenueTier] = useState<"Standard" | "Premium" | "Luxury">("Premium");
  const [calcRate, setCalcRate] = useState(10.5);
  const [calcTenureYears, setCalcTenureYears] = useState(4);

  const updateField = (key: keyof LeadFormState, value: string) => {
    setLeadForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitError("");
    setSubmitSuccess("");
  };

  const validateLead = () => {
    const nextErrors: LeadFormErrors = {};
    if (!/^[A-Za-z\s.]{2,60}$/.test(leadForm.fullName.trim())) nextErrors.fullName = "Enter a valid full name.";
    if (!/^[6-9]\d{9}$/.test(leadForm.mobile.trim().replace(/[\s-]/g, ""))) nextErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!/^[A-Za-z\s.-]{2,50}$/.test(leadForm.city.trim())) nextErrors.city = "Enter a valid city.";
    if (!leadForm.weddingBudget) nextErrors.weddingBudget = "Select estimated budget.";
    if (!leadForm.expenseType) nextErrors.expenseType = "Select primary expense category.";
    if (!whatsappConsent) nextErrors.whatsappConsent = "Please accept communication consent.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    if (!validateLead()) return;
    const url = buildApiUrl("/contact-requests");
    if (!url) {
      setSubmitError("Lead service is not configured. Please try again later.");
      return;
    }
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
            "Wedding Loan lead",
            `Category: ${leadForm.expenseType}`,
            `Budget: ${leadForm.weddingBudget}`,
            `Employment: ${leadForm.employmentType || "Not specified"}`,
            `Preferred Lender: ${leadForm.preferredLender || "Open to all"}`,
            `Page: ${page.canonicalPath || "/products/wedding-loan"}`,
          ].join(" | "),
          ...buildWebsiteConsentPayload("wedding_loan_marketplace"),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || "Could not submit request right now.");
      setSubmitSuccess("Wedding loan inquiry submitted. A loan specialist will assist you within 2 hours.");
      setLeadForm(initialLeadForm);
      setWhatsappConsent(false);
      setErrors({});
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openFormWithDetails = (category?: string, budget?: string) => {
    if (category) setLeadForm((prev) => ({ ...prev, expenseType: category }));
    if (budget) setLeadForm((prev) => ({ ...prev, weddingBudget: budget }));
    setIsModalOpen(true);
  };

  // Expense estimation math
  const weddingBudgetCalc = useMemo(() => {
    const costPerGuest = venueTier === "Standard" ? 1500 : venueTier === "Premium" ? 3000 : 5500;
    const venueCatering = guestCount * costPerGuest;
    const jewelryApparel = Math.round(venueCatering * 0.45);
    const decorPhotoOthers = Math.round(venueCatering * 0.35);
    const totalEstimate = venueCatering + jewelryApparel + decorPhotoOthers;

    const P = totalEstimate;
    const r = calcRate / 12 / 100;
    const n = calcTenureYears * 12;

    let emi = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (P > 0 && r > 0 && n > 0) {
      emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      totalPayment = emi * n;
      totalInterest = Math.max(0, totalPayment - P);
    }

    return { venueCatering, jewelryApparel, decorPhotoOthers, totalEstimate, emi, totalInterest, totalPayment };
  }, [guestCount, venueTier, calcRate, calcTenureYears]);

  const filteredLenders = useMemo(() => {
    const q = lenderSearch.trim().toLowerCase();
    if (!q) return displayLenders;
    return displayLenders.filter((l) =>
      [l.bankName, l.interestRate, l.loanAmount, l.tenure].join(" ").toLowerCase().includes(q)
    );
  }, [displayLenders, lenderSearch]);

  const faqItems = useMemo(() => {
    const fromPage = page.tabs
      .flatMap((t) => t.faqs || [])
      .filter((faq, index, items) => items.findIndex((i) => i.question === faq.question) === index);
    if (fromPage.length > 0) return fromPage;
    return weddingFaqs;
  }, [page.tabs]);

  return (
    <div className="bg-white text-[#192337] font-sans antialiased">
      {/* ─── HERO SECTION: CONCEPTUAL WEDDING FINANCIAL PLANNING ─── */}
      <section className="relative bg-gradient-to-b from-[#F7F3FF]/90 via-white to-slate-50/50 border-b border-purple-100/70 py-14 lg:py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & Information */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-purple-100/70 px-3.5 py-1 text-[11.5px] font-medium text-[#5B21B6]">
                <Heart className="h-3.5 w-3.5 text-[#7C3AED]" />
                Marriage Financial Options
              </span>

              <h1 className="text-[38px] sm:text-[50px] lg:text-[58px] leading-[1.08] font-light text-slate-900 tracking-tight">
                Wedding Loan in India: <br />
                <span className="text-[#5B21B6] font-normal">Compare Rates, Eligibility & Options</span>
              </h1>

              <p className="text-[15.5px] sm:text-[17.5px] text-[#64748B] font-light leading-relaxed max-w-xl">
                Finance venue bookings, jewelry purchases, guest hospitality, catering, and event decor with flexible personal loans from top partner banks and NBFCs.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => openFormWithDetails()}
                  className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl bg-[#5B21B6] px-7 text-[14px] font-medium text-white transition hover:bg-[#4C1D95] shadow-lg shadow-purple-900/15 cursor-pointer"
                >
                  Check Wedding Loan Eligibility
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="#wedding-calculator"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-[14px] font-medium text-slate-700 hover:border-purple-300 hover:text-[#5B21B6] transition no-underline"
                >
                  Estimate Wedding Budget
                </a>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11.5px] text-slate-400 font-light">
                <ShieldCheck className="h-4 w-4 text-purple-500 shrink-0" />
                <span>Zero collateral required. Loan terms subject to applicant credit evaluation.</span>
              </div>
            </div>

            {/* Right Column: Conceptual Interactive Budget Distribution Card */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-8 shadow-[0_16px_40px_rgba(91,33,182,0.08)] space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10.5px] uppercase tracking-wider text-purple-600 font-medium">Budget Breakdown View</span>
                    <h2 className="text-[20px] font-medium text-slate-900 mt-0.5">Wedding Expense Distribution</h2>
                  </div>
                  <span className="rounded-xl bg-purple-50 px-3 py-1 text-[12px] font-medium text-[#5B21B6]">
                    Up to ₹50 Lakhs
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Venue & Catering", pct: 45, icon: <Utensils className="h-4 w-4 text-[#5B21B6]" />, value: "₹6.75 Lakhs" },
                    { label: "Jewelry & Attire", pct: 25, icon: <Gem className="h-4 w-4 text-[#5B21B6]" />, value: "₹3.75 Lakhs" },
                    { label: "Photography & Videography", pct: 15, icon: <Camera className="h-4 w-4 text-[#5B21B6]" />, value: "₹2.25 Lakhs" },
                    { label: "Stage Decor & Music", pct: 15, icon: <Music className="h-4 w-4 text-[#5B21B6]" />, value: "₹2.25 Lakhs" },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-[12.5px]">
                        <span className="flex items-center gap-2 font-medium text-slate-700">
                          {item.icon}
                          {item.label}
                        </span>
                        <span className="font-medium text-slate-900">{item.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-purple-50 overflow-hidden">
                        <div className="h-full bg-[#5B21B6] rounded-full" style={{ width: `${item.pct * 2}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-purple-50/70 p-4 flex justify-between items-center text-[13px]">
                  <div>
                    <span className="text-[11px] text-slate-500 font-light block">Sample Indicative EMI (4 Years @ 10.5%)</span>
                    <span className="text-[18px] font-medium text-[#5B21B6]">₹38,540 / month</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openFormWithDetails()}
                    className="inline-flex h-9 items-center justify-center rounded-xl bg-[#5B21B6] px-4 text-[12px] font-medium text-white transition hover:bg-[#4C1D95] cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── MODAL LEAD FORM ────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-xl rounded-3xl border border-purple-100 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#5B21B6] p-6 text-white flex items-start justify-between shrink-0">
              <div>
                <span className="text-[10px] tracking-[0.16em] uppercase text-purple-200 font-medium">Digital Loan Application</span>
                <h2 className="text-[22px] font-normal text-white tracking-tight mt-0.5">Apply for Wedding Loan</h2>
                <p className="mt-1 text-[12.5px] text-purple-100/90 font-light leading-relaxed">
                  Provide basic details to explore loan options from partner banks and NBFCs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0 ml-4"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  label="Full Name"
                  value={leadForm.fullName}
                  error={errors.fullName}
                  icon={<User className="h-3.5 w-3.5" />}
                  placeholder="Enter full name"
                  onChange={(e) => updateField("fullName", e.target.value)}
                />
                <FormInput
                  label="Mobile Number"
                  value={leadForm.mobile}
                  error={errors.mobile}
                  icon={<Phone className="h-3.5 w-3.5" />}
                  placeholder="10-digit mobile number"
                  maxLength={14}
                  onChange={(e) => updateField("mobile", e.target.value)}
                />
                <FormInput
                  label="Email Address"
                  value={leadForm.email}
                  error={errors.email}
                  icon={<Mail className="h-3.5 w-3.5" />}
                  placeholder="name@example.com"
                  onChange={(e) => updateField("email", e.target.value)}
                />
                <FormInput
                  label="Current City"
                  value={leadForm.city}
                  error={errors.city}
                  icon={<MapPin className="h-3.5 w-3.5" />}
                  placeholder="Enter city"
                  onChange={(e) => updateField("city", e.target.value)}
                />

                <FormSelect
                  label="Expense Category"
                  value={leadForm.expenseType}
                  error={errors.expenseType}
                  icon={<Heart className="h-3.5 w-3.5" />}
                  placeholder="Select primary expense"
                  options={weddingExpenseCategories}
                  onChange={(v) => updateField("expenseType", v)}
                />

                <FormSelect
                  label="Estimated Loan Amount"
                  value={leadForm.weddingBudget}
                  error={errors.weddingBudget}
                  icon={<BadgeIndianRupee className="h-3.5 w-3.5" />}
                  placeholder="Select budget range"
                  options={budgetOptions}
                  onChange={(v) => updateField("weddingBudget", v)}
                />

                <div className="sm:col-span-2">
                  <FormSelect
                    label="Employment Type"
                    optional
                    value={leadForm.employmentType}
                    icon={<Building className="h-3.5 w-3.5" />}
                    placeholder="Select employment status"
                    options={employmentOptions}
                    onChange={(v) => updateField("employmentType", v)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <WhatsAppConsent
                    checked={whatsappConsent}
                    error={errors.whatsappConsent}
                    onChange={(checked) => {
                      setWhatsappConsent(checked);
                      setErrors((c) => ({ ...c, whatsappConsent: undefined }));
                      setSubmitError("");
                      setSubmitSuccess("");
                    }}
                  />
                </div>

                <div className="sm:col-span-2" aria-live="polite">
                  {submitError && (
                    <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[11px] text-red-600 font-light">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {submitError}
                    </p>
                  )}
                  {submitSuccess && (
                    <p className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[11px] text-emerald-700 font-light">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {submitSuccess}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2 mt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#5B21B6] px-5 text-[13.5px] font-medium text-white transition hover:bg-[#4C1D95] disabled:opacity-60 cursor-pointer shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Fetching custom options...
                      </>
                    ) : (
                      <>
                        Get My Loan Options
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-center text-[10.5px] text-slate-400 font-light">
                    Soft eligibility check • Zero impact on CIBIL score
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 2: COVERED WEDDING EXPENSES ────────────────────────── */}
      <section className="py-14 lg:py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-medium mb-2">Comprehensive Coverage</p>
            <h2 className="text-[30px] sm:text-[40px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Wedding Expenses Covered Under Personal Loans
            </h2>
            <p className="mt-2 text-[15px] text-slate-500 font-light">
              Personal wedding loans offer complete flexibility without end-use restrictions, allowing you to manage diverse marriage costs seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Venue & Hotel Booking",
                desc: "Cover advance deposits and full payments for banquet halls, heritage resorts, and outdoor wedding lawns.",
                icon: <Building2 className="h-5 w-5 text-[#5B21B6]" />,
                cat: "Venue Booking and Catering",
              },
              {
                title: "Catering & Banquet Services",
                desc: "Fund multi-cuisine catering contracts, live food counters, beverage arrangements, and service staff fees.",
                icon: <Utensils className="h-5 w-5 text-[#5B21B6]" />,
                cat: "Venue Booking and Catering",
              },
              {
                title: "Bridal Jewelry & Attire",
                desc: "Purchase gold, diamond, and kundan jewelry, along with designer lehengas, sherwanis, and wedding trousseau.",
                icon: <Gem className="h-5 w-5 text-[#5B21B6]" />,
                cat: "Jewelry and Bridal Apparel",
              },
              {
                title: "Photography & Videography",
                desc: "Hire professional wedding cinematographers, pre-wedding shoot teams, drone operators, and album creation.",
                icon: <Camera className="h-5 w-5 text-[#5B21B6]" />,
                cat: "Photography and Videography",
              },
              {
                title: "Stage & Floral Decor",
                desc: "Finance floral arrangements, stage mandap setups, light design, sound systems, and wedding event management.",
                icon: <Music className="h-5 w-5 text-[#5B21B6]" />,
                cat: "Event Decor and Stage Setup",
              },
              {
                title: "Guest Accommodation & Travel",
                desc: "Manage hotel room inventory for outstation guests, flight and train tickets, and luxury car rentals.",
                icon: <Compass className="h-5 w-5 text-[#5B21B6]" />,
                cat: "Guest Accommodation and Travel",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => openFormWithDetails(item.cat)}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    {item.icon}
                  </div>
                  <h3 className="text-[17px] font-medium text-slate-900 group-hover:text-[#5B21B6] transition-colors">{item.title}</h3>
                  <p className="mt-2 text-[13px] text-slate-500 font-light leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[12.5px] font-medium text-[#5B21B6]">
                  <span>Explore Financing</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: UNIFIED WEDDING BUDGET & EMI CALCULATOR ───────── */}
      <section id="wedding-calculator" className="py-14 lg:py-20 bg-[#F7F3FF]/40 border-b border-purple-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-medium mb-2">Interactive Financial Tool</p>
            <h2 className="text-[30px] sm:text-[40px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Wedding Expense & EMI Estimator
            </h2>
            <p className="mt-2 text-[15px] text-slate-500 font-light">
              Adjust guest size, venue tier, interest rate, and tenure to calculate your total estimated budget and monthly EMI obligations.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-[0_16px_40px_rgba(91,33,182,0.06)]">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[12px] font-medium text-slate-700">Estimated Guest Count</label>
                  <span className="text-[14px] font-medium text-[#5B21B6]">{guestCount} Guests</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={1500}
                  step={25}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-purple-100 accent-[#5B21B6] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-2">Venue & Catering Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Standard", "Premium", "Luxury"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setVenueTier(t)}
                      className={`py-2.5 px-3 rounded-xl text-[12.5px] font-medium border transition cursor-pointer ${
                        venueTier === t
                          ? "bg-[#5B21B6] text-white border-[#5B21B6]"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[12px] font-medium text-slate-700">Interest Rate (p.a.)</label>
                    <span className="text-[13.5px] font-medium text-[#5B21B6]">{calcRate.toFixed(2)}%</span>
                  </div>
                  <input
                    type="range"
                    min={9.5}
                    max={18}
                    step={0.25}
                    value={calcRate}
                    onChange={(e) => setCalcRate(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-purple-100 accent-[#5B21B6] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[12px] font-medium text-slate-700">Loan Tenure</label>
                    <span className="text-[13.5px] font-medium text-[#5B21B6]">{calcTenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    step={1}
                    value={calcTenureYears}
                    onChange={(e) => setCalcTenureYears(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-purple-100 accent-[#5B21B6] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#5B21B6] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-purple-200 font-medium">Estimated Wedding Budget</span>
                <p className="text-[28px] sm:text-[34px] font-medium text-white tracking-tight mt-1">
                  ₹{(weddingBudgetCalc.totalEstimate / 100000).toFixed(2)} Lakhs
                </p>
                <p className="text-[12px] text-purple-100/80 font-light mt-1">
                  Includes venue, catering, jewelry, photography, and decor for {guestCount} guests ({venueTier.toLowerCase()} tier).
                </p>
              </div>

              <div className="space-y-3 border-t border-purple-400/30 pt-4 text-[13px]">
                <div className="flex justify-between items-center text-purple-100">
                  <span>Monthly Repayment EMI</span>
                  <span className="font-medium text-white text-[20px]">₹{weddingBudgetCalc.emi.toLocaleString()} <span className="text-[12px] font-normal text-purple-200">/ mo</span></span>
                </div>
                <div className="flex justify-between text-[#E9D5FF] text-[12px]">
                  <span>Total Payable ({calcTenureYears} yrs)</span>
                  <span className="font-medium text-white">₹{weddingBudgetCalc.totalPayment.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const bStr = weddingBudgetCalc.totalEstimate > 2000000 ? "Above ₹20 Lakhs" : weddingBudgetCalc.totalEstimate > 1000000 ? "₹10–20 Lakhs" : "₹5–10 Lakhs";
                  openFormWithDetails(undefined, bStr);
                }}
                className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-[#5B21B6] font-medium text-[13.5px] hover:bg-purple-50 transition cursor-pointer shadow-md"
              >
                Apply for This Loan Amount
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-[10.5px] text-purple-200/70 font-light leading-relaxed">
                *Illustrative estimate. Final interest rates and loan limits depend on lender risk scoring and profile evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: LENDER MARKETPLACE ─────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-medium mb-2">Partner Directory</p>
              <h2 className="text-[30px] sm:text-[38px] font-light tracking-tight text-slate-900 leading-[1.12]">
                Compare Wedding Loan Offers
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {filteredLenders.map((lender) => (
              <div
                key={lender.bankSlug || lender.bankName}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[160px_1fr_1fr_1fr_1fr_auto] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-purple-300 hover:shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[13px] font-medium text-[#5B21B6]">
                    {lender.bankName.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}
                  </span>
                  <span className="text-[12.5px] font-medium text-slate-800 leading-tight">{lender.bankName}</span>
                </div>

                <div>
                  <p className="text-[9.5px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Indicative Rate</p>
                  <p className="text-[13px] text-slate-800 font-medium">{lender.interestRate || "—"}</p>
                </div>

                <div>
                  <p className="text-[9.5px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Max Sanction Limit</p>
                  <p className="text-[13px] text-slate-800 font-medium">{lender.loanAmount || "—"}</p>
                </div>

                <div>
                  <p className="text-[9.5px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Processing Fee</p>
                  <p className="text-[13px] text-slate-800 font-light">{lender.processingFee || "—"}</p>
                </div>

                <div>
                  <p className="text-[9.5px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Max Tenure</p>
                  <p className="text-[13px] text-slate-800 font-light">{lender.tenure || "—"}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openFormWithDetails(undefined, undefined)}
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-3.5 text-[11.5px] text-slate-600 hover:border-purple-300 hover:text-[#5B21B6] transition font-light whitespace-nowrap cursor-pointer"
                  >
                    Get Callback
                  </button>
                  <AuthRedirectLink
                    href={getApplyHref({
                      category: "loan",
                      productSlug: "wedding-loan",
                      bankSlug: lender.bankSlug,
                      referrer: lender.canonicalPath || "/products/wedding-loan",
                    })}
                    productSlug="wedding-loan"
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#5B21B6] px-4 text-[11.5px] text-white no-underline hover:bg-[#4C1D95] transition font-medium whitespace-nowrap"
                  >
                    Apply Now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </AuthRedirectLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: SEO DEEP FINANCING GUIDE ──────────────────────── */}
      <section className="py-14 lg:py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-medium mb-2">Comprehensive Guide</p>
            <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900">
              Wedding Loan Guide in India: Key Features, Eligibility, and Requirements
            </h2>
          </div>

          <div className="prose prose-slate max-w-none text-[14.5px] text-slate-600 font-light leading-relaxed space-y-6">
            <p>
              Weddings in India are significant cultural and financial events requiring comprehensive planning across venue bookings, catering contracts, bridal attire, jewelry purchases, guest accommodations, and photography. A personal wedding loan provides flexible, collateral-free capital allowing families to manage these expenses systematically without liquidating long-term investments or emergency funds.
            </p>

            <h3 className="text-[20px] font-medium text-slate-900 mt-6 mb-2">Key Benefits of Personal Loans for Marriage</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>No End-Use Restrictions:</strong> Funds can be freely distributed across multiple vendors, venues, caterers, and jewelers.
              </li>
              <li>
                <strong>Zero Collateral Security:</strong> Unsecured personal loans require no property mortgage, gold pledge, or asset security.
              </li>
              <li>
                <strong>Flexible Repayment Tenures:</strong> Choose repayment tenures ranging from 12 months up to 84 months depending on monthly cash flow preferences.
              </li>
              <li>
                <strong>Pre-Approved Fast Disbursal:</strong> Applicants with credit scores above 750 can receive digital pre-approval and swift disbursal.
              </li>
            </ul>

            <h3 className="text-[20px] font-medium text-slate-900 mt-6 mb-2">Factors Influencing Interest Rates</h3>
            <p>
              Lenders evaluate applicant creditworthiness based on monthly income stability, employer classification, existing debt-to-income ratio (FOIR), and credit score. Maintaining a clean repayment record lowers risk scoring and secures competitive interest rates.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: ELIGIBILITY & DOCUMENTS ───────────────────────── */}
      <section className="py-14 lg:py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-medium mb-2">Requirements</p>
            <h2 className="text-[30px] sm:text-[40px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Eligibility & Document Checklist
            </h2>
          </div>

          <div className="flex gap-2 mb-6 border-b border-slate-200/80 pb-3">
            <button
              type="button"
              onClick={() => setDocTab("eligibility")}
              className={`px-5 py-2.5 rounded-xl text-[13px] font-medium transition cursor-pointer ${
                docTab === "eligibility"
                  ? "bg-[#5B21B6] text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Eligibility Criteria
            </button>
            <button
              type="button"
              onClick={() => setDocTab("documents")}
              className={`px-5 py-2.5 rounded-xl text-[13px] font-medium transition cursor-pointer ${
                docTab === "documents"
                  ? "bg-[#5B21B6] text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Document Checklist
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            {docTab === "eligibility" ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Age: 21 to 60 years at loan maturity",
                  "Minimum monthly income: ₹20,000 for salaried applicants",
                  "Minimum 1 year of continuous employment or business vintage",
                  "Credit Score: CIBIL score of 720+ preferred",
                  "FOIR: Existing obligations below 50% of monthly income",
                  "Indian citizenship with valid resident proof",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <FileCheck2 className="h-4 w-4 text-[#5B21B6] shrink-0 mt-0.5" />
                    <span className="text-[13px] text-slate-700 font-light">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Identity Proof (PAN Card, Aadhaar, Passport, Voter ID)",
                  "Address Proof (Aadhaar, Utility Bill, Rent Agreement)",
                  "Last 3 months salary slips (Salaried)",
                  "Last 6 months bank account statement showing salary credits",
                  "Form 16 or Income Tax Returns for last 2 years",
                  "Passport size photographs",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <FileSpreadsheet className="h-4 w-4 text-[#5B21B6] shrink-0 mt-0.5" />
                    <span className="text-[13px] text-slate-700 font-light">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: FAQ ────────────────────────────────────────────── */}
      <LoanFAQSection faqs={faqItems} title="Wedding Loan Frequently Asked Questions" />

      {/* ─── SECTION 8: CLOSING CTA ────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white via-[#F7F3FF]/60 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-purple-100 bg-white overflow-hidden p-8 sm:p-12 lg:p-16 shadow-[0_20px_60px_rgba(91,33,182,0.08)] text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-medium">Digital Loan Discovery</span>
            <h2 className="text-[32px] sm:text-[44px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Explore Tailored Wedding Loans Today
            </h2>
            <p className="text-[15px] text-slate-500 font-light">
              Compare indicative interest rates, loan amounts, and tenure options from leading financial institutions with Fintaraa.
            </p>
            <button
              type="button"
              onClick={() => openFormWithDetails()}
              className="mt-2 inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-[#5B21B6] px-8 text-[14px] font-medium text-white transition hover:bg-[#4C1D95] shadow-md cursor-pointer"
            >
              Check My Wedding Loan Eligibility
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER INTEGRATIONS ──────────────────────────────────────── */}
      <ProductRelatedBlogs category="Loans" productName={page.loanType} />

      <ProductLocationDirectory
        productName={page.loanType}
        productSlug={page.loanTypeSlug}
        currentLocation={page.location}
        pages={locationPages}
      />

      <AppDownloadBanner />
    </div>
  );
}

function FormInput({
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
      <span className={`flex h-10 items-center rounded-xl border transition ${error ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-slate-50/50 focus-within:border-[#5B21B6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5B21B6]/10"}`}>
        <span className="ml-3 shrink-0 text-slate-400">{icon}</span>
        <input
          {...props}
          className="h-full min-w-0 flex-1 rounded-xl bg-transparent px-2.5 text-[12.5px] text-slate-900 outline-none placeholder:text-slate-400 font-light"
        />
      </span>
      {error && <span className="mt-1 block text-[10px] text-red-500 font-light">{error}</span>}
    </label>
  );
}

function FormSelect({
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
      <span className={`flex h-10 items-center rounded-xl border transition ${error ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-slate-50/50 focus-within:border-[#5B21B6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5B21B6]/10"}`}>
        <span className="ml-3 shrink-0 text-slate-400">{icon}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full min-w-0 flex-1 rounded-xl bg-transparent px-2.5 text-[12.5px] text-slate-900 outline-none font-light appearance-none"
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
