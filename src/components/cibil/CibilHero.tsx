"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, LockKeyhole, Clock } from "lucide-react";

export function CibilHero() {
  const [mobileNumber, setMobileNumber] = useState("");

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
      <div className="relative z-10 mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-start w-full">
        {/* Left Section Grid Column - Top Aligned */}
        <div className="flex flex-col justify-start lg:pt-4 ps-10 mt-10">
          {/* Dynamic Asset Slot */}
          <div className="absolute h-36 w-64 -left-10 top-0">
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
          <h1 className="text-4xl mt-10 font-extrabold leading-[1.15] tracking-tight text-[#111625] sm:text-5xl md:text-6xl">
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

        <div className="w-full max-w-120 overflow-hidden rounded-b-lg border border-gray-200/80 bg-white shadow-[0_10px_32px_rgba(0,0,0,0.04)]">
          {/* Top Banner Ribbon Promo Bar */}
          <div className="bg-[#00529c] px-5 py-3.5 text-center">
            <p className="text-[13px] font-normal tracking-wide text-white">
              Check free credit score{" "}
              <span className="font-extrabold text-white">
                & Win up to ₹1 Lakh
              </span>
            </p>
          </div>

          {/* Main Content Area Wrapper Shell */}
          <div className="p-6 sm:p-8 pt-6">
            {/* Core Layout Titles */}
            <h2 className="text-[26px] font-bold tracking-tight text-[#222222]">
              Check Your Score Now
            </h2>
            <p className="text-[14px] font-medium text-gray-500 mt-1">
              Enter your number to receive an OTP
            </p>

            <form
              className="mt-6 flex flex-col"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Custom Mobile Input Frame containing exact icon architecture */}
              <div className="relative flex h-12.5 w-full items-center rounded-lg border border-gray-400 bg-white px-3.5 focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 transition-all">
                {/* Custom SVG Device Icon matching the exact rectangular silhouette in image_9f2bf0.png */}
                <div className="mr-3 flex h-5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-gray-700 bg-transparent p-0.5 relative">
                  <div className="h-0.5 w-0.5 rounded-full bg-gray-700 absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                </div>

                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full bg-transparent text-[15px] font-medium text-gray-800 placeholder-gray-400 outline-none"
                />
              </div>

              {/* Context Explanatory Subtext Nodes */}
              <p className="text-[13px] font-medium text-gray-600/90 mt-2.5 leading-normal">
                You will receive an OTP on mentioned number
              </p>

              <p className="text-[13px] font-medium text-gray-500 leading-relaxed mt-4">
                By logging in, you agree to the following Credit Report Terms of
                use an privacy policy.{" "}
                <Link
                  href="/terms"
                  className="text-[#00529c] font-semibold hover:underline"
                >
                  More
                </Link>
              </p>

              {/* Premium Pill-Shaped Action Trigger CTA Button */}
              <button
                type="submit"
                className="mt-6 flex h-13 w-full items-center justify-center rounded-full bg-[#1cbd5d] text-[16px] font-bold text-white transition-colors hover:bg-[#17a34f] active:scale-[0.995]"
              >
                Get Free Credit Score
              </button>

              {/* Co-Branded Compliance Divider Node Stack */}
              <div className="mt-8 flex flex-col items-center">
                {/* Horizontal Line featuring exact faded radial gradient ends */}
                <div className="relative w-full flex items-center justify-center">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                  <span className="relative bg-white px-3 text-[12px] font-bold text-gray-500 z-10">
                    Powered by
                  </span>
                </div>

                {/* Official Bureau Typography Representations and Subtexts Row */}
                <div className="mt-4 flex items-center gap-5 select-none">
                  {/* CIBIL Complex Logo Container */}
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[#008ccf] font-black text-[18px] tracking-tight">
                      CIBIL
                    </span>
                    <span className="text-[7px] font-bold text-gray-400 tracking-tighter uppercase -mt-0.5">
                      Part of TransUnion
                    </span>
                  </div>

                  {/* Experian Script Vector Box */}
                  <div className="flex items-center gap-1">
                    {/* Visual Circle Grid Cluster Mock icon element */}
                    <div className="grid grid-cols-2 gap-0.5 rotate-45 h-2.5 w-2.5 shrink-0">
                      <span className="h-1 w-1 rounded-full bg-indigo-500" />
                      <span className="h-1 w-1 rounded-full bg-pink-500" />
                      <span className="h-1 w-1 rounded-full bg-purple-500" />
                      <span className="h-1 w-1 rounded-full bg-blue-500" />
                    </div>
                    <span className="text-[#3b2b80] font-bold font-sans text-[15px] tracking-tight">
                      experian
                      <span className="text-blue-500 font-light">.</span>
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
