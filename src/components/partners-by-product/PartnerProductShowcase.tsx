"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  fetchCreditCards,
  type CreditCardProduct,
} from "@/services/bankProducts";

const productTabs = [
  "Credit Card Partners",
  "Featured Partners",
  "Rewards Partners",
] as const;

const fallbackPartners = [
  { name: "State Bank of India", src: "/assets/banks/sbi.png", count: 0 },
  { name: "ICICI Bank", src: "/assets/banks/ICICI-Bank.png", count: 0 },
  { name: "Kotak Bank", src: "/assets/banks/kotak.png", count: 0 },
  { name: "IndusInd Bank", src: "/assets/banks/indusind.png", count: 0 },
];

const bankLogo = (bankName: string) => {
  const slug = bankName.toLowerCase();
  if (slug.includes("hdfc")) return "/assets/banks/hdfc.png";
  if (slug.includes("icici")) return "/assets/banks/icici.png";
  if (slug.includes("kotak")) return "/assets/banks/kotak.png";
  if (slug.includes("sbi") || slug.includes("state bank"))
    return "/assets/banks/sbi.png";
  if (slug.includes("pnb") || slug.includes("punjab"))
    return "/assets/banks/pnb.png";
  if (slug.includes("indus")) return "/assets/banks/indusind.png";
  return "/assets/banks/indian.png";
};

const isRewardsCard = (card: CreditCardProduct) =>
  [card.cardType, card.rewardsType, card.rewardStructure, card.cashbackDetails]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .match(/reward|cashback|travel|lounge|points/);

type PartnerLogo = {
  name: string;
  src: string;
  count: number;
};

const buildPartners = (cards: CreditCardProduct[]): PartnerLogo[] => {
  const byBank = new Map<string, number>();
  cards.forEach((card) => {
    const bank = card.bankName?.trim();
    if (!bank) return;
    byBank.set(bank, (byBank.get(bank) || 0) + 1);
  });
  return Array.from(byBank.entries())
    .map(([name, count]) => ({ name, count, src: bankLogo(name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

function LogoTile({
  src,
  name,
  count,
}: {
  src: string;
  name: string;
  count: number;
}) {
  return (
    <div className="flex h-22.5 items-center justify-between gap-4 rounded-xl border border-[#e6eaf0] bg-white px-5 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
      <Image
        src={src}
        alt={name}
        width={104}
        height={40}
        unoptimized
        className="h-auto max-h-10 w-auto object-contain"
      />
      {count ? (
        <span className="rounded-full bg-[#eef7ff] px-2.5 py-1 text-[11px] font-black text-[#005ca8]">
          {count} cards
        </span>
      ) : null}
    </div>
  );
}

export function PartnerProductShowcase() {
  const [activeTab, setActiveTab] = useState<(typeof productTabs)[number]>(
    productTabs[0],
  );
  const [cards, setCards] = useState<CreditCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchCreditCards()
      .then((result) => {
        if (!active) return;
        setCards(result);
        setError("");
      })
      .catch((err) => {
        if (!active) return;
        setCards([]);
        setError((err as Error).message || "Unable to load partners.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const visiblePartners = useMemo(() => {
    const filtered =
      activeTab === "Featured Partners"
        ? cards.filter((card) => card.featured)
        : activeTab === "Rewards Partners"
          ? cards.filter(isRewardsCard)
          : cards;

    const partners = buildPartners(filtered);
    return partners.length ? partners : buildPartners(cards);
  }, [activeTab, cards]);

  const partnerRows = useMemo(() => {
    const source = visiblePartners.length ? visiblePartners : fallbackPartners;
    const rows: PartnerLogo[][] = [];
    for (let index = 0; index < source.length; index += 4) {
      rows.push(source.slice(index, index + 4));
    }
    return rows.slice(0, 4);
  }, [visiblePartners]);

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
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-22.5 animate-pulse rounded-2xl bg-[#eef3f8]"
              />
            ))
          ) : error ? (
            <div className="rounded-2xl bg-[#fff7ed] px-5 py-5 text-[13px] font-bold text-[#b45309]">
              {error}
            </div>
          ) : partnerRows.length ? (
            partnerRows.map((row, index) => (
              <div
                key={`${activeTab}-row-${index}`}
                className="rounded-2xl border border-[#e5e8ef] bg-white px-5 py-5 shadow-[0_4px_18px_rgba(15,23,42,0.04)]"
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-center">
                  {row.map((logo) => (
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
            ))
          ) : (
            <div className="rounded-2xl bg-[#f8fbff] px-6 py-8 text-center">
              <Loader2 className="mx-auto h-6 w-6 text-[#005ca8]" />
              <p className="mt-3 text-[14px] font-bold text-[#667085]">
                Partner data will appear here once cards are published from
                admin.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
