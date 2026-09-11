"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";

const bureauLogos = [
  { label: "Experian", className: "text-purple-700" },
  { label: "CRIF HIGH MARK", className: "text-blue-800" },
  { label: "EQUIFAX", className: "text-red-700" },
  { label: "CIBIL", className: "text-sky-600" },
];

export function CreditScoreBanner() {
  return (
    <section className="bg-white px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#4c1d95] to-[#3b0764] shadow-[0_20px_60px_rgba(76,29,149,0.25)]">
          <div className="absolute inset-0 bg-[url('/assets/images/noise.png')] opacity-10 mix-blend-overlay" />
          <div className="grid items-stretch lg:grid-cols-[1.05fr_0.95fr] relative z-10">
            <div className="relative z-10 px-6 py-10 sm:px-10 lg:px-12 lg:py-16">
              <h2 className="max-w-2xl text-[28px] font-bold leading-tight text-white sm:text-[40px]">
                Check Your Credit Score in Minutes with{" "}
                <span className="text-[#c4b5fd]">Fintaraa</span>
              </h2>
              <div className="mt-5 grid max-w-xl gap-3 text-[15px] font-medium leading-6 text-white/80">
                {[
                  "Authorised credit bureau data",
                  "100% free and instant",
                  "No hard enquiry | No spam",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-[#a78bfa]" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-4 gap-3">
                {bureauLogos.map((logo) => (
                  <div
                    key={logo.label}
                    className="flex h-12 items-center justify-center rounded-xl bg-white/95 px-3 text-center shadow-sm backdrop-blur-md"
                  >
                    <span
                      className={`text-[10px] lg:text-[13px] font-bold leading-tight ${logo.className}`}
                    >
                      {logo.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/cibil-score"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-8 text-[15px] font-bold text-[#4c1d95] no-underline shadow-[0_8px_30px_rgba(255,255,255,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f5f3ff] hover:shadow-[0_12px_40px_rgba(255,255,255,0.3)]"
                >
                  Check Your Credit Score Now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <div className="flex items-center gap-2 text-[13px] font-medium text-white/90">
                  <Star className="h-4.5 w-4.5 fill-[#f8b400] text-[#f8b400]" />
                  Trusted by 5L+ users - 4.9/5
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block min-h-90 overflow-hidden bg-white sm:min-h-105">
              <Image
                src="/assets/images/hero1.png"
                alt="Customer checking financial health with Fintaraa"
                fill
                className="object-cover"
                unoptimized
              />
              {/* <div className="absolute inset-0 bg-linear-to-t from-white via-white/10 to-transparent" /> */}

              <div className="absolute left-4 top-5 rounded-2xl bg-white/90 p-4 backdrop-blur sm:left-5 sm:top-7">
                <div className="flex items-center gap-3">
                  <div className="relative h-24 w-32">
                    <Image
                      src="/assets/images/cibil-gauge-graphic.png"
                      alt="Credit score gauge"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-wide text-[#61748f]">
                      Your score
                    </p>
                    <p className="text-[36px] font-bold leading-none text-[#07162d] sm:text-[42px]">
                      782
                    </p>
                    <p className="mt-1 text-[13px] font-bold text-[#0f7a4d]">
                      Excellent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
