"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Star,
  ArrowRight,
} from "lucide-react";

const bureauLogos = [
  { label: "Experian", color: "text-[#7c3aed]" },
  { label: "CRIF HIGH MARK", color: "text-[#1e40af]" },
  { label: "EQUIFAX", color: "text-[#b91c1c]" },
  { label: "CIBIL", color: "text-[#0284c7]" },
];

export function CreditScoreSection() {
  return (
    <section
      id="credit-score"
      className="scroll-mt-20 bg-white py-6 sm:py-8"
      aria-label="Check your credit score"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2e1065] via-[#3b0764] to-[#4c1d95] p-5 sm:p-7 text-white shadow-md">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            {/* Left: 7 Cols */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-[#ddd6fe]">
                <ShieldCheck className="h-3 w-3 text-[#a78bfa]" />
                Official Bureau Partner Data
              </div>

              <h2 className="mt-2.5 text-[22px] font-semibold leading-tight sm:text-[28px] md:text-[32px]">
                Know Your Credit Score.{" "}
                <span className="text-[#c4b5fd]">
                  Know Your Financial Power.
                </span>
              </h2>

              <p className="mt-1.5 max-w-lg text-[13px] font-normal leading-relaxed text-white/80 sm:text-[14px]">
                Check your score across authorized credit bureaus for free. Uncover insights to secure lower loan interest rates.
              </p>

              {/* Bureau Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {bureauLogos.map((bureau) => (
                  <span
                    key={bureau.label}
                    className="flex h-6.5 items-center rounded-md bg-white/95 px-2 text-[10px] font-semibold tracking-tight"
                  >
                    <span className={bureau.color}>{bureau.label}</span>
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/cibil-score"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[13px] font-medium text-[#4c1d95] shadow-sm transition hover:bg-[#f5f3ff] active:scale-[0.98]"
                >
                  Check Credit Score
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <div className="flex items-center gap-1.5 text-[12px] font-medium text-white/80">
                  <Star className="h-3.5 w-3.5 fill-[#facc15] text-[#facc15]" />
                  <span>100% Free • No Impact on Score</span>
                </div>
              </div>
            </div>

            {/* Right: 5 Cols (CIBIL Image - Responsive Scale, touching bottom on mobile) */}
            <div className="relative flex items-end justify-center lg:col-span-5 lg:items-center lg:justify-end -mb-5 -mx-2 sm:mx-0 sm:-my-7 sm:-mr-4 lg:-mr-7 pt-2 sm:pt-3 lg:py-0">
              <div className="relative w-full h-[220px] sm:h-[380px] lg:h-[420px] flex items-end justify-center lg:items-center lg:justify-end">
                {/* Glow backdrop */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl pointer-events-none opacity-50"
                  style={{
                    background: "radial-gradient(circle at center, #8b5cf6 0%, transparent 70%)",
                    transform: "scale(1.5)",
                  }}
                  aria-hidden="true"
                />

                {/* CIBIL PNG Image - Responsive size, touching bottom on mobile */}
                <div className="relative w-full h-full transform scale-125 sm:scale-115 lg:scale-125 origin-bottom lg:origin-right filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                  <Image
                    src="/assets/loan-png/cibil.png"
                    alt="Know Your CIBIL Credit Score"
                    fill
                    unoptimized
                    className="object-contain object-bottom lg:object-right"
                    sizes="(max-width: 640px) 360px, (max-width: 1024px) 480px, 600px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
