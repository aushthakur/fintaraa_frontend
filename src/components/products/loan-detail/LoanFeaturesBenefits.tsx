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
import type { LoanSeoPageData } from "@/services/loanSeoPages";
import { getProductContentConfig } from "@/data/productSpecificContent";

const defaultIcons = [Coins, TrendingDown, Clock, Zap, LockKeyhole, ShieldCheck, Percent, UsersRound];

export function LoanFeaturesBenefits({
  page,
}: {
  page: LoanSeoPageData;
}) {
  const config = getProductContentConfig(page.loanTypeSlug, page.loanType);
  const features = config.features;

  return (
    <section
      id="features"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="relative w-full bg-[#fafbfe] py-16 sm:py-24 border-b border-gray-100"
      aria-label={`Key Features and Benefits of ${page.loanType}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          {/* Eyebrow badge removed */}

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-gray-950 leading-[1.15]">
            Key Features &amp;{" "}
            <span className="bg-gradient-to-r from-[#6424C7] to-purple-600 bg-clip-text text-transparent">
              Benefits of {page.loanType}
            </span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[17px] text-gray-600 font-normal leading-relaxed">
            Experience transparent financing crafted for modern borrowers. Compare multi-lender offers, enjoy zero hidden charges, and track your application status digitally.
          </p>
        </div>

        {/* 8-Grid High-Contrast Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feat, index) => {
            const Icon = defaultIcons[index % defaultIcons.length];

            return (
              <div
                key={feat.title}
                className="group relative flex flex-col justify-between rounded-3xl bg-white p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-purple-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${feat.accent}15`,
                        color: feat.accent,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>

                    <span className="rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-normal text-gray-500 border border-gray-100">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-normal text-gray-950 tracking-tight leading-snug group-hover:text-[#6424C7] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="mt-3 text-[13.5px] leading-relaxed text-gray-600 font-normal">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs font-normal text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{feat.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
