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
  Paintbrush,
  Percent,
  Phone,
  ShieldCheck,
  Sparkles,
  Sliders,
  User,
  Wrench,
  X,
} from "lucide-react";
import { FormEvent, InputHTMLAttributes, ReactNode, useMemo, useRef, useState, useCallback } from "react";
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

// ─── Default Renovation Lenders ────────────────────────────────────────────────
const defaultRenovationLenders: BankProductLender[] = [
  {
    bankName: "HDFC Bank Home Improvement",
    bankSlug: "hdfc-bank",
    productSlug: "renovation-loan",
    interestRate: "From 8.75% p.a.",
    processingFee: "Up to 0.5% + GST",
    loanAmount: "Up to ₹50 Lakhs",
    tenure: "Up to 15 years",
    canonicalPath: "/products/renovation-loan/hdfc-bank",
  },
  {
    bankName: "State Bank of India (SBI)",
    bankSlug: "sbi",
    productSlug: "renovation-loan",
    interestRate: "From 8.50% p.a.",
    processingFee: "Zero Processing Fee",
    loanAmount: "Up to ₹25 Lakhs",
    tenure: "Up to 10 years",
    canonicalPath: "/products/renovation-loan/sbi",
  },
  {
    bankName: "ICICI Bank Home Renovation",
    bankSlug: "icici-bank",
    productSlug: "renovation-loan",
    interestRate: "From 9.00% p.a.",
    processingFee: "0.50% to 1%",
    loanAmount: "Up to ₹35 Lakhs",
    tenure: "Up to 12 years",
    canonicalPath: "/products/renovation-loan/icici-bank",
  },
  {
    bankName: "Axis Bank Home Makeover",
    bankSlug: "axis-bank",
    productSlug: "renovation-loan",
    interestRate: "From 9.25% p.a.",
    processingFee: "Up to 1%",
    loanAmount: "Up to ₹50 Lakhs",
    tenure: "Up to 15 years",
    canonicalPath: "/products/renovation-loan/axis-bank",
  },
  {
    bankName: "Kotak Mahindra Bank",
    bankSlug: "kotak-bank",
    productSlug: "renovation-loan",
    interestRate: "From 9.50% p.a.",
    processingFee: "0.5% to 1.5%",
    loanAmount: "Up to ₹25 Lakhs",
    tenure: "Up to 7 years",
    canonicalPath: "/products/renovation-loan/kotak-bank",
  },
  {
    bankName: "Bajaj Finserv Flexi Loan",
    bankSlug: "bajaj-finserv",
    productSlug: "renovation-loan",
    interestRate: "From 11.00% p.a.",
    processingFee: "Up to 2%",
    loanAmount: "Up to ₹40 Lakhs",
    tenure: "Up to 8 years",
    canonicalPath: "/products/renovation-loan/bajaj-finserv",
  },
];

const renovationTypes = [
  "Kitchen Makeover",
  "Bathroom Upgrade",
  "Living Room Transformation",
  "Bedroom Redesign",
  "Full Home Renovation",
  "Essential Home Repairs",
  "Other Improvements",
];

const budgetOptions = [
  "Below ₹1 Lakh",
  "₹1–3 Lakhs",
  "₹3–5 Lakhs",
  "₹5–10 Lakhs",
  "₹10–20 Lakhs",
  "Above ₹20 Lakhs",
];

const employmentOptions = [
  "Salaried Employee",
  "Self-Employed Professional",
  "Business Owner",
  "Government Servant",
];

