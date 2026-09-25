"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BadgeCheck,
  BadgeIndianRupee,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Compass,
  FileCheck2,
  FileSpreadsheet,
  Globe2,
  GraduationCap,
  HelpCircle,
  Info,
  Landmark,
  Loader2,
  Mail,
  MapPin,
  Percent,
  Phone,
  Plane,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { FormEvent, InputHTMLAttributes, ReactNode, useMemo, useRef, useState } from "react";
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
import { EducationHeroBackground } from "./EducationHeroBackground";
import { buildApiUrl } from "@/services/apiUrl";
import type {
  LoanSeoLocationPage,
  LoanSeoPageData,
} from "@/services/loanSeoPages";
import type { BankProductLender } from "@/services/bankSeoPages";

// ─── Data & Helpers ────────────────────────────────────────────────────────────

const nameRegex = /^[A-Za-z\s.]{2,60}$/;
const mobileRegex = /^[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cityRegex = /^[A-Za-z\s.-]{2,50}$/;

const defaultEducationLenders: BankProductLender[] = [
  {
    bankName: "HDFC Credila",
    bankSlug: "hdfc-credila",
    productSlug: "education-loan",
    interestRate: "From 9.25% p.a.",
    processingFee: "Up to 1% + GST",
    loanAmount: "Up to ₹1.5 Crore",
    tenure: "Up to 15 years",
    canonicalPath: "/products/education-loan/hdfc-credila",
  },
  {
    bankName: "State Bank of India (SBI)",
    bankSlug: "sbi",
    productSlug: "education-loan",
    interestRate: "From 8.15% p.a.",
    processingFee: "Zero for India / ₹10,000 Overseas",
    loanAmount: "Up to ₹1.5 Crore",
    tenure: "Up to 15 years",
    canonicalPath: "/products/education-loan/sbi",
  },
  {
    bankName: "Avanse Financial Services",
    bankSlug: "avanse",
    productSlug: "education-loan",
    interestRate: "From 9.75% p.a.",
    processingFee: "1% to 1.5%",
    loanAmount: "100% Uncapped",
    tenure: "Up to 15 years",
    canonicalPath: "/products/education-loan/avanse",
  },
  {
    bankName: "Auxilo Finserve",
    bankSlug: "auxilo",
    productSlug: "education-loan",
    interestRate: "From 10.25% p.a.",
    processingFee: "1% to 2%",
    loanAmount: "Up to ₹1 Crore",
    tenure: "Up to 12 years",
    canonicalPath: "/products/education-loan/auxilo",
  },
  {
    bankName: "Bank of Baroda",
    bankSlug: "bank-of-baroda",
    productSlug: "education-loan",
    interestRate: "From 8.50% p.a.",
    processingFee: "Zero for Premier Colleges",
    loanAmount: "Up to ₹1.5 Crore",
    tenure: "Up to 15 years",
    canonicalPath: "/products/education-loan/bank-of-baroda",
  },
  {
    bankName: "InCred Education Loans",
    bankSlug: "incred",
    productSlug: "education-loan",
    interestRate: "From 10.50% p.a.",
    processingFee: "1% to 1.5%",
    loanAmount: "Up to ₹75 Lakhs (Collateral Free)",
    tenure: "Up to 12 years",
    canonicalPath: "/products/education-loan/incred",
  },
  {
    bankName: "Canara Bank",
    bankSlug: "canara-bank",
    productSlug: "education-loan",
    interestRate: "From 8.70% p.a.",
    processingFee: "Nil up to ₹4 Lakhs",
    loanAmount: "Up to ₹80 Lakhs",
    tenure: "Up to 15 years",
    canonicalPath: "/products/education-loan/canara-bank",
  },
  {
    bankName: "Axis Bank Education Loan",
    bankSlug: "axis-bank",
    productSlug: "education-loan",
    interestRate: "From 9.50% p.a.",
    processingFee: "Up to 1%",
    loanAmount: "Up to ₹75 Lakhs (No Collateral)",
    tenure: "Up to 15 years",
    canonicalPath: "/products/education-loan/axis-bank",
  },
];

const destinationTabs = [
  {
    id: "india",
    name: "Study in India (IIT/IIM/NIT)",
    flag: "🇮🇳",
    maxLimit: "Up to ₹50 Lakhs",
    collateralFree: "Up to ₹40 Lakhs",
    avgInterest: "8.15% - 9.75%",
    livingCostCover: "Hostel & Laptop Allowance",
    keyPoints: [
      "Zero processing fee for Premier Tier-1 Institutes (IIT, IIM, ISB, AIIMS)",
      "Concessional interest rates for female students (0.50% concession)",
      "Central Government Interest Subsidy (CSIS) for eligible income groups",
    ],
  },
  {
    id: "usa",
    name: "Study in USA",
    flag: "🇺🇸",
    maxLimit: "Up to ₹1.5 Crore",
    collateralFree: "Up to ₹75 Lakhs",
    avgInterest: "9.25% - 11.50%",
    livingCostCover: "100% Covered",
    keyPoints: [
      "STEM OPT extension supported",
      "Pre-visa sanction letter issued in 48 hours",
      "Co-applicant income waiver available for Top 100 US universities",
    ],
  },
  {
    id: "uk",
    name: "Study in UK",
    flag: "🇬🇧",
    maxLimit: "Up to ₹1 Crore",
    collateralFree: "Up to ₹60 Lakhs",
    avgInterest: "9.50% - 11.75%",
    livingCostCover: "CAS & Maintenance Fund covered",
    keyPoints: [
      "Covers UKVI Visa Maintenance Proof Requirement",
      "Direct university fee disbursement",
      "2-Year Graduate Post-Study Work Visa eligible programs",
    ],
  },
  {
    id: "canada",
    name: "Study in Canada",
    flag: "🇨🇦",
    maxLimit: "Up to ₹85 Lakhs",
    collateralFree: "Up to ₹50 Lakhs",
    avgInterest: "9.25% - 11.25%",
    livingCostCover: "GIC & Living Expense fund pre-credited",
    keyPoints: [
      "Guaranteed Investment Certificate (GIC) funding support",
      "PGWP (Post-Graduation Work Permit) university eligibility",
      "Flexible moratorium up to 1 year post course",
    ],
  },
  {
    id: "germany",
    name: "Study in Germany & Europe",
    flag: "🇩🇪",
    maxLimit: "Up to ₹75 Lakhs",
    collateralFree: "Up to ₹45 Lakhs",
    avgInterest: "8.50% - 10.75%",
    livingCostCover: "Blocked Account Funding",
    keyPoints: [
      "Covers German Blocked Account (Sperrkonto) pre-deposit",
      "Zero or low public university tuition fee advantage",
      "Schengen work permit programs supported",
    ],
  },
];

const degreeOptions = [
  "Postgraduate / Master's (MS/MBA/MA)",
  "Undergraduate / Bachelor's (BS/BTech)",
  "Executive MBA / Certificate",
  "Doctorate / PhD",
  "Vocational / Pilot Training / Medical Residency",
];

const countryOptions = [
  "United States (USA)",
  "United Kingdom (UK)",
  "Canada",
  "Germany / Europe",
  "Australia & NZ",
  "India (IIT/IIM/Private)",
  "Other Overseas",
];

const amountOptions = [
  "Up to ₹20 Lakhs",
  "₹20 Lakhs – ₹40 Lakhs",
  "₹40 Lakhs – ₹75 Lakhs",
  "Above ₹75 Lakhs",
];

const intakeOptions = [
  "Fall 2026 (Aug - Oct)",
  "Spring 2027 (Jan - Mar)",
  "Summer 2027",
  "Immediate Intake",
];

const educationFaqs = [
  {
    question: "What expenses are covered under an education loan through Fintaraa?",
    answer:
      "Education loans cover 100% of legitimate academic costs: university tuition fees, hostel/accommodation fees, examination and library charges, laboratory fees, books and equipment (including laptops), travel passages for overseas study, student visa fees, health insurance, and GIC/Blocked Account mandatory deposits.",
  },
  {
    question: "Can I get an education loan without collateral?",
    answer:
      "Yes. Non-collateral (unsecured) education loans are available up to ₹75 Lakhs for STEM and top-ranked global universities, and up to ₹40 Lakhs for premier Indian institutes (IITs, IIMs, ISB). Sanction approval depends on student academic profile, GRE/GMAT scores, university global ranking, and co-applicant (parent) creditworthiness.",
  },
  {
    question: "What is the Moratorium Period and how does ₹0 EMI work?",
    answer:
      "The moratorium (grace) period is the timeframe during which the student is enrolled in the course plus 6 to 12 months after graduation (or obtaining employment). During moratorium, students are NOT required to pay principal EMI. Lenders offer choices of ₹0 payment, partial interest, or simple interest payment during course duration.",
  },
  {
    question: "How does Section 80E tax deduction benefit parents or students?",
    answer:
      "Under Section 80E of the Income Tax Act, 100% of the interest paid on an education loan for higher studies is eligible for tax deduction. There is NO upper limit on the deduction amount. This benefit can be claimed by the parent or student (whichever is the primary borrower) for up to 8 consecutive assessment years.",
  },
  {
    question: "Can I receive a Pre-Visa Sanction Letter before university admission or visa interview?",
    answer:
      "Yes. Fintaraa partner lenders issue a formal Pre-Visa Sanction Letter prior to final university fee payment or embassy visa interviews. This document serves as official financial proof for US i-20, UK CAS, Canadian Student Direct Stream (SDS), and German student visa approvals.",
  },
];

const mythsList = [
  {
    myth: "You must pledge a house or property to get any education loan above ₹10 Lakhs.",
    reality: "False. Specialized education NBFCs and partner banks provide up to ₹75 Lakhs 100% collateral-free loans for accredited global universities based on student merit and co-applicant income.",
  },
  {
    myth: "Parents must start paying heavy monthly EMIs immediately while the child is studying.",
    reality: "False. Education loans feature a mandatory moratorium period covering the full course duration plus up to 1 year grace period post-graduation before principal EMI payments commence.",
  },
  {
    myth: "Section 80E tax deduction has a maximum cap of ₹1.5 Lakhs like Section 80C.",
    reality: "False. Section 80E has NO ceiling cap. 100% of the interest paid during the year is deductible from taxable income for 8 years, yielding substantial tax savings for 30% slab earners.",
  },
];

type LeadFormState = {
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  destination: string;
  degreeLevel: string;
  loanAmount: string;
  intakePeriod: string;
  preferredLender: string;
};

const initialLeadForm: LeadFormState = {
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  destination: "",
  degreeLevel: "",
  loanAmount: "",
  intakePeriod: "",
  preferredLender: "",
};

type LeadFormErrors = Partial<Record<keyof LeadFormState | "whatsappConsent", string>>;

// ─── Component ────────────────────────────────────────────────────────────────

export function EducationLoanPage({
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
    return defaultEducationLenders;
  }, [lenders]);

  const [search, setSearch] = useState("");
  const [activeDest, setActiveDest] = useState("india");
  const [leadForm, setLeadForm] = useState(initialLeadForm);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [docTab, setDocTab] = useState<"student" | "parent" | "collateral">("student");
  const [openMythIndex, setOpenMythIndex] = useState<number | null>(0);
  const leadFormRef = useRef<HTMLDivElement>(null);

  const filteredLenders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return displayLenders;
    return displayLenders.filter((l) =>
      [l.bankName, l.interestRate, l.loanAmount, l.tenure].join(" ").toLowerCase().includes(q)
    );
  }, [displayLenders, search]);

  const selectedDest = useMemo(
    () => destinationTabs.find((d) => d.id === activeDest) || destinationTabs[0],
    [activeDest]
  );

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
    if (!leadForm.destination) nextErrors.destination = "Select study destination.";
    if (!leadForm.loanAmount) nextErrors.loanAmount = "Select required loan amount.";
    if (!whatsappConsent) nextErrors.whatsappConsent = "Please accept the communication consent.";
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
            "Education Loan lead",
            `Destination: ${leadForm.destination}`,
            `Degree: ${leadForm.degreeLevel || "Not specified"}`,
            `Amount: ${leadForm.loanAmount}`,
            `Intake: ${leadForm.intakePeriod || "Not specified"}`,
            `Preferred Lender: ${leadForm.preferredLender || "Open to all"}`,
            `Page: ${page.canonicalPath || "/products/education-loan"}`,
          ].join(" | "),
          ...buildWebsiteConsentPayload("education_loan_marketplace"),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || "Could not submit request right now.");
      setSubmitSuccess("Education loan request submitted successfully! An education loan advisor will contact you within 2 hours.");
      setLeadForm(initialLeadForm);
      setWhatsappConsent(false);
      setErrors({});
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestLenderCallback = (lender: BankProductLender) => {
    setLeadForm((prev) => ({ ...prev, preferredLender: lender.bankName }));
    if (leadFormRef.current) {
      leadFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqItems = useMemo(() => {
    const fromPage = page.tabs
      .flatMap((t) => t.faqs || [])
      .filter((faq, index, items) => items.findIndex((i) => i.question === faq.question) === index);
    if (fromPage.length > 0) return fromPage;
    return educationFaqs;
  }, [page.tabs]);

  return (
    <div className="bg-[#fafbfc] text-slate-900 font-sans antialiased">
      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-slate-100 overflow-hidden">
        {/* Animated 3D Floating Student & Destination Background Layer */}
        <EducationHeroBackground />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10 lg:py-14 relative z-10">
          <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
            {/* Left hero column */}
            <div className="max-w-2xl pt-8 lg:pt-16">
              <h1 className="text-[36px] sm:text-[48px] lg:text-[54px] leading-[1.08] tracking-[-0.03em] text-slate-900 font-light">
                Fund your ambition.<br />
                <span className="text-[#5b21b6] font-normal">Not your doubts.</span>
              </h1>

              <p className="mt-4 text-[16px] leading-[1.7] text-slate-500 max-w-xl font-light">
                Compare education loans from 25+ top banks & specialized NBFCs. Get 100% tuition + living expense coverage, pre-visa sanction letters, and zero EMI during your study duration.
              </p>

              {/* Key Highlights Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
                {[
                  { title: "Up to ₹1.5 Crore", desc: "Max Sanction Limit" },
                  { title: "Zero Collateral", desc: "Up to ₹75 Lakhs" },
                  { title: "Pre-Visa Sanction", desc: "Valid for i-20 / CAS / SDS" },
                  { title: "100% Tax Benefit", desc: "Sec 80E No Upper Cap" },
                  { title: "Moratorium Period", desc: "Pay ₹0 EMI while studying" },
                  { title: "Starting 8.15%", desc: "Concessions for Women" },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                    <p className="text-[13px] font-semibold text-[#5b21b6]">{item.title}</p>
                    <p className="text-[11px] text-slate-500 font-light mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Trust Badge */}
              <div className="mt-8 flex items-center gap-4 flex-wrap text-[13px] text-slate-500 font-light">
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>RBI Regulated Lenders Only</span>
                </div>
                <span>•</span>
                <span>Pre-Visa Proof of Funds</span>
                <span>•</span>
                <span>Direct University Disbursal</span>
              </div>
            </div>

            {/* Right lead form card — Unique Header Design */}
            <div
              ref={leadFormRef}
              id="education-loan-lead-form"
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-[0_8px_30px_rgb(49,46,129,0.06)]"
            >
              {/* Form Top Accent Header */}
              <div className="bg-[#5b21b6] p-5 sm:p-6 text-white relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.14em] uppercase text-purple-200 font-medium">Free Expert Callback</span>
                </div>
                <h2 className="text-[20px] text-white font-normal tracking-tight mt-1.5">Check Education Loan Eligibility</h2>
                <p className="mt-1 text-[12px] text-purple-100/80 font-light leading-relaxed">
                  Get matched with top lenders for highest sanction limits & moratorium terms.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6 grid gap-3 sm:grid-cols-2 bg-white">
                <EduFormInput
                  label="Full Name"
                  value={leadForm.fullName}
                  error={errors.fullName}
                  icon={<User className="h-3.5 w-3.5" />}
                  placeholder="Student or parent name"
                  onChange={(e) => updateField("fullName", e.target.value)}
                />
                <EduFormInput
                  label="Mobile Number"
                  value={leadForm.mobile}
                  error={errors.mobile}
                  icon={<Phone className="h-3.5 w-3.5" />}
                  placeholder="9876543210"
                  maxLength={14}
                  onChange={(e) => updateField("mobile", e.target.value)}
                />
                <EduFormInput
                  label="Email Address"
                  value={leadForm.email}
                  error={errors.email}
                  icon={<Mail className="h-3.5 w-3.5" />}
                  placeholder="name@example.com"
                  onChange={(e) => updateField("email", e.target.value)}
                />
                <EduFormInput
                  label="Current City"
                  value={leadForm.city}
                  error={errors.city}
                  icon={<MapPin className="h-3.5 w-3.5" />}
                  placeholder="Enter city"
                  onChange={(e) => updateField("city", e.target.value)}
                />

                <EduFormSelect
                  label="Study Destination"
                  value={leadForm.destination}
                  error={errors.destination}
                  icon={<Globe2 className="h-3.5 w-3.5" />}
                  placeholder="Select destination"
                  options={countryOptions}
                  onChange={(v) => updateField("destination", v)}
                />
                <EduFormSelect
                  label="Required Loan Amount"
                  value={leadForm.loanAmount}
                  error={errors.loanAmount}
                  icon={<BadgeIndianRupee className="h-3.5 w-3.5" />}
                  placeholder="Select amount"
                  options={amountOptions}
                  onChange={(v) => updateField("loanAmount", v)}
                />

                <div className="sm:col-span-2">
                  <EduFormSelect
                    label="Degree Level"
                    optional
                    value={leadForm.degreeLevel}
                    icon={<GraduationCap className="h-3.5 w-3.5" />}
                    placeholder="Select degree / course level"
                    options={degreeOptions}
                    onChange={(v) => updateField("degreeLevel", v)}
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

                <div className="sm:col-span-2 mt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#5b21b6] px-5 text-[13px] font-medium text-white transition hover:bg-[#4c1d95] disabled:opacity-60 cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Finding best offers...
                      </>
                    ) : (
                      <>
                        Get Custom Education Offers
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-center text-[10.5px] text-slate-400 font-light">
                    100% Free • No impact on CIBIL score • Pre-visa approval guidance
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STUDY DESTINATION BREAKDOWN ──────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#5b21b6] mb-2 font-medium">Study Abroad & India</p>
            <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Loans Tailored to Your Study Destination
            </h2>
            <p className="mt-2 text-[14px] text-slate-500 font-light">
              Sanction limits, collateral requirements, and pre-visa rules differ by country. Explore specifications for your target destination.
            </p>
          </div>

          {/* Destination tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-100 pb-3">
            {destinationTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveDest(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium transition cursor-pointer ${
                  activeDest === tab.id
                    ? "bg-[#5b21b6] text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                <span>{tab.flag}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Active destination details card */}
          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/40 via-white to-slate-50 p-6 sm:p-8">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{selectedDest.flag}</span>
                  <h3 className="text-[22px] text-slate-900 font-medium">{selectedDest.name} — Education Loan Features</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                    <p className="text-[11px] text-slate-400 font-light uppercase tracking-wider">Max Sanction Limit</p>
                    <p className="text-[18px] font-semibold text-slate-900 mt-1">{selectedDest.maxLimit}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                    <p className="text-[11px] text-slate-400 font-light uppercase tracking-wider">Zero Collateral Limit</p>
                    <p className="text-[18px] font-semibold text-emerald-700 mt-1">{selectedDest.collateralFree}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                    <p className="text-[11px] text-slate-400 font-light uppercase tracking-wider">Average Interest Rate</p>
                    <p className="text-[18px] font-semibold text-[#5b21b6] mt-1">{selectedDest.avgInterest}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                    <p className="text-[11px] text-slate-400 font-light uppercase tracking-wider">Living Cost & Deposit</p>
                    <p className="text-[18px] font-semibold text-slate-900 mt-1">{selectedDest.livingCostCover}</p>
                  </div>
                </div>

                <ul className="mt-6 space-y-2.5">
                  {selectedDest.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-700 font-light">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <h4 className="text-[16px] font-medium text-slate-900 mb-2">Ready to apply for {selectedDest.name}?</h4>
                <p className="text-[12.5px] text-slate-500 font-light leading-relaxed mb-5">
                  Get matched with top partner banks and NBFCs offering preferential rates for {selectedDest.name}.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[12px] text-slate-600 border-b border-slate-100 pb-2">
                    <span>Pre-Visa Approval Letter</span>
                    <span className="font-medium text-emerald-700">Included</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-slate-600 border-b border-slate-100 pb-2">
                    <span>Tax Benefit (Sec 80E)</span>
                    <span className="font-medium text-[#5b21b6]">100% Tax Exempt</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-slate-600 border-b border-slate-100 pb-2">
                    <span>Moratorium Period</span>
                    <span className="font-medium text-slate-900">Course + 12 Months</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setLeadForm((prev) => ({ ...prev, destination: selectedDest.name }));
                    if (leadFormRef.current) leadFormRef.current.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-6 w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5b21b6] px-4 text-[12.5px] text-white font-medium hover:bg-[#4c1d95] transition cursor-pointer"
                >
                  Apply for {selectedDest.name} Loan
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LENDER COMPARISON RECTANGLES ─────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] tracking-[0.14em] uppercase text-[#5b21b6] mb-1 font-medium">Partner Bank Directory</p>
              <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900 leading-[1.12]">
                Compare Education Loan Offers from All Partners
              </h2>
            </div>

            {/* Filter Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search bank name or rate..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-[12px] text-slate-900 outline-none focus:border-[#5b21b6] focus:bg-white font-light"
              />
            </div>
          </div>

          {/* Lenders List */}
          <div className="space-y-3">
            {filteredLenders.map((lender) => (
              <EduLenderRow
                key={lender.bankSlug || lender.bankName}
                lender={lender}
                onRequestCallback={() => requestLenderCallback(lender)}
              />
            ))}
          </div>

          <p className="mt-6 text-center text-[11px] text-slate-400 font-light">
            Rates and loan features are subject to applicant academic profile, university global standing, and credit assessment.
          </p>
        </div>
      </section>

      {/* ─── THE MORATORIUM & REPAYMENT EXPLAINER ───────────────────── */}
      <section className="bg-[#f8fafc] border-b border-slate-100 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#5b21b6] mb-2 font-medium font-mono">How Repayment Works</p>
            <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900 leading-[1.12]">
              The Moratorium Advantage: Study First, Pay Later
            </h2>
            <p className="mt-3 text-[14px] text-slate-500 font-light leading-relaxed">
              Unlike personal or home loans, education loans do not require full EMI payments while you are studying. The moratorium safeguards student focus until you graduate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 relative">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#5b21b6] font-semibold text-[13px] mb-4">
                01
              </span>
              <h3 className="text-[16px] font-medium text-slate-900">Course Duration</h3>
              <p className="text-[12px] text-slate-400 font-light mt-0.5 mb-3">1 to 4 Years (Degree Timeline)</p>
              <p className="text-[13px] text-slate-600 font-light leading-relaxed">
                Focus 100% on your studies and exams. You can opt for <strong>₹0 EMI</strong>, simple interest payment, or partial interest payments during this phase.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 relative">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-[13px] mb-4">
                02
              </span>
              <h3 className="text-[16px] font-medium text-slate-900">Grace Period (Moratorium)</h3>
              <p className="text-[12px] text-slate-400 font-light mt-0.5 mb-3">6 to 12 Months Post-Graduation</p>
              <p className="text-[13px] text-slate-600 font-light leading-relaxed">
                A dedicated window post-graduation to land your dream job, relocate, or complete post-study internship work before principal repayment starts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 relative">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-semibold text-[13px] mb-4">
                03
              </span>
              <h3 className="text-[16px] font-medium text-slate-900">Repayment Period</h3>
              <p className="text-[12px] text-slate-400 font-light mt-0.5 mb-3">Up to 15 Years Flexible EMI</p>
              <p className="text-[13px] text-slate-600 font-light leading-relaxed">
                Pay standard monthly EMIs from your earned professional salary. Pre-pay or foreclose anytime without prepayment penalty charges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 80E TAX BENEFIT SECTION ──────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
            <div>
              <p className="text-[11px] tracking-[0.14em] uppercase text-emerald-700 font-medium mb-2">Income Tax Act • Section 80E</p>

              <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900 leading-[1.12]">
                100% Tax Exemption on Interest Paid
              </h2>
              <p className="mt-4 text-[14px] text-slate-600 font-light leading-relaxed">
                Under Section 80E, the entire interest component of your education loan is eligible for tax deduction. Unlike Section 80C, there is <strong>NO UPPER CEILING LIMIT</strong>.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  { label: "Eligible Beneficiary", value: "Student or Parent (Primary Borrower)" },
                  { label: "Deduction Cap", value: "No Limit (100% Interest Deduction)" },
                  { label: "Tax Exemption Window", value: "Up to 8 consecutive assessment years" },
                  { label: "Eligible Courses", value: "Higher studies in India & Abroad (Post 12th)" },
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-2 text-[12.5px]">
                    <span className="text-slate-500 font-light">{row.label}</span>
                    <span className="font-medium text-slate-900">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/40 via-white to-slate-50 p-6 sm:p-8 relative overflow-hidden shadow-[0_8px_30px_rgb(91,33,182,0.06)]">
              <div className="relative z-10">
                <p className="text-[11px] uppercase tracking-wider text-[#5b21b6] font-semibold mb-1">Tax Savings Example</p>
                <h3 className="text-[20px] font-normal text-slate-900">How much do you save under Section 80E?</h3>

                <div className="mt-6 space-y-3 text-[13px]">
                  <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-slate-600 font-light">Annual Interest Paid</span>
                    <span className="font-semibold text-slate-900">₹2,00,000 / year</span>
                  </div>
                  <div className="flex justify-between items-center bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
                    <span className="text-slate-600 font-light">Tax Savings @ 30% Slab Rate</span>
                    <span className="font-semibold text-[#5b21b6]">₹62,400 saved / year</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#5b21b6] text-white p-4 rounded-xl shadow-xs">
                    <span className="text-purple-100 font-medium">Total Tax Saved Over 8 Years</span>
                    <span className="font-bold text-white text-[16px]">₹4,99,200 Savings</span>
                  </div>
                </div>

                <p className="mt-5 text-[11px] text-slate-400 font-light leading-relaxed">
                  *Tax savings calculated based on 30% marginal income tax rate plus 4% cess. Consult your Chartered Accountant or Fintaraa tax expert for personalized projections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ELIGIBILITY & DOCUMENTATION CHECKLIST TABS ─────────────── */}
      <section className="bg-[#f8fafc] border-b border-slate-100 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#5b21b6] mb-2 font-medium">Hassle-free Verification</p>
            <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Documentation & Eligibility Checklist
            </h2>
            <p className="mt-2 text-[14px] text-slate-500 font-light">
              Digital submission means faster pre-sanction letters. Keep these essential documents ready.
            </p>
          </div>

          {/* Checklist Tabs */}
          <div className="flex gap-2 mb-6 border-b border-slate-200/80 pb-3">
            {[
              { id: "student", label: "Student Applicant Docs" },
              { id: "parent", label: "Co-Applicant / Parent Docs" },
              { id: "collateral", label: "Collateral Docs (If > ₹75L)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDocTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-[13px] font-medium transition cursor-pointer ${
                  docTab === tab.id
                    ? "bg-[#5b21b6] text-white"
                    : "bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            {docTab === "student" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Admission Offer Letter from University / College",
                  "Academic Marksheets (10th, 12th, Graduation transcripts)",
                  "Entrance Exam Scorecard (GRE / GMAT / SAT / CAT)",
                  "English Proficiency Scorecard (IELTS / TOEFL / PTE)",
                  "Copy of Passport (mandatory for overseas study)",
                  "2 Passport size photographs & PAN Card",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <FileCheck2 className="h-4 w-4 text-[#5b21b6] shrink-0 mt-0.5" />
                    <span className="text-[13px] text-slate-700 font-light">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {docTab === "parent" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Identity & Address Proof (Aadhaar, Passport, Voter ID)",
                  "PAN Card copy of Parent / Guardian co-applicant",
                  "Last 6 months Bank Account Statement",
                  "Last 2 years Income Tax Returns (ITR) with computation",
                  "Salaried: Last 3 months Salary Slips & Form 16",
                  "Self-Employed: Business Registration & P&L Statement",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-[13px] text-slate-700 font-light">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {docTab === "collateral" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Property Title Deed & Registered Sale Agreement",
                  "Approved Building Plan & Clearance Certificates",
                  "Property Tax Paid Receipts (latest 3 years)",
                  "Fixed Deposit (FD) Receipts pledged as security",
                  "Government Approved Valuer Report",
                  "No Encumbrance Certificate (EC) for 13 to 30 years",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <Building2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-[13px] text-slate-700 font-light">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── MYTHS & REALITY SECTION ────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#5b21b6] mb-2 font-medium">Clearing Misconceptions</p>
            <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Common Myths About Education Loans
            </h2>
            <p className="mt-3 text-[14px] text-slate-500 font-light leading-relaxed">
              Don't let outdated myths stop you from pursuing your dream university. Here are the facts.
            </p>
          </div>

          <div className="space-y-3">
            {mythsList.map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/40 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenMythIndex(openMythIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 mt-0.5 text-xs font-semibold">
                      ✕
                    </span>
                    <span className="text-[14px] text-slate-800 font-normal">{item.myth}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${openMythIndex === idx ? "rotate-180" : ""}`} />
                </button>
                {openMythIndex === idx && (
                  <div className="px-5 pb-4 border-t border-slate-200/60 pt-3 bg-white">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5 text-xs font-semibold">
                        ✓
                      </span>
                      <p className="text-[13.5px] text-slate-600 leading-relaxed font-light">{item.reality}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CREDIT SCORE SECTION ──────────────────────────────── */}
      <CreditScoreSection />

      {/* ─── FAQ ─────────────────────────────────────────────── */}
      <LoanFAQSection faqs={faqItems} title="Education loan — questions answered" />

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

// ─── Education Lender Row Component ──────────────────────────────────────────

function EduLenderRow({
  lender,
  onRequestCallback,
}: {
  lender: BankProductLender;
  onRequestCallback: () => void;
}) {
  const applyHref = getApplyHref({
    category: "loan",
    productSlug: "education-loan",
    bankSlug: lender.bankSlug,
    referrer: lender.canonicalPath || "/products/education-loan",
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[160px_1fr_1fr_1fr_1fr_auto] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-purple-300 hover:shadow-xs">
      {/* Logo / Bank Name */}
      <div className="flex items-center gap-3">
        {lender.logoUrl ? (
          <Link href={lender.canonicalPath} className="block no-underline">
            <span className="flex h-12 w-28 items-center justify-center rounded-xl border border-slate-100 bg-white px-2">
              <BankLogoImage
                src={lender.logoUrl}
                alt={lender.bankName}
                className="h-10 w-full"
                imageClassName="object-contain"
                sizes="112px"
              />
            </span>
          </Link>
        ) : (
          <Link href={lender.canonicalPath} className="flex items-center gap-2.5 no-underline min-w-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[13px] font-medium text-[#5b21b6]">
              {lender.bankName.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}
            </span>
            <span className="text-[12.5px] font-medium text-slate-800 leading-tight line-clamp-2">{lender.bankName}</span>
          </Link>
        )}
      </div>

      {/* Interest rate */}
      <div>
        <p className="text-[9.5px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Interest Rate</p>
        <p className="text-[13px] text-slate-800 font-medium">{lender.interestRate || "—"}</p>
      </div>

      {/* Max Loan Amount */}
      <div>
        <p className="text-[9.5px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Max Sanction</p>
        <p className="text-[13px] text-slate-800 font-medium">{lender.loanAmount || "—"}</p>
      </div>

      {/* Processing fee */}
      <div>
        <p className="text-[9.5px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Processing Fee</p>
        <p className="text-[13px] text-slate-800 font-light">{lender.processingFee || "—"}</p>
      </div>

      {/* Tenure */}
      <div>
        <p className="text-[9.5px] tracking-[0.08em] uppercase text-slate-400 font-light mb-0.5">Max Tenure</p>
        <p className="text-[13px] text-slate-800 font-light">{lender.tenure || "—"}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onRequestCallback}
          className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-3.5 text-[11.5px] text-slate-600 hover:border-purple-300 hover:text-[#5b21b6] transition font-light whitespace-nowrap cursor-pointer"
        >
          Get callback
        </button>
        <AuthRedirectLink
          href={applyHref}
          productSlug="education-loan"
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#5b21b6] px-4 text-[11.5px] text-white no-underline hover:bg-[#4c1d95] transition font-medium whitespace-nowrap"
        >
          Apply now
          <ArrowRight className="h-3.5 w-3.5" />
        </AuthRedirectLink>
      </div>
    </div>
  );
}

// ─── Helper Form Controls ──────────────────────────────────────────────────────

function EduFormInput({
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
      <span className={`flex h-9.5 items-center rounded-xl border transition ${error ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-slate-50/50 focus-within:border-[#5b21b6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5b21b6]/10"}`}>
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

function EduFormSelect({
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
      <span className={`flex h-9.5 items-center rounded-xl border transition ${error ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-slate-50/50 focus-within:border-[#5b21b6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5b21b6]/10"}`}>
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
