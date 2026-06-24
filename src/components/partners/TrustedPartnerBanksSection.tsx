"use client";

import Link from "next/link";
import { ArrowRight, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import {
  getTrustedPartnerHref,
  getTrustedPartnersByCategory,
  trustedPartnerCategoryTabs,
  trustedPartners,
  type TrustedPartner,
  type TrustedPartnerCategoryKey,
} from "@/data/trustedPartners";

type DisplayMode = "marquee" | "grid";

type TrustedPartnerBanksSectionProps = {
  mode?: DisplayMode;
  className?: string;
  title?: string;
  description?: string;
  defaultShowAll?: boolean;
  showViewAllAction?: boolean;
  viewAllHref?: string;
};

const categoryCounts = trustedPartnerCategoryTabs.reduce(
  (acc, tab) => {
    acc[tab.key] = getTrustedPartnersByCategory(tab.key).length;
    return acc;
  },
  {} as Record<TrustedPartnerCategoryKey, number>,
);

const splitRows = (partners: TrustedPartner[]) => {
  const midpoint = Math.ceil(partners.length / 2);
  return [partners.slice(0, midpoint), partners.slice(midpoint)];
};

function PartnerLogoTile({
  partner,
  href,
  compact = false,
}: {
  partner: TrustedPartner;
  href: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={`Open ${partner.name}`}
      className={`group flex shrink-0 items-center justify-center bg-white no-underline transition ${
        compact
          ? "h-24 w-44 rounded-2xl border border-[#eef2f6] px-5 py-4 shadow-[0_4px_14px_rgba(16,24,40,0.03)] hover:border-[#cfe4f7]"
          : "min-h-28 rounded-2xl border border-[#e4edf5] px-5 py-4 shadow-[0_10px_24px_rgba(16,24,40,0.04)] hover:-translate-y-0.5 hover:border-[#bddcf3] hover:shadow-[0_14px_30px_rgba(16,24,40,0.08)]"
      }`}
    >
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <BankLogoImage
          src={partner.logo}
          alt={partner.name}
          className={compact ? "h-10 w-full" : "h-11 w-full max-w-36"}
          sizes={compact ? "150px" : "(min-width: 1280px) 160px, 33vw"}
          unoptimized
          imageClassName="mix-blend-multiply"
        />
        {!compact ? (
          <span className="line-clamp-1 text-center text-[12px] font-extrabold text-[#344054] transition group-hover:text-[#00529b]">
            {partner.name}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

function PartnerMarquee({
  partners,
  activeCategory,
  reverse = false,
}: {
  partners: TrustedPartner[];
  activeCategory: TrustedPartnerCategoryKey;
  reverse?: boolean;
}) {
  const marqueePartners = [...partners, ...partners, ...partners];

  return (
    <div className="relative overflow-hidden">
      <div
        className={`flex w-max gap-5 py-2 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {marqueePartners.map((partner, index) => (
          <PartnerLogoTile
            key={`${partner.slug}-${index}-${reverse ? "reverse" : "forward"}`}
            partner={partner}
            href={getTrustedPartnerHref(partner, activeCategory)}
            compact
          />
        ))}
      </div>
    </div>
  );
}

function PartnerGrid({
  partners,
  activeCategory,
}: {
  partners: TrustedPartner[];
  activeCategory: TrustedPartnerCategoryKey;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {partners.map((partner) => (
        <PartnerLogoTile
          key={partner.slug}
          partner={partner}
          href={getTrustedPartnerHref(partner, activeCategory)}
        />
      ))}
    </div>
  );
}

export function TrustedPartnerBanksSection({
  mode = "marquee",
  className = "",
  title = "Our Trusted Partner Banks & NBFCs",
  description,
  defaultShowAll = false,
  showViewAllAction = true,
  viewAllHref,
}: TrustedPartnerBanksSectionProps) {
  const [activeCategory, setActiveCategory] =
    useState<TrustedPartnerCategoryKey>("all");
  const [showAll, setShowAll] = useState(defaultShowAll);

  const filteredPartners = useMemo(
    () => getTrustedPartnersByCategory(activeCategory),
    [activeCategory],
  );
  const displayedPartners = showAll ? trustedPartners : filteredPartners;
  const marqueePartners = filteredPartners.slice(0, 14);
  const rows = splitRows(marqueePartners);
  const activeCount = displayedPartners.length;

  const handleViewAll = () => {
    if (showAll) {
      setShowAll(false);
      return;
    }
    setActiveCategory("all");
    setShowAll(true);
  };

  return (
    <section className={`bg-white px-4 py-12 md:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-5 border-b border-gray-50 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#111625] md:text-[24px]">
              {title}
            </h2>
            <p className="mt-1 text-[13px] font-semibold text-[#667085]">
              {description ||
                `${activeCount} partners available across selected product category.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:ml-0">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:gap-3 sm:pb-0">
              {trustedPartnerCategoryTabs.map((category) => {
                const isActive =
                  activeCategory === category.key &&
                  (!showAll || category.key === "all");
                const count = categoryCounts[category.key];
                return (
                  <button
                    key={category.key}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      setActiveCategory(category.key);
                      setShowAll(false);
                    }}
                    className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-4 text-[13px] font-bold transition-all ${
                      isActive
                        ? "border-[#12b76a] bg-[#12b76a] text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#12b76a] hover:text-[#0fa35e]"
                    }`}
                  >
                    {category.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#f2f4f7] text-[#667085]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {showViewAllAction ? (
              viewAllHref ? (
                <Link
                  href={viewAllHref}
                  className="inline-flex h-10 items-center gap-1 rounded-xl px-2 text-[13px] font-extrabold text-[#12b76a] no-underline transition-colors hover:text-[#0fa35e]"
                >
                  View all Partners
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleViewAll}
                  className="inline-flex h-10 items-center gap-1 rounded-xl px-2 text-[13px] font-extrabold text-[#12b76a] transition-colors hover:text-[#0fa35e]"
                >
                  {showAll ? "Show less" : "View all Partners"}
                  {showAll ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              )
            ) : null}
          </div>
        </div>

        <div className="mt-8">
          {showAll || mode === "grid" ? (
            <PartnerGrid
              partners={displayedPartners}
              activeCategory={showAll ? "all" : activeCategory}
            />
          ) : (
            <div className="relative overflow-hidden rounded-2xl bg-white py-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-white via-white/80 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-white via-white/80 to-transparent" />
              <div className="flex flex-col gap-4">
                <PartnerMarquee
                  partners={rows[0]}
                  activeCategory={activeCategory}
                />
                <PartnerMarquee
                  partners={rows[1]}
                  activeCategory={activeCategory}
                  reverse
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
