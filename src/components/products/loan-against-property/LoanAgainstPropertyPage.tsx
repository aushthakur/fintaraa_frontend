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
  FileCheck2,
  Home,
  Layers,
  Loader2,
  Lock,
  Percent,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { getApplyHref } from "@/components/application/flowRegistry";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { ProductLocationDirectory } from "@/components/products/ProductLocationDirectory";
import { ProductRelatedBlogs } from "@/components/products/ProductRelatedBlogs";
import { LoanFAQSection } from "@/components/products/loan-detail/LoanFAQSection";
import type { LoanSeoLocationPage, LoanSeoPageData } from "@/services/loanSeoPages";
import type { BankProductLender } from "@/services/bankSeoPages";

// ─── Bank Lenders Data ────────────────────────────────────────────────────────
const lapLenders = [
  {
    name: "State Bank of India (SBI)",
    slug: "sbi",
    logo: "/assets/banks/State-Bank-of-India.png",
    rate: "8.90% – 9.65% p.a.",
    ltv: "Up to 75% LTV",
    fee: "0.50% (Max ₹50,000)",
    maxTenure: "Up to 15 Yrs",
    features: "Lowest Floating Rates • Residential & Commercial Property",
  },
  {
    name: "HDFC Bank",
    slug: "hdfc-bank",
    logo: "/assets/banks/HDFC-Bank.png",
    rate: "8.95% – 9.80% p.a.",
    ltv: "Up to 70% LTV",
    fee: "1.00% or ₹10,000",
    maxTenure: "Up to 20 Yrs",
    features: "Express Technical Legal Vetting • Doorstep Pickup",
  },
  {
    name: "ICICI Bank",
    slug: "icici-bank",
    logo: "/assets/banks/ICICI-Bank.png",
    rate: "9.00% – 9.85% p.a.",
    ltv: "Up to 75% LTV",
    fee: "0.50% to 1.00%",
    maxTenure: "Up to 20 Yrs",
    features: "High Ticket Limit up to ₹25 Crore • Overdraft Facility",
  },
  {
    name: "Bank of Baroda",
    slug: "bank-of-baroda",
    logo: "/assets/banks/Bank-of-Baroda.png",
    rate: "8.90% – 9.50% p.a.",
    ltv: "Up to 75% LTV",
    fee: "0.25% (Concessional)",
    maxTenure: "Up to 15 Yrs",
    features: "Zero Prepayment Charges on Floating Rates",
  },
  {
    name: "Axis Bank",
    slug: "axis-bank",
    logo: "/assets/banks/axis-bank.png",
    rate: "9.10% – 10.00% p.a.",
    ltv: "Up to 65% LTV",
    fee: "1.00% of Loan Amount",
    maxTenure: "Up to 20 Yrs",
    features: "Special Rates for Self-Employed Doctors & CAs",
  },
  {
    name: "Kotak Mahindra Bank",
    slug: "kotak-bank",
    logo: "/assets/banks/Kotak-Mahindra-Bank.png",
    rate: "9.00% – 9.75% p.a.",
    ltv: "Up to 70% LTV",
    fee: "0.50% (Max ₹25,000)",
    maxTenure: "Up to 15 Yrs",
    features: "Fast Track Sanction within 7 Days",
  },
];