const renovationFaqs = [
  {
    question: "What is a home renovation loan?",
    answer: "A home renovation loan is a specialized financial product designed to cover expenses related to home repairs, interior remodeling, kitchen and bathroom upgrades, painting, structural alterations, and architectural improvements.",
  },
  {
    question: "Can I get a loan to renovate my existing house?",
    answer: "Yes. Both banks and specialized NBFCs offer dedicated home improvement loans or personal loans that can be used to upgrade, repair, or extend existing residential properties.",
  },
  {
    question: "Can I use a personal loan for home renovation?",
    answer: "Yes. An unsecured personal loan can be freely used for home renovation without collateral or submitting detailed contractor architecture estimates to the lender.",
  },
  {
    question: "How much renovation loan can I get?",
    answer: "Sanction amounts typically range from ₹1 Lakh up to ₹50 Lakhs (unsecured) and up to ₹1 Crore+ (secured home improvement loan), depending on applicant income, property valuation, and credit assessment.",
  },
  {
    question: "What interest rate applies to renovation loans?",
    answer: "Indicative interest rates start from around 8.50% p.a. for secured home improvement top-ups, and from 10.50% p.a. for unsecured personal renovation loans depending on your credit score and lender policies.",
  },
  {
    question: "Is collateral required for a home renovation loan?",
    answer: "Not necessarily. Unsecured renovation personal loans up to ₹40–50 Lakhs require zero collateral. Secured home improvement loans pledge the existing property for lower interest rates and longer tenures.",
  },
  {
    question: "Can I renovate a property with an existing home loan?",
    answer: "Yes. If you have an active home loan with clean repayment track record, your existing bank can issue a fast-track Home Loan Top-Up for renovation at competitive home loan interest rates.",
  },
  {
    question: "What documents are required for a renovation loan?",
    answer: "Common documents include identity proof, address proof, PAN card, last 3-6 months bank statements, salary slips or ITR, and for higher secured amounts, property title documents or contractor estimates.",
  },
  {
    question: "How is a renovation loan EMI calculated?",
    answer: "Renovation loan EMIs are calculated using standard reducing-balance monthly interest formulas based on loan principal, annual interest rate, and chosen tenure (1 to 15 years).",
  },
  {
    question: "Can I use a renovation loan for kitchen and bathroom upgrades?",
    answer: "Yes. Renovation loans cover 100% of costs associated with modular kitchen installations, tiling, sanitaryware, false ceilings, plumbing, electrical re-wiring, and custom carpentry.",
  },
  {
    question: "How long does approval and disbursal take?",
    answer: "Digital unsecured renovation loans can be pre-approved within minutes and disbursed within 24–48 hours. Secured top-up loans take 3 to 7 working days following property valuation.",
  },
  {
    question: "Are there tax benefits under Section 24(b) for home renovation?",
    answer: "Yes. Under Section 24(b) of the Income Tax Act, interest paid on a loan taken for home repair, renewal, or reconstruction is eligible for tax deduction up to ₹30,000 per year for self-occupied properties.",
  },
];

type LeadFormState = {
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  renovationBudget: string;
  renovationType: string;
  employmentType: string;
  preferredLender: string;
};

const initialLeadForm: LeadFormState = {
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  renovationBudget: "",
  renovationType: "",
  employmentType: "",
  preferredLender: "",
};

type LeadFormErrors = Partial<Record<keyof LeadFormState | "whatsappConsent", string>>;

// ─── Main Renovation Loan Page Component ───────────────────────────────────────

