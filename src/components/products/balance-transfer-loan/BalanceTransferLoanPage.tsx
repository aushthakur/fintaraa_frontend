"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeIndianRupee,
  Building2,
  Calculator,
  CheckCircle2,
  Clock,
  Layers,
  Loader2,
  Lock,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { getApplyHref } from "@/components/application/flowRegistry";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { ProductLocationDirectory } from "@/components/products/ProductLocationDirectory";
import { ProductRelatedBlogs } from "@/components/products/ProductRelatedBlogs";
import { LoanFAQSection } from "@/components/products/loan-detail/LoanFAQSection";
import type { LoanSeoLocationPage, LoanSeoPageData } from "@/services/loanSeoPages";
import type { BankProductLender } from "@/services/bankSeoPages";

// ─── Bank Lenders Comparison Data ──────────────────────────────────────────────
const btLenders = [
  {
    name: "State Bank of India (SBI)",
    slug: "sbi",
    logo: "/assets/banks/State-Bank-of-India.png",
    rate: "8.35% – 8.90% p.a.",
    fee: "0.15% (Max ₹10,000)",
    topUpRate: "8.50% p.a.",
    maxTenure: "Up to 30 Yrs",
    features: "Zero Foreclosure Fee • Concessional Rates for Women",
  },
  {
    name: "HDFC Bank",
    slug: "hdfc-bank",
    logo: "/assets/banks/HDFC-Bank.png",
    rate: "8.35% – 9.10% p.a.",
    fee: "0.25% or ₹3,000",
    topUpRate: "8.55% p.a.",
    maxTenure: "Up to 30 Yrs",
    features: "Express Paperless Approval • Doorstep Legal Pickup",
  },
  {
    name: "ICICI Bank",
    slug: "icici-bank",
    logo: "/assets/banks/ICICI-Bank.png",
    rate: "8.40% – 9.15% p.a.",
    fee: "0.20% (Max ₹7,500)",
    topUpRate: "8.60% p.a.",
    maxTenure: "Up to 30 Yrs",
    features: "Instant Pre-Approved Top-Up up to ₹1 Crore",
  },
  {
    name: "Bank of Baroda",
    slug: "bank-of-baroda",
    logo: "/assets/banks/Bank-of-Baroda.png",
    rate: "8.35% – 8.85% p.a.",
    fee: "Nil (Special Campaign Offer)",
    topUpRate: "8.45% p.a.",
    maxTenure: "Up to 30 Yrs",
    features: "Lowest Repo Benchmark • Zero Processing Fee",
  },
  {
    name: "Axis Bank",
    slug: "axis-bank",
    logo: "/assets/banks/axis-bank.png",
    rate: "8.45% – 9.20% p.a.",
    fee: "Up to 0.25%",
    topUpRate: "8.65% p.a.",
    maxTenure: "Up to 30 Yrs",
    features: "12 EMI Waiver Benefit on Regular Repayments",
  },
  {
    name: "Kotak Mahindra Bank",
    slug: "kotak-bank",
    logo: "/assets/banks/Kotak-Mahindra-Bank.png",
    rate: "8.40% – 9.05% p.a.",
    fee: "0.25% (Max ₹5,000)",
    topUpRate: "8.50% p.a.",
    maxTenure: "Up to 25 Yrs",
    features: "Fast Track Sanction within 48 Hours",
  },
];

