"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, LockKeyhole, ShieldCheck } from "lucide-react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { getApplyHref } from "@/components/application/flowRegistry";
import type { BankSeoPageData } from "@/services/bankSeoPages";
import { slugifyProduct } from "@/lib/productRouting";

export function BankHeroSection({ page }: { page: BankSeoPageData }) {
  const isBankOverview = Boolean(page.isBankOverview);
  const productSlug = slugifyProduct(page.productSlug || page.productName);
  const isCreditCardPage = productSlug.includes("credit-card");
  const applyHref = isCreditCardPage
    ? "/credit-cards"
    : getApplyHref({
        category: "loan",
        productSlug: page.productSlug || "personal-loan",
        bankSlug: page.bankSlug,
        referrer:
          page.canonicalPath || `/banks/${page.bankSlug}/${page.productSlug}`,
      });
  const stats =
    page.heroStats && page.heroStats.length
      ? page.heroStats.slice(0, 4)
      : [
          { label: "Quick Approval", value: "In 24 hrs" },
          { label: "Attractive Interest Rates", value: "Starts from 10.50% p.a." },
          { label: "Loan Amount", value: "₹50,000 - ₹40 Lakh" },
          { label: "Paperless Process", value: "100% Online" },
        ];
  const statIcons = [ShieldCheck, LockKeyhole, Clock3, Clock3];

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
                  {page.title || `${page.bankName} ${page.productName}`}
                </h1>
                <span className="bg-[#eaf3fc] text-[#005ca8] text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap self-start mt-2">
                  Trusted Partner
                </span>
              </div>
            </div>
          </div>

          {/* Descriptive Content Section */}
          <p className="text-[16px] md:text-[18px] font-medium text-[#2d3142] tracking-normal">
            {page.subtitle ||
              `${page.productName} from ${page.bankName} with assisted application support.`}
          </p>

          {/* Structured Informational Meta Icons Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-[#f0f4f8]">
            {stats.map((stat, index) => {
              const Icon = statIcons[index % statIcons.length];
              return (
                <div key={`${stat.label}-${index}`} className="flex items-start gap-2.5">
                  <Icon className="h-5 w-5 text-[#005ca8] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1a1d24]">
                      {stat.label}
                    </h4>
                    <p className="text-[11px] font-medium text-[#8a94a6] mt-0.5">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Core Navigation Conversion Controls Trigger Wrapper */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            {isBankOverview ? (
              <>
                <Link
                  href="#bank-products"
                  className="inline-flex h-12 w-full sm:w-56 items-center justify-center rounded-xl bg-[#13a653] hover:bg-[#108e46] text-[15px] font-bold text-white no-underline shadow-xs transition-colors"
                >
                  View Products
                </Link>
                <Link
                  href={`/eligibility-results?bank=${encodeURIComponent(page.bankName)}`}
                  className="inline-flex h-12 w-full sm:w-56 items-center justify-center rounded-xl border border-[#13a653] bg-white text-[15px] font-bold text-[#13a653] hover:bg-[#f4fbf7] no-underline transition-colors"
                >
                  Check Eligibility
                </Link>
              </>
            ) : (
              <>
                <AuthRedirectLink
                  href={applyHref}
                  productSlug={page.productSlug || "personal-loan"}
                  className="inline-flex h-12 w-full sm:w-56 items-center justify-center rounded-xl bg-[#13a653] hover:bg-[#108e46] text-[15px] font-bold text-white no-underline shadow-xs transition-colors"
                >
                  Apply Now
                </AuthRedirectLink>
                <AuthRedirectLink
                  href={applyHref}
                  productSlug={page.productSlug || "personal-loan"}
                  className="inline-flex h-12 w-full sm:w-56 items-center justify-center rounded-xl border border-[#13a653] bg-white text-[15px] font-bold text-[#13a653] hover:bg-[#f4fbf7] no-underline transition-colors"
                >
                  Check Eligibility
                </AuthRedirectLink>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COMPARTMENT: Elevated Illustration Background Radial Container */}
        <div className="relative flex min-h-65 md:min-h-80 items-center justify-center bg-[radial-gradient(circle,#edf4fd_0%,rgba(255,255,255,0)_70%)]">
          <div className="relative scale-105 w-full h-60 md:h-70">
            <Image
              src="/assets/images/coin-bag.png"
              alt={page.title || "Hero Banner Illustration"}
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
