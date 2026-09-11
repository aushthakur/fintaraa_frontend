"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  HandCoins,
  LockKeyhole,
  Percent,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { getApplyHref } from "@/components/application/flowRegistry";
import type { LoanSeoPageData } from "@/services/loanSeoPages";

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
    minAmount: 500000,
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

  const applyHref = getApplyHref({
    category: "loan",
    productSlug: page.loanTypeSlug,
    referrer: page.canonicalPath || `/products/${page.loanTypeSlug}`,
  });

  const emiCalc = useMemo(() => {
    const monthlyRate = range.rate / 12 / 100;
    const totalMonths = tenureYears * 12;
    if (monthlyRate === 0) return { emi: Math.round(amount / totalMonths), total: amount };
    const emi =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const total = emi * totalMonths;
    return {
      emi: Math.round(emi),
      total: Math.round(total),
      interest: Math.round(total - amount),
    };
  }, [amount, tenureYears, range.rate]);

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-20 border-b border-slate-100 select-none">
      {/* Subtle Background Halos */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#5b21b6]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#0ea5e9]/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          
          {/* LEFT 7-COL: Title, Value Proposition & Actions */}
          <div className="lg:col-span-7">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-200/80 px-3.5 py-1 text-xs font-bold text-[#5b21b6] mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#5b21b6]" />
              <span>Instant Online Disbursal • 30+ Partner Banks</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              {page.heroTitle || page.title || `${page.loanType} in India`}{" "}
              <span className="bg-linear-to-r from-[#5b21b6] via-[#7c3aed] to-[#2563eb] bg-clip-text text-transparent block sm:inline">
                {range.rateBadge}
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 text-base sm:text-lg font-medium leading-relaxed text-slate-600 max-w-2xl">
              {page.heroDescription ||
                page.subtitle ||
                `Compare low-interest ${page.loanType.toLowerCase()} offers from India’s leading banks & NBFCs with zero branch visits and paperless approval.`}
            </p>

            {/* 4 Feature Value Chips */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 max-w-xl text-xs sm:text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/70 p-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#5b21b6] shrink-0" />
                <span>{range.amountBadge}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/70 p-2.5">
                <Clock className="h-4 w-4 text-[#5b21b6] shrink-0" />
                <span>Sanction in 24 Hours</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/70 p-2.5">
                <Percent className="h-4 w-4 text-[#5b21b6] shrink-0" />
                <span>Zero Hidden Fees*</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/70 p-2.5">
                <ShieldCheck className="h-4 w-4 text-[#5b21b6] shrink-0" />
                <span>No Credit Score Impact</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href={applyHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b21b6] px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#4c1d95] hover:shadow-lg active:scale-98 no-underline text-center"
              >
                <span>Apply for {page.loanType}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#loan-emi-calculator"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-2xs transition-all hover:border-[#5b21b6] hover:bg-purple-50/50 hover:text-[#5b21b6] no-underline text-center"
              >
                <span>Calculate Monthly EMI</span>
              </a>
            </div>

            {/* Micro Trust Points */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-[#5b21b6]" />
                30+ Regulated Lenders
              </span>
              <span className="flex items-center gap-1.5">
                <UsersRound className="h-4 w-4 text-[#5b21b6]" />
                2M+ Borrowers
              </span>
              <span className="flex items-center gap-1.5">
                <LockKeyhole className="h-4 w-4 text-[#5b21b6]" />
                256-Bit SSL Encrypted
              </span>
            </div>
          </div>

          {/* RIGHT 5-COL: Live Interactive Loan Estimator Launcher */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border border-purple-100 bg-linear-to-br from-[#faf5ff] via-white to-[#f0f9ff] p-6 sm:p-7 shadow-md">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3 mb-5">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Quick {page.loanType} Estimator
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    Real-time indicative installment preview
                  </p>
                </div>
                <span className="rounded-full bg-purple-100 px-2.5 py-1 text-[11px] font-bold text-[#5b21b6]">
                  {range.rate}% p.a.
                </span>
              </div>

              {/* Amount Slider */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Required Loan Amount</span>
                  <span className="text-[#5b21b6] font-extrabold text-sm tabular-nums">
                    {fmtCurrency(amount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={range.minAmount}
                  max={range.maxAmount}
                  step={range.stepAmount}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-slate-200 accent-[#5b21b6] cursor-pointer"
                  aria-label="Required Loan Amount"
                />
                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  <span>{fmtShort(range.minAmount)}</span>
                  <span>{fmtShort(range.maxAmount)}</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Repayment Period</span>
                  <span className="text-[#5b21b6] font-extrabold text-sm tabular-nums">
                    {tenureYears} {tenureYears === 1 ? "Year" : "Years"} ({tenureYears * 12} Mos)
                  </span>
                </div>
                <input
                  type="range"
                  min={range.minTenure}
                  max={range.maxTenure}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-slate-200 accent-[#5b21b6] cursor-pointer"
                  aria-label="Repayment Period"
                />
                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  <span>{range.minTenure} Yr</span>
                  <span>{range.maxTenure} Yrs</span>
                </div>
              </div>

              {/* Live Output Box */}
              <div className="rounded-2xl bg-white border border-purple-100/80 p-4 shadow-2xs mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Estimated Monthly EMI
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#5b21b6] tabular-nums">
                      {fmtCurrency(emiCalc.emi)}
                      <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Total Repayable
                    </span>
                    <div className="text-sm font-bold text-slate-700 tabular-nums">
                      {fmtCurrency(emiCalc.total)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Direct Button */}
              <Link
                href={`/eligibility-results?product=loan&loanType=${page.loanTypeSlug}&amount=${amount}&tenureYears=${tenureYears}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5b21b6] py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-[#4c1d95] active:scale-98 no-underline"
              >
                <span>Check Eligibility for {fmtShort(amount)}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
