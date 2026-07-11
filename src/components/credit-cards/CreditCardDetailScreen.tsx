"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeIndianRupee,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  ExternalLink,
  Fuel,
  Gift,
  Loader2,
  LockKeyhole,
  Plane,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Ticket,
  Wifi,
  XCircle,
} from "lucide-react";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import {
  buildCreditCardTypePath,
  buildCreditCardDetailPath,
  buildCreditCardEligibilityPath,
  fetchCreditCards,
  type CreditCardProduct,
  fetchCreditCardById,
  isSameCreditCardType,
  type EligibilityBreakdown,
  isSameCreditCardBank,
  getCreditCardApplyUrl,
  trackBankProductClick,
  slugifyCreditCardValue,
  parseCreditCardIdFromSlug,
  fetchCreditCardEligibility,
} from "@/services/bankProducts";

type Props = {
  bankSlug: string;
  cardTypeSlug: string;
  cardSegment: string;
  mode?: "details" | "eligibility";
};

type BenefitItem = {
  label: string;
  value?: string;
  icon: LucideIcon;
};

const isLoggedIn = () => getAuthType() === "user" && Boolean(getAuthToken());

const formatCurrency = (
  value?: number | string,
  missingLabel = "As per bank",
) => {
  if (value === undefined || value === null || String(value).trim() === "") {
    return missingLabel;
  }

  const rawValue = String(value).trim();
  const numericValue = rawValue.replace(/[^0-9.]/g, "");
  if (!numericValue) return rawValue;

  const amount = Number(numericValue);
  if (!Number.isFinite(amount)) return rawValue || missingLabel;
  if (amount === 0) return "Lifetime Free";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const fallbackText = (
  value: unknown,
  fallback = "Available as per bank policy.",
) => String(value || "").trim() || fallback;

const normaliseLoadError = (error: unknown) => {
  const message = String((error as Error)?.message || "").trim();
  if (!message || /network|no response|failed to fetch/i.test(message)) {
    return "We could not load this credit card right now. Please check your connection and try again.";
  }
  return message;
};

const cardBenefits = (card: CreditCardProduct): BenefitItem[] =>
  [
    { label: "Welcome benefit", value: card.welcomeBenefits, icon: Gift },
    { label: "Reward structure", value: card.rewardStructure, icon: Sparkles },
    {
      label: "Cashback and redemption",
      value: card.cashbackDetails,
      icon: BadgeIndianRupee,
    },
    { label: "Lounge access", value: card.loungeAccess, icon: Plane },
    { label: "Fuel benefit", value: card.fuelBenefits, icon: Fuel },
    {
      label: "Movies and entertainment",
      value: card.movieBenefits,
      icon: Ticket,
    },
    { label: "Travel benefit", value: card.travelBenefits, icon: Plane },
    {
      label: "Protection benefits",
      value: card.insuranceBenefits,
      icon: ShieldCheck,
    },
  ].filter((benefit) => String(benefit.value || "").trim());

function ProductCardArtwork({
  card,
  compact = false,
  animated = false,
}: {
  card: CreditCardProduct;
  compact?: boolean;
  animated?: boolean;
}) {
  const logo = String(card.image || "").trim();
  const initials = card.bankName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <motion.div
      animate={animated ? { y: [0, -5, 0] } : undefined}
      whileHover={{ y: -3, rotate: compact ? 0 : -0.5 }}
      transition={
        animated
          ? { duration: 6, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }
          : { duration: 0.22 }
      }
      className={`relative isolate aspect-[1.586] w-full overflow-hidden rounded-lg border border-[#b9ddef] bg-[#edf8ff] ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <span className="absolute inset-y-0 right-0 w-[38%] bg-[#0878c9]" />
      <span className="absolute -right-7 top-0 h-full w-24 -skew-x-12 bg-[#00a6ce]" />
      <span className="absolute bottom-0 left-0 h-[22%] w-[72%] bg-[#d3f1f8]" />
      <span className="absolute bottom-[22%] left-0 h-1 w-[56%] bg-[#f2b84b]" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-sm bg-white px-2">
              {logo ? (
                <BankLogoImage
                  src={logo}
                  alt={`${card.bankName} logo`}
                  className="h-7 w-10"
                  sizes="40px"
                  unoptimized={/^https?:\/\//i.test(logo)}
                />
              ) : (
                <span className="text-xs font-bold text-[#075fae]">
                  {initials}
                </span>
              )}
            </span>
            <span
              className={`truncate font-bold text-[#07345a] ${
                compact ? "text-xs" : "text-sm"
              }`}
            >
              {card.bankName}
            </span>
          </div>
          <Wifi className="h-5 w-5 rotate-90 text-white" aria-hidden="true" />
        </div>

        <div className="relative">
          <span className="mb-3 flex h-7 w-10 items-center justify-center rounded-sm bg-[#ffd76b] text-[#7a5b00]">
            <CreditCard className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0 max-w-[70%]">
              <p
                className={`line-clamp-2 font-bold leading-snug text-[#062a4b] ${
                  compact ? "text-xs" : "text-sm sm:text-base"
                }`}
              >
                {card.name}
              </p>
              <p className="mt-1 truncate text-[10px] font-semibold uppercase text-[#416c8c]">
                {card.cardType || "Credit Card"}
              </p>
            </div>
            <p
              className={`shrink-0 font-bold text-white ${
                compact ? "text-xs" : "text-sm sm:text-base"
              }`}
            >
              {card.cardNetwork || "CARD"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase text-[#0878c9]">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-[#082b4c] md:text-[30px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-[#557086] md:text-base md:leading-7">
          {description}
        </p>
      ) : null}
    </div>
  );
}

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
  const [authResolved, setAuthResolved] = useState(false);
  const [viewerLoggedIn, setViewerLoggedIn] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setViewerLoggedIn(isLoggedIn());
      setAuthResolved(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

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
          setError("This credit card is no longer available.");
          setCard(null);
          return;
        }

        setCard(detail);
        void trackBankProductClick(
          detail._id || detail.id || "",
          "detail",
        ).catch(() => undefined);

        try {
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
        } catch {
          if (active) setRelatedCards([]);
        }
      } catch (loadError) {
        if (!active) return;
        setCard(null);
        setError(normaliseLoadError(loadError));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCard();
    return () => {
      active = false;
    };
  }, [bankSlug, cardSegment, cardTypeSlug, retryCount]);

  useEffect(() => {
    if (!card || mode !== "eligibility" || !authResolved || !viewerLoggedIn) {
      return;
    }

    let active = true;

    const loadEligibility = async () => {
      setEligibility(null);
      setEligibilityLoading(true);
      try {
        const result = await fetchCreditCardEligibility(
          card._id || card.id || "",
        );
        if (active) setEligibility(result);
      } catch (eligibilityError) {
        if (!active) return;
        setEligibility({
          eligible: false,
          score: 0,
          message:
            (eligibilityError as Error).message ||
            "Unable to calculate eligibility right now.",
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
  }, [authResolved, card, mode, viewerLoggedIn]);

  const stats = useMemo(() => {
    if (!card) return [];
    return [
      {
        label: "Joining fee",
        value: formatCurrency(card.joiningFee),
        icon: BadgeIndianRupee,
      },
      {
        label: "Annual fee",
        value: formatCurrency(card.annualFee),
        icon: CreditCard,
      },
      {
        label: "Minimum income",
        value: card.minimumIncome
          ? `${formatCurrency(card.minimumIncome)} / month`
          : fallbackText(card.incomeRequirementBucket, "As per bank"),
        icon: ShieldCheck,
      },
      {
        label: "Preferred score",
        value: card.creditScoreRequirement
          ? `${card.creditScoreRequirement}+`
          : "As per bank",
        icon: Sparkles,
      },
    ];
  }, [card]);

  const handleApply = async () => {
    if (!card) return;

    const id = card._id || card.id || "";
    if (id) {
      try {
        await trackBankProductClick(id, "apply");
      } catch {
        // Analytics must not block the bank redirect.
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
      <main className="bg-white text-[#082b4c]">
        <div className="border-b border-[#dceaf4] px-4 py-4 md:px-6">
          <div className="mx-auto h-5 max-w-9xl animate-pulse rounded-sm bg-[#e8f3fa]" />
        </div>
        <section className="bg-[#f1f8fd] px-4 py-12 md:px-6 md:py-16">
          <div className="mx-auto grid max-w-9xl gap-12 lg:grid-cols-2 lg:items-center">
            <div className="animate-pulse">
              <div className="h-4 w-36 rounded-sm bg-[#d8eaf6]" />
              <div className="mt-6 h-10 max-w-xl rounded-sm bg-[#cfe5f3]" />
              <div className="mt-3 h-10 max-w-md rounded-sm bg-[#cfe5f3]" />
              <div className="mt-6 h-5 max-w-lg rounded-sm bg-[#dcebf4]" />
              <div className="mt-3 h-5 max-w-md rounded-sm bg-[#dcebf4]" />
              <div className="mt-8 flex gap-3">
                <div className="h-12 w-36 rounded-lg bg-[#bddcf0]" />
                <div className="h-12 w-40 rounded-lg bg-[#d7eaf6]" />
              </div>
            </div>
            <div className="mx-auto aspect-[1.586] w-full max-w-md animate-pulse rounded-lg bg-[#d7ebf7]" />
          </div>
        </section>
        <div className="flex min-h-40 items-center justify-center text-sm font-semibold text-[#0878c9]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
          Loading card details
        </div>
      </main>
    );
  }

  if (error || !card) {
    return (
      <main className="bg-white px-4 py-16 text-[#082b4c] md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#edf7fd] text-[#0878c9]">
            <CreditCard className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-bold md:text-3xl">
            Card details are unavailable
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5b7488] md:text-base">
            {error || "This credit card could not be found."}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0878c9] px-5 text-sm font-bold text-white transition-colors hover:bg-[#0568af]"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
            <Link
              href="/credit-cards"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#bfd8e8] bg-white px-5 text-sm font-bold text-[#075fae] no-underline transition-colors hover:bg-[#f4faff]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to credit cards
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const availableBenefits = cardBenefits(card);
  const benefitsToRender: BenefitItem[] = availableBenefits.length
    ? availableBenefits
    : [
        {
          label: "Card benefits",
          value: "Benefits are available as per bank policy.",
          icon: Gift,
        },
        {
          label: "Rewards",
          value: fallbackText(
            card.rewardsType,
            "Rewards details are available as per bank policy.",
          ),
          icon: Sparkles,
        },
      ];
  const topFeatures = (card.featuresList || []).filter(Boolean).slice(0, 3);
  const eligibilityCriteria = card.eligibilityCriteria?.length
    ? card.eligibilityCriteria
    : ["Income, employment and bureau checks apply as per bank policy."];
  const eligibilityNotes = Array.from(
    new Set(
      (card.eligibilityTermsAndConditions || []).filter(
        (item) => !eligibilityCriteria.includes(item),
      ),
    ),
  );
  const terms = card.termsAndConditions?.length
    ? card.termsAndConditions
    : ["Final approval, fees and credit limit are subject to bank policy."];
  const quickDetails = [
    {
      label: "Monthly income",
      value: card.minimumIncome
        ? `${formatCurrency(card.minimumIncome)}+`
        : fallbackText(card.incomeRequirementBucket, "As per bank"),
    },
    {
      label: "Credit score",
      value: card.creditScoreRequirement
        ? `${card.creditScoreRequirement}+ preferred`
        : "As per bank",
    },
    {
      label: "Processing time",
      value: fallbackText(card.processingTime, "As per bank"),
    },
    {
      label: "Card network",
      value: fallbackText(card.cardNetwork, "Bank issued"),
    },
    {
      label: "Reward type",
      value: fallbackText(card.rewardsType, "Bank rewards"),
    },
    {
      label: "Best suited for",
      value: fallbackText(card.cardType, "Everyday spends"),
    },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-white pb-20 text-[#102f49] lg:pb-0">
        <section
          id="overview"
          className="relative overflow-hidden bg-[#f1f8fd]"
        >
          <span className="absolute inset-y-0 right-0 hidden w-[28%] bg-[#e0f2fb] lg:block" />
          <span className="absolute right-[23%] top-0 hidden h-full w-12 -skew-x-12 bg-[#d3edf8] lg:block" />
          <div className="relative mx-auto grid max-w-9xl gap-10 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.82fr)] lg:items-center lg:gap-16 lg:py-20">
            <motion.div
              initial={{ y: 14 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="min-w-0"
            >
              <h1 className="mt-4 max-w-3xl text-[32px] font-bold leading-[1.16] text-[#062b4d] sm:text-[36px] md:text-[40px] lg:text-[44px]">
                {card.name}
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#506d84] md:text-base">
                {fallbackText(
                  card.shortDescription ||
                    card.subtitle ||
                    card.welcomeBenefits,
                  `Compare fees, rewards, eligibility and benefits for ${card.name}.`,
                )}
              </p>

              {topFeatures.length ? (
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {topFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm font-semibold leading-5 text-[#214b69]"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#07966f]"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  type="button"
                  onClick={handleApply}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0878c9] px-6 text-sm font-bold text-white transition-colors hover:bg-[#0568af]"
                >
                  Apply now
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </motion.button>
                {mode !== "eligibility" ? (
                  <motion.div whileHover={{ y: -2 }}>
                    <Link
                      href={buildCreditCardEligibilityPath(card)}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#9fcbe2] bg-white px-6 text-sm font-bold text-[#075fae] no-underline transition-colors hover:bg-[#eaf6fc] sm:w-auto"
                    >
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      Check eligibility
                    </Link>
                  </motion.div>
                ) : null}
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#6b8192]">
                <LockKeyhole
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#078b68]"
                  aria-hidden="true"
                />
                You will continue to {card.bankName} to complete the
                application.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 18, rotate: 0.8 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
              className="mx-auto w-full max-w-110"
            >
              <ProductCardArtwork card={card} animated />
              <div className="mt-5 grid grid-cols-2 gap-4 px-1 text-center">
                <div>
                  <p className="text-xs text-[#6b8192]">Reward type</p>
                  <p className="mt-1 text-sm font-bold text-[#0b426b]">
                    {fallbackText(card.rewardsType, "Bank rewards")}
                  </p>
                </div>
                <div className="border-l border-[#bed9e8]">
                  <p className="text-xs text-[#6b8192]">Decision timeline</p>
                  <p className="mt-1 text-sm font-bold text-[#0b426b]">
                    {fallbackText(card.processingTime, "As per bank")}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          aria-label="Card fee and eligibility summary"
          className="border-y border-[#dceaf4] bg-white"
        >
          <div className="mx-auto grid max-w-9xl grid-cols-2 px-4 md:px-6 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }, index) => (
              <div
                key={label}
                className={`flex min-w-0 items-start gap-3 px-2 py-5 sm:px-5 lg:py-6 ${
                  index % 2 === 1 ? "border-l border-[#e0ebf2]" : ""
                } ${index >= 2 ? "border-t border-[#e0ebf2] lg:border-t-0" : ""} ${
                  index > 0 ? "lg:border-l lg:border-[#e0ebf2]" : ""
                }`}
              >
                <Icon
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#0878c9]"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase text-[#7890a2]">
                    {label}
                  </p>
                  <p className="mt-1 wrap-break-word text-sm font-bold leading-5 text-[#0a3556]">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <nav
          aria-label="Card detail sections"
          className="border-b border-[#dceaf4] bg-white"
        >
          <div className="mx-auto flex max-w-9xl gap-7 overflow-x-auto px-4 py-4 md:px-6">
            {[
              ["Highlights", "#highlights"],
              ["Eligibility", "#eligibility"],
              ["Fees and terms", "#fees"],
              ["FAQs", "#faqs"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="shrink-0 text-sm font-semibold text-[#557086] no-underline transition-colors hover:text-[#0878c9]"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        <section
          id="highlights"
          className="scroll-mt-24 bg-white px-4 py-14 md:px-6 md:py-20"
        >
          <div className="mx-auto max-w-9xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="Card value"
                title="Benefits and reward structure"
                description={`Review how ${card.name} rewards spending across its key categories.`}
              />
              <p className="max-w-sm text-sm leading-6 text-[#6b8192] md:text-right">
                Benefits, caps and partner offers follow the issuer&apos;s
                latest card terms.
              </p>
            </div>

            {card.featuresList?.length ? (
              <div className="mt-9 grid bg-[#f1f8fd] sm:grid-cols-3">
                {card.featuresList.map((feature, index) => (
                  <div
                    key={feature}
                    className={`flex min-w-0 items-start gap-3 px-5 py-5 ${
                      index > 0
                        ? "border-t border-[#d8e9f3] sm:border-l sm:border-t-0"
                        : ""
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-[#dff4ee] text-[#078b68]">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-bold leading-6 text-[#17445f]">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-10 grid border-t border-[#dceaf4] md:grid-cols-2">
              {benefitsToRender.map(({ label, value, icon: Icon }, index) => (
                <motion.article
                  key={label}
                  initial={{ y: 10 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.03, 0.15),
                  }}
                  className={`flex gap-4 border-b border-[#dceaf4] py-6 md:px-6 ${
                    index % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0"
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f5fc] text-[#0878c9]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold leading-6 text-[#0a3556]">
                      {label}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-[#5b7488]">
                      {fallbackText(value)}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="eligibility"
          className="scroll-mt-24 bg-[#f2f9fd] px-4 py-14 md:px-6 md:py-20"
        >
          <div className="mx-auto max-w-9xl">
            {mode === "eligibility" ? (
              <div className="mb-12 border-b border-[#cfe3ef] pb-12">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                  <SectionHeading
                    eyebrow="Eligibility result"
                    title={`Your match for ${card.name}`}
                    description="Your result uses the profile details currently available in your Fintaraa account. Final approval remains with the issuer."
                  />
                  {authResolved && !viewerLoggedIn ? (
                    <Link
                      href={buildLoginRedirectHref({
                        redirectTo:
                          pathname || buildCreditCardEligibilityPath(card),
                        product: slugifyCreditCardValue(card.name),
                      })}
                      className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0878c9] px-5 text-sm font-bold text-white no-underline transition-colors hover:bg-[#0568af]"
                    >
                      <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                      Login to check
                    </Link>
                  ) : null}
                </div>

                {!authResolved ? (
                  <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-[#0878c9]">
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    Preparing eligibility check
                  </div>
                ) : !viewerLoggedIn ? (
                  <p className="mt-6 max-w-3xl text-sm leading-6 text-[#5b7488]">
                    Sign in to calculate a personalised match using your income
                    and credit profile. The bank&apos;s general criteria remain
                    available below.
                  </p>
                ) : eligibilityLoading ? (
                  <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-[#0878c9]">
                    <Loader2
                      className="h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                    Calculating your match
                  </div>
                ) : eligibility ? (
                  <div className="mt-8">
                    <div className="grid gap-7 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
                      <div>
                        <p className="text-sm font-semibold text-[#557086]">
                          Profile match
                        </p>
                        <p className="mt-1 text-[38px] font-bold leading-none text-[#0878c9]">
                          {eligibility.score}%
                        </p>
                        <p
                          className={`mt-3 inline-flex items-center gap-1.5 text-sm font-bold ${
                            eligibility.eligible
                              ? "text-[#078b68]"
                              : "text-[#b2661b]"
                          }`}
                        >
                          {eligibility.eligible ? (
                            <CheckCircle2
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          ) : (
                            <XCircle className="h-4 w-4" aria-hidden="true" />
                          )}
                          {eligibility.eligible
                            ? "Likely eligible"
                            : "Needs review"}
                        </p>
                      </div>
                      <div>
                        <div className="h-2 overflow-hidden rounded-sm bg-[#d7e8f2]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.max(0, Math.min(eligibility.score, 100))}%`,
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full ${
                              eligibility.eligible
                                ? "bg-[#07966f]"
                                : "bg-[#e79a3b]"
                            }`}
                          />
                        </div>
                        <p className="mt-4 text-sm leading-6 text-[#4f6b80]">
                          {eligibility.message}
                        </p>
                      </div>
                    </div>

                    {eligibility.checks.length ? (
                      <div className="mt-8 grid border-t border-[#cfe3ef] md:grid-cols-2">
                        {eligibility.checks.map((check, index) => (
                          <div
                            key={check.key}
                            className={`flex gap-3 border-b border-[#cfe3ef] py-5 md:px-5 ${
                              index % 2 === 0
                                ? "md:border-r md:pl-0"
                                : "md:pr-0"
                            }`}
                          >
                            {check.passed ? (
                              <CheckCircle2
                                className="mt-0.5 h-5 w-5 shrink-0 text-[#07966f]"
                                aria-hidden="true"
                              />
                            ) : (
                              <XCircle
                                className="mt-0.5 h-5 w-5 shrink-0 text-[#dd7b27]"
                                aria-hidden="true"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#0a3556]">
                                {check.label}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-[#667f91]">
                                Required: {check.required || "Not defined"} |
                                Your value: {check.current || "Not available"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:gap-20">
              <div>
                <SectionHeading
                  eyebrow="Who can apply"
                  title="Eligibility criteria"
                  description="These are the issuer's indicative requirements. Approval can also depend on location, employment and existing obligations."
                />
                <ul className="mt-8 space-y-5">
                  {eligibilityCriteria.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-6 text-[#426078]"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-[#07966f]"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {eligibilityNotes.length ? (
                  <div className="mt-8 border-t border-[#cfe3ef] pt-6">
                    <p className="text-sm font-bold text-[#0a3556]">
                      Additional checks
                    </p>
                    <ul className="mt-3 space-y-2">
                      {eligibilityNotes.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-xs leading-5 text-[#667f91]"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#0878c9]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="lg:border-l lg:border-[#cfe3ef] lg:pl-10">
                <div className="flex items-center gap-2 text-[#0878c9]">
                  <Clock3 className="h-5 w-5" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-[#0a3556]">
                    Application profile
                  </h3>
                </div>
                <dl className="mt-6 grid grid-cols-2 border-t border-[#cfe3ef]">
                  {quickDetails.map(({ label, value }, index) => (
                    <div
                      key={label}
                      className={`min-w-0 border-b border-[#cfe3ef] py-5 ${
                        index % 2 === 0 ? "pr-4" : "border-l pl-4"
                      }`}
                    >
                      <dt className="text-xs font-semibold text-[#7890a2]">
                        {label}
                      </dt>
                      <dd className="mt-1.5 wrap-break-word text-sm font-bold leading-5 text-[#0a3556]">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {mode !== "eligibility" ? (
                  <Link
                    href={buildCreditCardEligibilityPath(card)}
                    className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0878c9] px-5 text-sm font-bold text-white no-underline transition-colors hover:bg-[#0568af]"
                  >
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    Check my eligibility
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section
          id="fees"
          className="scroll-mt-24 bg-white px-4 py-14 md:px-6 md:py-20"
        >
          <div className="mx-auto grid max-w-9xl gap-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Cost of ownership"
                title="Fees at a glance"
                description="Fee waivers, taxes and spend-linked conditions may apply under the issuer's current schedule."
              />
              <dl className="mt-8 border-t border-[#dceaf4]">
                <div className="flex items-end justify-between gap-5 border-b border-[#dceaf4] py-5">
                  <dt className="text-sm text-[#60788b]">Joining fee</dt>
                  <dd className="text-lg font-bold text-[#0a3556]">
                    {formatCurrency(card.joiningFee)}
                  </dd>
                </div>
                <div className="flex items-end justify-between gap-5 border-b border-[#dceaf4] py-5">
                  <dt className="text-sm text-[#60788b]">Annual fee</dt>
                  <dd className="text-lg font-bold text-[#0a3556]">
                    {formatCurrency(card.annualFee)}
                  </dd>
                </div>
                {card.annualFeeBucket ? (
                  <div className="flex items-end justify-between gap-5 border-b border-[#dceaf4] py-5">
                    <dt className="text-sm text-[#60788b]">Fee category</dt>
                    <dd className="text-sm font-bold text-[#0a3556]">
                      {card.annualFeeBucket}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-[#0878c9]">
                Important information
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#082b4c] md:text-[30px]">
                Terms and conditions
              </h2>
              <ol className="mt-7 border-t border-[#dceaf4]">
                {terms.map((item, index) => (
                  <li
                    key={item}
                    className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-b border-[#dceaf4] py-5"
                  >
                    <span className="text-sm font-bold text-[#0878c9]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-6 text-[#536f84]">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          id="faqs"
          className="scroll-mt-24 bg-[#f2f9fd] px-4 py-14 md:px-6 md:py-20"
        >
          <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[330px_minmax(0,1fr)] lg:gap-20">
            <SectionHeading
              eyebrow="Common questions"
              title={`About ${card.name}`}
              description="Key answers before you continue to the issuer's application journey."
            />
            <div className="border-t border-[#cfe3ef]">
              {card.faqs?.length ? (
                card.faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group border-b border-[#cfe3ef]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-left text-sm font-bold leading-6 text-[#0a3556] marker:content-none">
                      <span>{faq.question}</span>
                      <ChevronDown
                        className="h-5 w-5 shrink-0 text-[#0878c9] transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="max-w-3xl pb-6 pr-10 text-sm leading-6 text-[#5b7488]">
                      {faq.answer}
                    </p>
                  </details>
                ))
              ) : (
                <p className="border-b border-[#cfe3ef] py-6 text-sm leading-6 text-[#5b7488]">
                  Product questions will appear here as the issuer information
                  is updated.
                </p>
              )}
            </div>
          </div>
        </section>

        {relatedCards.length ? (
          <section className="bg-white px-4 py-14 md:px-6 md:py-20">
            <div className="mx-auto max-w-9xl">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <SectionHeading
                  eyebrow="Compare options"
                  title={`More cards from ${card.bankName}`}
                />
                <Link
                  href={buildCreditCardTypePath(card.bankName, card.cardType)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0878c9] no-underline hover:text-[#055b9b]"
                >
                  View all cards
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-8 grid gap-5 md:grid-cols-4">
                {relatedCards.map((item) => (
                  <motion.div
                    key={item._id || item.name}
                    whileHover={{ y: -3 }}
                  >
                    <Link
                      href={buildCreditCardDetailPath(item)}
                      className="group block h-full rounded-lg border border-[#d6e6f0] bg-white p-4 text-[#0a3556] no-underline transition-colors hover:border-[#76b9d9]"
                    >
                      <ProductCardArtwork card={item} compact />
                      <div className="px-1 pb-1 pt-4">
                        <h3 className="line-clamp-2 text-sm font-bold leading-5">
                          {item.name}
                        </h3>
                        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#687f90]">
                          <span>{item.cardType || "Credit Card"}</span>
                          <span className="font-bold text-[#0a5f96]">
                            {formatCurrency(item.annualFee)}
                          </span>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#0878c9]">
                          View details
                          <ArrowRight
                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-y border-[#cde4f0] bg-[#eaf6fc] px-4 py-10 md:px-6 md:py-12">
          <div className="mx-auto flex max-w-9xl flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase text-[#0878c9]">
                Continue with the issuer
              </p>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-[#082b4c] md:text-[28px]">
                Apply for {card.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#5b7488]">
                Final approval, pricing and credit limit are decided by{" "}
                {card.bankName}.
              </p>
            </div>
            <motion.button
              type="button"
              onClick={handleApply}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0878c9] px-6 text-sm font-bold text-white transition-colors hover:bg-[#0568af]"
            >
              Apply now
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#cfe3ef] bg-white px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-[#6b8192]">Annual fee</p>
              <p className="truncate text-sm font-bold text-[#0a3556]">
                {formatCurrency(card.annualFee)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0878c9] px-5 text-sm font-bold text-white"
            >
              Apply now
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </main>
    </MotionConfig>
  );
}
