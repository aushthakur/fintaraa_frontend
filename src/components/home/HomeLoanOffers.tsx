"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { slugifyProduct } from "@/lib/productRouting";
import {
  bankDirectory,
  formatRate,
  loanProductDirectory,
} from "@/data/bankDirectory";

interface LoanRateOffer {
  id: string;
  bankSlug: string;
  bankName: string;
  logoSrc: string;
  minRate: string;
  maxRate: string;
}

const productTabs = loanProductDirectory.map((product) => product.name);

export function HomeLoanOffers() {
  const [activeTab, setActiveTab] = useState<string>("Home Loan");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredOffers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const activeProduct =
      loanProductDirectory.find((product) => product.name === activeTab) ||
      loanProductDirectory[0];
    const offers: LoanRateOffer[] = bankDirectory.map((bank) => {
      const rateOffset = bank.minRate - 7.1;
      return {
        id: `${bank.slug}-${activeProduct.slug}`,
        bankSlug: bank.slug,
        bankName: bank.name,
        logoSrc: bank.logo,
        minRate: formatRate(activeProduct.minRate + rateOffset),
        maxRate: formatRate(activeProduct.maxRate + rateOffset),
      };
    });

    if (!query) return offers;
    return offers.filter((offer) =>
      [offer.bankName, activeTab, offer.minRate, offer.maxRate]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [activeTab, searchQuery]);

  return (
    <section className="bg-white px-4 py-12 md:px-6 lg:px-8">
      {/* Container Box featuring the signature clean borders visible in image_a1c8bd.png */}
      <div className="mx-auto max-w-9xl rounded-3xl border border-gray-200 p-6 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.015)]">
        {/* Main Centered Styled Section Title */}
        <div className="w-full text-center mb-8">
          <h2 className="text-[24px] sm:text-[32px] md:text-[38px] font-bold text-gray-900 tracking-tight leading-tight">
            Loans from <span className="text-[#12b76a]">7.10%*</span> Only with{" "}
            <span className="text-[#00529c]">Fintaraa</span>
          </h2>
        </div>

        {/* Sub-Header Actions Row: Title + Search Bar Filter Input */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-[18px] md:text-[20px] font-bold text-gray-900 tracking-tight">
            Lowest Interest Rates
          </h3>

          {/* Dashboard-Style Search Container Field */}
          <div className="relative flex h-11 w-full sm:w-70 items-center rounded-xl border border-gray-200 bg-white px-3 transition-focus focus-within:border-gray-300">
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()} offers or banks ...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[13px] text-gray-700 placeholder-gray-400 outline-none pr-6"
            />
            <Search className="absolute right-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Horizontal Nav Category Filter Tabs Track */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
          {productTabs.map((tab, idx) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={`${tab}-${idx}`}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-xl border px-5 py-2.5 text-[13px] font-semibold transition-all ${
                  isSelected
                    ? "border-[#075cde] bg-[#075cde] text-white font-bold"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Dynamic Partner Offers Layout Grid */}
        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredOffers.map((offer, idx) => (
            <Link
              key={`${offer.id}-${idx}`}
              href={`/banks/${offer.bankSlug}/${slugifyProduct(activeTab)}`}
              className="rounded-2xl border border-gray-200 bg-white p-5 no-underline shadow-[0_2px_12px_rgba(0,0,0,0.01)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
            >
              {/* Top Row: Brand Identity Placement */}
              <div className="flex flex-col items-start gap-1">
                {/* Simulated clean Next.js image loading container node */}
                <div className="relative h-9 w-24 overflow-hidden">
                  <Image
                    src={offer.logoSrc}
                    alt={offer.bankName}
                    fill
                    sizes="96px"
                    unoptimized
                    className="object-contain object-left"
                  />
                </div>
                <h4 className="text-[15px] font-bold text-[#00529c] tracking-tight">
                  {offer.bankName}
                </h4>
              </div>

              {/* Bottom Row: Unified Data Metrics Columns */}
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-50 pt-3">
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Min
                  </span>
                  <span className="text-[16px] font-extrabold text-gray-900 mt-0.5">
                    {offer.minRate}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Max
                  </span>
                  <span className="text-[16px] font-extrabold text-gray-900 mt-0.5">
                    {offer.maxRate}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!filteredOffers.length ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-[#f8fbff] p-6 text-center text-[13px] font-semibold text-gray-500">
            No matching offers found. Try another bank or product search.
          </div>
        ) : null}

        {/* Central Main Conversion CTA Pill Action Button Block */}
        <div className="mt-10 flex justify-center">
          <Link
            href={`/products/${slugifyProduct(activeTab)}`}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#075cde] px-10 text-[14px] font-bold text-white shadow-sm transition-all hover:bg-[#064cb8] hover:-translate-y-1 active:translate-y-0"
          >
            Find the best rate for you!
          </Link>
        </div>
      </div>
    </section>
  );
}
