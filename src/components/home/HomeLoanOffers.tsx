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
import { getTrustedPartnersByCategory } from "@/data/trustedPartners";

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
}: {
  offer: LoanRateOffer;
  activeTab: string;
}) {
  return (
    <Link
      href={`/banks/${offer.bankSlug}/${slugifyProduct(activeTab)}`}
      className="group block h-full w-full rounded-2xl border border-white/60 bg-white/60 p-3 shadow-[0_8px_30px_rgba(91,33,182,0.04)] backdrop-blur-xl no-underline transition-all duration-500 hover:-translate-y-1 hover:border-[#ddd6fe] hover:bg-white/90 hover:shadow-[0_20px_40px_rgba(91,33,182,0.12)]"
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
        <h4 className="line-clamp-1 mt-1 text-center w-full min-h-8 text-[12px] font-bold leading-4 tracking-tight text-[#4c1d95] sm:text-[13px]">
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
    const rateOffsets = new Map(
      bankDirectory.map((bank) => [bank.slug, bank.minRate - 7.1]),
    );
    const offers: LoanRateOffer[] = getTrustedPartnersByCategory("loan").map(
      (partner) => {
        const rateOffset = rateOffsets.get(partner.slug) || 0;
        return {
          id: `${partner.slug}-${activeProduct.slug}`,
          bankSlug: partner.slug,
          bankName: partner.name,
          logoSrc: partner.logo,
          minRate: formatRate(activeProduct.minRate + rateOffset),
          maxRate: formatRate(activeProduct.maxRate + rateOffset),
        };
      },
    );

    if (!query) return offers;
    return offers.filter((offer) =>
      [offer.bankName, activeTab, offer.minRate, offer.maxRate]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [activeTab, searchQuery]);

  const offerColumns = filteredOffers.reduce<LoanRateOffer[][]>(
    (columns, offer, index) => {
      if (index % 2 === 0) {
        columns.push([offer]);
      } else {
        columns[columns.length - 1].push(offer);
      }
      return columns;
    },
    [],
  );

  return (
    <section
      aria-labelledby="home-loan-offers-heading"
      className="relative overflow-hidden bg-white px-4 py-12 md:px-6 lg:px-8"
    >
      {/* Container Box featuring the signature clean borders visible in image_a1c8bd.png */}
      <div className="mx-auto max-w-9xl rounded-3xl">
        {/* Main Centered Styled Section Title */}
        <div className="w-full text-center mb-8">
          <h2
            id="home-loan-offers-heading"
            className="text-[24px] font-bold leading-tight text-gray-900 sm:text-[30px] md:text-[34px]"
          >
            {pluralLoanLabel(activeTab)} from{" "}
            <span className="text-[#12b76a]">7.10%*</span> Only with{" "}
            <span className="text-[#4c1d95]">Fintaraa</span>
          </h2>
        </div>

        {/* Sub-Header Actions Row: Title + Search Bar Filter Input */}
        <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] gap-3 sm:grid-cols-[1fr_minmax(220px,320px)_auto] sm:items-center">
          <h3 className="text-[18px] md:text-[20px] font-bold text-gray-900 tracking-tight">
            Lowest Interest Rates*
          </h3>

          <Link
            href={`/products/${slugifyProduct(activeTab)}`}
            className="order-2 inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#ede9fe] px-3 text-[12px] font-bold leading-none text-[#5b21b6] no-underline transition hover:bg-[#d9eaff] sm:order-3 sm:h-11 sm:rounded-xl sm:bg-[#5b21b6] sm:px-5 sm:text-[13px] sm:text-white sm:hover:bg-[#4c1d95]"
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
                    ? "border-[#5b21b6] bg-[#5b21b6] text-white font-bold"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Keep every available partner in a moving, two-row carousel. */}
        {filteredOffers.length ? (
          <AutoCarousel
            ariaLabel={`${activeTab} offers`}
            mobileSlides={2}
            tabletSlides={3}
            desktopSlides={4}
            wideSlides={7}
            className="home-loan-offers-carousel mt-6"
          >
            {offerColumns.map((offers) => (
              <div
                key={offers.map((offer) => offer.id).join("-")}
                className="grid gap-3"
              >
                {offers.map((offer) => (
                  <LoanRateOfferCard
                    key={offer.id}
                    offer={offer}
                    activeTab={activeTab}
                  />
                ))}
              </div>
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
