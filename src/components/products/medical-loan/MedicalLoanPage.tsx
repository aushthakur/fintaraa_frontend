"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Activity,
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
  HeartPulse,
  HelpCircle,
  Hospital,
  Info,
  Layers,
  Loader2,
  Mail,
  MapPin,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  User,
  X,
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

const defaultMedicalLenders: BankProductLender[] = [
  {
    bankName: "HDFC Bank Personal Loan for Medical Emergency",
    bankSlug: "hdfc-bank",
    productSlug: "medical-loan",
    interestRate: "From 10.50% p.a.",
    processingFee: "Up to 1.50% + GST",
    loanAmount: "Up to ₹50 Lakhs",
    tenure: "Up to 6 years",
    canonicalPath: "/products/medical-loan/hdfc-bank",
  },
  {
    bankName: "ICICI Bank Healthcare Loan",
    bankSlug: "icici-bank",
    productSlug: "medical-loan",
    interestRate: "From 10.75% p.a.",
    processingFee: "Up to 2.00%",
    loanAmount: "Up to ₹40 Lakhs",
    tenure: "Up to 5 years",
    canonicalPath: "/products/medical-loan/icici-bank",
  },
  {
    bankName: "Axis Bank Emergency Medical Loan",
    bankSlug: "axis-bank",
    productSlug: "medical-loan",
    interestRate: "From 10.99% p.a.",
    processingFee: "1.00% to 2.00%",
    loanAmount: "Up to ₹40 Lakhs",
    tenure: "Up to 5 years",
    canonicalPath: "/products/medical-loan/axis-bank",
  },
  {
    bankName: "State Bank of India (SBI) Express Medical Credit",
    bankSlug: "sbi",
    productSlug: "medical-loan",
    interestRate: "From 9.60% p.a.",
    processingFee: "0.50% to 1.00%",
    loanAmount: "Up to ₹25 Lakhs",
    tenure: "Up to 7 years",
    canonicalPath: "/products/medical-loan/sbi",
  },
  {
    bankName: "Kotak Mahindra Health Emergency Loan",
    bankSlug: "kotak-bank",
    productSlug: "medical-loan",
    interestRate: "From 10.99% p.a.",
    processingFee: "Up to 1.50%",
    loanAmount: "Up to ₹30 Lakhs",
    tenure: "Up to 5 years",
    canonicalPath: "/products/medical-loan/kotak-bank",
  },
  {
    bankName: "Bajaj Finserv Flexi Medical Loan",
    bankSlug: "bajaj-finserv",
    productSlug: "medical-loan",
    interestRate: "From 11.00% p.a.",
    processingFee: "Up to 2.99%",
    loanAmount: "Up to ₹40 Lakhs",
    tenure: "Up to 8 years",
    canonicalPath: "/products/medical-loan/bajaj-finserv",
  },
];

const medicalTreatmentCategories = [
  "Emergency Surgery and ICU Hospitalization",
  "Elective Procedures and Specialty Care",
  "Cancer Care and Oncology Treatments",
  "Cardiology and Heart Surgeries",
  "Orthopedic Procedures and Joint Replacements",
  "Dental, Optical and Cosmetic Treatments",
  "General Medical Bills and Diagnostic Expenses",
];

const medicalBudgetOptions = [
  "Below ₹1 Lakh",
  "₹1–3 Lakhs",
  "₹3–5 Lakhs",
  "₹5–10 Lakhs",
  "₹10–25 Lakhs",
  "Above ₹25 Lakhs",
];

const employmentOptions = [
  "Salaried Employee",
  "Self-Employed Professional",
  "Business Owner",
  "Government Servant",
];

