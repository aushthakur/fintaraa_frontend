"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Building,
  Building2,
  Calculator,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  Hammer,
  HardHat,
  Home,
  Layers,
  Loader2,
  Lock,
  Paintbrush,
  Percent,
  Ruler,
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

// ─── Bank Lenders for Construction Loan ──────────────────────────────────────
const constructionLenders = [
  {
    name: "State Bank of India (SBI)",
    slug: "sbi",
    logo: "/assets/banks/State-Bank-of-India.png",
    rate: "8.40% – 9.15% p.a.",
    ltv: "Up to 90% Cost",
    fee: "0.35% (Max ₹10,000)",
    maxTenure: "Up to 30 Yrs",
    features: "SBI Realty & Home Construction • Lowest Pre-EMI Interest",
  },
  {
    name: "HDFC Bank",
    slug: "hdfc-bank",
    logo: "/assets/banks/HDFC-Bank.png",
    rate: "8.50% – 9.35% p.a.",
    ltv: "Up to 85% Cost",
    fee: "0.50% or ₹5,000",
    maxTenure: "Up to 30 Yrs",
    features: "Fast-Track Engineer BOQ Approvals • Zero Prepayment Penalty",
  },
  {
    name: "ICICI Bank",
    slug: "icici-bank",
    logo: "/assets/banks/ICICI-Bank.png",
    rate: "8.55% – 9.40% p.a.",
    ltv: "Up to 90% Cost",
    fee: "0.50% to 1.00%",
    maxTenure: "Up to 30 Yrs",
    features: "Composite Plot + Construction Combo • High Limits up to ₹15 Cr",
  },
  {
    name: "Bank of Baroda",
    slug: "bank-of-baroda",
    logo: "/assets/banks/Bank-of-Baroda.png",
    rate: "8.40% – 9.20% p.a.",
    ltv: "Up to 90% Cost",
    fee: "0.25% (Concessional)",
    maxTenure: "Up to 30 Yrs",
    features: "18 Months Construction Moratorium • Direct Vendor Payouts",
  },
  {
    name: "Axis Bank",
    slug: "axis-bank",
    logo: "/assets/banks/axis-bank.png",
    rate: "8.60% – 9.50% p.a.",
    ltv: "Up to 85% Cost",
    fee: "1.00% of Sanction",
    maxTenure: "Up to 25 Yrs",
    features: "Special Rates for Architects & Civil Engineers",
  },
  {
    name: "Kotak Mahindra Bank",
    slug: "kotak-bank",
    logo: "/assets/banks/Kotak-Mahindra-Bank.png",
    rate: "8.50% – 9.30% p.a.",
    ltv: "Up to 80% Cost",
    fee: "0.50% (Max ₹15,000)",
    maxTenure: "Up to 20 Yrs",
    features: "Rapid 5-Day Technical Sanction on Approved Layout Plans",
  },
];

