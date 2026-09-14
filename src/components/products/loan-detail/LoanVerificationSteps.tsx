"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { getApplyHref } from "@/components/application/flowRegistry";
import type { LoanSeoPageData } from "@/services/loanSeoPages";

// Explicit step objects mapped directly from the image blueprint
const sequentialSteps = [
  {
    stepNumber: "Step- 01",
    title: "Share Basic Details",
    description: "Enter your mobile number, profile details, and requirement.",
  },
  {
    stepNumber: "Step- 02",
    title: "Verify Mobile OTP",
    description: "Confirm the secure OTP sent to your registered mobile number.",
  },
  {
    stepNumber: "Step- 03",
    title: "Review Eligible Options",
    description: "Check partner options matched to your profile and location.",
  },
  {
    stepNumber: "Step- 04",
    title: "Submit Documents",
    description: "Upload required documents and continue with assisted follow-up.",
  },
];

export function LoanVerificationSteps({
  page,
  embedded = false,
}: {
  page: LoanSeoPageData;
  embedded?: boolean;
}) {
  const applyHref = getApplyHref({
    category: "loan",
    productSlug: page.loanTypeSlug,
    referrer: page.canonicalPath || `/products/${page.loanTypeSlug}`,
  });

  if (embedded) {
    return (
      <div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          {sequentialSteps.map((item, index) => (
            <article
              key={item.stepNumber}
              className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs transition-all hover:border-purple-200 hover:shadow-xs"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5b21b6] text-xs font-extrabold text-white shadow-2xs">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Step {index + 1}
                </p>
                <h3 className="mt-0.5 text-sm font-normal text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6">
          <AuthRedirectLink
            href={applyHref}
            productSlug={page.loanTypeSlug}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5b21b6] px-5 text-xs font-normal text-white no-underline shadow-xs transition-all hover:bg-[#4c1d95] active:scale-[0.98]"
          >
            Start {page.loanType} Application
            <ArrowRight className="h-3.5 w-3.5" />
          </AuthRedirectLink>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto bg-white px-4 py-12 antialiased text-slate-900 md:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        
        {/* LEFT CONTAINER: VERIFICATION STEPS MATRICES */}
        <div className="space-y-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3.5 py-1 text-xs font-normal text-[#5b21b6] border border-purple-100 mb-2.5">
              Quick 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Steps to Apply for {page.loanType}
            </h2>
            <p className="mt-1.5 text-sm font-medium text-slate-500">
              Follow a simple assisted digital journey from profile assessment to instant partner sanction.
            </p>
          </div>

          {/* Steps Presentation Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {sequentialSteps.map((item, index) => (
              <div 
                key={item.stepNumber} 
                className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all hover:border-purple-200 hover:shadow-xs"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5b21b6] text-xs font-extrabold text-white shadow-2xs">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Text Content Stack */}
                <div className="space-y-0.5">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {item.stepNumber}
                  </span>
                  <h4 className="text-sm font-normal text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Capsule CTA redirection block */}
          <div className="pt-2">
            <AuthRedirectLink
              href={applyHref}
              productSlug={page.loanTypeSlug}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#5b21b6] px-6 text-sm font-normal text-white transition-all hover:bg-[#4c1d95] active:scale-[0.98] no-underline shadow-xs hover:shadow-md"
            >
              Apply for {page.loanType}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </AuthRedirectLink>
          </div>
        </div>

        {/* RIGHT CONTAINER: DESIGN MOCKUP BACKGROUND ILLUSTATION */}
        <div className="relative w-full flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            <Image
              src="/assets/refer/boy.png"
              alt="Fintaraa simple 4-step verification journey"
              width={480}
              height={440}
              priority
              unoptimized
              className="object-contain w-full h-auto"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