// ─── LAP Variants (Decontainerized / Borderless) ──────────────────────────────
const lapVariants = [
  {
    id: "residential-lap",
    title: "Residential Property Mortgage Loan",
    subtitle: "Mortgage Self-Occupied or Rented Apartments, Villas & Plots for High Capital",
    badge: "Residential Mortgage",
    icon: Home,
    accent: "#6424C7",
    image: "/assets/loan-banners/lap-variant-residential.jpg",
    description:
      "Unlock substantial liquidity against your self-occupied flat, bungalow, or independent house. Get up to 75% of current market valuation with low interest rates starting at 8.90% p.a.",
    bullets: [
      "Up to 75% Loan-To-Value (LTV) on residential properties",
      "Tenures up to 20 years (240 months) keep EMIs low",
      "Full property usage rights remain 100% with the title owner",
      "Accepts self-occupied, rented out, or vacant residential units",
    ],
    highlightText: "Ideal for business expansion, child education, or debt consolidation.",
  },
  {
    id: "commercial-lap",
    title: "Commercial Property Mortgage Loan",
    subtitle: "Monetize Office Premises, Retail Shops & Commercial Complexes",
    badge: "Commercial Asset",
    icon: Building2,
    accent: "#8b5cf6",
    image: "/assets/loan-banners/lap-variant-commercial.jpg",
    description:
      "Commercial real estate carries high market valuation. Mortgage your office premises, retail shop, showroom, or warehouse to secure large business capital up to ₹25 Crore.",
    bullets: [
      "Financing against prime commercial office spaces & retail shops",
      "Lease Rental Discounting (LRD) options for rented commercial properties",
      "Interest paid is tax-deductible as legitimate business operating expense",
      "Flexible repayment terms matching your corporate cashflow cycles",
    ],
    highlightText: "Higher ticket limits for established corporate entities and firms.",
  },
  {
    id: "lap-overdraft",
    title: "Loan Against Property Overdraft (LAP OD)",
    subtitle: "Revolving Drop-Line Overdraft Buffer Against Property Equity",
    badge: "Revolving Buffer",
    icon: Layers,
    accent: "#6424C7",
    image: "/assets/loan-banners/lap-variant-overdraft.jpg",
    description:
      "Combine the low interest of a secured property loan with the flexibility of an overdraft. Pay interest strictly on the exact amount withdrawn from your sanctioned credit line.",
    bullets: [
      "Pay ZERO interest when the sanctioned limit is un-drawn",
      "Drop-line OD structure gradually amortizes limit over 10-15 years",
      "Unlimited deposits & withdrawals directly linked to current account",
      "Perfect cashflow safety net for seasonal business fluctuations",
    ],
    highlightText: "Save lakhs in interest by depositing daily business revenue back into OD.",
  },
  {
    id: "debt-refinance",
    title: "LAP Debt Refinancing & Top-Up",
    subtitle: "Switch Existing High-Cost Property Loans to Prime 8.90% Bank Rates",
    badge: "Refinance & Top-Up",
    icon: TrendingUp,
    accent: "#8b5cf6",
    image: "/assets/loan-banners/lap-variant-refinance.jpg",
    description:
      "If your property mortgage is currently with a high-cost NBFC charging 11.5%+, transfer it to a prime bank at 8.90% p.a. and get extra top-up cash at the same low rate.",
    bullets: [
      "Slashes monthly EMI by up to 25% through interest rate drop",
      "Get high-ticket top-up cash up to ₹1 Crore for immediate capital needs",
      "Fintaraa handles doorstep document retrieval & legal title transfer",
      "Zero foreclosure penalties on floating-rate property loans",
    ],
    highlightText: "Saves substantial interest outflow over a 15-year repayment horizon.",
  },
];

const fmtCurrency = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(Math.max(0, Math.round(val || 0)));

