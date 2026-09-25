"use client";

import Image from "next/image";
import { BadgeCheck, LockKeyhole, Clock } from "lucide-react";
import { CibilScoreChecker } from "./CibilScoreChecker";

export function CibilHero() {
  return (
    <section className="relative bg-white px-4 py-6 md:px-6 lg:px-8 overflow-hidden w-full h-auto min-h-125 flex items-center">
      {/* --- SCREENSHOT GEOMETRY BACKGROUND LAYER (image_9fa052.png) --- */}
      <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        {/* Left-most rectangle bleeding off the screen */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "55px",
            height: "90px",
            top: "-20px",
            left: "-15px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
        {/* Right parallel rectangle matching the screenshot position */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "60px",
            height: "120px",
            top: "-80px",
            left: "40px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
      </div>
      {/* ------------------------------------------------------------- */}

      {/* FIXED: Changed lg:items-center to lg:items-start to snap content to the top */}
      <div className="relative z-10 mx-auto grid max-w-9xl gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-start w-full">
        {/* Left Section Grid Column - Top Aligned */}
        <div className="flex flex-col justify-start lg:pt-4 ps-0 sm:ps-10 mt-4 sm:mt-10">
          {/* Dynamic Asset Slot */}
          <div className="absolute h-24 w-56 rotate-12 md:rotate-0 sm:h-36 sm:w-64 -left-2 sm:-left-16 md:-left-10 -top-4 md:top-0">
            <Image
              src="/assets/images/credit-gauge.png"
              alt="Credit Score Meter Gauge"
              fill
              unoptimized
              priority
              className="object-contain object-left"
            />
          </div>
          {/* Strict Typography Tracking Matching image_9fa052.png */}
          <h1 className="text-3xl mt-8 md:mt-10 font-light leading-[1.12] tracking-tight text-[#111625] sm:text-5xl md:text-6xl">
            Free <span className="text-[#5B21B6] font-normal">CIBIL Score</span>
            <span className="block font-normal mt-0.5 text-[#111625]">
              & Credit Health Report
            </span>
          </h1>

          <p className="mt-3 max-w-lg text-[14px] md:text-[15px] font-light leading-relaxed text-slate-500">
            Check your credit bureau score online with instant report breakdown, key score factors, and credit improvement guidance.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 items-center">
            <div className="flex items-center gap-2">
              <div className="text-[#5B21B6] shrink-0">
                <BadgeCheck className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-slate-800 leading-tight">
                  100% Free Check
                </span>
                <span className="text-[11px] font-light text-slate-400 mt-0.5">
                  No CIBIL score impact
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-[#5B21B6] shrink-0">
                <LockKeyhole className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-slate-800 leading-tight">
                  Encrypted & Secure
                </span>
                <span className="text-[11px] font-light text-slate-400 mt-0.5">
                  256-bit SSL protection
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-[#5B21B6] shrink-0">
                <Clock className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-slate-800 leading-tight">
                  Instant Verification
                </span>
                <span className="text-[11px] font-light text-slate-400 mt-0.5">
                  Real-time bureau report
                </span>
              </div>
            </div>
          </div>
        </div>

        <CibilScoreChecker />
      </div>
    </section>
  );
}
