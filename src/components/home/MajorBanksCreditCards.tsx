"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Gift,
  // Heart,
  Loader2,
  Sparkles,
  Star,
  Tags,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import {
  buildCreditCardEligibilityPath,
  CreditCardProduct,
  fetchCreditCards,
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

const bankLogoFallbacks: Record<string, string> = {
  sbi: "/assets/banks/sbi-logo.png",
  hdfc: "/assets/banks/hdfc.png",
  icici: "/assets/banks/icici-logo.png",
  axis: "/assets/banks/axis-bank.png",
  kotak: "/assets/banks/kotak-logo.png",
  indusind: "/assets/banks/indusind.png",
};

const fallbackCreditCards: CreditCardProduct[] = [
  {
    _id: "fallback-sbi-card",
    name: "SBI Cashback Credit Card",
    bankName: "SBI Card",
    image: "/assets/banks/sbi-logo.png",
    shortDescription:
      "Save more on online spends, grocery and everyday shopping.",
    cardType: "Cashback",
    rewardsType: "5% Cashback",
    welcomeBenefits: "Welcome voucher",
    rewardStructure: "1% cashback on other spends",
    annualFee: 999,
    joiningFee: 999,
    priorityOrder: 1,
  },
  {
    _id: "fallback-hdfc-card",
    name: "HDFC Millennia Credit Card",
    bankName: "HDFC Bank",
    image: "/assets/banks/hdfc.png",
    shortDescription: "Popular shopping, dining and lifestyle rewards card.",
    cardType: "Lifestyle",
    rewardsType: "Reward Points",
    welcomeBenefits: "Digital vouchers",
    rewardStructure: "Rewards on partner spends",
    annualFee: 1000,
    joiningFee: 1000,
    priorityOrder: 2,
  },
  {
    _id: "fallback-icici-card",
    name: "ICICI Platinum Credit Card",
    bankName: "ICICI Bank",
    image: "/assets/banks/icici-logo.png",
    shortDescription:
      "Simple card for rewards, convenience and daily payments.",
    cardType: "Rewards",
    rewardsType: "Reward Points",
    welcomeBenefits: "Bank policy benefits",
    rewardStructure: "Points on retail spends",
    annualFee: 499,
    joiningFee: 499,
    priorityOrder: 3,
  },
  {
    _id: "fallback-axis-card",
    name: "Axis Bank Rewards Credit Card",
    bankName: "Axis Bank",
    image: "/assets/banks/axis-bank.png",
    shortDescription: "Rewards-led card for shopping, travel and dining.",
    cardType: "Rewards",
    rewardsType: "EDGE Rewards",
    welcomeBenefits: "Shopping benefits",
    rewardStructure: "Rewards on eligible purchases",
    annualFee: 750,
    joiningFee: 750,
    priorityOrder: 4,
  },
  {
    _id: "fallback-kotak-card",
    name: "Kotak League Credit Card",
    bankName: "Kotak Mahindra Bank",
    image: "/assets/banks/kotak.png",
    shortDescription: "Lifestyle card with points, milestone perks and offers.",
    cardType: "Lifestyle",
    rewardsType: "Reward Points",
    welcomeBenefits: "Partner benefits",
    rewardStructure: "Points and milestone benefits",
    annualFee: 999,
    joiningFee: 999,
    priorityOrder: 5,
  },
  {
    _id: "fallback-indusind-card",
    name: "IndusInd Legend Credit Card",
    bankName: "IndusInd Bank",
    image: "/assets/banks/indusind.png",
    shortDescription: "Premium lifestyle card with travel and reward benefits.",
    cardType: "Lifestyle",
    rewardsType: "Reward Points",
    welcomeBenefits: "Lifestyle privileges",
    rewardStructure: "Rewards on eligible spends",
    annualFee: 9999,
    joiningFee: 9999,
    priorityOrder: 6,
  },
];

const cardBadges = [
  { label: "Popular", className: "text-[#b54708]", icon: Sparkles },
  { label: "Best for cashback", className: "text-[#087443]", icon: Star },
  { label: "Premium", className: "text-[#6941c6]", icon: Gift },
  { label: "Best for shopping", className: "text-[#c01048]", icon: Tags },
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
  const existingBanks = new Set(
    cards.map((card) => normalizeBankKey(card.bankName)),
  );
  const missingFallbacks = fallbackCreditCards.filter(
    (card) =>
      !existingBanks.has(normalizeBankKey(card.bankName)) &&
      !existingKeys.has(`${card.bankName}-${card.name}`.toLowerCase()),
  );

  return [...cards, ...missingFallbacks];
};

const formatFee = (value?: string | number) => {
  if (value === undefined || value === null || value === "") return "₹499";
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return `₹${numeric.toLocaleString("en-IN")}`;
  return String(value);
};

// const featureValue = (card: CreditCardProduct, fallback: string) =>
//   card.cashbackDetails ||
//   card.rewardStructure ||
//   card.rewardsType ||
//   card.welcomeBenefits ||
//   fallback;

const getBankLogoSrc = (bankName: string, cards: CreditCardProduct[]) => {
  const bankKey = normalizeBankKey(bankName);
  const matchingCard = cards.find(
    (card) => normalizeBankKey(card.bankName) === bankKey && card.image,
  );

  return matchingCard?.image || bankLogoFallbacks[bankKey];
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
        setActiveBank(
          (current) => current || fallbackCreditCards[0]?.bankName || "",
        );
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

  const bankTabs = useMemo(() => {
    const names = Array.from(
      new Set(
        [...bankDisplayOrder, ...cards.map((card) => card.bankName)].filter(
          Boolean,
        ),
      ),
    );
    return names.sort((a, b) => {
      const aIndex = bankDisplayOrder.indexOf(a);
      const bIndex = bankDisplayOrder.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [cards]);

  const activeCards = useMemo(
    () =>
      cards
        .filter(
          (card) =>
            normalizeBankKey(card.bankName) === normalizeBankKey(activeBank),
        )
        .sort(
          (a, b) =>
            Number(a.priorityOrder || 999) - Number(b.priorityOrder || 999),
        )
        .slice(0, 4),
    [activeBank, cards],
  );

  const activeBankLogoSrc = useMemo(
    () => (activeBank ? getBankLogoSrc(activeBank, cards) : ""),
    [activeBank, cards],
  );

  const handleEligibility = async (card: CreditCardProduct) => {
    const id = getCardId(card);
    if (id) {
      try {
        await trackBankProductClick(id, "apply");
      } catch {
        // Non-blocking analytics.
      }
    }
    router.push(buildCreditCardEligibilityPath(card));
  };

  return (
    <section className="bg-white px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl overflow-hidden rounded-2xl">
        <div className="pb-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="min-w-0 max-w-3xl flex-1 text-[22px] font-bold leading-tight tracking-tight text-gray-900 sm:text-[32px] md:text-[38px]">
              Find the Right Credit Card
              {/* <span className="text-[#075cde]">Top Banks</span> */}
            </h2>
            <Link
              href="/credit-cards"
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#e9f2ff] px-3 text-[12px] font-bold leading-none text-[#075cde] no-underline transition hover:bg-[#d9eaff] sm:h-10 sm:gap-2 sm:bg-[#075cde] sm:px-5 sm:text-[13px] sm:text-white sm:hover:bg-[#064cb8]"
            >
              <span className="hidden sm:inline">View All Cards</span>
              <span className="sm:hidden">View</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {loading ? (
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#667085]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading banks...
              </span>
            ) : (
              bankTabs.map((tab) => {
                const isActive = activeBank === tab;
                const logoSrc = getBankLogoSrc(tab, cards);
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveBank(tab)}
                    className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border px-4 text-[13px] font-bold transition-all ${
                      isActive
                        ? "border-[#075cde] bg-[#e9f2ff] text-[#075cde]"
                        : "border-[#dceaf7] bg-white text-[#52657d] hover:border-[#075cde]"
                    }`}
                  >
                    {logoSrc ? (
                      <BankLogoImage
                        src={logoSrc}
                        alt={tab}
                        className="h-5 w-7 object-contain"
                        unoptimized
                      />
                    ) : null}
                    {tab}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white py-6">
          {error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-[13px] font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          {activeBank ? (
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-4 sm:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e9f2ff] text-xl font-bold text-[#075cde]">
                  {activeBankLogoSrc ? (
                    <BankLogoImage
                      src={activeBankLogoSrc}
                      alt={activeBank}
                      className="h-9 w-auto max-w-10 object-contain"
                      unoptimized
                    />
                  ) : (
                    activeBank.slice(0, 1)
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[22px] font-bold text-[#07162d]">
                    {activeBank} Credit Cards
                  </h3>
                  {/* <p className="mt-1 max-w-xl text-[13px] font-semibold leading-6 text-[#61748f]">
                    Great benefits, transparent fees and one clear eligibility
                    step for every card.
                  </p> */}
                </div>
              </div>
            </div>
          ) : null}

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-92 animate-pulse rounded-xl border border-[#e2edf8] bg-white p-5"
                />
              ))}
            </div>
          ) : activeCards.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {activeCards.map((card, index) => {
                const badge = cardBadges[index % cardBadges.length];
                const BadgeIcon = badge.icon;
                return (
                  <article
                    key={getCardId(card) || card.name}
                    className="flex flex-col justify-between rounded-xl border border-[#e2edf8] bg-white p-4 transition-colors hover:border-[#bcd8f4]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide ${badge.className}`}
                        >
                          <BadgeIcon className="h-3.5 w-3.5" />
                          {badge.label}
                        </span>
                        {/* <button
                          type="button"
                          aria-label={`Save ${card.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dceaf7] text-[#98a2b3] transition hover:border-[#075cde] hover:text-[#075cde]"
                        >
                          <Heart className="h-4 w-4" />
                        </button> */}
                      </div>

                      <div className="relative mt-4 aspect-[1.58/1] overflow-hidden rounded-2xl bg-[#0b315f]">
                        <Image
                          width={360}
                          height={228}
                          src="/assets/banks/visa-card.png"
                          alt={card.name}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                        {card.image ? (
                          <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-2 py-1">
                            <BankLogoImage
                              src={card.image}
                              alt={card.bankName}
                              className="h-5 w-14 object-contain"
                              unoptimized
                            />
                          </div>
                        ) : null}
                      </div>

                      <h4 className="mt-4 text-[15px] font-bold leading-snug text-[#07162d]">
                        {card.name}
                      </h4>
                      <p className="mt-1 line-clamp-2 min-h-10 text-[12px] font-semibold leading-5 text-[#61748f]">
                        {card.shortDescription ||
                          card.subtitle ||
                          card.welcomeBenefits}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {[
                          ["Annual Fee", formatFee(card.annualFee)],
                          ["Joining Fee", formatFee(card.joiningFee)],
                          // [
                          //   card.rewardsType ? "Rewards" : "Benefit",
                          //   featureValue(card, "Reward points"),
                          // ],
                          // ["Approval", card.processingTime || "Instant check"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-xl bg-white">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-[#8090a4]">
                              {label}
                            </p>
                            <p className="mt-1 line-clamp-2 text-[12px] font-bold text-[#07162d]">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEligibility(card)}
                      className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#075cde] px-4 text-[13px] font-semibold text-white transition hover:bg-[#064cb8]"
                    >
                      Check eligibility
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-[#dceaf7] bg-white p-6 text-center text-[13px] font-semibold text-[#667085]">
              Credit cards will appear here once active products are available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
