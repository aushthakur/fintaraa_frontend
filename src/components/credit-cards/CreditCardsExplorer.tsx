"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Search,
  Star,
  X,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";
import {
  CreditCardFilters,
  CreditCardProduct,
  EligibilityBreakdown,
  fetchCreditCardEligibility,
  fetchCreditCardFilters,
  fetchCreditCards,
  trackBankProductClick,
} from "@/services/bankProducts";

const whyChooseItems = [
  {
    id: 1,
    title: "Best Card Recommendations",
    text: "Eligibility-backed suggestions tailored for you",
  },
  {
    id: 2,
    title: "100% Secure Process",
    text: "Your data is encrypted and kept safe",
  },
  {
    id: 3,
    title: "Trusted Banking Partners",
    text: "Partnered with top banks in India",
  },
  {
    id: 4,
    title: "Fast Approval Support",
    text: "Apply digitally with end-to-end assistance",
  },
  {
    id: 5,
    title: "No Hidden Charges",
    text: "Transparent information always",
  },
];

const fallbackFilters: CreditCardFilters = {
  banks: [],
  cardTypes: [],
  rewardsTypes: [],
  networks: [],
  annualFeeBuckets: [],
  incomeBuckets: [],
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const formatCurrency = (value: unknown) => {
  const numeric =
    typeof value === "number"
      ? value
      : Number(String(value || "").replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numeric)) return String(value || "On request");
  if (numeric === 0) return "Lifetime Free";
  return `₹${numeric.toLocaleString("en-IN")}`;
};

const getCardId = (card: CreditCardProduct) => card._id || card.id || "";

const getCardBenefits = (card: CreditCardProduct) =>
  [
    card.welcomeBenefits,
    card.rewardStructure,
    card.cashbackDetails,
    ...(card.featuresList || []),
  ]
    .filter(Boolean)
    .slice(0, 3) as string[];

const getCardTags = (card: CreditCardProduct) =>
  Array.from(new Set([card.cardType, card.rewardsType].filter(Boolean))) as string[];

const textOrFallback = (value: unknown, fallback = "Not specified") =>
  String(value || "").trim() || fallback;

const hasActiveSession = () =>
  getAuthType() === "user" && Boolean(getAuthToken());

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (!options.length) return null;
  return (
    <div className="border-t border-[#f0f4f8] pt-4 space-y-3 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between text-[13px] font-bold">
        <span>{title}</span>
        <ChevronUp className="h-4 w-4 text-[#7a869a]" />
      </div>
      <div className="space-y-2 text-[12px] font-medium text-[#4a5568]">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="rounded border-[#cbd5e1] text-[#005ca8] focus:ring-0"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function CardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-103 animate-pulse rounded-2xl border border-[#e2edf6] bg-white p-4"
        >
          <div className="h-6 w-24 rounded bg-[#edf3f8]" />
          <div className="mt-3 h-28 rounded-xl bg-[#edf3f8]" />
          <div className="mt-4 h-4 w-4/5 rounded bg-[#edf3f8]" />
          <div className="mt-3 h-3 w-2/3 rounded bg-[#edf3f8]" />
          <div className="mt-8 h-20 rounded-xl bg-[#edf3f8]" />
        </div>
      ))}
    </div>
  );
}

