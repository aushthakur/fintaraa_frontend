"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const productTabs = [
  "Loan Partner",
  "Insurance Partner",
  "Personal Loan",
] as const;

const partnerLogos = [
  { name: "State Bank of India", src: "/assets/banks/sbi.png", width: 82 },
  { name: "ICICI Bank", src: "/assets/banks/ICICI-Bank.png", width: 104 },
  { name: "Kotak Bank", src: "/assets/banks/kotak.png", width: 92 },
  { name: "IndusInd Bank", src: "/assets/banks/indusind.png", width: 108 },
];

function LogoTile({
  src,
  name,
  width,
}: {
  src: string;
  name: string;
  width: number;
}) {
  return (
    <div className="flex h-22.5 items-center justify-center rounded-xl border border-[#e6eaf0] bg-white px-5 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
      <Image
        src={src}
        alt={name}
        width={width}
        height={40}
        unoptimized
        className="h-auto max-h-10 w-auto object-contain"
      />
    </div>
  );
}

export function PartnerProductShowcase() {
  const [activeTab, setActiveTab] = useState<(typeof productTabs)[number]>(
    productTabs[0],
  );

  return (
    <section className="px-4 py-14 md:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#111827] sm:text-[30px]">
          Our Partner by Product
        </h2>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {productTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`h-10 rounded-lg border px-5 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? "border-[#14b85d] bg-[#14b85d] text-white shadow-[0_8px_18px_rgba(20,184,93,0.18)]"
                    : "border-[#d1d5db] bg-white text-[#374151] hover:border-[#86efac]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Logo grid rows */}
        <div className="mt-8 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`${activeTab}-row-${index}`}
              className="rounded-2xl border border-[#e5e8ef] bg-white px-5 py-5 shadow-[0_4px_18px_rgba(15,23,42,0.04)]"
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-center">
                {partnerLogos.map((logo) => (
                  <LogoTile
                    key={`${logo.name}-${index}-${activeTab}`}
                    {...logo}
                  />
                ))}
                <Link
                  href="/partners"
                  className="inline-flex h-22.5 items-center justify-center gap-1.5 rounded-xl border border-transparent px-4 text-[14px] font-semibold text-[#1da34c] no-underline transition-colors hover:text-[#13853d]"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}