const medicalFaqs = [
  {
    question: "What is a medical loan?",
    answer: "A medical loan is a specialized unsecured personal loan designed to finance urgent healthcare costs, hospital admission fees, surgeries, organ transplants, specialty medical equipment, and diagnostic procedures.",
  },
  {
    question: "How fast can a medical loan be disbursed in an emergency?",
    answer: "Given the critical nature of medical expenses, pre-approved digital medical loans can be approved within minutes and disbursed into bank accounts within 24 hours upon completion of online verification.",
  },
  {
    question: "Is collateral or property mortgage required for a medical loan?",
    answer: "No. Medical personal loans offered via Fintaraa partner lenders are completely unsecured, requiring zero collateral, asset pledge, or property documentation.",
  },
  {
    question: "Can I use a medical loan if I already have health insurance?",
    answer: "Yes. Medical loans can bridge the financial gap for expenses not covered by health insurance policies, such as co-payments, room rent caps, non-payable medical consumables, and pre-existing condition exclusions.",
  },
  {
    question: "What is the maximum loan amount available for medical treatment in India?",
    answer: "Applicants can secure unsecured medical loans ranging from ₹50,000 up to ₹50 Lakhs depending on monthly net income, employment stability, and existing credit profile.",
  },
  {
    question: "Can family members apply for a loan on behalf of a patient?",
    answer: "Yes. Close blood relatives (parents, spouse, children, siblings) can apply as primary applicants or co-borrowers for medical treatment costs.",
  },
  {
    question: "What interest rates apply to medical emergency loans?",
    answer: "Indicative interest rates range from 9.60 percent to 16.00 percent per annum based on applicant risk profile, credit score, and lender policies.",
  },
];

type LeadFormState = {
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  medicalBudget: string;
  treatmentType: string;
  employmentType: string;
  preferredLender: string;
};

const initialLeadForm: LeadFormState = {
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  medicalBudget: "",
  treatmentType: "",
  employmentType: "",
  preferredLender: "",
};

type LeadFormErrors = Partial<Record<keyof LeadFormState | "whatsappConsent", string>>;

