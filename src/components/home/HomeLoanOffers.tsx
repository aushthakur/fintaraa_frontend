"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
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
      className="w-[min(82vw,20rem)] shrink-0 snap-start rounded-xl border border-gray-200 bg-white p-4 no-underline shadow-[0_2px_12px_rgba(0,0,0,0.01)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:w-[19rem] lg:w-auto lg:p-5"
    >
      <div className="flex flex-col items-start gap-1">
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
        <h4 className="text-[15px] font-bold tracking-tight text-[#00529c]">
          {offer.bankName}
        </h4>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-50 pt-3">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Min
          </span>
          <span className="mt-0.5 text-[16px] font-extrabold text-gray-900">
            {offer.minRate}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Max
          </span>
          <span className="mt-0.5 text-[16px] font-extrabold text-gray-900">
            {offer.maxRate}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function HomeLoanOffers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>("Home Loan");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPaused, setIsPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const x = useMotionValue(0);
  const baseSpeed = 0.58;

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
  const duplicatedOffers = useMemo(
    () => [...filteredOffers, ...filteredOffers, ...filteredOffers],
    [filteredOffers],
  );

  useEffect(() => {
    x.set(0);
    if (trackRef.current) setTrackWidth(trackRef.current.scrollWidth);
  }, [activeTab, filteredOffers, x]);

  useAnimationFrame((_, delta) => {
    if (isPaused || !trackWidth || !filteredOffers.length) return;
    const nextX = x.get() - baseSpeed * (delta / 16);
    const loopThreshold = trackWidth / 3;
    x.set(Math.abs(nextX) >= loopThreshold ? nextX + loopThreshold : nextX);
  });

  return (
    <section className="bg-white px-4 py-12 md:px-6 lg:px-8">
      {/* Container Box featuring the signature clean borders visible in image_a1c8bd.png */}
      <div className="mx-auto max-w-9xl rounded-3xl border border-gray-200 p-6 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.015)]">
        {/* Main Centered Styled Section Title */}
        <div className="w-full text-center mb-8">
          <h2 className="text-[24px] sm:text-[32px] md:text-[38px] font-bold text-gray-900 tracking-tight leading-tight">
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

        {/* Dynamic Partner Offers Layout */}
        {filteredOffers.length ? (
          <div
            ref={containerRef}
            className="relative -mx-4 mt-6 overflow-hidden px-4 pb-2 sm:-mx-6 sm:px-6 lg:hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-white to-transparent" />
            <motion.div
              ref={trackRef}
              style={{ x, touchAction: "pan-y" }}
              drag="x"
              dragConstraints={{
                left: -((trackWidth || 2400) * (2 / 3)),
                right: 0,
              }}
              dragElastic={0.05}
              onDragStart={() => setIsPaused(true)}
              onDragEnd={() => setIsPaused(false)}
              className="flex w-max cursor-grab gap-3 active:cursor-grabbing"
            >
              {duplicatedOffers.map((offer, idx) => (
                <LoanRateOfferCard
                  key={`${offer.id}-${idx}`}
                  offer={offer}
                  activeTab={activeTab}
                  repeated={idx >= filteredOffers.length}
                />
              ))}
            </motion.div>
          </div>
        ) : null}

        <div className="mt-6 hidden grid-cols-4 gap-4 lg:grid">
          {filteredOffers.map((offer) => (
            <LoanRateOfferCard
              key={offer.id}
              offer={offer}
              activeTab={activeTab}
            />
          ))}
          </div>

        {!filteredOffers.length ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-[#f8fbff] p-6 text-center text-[13px] font-semibold text-gray-500">
            No matching offers found. Try another bank or product search.
          </div>
        ) : null}
      </div>
    </section>
  );
}