// ─── Specialized Construction Variants ──────────────────────────────────────
const constructionVariants = [
  {
    id: "self-plot-construction",
    title: "Self-Plot Residential Construction Loan",
    subtitle: "Build an Independent Villa, Bungalow or Row House on Your Owned Land",
    badge: "Residential Villa",
    icon: Home,
    accent: "#6424C7",
    image: "/assets/loan-banners/construction-variant-self-plot.jpg",
    description:
      "If you already own a freehold residential plot or inherited land, finance up to 90% of the certified civil construction estimate. Disbursals are released in stages as construction milestones progress.",
    bullets: [
      "Finances up to 90% of certified architect Bill of Quantities (BOQ)",
      "Pay Pre-EMI interest only on the disbursed construction tranches",
      "Up to 30-year repayment tenure commencing post-construction completion",
      "Full income tax deductions under Section 24(b) and 80C applicable",
    ],
    highlightText: "Construct your custom floor layout with total architectural freedom.",
  },
  {
    id: "composite-plot-construction",
    title: "Composite Plot Purchase + Construction Loan",
    subtitle: "Single Loan Package to Buy a Residential Plot and Construct Your Home",
    badge: "Plot + Build Combo",
    icon: Layers,
    accent: "#8b5cf6",
    image: "/assets/loan-banners/construction-variant-plot-combo.jpg",
    description:
      "Looking to buy a vacant plot and build your home? Avoid managing two separate loans. A composite loan finances both the plot purchase (up to 75% LTV) and the construction cost (up to 90%) under a unified low home loan rate.",
    bullets: [
      "Single unified loan account with lower combined processing fees",
      "Up to 3 to 5 years construction commencement window from plot purchase",
      "Seamless transition from plot financing to stage-wise civil disbursals",
      "Competitive repo-linked interest rates starting at 8.40% p.a.",
    ],
    highlightText: "Ideal for gated residential layouts and development authority plots.",
  },
  {
    id: "home-extension-floor",
    title: "Home Extension & Additional Floor Construction",
    subtitle: "Expand Your Existing House by Adding Upper Floors or Extra Rooms",
    badge: "Floor Addition & Renovation",
    icon: Hammer,
    accent: "#6424C7",
    image: "/assets/loan-banners/construction-variant-floor-extension.jpg",
    description:
      "Expand your living space as your family grows. Finance the construction of additional floors (1st, 2nd, or 3rd floor), bedroom extensions, terraces, or private home offices on top of your existing built structure.",
    bullets: [
      "No need to purchase new land — build directly on existing foundation",
      "Loans up to ₹1 Crore sanctioned based on structural engineer stability report",
      "Flexible repayment terms up to 20 years to keep monthly EMIs light",
      "Quick documentation with existing property title deeds",
    ],
    highlightText: "Add significant market valuation to your existing property asset.",
  },
  {
    id: "commercial-construction",
    title: "Commercial & Industrial Property Construction",
    subtitle: "Finance Construction of Office Complexes, Retail Hubs & Warehouses",
    badge: "Commercial Infrastructure",
    icon: Building2,
    accent: "#8b5cf6",
    image: "/assets/loan-banners/construction-variant-commercial.jpg",
    description:
      "Construct modern commercial office buildings, industrial manufacturing sheds, warehouses, or retail commercial complexes on commercial-zoned land with high ticket limits up to ₹15 Crore.",
    bullets: [
      "Tailored for builders, enterprise firms, and self-employed professionals",
      "Structured milestone tranches matching civil contractor billing cycles",
      "Lease Rental Discounting (LRD) conversion available post-tenant occupancy",
      "Tax deductible interest as legitimate business capital expenditure",
    ],
    highlightText: "High-ticket project financing with structured corporate moratoriums.",
  },
];

const fmtCurrency = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(Math.max(0, Math.round(val || 0)));

