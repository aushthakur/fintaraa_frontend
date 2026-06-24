"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import {
  buildCreditCardBankPath,
  buildCreditCardDetailPath,
  buildCreditCardEligibilityPath,
  CreditCardProduct,
  fetchCreditCards,
  getCreditCardApplyUrl,
  slugifyCreditCardValue,
  trackBankProductClick,
} from "@/services/bankProducts";

const getCardId = (card: CreditCardProduct) => card._id || card.id || "";

const bankDisplayOrder = [
  "SBI Card",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "IndusInd Bank",
];

const fallbackCreditCards: CreditCardProduct[] = [
  {
    _id: "fallback-sbi-card",
    name: "SBI Cashback Credit Card",
    bankName: "SBI Card",
    image: "/assets/banks/sbi-logo.png",
    shortDescription: "Cashback benefits on everyday online spends.",
    cardType: "Cashback",
    rewardsType: "Cashback",
    welcomeBenefits: "Welcome benefits as per bank policy.",
    rewardStructure: "Cashback and milestone rewards.",
    priorityOrder: 1,
  },
  {
    _id: "fallback-hdfc-card",
    name: "HDFC Millennia Credit Card",
    bankName: "HDFC Bank",
    image: "/assets/banks/hdfc.png",
    shortDescription: "Popular shopping, dining and rewards card.",
    cardType: "Lifestyle",
    rewardsType: "Reward Points",
    welcomeBenefits: "Digital vouchers and partner benefits.",
    rewardStructure: "Reward points on eligible spends.",
    priorityOrder: 2,
  },
  {
    _id: "fallback-icici-card",
    name: "ICICI Platinum Credit Card",
    bankName: "ICICI Bank",
    image: "/assets/banks/icici-logo.png",
    shortDescription: "Simple card for rewards and daily convenience.",
    cardType: "Rewards",
    rewardsType: "Reward Points",
    welcomeBenefits: "Available as per bank policy.",
    rewardStructure: "Points on retail spends.",
    priorityOrder: 3,
  },
  {
    _id: "fallback-axis-card",
    name: "Axis Bank Rewards Credit Card",
    bankName: "Axis Bank",
    image: "/assets/banks/axis-bank.png",
    shortDescription: "Rewards-led card for shopping and travel spends.",
    cardType: "Rewards",
    rewardsType: "EDGE Rewards",
    welcomeBenefits: "Shopping and partner benefits.",
    rewardStructure: "Rewards on eligible purchases.",
    priorityOrder: 4,
  },
  {
    _id: "fallback-kotak-card",
    name: "Kotak League Credit Card",
    bankName: "Kotak Mahindra Bank",
    image: "/assets/banks/kotak.png",
    shortDescription: "Lifestyle card with rewards and offers.",
    cardType: "Lifestyle",
    rewardsType: "Reward Points",
    welcomeBenefits: "Available as per bank policy.",
    rewardStructure: "Points and milestone benefits.",
    priorityOrder: 5,
  },
];

const normalizeBankKey = (bankName?: string) => {
  const value = (bankName || "").toLowerCase();
  if (value.includes("sbi") || value.includes("state bank")) return "sbi";
  if (value.includes("hdfc")) return "hdfc";
  if (value.includes("icici")) return "icici";
  if (value.includes("axis")) return "axis";
  if (value.includes("kotak")) return "kotak";
  if (value.includes("indusind")) return "indusind";
  return slugifyCreditCardValue(value);
};

const mergeWithFallbackCards = (cards: CreditCardProduct[]) => {
  const existingKeys = new Set(
    cards.map((card) => `${card.bankName}-${card.name}`.toLowerCase()),
  );
  const existingBanks = new Set(cards.map((card) => normalizeBankKey(card.bankName)));
  const missingFallbacks = fallbackCreditCards.filter(
    (card) =>
      !existingBanks.has(normalizeBankKey(card.bankName)) &&
      !existingKeys.has(`${card.bankName}-${card.name}`.toLowerCase()),
  );

  return [...cards, ...missingFallbacks];
};

