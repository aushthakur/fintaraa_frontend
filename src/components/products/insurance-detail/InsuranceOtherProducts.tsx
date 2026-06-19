"use client";

import Link from "next/link";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { productHref } from "@/lib/productRouting";

// Soft, clean color palette configurations mirroring the design circles
const toneClass: Record<string, string> = {
  amber: "bg-[#fff3df] text-[#f79009]",
  blue: "bg-[#e4f4ff] text-[#195585]",
  brown: "bg-[#fff3e5] text-[#a36a19]",
  gold: "bg-[#fff3c6] text-[#d4a42f]",
  green: "bg-[#dff7e8] text-[#2a9f55]",
  orange: "bg-[#fff4eb] text-[#f28c28]",
  pink: "bg-[#ffe4f2] text-[#f1129d]",
  red: "bg-[#ffe1e4] text-[#ef1010]",
  sky: "bg-[#dff0ff] text-[#1b76a6]",
  purple: "bg-[#f3e8ff] text-[#9333ea]",
  teal: "bg-[#e6fffa] text-[#0d9488]",
};

const insuranceCards = [
  {
    title: "HDFC ERGO",
    logo: "/assets/banks/hdfc.png",
    tone: "blue",
  },
  {
    title: "ICICI Lombard",
    logo: "/assets/banks/icici.png",
    tone: "orange",
  },
  {
    title: "PNB MetLife",
    logo: "/assets/banks/pnb.png",
    tone: "green",
  },
  {
    title: "Kotak Mahindra",
    logo: "/assets/banks/kotak.png",
    tone: "red",
  },
  {
    title: "Tata Capital",
    logo: "/assets/banks/indian.png",
    tone: "sky",
  },
  {
    title: "Bajaj Allianz",
    logo: "/assets/banks/bajaj.png",
    tone: "gold",
  },
  {
    title: "SBI General",
    logo: "/assets/banks/sbi-logo.png",
    tone: "purple",
  },
 
];

export function InsuranceOtherProducts() {
  return (
    <section className="px-4 pb-10 md:px-6 lg:px-8 py-20">
      <div className="mx-auto max-w-9xl">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-black text-[#111827]">
            Explore Other Products
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-[14px] font-bold text-[#22c55e] no-underline transition-colors hover:text-[#16a34a] shrink-0"
          >
            View All
            <span className="text-[15px] font-light">→</span>
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {insuranceCards.map((insurance) => (
            <Link
              key={insurance.title}
              href={productHref(insurance.title)}
              className="group relative flex min-h-40 flex-col items-center justify-center rounded-3xl border border-gray-200/70 bg-white px-3 pb-7 pt-8 text-center no-underline transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.02)] sm:px-4 sm:pb-8 sm:pt-10"
            >
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 ${
                  toneClass[insurance.tone] || "bg-[#fff2ec] text-[#ff7643]"
                }`}
              >
                <BankLogoImage
                  src={insurance.logo}
                  alt={insurance.title}
                  className="h-12 w-12"
                />
              </div>
              <h3 className="mt-5 text-[14px] font-bold tracking-tight text-[#0f172a]">
                {insurance.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
