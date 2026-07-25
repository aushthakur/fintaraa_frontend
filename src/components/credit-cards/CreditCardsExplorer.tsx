"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import {
  buildCreditCardDetailPath,
  buildCreditCardEligibilityPath,
  CreditCardFilters,
  CreditCardProduct,
  fetchCreditCardFilters,
  fetchCreditCards,
  getCreditCardApplyUrl,
  isSameCreditCardBank,
  isSameCreditCardType,
  trackBankProductClick,
} from "@/services/bankProducts";
import type { CreditCardRecommendation } from "./CreditCardsHero";

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
    text: "Offers from participating Fintaraa partner banks",
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
  categories: [],
  cardTypes: [],
  rewardsTypes: [],
  networks: [],
  annualFeeBuckets: [],
  incomeBuckets: [],
};

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
  Array.from(
    new Set([card.cardType, card.rewardsType].filter(Boolean)),
  ) as string[];

const textOrFallback = (value: unknown, fallback = "Not specified") =>
  String(value || "").trim() || fallback;

const creditScoreOptions = ["Up to 700", "701 - 749", "750+"];
const categoryOptions = [
  "Cashback",
  "Travel",
  "Fuel",
  "Rewards",
  "Lifetime Free",
  "Beginners",
  "Self-Employed",
  "Super-Premium",
];

