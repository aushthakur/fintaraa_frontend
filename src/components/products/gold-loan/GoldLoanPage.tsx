"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  Gem,
  KeyRound,
  Layers,
  Leaf,
  Loader2,
  Lock,
  Percent,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
  SunMedium,
  TrendingUp,
  Vault,
  Zap,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { getApplyHref } from "@/components/application/flowRegistry";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { ProductLocationDirectory } from "@/components/products/ProductLocationDirectory";
import { ProductRelatedBlogs } from "@/components/products/ProductRelatedBlogs";
import { LoanFAQSection } from "@/components/products/loan-detail/LoanFAQSection";
import type { LoanSeoLocationPage, LoanSeoPageData } from "@/services/loanSeoPages";
import type { BankProductLender } from "@/services/bankSeoPages";

// ─── Bank Lenders for Gold & Asset Loans ───────────────────────────────────────
const goldLenders = [
  {
    name: "State Bank of India (SBI)",
    slug: "sbi",
    logo: "/assets/banks/State-Bank-of-India.png",
    rate: "8.40% – 9.15% p.a.",
    ltv: "Up to 75% Market Value",
    fee: "0.25% (Min ₹250)",
    maxTenure: "Up to 36 Months",
    features: "Bullet Repayment Available • Nil Prepayment Penalty",
  },
  {
    name: "HDFC Bank",
    slug: "hdfc-bank",
    logo: "/assets/banks/HDFC-Bank.png",
    rate: "8.65% – 10.25% p.a.",
    ltv: "Up to 75% Gold LTV",
    fee: "₹500 + GST",
    maxTenure: "Up to 24 Months",
    features: "Instant 30-Min Disbursal • Overdraft Line Option",
  },
  {
    name: "ICICI Bank",
    slug: "icici-bank",
    logo: "/assets/banks/ICICI-Bank.png",
    rate: "8.75% – 11.00% p.a.",
    ltv: "Up to 75% Value",
    fee: "1.00%",
    maxTenure: "Up to 12 Months",
    features: "Doorstep Gold Loan in Select Metros • Digital Valuation",
  },
  {
    name: "Muthoot Finance",
    slug: "muthoot-finance",
    logo: "/assets/banks/muthoot.png",
    rate: "9.90% – 16.00% p.a.",
    ltv: "Max Regulatory 75%",
    fee: "₹200 to ₹500",
    maxTenure: "Up to 12 Months",
    features: "Instant Cash/IMPS Payout • 5000+ Branch Network across India",
  },
  {
    name: "Manappuram Finance",
    slug: "manappuram-finance",
    logo: "/assets/banks/manappuram.png",
    rate: "9.90% – 18.00% p.a.",
    ltv: "Up to 75% LTV",
    fee: "Nil for Online Loans",
    maxTenure: "Up to 12 Months",
    features: "Online Gold Loan Top-Up • 24/7 Mobile App Repayment",
  },
];

