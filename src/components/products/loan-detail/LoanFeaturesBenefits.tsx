"use client";

import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  LockKeyhole,
  Percent,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  UsersRound,
  Zap,
} from "lucide-react";
import type { LoanSeoPageData, LoanSeoTab } from "@/services/loanSeoPages";

const coreFeatures = [
  {
    icon: Coins,
    title: "High Sanction Limits Up to ₹1 Crore",
    desc: "Access substantial capital tailored to your corporate tier and income profile. Whether funding large turnkey home renovations, medical treatments, or debt consolidation, borrow up to ₹1 Crore without artificial ceiling restrictions.",
    highlight: "Up to ₹1 Cr Collateral-Free",
    accent: "#6424C7",
  },
  {
    icon: TrendingDown,
    title: "Lowest Starting Rates from 10.49%* p.a.",
    desc: "Benefit from true monthly reducing balance interest calculations. Unlike deceptive flat-rate structures, your interest charges reduce every month as your principal amortizes, saving you tens of thousands in borrowing costs.",
    highlight: "Reducing Balance Rate",
    accent: "#0ea5e9",
  },
  {
    icon: Clock,
    title: "Flexible Tenures from 1 to 7 Years",
    desc: "Select a comfortable repayment horizon from 12 months to 84 months (7 years). Align your monthly installment with your income flow, ensuring your Fixed Obligation to Income Ratio (FOIR) stays healthy.",
    highlight: "12 to 84 Months",
    accent: "#10b981",
  },
  {
    icon: Zap,
    title: "100% Paperless Digital Sanction in 24 Hours",
    desc: "Complete your entire borrowing application from your phone or desktop. With government-backed DigiLocker e-KYC and RBI-licensed Account Aggregator banking integration, funds are disbursed within 24 hours.",
    highlight: "Same-Day Disbursal",
    accent: "#f59e0b",
  },
  {
    icon: LockKeyhole,
    title: "Zero Collateral or Hypothecation",
    desc: "Enjoy complete peace of mind with 100% unsecured financing. You never need to pledge gold jewelry, residential property deeds, mutual fund units, or arrange third-party personal guarantors.",
    highlight: "100% Unsecured",
    accent: "#6424C7",
  },
  {
    icon: ShieldCheck,
    title: "Zero CIBIL Impact Soft Check",
    desc: "Discover your exact pre-approved loan amounts and interest rates across 50+ lenders without damaging your credit profile. Our initial eligibility matching performs only a soft credit check.",
    highlight: "Soft Inquiry Only",
    accent: "#0ea5e9",
  },
  {
    icon: Percent,
    title: "Part-Payment & Foreclosure Freedom",
    desc: "Pay off your loan early whenever you receive annual bonuses, appraisal increments, or financial windfalls. Enjoy zero foreclosure and zero prepayment penalties with select partner banks after 12 EMIs.",
    highlight: "Zero Lock-In Options",
    accent: "#10b981",
  },
  {
    icon: UsersRound,
    title: "Multi-Lender Choice from 50+ Banks & NBFCs",
    desc: "Compare offers from India's most trusted institutions—HDFC, ICICI, SBI, Axis, Kotak, IDFC FIRST, Bajaj Finserv, and more—all within a single transparent dashboard with dedicated assisted support.",
    highlight: "50+ RBI Lenders",
    accent: "#f59e0b",
  },
];

export function LoanFeaturesBenefits({
  page,
}: {
  page: LoanSeoPageData;
}) {
  return (
    <section
      id="features"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="relative w-full bg-white py-16 sm:py-24 border-b border-gray-100"
      aria-label="Features and Benefits of Personal Loan"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-gray-950 leading-[1.15]">
            Key Features &amp; Benefits of Our{" "}
            <span className="bg-gradient-to-r from-[#6424C7] to-purple-600 bg-clip-text text-transparent font-normal">
              Personal Loan
            </span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[17px] text-gray-600 font-normal leading-relaxed">
            Engineered for modern Indian professionals and business owners. Compare transparent rates, zero-collateral limits up to ₹1 Crore, and rapid 24-hour disbursal with no hidden terms.
          </p>
        </div>

        {/* Borderless, Detailed Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {coreFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="flex flex-col justify-between py-2 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${feat.accent}14`,
                        color: feat.accent,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-normal text-gray-950 tracking-tight leading-snug">
                    {feat.title}
                  </h3>

                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-gray-600 font-normal">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
