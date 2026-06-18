"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, LockKeyhole, ShieldCheck } from "lucide-react";
import type { BankSeoPageData } from "@/services/bankSeoPages";

export function BankHeroSection({ page }: { page: BankSeoPageData }) {
  return (
    <section className="relative overflow-hidden bg-white px-4 pb-12 pt-10 md:px-6 lg:px-8 font-sans">
      {/* Decorative Top-Left Background Accent Plates matching image_ef0600.png */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#e8f3ff] opacity-75 rounded-br-full -z-10" />
      <div className="absolute top-10 left-0 w-16 h-16 bg-[#d9e9fc] opacity-50 rounded-br-full -z-10" />

      <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* LEFT COMPARTMENT: Brand Details & Product Meta Info */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
            {/* Bank Identity Branding Block */}
            <div className="flex flex-col gap-1 shrink-0">
              {page.logoUrl ? (
                <div className="relative w-45 h-11">
                  <Image
                    src={page.logoUrl}
                    alt={page.bankName}
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              ) : (
                <span className="text-[20px] font-black text-[#005ca8]">
                  {page.bankName}
                </span>
              )}
              <span className="text-[11px] text-[#718096] font-medium tracking-wide pl-0.5">
                We understand your world
              </span>
            </div>

            {/* Split Title Stack & Dynamic Context Badges */}
            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-[36px] md:text-[46px] font-black leading-[1.1] text-[#005ca8] tracking-tight">
                  {page.bankName} {page.productName}
                </h1>
                <span className="bg-[#eaf3fc] text-[#005ca8] text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap self-start mt-2">
                  Trusted Partner
                </span>
              </div>
            </div>
          </div>

          {/* Descriptive Content Section */}
          <p className="text-[16px] md:text-[18px] font-medium text-[#2d3142] tracking-normal">
            Instant Personal Loans from India&apos;s Leading Private Bank
          </p>

          {/* Structured Informational Meta Icons Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-[#f0f4f8]">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-[#005ca8] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-[13px] font-bold text-[#1a1d24]">
                  Quick Approval
                </h4>
                <p className="text-[11px] font-medium text-[#8a94a6] mt-0.5">
                  In 24 hrs
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <LockKeyhole className="h-5 w-5 text-[#005ca8] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-[13px] font-bold text-[#1a1d24]">
                  Attractive Interest Rates
                </h4>
                <p className="text-[11px] font-medium text-[#8a94a6] mt-0.5">
                  Starts from 10.50% p.a.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock3 className="h-5 w-5 text-[#005ca8] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-[13px] font-bold text-[#1a1d24]">
                  Loan Amount
                </h4>
                <p className="text-[11px] font-medium text-[#8a94a6] mt-0.5">
                  ₹50,000 - ₹40 Lakh
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock3 className="h-5 w-5 text-[#005ca8] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-[13px] font-bold text-[#1a1d24]">
                  Paperless Process
                </h4>
                <p className="text-[11px] font-medium text-[#8a94a6] mt-0.5">
                  100% Online
                </p>
              </div>
            </div>
          </div>

          {/* Core Navigation Conversion Controls Trigger Wrapper */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link
              href={`/login?product=${page.productSlug || "personal-loan"}&bank=${page.bankSlug || "hdfc"}`}
              className="inline-flex h-12 w-full sm:w-56 items-center justify-center rounded-xl bg-[#13a653] hover:bg-[#108e46] text-[15px] font-bold text-white no-underline shadow-xs transition-colors"
            >
              Apply Now
            </Link>
            <Link
              href={`/login?product=${page.productSlug || "personal-loan"}&bank=${page.bankSlug || "hdfc"}`}
              className="inline-flex h-12 w-full sm:w-56 items-center justify-center rounded-xl border border-[#13a653] bg-white text-[15px] font-bold text-[#13a653] hover:bg-[#f4fbf7] no-underline transition-colors"
            >
              Check Eligibility
            </Link>
          </div>
        </div>

        {/* RIGHT COMPARTMENT: Elevated Illustration Background Radial Container */}
        <div className="relative flex min-h-65 md:min-h-80 items-center justify-center bg-[radial-gradient(circle,#edf4fd_0%,rgba(255,255,255,0)_70%)]">
          <div className="relative scale-105 w-full h-60 md:h-70">
            <Image
              src="/assets/images/coin-bag.png"
              alt={page.title || "Hero Banner Illustration"}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
