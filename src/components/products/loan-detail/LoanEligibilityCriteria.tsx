"use client";

import { Building2, Briefcase, Scale } from "lucide-react";
import { getProductContentConfig } from "@/data/productSpecificContent";

export function LoanEligibilityCriteria({
  productSlug = "personal-loan",
}: {
  productSlug?: string;
}) {
  const config = getProductContentConfig(productSlug);
  const { column1, column2 } = config.eligibility;

  return (
    <section
      id="eligibility"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="relative w-full bg-[#fafbfe] py-16 sm:py-24 border-b border-gray-100"
      aria-label={`${config.title} Eligibility Criteria`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-gray-950 leading-[1.15]">
            {config.title}{" "}
            <span className="bg-gradient-to-r from-[#6424C7] to-purple-600 bg-clip-text text-transparent">
              Eligibility Criteria
            </span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[17px] text-gray-600 font-normal leading-relaxed">
            {config.eligibilitySubtitle} Review detailed parameters below to maximize your sanction limit for {config.title}.
          </p>
        </div>

        {/* 2-Column Editorial Criteria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Column 1 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200/80 pb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-[#6424C7]">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xl font-normal text-gray-950">
                  {column1.categoryTitle}
                </h3>
                <p className="text-xs text-gray-500 font-normal">
                  {column1.categorySubtitle}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-[14px] text-gray-700">
              {column1.items.map((item, idx) => (
                <div
                  key={item.label}
                  className={
                    idx !== column1.items.length - 1
                      ? "border-b border-gray-100 pb-3"
                      : ""
                  }
                >
                  <span className="block font-normal text-gray-900 mb-0.5">
                    {item.label}
                  </span>
                  <p className="text-gray-600 text-xs sm:text-[13.5px] font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200/80 pb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Briefcase className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xl font-normal text-gray-950">
                  {column2.categoryTitle}
                </h3>
                <p className="text-xs text-gray-500 font-normal">
                  {column2.categorySubtitle}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-[14px] text-gray-700">
              {column2.items.map((item, idx) => (
                <div
                  key={item.label}
                  className={
                    idx !== column2.items.length - 1
                      ? "border-b border-gray-100 pb-3"
                      : ""
                  }
                >
                  <span className="block font-normal text-gray-900 mb-0.5">
                    {item.label}
                  </span>
                  <p className="text-gray-600 text-xs sm:text-[13.5px] font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Credit Score (CIBIL) Tier Table */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-gray-200/80">
          <div className="max-w-2xl mb-8">
            <h3 className="text-2xl font-normal text-gray-950">
              Credit Score (CIBIL) Impact on Your {config.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
              Your bureau score is the primary metric lenders use to determine your interest rate and eligible loan ceiling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-l-2 border-emerald-500 pl-4 py-1">
              <span className="text-2xl font-normal text-emerald-600">750+</span>
              <h4 className="font-normal text-gray-900 text-sm mt-1">Prime Tier</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed font-normal">
                Instant approval, lowest rates from {config.range.rateBadge}, fee concessions, and maximum sanction ceiling.
              </p>
            </div>

            <div className="border-l-2 border-blue-500 pl-4 py-1">
              <span className="text-2xl font-normal text-blue-600">700 – 749</span>
              <h4 className="font-normal text-gray-900 text-sm mt-1">Good Tier</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed font-normal">
                High approval probability with prime banks at standard interest rates.
              </p>
            </div>

            <div className="border-l-2 border-amber-500 pl-4 py-1">
              <span className="text-2xl font-normal text-amber-600">650 – 699</span>
              <h4 className="font-normal text-gray-900 text-sm mt-1">Moderate Tier</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed font-normal">
                Approvals primarily through partner NBFCs and fintech lenders.
              </p>
            </div>

            <div className="border-l-2 border-red-500 pl-4 py-1">
              <span className="text-2xl font-normal text-red-500">&lt; 650</span>
              <h4 className="font-normal text-gray-900 text-sm mt-1">High Risk</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed font-normal">
                Secured asset collateral or co-applicant recommended for approval.
              </p>
            </div>
          </div>
        </div>

        {/* FOIR Calculation Guide Callout */}
        <div className="mt-12 rounded-3xl bg-white p-6 sm:p-8 border border-gray-100 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#6424C7]">
              <Scale className="h-5 w-5" />
            </span>
            <div>
              <h4 className="text-base sm:text-lg font-normal text-gray-950">
                Understanding FOIR (Fixed Obligation to Income Ratio)
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Lenders calculate your FOIR to verify you can comfortably afford your proposed EMI:
              </p>
              <div className="my-3 rounded-xl bg-slate-50 px-4 py-2.5 font-mono text-xs font-normal text-gray-800 inline-block">
                FOIR = (Total Monthly EMIs + Proposed New EMI) ÷ Net Monthly Income × 100
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Optimal Target: Keep your total FOIR below 50% for quick digital sanctions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
