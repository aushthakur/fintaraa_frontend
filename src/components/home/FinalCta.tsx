"use client";

import Link from "next/link";
import { ArrowRight, Gauge, ShieldCheck, Star } from "lucide-react";

export function FinalCta() {
  return (
    <section className="bg-white py-6 sm:py-8" aria-label="Get started with Fintaraa">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] px-5 py-7 text-center text-white shadow-lg sm:px-8 sm:py-9">
          {/* Subtle atmospheric glow */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#5b21b6]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[#0d9488]/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#ddd6fe]">
              <ShieldCheck className="h-3 w-3 text-[#a78bfa]" />
              Smart Financial Platform
            </div>

            <h2 className="mt-3 text-[22px] font-extrabold tracking-tight sm:text-[28px] md:text-[32px]">
              Your Next Financial Decision Starts Here.
            </h2>

            <p className="mt-2 text-[13px] font-medium leading-relaxed text-slate-300 sm:text-[14.5px]">
              Compare loans, credit cards and insurance, check your credit score, and make smarter decisions with zero impact on your score.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row sm:items-center">
              <Link
                href="/products?category=Loans"
                className="inline-flex h-10.5 items-center justify-center gap-2 rounded-xl bg-[#5b21b6] px-6 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#4c1d95] active:scale-[0.98]"
              >
                Explore Loans & Offers
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/cibil-score"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 text-[14px] font-bold text-white backdrop-blur-xs transition duration-200 hover:scale-[1.02] hover:bg-white/20 active:scale-[0.98]"
              >
                <Gauge className="h-4 w-4 text-[#a78bfa]" />
                Check Free Credit Score
              </Link>
            </div>

            <div className="mt-7 flex items-center justify-center gap-2 text-[12px] font-medium text-slate-400">
              <Star className="h-3.5 w-3.5 fill-[#facc15] text-[#facc15]" />
              <span>Trusted by 2M+ customers across India • 100% paperless process</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
