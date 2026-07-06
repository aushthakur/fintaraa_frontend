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

export function LoanVerificationSteps({ page }: { page: LoanSeoPageData }) {
  const applyHref = getApplyHref({
    category: "loan",
    productSlug: page.loanTypeSlug,
    referrer: page.canonicalPath || `/products/${page.loanTypeSlug}`,
  });

  return (
    <section className="w-full max-w-9xl mx-auto bg-white px-6 py-12 antialiased text-[#111827] sm:px-8 md:px-12 lg:px-16">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        
        {/* LEFT CONTAINER: VERIFICATION STEPS MATRICES */}
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Steps to Apply for {page.loanType}
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-400">
              Follow a simple assisted process from profile check to partner
              review.
            </p>
          </div>

          {/* Steps Presentation Grid mapping the layout rules inside image_06651e.png */}
          <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {sequentialSteps.map((item) => (
              <div key={item.stepNumber} className="flex items-start gap-2">
                
                {/* Custom layout drawing mimicking the smartphone asset boxes */}
                <div >
                    <Image 
                      src={`/assets/refer/phone.png`}
                      alt={item.stepNumber}
                      width={24}
                      height={24}
                      priority
                      unoptimized
                      className="object-contain w-full h-14"
                    />
                    <span className="text-xs  flex justify-center font-bold text-center ms-6 text-gray-400">
                      {item.stepNumber.split("-")[1]}
                    </span>
                </div>

                {/* Text Content Stack */}
                <div className="space-y-1">
                  <span className="block text-xs font-bold text-gray-400">
                    {item.stepNumber}
                  </span>
                  <h4 className="text-[15px] font-bold tracking-tight text-gray-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs font-medium text-gray-400 leading-normal">
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
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full  bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-6 text-sm font-bold text-white transition-all hover:bg-[#009948] active:scale-[0.99] no-underline shadow-sm"
            >
              Apply for {page.loanType}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </AuthRedirectLink>
          </div>
        </div>

        {/* RIGHT CONTAINER: DESIGN MOCKUP BACKGROUND ILLUSTATION */}
        <div className="relative w-full flex items-center justify-center lg:justify-end">
          <div className="relative w-full  aspect-square flex items-center justify-center">
            <Image
              src="/assets/refer/boy.png"
              alt="Fintaraa simple 4-step verification journey"
              width={480}
              height={440}
              priority
              unoptimized
              className="object-contain w-full h-auto "
            />
          </div>
        </div>

      </div>
    </section>
  );
}