// ─── Balance Transfer Variants (Decontainerized / Borderless) ─────────────────
const btVariants = [
  {
    id: "rate-reduction",
    title: "Pure Rate Reduction Balance Transfer",
    subtitle: "Lower Your Monthly EMI by Switching to Prime 8.35% Repo Benchmark Rates",
    badge: "Maximum EMI Savings",
    icon: TrendingDown,
    accent: "#6424C7",
    image: "/assets/loan-banners/rendered/balance-transfer-loan-01-desktop.webp",
    description:
      "If your current home loan was sanctioned at 9.5% to 11% interest, switching to a 8.35% Repo-Linked Lending Rate (EBLR) slashes tens of thousands in interest outflow every year. Keep your tenure same to pay off your home loan 3 to 5 years earlier.",
    bullets: [
      "Immediate rate reduction of up to 1.5% to 2.5%",
      "Option to either lower monthly EMI or reduce remaining loan tenure",
      "Zero foreclosure penalties on existing floating-rate home loans",
      "Doorstep assistance for obtaining Foreclosure Letter & LOD from current bank",
    ],
    savingsExample: "Save ~₹14.2 Lakhs on a ₹50L loan with 15 years remaining.",
  },
  {
    id: "topup-cash",
    title: "Home Loan Balance Transfer + High-Ticket Top-Up Cash",
    subtitle: "Access Unrestricted Cash Capital at Home Loan Interest Rates (~8.50% p.a.)",
    badge: "Lowest Interest Cash",
    icon: BadgeIndianRupee,
    accent: "#8b5cf6",
    image: "/assets/personal-loan/usecase-home.jpg",
    description:
      "Need funds for luxury home interior, business growth, or debt consolidation? Don't take 12%+ personal loans. Combine your balance transfer with a top-up loan up to ₹1 Crore at near-home-loan interest rates (~8.50%) with 20-year flexible tenures.",
    bullets: [
      "Top-up loan rates at ~8.50% vs 12%+ Personal Loan rates",
      "Tenures up to 20 years keep top-up EMIs surprisingly affordable",
      "Zero end-use restriction—use cash for renovation, business, or education",
      "Single consolidated monthly EMI statement for both base loan and top-up",
    ],
    savingsExample: "Saves ~60% in interest compared to taking a separate Personal Loan.",
  },
  {
    id: "lap-transfer",
    title: "Loan Against Property (LAP) Balance Transfer",
    subtitle: "Switch Commercial & Residential Mortgage Loans for Lower Rates & Higher LTV",
    badge: "Mortgage Refinance",
    icon: Building2,
    accent: "#6424C7",
    image: "/assets/loan-banners/rendered/loan-against-property-02-desktop.webp",
    description:
      "Refinance high-cost property mortgage loans taken from NBFCs or housing finance companies. Switch to prime commercial banks for lower rates starting at 8.90% p.a. and unlock additional property equity.",
    bullets: [
      "Transfer residential, commercial, or industrial property mortgage loans",
      "Unlock extra liquidity up to 75% of current revised property valuation",
      "Extended 15 to 20 year repayment terms for business cashflow ease",
      "Doorstep legal title check and empaneled technical valuation",
    ],
    savingsExample: "Reduces LAP interest burden from 11.5% down to 8.90% p.a.",
  },
  {
    id: "debt-consolidation",
    title: "Multi-Debt Consolidation into Single Low EMI",
    subtitle: "Consolidate Credit Card Dues & Micro-Loans into Your Transferred Home Loan",
    badge: "Debt Freedom",
    icon: Layers,
    accent: "#8b5cf6",
    image: "/assets/personal-loan/usecase-debt.jpg",
    description:
      "Revolving 36% credit card debt and short-term micro-loans damage your monthly cash flow. Use top-up funds from your home loan balance transfer to pay off high-cost debt completely, unifying all obligations into a single 8.5% EMI.",
    bullets: [
      "Eliminate 36%-42% credit card finance charges permanently",
      "Single due date replaces multiple confusing monthly payment reminders",
      "Drastically drops Credit Utilization Ratio (CUR) for rapid CIBIL boost",
      "Structured 15-20 year repayment ensures affordable monthly outflows",
    ],
    savingsExample: "Consolidates ₹10L of 36% card debt into 8.5% top-up, saving ~₹2.8L/yr.",
  },
];

const fmtCurrency = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(Math.max(0, Math.round(val || 0)));