const getDerivedCategories = (card: CreditCardProduct) => {
  if (card.categories?.length) return card.categories;

  const searchable = [
    card.name,
    card.cardType,
    card.rewardsType,
    card.shortDescription,
    card.cashbackDetails,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const fee = Number(card.annualFee || 0);
  const income = Number(card.minimumIncome || 0);
  const derived: string[] = [];

  if (searchable.includes("cashback")) derived.push("Cashback");
  if (
    card.cardType === "Travel" ||
    /travel|mile|airline|hotel|airport|lounge|atlas|diners/.test(searchable)
  ) {
    derived.push("Travel");
  }
  if (
    card.cardType === "Fuel" ||
    /fuel|petrol|indianoil|power\+/.test(
      [card.name, card.cardType, card.rewardsType]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    )
  ) {
    derived.push("Fuel");
  }
  if (
    /reward|point|mile|neucoin/.test(String(card.rewardsType).toLowerCase()) ||
    card.cardType === "Rewards"
  ) {
    derived.push("Rewards");
  }
  if (fee === 0) derived.push("Lifetime Free");
  if (card.cardType === "Entry-level" || (income <= 25000 && fee <= 500)) {
    derived.push("Beginners");
  }
  if (
    income <= 50000 &&
    ["Cashback", "Shopping", "Everyday", "Rewards", "Fuel", "Lifestyle"].includes(
      card.cardType || "",
    )
  ) {
    derived.push("Self-Employed");
  }
  if (
    card.cardType === "Premium" &&
    (fee >= 2500 || income >= 75000)
  ) {
    derived.push("Super-Premium");
  }

  return Array.from(new Set(derived));
};

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
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2.5"
          >
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

export function CreditCardsExplorer({
  initialBankSlug = "",
  initialCardTypeSlug = "",
  selectedCategories = [],
  onCategoriesChange,
  recommendation = null,
  onClearRecommendation,
}: {
  initialBankSlug?: string;
  initialCardTypeSlug?: string;
  selectedCategories?: string[];
  onCategoriesChange?: (categories: string[]) => void;
  recommendation?: CreditCardRecommendation | null;
  onClearRecommendation?: () => void;
}) {
  const router = useRouter();
  const [cards, setCards] = useState<CreditCardProduct[]>([]);
  const [filters, setFilters] = useState<CreditCardFilters>(fallbackFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [activeCategories, setActiveCategories] =
    useState<string[]>(selectedCategories);
  const [selectedCardTypes, setSelectedCardTypes] = useState<string[]>([]);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [selectedIncome, setSelectedIncome] = useState<string[]>([]);
  const [selectedRewards, setSelectedRewards] = useState<string[]>([]);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [selectedCreditScores, setSelectedCreditScores] = useState<string[]>([]);
  const [loungeOnly, setLoungeOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [welcomeBenefitsOnly, setWelcomeBenefitsOnly] = useState(false);
  const [sortBy, setSortBy] = useState("priority");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setActiveCategories(selectedCategories);
  }, [selectedCategories]);

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
        const nextFilters = filterData || fallbackFilters;
        setCards(products);
        setFilters(nextFilters);

        const matchedBank = initialBankSlug
          ? nextFilters.banks.find((bank) =>
              isSameCreditCardBank(initialBankSlug, bank),
            ) ||
            products.find((card) =>
              isSameCreditCardBank(initialBankSlug, card.bankName),
            )?.bankName ||
            ""
          : "";
        const matchedType = initialCardTypeSlug
          ? nextFilters.cardTypes.find((type) =>
              isSameCreditCardType(initialCardTypeSlug, type),
            ) ||
            products.find((card) =>
              isSameCreditCardType(initialCardTypeSlug, card.cardType),
            )?.cardType ||
            ""
          : "";
        setSelectedBanks(matchedBank ? [matchedBank] : []);
        setSelectedCardTypes(matchedType ? [matchedType] : []);
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
  }, [initialBankSlug, initialCardTypeSlug]);

  useEffect(() => {
    if (!filtersOpen) return;

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filtersOpen]);

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
        if (
          activeCategories.length &&
          !activeCategories.some((category) =>
            getDerivedCategories(card).includes(category),
          )
        ) {
          return false;
        }
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
        if (welcomeBenefitsOnly && !String(card.welcomeBenefits || "").trim()) {
          return false;
        }
        if (selectedCreditScores.length) {
          const requirement = Number(card.creditScoreRequirement || 700);
          const scoreMatches = selectedCreditScores.some((bucket) => {
            if (bucket === "Up to 700") return requirement <= 700;
            if (bucket === "701 - 749") {
              return requirement >= 701 && requirement <= 749;
            }
            return requirement >= 750;
          });
          if (!scoreMatches) return false;
        }
        if (
          recommendation?.monthlyIncome &&
          Number(card.minimumIncome || 0) > recommendation.monthlyIncome
        ) {
          return false;
        }
        if (
          recommendation?.creditScore &&
          Number(card.creditScoreRequirement || 700) > recommendation.creditScore
        ) {
          return false;
        }
        if (
          recommendation &&
          ["self-employed", "business-owner"].includes(
            recommendation.employmentType,
          ) &&
          !getDerivedCategories(card).includes("Self-Employed")
        ) {
          return false;
        }
        if (
          recommendation?.employmentType === "student" &&
          !getDerivedCategories(card).includes("Beginners")
        ) {
          return false;
        }
        return true;
      }),
    [
      activeCategories,
      cards,
      featuredOnly,
      loungeOnly,
      recommendation,
      selectedBanks,
      selectedCardTypes,
      selectedCreditScores,
      selectedFees,
      selectedIncome,
      selectedNetworks,
      selectedRewards,
      welcomeBenefitsOnly,
    ],
  );

  const sortedCards = useMemo(() => {
    const next = [...filteredCards];
    if (sortBy === "fee-low") {
      return next.sort((a, b) => Number(a.annualFee || 0) - Number(b.annualFee || 0));
    }
    if (sortBy === "fee-high") {
      return next.sort((a, b) => Number(b.annualFee || 0) - Number(a.annualFee || 0));
    }
    if (sortBy === "income-low") {
      return next.sort(
        (a, b) => Number(a.minimumIncome || 0) - Number(b.minimumIncome || 0),
      );
    }
    return next.sort(
      (a, b) =>
        Number(b.featured || false) - Number(a.featured || false) ||
        Number(a.priorityOrder || 9999) - Number(b.priorityOrder || 9999),
    );
  }, [filteredCards, sortBy]);

  const activeFilterCount = useMemo(
    () =>
      selectedBanks.length +
      activeCategories.length +
      selectedCardTypes.length +
      selectedFees.length +
      selectedIncome.length +
      selectedRewards.length +
      selectedNetworks.length +
      selectedCreditScores.length +
      (loungeOnly ? 1 : 0) +
      (featuredOnly ? 1 : 0) +
      (welcomeBenefitsOnly ? 1 : 0),
    [
      activeCategories,
      featuredOnly,
      loungeOnly,
      selectedBanks,
      selectedCardTypes,
      selectedCreditScores,
      selectedFees,
      selectedIncome,
      selectedNetworks,
      selectedRewards,
      welcomeBenefitsOnly,
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

  const toggleCategory = (value: string) => {
    const next = activeCategories.includes(value)
      ? activeCategories.filter((item) => item !== value)
      : [...activeCategories, value];
    setActiveCategories(next);
    onCategoriesChange?.(next);
  };

  const clearFilters = () => {
    setSelectedBanks([]);
    setActiveCategories([]);
    onCategoriesChange?.([]);
    setSelectedCardTypes([]);
    setSelectedFees([]);
    setSelectedIncome([]);
    setSelectedRewards([]);
    setSelectedNetworks([]);
    setSelectedCreditScores([]);
    setLoungeOnly(false);
    setFeaturedOnly(false);
    setWelcomeBenefitsOnly(false);
    setBankSearch("");
    onClearRecommendation?.();
  };

  const handleDetails = async (card: CreditCardProduct) => {
    const id = getCardId(card);
    if (id) {
      try {
        await trackBankProductClick(id, "detail");
      } catch {
        // Analytics should not block details.
      }
    }
    router.push(buildCreditCardDetailPath(card));
  };

  const handleEligibility = (card: CreditCardProduct) =>
    router.push(buildCreditCardEligibilityPath(card));

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

  const renderFilters = (isMobile = false) => (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-[#f0f4f8] pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold text-[#1a1d25]">
            Filters
          </span>
          {activeFilterCount ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#005ca8] px-1.5 text-[10px] font-extrabold text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearFilters}
            className="text-[12px] font-medium text-[#7a869a] hover:text-[#005ca8]"
          >
            Clear All
          </button>
          {isMobile ? (
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d8e3ef] text-[#64748b]"
              aria-label="Close filters"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
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
        title="Category"
        options={Array.from(
          new Set([...categoryOptions, ...(filters.categories || [])]),
        )}
        selected={activeCategories}
        onToggle={toggleCategory}
      />
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
      <FilterGroup
        title="Credit Score Needed"
        options={creditScoreOptions}
        selected={selectedCreditScores}
        onToggle={(value) =>
          toggleSelected(
            value,
            selectedCreditScores,
            setSelectedCreditScores,
          )
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
      <label className="flex cursor-pointer items-center gap-2.5 text-[12px] font-medium text-[#4a5568]">
        <input
          type="checkbox"
          checked={welcomeBenefitsOnly}
          onChange={(event) => setWelcomeBenefitsOnly(event.target.checked)}
          className="rounded border-[#cbd5e1] text-[#005ca8] focus:ring-0"
        />
        <span>Welcome Benefits</span>
      </label>
    </div>
  );

  return (
    <section className="bg-[#f8faff] px-4 py-8 font-sans text-[#1a1d25] antialiased md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div
          className={`fixed inset-0 z-50 lg:hidden ${
            filtersOpen
              ? "visible pointer-events-auto"
              : "invisible pointer-events-none delay-200"
          }`}
          aria-hidden={!filtersOpen}
        >
          <button
            type="button"
            aria-label="Close filters"
            tabIndex={filtersOpen ? 0 : -1}
            onClick={() => setFiltersOpen(false)}
            className={`absolute inset-0 bg-[#102033]/50 backdrop-blur-[2px] transition-opacity duration-200 ${
              filtersOpen ? "opacity-100" : "opacity-0"
            }`}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Credit card filters"
            className={`absolute left-0 top-0 flex h-full w-[min(88vw,22rem)] flex-col bg-white shadow-[18px_0_48px_rgba(15,23,42,0.24)] transition-transform duration-300 ease-out ${
              filtersOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {renderFilters(true)}
            </div>
            <div className="border-t border-[#e2edf6] bg-white p-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="h-11 w-full rounded-xl bg-[#005ca8] text-[13px] font-extrabold text-white shadow-[0_10px_24px_rgba(0,92,168,0.22)]"
              >
                Show {sortedCards.length} Cards
              </button>
            </div>
          </aside>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6">
          <aside className="hidden rounded-xl border border-[#e2edf6] bg-white p-5 shadow-xs lg:sticky lg:top-28 lg:block">
            {renderFilters()}
          </aside>

          <div className="min-w-0 space-y-4">
            {recommendation || activeCategories.length ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-[#cfe5f7] bg-[#eff8ff] px-4 py-3"
              >
                <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#526b80]">
                  Showing
                </span>
                {recommendation ? (
                  <button
                    type="button"
                    onClick={onClearRecommendation}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#005ca8] ring-1 ring-[#cfe5f7]"
                  >
                    ₹{recommendation.monthlyIncome.toLocaleString("en-IN")} income
                    {recommendation.creditScore
                      ? ` · ${recommendation.creditScore}+ score`
                      : ""}
                    <X className="h-3 w-3" />
                  </button>
                ) : null}
                {activeCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#005ca8] px-3 py-1.5 text-[11px] font-extrabold text-white"
                  >
                    {category}
                    <X className="h-3 w-3" />
                  </button>
                ))}
              </motion.div>
            ) : null}
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#e2edf6] bg-white px-5 py-3 sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-center justify-between gap-3 sm:flex-1">
                <span className="text-[14px] font-bold text-[#1a1d25]">
                  {loading
                    ? "Loading cards..."
                    : `${sortedCards.length} Cards Found`}
                </span>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[#cbd5e1] bg-white px-3 text-[12px] font-extrabold text-[#005ca8] shadow-xs lg:hidden"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Filters</span>
                  {activeFilterCount ? (
                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#005ca8] px-1 text-[9px] font-extrabold text-white">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[12px]">
                <span className="font-medium text-[#7a869a]">Sort By:</span>
                <label className="relative">
                  <span className="sr-only">Sort credit cards</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-9 appearance-none rounded-lg border border-[#cbd5e1] bg-white py-1.5 pl-3 pr-8 text-[12px] font-bold outline-none focus:border-[#005ca8]"
                  >
                    <option value="priority">Priority</option>
                    <option value="fee-low">Annual fee: Low to high</option>
                    <option value="fee-high">Annual fee: High to low</option>
                    <option value="income-low">Income required: Low to high</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4a5568]" />
                </label>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-[13px] font-semibold text-red-700">
                {error}
              </div>
            ) : null}

            {loading ? (
              <CardsSkeleton />
            ) : sortedCards.length ? (
              <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                {sortedCards.map((card, cardIndex) => {
                  const cardId = getCardId(card);
                  const benefits = getCardBenefits(card);
                  const tags = getCardTags(card);
                  return (
                    <motion.article
                      key={cardId || card.name}
                      layout
                      initial={{ opacity: 0, scale: 0.975 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{
                        duration: 0.45,
                        delay: Math.min(cardIndex * 0.035, 0.18),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex flex-col justify-between rounded-2xl border border-[#e2edf6] bg-white p-4 shadow-xs"
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
                            <span className="text-[12px] font-extrabold text-[#005ca8]">
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

                        <div className="relative mt-3 flex h-28 w-full flex-col justify-between overflow-hidden rounded-xl bg-linear-to-br from-[#0c2340] to-[#1d3557] p-3 text-white shadow-sm">
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
                              <div className="text-[11px] font-extrabold italic tracking-wide opacity-90">
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
                            {card.welcomeBenefits ||
                              "Welcome benefits available"}
                          </div>
                          <div className="text-[10px] font-medium text-[#9aa5b5]">
                            Welcome Benefit
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                    </motion.article>
                  );
                })}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="rounded-xl border border-[#e2edf6] bg-white p-8 text-center">
                <p className="text-[15px] font-extrabold text-[#1a1d25]">
                  No credit cards match these filters.
                </p>
                <p className="mt-2 text-[12px] font-medium text-[#7a869a]">
                  Clear filters or try a different bank, fee, reward, or
                  network.
                </p>
              </div>
            )}

            <div className="flex flex-col items-stretch justify-between gap-4 rounded-xl border border-[#e2edf6] bg-white p-4 shadow-xs md:flex-row md:items-center">
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
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#005ca8] px-6 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#004b87] disabled:cursor-not-allowed disabled:bg-[#9db9d1] md:w-auto"
              >
                <span>Compare Now</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
            {compareCards.length > 0 && compareCards.length < 2 ? (
              <p className="-mt-2 text-left text-[11px] font-semibold text-[#7a869a] md:text-right">
                Select at least 2 cards to compare.
              </p>
            ) : null}

            <div className="space-y-4 pt-6">
              <h4 className="text-[15px] font-bold text-[#1a1d25]">
                Why choose Fintaraa for Credit Cards?
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
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
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#005ca8]">
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
                className="grid min-w-190 gap-3"
                style={{
                  gridTemplateColumns: `170px repeat(${compareCards.length}, minmax(180px, 1fr))`,
                }}
              >
                <div className="rounded-xl bg-[#f8fbff] p-3 text-[12px] font-extrabold text-[#64748b]">
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
                      <span className="text-[11px] font-extrabold text-[#005ca8]">
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
                    <div className="rounded-xl border border-[#eef3f8] bg-white p-3 text-[12px] font-extrabold text-[#1a1d25]">
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

                <div className="rounded-xl bg-[#f8fbff] p-3 text-[12px] font-extrabold text-[#64748b]">
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
                      className="h-10 w-full rounded-full bg-[#1cb45c] text-[12px] font-extrabold text-white shadow-[0_10px_20px_rgba(28,180,92,0.18)] transition hover:bg-[#159a4e]"
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
