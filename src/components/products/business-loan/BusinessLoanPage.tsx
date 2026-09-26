"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building,
  Building2,
  Calculator,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck2,
  Layers,
  Loader2,
  Lock,
  Percent,
  Receipt,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { getApplyHref } from "@/components/application/flowRegistry";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { ProductLocationDirectory } from "@/components/products/ProductLocationDirectory";
import { ProductRelatedBlogs } from "@/components/products/ProductRelatedBlogs";
import { LoanFAQSection } from "@/components/products/loan-detail/LoanFAQSection";
import type { LoanSeoLocationPage, LoanSeoPageData } from "@/services/loanSeoPages";
import type { BankProductLender } from "@/services/bankSeoPages";

// ─── Bank Lenders for Business Loan ──────────────────────────────────────────
const businessLenders = [
  {
    name: "HDFC Bank",
    slug: "hdfc-bank",
    logo: "/assets/banks/HDFC-Bank.png",
    rate: "10.75% – 16.00% p.a.",
    maxLimit: "Up to ₹75 Lakhs",
    fee: "1.50% to 2.00%",
    maxTenure: "Up to 5 Yrs",
    features: "Zero Collateral • Instant In-Principle Sanction within 4 Hours",
  },
  {
    name: "ICICI Bank",
    slug: "icici-bank",
    logo: "/assets/banks/ICICI-Bank.png",
    rate: "11.00% – 15.50% p.a.",
    maxLimit: "Up to ₹1 Crore",
    fee: "1.00% to 2.00%",
    maxTenure: "Up to 7 Yrs",
    features: "GST-Based Surrogate Program • Dropline Overdraft Available",
  },
  {
    name: "Axis Bank",
    slug: "axis-bank",
    logo: "/assets/banks/axis-bank.png",
    rate: "11.25% – 16.50% p.a.",
    maxLimit: "Up to ₹50 Lakhs",
    fee: "1.25% to 2.00%",
    maxTenure: "Up to 5 Yrs",
    features: "Special Rates for MSME Women Entrepreneurs & Professionals",
  },
  {
    name: "Kotak Mahindra Bank",
    slug: "kotak-bank",
    logo: "/assets/banks/Kotak-Mahindra-Bank.png",
    rate: "11.50% – 17.00% p.a.",
    maxLimit: "Up to ₹75 Lakhs",
    fee: "1.50% of Sanction",
    maxTenure: "Up to 5 Yrs",
    features: "Minimal Financial Paperwork • Doorstep Document Collection",
  },
  {
    name: "Bajaj Finserv",
    slug: "bajaj-finserv",
    logo: "/assets/banks/bajaj-finserv.png",
    rate: "12.00% – 18.00% p.a.",
    maxLimit: "Up to ₹80 Lakhs",
    fee: "2.00% of Loan",
    maxTenure: "Up to 8 Yrs",
    features: "Flexi Hybrid Loan Structure • Pay Interest on Utilized Limit",
  },
  {
    name: "Tata Capital",
    slug: "tata-capital",
    logo: "/assets/banks/IndusInd-Bank.png",
    rate: "11.75% – 16.50% p.a.",
    maxLimit: "Up to ₹50 Lakhs",
    fee: "1.50% of Sanction",
    maxTenure: "Up to 5 Yrs",
    features: "Fast 48-Hour Disbursal directly to Current Account",
  },
];