export function BalanceTransferLoanPage({
  page,
  lenders = [],
  locationPages = [],
}: {
  page: LoanSeoPageData;
  lenders?: BankProductLender[];
  locationPages?: LoanSeoLocationPage[];
}) {
  // ─── Calculator State ────────────────────────────────────────────────────────
  const [existingLoanAmount, setExistingLoanAmount] = useState<number>(5000000);
  const [currentRate, setCurrentRate] = useState<number>(9.75);
  const [newRate, setNewRate] = useState<number>(8.35);
  const [remainingTenureYears, setRemainingTenureYears] = useState<number>(15);
  const [topUpAmount, setTopUpAmount] = useState<number>(1000000);

  // Lead Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ─── Live Calculation Engine ─────────────────────────────────────────────────
  const calculations = useMemo(() => {
    const P = existingLoanAmount;
    const rCurrent = currentRate / 12 / 100;
    const rNew = newRate / 12 / 100;
    const N = remainingTenureYears * 12;

    const currentEmi =
      P * rCurrent * Math.pow(1 + rCurrent, N) / (Math.pow(1 + rCurrent, N) - 1);
    const totalCurrentRepayment = currentEmi * N;
    const currentTotalInterest = totalCurrentRepayment - P;

    const newBaseEmi =
      P * rNew * Math.pow(1 + rNew, N) / (Math.pow(1 + rNew, N) - 1);
    const totalNewBaseRepayment = newBaseEmi * N;
    const newBaseTotalInterest = totalNewBaseRepayment - P;

    const monthlyEmiSavings = Math.round(currentEmi - newBaseEmi);
    const totalInterestSavings = Math.round(currentTotalInterest - newBaseTotalInterest);

    const rTopUp = 8.5 / 12 / 100;
    const topUpEmi =
      topUpAmount > 0
        ? (topUpAmount * rTopUp * Math.pow(1 + rTopUp, N)) /
          (Math.pow(1 + rTopUp, N) - 1)
        : 0;

    const combinedNewEmi = Math.round(newBaseEmi + topUpEmi);

    return {
      currentEmi: Math.round(currentEmi),
      newBaseEmi: Math.round(newBaseEmi),
      monthlyEmiSavings: Math.max(0, monthlyEmiSavings),
      totalInterestSavings: Math.max(0, totalInterestSavings),
      topUpEmi: Math.round(topUpEmi),
      combinedNewEmi,
      netMonthlyDiff: Math.round(currentEmi - combinedNewEmi),
    };
  }, [existingLoanAmount, currentRate, newRate, remainingTenureYears, topUpAmount]);

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
    productSlug: "balance-transfer-top-up-loan",
    referrer: "/products/balance-transfer-top-up-loan",
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
            src="/assets/loan-banners/balance-transfer-hero.jpg"
            alt="Luxury Home Loan Balance Transfer"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Crystal-Clear Dual Scrim Overlay for Maximum Banner Visibility & Typography Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-[#2e1065]/70 to-purple-950/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065]/80 via-transparent to-black/30 pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              {/* Main H1 Headline (Two lines, white & bright purple) */}
              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-normal tracking-tight leading-[1.14] text-white drop-shadow-md">
                Transfer Home Loan to Lower Interest Rates &amp;{" "}
                <span className="block mt-1 bg-gradient-to-r from-purple-200 via-purple-300 to-white bg-clip-text text-transparent font-normal">
                  Get Extra Top-Up Cash
                </span>
              </h1>



              {/* CTA Buttons (Purples & White) */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={applyHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6424c7] px-8 py-4 text-sm font-normal text-white shadow-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(139,92,246,0.4)] active:scale-98 cursor-pointer border border-white/20"
                >
                  <span>Check Pre-Approved BT Offer</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#savings-calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 backdrop-blur-md px-6 py-4 text-sm font-normal text-white border border-white/25 hover:bg-white/25 transition-all cursor-pointer"
                >
                  <Calculator className="h-4 w-4 text-purple-200" />
                  <span>Calculate Rate Savings</span>
                </a>
              </div>

              {/* Small Trust Info */}
              <div className="mt-6 flex items-center gap-6 text-xs text-purple-200/90">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>RBI Regulated Lenders</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-purple-300" />
                  <span>Decision in 3 Mins</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-purple-300" />
                  <span>100% Encrypted Data</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Estimator Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white p-6 sm:p-7 text-slate-900 shadow-2xl border border-purple-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <h3 className="text-lg font-normal text-slate-900">Live Rate Switch Estimator</h3>
                    <p className="text-xs text-slate-500 font-normal">Instant in-principle savings estimate</p>
                  </div>
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-normal text-[#6424C7]">
                    Free Check
                  </span>
                </div>

                {!submitSuccess ? (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-normal text-slate-700 mb-1">
                        Existing Home Loan Amount (₹)
                      </label>
                      <input
                        type="text"
                        value={existingLoanAmount.toLocaleString("en-IN")}
                        onChange={(e) => {
                          const val = Number(e.target.value.replace(/\D/g, ""));
                          setExistingLoanAmount(val || 0);
                        }}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-normal text-slate-700 mb-1">
                          Current Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={currentRate}
                          onChange={(e) => setCurrentRate(Number(e.target.value))}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-normal text-slate-700 mb-1">
                          New Transferred Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.05"
                          value={newRate}
                          onChange={(e) => setNewRate(Number(e.target.value))}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Calculated Live Savings Box (Purple Theme) */}
                    <div className="rounded-2xl bg-purple-50/80 p-4 border border-purple-100">
                      <div className="flex items-center justify-between text-xs text-purple-900 font-normal">
                        <span>Monthly EMI Savings:</span>
                        <span className="text-sm font-normal text-emerald-600">
                          {fmtCurrency(calculations.monthlyEmiSavings)}/mo
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-purple-900 font-normal mt-2 pt-2 border-t border-purple-100">
                        <span>Total Interest Saved:</span>
                        <span className="text-sm font-normal text-[#6424C7]">
                          {fmtCurrency(calculations.totalInterestSavings)}
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
                          Checking Partner Offers...
                        </span>
                      ) : (
                        "Get Instant In-Principle Approval"
                      )}
                    </button>

                    <p className="text-[11px] text-slate-400 text-center font-normal">
                      By submitting, you agree to receive assisted loan calls from Fintaraa partners.
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-[#6424C7]">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-normal text-slate-900">In-Principle Sanction Request Received!</h4>
                    <p className="text-xs text-slate-600 font-normal">
                      Our balance transfer specialist will contact you shortly to review your list of documents (LOD) and initiate your rate drop.
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
          2. KEY TRUST & SAVINGS STATS BAR
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-purple-50/50 py-8 border-b border-purple-100/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="border-r border-purple-200/60 last:border-0 pr-4">
              <span className="block text-2xl sm:text-3xl font-normal text-[#6424C7]">Up to 2.50%</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Interest Rate Drop</span>
            </div>
            <div className="border-r border-purple-200/60 last:border-0 pr-4">
              <span className="block text-2xl sm:text-3xl font-normal text-slate-900">₹15+ Lakhs</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Avg. Total Interest Saved</span>
            </div>
            <div className="border-r border-purple-200/60 last:border-0 pr-4">
              <span className="block text-2xl sm:text-3xl font-normal text-[#6424C7]">Up to ₹1 Cr</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Low-Rate Top-Up Cash</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-normal text-emerald-600">ZERO</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Foreclosure Penalty (Floating)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          3. INTERACTIVE BALANCE TRANSFER SAVINGS CALCULATOR (PURPLE THEME)
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="savings-calculator" className="w-full py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Calculate Your Exact{" "}
              <span className="text-[#6424C7]">Interest &amp; EMI Savings</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Adjust your current loan details below to see how much you save by switching to a prime 8.35% repo-linked loan with optional top-up cash.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Sliders Input Panel */}
            <div className="lg:col-span-7 space-y-7 rounded-3xl bg-slate-50/80 p-6 sm:p-8 border border-slate-200/80">
              
              {/* Slider 1: Existing Principal */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Existing Home Loan Principal</span>
                  <span className="text-base font-normal text-[#6424C7]">{fmtCurrency(existingLoanAmount)}</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={25000000}
                  step={500000}
                  value={existingLoanAmount}
                  onChange={(e) => setExistingLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹10 Lakhs</span>
                  <span>₹2.5 Crores</span>
                </div>
              </div>

              {/* Slider 2: Current Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Current Interest Rate</span>
                  <span className="text-base font-normal text-slate-900">{currentRate.toFixed(2)}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={8.5}
                  max={12.5}
                  step={0.1}
                  value={currentRate}
                  onChange={(e) => setCurrentRate(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>8.50%</span>
                  <span>12.50%</span>
                </div>
              </div>

              {/* Slider 3: New Transferred Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">New Transferred Repo Rate</span>
                  <span className="text-base font-normal text-emerald-600">{newRate.toFixed(2)}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={8.35}
                  max={9.5}
                  step={0.05}
                  value={newRate}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>8.35% (Repo Prime)</span>
                  <span>9.50%</span>
                </div>
              </div>

              {/* Slider 4: Remaining Tenure */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Remaining Loan Tenure</span>
                  <span className="text-base font-normal text-slate-900">{remainingTenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={remainingTenureYears}
                  onChange={(e) => setRemainingTenureYears(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>5 Years</span>
                  <span>30 Years</span>
                </div>
              </div>

              {/* Slider 5: Top-Up Cash Amount */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Extra Top-Up Cash Requested</span>
                  <span className="text-base font-normal text-[#6424C7]">{fmtCurrency(topUpAmount)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={250000}
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹0 (No Top-Up)</span>
                  <span>₹1 Crore</span>
                </div>
              </div>

            </div>

            {/* Results Output Summary Box (Pure Purple & White) */}
            <div className="lg:col-span-5 rounded-3xl bg-[#4c1d95] p-7 text-white shadow-xl">
              <h3 className="text-xl font-normal text-white border-b border-purple-400/40 pb-4 mb-6">
                Your Financial Benefit Summary
              </h3>

              <div className="space-y-5 text-sm font-normal">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Current Monthly EMI:</span>
                  <span className="text-base font-normal text-white">{fmtCurrency(calculations.currentEmi)}/mo</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-purple-200">New Transferred Base EMI:</span>
                  <span className="text-base font-normal text-emerald-400">{fmtCurrency(calculations.newBaseEmi)}/mo</span>
                </div>

                <div className="flex justify-between items-center border-t border-purple-400/30 pt-3">
                  <span className="text-purple-200">Monthly EMI Reduction:</span>
                  <span className="text-lg font-normal text-emerald-300">
                    {fmtCurrency(calculations.monthlyEmiSavings)}/mo
                  </span>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 border border-white/15">
                  <span className="block text-xs text-purple-200 font-normal">Total Interest Saved Over {remainingTenureYears} Yrs:</span>
                  <span className="text-2xl font-normal text-white block mt-1">
                    {fmtCurrency(calculations.totalInterestSavings)}
                  </span>
                </div>

                {topUpAmount > 0 && (
                  <div className="border-t border-purple-400/30 pt-3 space-y-2">
                    <div className="flex justify-between items-center text-xs text-purple-200 font-normal">
                      <span>Top-Up EMI (at 8.50%):</span>
                      <span className="text-purple-200 font-normal">{fmtCurrency(calculations.topUpEmi)}/mo</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-normal">
                      <span>Combined EMI (Base + Top-Up):</span>
                      <span className="text-base font-normal text-white">{fmtCurrency(calculations.combinedNewEmi)}/mo</span>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Link
                    href={applyHref}
                    className="block w-full text-center rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6424c7] py-3.5 text-sm font-normal text-white shadow-md hover:scale-[1.01] transition-transform border border-white/20"
                  >
                    Apply for {fmtCurrency(calculations.totalInterestSavings)} Savings
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          4. COMPARE INDIA'S TOP BALANCE TRANSFER LENDERS (CLEAN BANK LOGO ROWS)
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="bank-comparison" className="w-full py-14 sm:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Compare Top Home Loan <span className="text-[#6424C7]">Balance Transfer Lenders</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Real-time interest rates, processing fees, and top-up limits from India's leading RBI-regulated institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {btLenders.map((b) => (
              <div
                key={b.slug}
                className="group flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:border-purple-200"
              >
                <div>
                  {/* Bank Logo */}
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
                      Repo Linked
                    </span>
                  </div>

                  {/* Rate Specs */}
                  <div className="space-y-3 text-xs text-slate-700 font-normal">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transferred BT Rate:</span>
                      <span className="font-normal text-slate-900 text-sm">{b.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Top-Up Interest Rate:</span>
                      <span className="font-normal text-[#6424C7]">{b.topUpRate}</span>
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
                    <span>Check Pre-Approved Offer</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          5. SPECIALIZED BALANCE TRANSFER VARIANTS (DECONTAINERIZED & BORDERLESS)
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="variants" className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-slate-900 leading-[1.15]">
              Specialized Balance Transfer{" "}
              <span className="bg-gradient-to-r from-[#6424C7] to-purple-600 bg-clip-text text-transparent font-normal">
                Financing Variants
              </span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Explore customized transfer options designed for rate drops, cash top-ups, mortgage refinancing, and multi-loan consolidation.
            </p>
          </div>

          {/* Fully Decontainerized / Borderless / Edge-to-Edge Layout Stack */}
          <div className="space-y-20 sm:space-y-28">
            {btVariants.map((v, idx) => {
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={v.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-stretch ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Visual Image Column (Edge to edge, borderless) */}
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
                            Typical Rate Drop
                          </span>
                          <span className="text-sm sm:text-base font-normal text-purple-200">
                            Up to 2.50%
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
                      <span>Variant {idx + 1} of {btVariants.length}</span>
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
                        💡 {v.savingsExample}
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
          6. STEP-BY-STEP ASSISTED BALANCE TRANSFER FLOW
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              4-Step Guided <span className="text-[#6424C7]">Balance Transfer Journey</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Fintaraa manages your entire bank switching process—from retrieving your document list to final payout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Calculate & Apply Online",
                desc: "Check your rate drop savings and choose your preferred new lender on Fintaraa.",
              },
              {
                step: "02",
                title: "Request Foreclosure & LOD",
                desc: "Obtain Foreclosure Letter & List of Documents (LOD) from your existing bank.",
              },
              {
                step: "03",
                title: "Doorstep Legal Vetting",
                desc: "Fintaraa assists with legal title verification and technical property appraisal.",
              },
              {
                step: "04",
                title: "Direct Bank Payout & Cash",
                desc: "New lender clears old loan balance and disburses top-up cash directly to your account.",
              },
            ].map((s) => (
              <div key={s.step} className="rounded-3xl bg-white p-7 shadow-sm border border-slate-200/80">
                <span className="text-3xl font-normal text-[#6424C7] block mb-3">{s.step}</span>
                <h3 className="text-lg font-normal text-slate-900">{s.title}</h3>
                <p className="mt-2 text-xs text-slate-600 font-normal leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          7. ELIGIBILITY & DOCUMENT CHECKLIST
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Balance Transfer <span className="text-[#6424C7]">Eligibility &amp; Documents</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Review basic requirements for a smooth loan switch without unexpected rejection.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Eligibility */}
            <div className="space-y-6">
              <h3 className="text-xl font-normal text-slate-900 border-b border-slate-200 pb-3">
                Eligibility Guidelines
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-normal">
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Clean EMI History</span>
                  <p className="text-slate-600 text-xs mt-0.5">Minimum 12 consecutive monthly EMIs paid on time on current loan.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">CIBIL Bureau Score</span>
                  <p className="text-slate-600 text-xs mt-0.5">730+ for instant sanction of top-up amount up to ₹1 Crore.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Property Status</span>
                  <p className="text-slate-600 text-xs mt-0.5">Fully constructed ready residential or commercial property.</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-6">
              <h3 className="text-xl font-normal text-slate-900 border-b border-slate-200 pb-3">
                Document Checklist
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-normal">
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">From Existing Bank</span>
                  <p className="text-slate-600 text-xs mt-0.5">Foreclosure Letter, List of Documents (LOD) &amp; 12-mo Loan Statement.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">KYC &amp; Income Proof</span>
                  <p className="text-slate-600 text-xs mt-0.5">PAN, Aadhaar, 3 months salary slips or 2 years business ITR.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Property Papers</span>
                  <p className="text-slate-600 text-xs mt-0.5">Copy of registered Sale Deed, approved map &amp; tax paid receipt.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          8. FAQS & EDITORIAL KNOWLEDGE
         ═════════════════════════════════════════════════════════════════════════ */}
      <LoanFAQSection
        faqs={[
          {
            question: "Is there any foreclosure penalty for transferring my existing home loan?",
            answer:
              "As per RBI guidelines, individual borrowers with floating-rate home loans incur ZERO foreclosure fees or prepayment penalties when transferring their loan to another bank.",
          },
          {
            question: "Can I get extra cash (Top-Up) during a home loan balance transfer?",
            answer:
              "Yes! You can apply for a top-up loan up to ₹1 Crore at near-home-loan interest rates (~8.50% p.a.) with zero end-use restrictions.",
          },
          {
            question: "How long does a home loan balance transfer take?",
            answer:
              "The entire process takes approximately 7 to 10 working days from issuing the Foreclosure Letter to final payout by the new lender.",
          },
          {
            question: "Do I get income tax deduction on the top-up loan portion?",
            answer:
              "If top-up funds are used for home renovation or repair, the interest paid is tax-deductible up to ₹30,000 to ₹2,00,000 under Section 24(b).",
          },
        ]}
        title="Frequently Asked Questions About Home Loan Balance Transfer"
      />

      <ProductRelatedBlogs category="Loans" productName="Balance Transfer Home Loan" />
      <ProductLocationDirectory
        productName="Balance Transfer Home Loan"
        productSlug="balance-transfer-top-up-loan"
        pages={locationPages}
      />
      <AppDownloadBanner />
    </main>
  );
}