export function LoanAgainstPropertyPage({
  page,
  lenders = [],
  locationPages = [],
}: {
  page: LoanSeoPageData;
  lenders?: BankProductLender[];
  locationPages?: LoanSeoLocationPage[];
}) {
  // ─── Calculator State ────────────────────────────────────────────────────────
  const [propertyValue, setPropertyValue] = useState<number>(20000000); // 2 Cr
  const [propertyType, setPropertyType] = useState<"residential" | "commercial">("residential");
  const [interestRate, setInterestRate] = useState<number>(8.90);
  const [tenureYears, setTenureYears] = useState<number>(15);

  // Lead Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ─── Live Calculation Engine ─────────────────────────────────────────────────
  const calculations = useMemo(() => {
    // Max LTV: 75% for residential, 65% for commercial
    const maxLtvPct = propertyType === "residential" ? 0.75 : 0.65;
    const maxLoanAmount = Math.round(propertyValue * maxLtvPct);
    
    // Default calculated borrowing amount = maxLoanAmount
    const P = maxLoanAmount;
    const r = interestRate / 12 / 100;
    const N = tenureYears * 12;

    const emi =
      P * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
    const totalRepayment = emi * N;
    const totalInterest = totalRepayment - P;

    return {
      maxLtvPct: Math.round(maxLtvPct * 100),
      maxLoanAmount,
      emi: Math.round(emi),
      totalRepayment: Math.round(totalRepayment),
      totalInterest: Math.round(totalInterest),
    };
  }, [propertyValue, propertyType, interestRate, tenureYears]);

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
    productSlug: "loan-against-property",
    referrer: "/products/loan-against-property",
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
            src="/assets/loan-banners/lap-hero.jpg"
            alt="Luxury Property Mortgage Loan Against Property"
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
                Unlock High-Ticket Capital Against{" "}
                <span className="block mt-1 bg-gradient-to-r from-purple-200 via-purple-300 to-white bg-clip-text text-transparent font-normal">
                  Residential or Commercial Property
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-base sm:text-lg text-purple-100/90 font-normal leading-relaxed drop-shadow-sm max-w-2xl">
                Mortgage your fully constructed home, office space, or retail shop to raise up to ₹25 Crore at low secured interest rates starting at 8.90% p.a. Keep 100% property ownership and usage rights intact.
              </p>

              {/* CTA Buttons (Purples & White) */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={applyHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6424c7] px-8 py-4 text-sm font-normal text-white shadow-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(139,92,246,0.4)] active:scale-98 cursor-pointer border border-white/20"
                >
                  <span>Check Property Sanction Limit</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#ltv-calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 backdrop-blur-md px-6 py-4 text-sm font-normal text-white border border-white/25 hover:bg-white/25 transition-all cursor-pointer"
                >
                  <Calculator className="h-4 w-4 text-purple-200" />
                  <span>Calculate Property LTV</span>
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
                  <span>Sanctions in 5-7 Days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-purple-300" />
                  <span>100% Title Security</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Estimator Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white p-6 sm:p-7 text-slate-900 shadow-2xl border border-purple-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <h3 className="text-lg font-normal text-slate-900">Property Sanction Estimator</h3>
                    <p className="text-xs text-slate-500 font-normal">Check maximum loan amount against your property</p>
                  </div>
                  <div className="shrink-0 ml-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/90 px-3.5 py-1.5 text-xs font-normal text-[#6424C7] border border-purple-200 shadow-xs">
                      <Sparkles className="h-3.5 w-3.5 text-[#6424C7]" />
                      <span>Up to 75% LTV</span>
                    </span>
                  </div>
                </div>

                {!submitSuccess ? (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-normal text-slate-700 mb-1">
                        Estimated Property Market Value (₹)
                      </label>
                      <input
                        type="text"
                        value={propertyValue.toLocaleString("en-IN")}
                        onChange={(e) => {
                          const val = Number(e.target.value.replace(/\D/g, ""));
                          setPropertyValue(val || 0);
                        }}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-normal text-slate-700 mb-1">
                          Property Type
                        </label>
                        <select
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value as "residential" | "commercial")}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none bg-white"
                        >
                          <option value="residential">Residential (75% LTV)</option>
                          <option value="commercial">Commercial (65% LTV)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-normal text-slate-700 mb-1">
                          Tenure (Years)
                        </label>
                        <select
                          value={tenureYears}
                          onChange={(e) => setTenureYears(Number(e.target.value))}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none bg-white"
                        >
                          <option value={5}>5 Years</option>
                          <option value={10}>10 Years</option>
                          <option value={15}>15 Years</option>
                          <option value={20}>20 Years</option>
                        </select>
                      </div>
                    </div>

                    {/* Calculated Live Sanction Box */}
                    <div className="rounded-2xl bg-purple-50/80 p-4 border border-purple-100">
                      <div className="flex items-center justify-between text-xs text-purple-900 font-normal">
                        <span>Max Eligible Sanction ({calculations.maxLtvPct}% LTV):</span>
                        <span className="text-base font-normal text-[#6424C7]">
                          {fmtCurrency(calculations.maxLoanAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-purple-900 font-normal mt-2 pt-2 border-t border-purple-100">
                        <span>Estimated Monthly EMI (@ 8.90%):</span>
                        <span className="text-sm font-normal text-emerald-600">
                          {fmtCurrency(calculations.emi)}/mo
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-normal text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter as per PAN Card"
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
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        required
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-[#6424C7] hover:bg-[#521eb0] py-3 text-sm font-normal text-white shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Verifying Title Eligibility...
                        </span>
                      ) : (
                        "Get Instant Property Sanction Letter"
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-[#6424C7]">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-normal text-slate-900">In-Principle Sanction Request Received!</h4>
                    <p className="text-xs text-slate-600 font-normal">
                      Our property mortgage specialist will contact you shortly to schedule a doorstep technical and legal title evaluation.
                    </p>
                    <Link
                      href={applyHref}
                      className="inline-block rounded-xl bg-[#6424C7] px-5 py-2.5 text-xs text-white font-normal"
                    >
                      Complete Full Application Now
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
              <span className="block text-2xl sm:text-3xl font-normal text-[#6424C7]">From 8.90%</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Starting Secured Interest Rate</span>
            </div>
            <div className="border-r border-purple-200/60 last:border-0 pr-4">
              <span className="block text-2xl sm:text-3xl font-normal text-slate-900">Up to ₹25 Cr</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Maximum Ticket Sanction</span>
            </div>
            <div className="border-r border-purple-200/60 last:border-0 pr-4">
              <span className="block text-2xl sm:text-3xl font-normal text-[#6424C7]">Up to 75%</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Property Loan-To-Value (LTV)</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-normal text-emerald-600">20 Years</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Flexible Repayment Horizon</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          3. INTERACTIVE PROPERTY LTV & EMI CALCULATOR
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="ltv-calculator" className="w-full py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Calculate Your Property <span className="text-[#6424C7]">LTV &amp; EMI</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Estimate your borrowing ceiling based on your property valuation and select a comfortable monthly installment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Sliders Input Panel */}
            <div className="lg:col-span-7 space-y-7 rounded-3xl bg-slate-50/80 p-6 sm:p-8 border border-slate-200/80">
              
              {/* Slider 1: Property Value */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Property Market Valuation</span>
                  <span className="text-base font-normal text-[#6424C7]">{fmtCurrency(propertyValue)}</span>
                </div>
                <input
                  type="range"
                  min={3000000}
                  max={100000000}
                  step={1000000}
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹30 Lakhs</span>
                  <span>₹10 Crores</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Secured Interest Rate</span>
                  <span className="text-base font-normal text-slate-900">{interestRate.toFixed(2)}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={8.90}
                  max={12.50}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>8.90% (Prime Bank)</span>
                  <span>12.50%</span>
                </div>
              </div>

              {/* Slider 3: Tenure */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Repayment Tenure</span>
                  <span className="text-base font-normal text-slate-900">{tenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={20}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>3 Years</span>
                  <span>20 Years</span>
                </div>
              </div>

            </div>

            {/* Results Box */}
            <div className="lg:col-span-5 rounded-3xl bg-[#4c1d95] p-7 text-white shadow-xl">
              <h3 className="text-xl font-normal text-white border-b border-purple-400/40 pb-4 mb-6">
                Loan Against Property Breakdown
              </h3>

              <div className="space-y-5 text-sm font-normal">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Max Sanction Limit ({calculations.maxLtvPct}% LTV):</span>
                  <span className="text-xl font-normal text-white">{fmtCurrency(calculations.maxLoanAmount)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Monthly EMI:</span>
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
                    Apply for {fmtCurrency(calculations.maxLoanAmount)} LAP
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          4. COMPARE TOP LENDERS FOR LOAN AGAINST PROPERTY
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="bank-comparison" className="w-full py-14 sm:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Compare Top Partner Lenders for <span className="text-[#6424C7]">Loan Against Property</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Transparent interest rates, LTV allocations, and processing terms from India's most trusted RBI-regulated banks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lapLenders.map((b) => (
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
                      {b.ltv}
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
          5. SPECIALIZED LAP VARIANTS (DECONTAINERIZED & BORDERLESS)
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="variants" className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-slate-900 leading-[1.15]">
              Specialized Property Loan{" "}
              <span className="bg-gradient-to-r from-[#6424C7] to-purple-600 bg-clip-text text-transparent font-normal">
                Variants
              </span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Tailored mortgage structures designed for residential homes, commercial premises, overdraft buffers, and debt refinancing.
            </p>
          </div>

          {/* Borderless Edge-to-Edge Layout Stack */}
          <div className="space-y-20 sm:space-y-28">
            {lapVariants.map((v, idx) => {
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
                            From 8.90%
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
                      <span>Variant {idx + 1} of {lapVariants.length}</span>
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
          6. PROPERTY TYPES & VALUATION GUIDELINES (BORDERLESS & RICH IMAGES)
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Eligible Property Types &amp; <span className="text-[#6424C7]">Valuation Criteria</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Banks accept fully constructed residential and commercial properties with clear marketable title deeds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Self-Occupied Homes",
                ltv: "Up to 75% LTV",
                desc: "Flats, independent houses, and villas with registered sale deeds and completion certificates.",
                image: "/assets/loan-banners/rendered/home-loan-01-desktop.webp",
              },
              {
                title: "Rented Commercial Shops",
                ltv: "Up to 65% LTV",
                desc: "Retail showrooms, office units, and commercial complexes generating active monthly rental yields.",
                image: "/assets/loan-banners/rendered/commercial-purchases-loan-01-desktop.webp",
              },
              {
                title: "Industrial Units",
                ltv: "Up to 60% LTV",
                desc: "Factory premises and industrial sheds with municipal authority zoning permissions.",
                image: "/assets/loan-banners/rendered/industrial-loan-01-desktop.webp",
              },
              {
                title: "Vacant Residential Plots",
                ltv: "Up to 50% LTV",
                desc: "Plots in municipal development authority layouts with boundary wall and clear road access.",
                image: "/assets/loan-banners/rendered/renovation-loan-01-desktop.webp",
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
                    {p.ltv}
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
          7. STEP-BY-STEP GUIDED LAP APPLICATION ROADMAP
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              4-Step Guided <span className="text-[#6424C7]">Property Mortgage Process</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              From legal title search to final bank mortgage registration, Fintaraa manages the end-to-end journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Submit Property Details",
                desc: "Share basic property type, location, estimated valuation, and financial income profile.",
              },
              {
                step: "02",
                title: "Doorstep Technical Check",
                desc: "Empaneled bank engineers inspect the property and legal advocate conducts title search.",
              },
              {
                step: "03",
                title: "Credit Sanction Letter",
                desc: "Bank issues official sanction letter with exact loan amount, interest rate, and tenure.",
              },
              {
                step: "04",
                title: "Mortgage & Disbursal",
                desc: "Complete simple mortgage registration and receive funds directly into your account.",
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
          8. LAP VS UNSECURED LOANS COMPARISON TABLE
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Loan Against Property <span className="text-[#6424C7]">vs Unsecured Loans</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Discover why secured property loans offer significantly higher limits and lower monthly interest burdens.
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse bg-white text-left text-sm font-normal rounded-2xl overflow-hidden border border-slate-200">
              <thead className="bg-[#4c1d95] text-white text-xs font-normal uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-[28%]">Parameter</th>
                  <th className="px-6 py-4 w-[36%] text-purple-200 font-normal">Loan Against Property (LAP)</th>
                  <th className="px-6 py-4 w-[36%] font-normal">Personal / Business Loan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Starting Interest Rate</td>
                  <td className="px-6 py-4 font-normal text-[#6424C7]">8.90% – 10.00% p.a.</td>
                  <td className="px-6 py-4 text-slate-600">11.50% – 18.00% p.a.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Maximum Loan Limit</td>
                  <td className="px-6 py-4 font-normal text-[#6424C7]">Up to ₹25 Crores (75% LTV)</td>
                  <td className="px-6 py-4 text-slate-600">Up to ₹50 Lakhs to ₹1 Crore</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Maximum Tenure</td>
                  <td className="px-6 py-4 font-normal text-[#6424C7]">Up to 20 Years (240 Mos)</td>
                  <td className="px-6 py-4 text-slate-600">1 to 5 Years (60 Mos)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Monthly EMI Impact</td>
                  <td className="px-6 py-4 font-normal text-emerald-600">Extremely Low (Long Tenure)</td>
                  <td className="px-6 py-4 text-slate-600">High (Short 3-5 Year Amortization)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          9. COMPREHENSIVE ELIGIBILITY & DOCUMENT CHECKLIST (WITH IMAGE BANNER)
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Borrower &amp; Property <span className="text-[#6424C7]">Documentation Checklist</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Review basic borrower KYC, income proofs, and legal property deed paperwork required for LAP.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Borrower Eligibility */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl font-normal text-slate-900 border-b border-slate-200 pb-3">
                Borrower Financial Eligibility
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-normal">
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Borrower Age Limit</span>
                  <p className="text-slate-600 text-xs mt-0.5">23 to 70 years at loan tenure completion.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Income Vintage</span>
                  <p className="text-slate-600 text-xs mt-0.5">Minimum 3 years active business operations or 2 years salaried employment.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">CIBIL Bureau Score</span>
                  <p className="text-slate-600 text-xs mt-0.5">700+ for standard processing; 750+ for maximum 75% LTV allocation.</p>
                </div>
              </div>
            </div>

            {/* Property Documents */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl font-normal text-slate-900 border-b border-slate-200 pb-3">
                Property Legal Documents
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-normal">
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Title Deed Chain</span>
                  <p className="text-slate-600 text-xs mt-0.5">Original registered sale deed, gift deed, or partition deed with parent chain.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Approved Layout Plan</span>
                  <p className="text-slate-600 text-xs mt-0.5">Sanctioned building map &amp; municipal completion/occupancy certificate (CC/OC).</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Tax &amp; EC Receipts</span>
                  <p className="text-slate-600 text-xs mt-0.5">Past 13 to 30 years Encumbrance Certificate (EC) &amp; latest property tax paid receipt.</p>
                </div>
              </div>
            </div>

            {/* Feature Visual Image Banner */}
            <div className="lg:col-span-4 relative rounded-3xl overflow-hidden min-h-[300px] shadow-lg border border-purple-100 flex flex-col justify-end">
              <Image
                src="/assets/loan-banners/rendered/loan-against-property-01-desktop.webp"
                alt="Property Title Verification Document Assistance"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065] via-[#2e1065]/40 to-transparent" />
              <div className="relative z-10 p-6 text-white space-y-2">
                <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-normal text-purple-100 inline-block">
                  Doorstep Verification
                </span>
                <h4 className="text-lg font-normal text-white">Free Doorstep Document Pickup</h4>
                <p className="text-xs text-purple-200/90 font-normal leading-relaxed">
                  Fintaraa doorstep RM collects original property deeds and assists with bank advocate legal title vetting.
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
            question: "What is the maximum Loan-To-Value (LTV) offered on Loan Against Property?",
            answer:
              "Banks offer up to 75% LTV on self-occupied residential properties and up to 65% LTV on commercial offices or retail shops.",
          },
          {
            question: "Can I use Loan Against Property funds for any business or personal need?",
            answer:
              "Yes! LAP is an end-use unrestricted loan. You can use the capital for business expansion, raw material procurement, debt refinancing, medical needs, or marriage expenses.",
          },
          {
            question: "Do I continue owning and using my property after taking a LAP?",
            answer:
              "100% Yes! You retain full ownership, occupancy, and rental income rights. The bank only registers a simple mortgage charge on the title deed.",
          },
          {
            question: "Are interest payments on Loan Against Property tax-deductible?",
            answer:
              "If the loan funds are utilized for business growth or income-generating capital expenditure, interest paid is written off as a legitimate business expense.",
          },
        ]}
        title="Frequently Asked Questions About Loan Against Property"
      />

      <ProductRelatedBlogs category="Loans" productName="Loan Against Property" />
      <ProductLocationDirectory
        productName="Loan Against Property"
        productSlug="loan-against-property"
        pages={locationPages}
      />
      <AppDownloadBanner />
    </main>
  );
}