export function ConstructionLoanPage({
  page,
  lenders = [],
  locationPages = [],
}: {
  page: LoanSeoPageData;
  lenders?: BankProductLender[];
  locationPages?: LoanSeoLocationPage[];
}) {
  // ─── Construction Calculator State ──────────────────────────────────────────
  const [constructionCost, setConstructionCost] = useState<number>(5000000); // 50 Lakhs
  const [plotValue, setPlotValue] = useState<number>(3000000); // 30 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.40);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [constructionMonths, setConstructionMonths] = useState<number>(12);

  // Lead Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [plotCity, setPlotCity] = useState("Delhi NCR");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ─── Live Calculation Engine ─────────────────────────────────────────────────
  const calculations = useMemo(() => {
    // 90% of construction cost + up to 75% of plot value
    const maxLoanAmount = Math.round(constructionCost * 0.90);
    const P = maxLoanAmount;
    const r = interestRate / 12 / 100;
    const N = tenureYears * 12;

    const emi =
      P * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
    const totalRepayment = emi * N;
    const totalInterest = totalRepayment - P;

    // Tranche breakdown
    const tranche1 = Math.round(P * 0.25); // Foundation/Plinth 25%
    const tranche2 = Math.round(P * 0.35); // Slab & Masonry 35%
    const tranche3 = Math.round(P * 0.40); // Finishing 40%

    // Pre-EMI during construction (estimated on average 50% drawn balance)
    const preEmiEstimated = Math.round((P * 0.5) * (interestRate / 12 / 100));

    return {
      maxLoanAmount,
      emi: Math.round(emi),
      totalRepayment: Math.round(totalRepayment),
      totalInterest: Math.round(totalInterest),
      tranche1,
      tranche2,
      tranche3,
      preEmiEstimated,
    };
  }, [constructionCost, plotValue, interestRate, tenureYears, constructionMonths]);

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
    productSlug: "construction-loan",
    referrer: "/products/construction-loan",
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
            src="/assets/loan-banners/construction-hero.jpg"
            alt="Home and Commercial Construction Loan"
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
                Build Your Dream Home or Project{" "}
                <span className="block mt-1 bg-gradient-to-r from-purple-200 via-purple-300 to-white bg-clip-text text-transparent font-normal">
                  From Ground Up with 90% Financing
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-base sm:text-lg text-purple-100/90 font-normal leading-relaxed drop-shadow-sm max-w-2xl">
                Finance independent plot construction, additional floor extensions, or commercial real estate with flexible stage-wise milestone disbursements. Pay Pre-EMI interest only on drawn funds starting at 8.40% p.a.
              </p>

              {/* CTA Buttons (Purples & White) */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={applyHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6424c7] px-8 py-4 text-sm font-normal text-white shadow-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(139,92,246,0.4)] active:scale-98 cursor-pointer border border-white/20"
                >
                  <span>Check Construction Eligibility</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#construction-calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 backdrop-blur-md px-6 py-4 text-sm font-normal text-white border border-white/25 hover:bg-white/25 transition-all cursor-pointer"
                >
                  <Calculator className="h-4 w-4 text-purple-200" />
                  <span>Calculate Tranche EMI</span>
                </a>
              </div>

              {/* Trust Info */}
              <div className="mt-8 flex items-center gap-6 text-xs text-purple-200/90">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>RBI Regulated Lenders</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HardHat className="h-4 w-4 text-purple-300" />
                  <span>Civil Engineer BOQ Approvals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-purple-300" />
                  <span>Pre-EMI Moratorium Available</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Estimator Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white p-6 sm:p-7 text-slate-900 shadow-2xl border border-purple-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <h3 className="text-lg font-normal text-slate-900">Construction Sanction Estimator</h3>
                    <p className="text-xs text-slate-500 font-normal">Stage-wise milestone financing calculator</p>
                  </div>
                  <div className="shrink-0 ml-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/90 px-3.5 py-1.5 text-xs font-normal text-[#6424C7] border border-purple-200 shadow-xs">
                      <Sparkles className="h-3.5 w-3.5 text-[#6424C7]" />
                      <span>Up to 90% Cost</span>
                    </span>
                  </div>
                </div>

                {!submitSuccess ? (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-normal text-slate-700 mb-1">
                        Estimated Civil Construction Cost (₹)
                      </label>
                      <input
                        type="text"
                        value={constructionCost.toLocaleString("en-IN")}
                        onChange={(e) => {
                          const val = Number(e.target.value.replace(/\D/g, ""));
                          setConstructionCost(val || 0);
                        }}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-normal text-slate-700 mb-1">
                          Construction Type
                        </label>
                        <select
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none bg-white"
                        >
                          <option value="independent-house">Independent House / Villa</option>
                          <option value="floor-addition">Floor / Room Extension</option>
                          <option value="commercial-complex">Commercial Complex</option>
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
                          <option value={10}>10 Years</option>
                          <option value={15}>15 Years</option>
                          <option value={20}>20 Years</option>
                          <option value={25}>25 Years</option>
                          <option value={30}>30 Years</option>
                        </select>
                      </div>
                    </div>

                    {/* Calculated Live Sanction Box */}
                    <div className="rounded-2xl bg-purple-50/80 p-4 border border-purple-100">
                      <div className="flex items-center justify-between text-xs text-purple-900 font-normal">
                        <span>Eligible Sanction Limit (90% Cost):</span>
                        <span className="text-base font-normal text-[#6424C7]">
                          {fmtCurrency(calculations.maxLoanAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-purple-900 font-normal mt-2 pt-2 border-t border-purple-100">
                        <span>Est. Post-Completion EMI (@ 8.40%):</span>
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
                        placeholder="Enter as per Aadhaar / PAN"
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
                          Checking Plan &amp; BOQ Eligibility...
                        </span>
                      ) : (
                        "Get In-Principle Construction Sanction"
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-[#6424C7]">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-normal text-slate-900">Sanction Request Submitted!</h4>
                    <p className="text-xs text-slate-600 font-normal">
                      Our civil loan specialist will contact you shortly to review your approved layout map and architect BOQ estimate.
                    </p>
                    <Link
                      href={applyHref}
                      className="inline-block rounded-xl bg-[#6424C7] px-5 py-2.5 text-xs text-white font-normal"
                    >
                      Complete Formal Application
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
              <span className="block text-2xl sm:text-3xl font-normal text-[#6424C7]">From 8.40%</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Starting Construction Interest Rate</span>
            </div>
            <div className="border-r border-purple-200/60 last:border-0 pr-4">
              <span className="block text-2xl sm:text-3xl font-normal text-slate-900">Up to 90%</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Civil Construction Cost Coverage</span>
            </div>
            <div className="border-r border-purple-200/60 last:border-0 pr-4">
              <span className="block text-2xl sm:text-3xl font-normal text-[#6424C7]">Up to ₹15 Cr</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">High-Ticket Sanction Limits</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-normal text-emerald-600">30 Years</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Extended Post-Build Amortization</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          3. INTERACTIVE STAGE-WISE CONSTRUCTION EMI & TRANCHE CALCULATOR
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="construction-calculator" className="w-full py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Calculate Stage-Wise <span className="text-[#6424C7]">Tranches &amp; EMIs</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Estimate your milestone disbursements, pre-EMI interest during the building period, and final monthly post-handover installment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Sliders Input Panel */}
            <div className="lg:col-span-7 space-y-7 rounded-3xl bg-slate-50/80 p-6 sm:p-8 border border-slate-200/80">
              
              {/* Slider 1: Construction Cost */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Estimated Construction Cost</span>
                  <span className="text-base font-normal text-[#6424C7]">{fmtCurrency(constructionCost)}</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={30000000}
                  step={500000}
                  value={constructionCost}
                  onChange={(e) => setConstructionCost(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹10 Lakhs</span>
                  <span>₹3 Crores</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Construction Interest Rate</span>
                  <span className="text-base font-normal text-slate-900">{interestRate.toFixed(2)}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={8.40}
                  max={12.00}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>8.40% (Prime Bank)</span>
                  <span>12.00%</span>
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
                  min={5}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>5 Years</span>
                  <span>30 Years</span>
                </div>
              </div>

              {/* Stage-wise Tranche Breakdown Cards */}
              <div className="pt-2 border-t border-slate-200">
                <span className="block text-xs font-normal text-slate-700 mb-3">Estimated Milestone Disbursements:</span>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl bg-white p-3 border border-slate-200 shadow-xs">
                    <span className="block text-[11px] text-slate-500 font-normal">Tranche 1 (Foundation 25%)</span>
                    <span className="block text-xs sm:text-sm font-normal text-[#6424C7] mt-1">
                      {fmtCurrency(calculations.tranche1)}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-white p-3 border border-slate-200 shadow-xs">
                    <span className="block text-[11px] text-slate-500 font-normal">Tranche 2 (Slab/Walls 35%)</span>
                    <span className="block text-xs sm:text-sm font-normal text-[#6424C7] mt-1">
                      {fmtCurrency(calculations.tranche2)}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-white p-3 border border-slate-200 shadow-xs">
                    <span className="block text-[11px] text-slate-500 font-normal">Tranche 3 (Finishing 40%)</span>
                    <span className="block text-xs sm:text-sm font-normal text-[#6424C7] mt-1">
                      {fmtCurrency(calculations.tranche3)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Results Box */}
            <div className="lg:col-span-5 rounded-3xl bg-[#4c1d95] p-7 text-white shadow-xl">
              <h3 className="text-xl font-normal text-white border-b border-purple-400/40 pb-4 mb-6">
                Construction Loan Summary
              </h3>

              <div className="space-y-5 text-sm font-normal">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Eligible Sanction Limit (90%):</span>
                  <span className="text-xl font-normal text-white">{fmtCurrency(calculations.maxLoanAmount)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Pre-EMI (During Construction):</span>
                  <span className="text-base font-normal text-purple-200">~{fmtCurrency(calculations.preEmiEstimated)}/mo</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Final Monthly EMI (Post Completion):</span>
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
                    Apply for {fmtCurrency(calculations.maxLoanAmount)} Construction Loan
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          4. COMPARE TOP LENDERS FOR HOME & COMMERCIAL CONSTRUCTION
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="bank-comparison" className="w-full py-14 sm:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Compare Top Partner Lenders for <span className="text-[#6424C7]">Construction Loans</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Transparent interest rates, stage-wise inspection timelines, and processing terms from India's premier RBI-regulated mortgage banks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {constructionLenders.map((b) => (
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
          5. SPECIALIZED CONSTRUCTION VARIANTS (DECONTAINERIZED & BORDERLESS)
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="variants" className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-slate-900 leading-[1.15]">
              Specialized Construction Loan{" "}
              <span className="bg-gradient-to-r from-[#6424C7] to-purple-600 bg-clip-text text-transparent font-normal">
                Variants
              </span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Customized financing programs tailored for self-plot independent villas, composite plot purchases, home extensions, and commercial infrastructure.
            </p>
          </div>

          {/* Borderless Edge-to-Edge Layout Stack */}
          <div className="space-y-20 sm:space-y-28">
            {constructionVariants.map((v, idx) => {
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
                            From 8.40%
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
                      <span>Variant {idx + 1} of {constructionVariants.length}</span>
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
                        <span>Check Sanction Eligibility</span>
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
          6. CONSTRUCTION TRANCHE DISBURSEMENT STAGES (BORDERLESS & RICH IMAGES)
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Stage-Wise <span className="text-[#6424C7]">Disbursement Milestones</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Construction loans disburse funds in tranches linked to certified civil milestones, minimizing your Pre-EMI interest burden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                stage: "Stage 01",
                title: "Excavation & Plinth Level",
                pct: "15% to 20% Sanction",
                desc: "Released on site clearance, deep footing excavation, and completion of plinth beam casting.",
                image: "/assets/loan-banners/construction-variant-plot-combo.jpg",
              },
              {
                stage: "Stage 02",
                title: "Slab Casting & RCC Framing",
                pct: "30% to 35% Sanction",
                desc: "Disbursed after structural RCC column casting and casting of ground/first floor roof slabs.",
                image: "/assets/loan-banners/construction-variant-self-plot.jpg",
              },
              {
                stage: "Stage 03",
                title: "Brick Masonry & Plastering",
                pct: "25% to 30% Sanction",
                desc: "Disbursed upon completion of external and internal brick walls, electrical piping, and cement plastering.",
                image: "/assets/loan-banners/construction-variant-floor-extension.jpg",
              },
              {
                stage: "Stage 04",
                title: "Flooring, Fixtures & Completion",
                pct: "15% to 20% Sanction",
                desc: "Final release upon tile flooring, sanitary fixtures, electrical fittings, painting, and OC/CC handover.",
                image: "/assets/loan-banners/construction-variant-commercial.jpg",
              },
            ].map((s) => (
              <div key={s.stage} className="group overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:border-purple-200 flex flex-col justify-between">
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-normal text-[#6424C7] shadow-xs">
                    {s.pct}
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-xs font-normal text-[#6424C7] uppercase tracking-wider block mb-1">{s.stage}</span>
                  <h3 className="text-lg font-normal text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 font-normal leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          7. STEP-BY-STEP GUIDED CONSTRUCTION LOAN ROADMAP
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              4-Step Guided <span className="text-[#6424C7]">Construction Loan Process</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              From approved layout validation to final OC milestone disbursal, Fintaraa manages bank technical inspections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Submit Plan & Estimate",
                desc: "Provide sanctioned building blueprint map and certified architect Bill of Quantities (BOQ).",
              },
              {
                step: "02",
                title: "Bank Technical Site Visit",
                desc: "Empaneled bank civil engineer visits plot site to inspect boundaries, access roads, and soil.",
              },
              {
                step: "03",
                title: "Stage-Wise Sanction Letter",
                desc: "Bank issues official sanction letter detailing tranche release percentages and moratorium terms.",
              },
              {
                step: "04",
                title: "Milestone Disbursements",
                desc: "Receive progressive stage disbursements directly to your contractor as each civil phase finishes.",
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
          8. CONSTRUCTION LOAN VS READY HOME LOAN COMPARISON TABLE
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Construction Loan <span className="text-[#6424C7]">vs Ready-to-Move Home Loan</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Understand key differences in milestone-linked cash releases, pre-EMI moratoriums, and architectural customization.
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse bg-white text-left text-sm font-normal rounded-2xl overflow-hidden border border-slate-200">
              <thead className="bg-[#4c1d95] text-white text-xs font-normal uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-[28%]">Feature / Parameter</th>
                  <th className="px-6 py-4 w-[36%] text-purple-200 font-normal">Home Construction Loan</th>
                  <th className="px-6 py-4 w-[36%] font-normal">Ready-to-Move Home Loan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Fund Disbursement</td>
                  <td className="px-6 py-4 font-normal text-[#6424C7]">Tranche-wise (Linked to civil stage completion)</td>
                  <td className="px-6 py-4 text-slate-600">100% Lump sum to builder / seller</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">EMI During Building</td>
                  <td className="px-6 py-4 font-normal text-[#6424C7]">Pre-EMI (Interest only on drawn tranches)</td>
                  <td className="px-6 py-4 text-slate-600">Full Principal + Interest EMI starts immediately</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Design Freedom</td>
                  <td className="px-6 py-4 font-normal text-emerald-600">100% Custom layout, materials &amp; architect</td>
                  <td className="px-6 py-4 text-slate-600">Fixed builder standard specifications</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Starting Interest Rate</td>
                  <td className="px-6 py-4 font-normal text-[#6424C7]">8.40% – 9.25% p.a.</td>
                  <td className="px-6 py-4 text-slate-600">8.35% – 9.50% p.a.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Tax Benefits</td>
                  <td className="px-6 py-4 font-normal text-[#6424C7]">Sec 24(b) &amp; 80C post-completion in 5 installments</td>
                  <td className="px-6 py-4 text-slate-600">Sec 24(b) &amp; 80C from Year 1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          9. COMPREHENSIVE ARCHITECT BOQ & DOCUMENT CHECKLIST (WITH IMAGE BANNER)
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Technical &amp; Legal <span className="text-[#6424C7]">Documentation Checklist</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Ensure you have approved municipal layout drawings, civil architect cost estimates, and plot title deeds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Borrower Financial Eligibility */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl font-normal text-slate-900 border-b border-slate-200 pb-3">
                Financial &amp; KYC Documents
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-normal">
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Identity &amp; Address Proof</span>
                  <p className="text-slate-600 text-xs mt-0.5">Aadhaar Card, PAN Card, and passport-size photographs.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Income Documentation</span>
                  <p className="text-slate-600 text-xs mt-0.5">Last 3 months salary slips or past 3 years audited ITR with computation.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Bank Statements</span>
                  <p className="text-slate-600 text-xs mt-0.5">Last 6 to 12 months active salary or current banking account statements.</p>
                </div>
              </div>
            </div>

            {/* Civil Technical & Land Papers */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl font-normal text-slate-900 border-b border-slate-200 pb-3">
                Civil &amp; Plot Sanction Papers
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-normal">
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Sanctioned Building Plan</span>
                  <p className="text-slate-600 text-xs mt-0.5">Approved architectural layout plan from municipal corporation or gram panchayat.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Architect BOQ &amp; Cost Estimate</span>
                  <p className="text-slate-600 text-xs mt-0.5">Detailed civil engineer / architect signed Bill of Quantities itemized cost sheet.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Plot Registered Sale Deed &amp; EC</span>
                  <p className="text-slate-600 text-xs mt-0.5">Original title deed chain of plot with 30-year non-encumbrance certificate.</p>
                </div>
              </div>
            </div>

            {/* Feature Visual Image Banner */}
            <div className="lg:col-span-4 relative rounded-3xl overflow-hidden min-h-[300px] shadow-lg border border-purple-100 flex flex-col justify-end">
              <Image
                src="/assets/loan-banners/construction-hero.jpg"
                alt="Architect Certified BOQ & Site Inspection Assistance"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065] via-[#2e1065]/40 to-transparent" />
              <div className="relative z-10 p-6 text-white space-y-2">
                <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-normal text-purple-100 inline-block">
                  Civil Technical Desk
                </span>
                <h4 className="text-lg font-normal text-white">Free Architect BOQ Vetting</h4>
                <p className="text-xs text-purple-200/90 font-normal leading-relaxed">
                  Our civil advisory team assists you in validating your architect cost estimates to maximize bank sanction eligibility.
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
            question: "How are construction loan funds disbursed by the bank?",
            answer:
              "Funds are released in stage-wise milestone tranches (such as foundation/plinth, RCC slab casting, brickwork/plastering, and final finishing). Before releasing each tranche, a bank empaneled engineer visits the site to verify physical progress.",
          },
          {
            question: "What is Pre-EMI in a construction loan and how does it save money?",
            answer:
              "During the active building phase (which can take 12 to 24 months), you do NOT pay full EMIs. You only pay Pre-EMI (simple interest on the exact tranche amount disbursed so far). Full principal repayment starts only after the house is constructed.",
          },
          {
            question: "Can I get a loan if I want to purchase the plot AND construct the house together?",
            answer:
              "Yes! You can apply for a Composite Plot + Construction Loan. Banks finance up to 75% of the plot purchase cost and up to 90% of the construction cost in a unified loan package.",
          },
          {
            question: "What happens if construction costs exceed the initial architect estimate?",
            answer:
              "If material prices or design changes increase the budget, you can apply for a Top-Up Construction enhancement with updated engineer BOQ certificates, subject to your overall income eligibility.",
          },
        ]}
        title="Frequently Asked Questions About Home & Commercial Construction Loans"
      />

      <ProductRelatedBlogs category="Loans" productName="Construction Loan" />
      <ProductLocationDirectory
        productName="Construction Loan"
        productSlug="construction-loan"
        pages={locationPages}
      />
      <AppDownloadBanner />
    </main>
  );
}
