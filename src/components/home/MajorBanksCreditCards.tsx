"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";
import {
  CreditCardProduct,
  fetchCreditCards,
  trackBankProductClick,
} from "@/services/bankProducts";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const getCardId = (card: CreditCardProduct) => card._id || card.id || "";

const loggedIn = () => getAuthType() === "user" && Boolean(getAuthToken());

export function MajorBankCreditCards() {
  const router = useRouter();
  const [cards, setCards] = useState<CreditCardProduct[]>([]);
  const [activeBank, setActiveBank] = useState("");
  const [selectedCard, setSelectedCard] = useState<CreditCardProduct | null>(null);
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
        setCards(result);
        setActiveBank((current) => current || result[0]?.bankName || "");
      } catch (err) {
        if (!active) return;
        setError((err as Error).message || "Unable to load credit cards.");
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
    () => Array.from(new Set(cards.map((card) => card.bankName).filter(Boolean))),
    [cards],
  );

  const activeCards = useMemo(
    () =>
      cards
        .filter((card) => card.bankName === activeBank)
        .sort((a, b) => Number(a.priorityOrder || 999) - Number(b.priorityOrder || 999))
        .slice(0, 3),
    [activeBank, cards],
  );

  const activeBankData = activeCards[0];

  const handleDetails = async (card: CreditCardProduct) => {
    setSelectedCard(card);
    const id = getCardId(card);
    if (!id) return;
    try {
      await trackBankProductClick(id, "detail");
    } catch {
      // Non-blocking analytics.
    }
  };

  const handleApply = async (card: CreditCardProduct) => {
    if (!loggedIn()) {
      router.push(
        buildLoginRedirectHref({
          redirectTo: "/credit-cards",
          product: slugify(card.name),
        }),
      );
      return;
    }

    const id = getCardId(card);
    if (id) {
      try {
        await trackBankProductClick(id, "apply");
      } catch {
        // Continue to product link even if tracking fails.
      }
    }

    const url = card.applyUrl || card.link || "/credit-cards";
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      router.push(url);
    }
  };

  return (
    <section className="bg-white px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-[20px] font-bold text-[#111111] md:text-[24px]">
            Credit Cards by Major Banks
          </h2>
          <a
            href="/credit-cards"
            className="flex items-center gap-1 text-[13px] font-medium text-[#08a045] no-underline transition-colors hover:text-[#067e36]"
          >
            View all banks
            <span className="text-[14px]">➔</span>
          </a>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
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
                    setSelectedCard(null);
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
              <div className="flex items-start gap-4 sm:items-center">
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
                <div>
                  <h3 className="text-[22px] font-bold text-[#111111]">
                    {activeBank} Credit Cards
                  </h3>
                  <p className="mt-0.5 max-w-xl text-[12px] leading-relaxed text-gray-400">
                    Choose from cards with rewards, cashback, lounge access and
                    lifestyle benefits from {activeBank}.
                  </p>
                </div>
              </div>
              <a
                href="/credit-cards"
                className="flex items-center gap-1 self-start text-[13px] font-medium text-[#08a045] hover:underline sm:self-center"
              >
                View all {activeBank} cards
                <span className="text-[14px]">➔</span>
              </a>
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
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

                  <div className="mt-6 flex items-center justify-between gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleDetails(card)}
                      className="flex items-center gap-1 text-[13px] font-medium text-[#08a045] hover:underline"
                    >
                      View Details
                      <span className="text-[13px]">➔</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApply(card)}
                      className="inline-flex h-9.5 items-center justify-center rounded-full bg-[#08a045] px-6 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-[#067e36]"
                    >
                      Apply Now
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {selectedCard ? (
            <div className="mt-6 rounded-2xl border border-[#dcebf7] bg-[#f8fbff] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-bold text-[#08a045]">
                    {selectedCard.bankName}
                  </p>
                  <h4 className="mt-1 text-[18px] font-extrabold text-[#111111]">
                    {selectedCard.name}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCard(null)}
                  className="rounded-full border border-[#d5e1eb] px-4 py-2 text-[12px] font-bold text-[#667085]"
                >
                  Close
                </button>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  ["Welcome", selectedCard.welcomeBenefits],
                  ["Rewards", selectedCard.rewardStructure],
                  ["Eligibility", selectedCard.eligibilityCriteria?.[0]],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-white p-3">
                    <p className="text-[11px] font-bold text-[#98a2b3]">
                      {label}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold leading-5 text-[#475467]">
                      {value || "Available as per bank policy."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
