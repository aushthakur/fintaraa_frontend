"use client";
import React, { useState } from "react";
import Image from "next/image";

type BankLogo = {
  name: string;
  src: string;
};

// Filter category options seen in image_acd00b.png
const categories = [
  "Loan",
  "Insurance",
  "Credit Card",
  "Credit Bureau",
] as const;
type Category = (typeof categories)[number];

const bankLogos = [
  { name: "Bank of Baroda", src: "/assets/banks/Bank-of-Baroda1.png" },
  { name: "State Bank of India", src: "/assets/banks/Sbi1.png" },
  { name: "Shriram Finance", src: "/assets/banks/Shriram.png" }, // Adjusted based on image text
  { name: "IndusInd Bank", src: "/assets/banks/Indusind.png" },
  { name: "Bajaj Finserv", src: "/assets/banks/Bajaj.png" },
  { name: "Kotak Mahindra Bank", src: "/assets/banks/Kotak-Mahindra-Bank.png" },
  { name: "Shriram Finance Alt", src: "/assets/banks/Shriram.png" },
  { name: "IndusInd Bank Alt", src: "/assets/banks/Indusind.png" },
  { name: "Bajaj Finserv Alt", src: "/assets/banks/Bajaj.png" },
  {
    name: "Kotak Mahindra Bank Alt",
    src: "/assets/banks/Kotak-Mahindra-Bank.png",
  },
  { name: "State Bank of India Alt", src: "/assets/banks/sbi1.png" },
  { name: "Bank of Baroda Alt", src: "/assets/banks/Bank-of-Baroda1.png" },
] satisfies BankLogo[];

// Split the array down the middle into two distinct continuous rows
const midpoint = Math.ceil(bankLogos.length / 2);
const logoRows = [bankLogos.slice(0, midpoint), bankLogos.slice(midpoint)];

function LogoMarquee({
  logos,
  reverse = false,
}: {
  logos: BankLogo[];
  reverse?: boolean;
}) {
  // Triple arrays to ensure smooth infinite seamless wrapping transitions
  const marqueeLogos = [...logos, ...logos, ...logos];

  return (
    <div className="relative overflow-hidden">
      <div
        className={`flex w-max gap-5 py-2 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {marqueeLogos.map((bank, index) => (
          <div
            key={`${bank.name}-${index}-${reverse ? "reverse" : "forward"}`}
            className="flex h-24 w-44 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-4 shadow-[0_4px_12px_rgba(16,24,40,0.03)]"
          >
            {/* Explicit layout box forcing all internal logos to scale within the exact same boundaries */}
            <div className="relative flex h-10 w-full items-center justify-center">
              <Image
                src={bank.src}
                alt={bank.name}
                width={140}
                height={40}
                unoptimized
                className="max-h-full max-w-full object-cover mix-blend-multiply"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartnersStrip() {
  const [activeCategory, setActiveCategory] = useState<Category>("Loan");

  return (
    <section className="bg-white px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        {/* Top Header Row Panel Layout */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between border-b border-gray-50 pb-6">
          {/* Main Headline Label */}
          <h2 className="text-[20px] font-extrabold text-[#111625] md:text-[24px] tracking-tight ">
            Our Trusted Partner Banks & NBFCs
          </h2>

          {/* Action Navigation Shell (Tabs + View All Link) */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 ml-auto lg:ml-0">
            {/* Functional Operational Tabs Container */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`shrink-0 rounded-xl border px-5 py-2.5 text-[13px] font-semibold transition-all ${
                      isActive
                        ? "border-[#12b76a] bg-[#12b76a] text-white font-bold"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* View All Redirection Anchor */}
            <a
              href="/partners"
              className="inline-flex items-center gap-1 pl-2 text-[13px] font-bold text-[#12b76a] no-underline hover:text-[#0fa35e] transition-colors whitespace-nowrap"
            >
              View all Partners <span className="text-[14px]">➔</span>
            </a>
          </div>
        </div>

        {/* Double Infinite Marquee Stack Blocks */}
        <div className="relative mt-8 overflow-hidden rounded-2xl bg-white py-2">
          {/* Edge Blur Overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-white via-white/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-white via-white/80 to-transparent" />

          {/* Interactive Rows displaying the grid look via parallel infinite movement */}
          <div className="flex flex-col gap-4">
            <LogoMarquee logos={logoRows[0]} />
            <LogoMarquee logos={logoRows[1]} reverse />
          </div>
        </div>
      </div>
    </section>
  );
}