const loanVariants = [
  {
    title: "Gold Loan at Doorstep & Branch",
    tag: "Lowest Interest Rate",
    rate: "From 8.40% p.a.",
    ltv: "Up to 75% RBI LTV",
    tenure: "3 to 36 Months",
    description:
      "Unlock immediate liquidity against your 18K–24K gold jewelry and ornaments. Enjoy verified Karatmeter valuation at your doorstep or nearest bank branch with same-day transfer.",
    highlights: [
      "Zero Income Proof required up to ₹10 Lakhs",
      "Free transit insurance & tamper-proof vault storage",
      "Flexible bullet repayment or monthly interest options",
      "Get ornaments back within 24 hours of total closure",
    ],
    slug: "gold-loan",
    icon: Coins,
  },
  {
    title: "Loan Against Shares & Mutual Funds",
    tag: "High Liquidity Line",
    rate: "From 8.90% p.a.",
    ltv: "Up to 50% Equity / 80% Debt",
    tenure: "12 Months (Renewable)",
    description:
      "Leverage your Demat portfolio of listed stocks, equity mutual funds, and sovereign bonds into an instant revolving overdraft line without selling your investments.",
    highlights: [
      "100% Paperless digital pledge via NSDL / CDSL OTP",
      "Pay interest only on the utilized credit line balance",
      "Retain all dividend payouts, bonus shares & rights",
      "Instant limit activation in your bank account in 2 hours",
    ],
    slug: "loan-against-security",
    icon: TrendingUp,
  },
  {
    title: "Solar Rooftop & Green Energy Loan",
    tag: "Govt Subsidy Compatible",
    rate: "From 7.00% p.a.",
    ltv: "Up to 90% Project Cost",
    tenure: "Up to 7 Years",
    description:
      "Finance residential rooftop solar installations, commercial PV units, and agricultural solar pumps with special concessional green rates under PM Surya Ghar Muft Bijli Yojana.",
    highlights: [
      "Concessional interest rate subsidized by clean energy funds",
      "Direct disbursement to MNRE-certified solar vendors",
      "Zero collateral required for systems up to 10 kWp",
      "Save up to 80% on monthly electricity bills immediately",
    ],
    slug: "solar-loan",
    icon: SunMedium,
  },
  {
    title: "Agriculture & Kisan Gold Credit",
    tag: "Priority Sector Benefits",
    rate: "From 7.00% p.a.",
    ltv: "Up to 75% LTV",
    tenure: "Up to 12 Months",
    description:
      "Tailored agricultural credit for farmers and agri-entrepreneurs against gold ornaments for crop cultivation, farm equipment purchase, and seasonal working capital.",
    highlights: [
      "Special 7% p.a. interest subvention for timely repayment",
      "Bullet repayment aligned with crop harvest cycles",
      "Nil processing fees on small farmer ticket sizes",
      "Simplified single-page land record verification",
    ],
    slug: "agriculture-loan",
    icon: Leaf,
  },
];

const repaymentModes = [
  {
    title: "Bullet Repayment",
    badge: "Most Popular for Short Needs",
    desc: "Pay both principal amount and total accrued interest together at the end of the loan tenure (3–12 months). Zero monthly EMI burden.",
  },
  {
    title: "Monthly Interest Only",
    badge: "Lowest Monthly Outgo",
    desc: "Pay only the interest portion each month. Repay the entire principal lump-sum at the time of loan closure or renewal.",
  },
  {
    title: "Regular Monthly EMI",
    badge: "Disciplined Payoff",
    desc: "Equal monthly installments combining both principal and interest components to amortize the loan steadily over 12–36 months.",
  },
  {
    title: "Overdraft (OD) Facility",
    badge: "Maximum Flexibility",
    desc: "Credit line against pledged assets. Withdraw funds anytime, deposit surplus anytime, and pay interest calculated daily on net utilized balance.",
  },
];

