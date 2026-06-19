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
          <h1 className="text-3xl mt-8 md:mt-10 font-extrabold leading-[1.15] tracking-tight text-[#111625] sm:text-5xl md:text-6xl">
            Check Free <span className="text-[#12b76a]">Credit Score</span>
            <span className="block font-extrabold mt-0.5 text-[#111625]">
              & CIBIL Report
            </span>
          </h1>

          <p className="mt-3 max-w-lg text-[14px] md:text-[15px] font-medium leading-relaxed text-gray-500/90">
            Get Instant access to your credit health report from CIBIL and
            Experian, Accurate, fast and 100% free
          </p>

          {/* Trust Value Badges Row Alignment */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 items-center">
            <div className="flex items-center gap-2">
              <div className="text-blue-600 shrink-0">
                <BadgeCheck className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-gray-800 leading-tight">
                  100% Free
                </span>
                <span className="text-[11px] font-medium text-gray-400 mt-0.5">
                  No hidden charges
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-blue-600 shrink-0">
                <LockKeyhole className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-gray-800 leading-tight">
                  Secure & Safe
                </span>
                <span className="text-[11px] font-medium text-gray-400 mt-0.5">
                  Your Data is Protected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-blue-600 shrink-0">
                <Clock className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-gray-800 leading-tight">
                  Instant Result
                </span>
                <span className="text-[11px] font-medium text-gray-400 mt-0.5">
                  Your Data is Protected
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
