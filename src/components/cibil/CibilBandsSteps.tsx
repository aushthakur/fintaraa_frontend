"use client";

import React from "react";
import Link from "next/link";

const bands = [
  { range: "750 - 900", label: "Excellent", text: "You are a low-risk borrower", color: "bg-[#00c800]", textColor: "text-[#00c800]" },
  { range: "650 - 749", label: "Good", text: "You are a reliable borrower", color: "bg-[#6be66b]", textColor: "text-[#59cc59]" },
  { range: "550 - 649", label: "Average", text: "You may face limited options", color: "bg-[#ffcc00]", textColor: "text-[#ffcc00]" },
  { range: "300 - 549", label: "Poor", text: "You are a high risk borrower", color: "bg-[#ff2b14]", textColor: "text-[#ff2b14]" },
];

const steps = [
  {
    step: "Step- 01",
    title: "Enter Your Mobile Number",
    text: "Enter your mobile number and basic details to get started.",
    visual: (
      <div className="relative flex items-center justify-center h-12 w-10 border-2 border-[#005ca8] rounded-md bg-white">
        <div className="absolute top-1.5 h-0.5 w-3 bg-gray-200 rounded-full" />
        <span className="text-[9px] font-bold text-[#005ca8] bg-white px-0.5 shadow-xs border border-gray-100 z-10 whitespace-nowrap">+91</span>
        <div className="absolute bottom-1 h-1 w-1 rounded-full bg-[#005ca8]" />
      </div>
    )
  },
  {
    step: "Step- 02",
    title: "Verify with OTP",
    text: "Enter the OTP sent to your phone to securely verify your number.",
    visual: (
      <div className="relative flex items-center justify-center h-12 w-10 border-2 border-[#005ca8] rounded-md bg-white">
        <div className="absolute top-1.5 h-0.5 w-3 bg-gray-200 rounded-full" />
        <span className="text-[10px] font-black text-[#005ca8] bg-white px-0.5 tracking-tighter z-10 whitespace-nowrap">****</span>
        <div className="absolute bottom-1 h-1 w-1 rounded-full bg-[#005ca8]" />
      </div>
    )
  },
  {
    step: "Step- 03",
    title: "Check Your CIBIL Score",
    text: "View your latest CIBIL score instantly and track updates regularly.",
    visual: (
      <div className="relative flex flex-col items-center justify-center h-12 w-10 border-2 border-[#005ca8] rounded-md bg-white p-1">
        <div className="h-4 w-7 rounded-t-full border border-b-0 border-gray-300 relative flex items-end justify-center overflow-hidden">
          <div className="h-3 w-0.5 bg-[#005ca8] origin-bottom rotate-20" />
        </div>
        <div className="absolute bottom-1 h-1 w-1 rounded-full bg-[#005ca8]" />
      </div>
    )
  },
];

export function CibilBandsSteps() {
  return (
    <>
      {/* SECTION 1: Understanding CIBIL Score (image_9f0afe.png) */}
      <section className="bg-white px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.01)] md:px-12">
          
          <h2 className="text-[28px] md:text-[34px] font-bold text-[#222222] tracking-tight">
            Understanding CIBIL Score
          </h2>
          <p className="mt-2.5 text-[14px] font-medium text-gray-500 max-w-md mx-auto leading-relaxed">
            CIBIL Score is a 3 digit number that represents your credit worthiness
          </p>

          <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {bands.map((item) => (
              <div key={item.range} className="flex flex-col items-start text-left w-full">
                {/* Block range display visual container */}
                <div className={`${item.color} w-full h-16 flex items-center justify-center text-[15px] font-bold text-black select-none rounded-2`}>
                  {item.range}
                </div>
                
                {/* Title and descriptive information labels stack underneath */}
                <h3 className={`mt-3 text-[14px] font-bold ${item.textColor} tracking-tight`}>
                  {item.label}
                </h3>
                <p className="mt-0.5 text-[13px] font-medium text-gray-500 leading-normal">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 2: Check CIBIL Score in 3 Easy Steps (image_9f0a44.png) */}
      <section className="bg-white px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          
          <h2 className="text-[32px] md:text-[38px] font-bold leading-tight tracking-tight text-[#222222]">
            Check Your <span className="text-[#00529c]">CIBIL Score</span>
            <span className="block mt-1 font-bold">in 3 Easy steps</span>
          </h2>

          {/* Cards Steps Block Framework Matrix Row Layout */}
          <div className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="flex flex-col items-start text-left w-full group">
                
                {/* Outer Upper Step Identifier Label Node */}
                <span className="text-[20px] font-bold text-gray-400/90 mb-2 tracking-tight block">
                  {item.step}
                </span>

                {/* Sub Card Component Body box layout */}
                <article className="w-full min-h-35 rounded-xl border border-gray-200 bg-white p-5 grid grid-cols-[110px_1fr] gap-4 items-center shadow-[0_2px_12px_rgba(0,0,0,0.005)]">
                  
                  {/* Left Hand Side Styled Graphic Viewport Frame Panel */}
                  <div className="h-full w-full rounded-lg bg-[#e8f4ff]/70 flex items-center justify-center min-h-25">
                    {item.visual}
                  </div>

                  {/* Right Hand Side Information Description Panel Grid Block */}
                  <div className="flex flex-col justify-center">
                    <h4 className="text-[14px] font-bold text-gray-900 leading-snug tracking-tight">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-[12px] font-medium text-gray-500 leading-normal">
                      {item.text}
                    </p>
                  </div>

                </article>

              </div>
            ))}
          </div>

          {/* Central Main Conversion CTA Button Link Block */}
          <div className="mt-12 flex justify-center">
            <Link
              href="/cibil-score/report"
              className="inline-flex h-12.5 items-center justify-center rounded-full bg-[#1cbd5d] px-10 text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-[#17a34f] gap-2"
            >
              <span>Get free credit score</span>
              <span className="text-[16px] font-normal">→</span>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}