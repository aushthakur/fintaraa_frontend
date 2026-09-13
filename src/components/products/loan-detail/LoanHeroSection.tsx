"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  LockKeyhole,
  Percent,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { getApplyHref } from "@/components/application/flowRegistry";
import type { LoanSeoPageData } from "@/services/loanSeoPages";

const heroSlides = [
  {
    image: "/assets/personal-loan/hero-slide-1.jpg",
    alt: "Young Indian couple planning their goals in modern apartment",
    caption: "Achieve Your Milestone Goals with 100% Paperless Digital Approval",
  },
  {
    image: "/assets/personal-loan/hero-slide-2.jpg",
    alt: "Confident Indian entrepreneur in modern atrium",
    caption: "Empowering Professionals with Rapid 24-Hour Sanction",
  },
  {
    image: "/assets/personal-loan/hero-slide-3.jpg",
    alt: "Happy Indian family celebrating in new home",
    caption: "Celebrate Life's Joyful Moments with Affordable EMIs",
  },
];

const defaultProductRanges: Record<
  string,
  {
    minAmount: number;
    maxAmount: number;
    defaultAmount: number;
    stepAmount: number;
    rate: number;
    minTenure: number;
    maxTenure: number;
    defaultTenure: number;
    rateBadge: string;
    amountBadge: string;
  }
> = {
  "personal-loan": {
    minAmount: 50000,
    maxAmount: 4000000,
    defaultAmount: 500000,
    stepAmount: 25000,
    rate: 10.49,
    minTenure: 1,
    maxTenure: 7,
    defaultTenure: 3,
    rateBadge: "From 10.49%* p.a.",
    amountBadge: "Up to ₹40 Lakhs",
  },
  "home-loan": {
    minAmount: 50000,
    maxAmount: 50000000,
    defaultAmount: 5000000,
    stepAmount: 100000,
    rate: 7.10,
    minTenure: 5,
    maxTenure: 30,
    defaultTenure: 20,
    rateBadge: "From 7.10%* p.a.",
    amountBadge: "Up to ₹5 Crore",
  },
  "business-loan": {
    minAmount: 100000,
    maxAmount: 10000000,
    defaultAmount: 1500000,
    stepAmount: 50000,
    rate: 11.99,
    minTenure: 1,
    maxTenure: 5,
    defaultTenure: 3,
    rateBadge: "From 11.99%* p.a.",
    amountBadge: "Collateral-free up to ₹1 Cr",
  },
  "gold-loan": {
    minAmount: 20000,
    maxAmount: 5000000,
    defaultAmount: 300000,
    stepAmount: 10000,
    rate: 8.95,
    minTenure: 1,
    maxTenure: 3,
    defaultTenure: 1,
    rateBadge: "From 8.95%* p.a.",
    amountBadge: "Up to 75% of Gold Value",
  },
  "loan-against-property": {
    minAmount: 1000000,
    maxAmount: 50000000,
    defaultAmount: 7500000,
    stepAmount: 250000,
    rate: 8.90,
    minTenure: 3,
    maxTenure: 20,
    defaultTenure: 15,
    rateBadge: "From 8.90%* p.a.",
    amountBadge: "Up to ₹10 Crore",
  },
  "doctor-loan": {
    minAmount: 100000,
    maxAmount: 10000000,
    defaultAmount: 2000000,
    stepAmount: 50000,
    rate: 10.25,
    minTenure: 1,
    maxTenure: 7,
    defaultTenure: 4,
    rateBadge: "From 10.25%* p.a.",
    amountBadge: "Up to ₹1 Crore",
  },
  "ca-loan": {
    minAmount: 100000,
    maxAmount: 10000000,
    defaultAmount: 2000000,
    stepAmount: 50000,
    rate: 10.25,
    minTenure: 1,
    maxTenure: 7,
    defaultTenure: 4,
    rateBadge: "From 10.25%* p.a.",
    amountBadge: "Up to ₹1 Crore",
  },
};

const fallbackRange = {
  minAmount: 50000,
  maxAmount: 5000000,
  defaultAmount: 500000,
  stepAmount: 25000,
  rate: 10.5,
  minTenure: 1,
  maxTenure: 5,
  defaultTenure: 3,
  rateBadge: "From 10.49%* p.a.",
  amountBadge: "Up to ₹50 Lakhs",
};