export function MajorBankCreditCards() {
  const router = useRouter();
  const [cards, setCards] = useState<CreditCardProduct[]>([]);
  const [activeBank, setActiveBank] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadCards = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await fetchCreditCards();
        if (!active) return;
        const mergedCards = mergeWithFallbackCards(result);
        setCards(mergedCards);
        setActiveBank((current) => current || mergedCards[0]?.bankName || "");
      } catch {
        if (!active) return;
        setCards(fallbackCreditCards);
        setActiveBank((current) => current || fallbackCreditCards[0]?.bankName || "");
        setError("");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCards();
    return () => {
      active = false;
    };
  }, []);

  const bankTabs = useMemo(
    () =>
      Array.from(new Set(cards.map((card) => card.bankName).filter(Boolean))).sort(
        (a, b) => {
          const aIndex = bankDisplayOrder.indexOf(a);
          const bIndex = bankDisplayOrder.indexOf(b);
          if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        },
      ),
    [cards],
  );

  const activeCards = useMemo(
    () =>
      cards
        .filter((card) => card.bankName === activeBank)
        .sort((a, b) => Number(a.priorityOrder || 999) - Number(b.priorityOrder || 999))
        .slice(0, 4),
    [activeBank, cards],
  );

  const activeBankData = activeCards[0];

  const handleDetails = async (card: CreditCardProduct) => {
    const id = getCardId(card);
    if (id) {
      try {
        await trackBankProductClick(id, "detail");
      } catch {
        // Non-blocking analytics.
      }
    }
    router.push(buildCreditCardDetailPath(card));
  };

  const handleEligibility = (card: CreditCardProduct) => {
    router.push(buildCreditCardEligibilityPath(card));
  };

  const handleApply = async (card: CreditCardProduct) => {
    const id = getCardId(card);
    if (id) {
      try {
        await trackBankProductClick(id, "apply");
      } catch {
        // Tracking should not block redirect to the bank.
      }
    }

    const url = getCreditCardApplyUrl(card);
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      router.push(url);
    }
  };

  return (
    <section className="bg-white px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[20px] font-bold text-[#111111] md:text-[24px]">
            Credit Cards by Major Banks
          </h2>
          <Link
            href="/credit-cards"
            className="flex items-center gap-1 text-[13px] font-medium text-[#08a045] no-underline transition-colors hover:text-[#067e36]"
          >
            View all banks
            <span className="text-[14px]">➔</span>
          </Link>
        </div>

        <div className="mt-5 flex min-w-0 gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {loading ? (
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#667085]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading banks...
            </span>
          ) : bankTabs.length ? (
            bankTabs.map((tab) => {
              const isActive = activeBank === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveBank(tab);
                  }}
                  className={`shrink-0 rounded-full border px-5 py-2 text-[13px] font-medium transition-all ${
                    isActive
                      ? "border-[#08a045] bg-[#08a045] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              );
            })
          ) : null}
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6">
          {error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-[13px] font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          {!loading && !activeCards.length && !error ? (
            <div className="rounded-xl border border-gray-100 bg-[#f8fbff] p-6 text-center text-[13px] font-semibold text-[#667085]">
              Credit cards will appear here once active products are available.
            </div>
          ) : null}

          {activeBank ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-4 sm:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1e73be]/10 text-xl font-bold text-[#1e73be]">
                  {activeBankData?.image ? (
                    <BankLogoImage
                      src={activeBankData.image}
                      alt={activeBank}
                      className="h-10 w-auto max-w-10 object-contain"
                    />
                  ) : (
                    activeBank.slice(0, 1)
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[22px] font-bold text-[#111111]">
                    {activeBank} Credit Cards
                  </h3>
                  <p className="mt-0.5 max-w-xl text-[12px] leading-relaxed text-gray-500">
                    Choose from cards with rewards, cashback, lounge access and
                    lifestyle benefits from {activeBank}.
                  </p>
                </div>
              </div>
              <Link
                href={activeBank ? buildCreditCardBankPath(activeBank) : "/credit-cards"}
                className="flex items-center gap-1 self-start text-[13px] font-medium text-[#08a045] hover:underline sm:self-center"
              >
                View all {activeBank} cards
                <span className="text-[14px]">➔</span>
              </Link>
            </div>
          ) : null}

          {loading ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-82 animate-pulse rounded-[20px] border border-gray-200 bg-white p-5"
                >
                  <div className="h-34 rounded-lg bg-[#eef3f8]" />
                  <div className="mt-4 h-4 w-3/4 rounded bg-[#eef3f8]" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-[#eef3f8]" />
                  <div className="mt-8 h-12 rounded bg-[#eef3f8]" />
                </div>
              ))}
            </div>
          ) : activeCards.length ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {activeCards.map((card) => (
                <article
                  key={getCardId(card) || card.name}
                  className="flex flex-col justify-between rounded-[20px] border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div>
                    <Image
                      width={300}
                      height={180}
                      src="/assets/banks/visa-card.png"
                      alt={card.name}
                      className="h-auto w-full rounded-lg object-cover"
                    />
                    <h4 className="mt-4 text-[16px] font-bold text-[#111111]">
                      {card.name}
                    </h4>
                    <p className="mt-1 text-[12px] text-gray-400">
                      {card.shortDescription || card.subtitle || card.welcomeBenefits}
                    </p>
                    <div className="mt-4 border-t border-gray-50 pt-3">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-gray-800">
                        Key Benefits
                      </div>
                      <div className="mt-2 flex justify-between gap-3 text-[12px]">
                        <span className="font-normal text-gray-400">
                          {card.loungeAccessAvailable ? "Lounge Access" : card.cardType}
                        </span>
                        <span className="font-normal text-gray-400">
                          {card.rewardsType || "Rewards"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-2 pt-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleApply(card)}
                      className="inline-flex h-9.5 items-center justify-center rounded-full bg-[#08a045] px-4 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-[#067e36]"
                    >
                      Apply Now
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDetails(card)}
                      className="inline-flex h-9.5 items-center justify-center rounded-full border border-[#08a045] bg-white px-4 text-[13px] font-medium text-[#08a045] transition-colors hover:bg-[#f3fbf6]"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEligibility(card)}
                      className="inline-flex h-9.5 items-center justify-center rounded-full border border-[#dcebf7] bg-[#f8fbff] px-4 text-[13px] font-medium text-[#005ca8] transition-colors hover:border-[#005ca8] sm:col-span-2"
                    >
                      View Eligibility
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