export function MedicalLoanPage({
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
    return defaultMedicalLenders;
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

  // Medical EMI & Expense state
  const [loanAmount, setLoanAmount] = useState(500000);
  const [calcRate, setCalcRate] = useState(10.5);
  const [calcTenureYears, setCalcTenureYears] = useState(3);

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
    if (!leadForm.medicalBudget) nextErrors.medicalBudget = "Select required loan amount.";
    if (!leadForm.treatmentType) nextErrors.treatmentType = "Select treatment category.";
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
            "Medical Loan lead",
            `Category: ${leadForm.treatmentType}`,
            `Budget: ${leadForm.medicalBudget}`,
            `Employment: ${leadForm.employmentType || "Not specified"}`,
            `Preferred Lender: ${leadForm.preferredLender || "Open to all"}`,
            `Page: ${page.canonicalPath || "/products/medical-loan"}`,
          ].join(" | "),
          ...buildWebsiteConsentPayload("medical_loan_marketplace"),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || "Could not submit request right now.");
      setSubmitSuccess("Medical loan inquiry submitted. Priority healthcare finance representative will reach out shortly.");
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
    if (category) setLeadForm((prev) => ({ ...prev, treatmentType: category }));
    if (budget) setLeadForm((prev) => ({ ...prev, medicalBudget: budget }));
    setIsModalOpen(true);
  };

  // EMI math
  const medicalEmiCalc = useMemo(() => {
    const P = loanAmount;
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

    return { emi, totalInterest, totalPayment };
  }, [loanAmount, calcRate, calcTenureYears]);

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
    return medicalFaqs;
  }, [page.tabs]);

  return (
    <div className="bg-white text-[#192337] font-sans antialiased">
      {/* ─── HERO SECTION: CONCEPTUAL HEALTHCARE FINANCIAL ASSISTANCE ─── */}
      <section className="relative bg-gradient-to-b from-teal-50/70 via-white to-slate-50/50 border-b border-teal-100/60 py-14 lg:py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & Information */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-100/80 px-3.5 py-1 text-[11.5px] font-medium text-teal-800">
                <HeartPulse className="h-3.5 w-3.5 text-teal-600" />
                Medical Financial Options
              </span>

              <h1 className="text-[38px] sm:text-[50px] lg:text-[58px] leading-[1.08] font-light text-slate-900 tracking-tight">
                Medical Loan for Healthcare & Emergency Treatment: <br />
                <span className="text-teal-700 font-normal">Financing Options, Rates & Eligibility</span>
              </h1>

              <p className="text-[15.5px] sm:text-[17.5px] text-[#64748B] font-light leading-relaxed max-w-xl">
                Finance hospital admission, surgeries, elective treatments, specialty care, and diagnostic bills with fast-track collateral-free medical loans from top partner lenders.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => openFormWithDetails()}
                  className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl bg-teal-700 px-7 text-[14px] font-medium text-white transition hover:bg-teal-800 shadow-lg shadow-teal-900/15 cursor-pointer"
                >
                  Check Medical Loan Eligibility
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="#medical-calculator"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-[14px] font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition no-underline"
                >
                  Calculate Repayment EMI
                </a>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11.5px] text-slate-400 font-light">
                <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
                <span>Zero collateral required. Instant digital verification and fast disbursal.</span>
              </div>
            </div>

            {/* Right Column: Conceptual Medical Assistance Visual Card */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-teal-100 bg-white p-6 sm:p-8 shadow-[0_16px_40px_rgba(15,118,110,0.08)] space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10.5px] uppercase tracking-wider text-teal-700 font-medium">Healthcare Coverage View</span>
                    <h2 className="text-[20px] font-medium text-slate-900 mt-0.5">Medical Financing Overview</h2>
                  </div>
                  <span className="rounded-xl bg-teal-50 px-3 py-1 text-[12px] font-medium text-teal-800">
                    Up to ₹50 Lakhs
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Emergency Surgery", desc: "ICU & Hospitalization", icon: <Hospital className="h-4 w-4 text-teal-700" /> },
                    { label: "Specialty Care", desc: "Oncology & Cardiology", icon: <Stethoscope className="h-4 w-4 text-teal-700" /> },
                    { label: "Elective Care", desc: "Dental, Vision & Ortho", icon: <Activity className="h-4 w-4 text-teal-700" /> },
                    { label: "Insurance Gap", desc: "Co-pay & Room Upgrades", icon: <ShieldAlert className="h-4 w-4 text-teal-700" /> },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl border border-teal-50 bg-teal-50/40 space-y-1">
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-[13px] font-medium text-slate-800">{item.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-light">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-teal-50/80 p-4 flex justify-between items-center text-[13px]">
                  <div>
                    <span className="text-[11px] text-slate-500 font-light block">Indicative Monthly EMI (₹5 Lakhs @ 3 Yrs)</span>
                    <span className="text-[18px] font-medium text-teal-800">₹16,250 / month</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openFormWithDetails()}
                    className="inline-flex h-9 items-center justify-center rounded-xl bg-teal-700 px-4 text-[12px] font-medium text-white transition hover:bg-teal-800 cursor-pointer"
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
            className="relative w-full max-w-xl rounded-3xl border border-teal-100 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-teal-700 p-6 text-white flex items-start justify-between shrink-0">
              <div>
                <span className="text-[10px] tracking-[0.16em] uppercase text-teal-200 font-medium">Digital Healthcare Finance</span>
                <h2 className="text-[22px] font-normal text-white tracking-tight mt-0.5">Apply for Medical Loan</h2>
                <p className="mt-1 text-[12.5px] text-teal-100/90 font-light leading-relaxed">
                  Submit details to compare medical financing options from partner institutions.
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
                  icon={<PhoneCall className="h-3.5 w-3.5" />}
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
                  label="Treatment Category"
                  value={leadForm.treatmentType}
                  error={errors.treatmentType}
                  icon={<Hospital className="h-3.5 w-3.5" />}
                  placeholder="Select treatment type"
                  options={medicalTreatmentCategories}
                  onChange={(v) => updateField("treatmentType", v)}
                />

                <FormSelect
                  label="Required Loan Amount"
                  value={leadForm.medicalBudget}
                  error={errors.medicalBudget}
                  icon={<BadgeIndianRupee className="h-3.5 w-3.5" />}
                  placeholder="Select required amount"
                  options={medicalBudgetOptions}
                  onChange={(v) => updateField("medicalBudget", v)}
                />

                <div className="sm:col-span-2">
                  <FormSelect
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
                    className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 text-[13.5px] font-medium text-white transition hover:bg-teal-800 disabled:opacity-60 cursor-pointer shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Fetching custom options...
                      </>
                    ) : (
                      <>
                        Get My Medical Loan Options
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-center text-[10.5px] text-slate-400 font-light">
                    Fast pre-approval • Zero impact on CIBIL score
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 2: MEDICAL EXPENSES COVERED ────────────────────────── */}
      <section className="py-14 lg:py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] tracking-[0.16em] uppercase text-teal-700 font-medium mb-2">Healthcare Categories</p>
            <h2 className="text-[30px] sm:text-[40px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Medical Treatments Covered Under Healthcare Loans
            </h2>
            <p className="mt-2 text-[15px] text-slate-500 font-light">
              Personal medical loans offer unconstrained capital for planned procedures, acute surgeries, and urgent healthcare expenses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Emergency ICU & Surgeries",
                desc: "Finance urgent surgical interventions, intensive care admission, and immediate hospital billing deposits.",
                icon: <Hospital className="h-5 w-5 text-teal-700" />,
                cat: "Emergency Surgery and ICU Hospitalization",
              },
              {
                title: "Specialty & Oncology Care",
                desc: "Fund specialized chemotherapy, radiation cycles, organ transplants, and advanced diagnostic scans.",
                icon: <Stethoscope className="h-5 w-5 text-teal-700" />,
                cat: "Cancer Care and Oncology Treatments",
              },
              {
                title: "Cardiology Procedures",
                desc: "Cover bypass surgeries, angioplasty, pacemaker implantations, and cardiac rehabilitation.",
                icon: <HeartPulse className="h-5 w-5 text-teal-700" />,
                cat: "Cardiology and Heart Surgeries",
              },
              {
                title: "Orthopedic & Joint Replacements",
                desc: "Pay for knee replacements, hip surgeries, spinal procedures, and post-op physical rehabilitation.",
                icon: <Activity className="h-5 w-5 text-teal-700" />,
                cat: "Orthopedic Procedures and Joint Replacements",
              },
              {
                title: "Dental & Vision Treatments",
                desc: "Finance orthodontic procedures, dental implants, LASIK eye surgery, and elective cosmetic care.",
                icon: <ShieldCheck className="h-5 w-5 text-teal-700" />,
                cat: "Dental, Optical and Cosmetic Treatments",
              },
              {
                title: "Insurance Co-pay & Out-of-Pocket",
                desc: "Bridge gaps created by insurance room rent capping, co-payments, and non-covered consumables.",
                icon: <ShieldAlert className="h-5 w-5 text-teal-700" />,
                cat: "General Medical Bills and Diagnostic Expenses",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => openFormWithDetails(item.cat)}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 hover:border-teal-300 hover:shadow-lg transition duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    {item.icon}
                  </div>
                  <h3 className="text-[17px] font-medium text-slate-900 group-hover:text-teal-700 transition-colors">{item.title}</h3>
                  <p className="mt-2 text-[13px] text-slate-500 font-light leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[12.5px] font-medium text-teal-700">
                  <span>Explore Financing</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: UNIFIED MEDICAL EMI CALCULATOR ────────────────── */}
      <section id="medical-calculator" className="py-14 lg:py-20 bg-teal-50/40 border-b border-teal-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] tracking-[0.16em] uppercase text-teal-700 font-medium mb-2">Calculator</p>
            <h2 className="text-[30px] sm:text-[40px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Medical Loan EMI & Repayment Calculator
            </h2>
            <p className="mt-2 text-[15px] text-slate-500 font-light">
              Adjust loan amount, interest rate, and repayment tenure to evaluate monthly EMI requirements.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch bg-white rounded-3xl border border-teal-100 p-6 sm:p-8 shadow-[0_16px_40px_rgba(15,118,110,0.06)]">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[12px] font-medium text-slate-700">Required Medical Amount</label>
                  <span className="text-[15px] font-medium text-teal-800">₹{loanAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={5000000}
                  step={50000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-teal-100 accent-teal-700 cursor-pointer"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[12px] font-medium text-slate-700">Interest Rate (p.a.)</label>
                    <span className="text-[13.5px] font-medium text-teal-800">{calcRate.toFixed(2)}%</span>
                  </div>
                  <input
                    type="range"
                    min={9.5}
                    max={18}
                    step={0.25}
                    value={calcRate}
                    onChange={(e) => setCalcRate(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-teal-100 accent-teal-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[12px] font-medium text-slate-700">Tenure (Years)</label>
                    <span className="text-[13.5px] font-medium text-teal-800">{calcTenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    step={1}
                    value={calcTenureYears}
                    onChange={(e) => setCalcTenureYears(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-teal-100 accent-teal-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-teal-800 text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-teal-200 font-medium">Estimated Monthly EMI</span>
                <p className="text-[32px] font-medium text-white tracking-tight mt-1">
                  ₹{medicalEmiCalc.emi.toLocaleString()} <span className="text-[14px] font-normal text-teal-200">/ month</span>
                </p>
                <p className="text-[12px] text-teal-100/80 font-light mt-1">
                  Calculated for ₹{loanAmount.toLocaleString()} loan amount over {calcTenureYears} years.
                </p>
              </div>

              <div className="space-y-3 border-t border-teal-600/50 pt-4 text-[13px]">
                <div className="flex justify-between text-teal-100">
                  <span>Total Interest Payable</span>
                  <span className="font-medium text-white">₹{medicalEmiCalc.totalInterest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-teal-100 text-[12.5px]">
                  <span>Total Repayment</span>
                  <span className="font-medium text-white">₹{medicalEmiCalc.totalPayment.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const bStr = loanAmount > 2000000 ? "Above ₹25 Lakhs" : loanAmount > 1000000 ? "₹10–25 Lakhs" : loanAmount > 500000 ? "₹5–10 Lakhs" : "₹3–5 Lakhs";
                  openFormWithDetails(undefined, bStr);
                }}
                className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-teal-800 font-medium text-[13.5px] hover:bg-teal-50 transition cursor-pointer shadow-md"
              >
                Apply for Medical Loan
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-[10.5px] text-teal-200/70 font-light leading-relaxed">
                *Illustrative calculation based on reducing balance EMI formula. Rates subject to profile verification.
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
              <p className="text-[11px] tracking-[0.16em] uppercase text-teal-700 font-medium mb-2">Partner Directory</p>
              <h2 className="text-[30px] sm:text-[38px] font-light tracking-tight text-slate-900 leading-[1.12]">
                Compare Medical Loan Offers
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {filteredLenders.map((lender) => (
              <div
                key={lender.bankSlug || lender.bankName}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[160px_1fr_1fr_1fr_1fr_auto] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-teal-300 hover:shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[13px] font-medium text-teal-800">
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
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-3.5 text-[11.5px] text-slate-600 hover:border-teal-300 hover:text-teal-700 transition font-light whitespace-nowrap cursor-pointer"
                  >
                    Get Callback
                  </button>
                  <AuthRedirectLink
                    href={getApplyHref({
                      category: "loan",
                      productSlug: "medical-loan",
                      bankSlug: lender.bankSlug,
                      referrer: lender.canonicalPath || "/products/medical-loan",
                    })}
                    productSlug="medical-loan"
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-4 text-[11.5px] text-white no-underline hover:bg-teal-800 transition font-medium whitespace-nowrap"
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
            <p className="text-[11px] tracking-[0.16em] uppercase text-teal-700 font-medium mb-2">Comprehensive Guide</p>
            <h2 className="text-[28px] sm:text-[36px] font-light tracking-tight text-slate-900">
              Medical Emergency Loans in India: Everything You Need to Know
            </h2>
          </div>

          <div className="prose prose-slate max-w-none text-[14.5px] text-slate-600 font-light leading-relaxed space-y-6">
            <p>
              Healthcare emergencies present both emotional and financial challenges. While health insurance policies provide basic coverage, room rent limits, pre-existing condition waiting periods, co-payment clauses, and non-payable medical items frequently create significant out-of-pocket expenses. An unsecured medical personal loan provides rapid liquidity without requiring asset collateral.
            </p>

            <h3 className="text-[20px] font-medium text-slate-900 mt-6 mb-2">Advantages of Personal Medical Loans</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Fast Disbursal Timelines:</strong> Digital verification enables fast sanction and funds transfer within 24 hours.
              </li>
              <li>
                <strong>Zero Collateral Security:</strong> No need to pledge fixed deposits, gold, or property during emergency situations.
              </li>
              <li>
                <strong>Unrestricted Medical Usage:</strong> Capital can be used for hospital bills, post-operative medication, therapy, and rehabilitation.
              </li>
              <li>
                <strong>Insurance Complement:</strong> Serves as an ideal supplement to bridge health insurance claim shortfalls.
              </li>
            </ul>

            <h3 className="text-[20px] font-medium text-slate-900 mt-6 mb-2">Eligibility Criteria Overview</h3>
            <p>
              Lenders evaluate salaried and self-employed applicants based on income stability, age criteria, credit history (CIBIL 720+ preferred), and existing repayment obligations.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: ELIGIBILITY & DOCUMENTS ───────────────────────── */}
      <section className="py-14 lg:py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <p className="text-[11px] tracking-[0.16em] uppercase text-teal-700 font-medium mb-2">Requirements</p>
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
                  ? "bg-teal-700 text-white"
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
                  ? "bg-teal-700 text-white"
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
                  "Minimum monthly salary: ₹20,000 for salaried employees",
                  "Continuous employment or business continuity for at least 1 year",
                  "Credit Score: CIBIL score of 720+ preferred",
                  "FOIR: Existing obligations below 50% of monthly income",
                  "Indian resident status with valid KYC proof",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <FileCheck2 className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
                    <span className="text-[13px] text-slate-700 font-light">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Identity Proof (PAN Card, Aadhaar, Passport, Voter ID)",
                  "Address Proof (Aadhaar, Utility Bill, Rental Agreement)",
                  "Last 3 months salary slips (Salaried)",
                  "Last 6 months bank account statements showing salary credits",
                  "Hospital estimate or doctor consultation note (if requested)",
                  "Passport size photographs",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <FileSpreadsheet className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
                    <span className="text-[13px] text-slate-700 font-light">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: FAQ ────────────────────────────────────────────── */}
      <LoanFAQSection faqs={faqItems} title="Medical Loan Frequently Asked Questions" />

      {/* ─── SECTION 8: CLOSING CTA ────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white via-teal-50/60 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-teal-100 bg-white overflow-hidden p-8 sm:p-12 lg:p-16 shadow-[0_20px_60px_rgba(15,118,110,0.08)] text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-[11px] tracking-[0.16em] uppercase text-teal-700 font-medium">Digital Medical Finance</span>
            <h2 className="text-[32px] sm:text-[44px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Explore Emergency Medical Loan Options
            </h2>
            <p className="text-[15px] text-slate-500 font-light">
              Compare rates, loan limits, and repayment terms from partner financial institutions with Fintaraa.
            </p>
            <button
              type="button"
              onClick={() => openFormWithDetails()}
              className="mt-2 inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-teal-700 px-8 text-[14px] font-medium text-white transition hover:bg-teal-800 shadow-md cursor-pointer"
            >
              Check My Medical Loan Eligibility
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
      <span className={`flex h-10 items-center rounded-xl border transition ${error ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-slate-50/50 focus-within:border-teal-700 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-700/10"}`}>
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
      <span className={`flex h-10 items-center rounded-xl border transition ${error ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-slate-50/50 focus-within:border-teal-700 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-700/10"}`}>
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
