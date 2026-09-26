"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  Building,
  Building2,
  Calculator,
  Car,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  KeyRound,
  Layers,
  Loader2,
  Lock,
  Percent,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
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

// ─── Bank Lenders for Vehicle Loans ──────────────────────────────────────────
const vehicleLenders = [
  {
    name: "State Bank of India (SBI)",
    slug: "sbi",
    logo: "/assets/banks/State-Bank-of-India.png",
    rate: "8.75% – 9.60% p.a.",
    funding: "Up to 100% On-Road",
    fee: "Zero Processing Fee",
    maxTenure: "Up to 7 Yrs",
    features: "SBI Green Car EV Discount • Zero Foreclosure Charges",
  },
  {
    name: "HDFC Bank",
    slug: "hdfc-bank",
    logo: "/assets/banks/HDFC-Bank.png",
    rate: "8.85% – 9.80% p.a.",
    funding: "Up to 100% On-Road",
    fee: "0.50% or ₹3,500",
    maxTenure: "Up to 7 Yrs",
    features: "30-Minute Digital In-Principle Sanction • Showroom Delivery",
  },
  {
    name: "ICICI Bank",
    slug: "icici-bank",
    logo: "/assets/banks/ICICI-Bank.png",
    rate: "8.90% – 9.90% p.a.",
    funding: "Up to 100% Ex-Showroom",
    fee: "₹2,500 to ₹5,000",
    maxTenure: "Up to 8 Yrs",
    features: "Pre-Approved Instant Sanction for Existing Account Holders",
  },
  {
    name: "Axis Bank",
    slug: "axis-bank",
    logo: "/assets/banks/axis-bank.png",
    rate: "9.00% – 10.15% p.a.",
    funding: "Up to 95% On-Road",
    fee: "1.00% of Loan Amount",
    maxTenure: "Up to 7 Yrs",
    features: "Special Rates on Electric Vehicles (EVs) & Hybrids",
  },
  {
    name: "Kotak Mahindra Bank",
    slug: "kotak-bank",
    logo: "/assets/banks/Kotak-Mahindra-Bank.png",
    rate: "8.95% – 9.85% p.a.",
    funding: "Up to 90% On-Road",
    fee: "0.50% of Loan",
    maxTenure: "Up to 7 Yrs",
    features: "Fast Track Sanction on Used Cars & Certified Pre-Owned",
  },
  {
    name: "Mahindra Finance",
    slug: "mahindra-finance",
    logo: "/assets/banks/IndusInd-Bank.png",
    rate: "9.50% – 12.00% p.a.",
    funding: "Up to 90% On-Road",
    fee: "1.50% of Loan",
    maxTenure: "Up to 5 Yrs",
    features: "Easy Approvals for Self-Employed & Rural Borrowers",
  },
];