export function RenovationLoanPage({
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
    return defaultRenovationLenders;
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

  // Before & After comparison slider state
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Unified Calculator state
  const [propType, setPropType] = useState<"Apartment" | "House" | "Villa">("Apartment");
  const [sqft, setSqft] = useState(1000);
  const [scope, setScope] = useState<"Kitchen" | "Bathroom" | "Living Room" | "Bedroom" | "Full Home">("Full Home");
  const [finishLevel, setFinishLevel] = useState<"Essential" | "Standard" | "Premium">("Standard");
  const [calcRate, setCalcRate] = useState(9.5);
  const [calcTenureYears, setCalcTenureYears] = useState(5);

  const updateSliderPos = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
    updateSliderPos(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      updateSliderPos(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  // Form Field Updates
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
    if (!leadForm.renovationBudget) nextErrors.renovationBudget = "Select estimated budget.";
    if (!leadForm.renovationType) nextErrors.renovationType = "Select renovation type.";
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
            "Renovation Loan lead",
            `Type: ${leadForm.renovationType}`,
            `Budget: ${leadForm.renovationBudget}`,
            `Employment: ${leadForm.employmentType || "Not specified"}`,
            `Preferred Lender: ${leadForm.preferredLender || "Open to all"}`,
            `Page: ${page.canonicalPath || "/products/renovation-loan"}`,
          ].join(" | "),
          ...buildWebsiteConsentPayload("renovation_loan_marketplace"),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || "Could not submit request right now.");
      setSubmitSuccess("Renovation loan request submitted! A home makeover finance advisor will contact you within 2 hours.");
      setLeadForm(initialLeadForm);
      setWhatsappConsent(false);
      setErrors({});
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open modal with prefilled details
  const openFormWithDetails = (type?: string, budget?: string) => {
    if (type) setLeadForm((prev) => ({ ...prev, renovationType: type }));
    if (budget) setLeadForm((prev) => ({ ...prev, renovationBudget: budget }));
    setIsModalOpen(true);
  };

  // Single unified calculation engine for Renovation Budget & EMI
  const combinedCalc = useMemo(() => {
    const ratePerSqft = finishLevel === "Essential" ? 450 : finishLevel === "Standard" ? 850 : 1600;
    const scopeMultiplier = scope === "Kitchen" ? 0.3 : scope === "Bathroom" ? 0.25 : scope === "Living Room" ? 0.4 : scope === "Bedroom" ? 0.35 : 1.0;
    const propMultiplier = propType === "Apartment" ? 1.0 : propType === "House" ? 1.15 : 1.3;

    const baseCost = sqft * ratePerSqft * scopeMultiplier * propMultiplier;
    const minCost = Math.round(baseCost * 0.9);
    const maxCost = Math.round(baseCost * 1.15);
    const midpoint = Math.round((minCost + maxCost) / 2);

    const P = midpoint;
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

    return { minCost, maxCost, midpoint, emi, totalInterest, totalPayment };
  }, [propType, sqft, scope, finishLevel, calcRate, calcTenureYears]);

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
    return renovationFaqs;
  }, [page.tabs]);

  return (
    <div className="bg-white text-[#192337] font-sans antialiased">
      {/* ─── SECTION 1: PREMIUM HERO WITH BEFORE/AFTER SLIDER ON RIGHT ─── */}
      <section className="relative bg-gradient-to-b from-[#F7F3FF]/80 via-white to-slate-50/50 border-b border-purple-100/60 overflow-hidden py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left: Editorial Hero Content & Trigger Button */}
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-[40px] sm:text-[54px] lg:text-[62px] leading-[1.05] tracking-tight font-light text-slate-900">
                Your home deserves <br />
                <span className="text-[#5B21B6] font-normal">a new chapter.</span>
              </h1>

              <p className="text-[16px] sm:text-[18px] text-[#64748B] font-light leading-relaxed max-w-xl">
                From a kitchen makeover to a complete home transformation, explore renovation loan options that help bring your plans to life.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => openFormWithDetails()}
                  className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl bg-[#5B21B6] px-7 text-[14px] font-medium text-white transition hover:bg-[#4C1D95] shadow-lg shadow-purple-900/15 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Check My Renovation Loan Eligibility
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#budget-planner"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-[14px] font-medium text-slate-700 hover:border-purple-300 hover:text-[#5B21B6] transition no-underline"
                >
                  Estimate Renovation Cost
                </a>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11.5px] text-slate-400 font-light">
                <ShieldCheck className="h-4 w-4 text-purple-500 shrink-0" />
                <span>Loan eligibility, rates, and approval are subject to lender assessment.</span>
              </div>
            </div>

            {/* Right: Smooth Lag-Free Before & After Comparison Visual */}
            <div className="lg:col-span-6">
              <div className="relative space-y-3">
                <div
                  ref={sliderRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className="relative h-[380px] sm:h-[450px] lg:h-[480px] w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(91,33,182,0.14)] border border-purple-100 select-none cursor-ew-resize touch-none group"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") setSliderPos((p) => Math.max(0, p - 5));
                    if (e.key === "ArrowRight") setSliderPos((p) => Math.min(100, p + 5));
                  }}
                  aria-label="Before and after renovation interactive slider"
                >
                  {/* AFTER IMAGE (Base Layer) */}
                  <Image
                    src="/images/loans/renovation/living_room_after.jpg"
                    alt="Modern renovated Indian living room after makeover"
                    fill
                    priority
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    className="object-cover select-none pointer-events-none"
                  />

                  {/* BEFORE IMAGE (Clipped Overlay Layer) */}
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none select-none"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <div className="relative h-full w-[600px] sm:w-[800px] lg:w-[900px]">
                      <Image
                        src="/images/loans/renovation/living_room_before.jpg"
                        alt="Un-renovated original Indian living room before makeover"
                        fill
                        priority
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        className="object-cover select-none pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Draggable Vertical Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_16px_rgba(0,0,0,0.4)] z-20 pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-11 w-11 rounded-full bg-[#5B21B6] text-white flex items-center justify-center shadow-xl border-2 border-white transform transition-transform group-hover:scale-110">
                      <Sliders className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Floating Labels */}
                  <span className="absolute top-4 left-4 z-20 rounded-lg bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-xs">
                    Before
                  </span>
                  <span className="absolute top-4 right-4 z-20 rounded-lg bg-[#5B21B6]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-xs">
                    After
                  </span>

                  {/* Floating Purple Badge */}
                  <div className="absolute bottom-4 left-4 z-20 rounded-full bg-white/95 px-4 py-1.5 text-[12px] font-medium text-[#5B21B6] shadow-md backdrop-blur-md flex items-center gap-2 border border-purple-100">
                    <Sparkles className="h-3.5 w-3.5 text-[#7C3AED]" />
                    <span>Your space. Reimagined.</span>
                  </div>
                </div>

                <p className="text-center text-[12px] text-slate-400 font-light flex items-center justify-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-purple-400" />
                  Drag handle left/right to compare before and after makeover
                </p>
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
            {/* Modal Header */}
            <div className="bg-[#5B21B6] p-6 text-white flex items-start justify-between shrink-0">
              <div>
                <span className="text-[10px] tracking-[0.16em] uppercase text-purple-200 font-medium">Fast Eligibility Check</span>
                <h2 className="text-[22px] font-normal text-white tracking-tight mt-0.5">Plan Your Home Makeover</h2>
                <p className="mt-1 text-[12.5px] text-purple-100/90 font-light leading-relaxed">
                  Tell us about your renovation plans and explore suitable financing options.
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

            {/* Modal Body / Structured Form */}
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
                <RenoInput
                  label="Full Name"
                  value={leadForm.fullName}
                  error={errors.fullName}
                  icon={<User className="h-3.5 w-3.5" />}
                  placeholder="Enter full name"
                  onChange={(e) => updateField("fullName", e.target.value)}
                />
                <RenoInput
                  label="Mobile Number"
                  value={leadForm.mobile}
                  error={errors.mobile}
                  icon={<Phone className="h-3.5 w-3.5" />}
                  placeholder="9876543210"
                  maxLength={14}
                  onChange={(e) => updateField("mobile", e.target.value)}
                />
                <RenoInput
                  label="Email Address"
                  value={leadForm.email}
                  error={errors.email}
                  icon={<Mail className="h-3.5 w-3.5" />}
                  placeholder="name@example.com"
                  onChange={(e) => updateField("email", e.target.value)}
                />
                <RenoInput
                  label="Current City"
                  value={leadForm.city}
                  error={errors.city}
                  icon={<MapPin className="h-3.5 w-3.5" />}
                  placeholder="Enter city"
                  onChange={(e) => updateField("city", e.target.value)}
                />

                <RenoSelect
                  label="Renovation Type"
                  value={leadForm.renovationType}
                  error={errors.renovationType}
                  icon={<Paintbrush className="h-3.5 w-3.5" />}
                  placeholder="Select makeover type"
                  options={renovationTypes}
                  onChange={(v) => updateField("renovationType", v)}
                />

                <RenoSelect
                  label="Estimated Budget"
                  value={leadForm.renovationBudget}
                  error={errors.renovationBudget}
                  icon={<BadgeIndianRupee className="h-3.5 w-3.5" />}
                  placeholder="Select budget range"
                  options={budgetOptions}
                  onChange={(v) => updateField("renovationBudget", v)}
                />

                <div className="sm:col-span-2">
                  <RenoSelect
                    label="Employment Type"
                    optional
                    value={leadForm.employmentType}
                    icon={<Building className="h-3.5 w-3.5" />}
                    placeholder="Select occupation status"
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
                        Get My Renovation Loan Options
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-center text-[10.5px] text-slate-400 font-light">
                    100% Free • Soft check • No impact on credit score
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 2: RENOVATION POSSIBILITIES GALLERY ────────────────── */}
      <section className="py-14 lg:py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-semibold mb-2">Transformative Spaces</p>
            <h2 className="text-[30px] sm:text-[40px] font-light tracking-tight text-slate-900 leading-[1.12]">
              One home. Endless possibilities.
            </h2>
            <p className="mt-2 text-[15px] text-slate-500 font-light">
              Explore the spaces you can transform with a home renovation loan tailored to your style and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Kitchen Makeover",
                desc: "Upgrade to sleek modular cabinets, quartz countertops, and smart chimneys.",
                img: "/images/loans/renovation/renovated_kitchen.jpg",
                type: "Kitchen Makeover",
                budget: "₹3–5 Lakhs",
              },
              {
                title: "Bathroom Upgrade",
                desc: "Transform outdated bathrooms with premium marble tiling and rain showers.",
                img: "/images/loans/renovation/modern_bathroom.jpg",
                type: "Bathroom Upgrade",
                budget: "₹1–3 Lakhs",
              },
              {
                title: "Living Room Transformation",
                desc: "Create inviting living areas with wooden panelling and cove lighting.",
                img: "/images/loans/renovation/contemporary_living.jpg",
                type: "Living Room Transformation",
                budget: "₹3–5 Lakhs",
              },
              {
                title: "Bedroom Redesign",
                desc: "Craft peaceful master bedrooms with velvet headboards and cozy window nooks.",
                img: "/images/loans/renovation/elegant_bedroom.jpg",
                type: "Bedroom Redesign",
                budget: "₹1–3 Lakhs",
              },
              {
                title: "Complete Home Renovation",
                desc: "Full penthouse & apartment remodeling from floor layouts to interior decor.",
                img: "/images/loans/renovation/full_home_renovation.jpg",
                type: "Full Home Renovation",
                budget: "Above ₹20 Lakhs",
              },
              {
                title: "Essential Home Repairs",
                desc: "Address structural fixes, waterproofing, rewiring, and custom carpentry.",
                img: "/images/loans/renovation/home_repairs.jpg",
                type: "Essential Home Repairs",
                budget: "₹1–3 Lakhs",
              },
            ].map((cat, idx) => (
              <div
                key={idx}
                onClick={() => openFormWithDetails(cat.type, cat.budget)}
                className="group relative rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-purple-200 transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-[220px] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={cat.img}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[18px] font-medium text-slate-900 group-hover:text-[#5B21B6] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] text-slate-500 font-light leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[12.5px] font-medium text-[#5B21B6]">
                    <span>Explore Financing</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: UNIFIED RENOVATION BUDGET & EMI CALCULATOR ─────── */}
      <section id="budget-planner" className="py-10 sm:py-14 bg-[#F7F3FF]/40 border-b border-purple-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-semibold mb-2">Smart Renovation Planner</p>
            <h2 className="text-[30px] sm:text-[40px] font-light tracking-tight text-slate-900 leading-[1.12]">
              What will your makeover cost? Plan your EMI.
            </h2>
            <p className="mt-2 text-[15px] text-slate-500 font-light">
              Configure your property area, finish preferences, interest rate, and tenure to estimate overall makeover costs and monthly repayment requirements.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-[0_16px_40px_rgba(91,33,182,0.06)]">
            {/* Inputs Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Property Type */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-2">Property Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Apartment", "House", "Villa"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPropType(t)}
                      className={`py-2.5 px-3 rounded-xl text-[12.5px] font-medium border transition cursor-pointer ${
                        propType === t
                          ? "bg-[#5B21B6] text-white border-[#5B21B6]"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[12px] font-medium text-slate-700">Property Area (sq.ft)</label>
                  <span className="text-[14px] font-semibold text-[#5B21B6]">{sqft.toLocaleString()} sq.ft</span>
                </div>
                <input
                  type="range"
                  min={400}
                  max={4000}
                  step={50}
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-purple-100 accent-[#5B21B6] cursor-pointer"
                />
              </div>

              {/* Scope & Finish Level */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-2">Renovation Scope</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as any)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12.5px] text-slate-800 outline-none focus:border-[#5B21B6]"
                  >
                    <option value="Full Home">Full Home</option>
                    <option value="Kitchen">Kitchen Makeover</option>
                    <option value="Bathroom">Bathroom Upgrade</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Bedroom">Bedroom Redesign</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-2">Finish Level</label>
                  <select
                    value={finishLevel}
                    onChange={(e) => setFinishLevel(e.target.value as any)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12.5px] text-slate-800 outline-none focus:border-[#5B21B6]"
                  >
                    <option value="Essential">Essential (Basic repaint & fixes)</option>
                    <option value="Standard">Standard (Modular fittings & decor)</option>
                    <option value="Premium">Premium (Luxury marble & woodwork)</option>
                  </select>
                </div>
              </div>

              {/* Sliders for Interest & Tenure */}
              <div className="grid sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[12px] font-medium text-slate-700">Interest Rate (p.a.)</label>
                    <span className="text-[13.5px] font-semibold text-[#5B21B6]">{calcRate.toFixed(2)}%</span>
                  </div>
                  <input
                    type="range"
                    min={8.5}
                    max={18}
                    step={0.25}
                    value={calcRate}
                    onChange={(e) => setCalcRate(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-purple-100 accent-[#5B21B6] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[12px] font-medium text-slate-700">Tenure (Years)</label>
                    <span className="text-[13.5px] font-semibold text-[#5B21B6]">{calcTenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    step={1}
                    value={calcTenureYears}
                    onChange={(e) => setCalcTenureYears(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-purple-100 accent-[#5B21B6] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Display Column */}
            <div className="lg:col-span-5 bg-[#5B21B6] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-purple-200 font-medium">Estimated Makeover Budget</span>
                <p className="text-[28px] sm:text-[34px] font-semibold text-white tracking-tight mt-1">
                  ₹{(combinedCalc.minCost / 100000).toFixed(2)}L – ₹{(combinedCalc.maxCost / 100000).toFixed(2)} Lakhs
                </p>
                <p className="text-[12px] text-purple-100/80 font-light mt-1">
                  Based on {sqft} sq.ft area ({scope.toLowerCase()}, {finishLevel.toLowerCase()} finish).
                </p>
              </div>

              <div className="space-y-3 border-t border-purple-400/30 pt-4 text-[13px]">
                <div className="flex justify-between items-center text-purple-100">
                  <span>Estimated Monthly EMI</span>
                  <span className="font-bold text-white text-[20px]">₹{combinedCalc.emi.toLocaleString()} <span className="text-[12px] font-normal text-purple-200">/ mo</span></span>
                </div>
                <div className="flex justify-between text-[#E9D5FF] text-[12px]">
                  <span>Total Payable ({calcTenureYears} yrs)</span>
                  <span className="font-medium text-white">₹{combinedCalc.totalPayment.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const bStr = combinedCalc.maxCost > 2000000 ? "Above ₹20 Lakhs" : combinedCalc.maxCost > 1000000 ? "₹10–20 Lakhs" : combinedCalc.maxCost > 500000 ? "₹5–10 Lakhs" : "₹3–5 Lakhs";
                  openFormWithDetails(scope === "Full Home" ? "Full Home Renovation" : `${scope} Makeover`, bStr);
                }}
                className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-[#5B21B6] font-medium text-[13.5px] hover:bg-purple-50 transition cursor-pointer shadow-md"
              >
                Get My Renovation Loan Options
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-[10.5px] text-purple-200/70 font-light leading-relaxed">
                *Illustrative estimate for planning. Final rate & loan terms subject to lender policy and contractor quote.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: ENHANCED WHY CHOOSE FINTARAA ─────────────────────── */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-semibold mb-2">Why Choose Fintaraa</p>
            <h2 className="text-[32px] sm:text-[42px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Your renovation plans deserve <br />
              <span className="text-[#5B21B6] font-normal">the right financing.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: "Compare Partner Lenders",
                desc: "Explore indicative rates and flexible terms from top banks and NBFCs in a single digital marketplace.",
                icon: <Building2 className="h-6 w-6 text-[#5B21B6]" />,
              },
              {
                num: "02",
                title: "Flexible Repayment",
                desc: "Select customized tenures up to 15 years to align with your personal cash flow and monthly budget.",
                icon: <Clock className="h-6 w-6 text-[#5B21B6]" />,
              },
              {
                num: "03",
                title: "Secured & Collateral-Free",
                desc: "Choose fast-track personal renovation loans or low-rate home improvement top-ups based on your preference.",
                icon: <ShieldCheck className="h-6 w-6 text-[#5B21B6]" />,
              },
              {
                num: "04",
                title: "End-to-End Guidance",
                desc: "Get expert assistance through application submission, documentation checks, and final lender approval.",
                icon: <Compass className="h-6 w-6 text-[#5B21B6]" />,
              },
            ].map((f) => (
              <div
                key={f.num}
                className="group relative rounded-3xl border border-purple-100 bg-gradient-to-b from-purple-50/40 via-white to-white p-7 transition-all duration-300 hover:shadow-xl hover:border-purple-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-purple-100/70 text-[#5B21B6] flex items-center justify-center transition-transform group-hover:scale-110">
                      {f.icon}
                    </div>
                    <span className="text-[20px] font-light text-purple-300 font-mono">{f.num}</span>
                  </div>
                  <h3 className="text-[18px] font-medium text-slate-900 group-hover:text-[#5B21B6] transition-colors">{f.title}</h3>
                  <p className="mt-2.5 text-[13.5px] text-slate-500 font-light leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: RENOVATION LOAN COMPARISON MARKETPLACE ──────────── */}
      <section className="py-10 sm:py-14 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-semibold mb-2">Partner Directory</p>
              <h2 className="text-[30px] sm:text-[38px] font-light tracking-tight text-slate-900 leading-[1.12]">
                Compare renovation loan options.
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {filteredLenders.map((lender) => (
              <div
                key={lender.bankSlug || lender.bankName}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[160px_1fr_1fr_1fr_1fr_auto] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-purple-300 hover:shadow-xs"
              >
                <div className="flex items-center">
                  <div className="relative flex h-14 w-36 sm:w-44 shrink-0 items-center justify-start py-1">
                    <Image
                      src={lender.logoUrl || getBankLogoPath(lender.bankSlug, lender.bankName)}
                      alt={lender.bankName}
                      width={160}
                      height={48}
                      className="max-h-11 w-auto max-w-[150px] object-contain"
                      unoptimized
                    />
                  </div>
                </div>

                <div>
                  <p className="text-[9.5px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Indicative Rate</p>
                  <p className="text-[13px] text-slate-800 font-medium">{lender.interestRate || "—"}</p>
                </div>

                <div>
                  <p className="text-[9.5px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Max Loan Amount</p>
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
                    Get callback
                  </button>
                  <AuthRedirectLink
                    href={getApplyHref({
                      category: "loan",
                      productSlug: "renovation-loan",
                      bankSlug: lender.bankSlug,
                      referrer: lender.canonicalPath || "/products/renovation-loan",
                    })}
                    productSlug="renovation-loan"
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#5B21B6] px-4 text-[11.5px] text-white no-underline hover:bg-[#4C1D95] transition font-medium whitespace-nowrap"
                  >
                    Apply now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </AuthRedirectLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: RENOVATION FINANCING GUIDE (SEO) ───────────────── */}
      <section className="py-10 sm:py-14 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-semibold mb-2">Comprehensive Guide</p>
            <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900">
              Home Renovation Loan in India: What You Need to Know
            </h2>
          </div>

          <div className="prose prose-slate max-w-none text-[14.5px] text-slate-600 font-light leading-relaxed space-y-6">
            <p>
              Renovating your home is one of the most rewarding investments you can make to enhance living comfort, modernise interior aesthetics, and increase overall real estate market value. Whether you are planning a modern modular kitchen upgrade, a luxury bathroom makeover, complete living room wood panelling, or essential structural repairs, a home renovation loan provides dedicated capital without straining your emergency savings.
            </p>

            <h3 className="text-[20px] font-medium text-slate-900 mt-6 mb-2">Types of Home Renovation Loans</h3>
            <p>
              In India, borrowers generally choose between two primary renovation financing structures:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Unsecured Personal Renovation Loans:</strong> Quick, paperless personal loans requiring zero collateral. Ideal for interior decor, painting, modular furniture, and minor repairs up to ₹40–50 Lakhs with tenure up to 7 years.
              </li>
              <li>
                <strong>Secured Home Improvement Loans / Top-Ups:</strong> Loans backed by the existing residential property (or an existing active home loan). These offer lower interest rates (starting around 8.50% p.a.) and extended repayment tenures up to 15 years for major structural overhauls.
              </li>
            </ul>

            <h3 className="text-[20px] font-medium text-slate-900 mt-6 mb-2">Tax Benefits Under Section 24(b)</h3>
            <p>
              Under Section 24(b) of the Income Tax Act, interest paid on a loan taken for the purpose of home repair, renewal, or reconstruction is eligible for tax deduction up to <strong>₹30,000 per financial year</strong> for self-occupied properties. This provides tangible annual tax savings throughout your repayment tenure.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: HOW TO APPLY ─────────────────────────────────────── */}
      <section className="py-10 sm:py-14 bg-[#F7F3FF]/40 border-b border-purple-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-semibold mb-2">Application Journey</p>
            <h2 className="text-[30px] sm:text-[40px] font-light tracking-tight text-slate-900 leading-[1.12]">
              From renovation plans to financing options.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {[
              { num: "01", title: "Share your plans", desc: "Fill out the quick makeover enquiry form with your budget & scope." },
              { num: "02", title: "Explore options", desc: "Compare indicative rates, tenures, and fees from top lenders." },
              { num: "03", title: "Verify eligibility", desc: "Complete basic income and document checks with guidance." },
              { num: "04", title: "Proceed with lender", desc: "Review your final loan offer and receive funds for your makeover." },
            ].map((step, idx) => (
              <div key={idx} className="rounded-2xl border border-purple-100 bg-white p-6 relative shadow-xs">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#5B21B6] font-semibold text-[13px] mb-4">
                  {step.num}
                </span>
                <h3 className="text-[16px] font-medium text-slate-900">{step.title}</h3>
                <p className="mt-2 text-[13px] text-slate-500 font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: ELIGIBILITY AND DOCUMENTS ───────────────────────── */}
      <section className="py-10 sm:py-14 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-semibold mb-2">Requirements</p>
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
                  "Age: 21 to 65 years at loan maturity",
                  "Minimum monthly net salary of ₹25,000 (Salaried)",
                  "Minimum annual net profit of ₹3 Lakhs (Self-employed)",
                  "Credit Score: CIBIL score of 720+ preferred",
                  "Minimum 1-2 years employment/business continuity",
                  "Property Ownership or co-ownership proof where applicable",
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
                  "Identity Proof (Aadhaar, PAN, Passport, Voter ID)",
                  "Address Proof (Utility Bill, Rental Agreement, Aadhaar)",
                  "Last 3 months salary slips & Form 16 (Salaried)",
                  "Last 2 years ITR with computation & P&L (Self-Employed)",
                  "Last 6 months bank statement showing income credit",
                  "Contractor estimate or property deed (if required by lender)",
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

      {/* ─── SECTION 9: FAQ ────────────────────────────────────────────── */}
      <LoanFAQSection faqs={faqItems} title="Home renovation loan — questions answered" />

      {/* ─── SECTION 10: FINAL CONVERSION SECTION ──────────────────────── */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white via-[#F7F3FF]/60 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-purple-100 bg-white overflow-hidden p-8 sm:p-12 lg:p-16 shadow-[0_20px_60px_rgba(91,33,182,0.08)]">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-semibold">New Beginnings</span>
                <h2 className="text-[32px] sm:text-[44px] font-light tracking-tight text-slate-900 leading-[1.12]">
                  Ready to give your home <br />
                  <span className="text-[#5B21B6] font-normal">a new beginning?</span>
                </h2>
                <p className="text-[15px] text-slate-500 font-light max-w-xl">
                  Explore custom financing options for your renovation plans with Fintaraa today.
                </p>
                <button
                  type="button"
                  onClick={() => openFormWithDetails()}
                  className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#5B21B6] px-6 text-[13.5px] font-medium text-white transition hover:bg-[#4C1D95] shadow-sm cursor-pointer"
                >
                  Explore My Renovation Loan Options
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="lg:col-span-5 relative h-[260px] lg:h-[300px] w-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/loans/renovation/renovated_home_hero_bg.jpg"
                  alt="Beautiful renovated modern villa home exterior"
                  fill
                  sizes="(max-width: 1200px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
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

// ─── Helper Form Controls ──────────────────────────────────────────────────────

function RenoInput({
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

function RenoSelect({
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