export function CreditCardsExplorer() {
  const router = useRouter();
  const [cards, setCards] = useState<CreditCardProduct[]>([]);
  const [filters, setFilters] = useState<CreditCardFilters>(fallbackFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [selectedCardTypes, setSelectedCardTypes] = useState<string[]>([]);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [selectedIncome, setSelectedIncome] = useState<string[]>([]);
  const [selectedRewards, setSelectedRewards] = useState<string[]>([]);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [loungeOnly, setLoungeOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [detailCard, setDetailCard] = useState<CreditCardProduct | null>(null);
  const [eligibilityCard, setEligibilityCard] = useState<CreditCardProduct | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityBreakdown | null>(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [products, filterData] = await Promise.all([
          fetchCreditCards(),
          fetchCreditCardFilters(),
        ]);
        if (!active) return;
        setCards(products);
        setFilters(filterData || fallbackFilters);
      } catch (err) {
        if (!active) return;
        setError((err as Error).message || "Unable to load credit cards.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const filteredBanks = useMemo(
    () =>
      filters.banks.filter((bank) =>
        bank.toLowerCase().includes(bankSearch.toLowerCase()),
      ),
    [bankSearch, filters.banks],
  );

  const filteredCards = useMemo(
    () =>
      cards.filter((card) => {
        if (selectedBanks.length && !selectedBanks.includes(card.bankName)) {
          return false;
        }
        if (
          selectedCardTypes.length &&
          !selectedCardTypes.includes(card.cardType || "")
        ) {
          return false;
        }
        if (
          selectedFees.length &&
          !selectedFees.includes(card.annualFeeBucket || "")
        ) {
          return false;
        }
        if (
          selectedIncome.length &&
          !selectedIncome.includes(card.incomeRequirementBucket || "")
        ) {
          return false;
        }
        if (
          selectedRewards.length &&
          !selectedRewards.includes(card.rewardsType || "")
        ) {
          return false;
        }
        if (
          selectedNetworks.length &&
          !selectedNetworks.includes(card.cardNetwork || "")
        ) {
          return false;
        }
        if (loungeOnly && !card.loungeAccessAvailable) return false;
        if (featuredOnly && !card.featured) return false;
        return true;
      }),
    [
      cards,
      featuredOnly,
      loungeOnly,
      selectedBanks,
      selectedCardTypes,
      selectedFees,
      selectedIncome,
      selectedNetworks,
      selectedRewards,
    ],
  );

  const compareCards = useMemo(
    () =>
      compareIds
        .map((id) => cards.find((card) => getCardId(card) === id))
        .filter(Boolean) as CreditCardProduct[],
    [cards, compareIds],
  );

  const toggleSelected = (
    value: string,
    selected: string[],
    setter: (next: string[]) => void,
  ) => {
    setter(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  const clearFilters = () => {
    setSelectedBanks([]);
    setSelectedCardTypes([]);
    setSelectedFees([]);
    setSelectedIncome([]);
    setSelectedRewards([]);
    setSelectedNetworks([]);
    setLoungeOnly(false);
    setFeaturedOnly(false);
    setBankSearch("");
  };

  const handleDetails = async (card: CreditCardProduct) => {
    setDetailCard(card);
    const id = getCardId(card);
    if (id) {
      try {
        await trackBankProductClick(id, "detail");
      } catch {
        // Analytics should not block details.
      }
    }
  };

  const handleEligibility = async (card: CreditCardProduct) => {
    if (!hasActiveSession()) {
      router.push(
        buildLoginRedirectHref({
          redirectTo: "/credit-cards",
          product: slugify(card.name),
        }),
      );
      return;
    }

    setEligibilityCard(card);
    setEligibility(null);
    setEligibilityLoading(true);
    try {
      const result = await fetchCreditCardEligibility(getCardId(card));
      setEligibility(result);
    } catch (err) {
      setEligibility({
        eligible: false,
        score: 0,
        message: (err as Error).message || "Unable to calculate eligibility.",
        checks: [],
      });
    } finally {
      setEligibilityLoading(false);
    }
  };

  const handleApply = async (card: CreditCardProduct) => {
    if (!hasActiveSession()) {
      router.push(
        buildLoginRedirectHref({
          redirectTo: "/credit-cards",
          product: slugify(card.name),
        }),
      );
      return;
    }

    const id = getCardId(card);
    try {
      if (id) await trackBankProductClick(id, "apply");
    } catch {
      // Tracking should not block the bank/product handoff.
    }
    const url = card.applyUrl || card.link;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const toggleCompare = (id: string) => {
    if (!id) return;
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  };

  const compareRows = [
    {
      label: "Annual Fee",
      value: (card: CreditCardProduct) => formatCurrency(card.annualFee),
    },
    {
      label: "Joining Fee",
      value: (card: CreditCardProduct) => formatCurrency(card.joiningFee),
    },
    {
      label: "Card Type",
      value: (card: CreditCardProduct) => textOrFallback(card.cardType),
    },
    {
      label: "Reward Type",
      value: (card: CreditCardProduct) => textOrFallback(card.rewardsType),
    },
    {
      label: "Welcome Benefits",
      value: (card: CreditCardProduct) => textOrFallback(card.welcomeBenefits),
    },
    {
      label: "Reward Structure",
      value: (card: CreditCardProduct) => textOrFallback(card.rewardStructure),
    },
    {
      label: "Cashback Details",
      value: (card: CreditCardProduct) => textOrFallback(card.cashbackDetails),
    },
    {
      label: "Lounge Access",
      value: (card: CreditCardProduct) =>
        card.loungeAccessAvailable
          ? textOrFallback(card.loungeAccess, "Available")
          : textOrFallback(card.loungeAccess, "Not available"),
    },
    {
      label: "Fuel Benefits",
      value: (card: CreditCardProduct) => textOrFallback(card.fuelBenefits),
    },
    {
      label: "Travel Benefits",
      value: (card: CreditCardProduct) => textOrFallback(card.travelBenefits),
    },
    {
      label: "Insurance Benefits",
      value: (card: CreditCardProduct) =>
        textOrFallback(card.insuranceBenefits),
    },
    {
      label: "Minimum Income",
      value: (card: CreditCardProduct) => formatCurrency(card.minimumIncome),
    },
    {
      label: "Credit Score",
      value: (card: CreditCardProduct) =>
        `${card.creditScoreRequirement || 700}+`,
    },
    {
      label: "Processing Time",
      value: (card: CreditCardProduct) => textOrFallback(card.processingTime),
    },
    {
      label: "Network",
      value: (card: CreditCardProduct) => textOrFallback(card.cardNetwork),
    },
  ];

  return (
    <section className="bg-[#f8faff] px-4 py-8 font-sans text-[#1a1d25] antialiased md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="grid items-start gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-5 rounded-xl border border-[#e2edf6] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#f0f4f8] pb-2">
              <span className="text-[14px] font-bold text-[#1a1d25]">
                Filters
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="text-[12px] font-medium text-[#7a869a] hover:text-[#005ca8]"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-[13px] font-bold">
                <span>Banks</span>
                <ChevronUp className="h-4 w-4 text-[#7a869a]" />
              </div>
              <div className="relative flex h-8 items-center rounded-md border border-[#e2e8f0] bg-[#f4f7fa] px-2.5">
                <Search className="mr-2 h-3.5 w-3.5 text-[#9aa5b5]" />
                <input
                  type="text"
                  value={bankSearch}
                  onChange={(event) => setBankSearch(event.target.value)}
                  placeholder="Search Bank"
                  className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#9aa5b5]"
                />
              </div>
              <div className="max-h-52 space-y-2 overflow-y-auto pr-1 text-[12px] font-medium text-[#4a5568]">
                {filteredBanks.map((bank) => (
                  <label
                    key={bank}
                    className="flex cursor-pointer items-center gap-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBanks.includes(bank)}
                      onChange={() =>
                        toggleSelected(bank, selectedBanks, setSelectedBanks)
                      }
                      className="rounded border-[#cbd5e1] text-[#005ca8] focus:ring-0"
                    />
                    <span>{bank}</span>
                  </label>
                ))}
              </div>
            </div>

            <FilterGroup
              title="Card Type"
              options={filters.cardTypes}
              selected={selectedCardTypes}
              onToggle={(value) =>
                toggleSelected(value, selectedCardTypes, setSelectedCardTypes)
              }
            />
            <FilterGroup
              title="Annual Fee"
              options={filters.annualFeeBuckets}
              selected={selectedFees}
              onToggle={(value) =>
                toggleSelected(value, selectedFees, setSelectedFees)
              }
            />
            <FilterGroup
              title="Income Requirement"
              options={filters.incomeBuckets}
              selected={selectedIncome}
              onToggle={(value) =>
                toggleSelected(value, selectedIncome, setSelectedIncome)
              }
            />
            <FilterGroup
              title="Rewards Type"
              options={filters.rewardsTypes}
              selected={selectedRewards}
              onToggle={(value) =>
                toggleSelected(value, selectedRewards, setSelectedRewards)
              }
            />
            <FilterGroup
              title="Network"
              options={filters.networks}
              selected={selectedNetworks}
              onToggle={(value) =>
                toggleSelected(value, selectedNetworks, setSelectedNetworks)
              }
            />

            <label className="flex cursor-pointer items-center gap-2.5 border-t border-[#f0f4f8] pt-4 text-[12px] font-medium text-[#4a5568]">
              <input
                type="checkbox"
                checked={loungeOnly}
                onChange={(event) => setLoungeOnly(event.target.checked)}
                className="rounded border-[#cbd5e1] text-[#005ca8] focus:ring-0"
              />
              <span>Lounge Access</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-[12px] font-medium text-[#4a5568]">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(event) => setFeaturedOnly(event.target.checked)}
                className="rounded border-[#cbd5e1] text-[#005ca8] focus:ring-0"
              />
              <span>Featured Cards</span>
            </label>

            {["Credit Score", "Welcome Benefits"].map((header) => (
              <div
                key={header}
                className="flex cursor-pointer items-center justify-between border-t border-[#f0f4f8] pt-4 text-[13px] font-bold text-[#1a1d25]"
              >
                <span>{header}</span>
                <ChevronDown className="h-4 w-4 text-[#7a869a]" />
              </div>
            ))}
          </aside>

          <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#e2edf6] bg-white px-5 py-3 sm:flex-row sm:items-center">
              <span className="text-[14px] font-bold text-[#1a1d25]">
                {loading ? "Loading cards..." : `${filteredCards.length} Cards Found`}
              </span>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="font-medium text-[#7a869a]">Sort By:</span>
                <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 font-bold">
                  <span>Priority</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#4a5568]" />
                </div>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-[13px] font-semibold text-red-700">
                {error}
              </div>
            ) : null}

            {detailCard ? (
              <div className="rounded-2xl border border-[#cfe3f7] bg-white p-5 shadow-xs">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <p className="text-[12px] font-bold text-[#005ca8]">
                      {detailCard.bankName}
                    </p>
                    <h3 className="mt-1 text-[20px] font-extrabold text-[#1a1d25]">
                      {detailCard.name}
                    </h3>
                    <p className="mt-2 max-w-3xl text-[13px] font-medium leading-6 text-[#64748b]">
                      {detailCard.shortDescription || detailCard.subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetailCard(null)}
                    className="self-start rounded-full border border-[#d8e3ef] px-4 py-2 text-[12px] font-bold text-[#64748b]"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {[
                    ["Joining Fee", formatCurrency(detailCard.joiningFee)],
                    ["Annual Fee", formatCurrency(detailCard.annualFee)],
                    ["Processing Time", detailCard.processingTime || "3-7 working days"],
                    ["Network", detailCard.cardNetwork || "Bank issued"],
                    ["Minimum Income", formatCurrency(detailCard.minimumIncome)],
                    ["Credit Score", `${detailCard.creditScoreRequirement || 700}+`],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-[#eef3f8] bg-[#fafcff] p-3"
                    >
                      <p className="text-[11px] font-bold text-[#94a3b8]">
                        {label}
                      </p>
                      <p className="mt-1 text-[13px] font-extrabold text-[#1a1d25]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <h4 className="text-[13px] font-extrabold text-[#1a1d25]">
                      Benefits
                    </h4>
                    <ul className="mt-3 space-y-2 text-[12px] font-medium leading-5 text-[#536273]">
                      {[
                        detailCard.welcomeBenefits,
                        detailCard.rewardStructure,
                        detailCard.cashbackDetails,
                        detailCard.loungeAccess,
                        detailCard.fuelBenefits,
                        detailCard.movieBenefits,
                        detailCard.travelBenefits,
                        detailCard.insuranceBenefits,
                      ]
                        .filter(Boolean)
                        .map((benefit) => (
                          <li key={String(benefit)} className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1cb45c]" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-extrabold text-[#1a1d25]">
                      FAQs
                    </h4>
                    <div className="mt-3 grid gap-3">
                      {(detailCard.faqs || []).slice(0, 3).map((faq) => (
                        <div key={faq.question} className="rounded-xl bg-[#f6f9fc] p-3">
                          <p className="text-[12px] font-bold text-[#1a1d25]">
                            {faq.question}
                          </p>
                          <p className="mt-1 text-[11px] font-medium leading-5 text-[#64748b]">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {eligibilityCard ? (
              <div className="rounded-2xl border border-[#cfe3f7] bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-bold text-[#005ca8]">
                      Eligibility Check
                    </p>
                    <h3 className="mt-1 text-[18px] font-extrabold text-[#1a1d25]">
                      {eligibilityCard.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEligibilityCard(null)}
                    className="rounded-full border border-[#d8e3ef] px-4 py-2 text-[12px] font-bold text-[#64748b]"
                  >
                    Close
                  </button>
                </div>
                {eligibilityLoading ? (
                  <div className="mt-4 flex items-center gap-2 text-[13px] font-bold text-[#005ca8]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calculating eligibility...
                  </div>
                ) : eligibility ? (
                  <div className="mt-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-4 py-2 text-[12px] font-extrabold ${
                          eligibility.eligible
                            ? "bg-[#e8f8ef] text-[#12904b]"
                            : "bg-[#fff4e6] text-[#a15c00]"
                        }`}
                      >
                        {eligibility.eligible ? "Eligible" : "Needs Review"} -
                        Match Score {eligibility.score}%
                      </span>
                      <span className="text-[12px] font-medium text-[#64748b]">
                        {eligibility.message}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {eligibility.checks.map((check) => (
                        <div
                          key={check.key}
                          className="rounded-xl border border-[#eef3f8] bg-[#fafcff] p-3"
                        >
                          <div className="flex items-start gap-2">
                            {check.passed ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1cb45c]" />
                            ) : (
                              <XCircle className="mt-0.5 h-4 w-4 text-[#f97316]" />
                            )}
                            <div>
                              <p className="text-[12px] font-bold text-[#1a1d25]">
                                {check.label}
                              </p>
                              <p className="mt-1 text-[11px] font-medium text-[#64748b]">
                                Required: {check.required || "Not defined"} |
                                Your value: {check.current || "Not available"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {loading ? (
              <CardsSkeleton />
            ) : filteredCards.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {filteredCards.map((card) => {
                  const cardId = getCardId(card);
                  const benefits = getCardBenefits(card);
                  const tags = getCardTags(card);
                  return (
                    <article
                      key={cardId || card.name}
                      className="flex flex-col justify-between rounded-2xl border border-[#e2edf6] bg-white p-4 shadow-xs transition-shadow hover:shadow-sm"
                    >
                      <div>
                        <div className="flex h-7 items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {card.image ? (
                              <BankLogoImage
                                src={card.image}
                                alt={card.bankName}
                                className="h-6 w-auto max-w-24 object-contain"
                              />
                            ) : null}
                            <span className="text-[12px] font-black text-[#005ca8]">
                              {card.bankName}
                            </span>
                          </div>
                          <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-[#7a869a]">
                            <input
                              type="checkbox"
                              checked={compareIds.includes(cardId)}
                              onChange={() => toggleCompare(cardId)}
                              className="rounded border-[#cbd5e1] text-[#005ca8] focus:ring-0"
                            />
                            <span>Compare</span>
                          </label>
                        </div>

                        <div className="relative mt-3 flex h-28 w-full flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-[#0c2340] to-[#1d3557] p-3 text-white shadow-sm">
                          <div className="flex items-start justify-between">
                            <div className="text-[9px] font-semibold uppercase tracking-wider opacity-70">
                              {card.bankName}
                            </div>
                            {card.featured ? (
                              <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                            ) : (
                              <div className="h-3.5 w-5 rounded-xs bg-amber-400/80" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="font-mono text-[8px] tracking-widest opacity-80">
                              **** **** **** 8832
                            </div>
                            <div className="flex items-end justify-between">
                              <div className="font-mono text-[7px] opacity-50">
                                {card.cardType || "CREDIT"}
                              </div>
                              <div className="text-[11px] font-black italic tracking-wide opacity-90">
                                {card.cardNetwork || "CARD"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <h3 className="mt-4 min-h-10 text-[14px] font-bold leading-snug text-[#1a1d24]">
                          {card.name}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-[#eef2ff] px-2.5 py-0.5 text-[10px] font-bold text-[#4f46e5]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <ul className="mt-4 space-y-2 border-b border-[#f3f7fa] pb-4">
                          {benefits.map((benefit) => (
                            <li
                              key={benefit}
                              className="flex items-start gap-1.5 text-[12px] font-medium text-[#4a5568]"
                            >
                              <span className="mt-0.5 text-[10px] text-[#a0aec0]">
                                •
                              </span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="my-3 grid grid-cols-2 gap-2 rounded-xl border border-[#f0f4f8] bg-[#fafcfe] py-3 text-center">
                          <div>
                            <span className="block text-[13px] font-bold text-[#1a1d24]">
                              {formatCurrency(card.annualFee)}
                            </span>
                            <span className="text-[10px] font-medium text-[#7a869a]">
                              Annual Fee
                            </span>
                          </div>
                          <div className="border-l border-[#eef2f6]">
                            <span className="block text-[13px] font-bold text-[#1a1d24]">
                              {card.rewardsType || "Rewards"}
                            </span>
                            <span className="text-[10px] font-medium text-[#7a869a]">
                              Reward Type
                            </span>
                          </div>
                        </div>

                        <div className="mb-4 text-left">
                          <div className="text-[12px] font-bold text-[#005ca8]">
                            {card.welcomeBenefits || "Welcome benefits available"}
                          </div>
                          <div className="text-[10px] font-medium text-[#9aa5b5]">
                            Welcome Benefit
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleDetails(card)}
                              className="rounded-lg border border-[#005ca8] bg-white py-2 text-[12px] font-bold text-[#005ca8] transition-colors hover:bg-[#f4f9ff]"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApply(card)}
                              className="rounded-lg bg-[#005ca8] py-2 text-center text-[12px] font-bold text-white shadow-xs transition-colors hover:bg-[#004b87]"
                            >
                              Apply Now
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleEligibility(card)}
                            className="block w-full pt-1 text-center text-[11px] font-bold text-[#005ca8] hover:underline"
                          >
                            View Eligibility
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-[#e2edf6] bg-white p-8 text-center">
                <p className="text-[15px] font-extrabold text-[#1a1d25]">
                  No credit cards match these filters.
                </p>
                <p className="mt-2 text-[12px] font-medium text-[#7a869a]">
                  Clear filters or try a different bank, fee, reward, or network.
                </p>
              </div>
            )}

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-[#e2edf6] bg-white p-4 shadow-xs md:flex-row">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-[14px] font-bold text-[#005ca8]">
                    {compareIds.length}/3 Cards Selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className={`flex h-8 w-12 items-center justify-center rounded text-[6px] ${
                        compareIds[index]
                          ? "border border-blue-800 bg-blue-900 text-white"
                          : "border-2 border-dashed border-[#cbd5e1] bg-gray-50 text-[16px] font-light text-[#cbd5e1]"
                      }`}
                    >
                      {compareIds[index] ? "CARD" : "+"}
                    </div>
                  ))}
                </div>
                <span className="text-[12px] font-medium text-[#7a869a]">
                  Select up to 3 cards to compare
                </span>
              </div>
              <button
                type="button"
                disabled={compareCards.length < 2}
                onClick={() => setCompareOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-[#005ca8] px-6 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#004b87] disabled:cursor-not-allowed disabled:bg-[#9db9d1]"
              >
                <span>Compare Now</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
            {compareCards.length > 0 && compareCards.length < 2 ? (
              <p className="-mt-2 text-right text-[11px] font-semibold text-[#7a869a]">
                Select at least 2 cards to compare.
              </p>
            ) : null}

            <div className="space-y-4 pt-6">
              <h4 className="text-[15px] font-bold text-[#1a1d25]">
                Why choose Fintaraa for Credit Cards?
              </h4>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                {whyChooseItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-xl border border-[#e2edf6] bg-white p-3.5 shadow-2xs transition-shadow hover:shadow-xs"
                  >
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f4ff] text-[#005ca8]">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="mb-1 text-[12px] font-bold leading-tight text-[#1a1d25]">
                        {item.title}
                      </h5>
                      <p className="text-[10px] font-medium leading-normal text-[#7a869a]">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {compareOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102033]/55 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-[0_28px_80px_rgba(15,23,42,0.28)]">
            <div className="flex flex-col gap-3 border-b border-[#e2edf6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-[#005ca8]">
                  Credit Card Comparison
                </p>
                <h3 className="mt-1 text-[20px] font-extrabold text-[#1a1d25]">
                  Compare {compareCards.length} selected cards
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCompareOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center self-start rounded-full border border-[#d8e3ef] text-[#64748b] transition hover:bg-[#f5f8fb] sm:self-center"
                aria-label="Close comparison"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(92vh-82px)] overflow-auto p-4 sm:p-5">
              <div
                className="grid min-w-[760px] gap-3"
                style={{
                  gridTemplateColumns: `170px repeat(${compareCards.length}, minmax(180px, 1fr))`,
                }}
              >
                <div className="rounded-xl bg-[#f8fbff] p-3 text-[12px] font-black text-[#64748b]">
                  Card
                </div>
                {compareCards.map((card) => (
                  <div
                    key={getCardId(card)}
                    className="rounded-xl border border-[#e2edf6] bg-[#f8fbff] p-3"
                  >
                    <div className="flex items-center gap-2">
                      {card.image ? (
                        <BankLogoImage
                          src={card.image}
                          alt={card.bankName}
                          className="h-6 w-auto max-w-20 object-contain"
                        />
                      ) : null}
                      <span className="text-[11px] font-black text-[#005ca8]">
                        {card.bankName}
                      </span>
                    </div>
                    <h4 className="mt-2 min-h-10 text-[14px] font-extrabold leading-snug text-[#1a1d25]">
                      {card.name}
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {getCardTags(card).map((tag) => (
                        <span
                          key={`${getCardId(card)}-${tag}`}
                          className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-[#4f46e5]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {compareRows.map((row) => (
                  <div key={row.label} className="contents">
                    <div className="rounded-xl border border-[#eef3f8] bg-white p-3 text-[12px] font-black text-[#1a1d25]">
                      {row.label}
                    </div>
                    {compareCards.map((card) => (
                      <div
                        key={`${getCardId(card)}-${row.label}`}
                        className="rounded-xl border border-[#eef3f8] bg-white p-3 text-[12px] font-semibold leading-5 text-[#536273]"
                      >
                        {row.value(card)}
                      </div>
                    ))}
                  </div>
                ))}

                <div className="rounded-xl bg-[#f8fbff] p-3 text-[12px] font-black text-[#64748b]">
                  Action
                </div>
                {compareCards.map((card) => (
                  <div
                    key={`${getCardId(card)}-action`}
                    className="rounded-xl bg-[#f8fbff] p-3"
                  >
                    <button
                      type="button"
                      onClick={() => handleApply(card)}
                      className="h-10 w-full rounded-full bg-[#1cb45c] text-[12px] font-black text-white shadow-[0_10px_20px_rgba(28,180,92,0.18)] transition hover:bg-[#159a4e]"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