// ─── Specialized Vehicle Variants ──────────────────────────────────────────
const vehicleVariants = [
  {
    id: "new-car-loan",
    title: "New Car Loan & EV Financing",
    subtitle: "Drive Home Your Dream Sedan, SUV or Electric Vehicle with 100% Funding",
    badge: "New Car & EV",
    icon: Car,
    accent: "#6424C7",
    image: "/assets/loan-banners/vehicle-hero.jpg",
    description:
      "Finance brand new hatchbacks, luxury sedans, SUVs, and electric vehicles (EVs) with up to 100% on-road funding covering ex-showroom price, road tax, and registration.",
    bullets: [
      "Up to 100% on-road price financing for eligible credit profiles",
      "Low interest rates starting at 8.75% p.a. with fixed & floating options",
      "Tenures up to 84 months (7 to 8 years) keeping monthly EMIs low",
      "Special 0.25% concessional rate for green electric mobility",
    ],
    highlightText: "Doorstep test drive & instant bank delivery order (DO) generated.",
  },
  {
    id: "used-car-loan",
    title: "Pre-Owned & Used Car Loan",
    subtitle: "Finance Certified Second-Hand Cars with Free RC Transfer Assistance",
    badge: "Used Car Finance",
    icon: RefreshCw,
    accent: "#8b5cf6",
    image: "/assets/loan-banners/lap-variant-residential.jpg",
    description:
      "Get up to 90% of the vehicle valuation for certified pre-owned cars from dealerships or direct individual sellers. Includes comprehensive vehicle background checks and free RC endorsement.",
    bullets: [
      "Financing up to 90% of the car's current fair market valuation",
      "Flexible tenures up to 5 years (60 months) on cars up to 10 years old",
      "Hassle-free ownership transfer and RTO hypothecation management",
      "Quick disbursal directly to seller upon digital inspection",
    ],
    highlightText: "Transparent valuation from certified multi-brand automobile engineers.",
  },
  {
    id: "two-wheeler-ev-loan",
    title: "Two Wheeler & E-Bike Loan",
    subtitle: "Affordable Two-Wheeler Financing with Zero Down Payment Options",
    badge: "Two Wheeler & E-Bike",
    icon: Bike,
    accent: "#6424C7",
    image: "/assets/loan-banners/lap-variant-overdraft.jpg",
    description:
      "Purchase your daily commuter bike, sports motorcycle, or smart electric scooter with flexible zero-down-payment options and paperless 10-minute digital approvals.",
    bullets: [
      "Up to 95% to 100% on-road funding for all major bike brands & EV scooters",
      "Minimal documentation — Aadhaar, PAN & 3 months bank statement",
      "Repayment tenures from 12 to 48 months matching entry-level budgets",
      "Subsidized financing on FAME-II compliant electric scooters",
    ],
    highlightText: "Instant approval on WhatsApp with same-day showroom driveaway.",
  },
  {
    id: "loan-against-car",
    title: "Loan Against Car (Refinancing & Top-Up)",
    subtitle: "Unlock Emergency Cash up to 150% of Your Car's Current Market Value",
    badge: "Vehicle Equity Refinance",
    icon: Coins,
    accent: "#8b5cf6",
    image: "/assets/loan-banners/lap-variant-refinance.jpg",
    description:
      "Monetize your existing paid-off car or running car loan to raise instant liquidity up to ₹25 Lakhs without selling your vehicle. Keep driving your car while enjoying lower secured interest rates.",
    bullets: [
      "Borrow up to 150% of your car's market value with ZERO usage restrictions",
      "Significantly cheaper than unsecured personal loans (rates from 9.50% p.a.)",
      "Fast 24-hour disbursal with simple digital RTO lien endorsement",
      "Full ownership & driving rights remain 100% intact with you",
    ],
    highlightText: "Raise high capital in 24 hours while keeping your car on the road.",
  },
];

const fmtCurrency = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(Math.max(0, Math.round(val || 0)));