// ─── Specialized Business Variants ──────────────────────────────────────────
const businessVariants = [
  {
    id: "unsecured-term-loan",
    title: "Collateral-Free Business Term Loan",
    subtitle: "Quick Growth Capital up to ₹1 Crore for Business Expansion",
    badge: "Unsecured Term Loan",
    icon: TrendingUp,
    accent: "#6424C7",
    image: "/assets/loan-banners/business-hero.jpg",
    description:
      "Raise high-ticket business funds without pledging any property, machinery, or gold collateral. Approved strictly on your GST turnover, banking vintage, and financial ITR strength.",
    bullets: [
      "Zero collateral or security required for sanctions up to ₹1 Crore",
      "Flexible repayment tenures from 12 to 84 months (1 to 7 years)",
      "End-use unrestricted — use for marketing, new branch setup, or hiring",
      "Interest payments are 100% tax-deductible as business operating expense",
    ],
    highlightText: "Disbursed directly into your business current account in 48 hours.",
  },
  {
    id: "working-capital-credit-line",
    title: "Working Capital Loan & Credit Line",
    subtitle: "Smooth Out Operational Cashflow Cycles, Vendor Bills & Inventory",
    badge: "Revolving Working Capital",
    icon: Wallet,
    accent: "#8b5cf6",
    image: "/assets/loan-banners/lap-variant-overdraft.jpg",
    description:
      "Bridge gaps between receivables and supplier payables. Access an active working capital line to purchase bulk raw materials, maintain buffer stock, and manage payroll during seasonal surges.",
    bullets: [
      "Revolving credit line linked to sales invoice cycles and inventory",
      "Interest calculated strictly on day-to-day utilized credit balance",
      "Short-term tenure alignments preventing long-term interest lock-in",
      "Instant top-up and renewal based on quarterly banking turnover",
    ],
    highlightText: "Never lose a high-value customer order due to temporary liquidity crunch.",
  },
  {
    id: "dropline-overdraft-dod",
    title: "Dropline Overdraft Facility (DOD)",
    subtitle: "Flexible Overdraft Limit that Amortizes Gradually Over Time",
    badge: "Drop-Line Overdraft",
    icon: Layers,
    accent: "#6424C7",
    image: "/assets/loan-banners/lap-variant-commercial.jpg",
    description:
      "Combine the flexibility of an overdraft with the disciplined amortization of a term loan. Your drawing limit drops monthly while you retain full freedom to deposit surplus cash and withdraw on demand.",
    bullets: [
      "Deposit daily business revenues to instantly reduce interest liability",
      "Withdraw emergency cash 24/7 without fresh loan applications",
      "Gradual limit reduction prevents lump-sum balloon repayment shock",
      "Available for traders, distributors, manufacturers, and service firms",
    ],
    highlightText: "Save up to 40% in total interest compared to standard term loans.",
  },
  {
    id: "gst-merchant-finance",
    title: "GST & Merchant POS Swipe Financing",
    subtitle: "Surrogate Credit Based on Monthly GST Returns or Card Swipe Volumes",
    badge: "GST Surrogate Program",
    icon: Receipt,
    accent: "#8b5cf6",
    image: "/assets/loan-banners/lap-variant-refinance.jpg",
    description:
      "Don't have audited balance sheets? Secure rapid unsecured loans based solely on your past 12 months GST return filings (GSTR-3B) or retail POS card machine swipe turnover.",
    bullets: [
      "No audited balance sheet or heavy CA documentation mandatory",
      "Sanctions up to 300% of average monthly GST turnover",
      "Daily or weekly automatic micro-deductions matching cashflow",
      "Instant sanction for retailers, e-commerce sellers, and D2C brands",
    ],
    highlightText: "Fastest route to unsecured capital for growing retail businesses.",
  },
];

const fmtCurrency = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(Math.max(0, Math.round(val || 0)));

