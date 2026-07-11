"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeIndianRupee,
  CheckCircle2,
  CreditCard,
  Gift,
  ShieldCheck,
} from "lucide-react";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { slugifyProduct } from "@/lib/productRouting";
import {
  buildCreditCardDetailPath,
  buildCreditCardEligibilityPath,
  type CreditCardProduct,
  fetchCreditCards,
  getCreditCardApplyUrl,
  trackBankProductClick,
} from "@/services/bankProducts";

const getCardId = (card: CreditCardProduct) => card._id || card.id || "";

const ignoredBankWords = new Set([
  "bank",
  "banks",
  "card",
  "cards",
  "limited",
  "ltd",
  "nbfc",
]);

const comparableBankKey = (value: string) =>
  slugifyProduct(value)
    .split("-")
    .filter((part) => part && !ignoredBankWords.has(part))
    .join("-");

const isSameBank = (routeBankSlug: string, cardBankName: string) => {
  const routeKey = comparableBankKey(routeBankSlug);
  const cardKey = comparableBankKey(cardBankName);
  if (!routeKey || !cardKey) return false;
  return (
    routeKey === cardKey ||
    routeKey.includes(cardKey) ||
    cardKey.includes(routeKey)
  );
};

const formatCurrency = (value?: number | string) => {
  const amount =
    typeof value === "number"
      ? value
      : Number(String(value || "").replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return "Nil";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const firstText = (...values: Array<string | undefined>) =>
  values.find((value) => value && value.trim()) ||
  "Available as per bank policy.";

type BankCreditCardsSectionProps = {
  bankName: string;
  bankSlug: string;
};

export function BankCreditCardsSection({
  bankName,
  bankSlug,
}: BankCreditCardsSectionProps) {
  const router = useRouter();
  const [cards, setCards] = useState<CreditCardProduct[]>([]);
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

  const bankCards = useMemo(
    () =>
      cards
        .filter((card) => isSameBank(bankSlug, card.bankName || ""))
        .sort(
          (a, b) =>
            Number(a.priorityOrder || 999) - Number(b.priorityOrder || 999),
        ),
    [bankSlug, cards],
  );

  const logoCard = bankCards.find((card) => card.image);

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
    <section className="bg-[#f7fbff] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-4 border-b border-[#dce9f7] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#005ca8] shadow-[0_10px_28px_rgba(16,24,40,0.06)]">
              {logoCard?.image ? (
                <BankLogoImage
                  src={logoCard.image}
                  alt={bankName}
                  className="h-9 w-auto max-w-11 object-contain"
                />
              ) : (
                <CreditCard className="h-6 w-6" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#005ca8]">
                Bank credit cards
              </p>
              <h2 className="mt-1 text-[24px] font-extrabold tracking-tight text-[#07162d] md:text-[30px]">
                {bankName} Credit Cards
              </h2>
              <p className="mt-2 max-w-3xl text-[14px] font-semibold leading-7 text-[#667085] md:text-[15px]">
                Compare all active {bankName} credit card offers with fees,
                rewards, lifestyle benefits and direct application support.
              </p>
            </div>
          </div>
          <Link
            href="/credit-cards"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#cfe0ef] bg-white px-5 text-[13px] font-extrabold text-[#005ca8] no-underline transition hover:border-[#005ca8]"
          >
            View all banks
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="min-h-78 animate-pulse rounded-2xl border border-[#e2edf6] bg-white p-5"
              >
                <div className="h-30 rounded-xl bg-[#edf4fb]" />
                <div className="mt-5 h-4 w-3/4 rounded bg-[#edf4fb]" />
                <div className="mt-3 h-3 w-full rounded bg-[#edf4fb]" />
                <div className="mt-2 h-3 w-2/3 rounded bg-[#edf4fb]" />
                <div className="mt-8 h-10 rounded-full bg-[#edf4fb]" />
              </div>
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="mt-7 rounded-2xl border border-red-100 bg-red-50 p-5 text-[13px] font-bold text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && !error && !bankCards.length ? (
          <div className="mt-7 rounded-2xl bg-white px-6 py-10 text-center shadow-[0_14px_42px_rgba(16,24,40,0.05)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef6ff] text-[#005ca8]">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-[18px] font-extrabold text-[#07162d]">
              No active {bankName} cards found
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-[14px] font-semibold leading-6 text-[#667085]">
              Once cards are added from the admin panel for this bank, they will
              appear here automatically.
            </p>
          </div>
        ) : null}

        {!loading && bankCards.length ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bankCards.map((card) => (
              <article
                key={getCardId(card) || `${card.bankName}-${card.name}`}
                className="flex min-h-88 flex-col justify-between rounded-2xl border border-[#e2edf6] bg-white p-5 shadow-[0_14px_38px_rgba(16,24,40,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef6ff] text-[#005ca8]">
                        {card.image ? (
                          <BankLogoImage
                            src={card.image}
                            alt={card.bankName}
                            className="h-8 w-auto max-w-9 object-contain"
                          />
                        ) : (
                          <CreditCard className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-extrabold text-[#005ca8]">
                          {card.bankName}
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-[17px] font-extrabold leading-6 text-[#07162d]">
                          {card.name}
                        </h3>
                      </div>
                    </div>
                    {card.featured ? (
                      <span className="shrink-0 rounded-full bg-[#ecfdf3] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#027a48]">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-4 line-clamp-2 text-[13px] font-semibold leading-6 text-[#667085]">
                    {firstText(
                      card.shortDescription,
                      card.subtitle,
                      card.welcomeBenefits,
                    )}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "Joining Fee",
                        value: formatCurrency(card.joiningFee),
                        icon: BadgeIndianRupee,
                      },
                      {
                        label: "Annual Fee",
                        value: formatCurrency(card.annualFee),
                        icon: CreditCard,
                      },
                      {
                        label: "Rewards",
                        value: card.rewardsType || card.cardType || "Rewards",
                        icon: Gift,
                      },
                      {
                        label: "Network",
                        value: card.cardNetwork || "Bank issued",
                        icon: ShieldCheck,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="rounded-xl border border-[#eef3f8] bg-[#fafcff] p-3"
                        >
                          <Icon className="h-4 w-4 text-[#005ca8]" />
                          <p className="mt-2 text-[10px] font-extrabold uppercase tracking-wide text-[#98a2b3]">
                            {item.label}
                          </p>
                          <p className="mt-1 line-clamp-1 text-[12px] font-extrabold text-[#07162d]">
                            {item.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 space-y-2">
                    {[
                      card.welcomeBenefits,
                      card.cashbackDetails,
                      card.loungeAccess || card.travelBenefits,
                    ]
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((benefit) => (
                        <div
                          key={String(benefit)}
                          className="flex gap-2 text-[12px] font-semibold leading-5 text-[#536273]"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1cb45c]" />
                          <span className="line-clamp-2">{benefit}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleDetails(card)}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#cfe0ef] bg-white px-4 text-[13px] font-extrabold text-[#005ca8] transition hover:border-[#005ca8]"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApply(card)}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#08a045] px-4 text-[13px] font-extrabold text-white transition hover:bg-[#067e36]"
                  >
                    Apply Now
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEligibility(card)}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#dce9f7] bg-[#f8fbff] px-4 text-[13px] font-extrabold text-[#005ca8] transition hover:border-[#005ca8] sm:col-span-2"
                  >
                    View Eligibility
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
