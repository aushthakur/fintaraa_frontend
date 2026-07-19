"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { slugifyProduct } from "@/lib/productRouting";
import { AutoCarousel } from "@/components/common/AutoCarousel";
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

const pluralLoanLabel = (value: string) =>
  value.endsWith("Loan") ? `${value}s` : value;

function LoanRateOfferCard({
  offer,
  activeTab,
  repeated = false,
}: {
  offer: LoanRateOffer;
  activeTab: string;
  repeated?: boolean;
}) {
  return (
    <Link
      href={`/banks/${offer.bankSlug}/${slugifyProduct(activeTab)}`}
      aria-hidden={repeated ? true : undefined}
      tabIndex={repeated ? -1 : undefined}
      className="group block h-full w-full rounded-xl border border-gray-200 bg-white p-2.5 no-underline transition-colors duration-300 hover:border-[#bcd8f4] sm:p-3"
    >
      <div className="flex flex-col items-start gap-1">
        <div className="relative h-9 w-full overflow-hidden">
          <Image
            src={offer.logoSrc}
            alt={offer.bankName}
            fill
            sizes="(max-width: 1279px) 25vw, 14vw"
            unoptimized
            className="object-contain object-center"
          />
        </div>
        <h4 className="line-clamp-1 mt-1 text-center w-full min-h-8 text-[12px] font-bold leading-4 tracking-tight text-[#00529c] sm:text-[13px]">
          {offer.bankName}
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-2.5">
        <div className="flex flex-col">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 sm:text-[10px]">
            Min
          </span>
          <span className="mt-0.5 text-[13px] font-extrabold text-gray-900 sm:text-[14px]">
            {offer.minRate}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 sm:text-[10px]">
            Max
          </span>
          <span className="mt-0.5 text-[13px] font-extrabold text-gray-900 sm:text-[14px]">
            {offer.maxRate}
          </span>
        </div>
      </div>
      <span className="card-action-button mt-2.5 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg px-2 text-[10px] font-bold sm:text-[11px]">
        Apply Now
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

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
      <div className="mx-auto max-w-9xl rounded-3xl">
        {/* Main Centered Styled Section Title */}
        <div className="w-full text-center mb-8">
          <h2 className="text-[24px] font-bold leading-tight text-gray-900 sm:text-[30px] md:text-[34px]">
            {pluralLoanLabel(activeTab)} from{" "}
            <span className="text-[#12b76a]">7.10%*</span> Only with{" "}
            <span className="text-[#00529c]">Fintaraa</span>
          </h2>
        </div>

        {/* Sub-Header Actions Row: Title + Search Bar Filter Input */}
        <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] gap-3 sm:grid-cols-[1fr_minmax(220px,320px)_auto] sm:items-center">
          <h3 className="text-[18px] md:text-[20px] font-bold text-gray-900 tracking-tight">
            Lowest Interest Rates*
          </h3>

          <Link
            href={`/products/${slugifyProduct(activeTab)}`}
            className="order-2 inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#e9f2ff] px-3 text-[12px] font-bold leading-none text-[#075cde] no-underline transition hover:bg-[#d9eaff] sm:order-3 sm:h-11 sm:rounded-xl sm:bg-[#075cde] sm:px-5 sm:text-[13px] sm:text-white sm:hover:bg-[#064cb8]"
          >
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden">View</span>
          </Link>

          {/* Dashboard-Style Search Container Field */}
          <div className="order-3 col-span-2 relative flex h-11 w-full items-center rounded-xl border border-gray-200 bg-white px-3 transition-focus focus-within:border-gray-300 sm:order-2 sm:col-span-1">
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

        {/* Two-row, auto-playing partner offers */}
        {filteredOffers.length ? (
          <AutoCarousel
            ariaLabel={`${activeTab} offers`}
            mobileSlides={2}
            tabletSlides={2}
            desktopSlides={4}
            wideSlides={7}
            className="mt-6"
          >
            {filteredOffers.map((offer) => (
              <LoanRateOfferCard
                key={offer.id}
                offer={offer}
                activeTab={activeTab}
              />
            ))}
          </AutoCarousel>
        ) : null}

        {!filteredOffers.length ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-[#f8fbff] p-6 text-center text-[13px] font-semibold text-gray-500">
            No matching offers found. Try another bank or product search.
          </div>
        ) : null}
      </div>
    </section>
  );
}