export function BusinessLoanPage({
  page,
  lenders = [],
  locationPages = [],
}: {
  page: LoanSeoPageData;
  lenders?: BankProductLender[];
  locationPages?: LoanSeoLocationPage[];
}) {
  // ─── Calculator State ────────────────────────────────────────────────────────
  const [loanAmount, setLoanAmount] = useState<number>(2500000); // 25 Lakhs
  const [annualTurnover, setAnnualTurnover] = useState<number>(10000000); // 1 Cr
  const [interestRate, setInterestRate] = useState<number>(11.25);
  const [tenureYears, setTenureYears] = useState<number>(3);

  // Lead Form State
  const [businessName, setBusinessName] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [entityType, setEntityType] = useState("Private Limited / LLP");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ─── Live Calculation Engine ─────────────────────────────────────────────────
  const calculations = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const N = tenureYears * 12;

    const emi =
      P * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
    const totalRepayment = emi * N;
    const totalInterest = totalRepayment - P;

    // Max eligibility estimate: ~25% of annual turnover
    const maxEligibility = Math.min(10000000, Math.round(annualTurnover * 0.25));

    return {
      emi: Math.round(emi),
      totalRepayment: Math.round(totalRepayment),
      totalInterest: Math.round(totalInterest),
      maxEligibility,
    };
  }, [loanAmount, annualTurnover, interestRate, tenureYears]);

  const handleLeadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyHref = getApplyHref({
    category: "loan",
    productSlug: "business-loan",
    referrer: "/products/business-loan",
  });

  return (
    <main className="overflow-visible bg-white text-[#1f2329] font-normal antialiased">
      {/* ═════════════════════════════════════════════════════════════════════════
          1. HERO SECTION WITH PROPER BACKGROUND BANNER & HIGH-CONTRAST OVERLAY
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full border-b border-purple-900/40 bg-gray-950 py-12 text-white sm:py-16 lg:py-20 overflow-hidden">
        {/* Background Banner Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/loan-banners/business-hero.jpg"
            alt="Corporate Business Growth and Working Capital Financing"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Dual Scrim Overlay for Maximum Banner Visibility & Typography Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#2e1065]/75 to-purple-950/35 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065]/80 via-transparent to-black/30 pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              {/* Main H1 Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-normal tracking-tight leading-[1.14] text-white drop-shadow-md">
                Fuel Your Business Growth with{" "}
                <span className="block mt-1 bg-gradient-to-r from-purple-200 via-purple-300 to-white bg-clip-text text-transparent font-normal">
                  Collateral-Free Capital up to ₹1 Crore
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-base sm:text-lg text-purple-100/90 font-normal leading-relaxed drop-shadow-sm max-w-2xl">
                Empower your enterprise with instant unsecured business loans, revolving credit lines, and dropline overdrafts. Interest rates starting at 10.75% p.a. with fast 48-hour disbursal.
              </p>

              {/* CTA Buttons (Purples & White) */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={applyHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6424c7] px-8 py-4 text-sm font-normal text-white shadow-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(139,92,246,0.4)] active:scale-98 cursor-pointer border border-white/20"
                >
                  <span>Check Business Eligibility</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#business-calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 backdrop-blur-md px-6 py-4 text-sm font-normal text-white border border-white/25 hover:bg-white/25 transition-all cursor-pointer"
                >
                  <Calculator className="h-4 w-4 text-purple-200" />
                  <span>Calculate Business EMI</span>
                </a>
              </div>

              {/* Small Trust Info */}
              <div className="mt-8 flex items-center gap-6 text-xs text-purple-200/90">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>RBI Regulated Lenders</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-purple-300" />
                  <span>48-Hour Disbursal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-purple-300" />
                  <span>100% Paperless Digital KYC</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Estimator Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white p-6 sm:p-7 text-slate-900 shadow-2xl border border-purple-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <h3 className="text-lg font-normal text-slate-900">Business Eligibility Estimator</h3>
                    <p className="text-xs text-slate-500 font-normal">Check borrowing limit based on your turnover</p>
                  </div>
                  <div className="shrink-0 ml-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/90 px-3.5 py-1.5 text-xs font-normal text-[#6424C7] border border-purple-200 shadow-xs">
                      <Sparkles className="h-3.5 w-3.5 text-[#6424C7]" />
                      <span>Zero Collateral</span>
                    </span>
                  </div>
                </div>

                {!submitSuccess ? (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-normal text-slate-700 mb-1">
                        Annual Business Turnover (₹)
                      </label>
                      <input
                        type="text"
                        value={annualTurnover.toLocaleString("en-IN")}
                        onChange={(e) => {
                          const val = Number(e.target.value.replace(/\D/g, ""));
                          setAnnualTurnover(val || 0);
                        }}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-normal text-slate-700 mb-1">
                          Business Entity
                        </label>
                        <select
                          value={entityType}
                          onChange={(e) => setEntityType(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none bg-white"
                        >
                          <option value="Private Limited / LLP">Pvt Ltd / LLP</option>
                          <option value="Sole Proprietorship">Proprietorship</option>
                          <option value="Partnership Firm">Partnership Firm</option>
                          <option value="Doctor / CA / Professional">Professional (CA/Doctor)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-normal text-slate-700 mb-1">
                          Required Tenure
                        </label>
                        <select
                          value={tenureYears}
                          onChange={(e) => setTenureYears(Number(e.target.value))}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none bg-white"
                        >
                          <option value={1}>1 Year (12 Mos)</option>
                          <option value={2}>2 Years (24 Mos)</option>
                          <option value={3}>3 Years (36 Mos)</option>
                          <option value={5}>5 Years (60 Mos)</option>
                          <option value={7}>7 Years (84 Mos)</option>
                        </select>
                      </div>
                    </div>

                    {/* Calculated Live Sanction Box */}
                    <div className="rounded-2xl bg-purple-50/80 p-4 border border-purple-100">
                      <div className="flex items-center justify-between text-xs text-purple-900 font-normal">
                        <span>Max Eligible Credit Limit:</span>
                        <span className="text-base font-normal text-[#6424C7]">
                          {fmtCurrency(calculations.maxEligibility)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-purple-900 font-normal mt-2 pt-2 border-t border-purple-100">
                        <span>Estimated Monthly EMI (@ 11.25%):</span>
                        <span className="text-sm font-normal text-emerald-600">
                          {fmtCurrency(calculations.emi)}/mo
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-normal text-slate-700 mb-1">
                        Company / Business Name
                      </label>
                      <input
                        type="text"
                        placeholder="Registered business name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-normal text-slate-700 mb-1">
                          Authorized Person
                        </label>
                        <input
                          type="text"
                          placeholder="Full name as per PAN"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-normal text-slate-700 mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="10-digit mobile"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          required
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-[#6424C7] hover:bg-[#521eb0] py-3 text-sm font-normal text-white shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Matching Top 6 Partner Banks...
                        </span>
                      ) : (
                        "Get Instant Business Loan Offers"
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-[#6424C7]">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-normal text-slate-900">Application Received!</h4>
                    <p className="text-xs text-slate-600 font-normal">
                      Our commercial credit manager will contact you with pre-approved banking limits within 2 hours.
                    </p>
                    <Link
                      href={applyHref}
                      className="inline-block rounded-xl bg-[#6424C7] px-5 py-2.5 text-xs text-white font-normal"
                    >
                      Complete Digital KYC Now
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          2. KEY TRUST & ASSET STATS BAR
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-purple-50/50 py-8 border-b border-purple-100/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="border-r border-purple-200/60 last:border-0 pr-4">
              <span className="block text-2xl sm:text-3xl font-normal text-[#6424C7]">From 10.75%</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Starting Business Interest Rate</span>
            </div>
            <div className="border-r border-purple-200/60 last:border-0 pr-4">
              <span className="block text-2xl sm:text-3xl font-normal text-slate-900">Up to ₹1 Crore</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">100% Collateral-Free Sanctions</span>
            </div>
            <div className="border-r border-purple-200/60 last:border-0 pr-4">
              <span className="block text-2xl sm:text-3xl font-normal text-[#6424C7]">48 Hours</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Express Account Disbursal</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-normal text-emerald-600">Up to 7 Years</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Comfortable EMI Tenures</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          3. INTERACTIVE BUSINESS LOAN & WORKING CAPITAL CALCULATOR
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="business-calculator" className="w-full py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Calculate Your Business <span className="text-[#6424C7]">Loan EMI</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Estimate your monthly repayment installment, total interest payable, and optimal loan tenure for healthy business cashflow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Sliders Input Panel */}
            <div className="lg:col-span-7 space-y-7 rounded-3xl bg-slate-50/80 p-6 sm:p-8 border border-slate-200/80">
              
              {/* Slider 1: Loan Amount */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Required Loan Capital</span>
                  <span className="text-base font-normal text-[#6424C7]">{fmtCurrency(loanAmount)}</span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={10000000}
                  step={100000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹5 Lakhs</span>
                  <span>₹1 Crore</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Interest Rate</span>
                  <span className="text-base font-normal text-slate-900">{interestRate.toFixed(2)}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={10.75}
                  max={18.00}
                  step={0.25}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>10.75% (Prime Bank)</span>
                  <span>18.00%</span>
                </div>
              </div>

              {/* Slider 3: Tenure */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Repayment Horizon</span>
                  <span className="text-base font-normal text-slate-900">{tenureYears} Years ({tenureYears * 12} Months)</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 Year</span>
                  <span>7 Years</span>
                </div>
              </div>

            </div>

            {/* Results Box */}
            <div className="lg:col-span-5 rounded-3xl bg-[#4c1d95] p-7 text-white shadow-xl">
              <h3 className="text-xl font-normal text-white border-b border-purple-400/40 pb-4 mb-6">
                Business Repayment Breakdown
              </h3>

              <div className="space-y-5 text-sm font-normal">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Requested Principal Amount:</span>
                  <span className="text-xl font-normal text-white">{fmtCurrency(loanAmount)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Monthly Business Installment:</span>
                  <span className="text-lg font-normal text-emerald-300">{fmtCurrency(calculations.emi)}/mo</span>
                </div>

                <div className="flex justify-between items-center border-t border-purple-400/30 pt-3">
                  <span className="text-purple-200">Total Interest Payable ({tenureYears} Yrs):</span>
                  <span className="text-base font-normal text-purple-200">{fmtCurrency(calculations.totalInterest)}</span>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 border border-white/15">
                  <span className="block text-xs text-purple-200 font-normal">Total Repayment Amount:</span>
                  <span className="text-2xl font-normal text-white block mt-1">
                    {fmtCurrency(calculations.totalRepayment)}
                  </span>
                </div>

                <div className="pt-4">
                  <Link
                    href={applyHref}
                    className="block w-full text-center rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6424c7] py-3.5 text-sm font-normal text-white shadow-md hover:scale-[1.01] transition-transform border border-white/20"
                  >
                    Apply for {fmtCurrency(loanAmount)} Business Loan
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          4. COMPARE TOP LENDERS FOR BUSINESS EXPANSION
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="bank-comparison" className="w-full py-14 sm:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Compare Top Partner Lenders for <span className="text-[#6424C7]">Business Loans</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Transparent interest rates, sanction limits, and processing terms from India's most trusted commercial banks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessLenders.map((b) => (
              <div
                key={b.slug}
                className="group flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:border-purple-200"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div className="relative h-10 w-36">
                      <Image
                        src={b.logo}
                        alt={b.name}
                        fill
                        className="object-contain object-left"
                      />
                    </div>
                    <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-normal text-[#6424C7] border border-purple-100">
                      {b.maxLimit}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-slate-700 font-normal">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Interest Rate:</span>
                      <span className="font-normal text-slate-900 text-sm">{b.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Processing Fee:</span>
                      <span className="font-normal text-slate-900">{b.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Maximum Tenure:</span>
                      <span className="font-normal text-slate-900">{b.maxTenure}</span>
                    </div>
                  </div>

                  <p className="mt-4 pt-3 border-t border-slate-100 text-[11.5px] text-slate-500 font-normal flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{b.features}</span>
                  </p>
                </div>

                <div className="mt-6 pt-4">
                  <Link
                    href={`${applyHref}&bank=${b.slug}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-50 hover:bg-[#6424C7] hover:text-white py-2.5 text-xs font-normal text-[#6424C7] transition-all cursor-pointer"
                  >
                    <span>Check Offer with {b.name.split(" ")[0]}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          5. SPECIALIZED BUSINESS VARIANTS (DECONTAINERIZED & BORDERLESS)
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="variants" className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-slate-900 leading-[1.15]">
              Specialized Business Financing{" "}
              <span className="bg-gradient-to-r from-[#6424C7] to-purple-600 bg-clip-text text-transparent font-normal">
                Programs
              </span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Customized credit facilities designed for term expansion, operational working capital, dropline overdrafts, and GST surrogate limits.
            </p>
          </div>

          {/* Borderless Edge-to-Edge Layout Stack */}
          <div className="space-y-20 sm:space-y-28">
            {businessVariants.map((v, idx) => {
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={v.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-stretch ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Visual Image Column */}
                  <div
                    className={`lg:col-span-6 relative flex ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="relative w-full h-full min-h-[340px] sm:min-h-[420px] overflow-hidden rounded-3xl shadow-[0_16px_40px_-12px_rgba(0,0,0,0.14)] bg-gray-100">
                      <Image
                        src={v.image}
                        alt={v.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />

                      <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex items-center justify-between rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2.5 text-white select-none">
                        <div>
                          <span className="block text-[10px] uppercase font-normal text-white/70 tracking-wider">
                            Option {idx + 1}
                          </span>
                          <span className="text-sm sm:text-base font-normal text-white">
                            {v.badge}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] uppercase font-normal text-white/70 tracking-wider">
                            Starting Rate
                          </span>
                          <span className="text-sm sm:text-base font-normal text-purple-200">
                            From 10.75%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editorial Content Column */}
                  <div
                    className={`lg:col-span-6 flex flex-col justify-center py-2 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 text-xs font-normal uppercase tracking-widest text-[#6424C7]">
                      <span>Variant {idx + 1} of {businessVariants.length}</span>
                      <span>•</span>
                      <span>{v.badge}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-slate-900 leading-snug">
                      {v.title}
                    </h3>
                    <p className="mt-1 text-sm font-normal text-[#6424C7]">
                      {v.subtitle}
                    </p>

                    <p className="mt-4 text-[14.5px] sm:text-[15.5px] leading-relaxed text-slate-600 font-normal">
                      {v.description}
                    </p>

                    <div className="mt-6 space-y-2.5">
                      {v.bullets.map((b) => (
                        <div key={b} className="flex items-start gap-3">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-[13.5px] sm:text-[14px] text-slate-700 font-normal">
                            {b}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <Link
                        href={`${applyHref}&variant=${v.id}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#6424C7] hover:bg-[#521eb0] text-white font-normal text-xs px-5 py-3 shadow-sm transition-all active:scale-98"
                      >
                        <span>Check Pre-Approved Offer</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <span className="text-xs text-slate-500 font-normal">
                        💡 {v.highlightText}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          6. ELIGIBLE BUSINESS ENTITIES & CRITERIA (BORDERLESS)
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Eligible Business Entities &amp; <span className="text-[#6424C7]">Profiles</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              We finance registered enterprises across manufacturing, service providers, retail, trading, and self-employed professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Private Ltd & LLPs",
                limit: "Up to ₹1 Crore",
                desc: "Registered corporate entities with minimum 2 years vintage and annual turnover > ₹40 Lakhs.",
                image: "/assets/loan-banners/lap-variant-commercial.jpg",
              },
              {
                title: "Sole Proprietorships",
                limit: "Up to ₹50 Lakhs",
                desc: "Individual business owners with active GST registration and 12 months current bank statements.",
                image: "/assets/loan-banners/business-hero.jpg",
              },
              {
                title: "Partnership Firms",
                limit: "Up to ₹75 Lakhs",
                desc: "Registered partnership deed, active business operations, and audited ITRs.",
                image: "/assets/loan-banners/lap-variant-overdraft.jpg",
              },
              {
                title: "Self-Employed Doctors & CAs",
                limit: "Up to ₹50 Lakhs",
                desc: "Specialized professional loans for clinics, diagnostic centers, and audit consultancies.",
                image: "/assets/loan-banners/lap-variant-refinance.jpg",
              },
            ].map((p) => (
              <div key={p.title} className="group overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:border-purple-200 flex flex-col justify-between">
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-normal text-[#6424C7] shadow-xs">
                    {p.limit}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-normal text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 font-normal leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          7. 4-STEP EXPRESS BUSINESS DISBURSAL WORKFLOW
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              4-Step Express <span className="text-[#6424C7]">Disbursal Process</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Experience completely digital borrowing with paperless GST fetching, bank statement analyzers, and fast disbursals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Enter Business GST Details",
                desc: "Provide basic business PAN, GSTIN, and annual turnover figures on our digital platform.",
              },
              {
                step: "02",
                title: "Auto-Fetch Bank Statements",
                desc: "Securely upload 12 months PDF bank statements via RBI Account Aggregator.",
              },
              {
                step: "03",
                title: "Compare Sanction Offers",
                desc: "Review pre-approved loan quotes from HDFC, ICICI, Axis, Kotak, and Bajaj Finserv.",
              },
              {
                step: "04",
                title: "E-Sign & Account Credit",
                desc: "Complete Aadhaar e-Sign and receive funds credited directly into your current account.",
              },
            ].map((s) => (
              <div key={s.step} className="rounded-3xl bg-slate-50/70 p-7 border border-slate-200/80">
                <span className="text-3xl font-normal text-[#6424C7] block mb-3">{s.step}</span>
                <h3 className="text-lg font-normal text-slate-900">{s.title}</h3>
                <p className="mt-2 text-xs text-slate-600 font-normal leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          8. BUSINESS LOAN VS WORKING CAPITAL VS LAP COMPARISON TABLE
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Unsecured Business Loan <span className="text-[#6424C7]">vs Line of Credit vs LAP</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Compare different commercial borrowing structures to find the best balance of speed, cost, and security.
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse bg-white text-left text-sm font-normal rounded-2xl overflow-hidden border border-slate-200">
              <thead className="bg-[#4c1d95] text-white text-xs font-normal uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-[28%]">Parameter</th>
                  <th className="px-6 py-4 w-[24%] text-purple-200 font-normal">Unsecured Business Loan</th>
                  <th className="px-6 py-4 w-[24%] font-normal">Working Capital Credit Line</th>
                  <th className="px-6 py-4 w-[24%] font-normal">Loan Against Property (LAP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Collateral Required</td>
                  <td className="px-6 py-4 font-normal text-emerald-600">ZERO (100% Unsecured)</td>
                  <td className="px-6 py-4 text-slate-600">Stock / Book Debts</td>
                  <td className="px-6 py-4 text-slate-600">Property Mortgage</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Disbursal Turnaround</td>
                  <td className="px-6 py-4 font-normal text-[#6424C7]">48 to 72 Hours</td>
                  <td className="px-6 py-4 text-slate-600">3 to 5 Days</td>
                  <td className="px-6 py-4 text-slate-600">7 to 10 Days</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Maximum Limit</td>
                  <td className="px-6 py-4 font-normal text-slate-900">Up to ₹1 Crore</td>
                  <td className="px-6 py-4 text-slate-600">Up to ₹2 Crores</td>
                  <td className="px-6 py-4 text-slate-600">Up to ₹25 Crores</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Starting Interest Rate</td>
                  <td className="px-6 py-4 font-normal text-[#6424C7]">10.75% – 16.00% p.a.</td>
                  <td className="px-6 py-4 text-slate-600">11.00% – 15.00% p.a.</td>
                  <td className="px-6 py-4 text-slate-600">8.90% – 10.00% p.a.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          9. COMPREHENSIVE BUSINESS & FINANCIAL DOCUMENT CHECKLIST
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Business &amp; Financial <span className="text-[#6424C7]">Documentation Checklist</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Review basic business KYC, GST returns, and banking statements required for express loan underwriting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Business Entity KYC */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl font-normal text-slate-900 border-b border-slate-200 pb-3">
                Business Entity Proofs
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-normal">
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Business Registration</span>
                  <p className="text-slate-600 text-xs mt-0.5">GST Certificate, Certificate of Incorporation (COI), or Udyam MSME certificate.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Promoter KYC</span>
                  <p className="text-slate-600 text-xs mt-0.5">PAN Card and Aadhaar Card of all primary directors, partners, or proprietor.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Operating Address Proof</span>
                  <p className="text-slate-600 text-xs mt-0.5">Electricity bill or registered rent agreement of active office/factory.</p>
                </div>
              </div>
            </div>

            {/* Financial & Banking Documents */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl font-normal text-slate-900 border-b border-slate-200 pb-3">
                Banking &amp; Tax Papers
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-normal">
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Bank Statements</span>
                  <p className="text-slate-600 text-xs mt-0.5">Latest 12 months operative current account bank statements (PDF).</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">GST Returns</span>
                  <p className="text-slate-600 text-xs mt-0.5">Past 12 months GSTR-3B filings showing continuous business revenue.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Income Tax Returns (ITR)</span>
                  <p className="text-slate-600 text-xs mt-0.5">Past 2 years ITR with computation of income and audited balance sheet (for &gt;₹50L loans).</p>
                </div>
              </div>
            </div>

            {/* Feature Visual Image Banner */}
            <div className="lg:col-span-4 relative rounded-3xl overflow-hidden min-h-[300px] shadow-lg border border-purple-100 flex flex-col justify-end">
              <Image
                src="/assets/loan-banners/business-hero.jpg"
                alt="Express Commercial Credit Assessment"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065] via-[#2e1065]/40 to-transparent" />
              <div className="relative z-10 p-6 text-white space-y-2">
                <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-normal text-purple-100 inline-block">
                  Dedicated SME Desk
                </span>
                <h4 className="text-lg font-normal text-white">Free CA Assisted Sanction Vetting</h4>
                <p className="text-xs text-purple-200/90 font-normal leading-relaxed">
                  Our credit underwriters optimize your GST and CMA data to unlock maximum bank sanction limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          10. FAQS & KNOWLEDGE BASE
         ═════════════════════════════════════════════════════════════════════════ */}
      <LoanFAQSection
        faqs={[
          {
            question: "Can I get a business loan without providing any property collateral?",
            answer:
              "Yes! Unsecured business loans up to ₹1 Crore require ZERO collateral, property mortgages, or gold pledges. Approval is granted purely based on your GST return filings and bank cashflow strength.",
          },
          {
            question: "How quickly are business loan funds disbursed into my account?",
            answer:
              "Once digital KYC, GST verification, and bank statement analysis are completed, sanction letters are issued within 4 to 12 hours, and funds are credited to your current account within 48 to 72 hours.",
          },
          {
            question: "What is the difference between a Term Loan and an Overdraft (OD)?",
            answer:
              "A term loan disburses a lump-sum amount with fixed monthly EMIs over a set tenure. An overdraft acts like a revolving credit line where you only pay interest on the amount withdrawn from your limit, and can deposit surplus revenue at any time to save interest.",
          },
          {
            question: "Are interest payments on business loans eligible for tax deductions?",
            answer:
              "Yes! 100% of the interest paid on business loans is treated as a legitimate operating expense under the Income Tax Act and can be deducted from your taxable business profit.",
          },
        ]}
        title="Frequently Asked Questions About Business & Working Capital Loans"
      />

      <ProductRelatedBlogs category="Loans" productName="Business Loan" />
      <ProductLocationDirectory
        productName="Business Loan"
        productSlug="business-loan"
        pages={locationPages}
      />
      <AppDownloadBanner />
    </main>
  );
}
