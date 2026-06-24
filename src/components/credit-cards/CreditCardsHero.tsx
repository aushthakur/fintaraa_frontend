"use client";

import Image from "next/image";
import {
  BriefcaseBusiness,
  Gift,
  IndianRupee,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";

const inputClass =
  "h-11 w-full rounded-xl border border-[#d8e4f0] bg-[#f8fbff] px-3 text-[13px] font-bold text-[#1f2937] outline-none transition placeholder:text-[#9aa8b8] focus:border-[#005ca8] focus:bg-white focus:ring-2 focus:ring-[#e4f1ff]";

const selectClass =
  "h-11 w-full rounded-xl border border-[#d8e4f0] bg-[#f8fbff] px-3 text-[13px] font-bold text-[#1f2937] outline-none transition focus:border-[#005ca8] focus:bg-white focus:ring-2 focus:ring-[#e4f1ff]";

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
        <div className="relative z-10 flex flex-col justify-start ps-0 sm:ps-10 mt-4 sm:mt-10 lg:pt-4">
          <div className="relative max-w-2xl">
            <div className="absolute h-24 w-56 rotate-12  md:rotate-0 sm:h-36 sm:w-64 -left-2 sm:-left-16 md:-left-18 -top-4 md:-top-16">
              <Image
                src="/assets/images/credit-gauge.png"
                alt="Credit Score Meter Gauge"
                fill
                unoptimized
                priority
                className="object-contain object-left"
              />
            </div>
            <h1 className="max-w-2xl text-3xl mt-8 md:mt-10 font-extrabold leading-[1.15] tracking-tight text-[#111625] sm:text-5xl md:text-6xl">
              Find the Best Credit
              <span className="block text-[#005ca8]">Cards for Your Lifestyle</span>
            </h1>
            <p className="mt-3 max-w-lg text-[14px] md:text-[15px] font-medium leading-relaxed text-gray-500/90">
              Find the perfect card for cashback, travel, fuel savings,
              rewards and more from top banks.
            </p>
            <AuthRedirectLink
              href="/credit-cards"
              productSlug="credit-card"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-7 text-[14px] font-black text-white no-underline"
            >
              Apply for Credit Card
              <Gift className="h-4 w-4" />
            </AuthRedirectLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-100 md:mx-0">
          <div className="absolute inset-0 block translate-x-2 translate-y-2 rounded-[18px] bg-[#00529c] sm:translate-x-3 sm:translate-y-3" />

          <div className="relative rounded-[18px] border border-[#d9dfe8] bg-white p-5 shadow-[0_10px_26px_rgba(0,92,168,0.12)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[21px] font-black leading-tight text-[#111827]">
                  Check your card offers
                </h2>
                <p className="mt-1 text-[12px] font-semibold leading-5 text-[#667085]">
                  Get personalised suggestions from top banks.
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eef8ff] text-[#005ca8]">
                <Gift className="h-5 w-5" />
              </span>
            </div>

            <form className="mt-5 grid gap-3">
              <label className="grid gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-[0.08em] text-[#475467]">
                  Full Name
                </span>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                  <input
                    type="text"
                    placeholder="Enter name as per PAN"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </label>

              <label className="grid gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-[0.08em] text-[#475467]">
                  Mobile Number
                </span>
                <div className="flex h-11 overflow-hidden rounded-xl border border-[#d8e4f0] bg-[#f8fbff] transition focus-within:border-[#005ca8] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#e4f1ff]">
                  <span className="flex items-center border-r border-[#d8e4f0] bg-[#eef8ff] px-3 text-[13px] font-black text-[#005ca8]">
                    +91
                  </span>
                  <div className="relative min-w-0 flex-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      className="h-full w-full bg-transparent px-3 pl-10 text-[13px] font-bold text-[#1f2937] outline-none placeholder:text-[#9aa8b8]"
                    />
                  </div>
                </div>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-[11px] font-black uppercase tracking-[0.08em] text-[#475467]">
                    Monthly Income
                  </span>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 75,000"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </label>

                <label className="grid gap-1.5">
                  <span className="text-[11px] font-black uppercase tracking-[0.08em] text-[#475467]">
                    Employment Type
                  </span>
                  <div className="relative">
                    <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                    <select className={`${selectClass} pl-10`}>
                      <option value="">Select employment</option>
                      <option value="salaried">Salaried</option>
                      <option value="self-employed">Self-employed</option>
                      <option value="business-owner">Business owner</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                </label>
              </div>

              <button
                type="button"
                className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-4 text-[13px] font-extrabold text-white shadow-[0_10px_20px_rgba(18,183,106,0.18)] transition hover:brightness-105"
              >
                Unlock Card Offers
                <Gift className="ml-2 h-4 w-4" />
              </button>
            </form>
            <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-[#667085]">
              <ShieldCheck className="h-4 w-4 text-[#0fae5e]" />
              100% secure. Soft check only, no impact on credit score.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