export function GoldLoanPage({
  page,
  lenders: propLenders,
  locationPages = [],
}: {
  page: LoanSeoPageData;
  lenders?: BankProductLender[];
  locationPages?: LoanSeoLocationPage[];
}) {
  const applyHref = getApplyHref({
    category: "loan",
    productSlug: page.loanType || "gold-loan",
    referrer: page.canonicalPath || "/products/gold-loan",
  });

  // Calculator State
  const [goldWeightGrams, setGoldWeightGrams] = useState<number>(50);
  const [purityKarat, setPurityKarat] = useState<number>(22);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(8.5);

  // Gold rate per gram assumptions (24K base ~ ₹7,400)
  const base24kPrice = 7400;
  const purityMultiplier = purityKarat / 24;
  const goldMarketValue = Math.round(goldWeightGrams * base24kPrice * purityMultiplier);
  const maxLoanEligible = Math.round(goldMarketValue * 0.75); // 75% RBI LTV

  // Interest calculations
  const monthlyInterest = Math.round((maxLoanEligible * (interestRate / 100)) / 12);
  const totalInterest = Math.round(monthlyInterest * tenureMonths);

  // Quick Application Form State
  const [formState, setFormState] = useState({
    fullName: "",
    mobileNumber: "",
    assetType: "gold-jewelry",
    estimatedValue: "500000",
    city: "Mumbai",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  const activeLenders = propLenders && propLenders.length > 0 ? propLenders : goldLenders;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ─── HERO SECTION (Dark / Deep Purple Background with Gold Banner) ─── */}
      <section className="relative min-h-[580px] bg-slate-950 text-white overflow-hidden py-14 lg:py-20 flex items-center">
        {/* Background Image with Layered Scrim */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/loan-banners/gold-hero.jpg"
            alt="Gold and Securities Loan - Fintaraa"
            fill
            priority
            className="object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-purple-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Instant Liquidity Against Gold, Shares & Assets
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Get Instant Cash Against{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-purple-300">
                  Gold & Securities
                </span>{" "}
                in 30 Minutes
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Unlock competitive rates starting from <strong>8.40% p.a.</strong> with up to <strong>75% RBI-mandated market valuation</strong>. Enjoy doorstep evaluation, 100% tamper-proof insured bank vault security, and zero income document barrier.
              </p>

              {/* 4 Pillars Highlight */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="text-xl font-bold text-amber-300">8.40%*</div>
                  <div className="text-xs text-slate-400">Lowest Rate p.a.</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="text-xl font-bold text-white">Up to 75%</div>
                  <div className="text-xs text-slate-400">Regulatory LTV</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="text-xl font-bold text-purple-300">30 Mins</div>
                  <div className="text-xs text-slate-400">Instant Disbursal</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="text-xl font-bold text-emerald-400">₹0</div>
                  <div className="text-xs text-slate-400">Prepayment Penalty</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href={applyHref}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#6424C7] hover:bg-[#521da8] text-white text-sm font-semibold transition-all shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 hover:scale-[1.02]"
                >
                  Apply for Gold / Asset Loan
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#calculator-section"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all backdrop-blur-sm border border-white/15"
                >
                  <Calculator className="w-4 h-4 text-amber-300" />
                  Estimate Gold Value
                </a>
              </div>
            </div>

            {/* Right Hero Lead Capture Card */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-2xl bg-white/95 text-slate-900 shadow-2xl backdrop-blur-xl border border-white/40">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Get Highest Valuation</h3>
                    <p className="text-xs text-slate-500">Free Doorstep or Branch Appointment</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-[#6424C7] flex items-center justify-center">
                    <Vault className="w-5 h-5" />
                  </div>
                </div>

                {submitted ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Application Received!</h4>
                    <p className="text-xs text-slate-600">
                      Our certified valuation officer will contact you within 15 minutes to schedule your gold valuation.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name as per Aadhaar
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={formState.fullName}
                        onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6424C7] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          placeholder="98765 43210"
                          value={formState.mobileNumber}
                          onChange={(e) => setFormState({ ...formState, mobileNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-r-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6424C7] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Pledge Type
                        </label>
                        <select
                          value={formState.assetType}
                          onChange={(e) => setFormState({ ...formState, assetType: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#6424C7]"
                        >
                          <option value="gold-jewelry">Gold Jewelry (18K-24K)</option>
                          <option value="mutual-funds">Mutual Funds / Stocks</option>
                          <option value="solar-setup">Solar Rooftop Unit</option>
                          <option value="agri-gold">Kisan Agri Gold</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Pune"
                          value={formState.city}
                          onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6424C7]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-[#6424C7] hover:bg-[#521da8] text-white font-semibold text-sm transition-all shadow-md shadow-purple-900/20 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Check My Loan Eligibility Now
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      100% Privacy • No impact on CIBIL • 0 spam guarantee
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: LIVE GOLD VALUATION & LOAN CALCULATOR ─── */}
      <section id="calculator-section" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#6424C7] text-xs font-semibold uppercase tracking-wider mb-3">
              <Scale className="w-3.5 h-3.5" />
              Real-Time Valuation Tool
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Calculate Your Gold Loan Value & Monthly Interest
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Move the sliders to estimate your instant maximum disbursal amount based on current 24K bullion benchmarks and RBI 75% LTV regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-100">
            {/* Sliders Area */}
            <div className="lg:col-span-7 space-y-6">
              {/* Gold Weight Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-800">
                    Total Gold Weight (Net in Grams)
                  </label>
                  <span className="text-base font-bold text-[#6424C7] px-3 py-1 bg-purple-50 rounded-lg">
                    {goldWeightGrams} Grams
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={5}
                  value={goldWeightGrams}
                  onChange={(e) => setGoldWeightGrams(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6424C7]"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>10g (1 Tola)</span>
                  <span>250g</span>
                  <span>500g (Half Kg)</span>
                </div>
              </div>

              {/* Purity Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Gold Karat Purity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[18, 20, 22, 24].map((karat) => (
                    <button
                      key={karat}
                      type="button"
                      onClick={() => setPurityKarat(karat)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        purityKarat === karat
                          ? "bg-[#6424C7] text-white border-[#6424C7] shadow-md shadow-purple-900/20"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {karat} Karat ({Math.round((karat / 24) * 100)}%)
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenure Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-800">Loan Tenure</label>
                  <span className="text-base font-bold text-[#6424C7] px-3 py-1 bg-purple-50 rounded-lg">
                    {tenureMonths} Months
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={36}
                  step={3}
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6424C7]"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>3 Months</span>
                  <span>12 Months (1 Yr)</span>
                  <span>36 Months (3 Yrs)</span>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-800">Interest Rate (% p.a.)</label>
                  <span className="text-base font-bold text-amber-600 px-3 py-1 bg-amber-50 rounded-lg">
                    {interestRate.toFixed(2)}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min={8.0}
                  max={18.0}
                  step={0.25}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>8.0% (PSU Banks)</span>
                  <span>12.0%</span>
                  <span>18.0% (NBFCs)</span>
                </div>
              </div>
            </div>

            {/* Output Summary Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-purple-950 text-white p-6 sm:p-8 rounded-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Estimated Gross Gold Value
                </span>
                <span className="text-sm font-bold text-amber-300">
                  ₹{goldMarketValue.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-purple-300 font-semibold">
                  Max Eligible Loan Sanction (75% LTV)
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  ₹{maxLoanEligible.toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-slate-400">
                  Instant disbursal into bank account upon Karatmeter purity verification.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-xs text-slate-400">Monthly Interest</div>
                  <div className="text-lg font-bold text-amber-300">
                    ₹{monthlyInterest.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] text-slate-500">Under Monthly Scheme</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-xs text-slate-400">Total Interest ({tenureMonths}m)</div>
                  <div className="text-lg font-bold text-white">
                    ₹{totalInterest.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] text-slate-500">At {interestRate}% p.a.</div>
                </div>
              </div>

              <Link
                href={applyHref}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                Apply for ₹{maxLoanEligible.toLocaleString("en-IN")} Instant Loan
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: 4 SPECIALIZED GOLD & ASSET LOAN VARIANTS ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#6424C7] text-xs font-semibold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5" />
              Asset Financing Portfolio
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Specialized Secured Loan Solutions
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Whether you need emergency cash against family gold, leverage stock portfolios, or install green solar power, Fintaraa partners with 40+ premier banks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loanVariants.map((variant) => {
              const IconComp = variant.icon;
              return (
                <div
                  key={variant.slug}
                  className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6424C7] flex items-center justify-center">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-purple-50 text-[#6424C7] text-xs font-bold border border-purple-100">
                        {variant.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">{variant.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {variant.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100">
                      <div>
                        <div className="text-[11px] text-slate-500">Interest Rate</div>
                        <div className="text-xs sm:text-sm font-bold text-[#6424C7]">{variant.rate}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Funding / LTV</div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900">{variant.ltv}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Max Tenure</div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900">{variant.tenure}</div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      {variant.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <Link
                      href={getApplyHref({
                        category: "loan",
                        productSlug: variant.slug,
                        referrer: page.canonicalPath || `/products/${variant.slug}`,
                      })}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#6424C7] hover:bg-[#521da8] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      Apply for {variant.title}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: REPAYMENT FLEXIBILITY MODES ─── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#6424C7] text-xs font-semibold uppercase tracking-wider mb-3">
              <RefreshCw className="w-3.5 h-3.5" />
              Tailored Cash Flow Options
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              4 Flexible Ways to Repay Your Loan
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Unlike rigid personal loans, gold and asset loans offer customized repayment structures designed to preserve your monthly household budget.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {repaymentModes.map((mode, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-[#6424C7] inline-block">
                    {mode.badge}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{mode.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{mode.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: TOP BANK & NBFC RATES COMPARISON ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#6424C7] text-xs font-semibold uppercase tracking-wider mb-3">
              <Building2 className="w-3.5 h-3.5" />
              Bank & NBFC Comparison 2026
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Compare India’s Leading Gold Loan Lenders
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Transparent comparison of interest rates, LTV norms, processing fees, and turnaround times across top institutional lenders.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-4 font-semibold">Lender Name</th>
                  <th className="p-4 font-semibold">Interest Rate (p.a.)</th>
                  <th className="p-4 font-semibold">Max LTV</th>
                  <th className="p-4 font-semibold">Processing Fee</th>
                  <th className="p-4 font-semibold">Max Tenure</th>
                  <th className="p-4 font-semibold">Key Highlights</th>
                  <th className="p-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {activeLenders.map((bank: any, index: number) => {
                  const displayName = bank.bankName || bank.name || "Leading Bank";
                  return (
                    <tr key={index} className="hover:bg-purple-50/40 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-purple-950">
                            {displayName.substring(0, 2).toUpperCase()}
                          </div>
                          <span>{displayName}</span>
                        </div>
                      </td>
                    <td className="p-4 font-bold text-[#6424C7]">
                      {"rate" in bank ? (bank as any).rate : (bank as any).interestRate || "8.50% p.a."}
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      {"ltv" in bank ? (bank as any).ltv : "Up to 75%"}
                    </td>
                    <td className="p-4 text-slate-600">
                      {"fee" in bank ? (bank as any).fee : (bank as any).processingFee || "0.50%"}
                    </td>
                    <td className="p-4 text-slate-600">
                      {"maxTenure" in bank ? (bank as any).maxTenure : "Up to 36 Months"}
                    </td>
                    <td className="p-4 text-xs text-slate-500 max-w-xs">
                      {"features" in bank ? (bank as any).features : "Doorstep valuation available"}
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        href={applyHref}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#6424C7] hover:bg-[#521da8] text-white text-xs font-semibold transition-all shadow-sm"
                      >
                        Apply Now
                      </Link>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: 4-STEP DOORSTEP & DIGITAL DISBURSAL JOURNEY ─── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#6424C7] text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" />
              Express 30-Minute Process
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              How to Get Your Gold Loan in 4 Easy Steps
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From online booking to doorstep Karatmeter appraisal and bank account transfer, experience a seamless, secure process.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Apply Online in 1 Min",
                desc: "Fill your contact details and estimated gold weight. Choose doorstep service or branch appointment.",
                icon: FileCheck2,
              },
              {
                step: "02",
                title: "Purity Appraisal",
                desc: "Certified valuation expert checks gold purity in your presence using non-destructive Karatmeter machines.",
                icon: Gem,
              },
              {
                step: "03",
                title: "Tamper-Proof Sealing",
                desc: "Ornaments are sealed in triple-layered GPS-tracked security pouches in your presence with your signature.",
                icon: ShieldCheck,
              },
              {
                step: "04",
                title: "Instant Bank Transfer",
                desc: "Sanction amount is immediately credited to your bank account via IMPS/RTGS within 30 minutes.",
                icon: KeyRound,
              },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden"
                >
                  <div className="text-4xl font-extrabold text-purple-100 absolute top-4 right-4">
                    {st.step}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6424C7] flex items-center justify-center mb-4 relative z-10">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 relative z-10">{st.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed relative z-10">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: VAULT SECURITY & SAFETY ASSURANCE ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Bank-Grade Protection
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Your Gold is 100% Insured & Stored in High-Security Vaults
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                When you pledge jewelry through Fintaraa’s partner banks, your valuable gold is stored in RBI-regulated bank strongrooms equipped with round-the-clock CCTV surveillance, biometric access, and Lloyd’s of London transit and burglary insurance.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "100% Insurance Cover against theft, burglary, and natural damage at zero extra cost to you.",
                  "Unique barcode and tamper-evident seal verified at both deposit and return.",
                  "Zero stone deductions on gold purity — non-destructive testing preserving every milligram.",
                  "Guaranteed return of identical ornaments within 24 hours of loan repayment.",
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white p-8 sm:p-10 rounded-3xl space-y-6 shadow-xl border border-purple-900/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Vault className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">RBI Mandated 75% LTV Rule</h3>
                  <p className="text-xs text-slate-400">Strict regulatory consumer protection</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The Reserve Bank of India strictly caps loan-to-value at 75% of average 30-day bullion market prices to ensure borrowers never face distress margin calls during short-term price volatility.
              </p>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs font-semibold text-amber-300">Eligible Gold Types:</div>
                <div className="text-xs text-slate-300">
                  • 18 Karat, 20 Karat, 22 Karat, and 24 Karat gold jewelry, coins, and biscuits.
                  <br />• Hallmarked and non-hallmarked family ornaments (Karatmeter verified).
                </div>
              </div>

              <Link
                href={applyHref}
                className="w-full py-3.5 px-4 rounded-xl bg-[#6424C7] hover:bg-[#521da8] text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                Schedule Free Doorstep Valuation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: ELIGIBILITY & DOCUMENTATION ─── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#6424C7] text-xs font-semibold uppercase tracking-wider mb-3">
              <FileCheck2 className="w-3.5 h-3.5" />
              Simple Criteria
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Eligibility & Minimal Documents Needed
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Gold loans require minimal paperwork. No income tax returns or salary slips needed up to ₹10 Lakhs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-[#6424C7]" />
                Borrower Eligibility
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Age:</strong> 18 to 75 years at the time of loan maturity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Nationality:</strong> Resident Indian citizen.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Occupation:</strong> Salaried, self-employed, traders, homemakers, farmers, retirees.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>CIBIL Score:</strong> No minimum score requirement (even borrowers with low CIBIL qualify).</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#6424C7]" />
                Required Documents
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Identity Proof:</strong> Aadhaar Card, Passport, Voter ID, Driving Licence.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Address Proof:</strong> Utility bill, Aadhaar, Rental Agreement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Photographs:</strong> 2 passport-size color photographs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Income Proof (Loans &gt; ₹10L):</strong> Bank statement or PAN declaration if required.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 9: DEEP FAQ ACCORDION ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoanFAQSection
            faqs={[
              {
                question: "How is the loan amount calculated against my gold jewelry?",
                answer:
                  "Per RBI guidelines, banks and NBFCs calculate the net weight of gold (excluding stones, gems, and enamel) multiplied by the 30-day moving average of 22K/24K gold rates, sanctioning up to 75% LTV.",
              },
              {
                question: "Is my pledged gold safe and insured while in the bank's custody?",
                answer:
                  "Yes, 100%. Pledged jewelry is sealed in tamper-evident security pouches in your presence, signed by you, and deposited in high-security bank vaults protected by 24/7 surveillance and full value insurance.",
              },
              {
                question: "What happens if I cannot pay regular monthly EMIs?",
                answer:
                  "Gold loans provide bullet repayment schemes where you pay both interest and principal only at the end of the term (e.g. 12 months), or monthly interest-only schemes where principal is repaid on loan closure.",
              },
              {
                question: "Do I need salary slips or a high CIBIL score to qualify for a gold loan?",
                answer:
                  "No. Gold loans are secured by physical bullion/jewelry, so income proofs and high credit scores are generally not mandatory for sanctions up to ₹10 Lakhs.",
              },
              {
                question: "How quickly can I get my pledged gold back after repayment?",
                answer:
                  "Upon full payment of the loan account, the original sealed pouch is retrieved from the branch vault and handed back to the primary borrower within 24 to 48 working hours.",
              },
            ]}
          />
        </div>
      </section>

      {/* ─── SECTION 10: PRODUCT RELATED BLOGS ─── */}
      <ProductRelatedBlogs category="Loans" productName={page.title || "Gold Loan"} />

      {/* ─── SECTION 11: SEO LOCATION DIRECTORY ─── */}
      {locationPages.length > 0 && (
        <ProductLocationDirectory
          productName={page.title || "Gold Loan"}
          productSlug={page.loanType || "gold-loan"}
          pages={locationPages}
        />
      )}

      {/* ─── SECTION 12: APP DOWNLOAD FOOTER BANNER ─── */}
      <AppDownloadBanner />
    </div>
  );
}
