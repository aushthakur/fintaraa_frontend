"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeIndianRupee,
  CheckCircle2,
  CreditCard,
  Gift,
  Loader2,
  Plane,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";
import {
  buildCreditCardDetailPath,
  buildCreditCardBankPath,
  buildCreditCardEligibilityPath,
  buildCreditCardTypePath,
  CreditCardProduct,
  EligibilityBreakdown,
  fetchCreditCardById,
  fetchCreditCardEligibility,
  fetchCreditCards,
  getCreditCardApplyUrl,
  isSameCreditCardBank,
  isSameCreditCardType,
  parseCreditCardIdFromSlug,
  slugifyCreditCardValue,
  trackBankProductClick,
} from "@/services/bankProducts";

type Props = {
  bankSlug: string;
  cardTypeSlug: string;
  cardSegment: string;
  mode?: "details" | "eligibility";
};

const isLoggedIn = () => getAuthType() === "user" && Boolean(getAuthToken());

const formatCurrency = (value?: number | string) => {
  const amount =
    typeof value === "number"
      ? value
      : Number(String(value || "").replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return "Lifetime Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const fallbackText = (value: unknown, fallback = "Available as per bank policy.") =>
  String(value || "").trim() || fallback;

const cardBenefits = (card: CreditCardProduct) =>
  [
    ["Welcome Benefits", card.welcomeBenefits, Gift],
    ["Reward Structure", card.rewardStructure, Sparkles],
    ["Cashback Details", card.cashbackDetails, BadgeIndianRupee],
    ["Lounge Access", card.loungeAccess, Plane],
    ["Fuel Benefits", card.fuelBenefits, BadgeIndianRupee],
    ["Movie Benefits", card.movieBenefits, Gift],
    ["Travel Benefits", card.travelBenefits, Plane],
    ["Insurance Benefits", card.insuranceBenefits, ShieldCheck],
  ] as const;

export function CreditCardDetailScreen({
  bankSlug,
  cardTypeSlug,
  cardSegment,
  mode = "details",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [card, setCard] = useState<CreditCardProduct | null>(null);
  const [relatedCards, setRelatedCards] = useState<CreditCardProduct[]>([]);
  const [eligibility, setEligibility] = useState<EligibilityBreakdown | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadCard = async () => {
      setLoading(true);
      setError("");
      try {
        const id = parseCreditCardIdFromSlug(cardSegment);
        let detail: CreditCardProduct | null = null;

        if (/^[a-f0-9]{24}$/i.test(id)) {
          detail = await fetchCreditCardById(id);
        }

        if (!detail) {
          const cards = await fetchCreditCards();
          detail =
            cards.find(
              (item) =>
                isSameCreditCardBank(bankSlug, item.bankName) &&
                isSameCreditCardType(cardTypeSlug, item.cardType) &&
                slugifyCreditCardValue(item.name) ===
                  slugifyCreditCardValue(cardSegment),
            ) || null;
        }

        if (!active) return;
        if (!detail) {
          setError("Credit card details were not found.");
          setCard(null);
          return;
        }

        setCard(detail);
        try {
          await trackBankProductClick(detail._id || detail.id || "", "detail");
        } catch {
          // Non-blocking analytics.
        }

        const allCards = await fetchCreditCards();
        if (!active) return;
        setRelatedCards(
          allCards
            .filter(
              (item) =>
                item._id !== detail?._id &&
                isSameCreditCardBank(bankSlug, item.bankName),
            )
            .slice(0, 3),
        );
      } catch (err) {
        if (!active) return;
        setError((err as Error).message || "Unable to load credit card.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCard();
    return () => {
      active = false;
    };
  }, [bankSlug, cardSegment, cardTypeSlug]);

  useEffect(() => {
    if (!card || mode !== "eligibility" || !isLoggedIn()) return;
    let active = true;

    const loadEligibility = async () => {
      setEligibilityLoading(true);
      try {
        const result = await fetchCreditCardEligibility(card._id || card.id || "");
        if (active) setEligibility(result);
      } catch (err) {
        if (!active) return;
        setEligibility({
          eligible: false,
          score: 0,
          message:
            (err as Error).message || "Unable to calculate eligibility right now.",
          checks: [],
        });
      } finally {
        if (active) setEligibilityLoading(false);
      }
    };

    loadEligibility();
    return () => {
      active = false;
    };
  }, [card, mode]);

  const stats = useMemo(() => {
    if (!card) return [];
    return [
      ["Joining Fee", formatCurrency(card.joiningFee), BadgeIndianRupee],
      ["Annual Fee", formatCurrency(card.annualFee), CreditCard],
      [
        "Minimum Income",
        card.minimumIncome ? formatCurrency(card.minimumIncome) : "As per bank",
        ShieldCheck,
      ],
      [
        "Credit Score",
        card.creditScoreRequirement
          ? `${card.creditScoreRequirement}+`
          : "As per bank",
        Sparkles,
      ],
    ] as const;
  }, [card]);

  const handleApply = async () => {
    if (!card) return;

    const id = card._id || card.id || "";
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

  if (loading) {
    return (
      <main className="bg-[#f8faff] px-4 py-14">
        <div className="mx-auto flex min-h-80 max-w-6xl items-center justify-center rounded-2xl bg-white text-sm font-black text-[#005ca8]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading credit card details...
        </div>
      </main>
    );
  }

  if (error || !card) {
    return (
      <main className="bg-[#f8faff] px-4 py-14">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-100 bg-white p-8 text-center">
          <p className="text-lg font-black text-[#07162d]">
            {error || "Credit card not found."}
          </p>
          <Link
            href="/credit-cards"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#005ca8] px-5 text-sm font-black text-white no-underline"
          >
            Back to Credit Cards
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f8faff] px-4 py-8 text-[#1a1d25] md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={buildCreditCardTypePath(card.bankName, card.cardType)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#d8e3ef] bg-white px-4 text-sm font-black text-[#005ca8] no-underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cards
          </Link>
          <div className="flex flex-wrap gap-2 text-xs font-black">
            <Link
              href={buildCreditCardBankPath(card.bankName)}
              className="rounded-full bg-white px-3 py-2 text-[#005ca8] no-underline"
            >
              {card.bankName}
            </Link>
            <Link
              href={buildCreditCardTypePath(card.bankName, card.cardType)}
              className="rounded-full bg-white px-3 py-2 text-[#005ca8] no-underline"
            >
              {card.cardType || "Credit Card"}
            </Link>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-[#dce9f7] bg-white shadow-[0_18px_55px_rgba(16,24,40,0.07)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="p-5 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                {card.image ? (
                  <BankLogoImage
                    src={card.image}
                    alt={card.bankName}
                    className="h-10 w-auto max-w-32 object-contain"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef6ff] text-[#005ca8]">
                    <CreditCard className="h-5 w-5" />
                  </div>
                )}
                <span className="rounded-full bg-[#e8f4ff] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#005ca8]">
                  {mode === "eligibility" ? "Eligibility" : "Card Details"}
                </span>
                {card.featured ? (
                  <span className="rounded-full bg-[#ecfdf3] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#027a48]">
                    Featured
                  </span>
                ) : null}
              </div>
              <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight text-[#07162d] md:text-5xl">
                {card.name}
              </h1>
              <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#667085] md:text-base">
                {fallbackText(
                  card.shortDescription || card.subtitle || card.welcomeBenefits,
                  `Compare fees, rewards, eligibility and benefits for ${card.name}.`,
                )}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(([label, value, Icon]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[#eef3f8] bg-[#fafcff] p-4"
                  >
                    <Icon className="h-5 w-5 text-[#005ca8]" />
                    <p className="mt-3 text-xs font-black uppercase tracking-wide text-[#98a2b3]">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-black text-[#07162d]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#07162d] p-5 text-white md:p-8">
              <div className="flex min-h-56 flex-col justify-between rounded-3xl bg-gradient-to-br from-[#005ca8] via-[#0b76ca] to-[#102b52] p-6 shadow-[0_25px_60px_rgba(0,92,168,0.25)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
                      {card.bankName}
                    </p>
                    <p className="mt-2 max-w-64 text-xl font-black leading-7">
                      {card.name}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-white/80" />
                </div>
                <div>
                  <p className="font-mono text-sm tracking-[0.26em] text-white/70">
                    **** **** **** 8832
                  </p>
                  <div className="mt-5 flex items-end justify-between">
                    <span className="text-xs font-black uppercase text-white/60">
                      {card.cardType || "Credit"}
                    </span>
                    <span className="text-lg font-black italic">
                      {card.cardNetwork || "CARD"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleApply}
                className="mt-6 h-12 w-full rounded-full bg-[#08a045] text-sm font-black text-white shadow-[0_18px_34px_rgba(8,160,69,0.28)] transition hover:bg-[#067e36]"
              >
                Apply Now
              </button>
              {mode !== "eligibility" ? (
                <Link
                  href={buildCreditCardEligibilityPath(card)}
                  className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-white/20 text-sm font-black text-white no-underline transition hover:bg-white/10"
                >
                  View Eligibility
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        {mode === "eligibility" ? (
          <section className="mt-6 rounded-3xl border border-[#dce9f7] bg-white p-5 shadow-[0_18px_55px_rgba(16,24,40,0.06)] md:p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#005ca8]">
                  Eligibility Result
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#07162d]">
                  {card.name} eligibility check
                </h2>
              </div>
              {!isLoggedIn() ? (
                <Link
                  href={buildLoginRedirectHref({
                    redirectTo: pathname || buildCreditCardEligibilityPath(card),
                    product: slugifyCreditCardValue(card.name),
                  })}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#005ca8] px-5 text-sm font-black text-white no-underline"
                >
                  Login to Check Eligibility
                </Link>
              ) : null}
            </div>

            {!isLoggedIn() ? (
              <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#667085]">
                Login is required to calculate eligibility using your income and
                credit profile. You can still review the bank criteria below.
              </p>
            ) : eligibilityLoading ? (
              <div className="mt-6 flex items-center gap-2 text-sm font-black text-[#005ca8]">
                <Loader2 className="h-5 w-5 animate-spin" />
                Calculating eligibility...
              </div>
            ) : eligibility ? (
              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-black ${
                      eligibility.eligible
                        ? "bg-[#e8f8ef] text-[#12904b]"
                        : "bg-[#fff4e6] text-[#a15c00]"
                    }`}
                  >
                    {eligibility.eligible ? "Eligible" : "Needs Review"} -
                    Match Score {eligibility.score}%
                  </span>
                  <span className="text-sm font-semibold text-[#667085]">
                    {eligibility.message}
                  </span>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {eligibility.checks.map((check) => (
                    <div
                      key={check.key}
                      className="rounded-2xl border border-[#eef3f8] bg-[#fafcff] p-4"
                    >
                      <div className="flex gap-3">
                        {check.passed ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1cb45c]" />
                        ) : (
                          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#f97316]" />
                        )}
                        <div>
                          <p className="text-sm font-black text-[#07162d]">
                            {check.label}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-[#667085]">
                            Required: {check.required || "Not defined"} | Your
                            value: {check.current || "Not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="rounded-3xl border border-[#dce9f7] bg-white p-5 md:p-7">
            <h2 className="text-xl font-black text-[#07162d]">
              Benefits and rewards
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {cardBenefits(card).map(([label, value, Icon]) => (
                <div key={label} className="rounded-2xl bg-[#f8fbff] p-4">
                  <Icon className="h-5 w-5 text-[#005ca8]" />
                  <p className="mt-3 text-sm font-black text-[#07162d]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">
                    {fallbackText(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#dce9f7] bg-white p-5 md:p-7">
            <h2 className="text-xl font-black text-[#07162d]">
              Eligibility criteria
            </h2>
            <ul className="mt-5 space-y-3">
              {(card.eligibilityCriteria || [
                "Minimum income and credit score are checked as per bank policy.",
              ]).map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm font-semibold leading-6 text-[#536273]"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1cb45c]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3 border-t border-[#eef3f8] pt-5 text-sm font-semibold text-[#667085]">
              <p>Processing Time: {fallbackText(card.processingTime, "3-7 working days")}</p>
              <p>Network: {fallbackText(card.cardNetwork, "Bank issued")}</p>
              <p>Reward Type: {fallbackText(card.rewardsType, "Rewards")}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#dce9f7] bg-white p-5 md:p-7">
            <h2 className="text-xl font-black text-[#07162d]">
              Terms and conditions
            </h2>
            <ul className="mt-5 space-y-3">
              {(card.termsAndConditions || [
                "Final approval, fees and limits are subject to bank policy.",
              ]).map((item) => (
                <li key={item} className="flex gap-2 text-sm font-semibold leading-6 text-[#667085]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#005ca8]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-[#dce9f7] bg-white p-5 md:p-7">
            <h2 className="text-xl font-black text-[#07162d]">FAQs</h2>
            <div className="mt-5 space-y-3">
              {(card.faqs || []).length ? (
                card.faqs?.map((faq) => (
                  <div key={faq.question} className="rounded-2xl bg-[#f8fbff] p-4">
                    <p className="text-sm font-black text-[#07162d]">
                      {faq.question}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">
                      {faq.answer}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold leading-6 text-[#667085]">
                  FAQs for this card will appear here once the bank product data
                  is updated.
                </p>
              )}
            </div>
          </div>
        </section>

        {relatedCards.length ? (
          <section className="mt-6 rounded-3xl border border-[#dce9f7] bg-white p-5 md:p-7">
            <h2 className="text-xl font-black text-[#07162d]">
              More {card.bankName} cards
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {relatedCards.map((item) => (
                <Link
                  key={item._id || item.name}
                  href={buildCreditCardDetailPath(item)}
                  className="rounded-2xl border border-[#eef3f8] bg-[#fafcff] p-4 text-[#07162d] no-underline transition hover:border-[#005ca8]"
                >
                  <p className="text-xs font-black text-[#005ca8]">
                    {item.bankName}
                  </p>
                  <p className="mt-2 text-sm font-black">{item.name}</p>
                  <p className="mt-2 text-xs font-semibold text-[#667085]">
                    {item.cardType || "Credit Card"} |{" "}
                    {formatCurrency(item.annualFee)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
