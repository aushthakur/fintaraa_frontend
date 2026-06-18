"use client";

import Link from "next/link";
// import Image from "next/image";
import { Gift, ShieldCheck } from "lucide-react";

export function CreditCardsHero() {
  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-4 pb-8 pt-8 md:px-6 lg:px-8">
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
      <div className="mx-auto grid max-w-9xl gap-4 md:grid-cols-[1.3fr_0.7fr] md:items-center">
        {/* LEFT CONTAINER: HERO COPY */}
        <div className="relative z-10 space-y-6">
          <div className="max-w-xl">
            <div className="relative">
              {/* Dynamic Asset Slot */}
              {/* <div className="absolute h-24 w-56 rotate-12 md:rotate-0 sm:h-36 sm:w-64 -left-2 sm:-left-16 md:-left-10 -top-4 md:top-0">
                <Image
                  src="/assets/images/credit-gauge.png"
                  alt="Credit Score Meter Gauge"
                  fill
                  unoptimized
                  priority
                  className="object-contain object-left"
                />
              </div> */}
              <h1 className="max-w-2xl text-[38px] font-black leading-tight tracking-[-0.03em] text-[#111827] md:text-[52px]">
                <span className="text-[#005ca8]">Find the Best Credit</span>
                <br />
                Cards for Your Lifestyle
              </h1>
              <p className="mt-5 max-w-xl text-[17px] font-medium leading-7 text-[#667085]">
                Find the perfect card for cashback, travel, fuel savings,
                rewards and more from top banks.
              </p>
              <Link
                href="/login?product=credit-card"
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-[#13a653] px-7 text-[14px] font-black text-white no-underline"
              >
                Apply Health Insurance
                <Gift className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-r-8 border-b-8 border-[#005ca8] bg-white p-5 shadow-[0_10px_26px_rgba(0,92,168,0.12)]">
          <h2 className="text-[21px] font-black text-[#111827]">
            Check your Card offers
          </h2>
          <p className="mt-1 text-[12px] font-semibold text-[#8b95a3]">
            Get personalized card suggestions.
          </p>
          <form className="mt-4 grid grid-cols-2 gap-3">
            {[
              "Full Name",
              "Mobile Number",
              "Monthly Income",
              "Employment Type",
            ].map((label, index) => (
              <label key={label} className="grid gap-1 min-w-0">
                <span className="text-[11px] font-bold text-[#374151]">
                  {label}
                </span>
                {index > 1 ? (
                  <select className="h-10 w-full border border-[#d9dfe8] bg-white px-3 text-[12px] font-semibold text-[#8b95a3] outline-none">
                    <option>Select Type</option>
                  </select>
                ) : (
                  <input className="h-10 w-full border border-[#d9dfe8] px-3 text-[12px] outline-none" />
                )}
              </label>
            ))}
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#13a653] px-4 text-[12px] font-extrabold text-white"
            >
              Unlock card offers
            </button>
          </form>
          <p className="mt-6 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#667085]">
            <ShieldCheck className="h-4 w-4 text-[#13a653]" />
            100% secure. No impact on credit score.
          </p>
        </div>
      </div>
    </section>
  );
}