const fmtCurrency = (num: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(Math.max(0, Math.round(num || 0)));

const fmtShort = (num: number) => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} Lakh`;
  return `₹${Math.round(num).toLocaleString("en-IN")}`;
};

export function LoanHeroSection({ page }: { page: LoanSeoPageData }) {
  const range = defaultProductRanges[page.loanTypeSlug] || fallbackRange;
  const [amount, setAmount] = useState<number>(range.defaultAmount);
  const [tenureYears, setTenureYears] = useState<number>(range.defaultTenure);

  // Background carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const applyHref = getApplyHref({
    category: "loan",
    productSlug: page.loanTypeSlug,
    referrer: page.canonicalPath || `/products/${page.loanTypeSlug}`,
  });

  const emiCalc = useMemo(() => {
    const monthlyRate = range.rate / 12 / 100;
    const totalMonths = tenureYears * 12;
    if (monthlyRate === 0)
      return { emi: Math.round(amount / totalMonths), total: amount, interest: 0 };
    const emi =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const total = emi * totalMonths;
    const interest = total - amount;
    const principalPct = Math.round((amount / total) * 100);
    const interestPct = 100 - principalPct;
    return {
      emi: Math.round(emi),
      total: Math.round(total),
      interest: Math.round(interest),
      principalPct,
      interestPct,
    };
  }, [amount, tenureYears, range.rate]);

  const amountPresets = useMemo(() => {
    if (range.maxAmount >= 2500000) {
      return [100000, 300000, 500000, 1000000, 2500000];
    }
    return [50000, 100000, 200000, 300000, 500000];
  }, [range.maxAmount]);

  const tenurePresets = [1, 2, 3, 5, range.maxTenure >= 7 ? 7 : range.maxTenure].filter(
    (v, i, a) => v <= range.maxTenure && v >= range.minTenure && a.indexOf(v) === i
  );

  const amountPct = Math.min(
    100,
    Math.max(0, ((amount - range.minAmount) / (range.maxAmount - range.minAmount)) * 100)
  );

  const tenurePct = Math.min(
    100,
    Math.max(0, ((tenureYears - range.minTenure) / (range.maxTenure - range.minTenure)) * 100)
  );

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-[640px] lg:min-h-[720px] overflow-hidden select-none border-b border-gray-200"
    >
      {/* ── 1. FULL-HEIGHT ULTRA-REALISTIC BACKGROUND CAROUSEL ── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Visible, high-clarity soft white gradient overlay making typography effortlessly legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/60 lg:bg-gradient-to-r lg:from-white lg:via-white/90 lg:via-55% lg:to-white/20 pointer-events-none" />
      </div>

      {/* ── 2. INLINE SLIDER CUSTOM STYLES ── */}
      <style jsx global>{`
        .cool-loan-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .cool-loan-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #6424c7;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 3px rgba(100, 36, 199, 0.3),
            0 4px 12px rgba(100, 36, 199, 0.5);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .cool-loan-slider::-webkit-slider-thumb:hover {
          transform: scale(1.22);
          box-shadow: 0 0 0 5px rgba(100, 36, 199, 0.4),
            0 6px 16px rgba(100, 36, 199, 0.6);
        }
        .cool-loan-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #6424c7;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 3px rgba(100, 36, 199, 0.3);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .cool-loan-slider::-moz-range-thumb:hover {
          transform: scale(1.22);
        }
      `}</style>

      {/* ── 3. MAIN HERO CONTENT CONTAINER ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-14 sm:px-8 sm:pt-14 sm:pb-18 lg:px-12 lg:pt-16 lg:pb-20 xl:px-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* LEFT 7-COL: Clean typography & action elements directly on background (No white blocks) */}
          <div className="lg:col-span-7 text-gray-950">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-extrabold tracking-tight text-gray-950 leading-[1.12] drop-shadow-[0_2px_10px_rgba(255,255,255,0.9)]">
              {page.heroTitle || page.title || `${page.loanType} made easier`}{" "}
              <span className="block sm:inline" style={{ color: "#6424C7" }}>
                {range.rateBadge}
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 text-base sm:text-[18px] font-medium leading-relaxed text-gray-800 max-w-2xl drop-shadow-[0_1px_6px_rgba(255,255,255,0.85)]">
              {page.heroDescription ||
                page.subtitle ||
                `Compare lowest interest rates on ${page.loanType.toLowerCase()} from 50+ trusted banks & NBFCs with assisted digital approval and 24-hour disbursal.`}
            </p>

            {/* 4 Feature Value Chips (Subtle glass outline, no solid white block) */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 max-w-xl text-xs sm:text-[13px] font-medium text-gray-900">
              <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md p-3.5 shadow-xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-gray-950 block leading-tight">
                    {range.amountBadge}
                  </span>
                  <span className="text-[11.5px] text-gray-700 font-medium">Collateral-Free</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md p-3.5 shadow-xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-gray-950 block leading-tight">
                    Sanction in 24 Hrs
                  </span>
                  <span className="text-[11.5px] text-gray-700 font-medium">Direct Bank Transfer</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md p-3.5 shadow-xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-gray-950 block leading-tight">
                    Zero Hidden Fees
                  </span>
                  <span className="text-[11.5px] text-gray-700 font-medium">100% Transparent</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md p-3.5 shadow-xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-gray-950 block leading-tight">
                    Zero Credit Impact
                  </span>
                  <span className="text-[11.5px] text-gray-700 font-medium">Soft Bureau Check</span>
                </div>
              </div>
            </div>

            {/* Single Focused High-Converting Primary CTA Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={applyHref}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-[15px] font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(100,36,199,0.4)] active:scale-98 text-center cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #6424C7 50%, #4c1d95 100%)",
                }}
              >
                <span>Check Pre-Approved Offer</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Micro Trust Points */}
            <div className="mt-7 flex flex-wrap items-center gap-6 text-[12.5px] font-semibold text-gray-800 drop-shadow-[0_1px_4px_rgba(255,255,255,0.85)]">
              <span className="flex items-center gap-2">
                <BadgeCheck className="h-4.5 w-4.5 text-[#6424C7]" />
                50+ RBI Regulated Lenders
              </span>
              <span className="flex items-center gap-2">
                <UsersRound className="h-4.5 w-4.5 text-[#6424C7]" />
                2M+ Satisfied Borrowers
              </span>
              <span className="flex items-center gap-2">
                <LockKeyhole className="h-4.5 w-4.5 text-[#6424C7]" />
                256-Bit Bank Grade SSL
              </span>
            </div>

            {/* Carousel Slide Indicators */}
            <div className="mt-7 flex items-center gap-2">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.image}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer shadow-xs ${
                    currentSlide === idx
                      ? "w-8 bg-[#6424C7]"
                      : "w-2.5 bg-gray-400/60 hover:bg-gray-600"
                  }`}
                />
              ))}
              <span className="text-[12px] font-bold text-gray-800 ml-2 tracking-wide drop-shadow-[0_1px_4px_rgba(255,255,255,0.8)]">
                {currentSlide + 1} of {heroSlides.length}
              </span>
            </div>
          </div>

          {/* RIGHT 5-COL: 3D FLIP TRANSITION QUICK LOAN ESTIMATOR */}
          <div className="lg:col-span-5 [perspective:1400px]">
            <motion.div
              initial={{ opacity: 0, rotateY: 85, scale: 0.88 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{
                duration: 0.85,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative rounded-3xl border border-white/90 bg-white/95 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.22)]"
            >
              {/* Estimator Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                <div>
                  <h3 className="text-[17px] font-bold text-gray-900 leading-tight">
                    Quick {page.loanType} Estimator
                  </h3>
                  <p className="text-[12px] font-normal text-gray-500 mt-0.5">
                    Real-time indicative installment preview
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-[11.5px] font-bold text-[#6424C7]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6424C7] animate-pulse" />
                  <span>{range.rate}% p.a.</span>
                </div>
              </div>

              {/* Amount Section */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-gray-600">Required Loan Amount</span>
                  <span className="text-[#6424C7] font-extrabold text-[17px] tabular-nums">
                    {fmtCurrency(amount)}
                  </span>
                </div>

                {/* Animated Cool Range Slider */}
                <input
                  type="range"
                  min={range.minAmount}
                  max={range.maxAmount}
                  step={range.stepAmount}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="cool-loan-slider"
                  style={{
                    background: `linear-gradient(to right, #6424C7 ${amountPct}%, #e2e8f0 ${amountPct}%)`,
                  }}
                  aria-label="Required Loan Amount"
                />

                <div className="flex justify-between text-[11px] font-medium text-gray-400">
                  <span>{fmtShort(range.minAmount)}</span>
                  <span>{fmtShort(range.maxAmount)}</span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {amountPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                        amount === preset
                          ? "bg-[#6424C7] text-white shadow-xs scale-102"
                          : "bg-gray-100/80 text-gray-600 hover:bg-purple-50 hover:text-[#6424C7] border border-gray-200/80"
                      }`}
                    >
                      {fmtShort(preset)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenure Section */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-gray-600">Repayment Period</span>
                  <span className="text-[#6424C7] font-extrabold text-[16px] tabular-nums">
                    {tenureYears} {tenureYears === 1 ? "Year" : "Years"} ({tenureYears * 12} Mos)
                  </span>
                </div>

                {/* Animated Cool Range Slider */}
                <input
                  type="range"
                  min={range.minTenure}
                  max={range.maxTenure}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="cool-loan-slider"
                  style={{
                    background: `linear-gradient(to right, #6424C7 ${tenurePct}%, #e2e8f0 ${tenurePct}%)`,
                  }}
                  aria-label="Repayment Period"
                />

                <div className="flex justify-between text-[11px] font-medium text-gray-400">
                  <span>{range.minTenure} Yr</span>
                  <span>{range.maxTenure} Yrs</span>
                </div>

                {/* Quick Tenure Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tenurePresets.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTenureYears(t)}
                      className={`rounded-lg px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                        tenureYears === t
                          ? "bg-[#6424C7] text-white shadow-xs scale-102"
                          : "bg-gray-100/80 text-gray-600 hover:bg-purple-50 hover:text-[#6424C7] border border-gray-200/80"
                      }`}
                    >
                      {t} {t === 1 ? "Year" : "Years"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Output Box with Split Breakdown */}
              <div className="rounded-2xl bg-gradient-to-br from-purple-50/70 via-slate-50/80 to-white border border-purple-100 p-4 shadow-2xs mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      Estimated Monthly EMI
                    </span>
                    <div className="text-[26px] sm:text-[30px] font-extrabold text-[#6424C7] tabular-nums leading-none mt-1">
                      {fmtCurrency(emiCalc.emi)}
                      <span className="text-[12px] font-normal text-gray-500 ml-1">
                        /mo
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      Total Repayable
                    </span>
                    <div className="text-[15px] font-extrabold text-gray-900 tabular-nums mt-1">
                      {fmtCurrency(emiCalc.total)}
                    </div>
                  </div>
                </div>

                {/* Progress bar visual split */}
                <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden flex mb-2">
                  <div
                    className="h-full bg-[#6424C7] transition-all duration-300"
                    style={{ width: `${emiCalc.principalPct}%` }}
                    title={`Principal: ${emiCalc.principalPct}%`}
                  />
                  <div
                    className="h-full bg-[#a855f7] transition-all duration-300"
                    style={{ width: `${emiCalc.interestPct}%` }}
                    title={`Interest: ${emiCalc.interestPct}%`}
                  />
                </div>

                {/* Split Legend */}
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#6424C7]" />
                    Principal: {fmtCurrency(amount)} ({emiCalc.principalPct}%)
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="h-2 w-2 rounded-full bg-[#a855f7]" />
                    Interest: {fmtCurrency(emiCalc.interest)} ({emiCalc.interestPct}%)
                  </span>
                </div>
              </div>

              {/* High-Conversion Apply Button */}
              <Link
                href={`/eligibility-results?product=loan&loanType=${page.loanTypeSlug}&amount=${amount}&tenureYears=${tenureYears}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.01] active:scale-98 no-underline cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #6424C7 50%, #4c1d95 100%)",
                }}
              >
                <span>Check Eligibility for {fmtShort(amount)}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="mt-2.5 text-center text-[10.5px] font-medium text-gray-400">
                100% Free • No Impact on Credit Score • Instant Result
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
