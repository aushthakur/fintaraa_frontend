"use client";

import Link from "next/link";
import { ArrowRight, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { trustedPartners } from "@/data/trustedPartners";
import {
  fetchPublicPartners,
  getPublicPartnerHref,
  type PublicPartner,
  type PublicPartnerProductCategory,
} from "@/services/partners";

type DisplayMode = "marquee" | "grid";

type TrustedPartnerBanksSectionProps = {
  mode?: DisplayMode;
  className?: string;
  title?: string;
  description?: string;
  defaultShowAll?: boolean;
  showViewAllAction?: boolean;
  viewAllHref?: string;
  flushX?: boolean;
  mobileScroller?: boolean;
  initialPartners?: PublicPartner[];
};

type DirectoryCategory = "all" | PublicPartnerProductCategory;

const categoryTabs: Array<{ key: DirectoryCategory; label: string }> = [
  { key: "all", label: "All" },
  { key: "loan", label: "Loans" },
  { key: "credit_card", label: "Credit Cards" },
  { key: "insurance", label: "Insurance" },
];

const fallbackPartners: PublicPartner[] = trustedPartners.map((partner) => ({
  id: `fallback-${partner.slug}`,
  name: partner.name,
  slug: partner.slug,
  logo: partner.logo,
  type:
    partner.type === "NBFC"
      ? "nbfc"
      : partner.type === "Insurer"
        ? "insurer"
        : "bank",
  productCategories: partner.categories
    .map((category) =>
      category === "credit-card"
        ? "credit_card"
        : category === "loan" || category === "insurance"
          ? category
          : null,
    )
    .filter(
      (category): category is PublicPartnerProductCategory => Boolean(category),
    ),
  productCount: 0,
  featured: false,
  website: "",
  status: "active",
}));

const splitRows = (partners: PublicPartner[]) => {
  const midpoint = Math.ceil(partners.length / 2);
  return [partners.slice(0, midpoint), partners.slice(midpoint)];
};

const splitMobileRows = (partners: PublicPartner[]) =>
  Array.from({ length: 3 }, (_, rowIndex) => {
    const row = partners.filter((_, index) => index % 3 === rowIndex);
    return row.length ? row : partners;
  });

function PartnerLogoTile({
  partner,
  href,
  compact = false,
  fluid = false,
}: {
  partner: PublicPartner;
  href: string;
  compact?: boolean;
  fluid?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={`Open ${partner.name}`}
      className={`group flex shrink-0 items-center justify-center bg-white no-underline transition ${
        compact
          ? `h-18 rounded-xl border border-[#eef2f6] px-3 py-3 hover:border-[#cfe4f7] sm:h-22 sm:px-4 sm:py-4 ${
              fluid ? "w-full" : "w-32 sm:w-40"
            }`
          : "min-h-24 rounded-xl border border-[#e4edf5] px-4 py-4 hover:border-[#bddcf3]"
      }`}
    >
      <div className="flex w-full flex-col items-center justify-center gap-3">
        {partner.logo ? (
          <BankLogoImage
            src={partner.logo}
            alt={`${partner.name} logo`}
            className={
              compact ? "h-9 w-full sm:h-10" : "h-11 w-full max-w-36"
            }
            sizes={compact ? "150px" : "(min-width: 1280px) 160px, 33vw"}
            unoptimized
            imageClassName="mix-blend-multiply"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf4ff] text-[13px] font-extrabold text-[#075cde]"
          >
            {partner.name
              .split(/\s+/)
              .slice(0, 2)
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </span>
        )}
        {!compact ? (
          <span className="text-center">
            <span className="line-clamp-1 block text-[12px] font-semibold text-[#344054] transition group-hover:text-[#00529b]">
              {partner.name}
            </span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a9bad]">
              {partner.type === "nbfc"
                ? "NBFC"
                : partner.type === "insurer"
                  ? "Insurer"
                  : "Bank"}
            </span>
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
  partners: PublicPartner[];
  activeCategory: DirectoryCategory;
  reverse?: boolean;
}) {
  const marqueePartners = [...partners, ...partners];

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
            href={getPublicPartnerHref(
              partner,
              activeCategory === "all" ? undefined : activeCategory,
            )}
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
  mobileScroller = false,
}: {
  partners: PublicPartner[];
  activeCategory: DirectoryCategory;
  mobileScroller?: boolean;
}) {
  if (mobileScroller) {
    const mobileRows = splitMobileRows(partners);

    return (
      <>
        <div
          className="relative -mx-4 overflow-hidden py-1 md:hidden"
          aria-label="Trusted financial institutions"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-white to-transparent" />
          <div className="grid gap-1.5">
            {mobileRows.map((row, index) => (
              <PartnerMarquee
                key={`mobile-partner-row-${index}`}
                partners={row}
                activeCategory={activeCategory}
                reverse={index === 1}
              />
            ))}
          </div>
        </div>

        <div className="hidden grid-cols-3 gap-4 md:grid md:grid-cols-4 xl:grid-cols-6">
          {partners.map((partner) => (
            <PartnerLogoTile
              key={partner.slug}
              partner={partner}
              href={getPublicPartnerHref(
                partner,
                activeCategory === "all" ? undefined : activeCategory,
              )}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {partners.map((partner) => (
        <PartnerLogoTile
          key={partner.slug}
          partner={partner}
          href={getPublicPartnerHref(
            partner,
            activeCategory === "all" ? undefined : activeCategory,
          )}
        />
      ))}
    </div>
  );
}

export function TrustedPartnerBanksSection({
  mode = "marquee",
  className = "",
  title = "Our Partner Banks, NBFCs & Insurers",
  description,
  defaultShowAll = false,
  showViewAllAction = true,
  viewAllHref,
  flushX = false,
  mobileScroller = false,
  initialPartners,
}: TrustedPartnerBanksSectionProps) {
  const [activeCategory, setActiveCategory] = useState<DirectoryCategory>("all");
  const [showAll, setShowAll] = useState(defaultShowAll);
  const [partners, setPartners] = useState<PublicPartner[]>(
    initialPartners ?? [],
  );
  const [loading, setLoading] = useState(initialPartners === undefined);

  useEffect(() => {
    if (initialPartners !== undefined) return;
    let active = true;

    fetchPublicPartners()
      .then((result) => {
        if (active) setPartners(result);
      })
      .catch(() => {
        if (active) setPartners(fallbackPartners);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [initialPartners]);

  const filteredPartners = useMemo(
    () =>
      activeCategory === "all"
        ? partners
        : partners.filter((partner) =>
            partner.productCategories.includes(activeCategory),
          ),
    [activeCategory, partners],
  );
  const categoryCounts = useMemo(
    () =>
      categoryTabs.reduce<Record<DirectoryCategory, number>>(
        (counts, category) => {
          if (category.key === "all") {
            counts.all = partners.length;
          } else {
            const productCategory = category.key;
            counts[productCategory] = partners.filter((partner) =>
              partner.productCategories.includes(productCategory),
            ).length;
          }
          return counts;
        },
        { all: 0, loan: 0, credit_card: 0, insurance: 0 },
      ),
    [partners],
  );
  const displayedPartners = showAll ? partners : filteredPartners;
  const marqueePartners = filteredPartners.slice(0, 14);
  const rows = splitRows(marqueePartners);

  const handleViewAll = () => {
    if (showAll) {
      setShowAll(false);
      return;
    }
    setActiveCategory("all");
    setShowAll(true);
  };

  return (
    <section className={`bg-white px-4 md:px-6 lg:px-8 ${className}`}>
      <div
        className={`mx-auto max-w-9xl ${
          mode === "grid"
            ? `overflow-hidden rounded-2xl bg-white ${
                flushX ? "py-4 sm:py-6 lg:py-8" : ""
              }`
            : ""
        }`}
      >
        <div className="flex flex-col gap-4 border-b border-[#dceaf7] pb-4 md:gap-5 md:pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold leading-tight tracking-tight text-[#07162d] md:text-[34px]">
                {title}
              </h2>
              {description ? (
                <p className="mt-2 max-w-2xl text-[13px] font-medium leading-6 text-[#61748f]">
                  {description}
                </p>
              ) : null}
            </div>
            {showViewAllAction && viewAllHref ? (
              <Link
                href={viewAllHref}
                className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#e9f2ff] px-3 text-[12px] font-semibold leading-none text-[#075cde] no-underline transition-colors hover:bg-[#d9eaff] lg:hidden"
              >
                View
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4 lg:ml-0">
            <div className="-mx-1 flex max-w-full items-center gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:gap-3 sm:px-0 sm:pb-0">
              {categoryTabs.map((category) => {
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
                    className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-[12px] font-semibold leading-none transition-all md:h-10 md:px-4 md:text-[13px] ${
                      isActive
                        ? "border-[#075cde] bg-[#075cde] text-white"
                        : "border-[#dceaf7] bg-white text-[#52657d] hover:border-[#075cde] hover:text-[#075cde]"
                    }`}
                  >
                    <span className="sm:hidden">
                      {category.key === "credit_card"
                        ? "Cards"
                        : category.label}
                    </span>
                    <span className="hidden sm:inline">{category.label}</span>
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
                  className="hidden h-10 items-center gap-1 rounded-xl px-2 text-[15px] font-semibold text-[#075cde] no-underline transition-colors hover:text-[#064cb8] lg:inline-flex"
                >
                  View all Partners
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleViewAll}
                  className="inline-flex h-10 items-center gap-1 rounded-xl px-2 text-[13px] font-semibold text-[#075cde] transition-colors hover:text-[#064cb8]"
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

        <div className="mt-5 md:mt-8">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-xl border border-[#e5edf4] bg-[#f5f8fb]"
                />
              ))}
            </div>
          ) : !displayedPartners.length ? (
            <div
              role="status"
              className="rounded-2xl border border-dashed border-[#cbddeb] bg-[#f8fbfe] px-5 py-10 text-center"
            >
              <p className="text-[14px] font-bold text-[#334e68]">
                No published partners in this category yet.
              </p>
              <p className="mt-1 text-[12px] font-medium text-[#718598]">
                Please explore another product category.
              </p>
            </div>
          ) : showAll || mode === "grid" ? (
            <PartnerGrid
              partners={displayedPartners}
              activeCategory={showAll ? "all" : activeCategory}
              mobileScroller={mobileScroller && !showAll}
            />
          ) : (
            <div className="relative overflow-hidden rounded-2xl bg-white py-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-white via-white/80 to-transparent md:w-24" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-white via-white/80 to-transparent md:w-24" />
              <div className="flex flex-col gap-3 md:gap-4">
                <PartnerMarquee
                  partners={rows[0]}
                  activeCategory={activeCategory}
                />
                {rows[1].length ? (
                  <div className="hidden sm:block">
                    <PartnerMarquee
                      partners={rows[1]}
                      activeCategory={activeCategory}
                      reverse
                    />
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
