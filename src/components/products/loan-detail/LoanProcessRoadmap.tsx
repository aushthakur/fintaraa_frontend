"use client";

import Link from "next/link";
import {
  FileCheck,
  Scale,
  Zap,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";

interface LoanProcessRoadmapProps {
  productName?: string;
  applyHref?: string;
}

const steps = [
  {
    step: "01",
    title: "Check Pre-Approved Offers",
    desc: "Share basic details (mobile, PAN & income) to view personalized loan quotes from 50+ lenders in under 2 minutes.",
    icon: FileCheck,
    tag: "2 Mins • Soft Check",
    accent: "#6424C7",
    bg: "rgba(100,36,199,0.08)",
    highlight: "Zero Impact on CIBIL Score",
  },
  {
    step: "02",
    title: "Compare & Pick Best Rate",
    desc: "Compare interest rates starting from 10.49% p.a., transparent processing fees, and comfortable tenure options across top banks.",
    icon: Scale,
    tag: "Lowest Rates First",
    accent: "#0ea5e9",
    bg: "rgba(14,165,233,0.08)",
    highlight: "Zero Hidden Markups",
  },
  {
    step: "03",
    title: "Instant e-KYC & Fast Disbursal",
    desc: "Complete swift assisted digital verification and have funds credited directly into your verified bank account within 24 hours.",
    icon: Zap,
    tag: "Disbursal in 24 Hours",
    accent: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    highlight: "Direct Bank Transfer",
  },
];

export function LoanProcessRoadmap({
  productName = "Personal Loan",
  applyHref = "/eligibility-results?product=loan&loanType=personal-loan",
}: LoanProcessRoadmapProps) {
  return (
    <section
      id="loan-process-roadmap"
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#fafbfe] to-white py-14 sm:py-20"
      aria-label="How to get a personal loan in 3 steps"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 xl:px-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-tight text-gray-900 leading-tight">
            Get Your {productName} in{" "}
            <span style={{ color: "#6424C7" }}>3 Simple Steps</span>
          </h2>
          <p className="mt-3 text-[14.5px] sm:text-[16px] text-gray-500 font-normal max-w-xl mx-auto leading-relaxed">
            100% digital, assisted paperwork, and guaranteed transparency at every stage of your borrowing journey.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Subtle connecting line across desktop cards */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-1/3 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-purple-200 via-sky-200 to-emerald-200 -z-0"
          />

          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative z-10 flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-[0_2px_14px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#6424C7]/30 hover:shadow-[0_16px_36px_-8px_rgba(100,36,199,0.15)] hover:-translate-y-1.5"
              >
                <div>
                  {/* Step Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: item.bg }}
                    >
                      <Icon className="h-6 w-6" style={{ color: item.accent }} />
                    </div>
                    <span
                      className="text-[28px] font-extrabold tracking-tight opacity-30 group-hover:opacity-100 transition-opacity"
                      style={{ color: item.accent }}
                    >
                      {item.step}
                    </span>
                  </div>

                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold border mb-2.5"
                    style={{
                      backgroundColor: item.bg,
                      color: item.accent,
                      borderColor: `${item.accent}30`,
                    }}
                  >
                    {item.tag}
                  </span>

                  <h3 className="text-[18px] font-semibold text-gray-900 group-hover:text-[#6424C7] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[13px] leading-relaxed text-gray-500 font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Highlight Chip */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-[12px] font-medium text-gray-600">
                  <ShieldCheck className="h-4 w-4" style={{ color: item.accent }} />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href={applyHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-[14px] font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #6424C7, #9b5de5)" }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Start Your Instant 2-Minute Application</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
