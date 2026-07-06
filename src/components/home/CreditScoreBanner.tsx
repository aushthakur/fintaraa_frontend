"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Star, Zap } from "lucide-react";

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
        <div className="relative overflow-hidden rounded-2xl bg-[#eef6ff]">
          <div className="grid items-stretch lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
              <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-[#075cde]">
                <Zap className="h-4 w-4" />
                100% free - instant results
              </span>
              <h2 className="mt-4 max-w-2xl text-[30px] font-bold leading-tight tracking-tight text-[#07162d] sm:text-[40px]">
                Check Your Credit Score in Minutes with{" "}
                <span className="text-[#075cde]">Fintaraa</span>
              </h2>
              <div className="mt-4 grid max-w-xl gap-2 text-[14px] font-semibold leading-6 text-[#4f627a]">
                {[
                  "Authorised credit bureau data",
                  "100% free and instant",
                  "No hard enquiry | No spam",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-[#075cde]" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {bureauLogos.map((logo) => (
                  <div
                    key={logo.label}
                    className="flex h-12 items-center justify-center rounded-xl bg-white px-3 text-center"
                  >
                    <span
                      className={`text-[13px] font-bold leading-tight ${logo.className}`}
                    >
                      {logo.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/cibil-score"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#075cde] px-6 text-[14px] font-semibold text-white no-underline transition hover:bg-[#064cb8]"
                >
                  Check Your Credit Score Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#07162d]">
                  <Star className="h-4 w-4 fill-[#f8b400] text-[#f8b400]" />
                  Trusted by 5L+ users - 4.9/5
                </div>
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-hidden bg-white sm:min-h-[420px]">
              <Image
                src="/assets/images/hero1.png"
                alt="Customer checking financial health with Fintaraa"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-white via-white/10 to-transparent" />

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
