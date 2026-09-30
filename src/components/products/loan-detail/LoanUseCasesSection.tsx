"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getProductContentConfig } from "@/data/productSpecificContent";

interface LoanUseCasesSectionProps {
  productSlug?: string;
  applyHref?: string;
}

export function LoanUseCasesSection({
  productSlug = "personal-loan",
  applyHref = "/eligibility-results?product=loan&loanType=personal-loan",
}: LoanUseCasesSectionProps) {
  const config = getProductContentConfig(productSlug);
  const useCasesDetailed = config.useCases;

  return (
    <section
      id="life-goals"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="relative w-full bg-white py-16 sm:py-24 border-b border-gray-100"
      aria-label={`${config.title} Solutions`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Editorial Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-gray-950 leading-[1.15]">
            {config.useCasesTitle}{" "}
            <span className="bg-gradient-to-r from-[#6424C7] to-purple-600 bg-clip-text text-transparent font-normal">
              {config.useCasesSubtitle}
            </span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[17px] text-gray-600 font-normal leading-relaxed">
            Discover flexible borrowing options tailored specifically for {config.title}. Review detailed features, max limits, interest ranges, and customized advantages below.
          </p>
        </div>

        {/* Detailed One-by-One Presentation */}
        <div className="space-y-20 sm:space-y-28">
          {useCasesDetailed.map((uc, index) => {
            const isEven = index % 2 === 1;

            return (
              <div
                key={uc.id}
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
                      src={uc.image}
                      alt={uc.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />

                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex items-center justify-between rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2.5 text-white select-none">
                      <div>
                        <span className="block text-[10px] uppercase font-normal text-white/70 tracking-wider">
                          Max Amount
                        </span>
                        <span className="text-sm sm:text-base font-normal text-white">
                          {uc.amount}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-normal text-white/70 tracking-wider">
                          Starting Rate
                        </span>
                        <span className="text-sm sm:text-base font-normal text-yellow-300">
                          {uc.rate}
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
                  {/* Category eyebrow badge removed */}

                  <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-gray-950 leading-snug">
                    {uc.headline}
                  </h3>

                  <p className="mt-4 text-[14.5px] sm:text-[15.5px] leading-relaxed text-gray-600 font-normal">
                    {uc.desc}
                  </p>

                  <div className="mt-6 space-y-2.5">
                    {uc.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-[13.5px] sm:text-[14px] text-gray-700 font-normal">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <Link
                      href={`${applyHref}&usecase=${uc.id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#6424C7] hover:bg-[#521eb0] text-white font-normal text-xs px-4 py-2.5 shadow-sm transition-all active:scale-98"
                    >
                      <span>Check Eligibility</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <span className="text-xs text-gray-500 font-normal">
                      Assisted Application
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