export function VehicleLoanPage({
  page,
  lenders = [],
  locationPages = [],
}: {
  page: LoanSeoPageData;
  lenders?: BankProductLender[];
  locationPages?: LoanSeoLocationPage[];
}) {
  // ─── Calculator State ────────────────────────────────────────────────────────
  const [onRoadPrice, setOnRoadPrice] = useState<number>(1500000); // 15 Lakhs
  const [downPayment, setDownPayment] = useState<number>(200000); // 2 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.85);
  const [tenureYears, setTenureYears] = useState<number>(5);

  // Lead Form State
  const [carModel, setCarModel] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Delhi NCR");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ─── Live Calculation Engine ─────────────────────────────────────────────────
  const calculations = useMemo(() => {
    const loanAmount = Math.max(100000, onRoadPrice - downPayment);
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const N = tenureYears * 12;

    const emi =
      P * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
    const totalRepayment = emi * N;
    const totalInterest = totalRepayment - P;

    return {
      loanAmount,
      emi: Math.round(emi),
      totalRepayment: Math.round(totalRepayment),
      totalInterest: Math.round(totalInterest),
    };
  }, [onRoadPrice, downPayment, interestRate, tenureYears]);

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
    productSlug: "car-loan",
    referrer: "/products/car-loan",
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
            src="/assets/loan-banners/vehicle-hero.jpg"
            alt="New Car, EV and Two Wheeler Financing"
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
                Drive Your Dream Car Today with{" "}
                <span className="block mt-1 bg-gradient-to-r from-purple-200 via-purple-300 to-white bg-clip-text text-transparent font-normal">
                  Up to 100% On-Road Funding
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-base sm:text-lg text-purple-100/90 font-normal leading-relaxed drop-shadow-sm max-w-2xl">
                Finance new cars, pre-owned vehicles, electric mobility, or unlock instant cash with vehicle refinancing. Lowest interest rates starting at 8.75% p.a. with fast 30-minute approval.
              </p>

              {/* CTA Buttons (Purples & White) */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={applyHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6424c7] px-8 py-4 text-sm font-normal text-white shadow-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(139,92,246,0.4)] active:scale-98 cursor-pointer border border-white/20"
                >
                  <span>Check Car Loan Eligibility</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#car-calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 backdrop-blur-md px-6 py-4 text-sm font-normal text-white border border-white/25 hover:bg-white/25 transition-all cursor-pointer"
                >
                  <Calculator className="h-4 w-4 text-purple-200" />
                  <span>Calculate Car EMI</span>
                </a>
              </div>

              {/* Small Trust Info */}
              <div className="mt-8 flex items-center gap-6 text-xs text-purple-200/90">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>RBI Regulated Banks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4 text-purple-300" />
                  <span>Showroom Delivery Order in 4 Hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-purple-300" />
                  <span>Special EV Green Subsidy</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Estimator Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white p-6 sm:p-7 text-slate-900 shadow-2xl border border-purple-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <h3 className="text-lg font-normal text-slate-900">Car Loan Estimator</h3>
                    <p className="text-xs text-slate-500 font-normal">Check on-road financing &amp; monthly EMI</p>
                  </div>
                  <div className="shrink-0 ml-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/90 px-3.5 py-1.5 text-xs font-normal text-[#6424C7] border border-purple-200 shadow-xs">
                      <Sparkles className="h-3.5 w-3.5 text-[#6424C7]" />
                      <span>100% On-Road</span>
                    </span>
                  </div>
                </div>

                {!submitSuccess ? (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-normal text-slate-700 mb-1">
                        Vehicle On-Road Price (₹)
                      </label>
                      <input
                        type="text"
                        value={onRoadPrice.toLocaleString("en-IN")}
                        onChange={(e) => {
                          const val = Number(e.target.value.replace(/\D/g, ""));
                          setOnRoadPrice(val || 0);
                        }}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-normal text-slate-700 mb-1">
                          Down Payment (₹)
                        </label>
                        <input
                          type="text"
                          value={downPayment.toLocaleString("en-IN")}
                          onChange={(e) => {
                            const val = Number(e.target.value.replace(/\D/g, ""));
                            setDownPayment(val || 0);
                          }}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none"
                        />
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
                          <option value={3}>3 Years (36 Mos)</option>
                          <option value={5}>5 Years (60 Mos)</option>
                          <option value={7}>7 Years (84 Mos)</option>
                        </select>
                      </div>
                    </div>

                    {/* Calculated Live Sanction Box */}
                    <div className="rounded-2xl bg-purple-50/80 p-4 border border-purple-100">
                      <div className="flex items-center justify-between text-xs text-purple-900 font-normal">
                        <span>Net Loan Sanction:</span>
                        <span className="text-base font-normal text-[#6424C7]">
                          {fmtCurrency(calculations.loanAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-purple-900 font-normal mt-2 pt-2 border-t border-purple-100">
                        <span>Estimated Monthly EMI (@ 8.85%):</span>
                        <span className="text-sm font-normal text-emerald-600">
                          {fmtCurrency(calculations.emi)}/mo
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-normal text-slate-700 mb-1">
                        Car Make &amp; Model
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tata Nexon EV, Hyundai Creta, Mahindra XUV700"
                        value={carModel}
                        onChange={(e) => setCarModel(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal focus:border-[#6424C7] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-normal text-slate-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="As per PAN"
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
                          Checking Dealer Delivery Rates...
                        </span>
                      ) : (
                        "Get Instant Delivery Approval Letter"
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-[#6424C7]">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-normal text-slate-900">Delivery In-Principle Approved!</h4>
                    <p className="text-xs text-slate-600 font-normal">
                      Our auto finance advisor will coordinate with your local dealership to generate the Delivery Order (DO) within 4 hours.
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
              <span className="block text-2xl sm:text-3xl font-normal text-[#6424C7]">From 8.75%</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Starting Fixed &amp; Floating Rate</span>
            </div>
            <div className="border-r border-purple-200/60 last:border-0 pr-4">
              <span className="block text-2xl sm:text-3xl font-normal text-slate-900">Up to 100%</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">On-Road Price Funding</span>
            </div>
            <div className="border-r border-purple-200/60 last:border-0 pr-4">
              <span className="block text-2xl sm:text-3xl font-normal text-[#6424C7]">30 Minutes</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Digital In-Principle Sanction</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-normal text-emerald-600">84 Months</span>
              <span className="text-xs text-slate-600 font-normal mt-0.5 block">Extended Repayment Horizon</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          3. INTERACTIVE CAR LOAN & EMI CALCULATOR
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="car-calculator" className="w-full py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Calculate Your Vehicle <span className="text-[#6424C7]">EMI &amp; Down Payment</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Customize your car price, down payment, and tenure to find the most affordable monthly installment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Sliders Input Panel */}
            <div className="lg:col-span-7 space-y-7 rounded-3xl bg-slate-50/80 p-6 sm:p-8 border border-slate-200/80">
              
              {/* Slider 1: On-Road Price */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Car On-Road Price</span>
                  <span className="text-base font-normal text-[#6424C7]">{fmtCurrency(onRoadPrice)}</span>
                </div>
                <input
                  type="range"
                  min={300000}
                  max={8000000}
                  step={50000}
                  value={onRoadPrice}
                  onChange={(e) => setOnRoadPrice(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹3 Lakhs</span>
                  <span>₹80 Lakhs</span>
                </div>
              </div>

              {/* Slider 2: Down Payment */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Down Payment Amount</span>
                  <span className="text-base font-normal text-slate-900">{fmtCurrency(downPayment)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.round(onRoadPrice * 0.5)}
                  step={25000}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹0 (100% Funding)</span>
                  <span>50% Down Payment</span>
                </div>
              </div>

              {/* Slider 3: Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-normal text-slate-800">Annual Interest Rate</span>
                  <span className="text-base font-normal text-slate-900">{interestRate.toFixed(2)}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={8.75}
                  max={14.00}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#6424C7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>8.75% (Prime Bank)</span>
                  <span>14.00%</span>
                </div>
              </div>

              {/* Slider 4: Tenure */}
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
                Car Loan EMI Breakdown
              </h3>

              <div className="space-y-5 text-sm font-normal">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Net Sanctioned Loan:</span>
                  <span className="text-xl font-normal text-white">{fmtCurrency(calculations.loanAmount)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Monthly Car Installment:</span>
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
                    Apply for {fmtCurrency(calculations.loanAmount)} Auto Loan
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          4. COMPARE TOP LENDERS FOR AUTO & TWO WHEELER FINANCING
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="bank-comparison" className="w-full py-14 sm:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Compare Top Partner Lenders for <span className="text-[#6424C7]">Vehicle Loans</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Transparent interest rates, on-road funding allocations, and processing terms from India's leading auto financiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicleLenders.map((b) => (
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
                      {b.funding}
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
          5. SPECIALIZED VEHICLE VARIANTS (DECONTAINERIZED & BORDERLESS)
         ═════════════════════════════════════════════════════════════════════════ */}
      <section id="variants" className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-slate-900 leading-[1.15]">
              Specialized Vehicle Financing{" "}
              <span className="bg-gradient-to-r from-[#6424C7] to-purple-600 bg-clip-text text-transparent font-normal">
                Options
              </span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Customized financing programs tailored for new cars, certified pre-owned vehicles, two-wheelers &amp; EVs, and car equity refinancing.
            </p>
          </div>

          {/* Borderless Edge-to-Edge Layout Stack */}
          <div className="space-y-20 sm:space-y-28">
            {vehicleVariants.map((v, idx) => {
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
                            From 8.75%
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
                      <span>Variant {idx + 1} of {vehicleVariants.length}</span>
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
          6. ELIGIBLE VEHICLE TYPES & FINANCING TERMS (BORDERLESS)
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Eligible Vehicle Categories &amp; <span className="text-[#6424C7]">Features</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              We finance personal four-wheelers, electric vehicles, pre-owned cars, and two-wheelers across all Indian automotive brands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "New Electric Vehicles (EVs)",
                funding: "100% On-Road Funding",
                desc: "Special subsidized green car loans on Tata, MG, Mahindra, Hyundai, and BYD electric models.",
                image: "/assets/loan-banners/vehicle-hero.jpg",
              },
              {
                title: "SUVs & Luxury Sedans",
                funding: "Up to 95% On-Road",
                desc: "High-ticket auto credit for premium compact, mid-size, and full-size SUVs with quick showroom delivery.",
                image: "/assets/loan-banners/lap-variant-commercial.jpg",
              },
              {
                title: "Certified Used Cars",
                funding: "Up to 90% Valuation",
                desc: "Pre-owned multi-brand cars with free RC transfer, insurance endorsement, and comprehensive mechanical check.",
                image: "/assets/loan-banners/lap-variant-residential.jpg",
              },
              {
                title: "Two Wheelers & E-Scooters",
                funding: "Zero Down Payment",
                desc: "Commuter motorcycles and high-speed electric scooters with 10-minute digital KYC approvals.",
                image: "/assets/loan-banners/lap-variant-overdraft.jpg",
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
                    {p.funding}
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
          7. 4-STEP EXPRESS SHOWROOM DELIVERY WORKFLOW
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              4-Step Express <span className="text-[#6424C7]">Showroom Delivery Process</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              From online car selection to bank delivery order (DO) generation, enjoy a seamless showroom driveaway.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Select Vehicle & Dealership",
                desc: "Choose your preferred car brand, dealer quotation, and on-road price breakdown.",
              },
              {
                step: "02",
                title: "Digital In-Principle Sanction",
                desc: "Complete 5-minute digital KYC to receive an instant bank loan sanction letter.",
              },
              {
                step: "03",
                title: "Bank Delivery Order (DO)",
                desc: "Bank issues official Delivery Order directly to your dealer, confirming payment guarantee.",
              },
              {
                step: "04",
                title: "Keys Handover & Driveaway",
                desc: "Collect your new vehicle from the showroom with hassle-free digital auto-debit setup.",
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
          8. NEW CAR VS USED CAR VS CAR REFINANCE COMPARISON TABLE
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              New Car Loan <span className="text-[#6424C7]">vs Used Car Loan vs Refinance</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Compare key differences in funding limits, interest rates, tenures, and documentation requirements.
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse bg-white text-left text-sm font-normal rounded-2xl overflow-hidden border border-slate-200">
              <thead className="bg-[#4c1d95] text-white text-xs font-normal uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-[28%]">Parameter</th>
                  <th className="px-6 py-4 w-[24%] text-purple-200 font-normal">New Car Loan</th>
                  <th className="px-6 py-4 w-[24%] font-normal">Used Car Loan</th>
                  <th className="px-6 py-4 w-[24%] font-normal">Loan Against Car</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Funding Coverage</td>
                  <td className="px-6 py-4 font-normal text-emerald-600">Up to 100% On-Road</td>
                  <td className="px-6 py-4 text-slate-600">Up to 90% Valuation</td>
                  <td className="px-6 py-4 text-slate-600">Up to 150% Value</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Starting Interest Rate</td>
                  <td className="px-6 py-4 font-normal text-[#6424C7]">8.75% – 9.80% p.a.</td>
                  <td className="px-6 py-4 text-slate-600">11.50% – 14.50% p.a.</td>
                  <td className="px-6 py-4 text-slate-600">9.50% – 12.00% p.a.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Maximum Tenure</td>
                  <td className="px-6 py-4 font-normal text-slate-900">Up to 84 Months (7 Yrs)</td>
                  <td className="px-6 py-4 text-slate-600">Up to 60 Months (5 Yrs)</td>
                  <td className="px-6 py-4 text-slate-600">Up to 60 Months (5 Yrs)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-normal text-slate-900">Disbursal Destination</td>
                  <td className="px-6 py-4 font-normal text-slate-900">Direct to Authorized Dealer</td>
                  <td className="px-6 py-4 text-slate-600">Direct to Car Seller</td>
                  <td className="px-6 py-4 font-normal text-emerald-600">Direct to Your Bank Account</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          9. COMPREHENSIVE VEHICLE & BORROWER DOCUMENT CHECKLIST
         ═════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
              Borrower &amp; Vehicle <span className="text-[#6424C7]">Documentation Checklist</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Review basic borrower KYC, income proofs, and vehicle quotation documents required for instant auto loan sanction.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Borrower Eligibility */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl font-normal text-slate-900 border-b border-slate-200 pb-3">
                Borrower KYC &amp; Income
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-normal">
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Identity &amp; Address Proof</span>
                  <p className="text-slate-600 text-xs mt-0.5">Aadhaar Card, PAN Card, and passport-size photographs.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Salaried Income Proof</span>
                  <p className="text-slate-600 text-xs mt-0.5">Last 3 months salary slips and Form 16 / ITR.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Self-Employed Proof</span>
                  <p className="text-slate-600 text-xs mt-0.5">Last 2 years audited ITR computation and 6 months bank statement.</p>
                </div>
              </div>
            </div>

            {/* Vehicle Quotation & RTO Papers */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl font-normal text-slate-900 border-b border-slate-200 pb-3">
                Vehicle &amp; Dealer Documents
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-normal">
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Dealer Proforma Invoice</span>
                  <p className="text-slate-600 text-xs mt-0.5">Official car price quotation detailing ex-showroom, RTO, and insurance.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Used Car RC Copy &amp; Insurance</span>
                  <p className="text-slate-600 text-xs mt-0.5">Original Registration Certificate (RC) and active comprehensive policy.</p>
                </div>
                <div className="border-b border-slate-100 pb-3">
                  <span className="block font-normal text-slate-900">Driving License</span>
                  <p className="text-slate-600 text-xs mt-0.5">Valid Indian driving license of the primary applicant or co-borrower.</p>
                </div>
              </div>
            </div>

            {/* Feature Visual Image Banner */}
            <div className="lg:col-span-4 relative rounded-3xl overflow-hidden min-h-[300px] shadow-lg border border-purple-100 flex flex-col justify-end">
              <Image
                src="/assets/loan-banners/vehicle-hero.jpg"
                alt="Direct Showroom Delivery Order Assistance"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065] via-[#2e1065]/40 to-transparent" />
              <div className="relative z-10 p-6 text-white space-y-2">
                <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-normal text-purple-100 inline-block">
                  Express Showroom Desk
                </span>
                <h4 className="text-lg font-normal text-white">4-Hour Dealer Delivery Order</h4>
                <p className="text-xs text-purple-200/90 font-normal leading-relaxed">
                  Fintaraa auto loan managers generate digital delivery orders directly to your local authorized dealership.
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
            question: "What does 100% on-road funding in a car loan include?",
            answer:
              "100% on-road financing covers the entire vehicle ex-showroom price, state RTO registration charges, road tax, and comprehensive motor insurance, meaning zero down payment out of pocket for eligible borrowers.",
          },
          {
            question: "How is a Loan Against Car different from a Personal Loan?",
            answer:
              "A Loan Against Car uses your existing car as security. Because it is a secured loan, interest rates are much lower (starting at 9.50% vs 11.5%+ on personal loans), and sanction amounts can reach up to 150% of the vehicle's market value.",
          },
          {
            question: "Can I get a car loan if I am self-employed or do not have Form 16?",
            answer:
              "Yes! Self-employed professionals, traders, and business owners can qualify with their past 2 years ITR and 6 months operative bank statements showing consistent cashflow.",
          },
          {
            question: "Are there special interest rate discounts for buying an Electric Vehicle (EV)?",
            answer:
              "Yes! Banks like SBI, HDFC, and ICICI offer a 0.25% concessional green interest rate on electric four-wheelers and two-wheelers, along with lower processing fees.",
          },
        ]}
        title="Frequently Asked Questions About Car & Vehicle Financing"
      />

      <ProductRelatedBlogs category="Loans" productName="Car Loan" />
      <ProductLocationDirectory
        productName="Car Loan"
        productSlug="car-loan"
        pages={locationPages}
      />
      <AppDownloadBanner />
    </main>
  );
}
