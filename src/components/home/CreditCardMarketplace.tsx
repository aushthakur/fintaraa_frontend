"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Zap, Globe, ShoppingBag, Fuel, Gift, ChevronLeft, ChevronRight } from "lucide-react";

interface CreditCardItem {
  id: string;
  name: string;
  bankName: string;
  bankLogo: string;
  cardImage: string;
  category: "cashback" | "travel" | "rewards" | "fuel" | "shopping";
  badge: string;
  accentColor: string;
  glowColor: string;
  keyBenefit: string;
  rewardsRate: string;
  annualFee: string;
  feeWaiver: string;
  href: string;
  perks: string[];
}

const cardsCatalog: CreditCardItem[] = [
  {
    id: "sbi-cashback",
    name: "SBI Cashback Card",
    bankName: "SBI Card",
    bankLogo: "/assets/banks/sbi.png",
    cardImage: "/assets/cards/sbi-cashback.png",
    category: "cashback",
    badge: "5% Unlimited Cashback",
    accentColor: "#22c55e",
    glowColor: "rgba(34,197,94,0.28)",
    keyBenefit: "5% cashback on all online spends with no merchant restrictions",
    rewardsRate: "5% Online",
    annualFee: "₹999/yr",
    feeWaiver: "Waived on ₹2L spend",
    href: "/banks/sbi-card/credit-card",
    perks: ["5% Online Cashback", "Fuel Surcharge Waiver", "No Merchant Limit"],
  },
  {
    id: "hdfc-millennia",
    name: "HDFC Millennia",
    bankName: "HDFC Bank",
    bankLogo: "/assets/banks/HDFC-Bank.png",
    cardImage: "/assets/cards/hdfc-millennia.png",
    category: "shopping",
    badge: "5% Shopping Rewards",
    accentColor: "#06b6d4",
    glowColor: "rgba(6,182,212,0.28)",
    keyBenefit: "5% CashPoints on Amazon, Flipkart, Swiggy, Zomato, Uber & more",
    rewardsRate: "5% CashPoints",
    annualFee: "₹1,000/yr",
    feeWaiver: "Waived on ₹1L spend",
    href: "/banks/hdfc-bank/credit-card",
    perks: ["5% Top Apps", "Milestone Bonuses", "Contactless Pay"],
  },
  {
    id: "sbi-prime",
    name: "SBI Card PRIME",
    bankName: "SBI Card",
    bankLogo: "/assets/banks/sbi.png",
    cardImage: "/assets/cards/sbi-prime.png",
    category: "travel",
    badge: "8 Free Lounge Visits",
    accentColor: "#8b5cf6",
    glowColor: "rgba(139,92,246,0.32)",
    keyBenefit: "Club Vistara Silver membership + complimentary lounge access worldwide",
    rewardsRate: "Air Miles",
    annualFee: "₹2,999/yr",
    feeWaiver: "Waived on ₹3L spend",
    href: "/banks/sbi-card/credit-card",
    perks: ["8 Lounge Visits", "Vistara Silver", "e-Gift Vouchers"],
  },
  {
    id: "icici-platinum",
    name: "ICICI Platinum Chip",
    bankName: "ICICI Bank",
    bankLogo: "/assets/banks/icici.png",
    cardImage: "/assets/cards/icici-platinum.png",
    category: "rewards",
    badge: "Lifetime Free",
    accentColor: "#f59e0b",
    glowColor: "rgba(245,158,11,0.28)",
    keyBenefit: "Zero annual fee forever with PAYBACK points & exclusive dining discounts",
    rewardsRate: "2 Pts/₹100",
    annualFee: "₹0 Free",
    feeWaiver: "No conditions",
    href: "/banks/icici-bank/credit-card",
    perks: ["Lifetime Free", "PAYBACK Points", "Dining Discounts"],
  },
  {
    id: "axis-rewards",
    name: "Axis Bank Rewards",
    bankName: "Axis Bank",
    bankLogo: "/assets/banks/axis-bank.png",
    cardImage: "/assets/cards/axis-rewards.png",
    category: "rewards",
    badge: "10X EDGE Points",
    accentColor: "#ef4444",
    glowColor: "rgba(239,68,68,0.28)",
    keyBenefit: "10X EDGE points on apparel & departmental stores + 2X on all other spends",
    rewardsRate: "10X EDGE",
    annualFee: "₹1,000/yr",
    feeWaiver: "Waived on ₹2L spend",
    href: "/banks/axis-bank/credit-card",
    perks: ["10X EDGE Points", "2X All Spends", "Partner Offers"],
  },
  {
    id: "bpcl-octane",
    name: "BPCL SBI Octane",
    bankName: "SBI Card",
    bankLogo: "/assets/banks/sbi.png",
    cardImage: "/assets/cards/bpcl-octane.png",
    category: "fuel",
    badge: "7.25% Fuel Value Back",
    accentColor: "#f97316",
    glowColor: "rgba(249,115,22,0.28)",
    keyBenefit: "7.25% value back (25X reward points) on fuel purchases at BPCL pumps",
    rewardsRate: "7.25% Fuel",
    annualFee: "₹1,499/yr",
    feeWaiver: "Waived on ₹2L spend",
    href: "/banks/sbi-card/credit-card",
    perks: ["7.25% Fuel Back", "25X BPCL Points", "Surcharge Waiver"],
  },
];

const filterTabs = [
  { id: "all", label: "All Cards", icon: Star },
  { id: "cashback", label: "Cashback", icon: Zap },
  { id: "travel", label: "Travel", icon: Globe },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "fuel", label: "Fuel", icon: Fuel },
];

/* Compute fan transform for a card at `index` given `activeIndex` */
function getFanStyle(index: number, total: number, activeIndex: number, isMobile: boolean) {
  const offset = index - activeIndex;
  const absOffset = Math.abs(offset);
  if (isMobile) {
    return {
      x: offset * 65,
      y: absOffset * 8,
      rotate: offset * 3.5,
      scale: Math.max(0.72, 1 - absOffset * 0.12),
      zIndex: total - absOffset,
      opacity: absOffset > 1 ? 0 : 1 - absOffset * 0.18,
    };
  }
  return {
    x: offset * 210,
    y: absOffset * absOffset * 18,
    rotate: offset * 5.5,
    scale: 1 - absOffset * 0.08,
    zIndex: total - absOffset,
    opacity: 1 - absOffset * 0.14,
  };
}

export function CreditCardMarketplace() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeCard, setActiveCard] = useState(2);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredList = useMemo(() => {
    if (selectedFilter === "all") return cardsCatalog;
    return cardsCatalog.filter((card) => card.category === selectedFilter);
  }, [selectedFilter]);

  // Auto-scroller interval (pauses while hovering any card, resumes on leave)
  useEffect(() => {
    if (isPaused || filteredList.length <= 1) return;
    const timer = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % filteredList.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [isPaused, filteredList.length]);

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    const nextList = filterId === "all"
      ? cardsCatalog
      : cardsCatalog.filter((c) => c.category === filterId);
    setActiveCard(Math.floor(nextList.length / 2));
  };

  const activeCardData = filteredList[activeCard] ?? filteredList[0];
  const canGoPrev = activeCard > 0;
  const canGoNext = activeCard < filteredList.length - 1;

  return (
    <section
      id="credit-cards"
      className="relative scroll-mt-20 overflow-hidden bg-white py-16 sm:py-20"
      aria-label="Top Credit Cards"
    >
      {/* Soft ambient gradient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(100,36,199,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 90%, rgba(139,92,246,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="text-center">
          <h2 className="relative inline-block text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-[44px] leading-tight">
            Top{" "}
            <span style={{ color: "#6424C7" }}>
              Credit Cards
            </span>{" "}
            for You
          </h2>
          <p className="mt-5 text-[15px] font-normal text-gray-500 sm:text-base max-w-md mx-auto leading-relaxed">
            Compare cashback, travel, shopping &amp; rewards cards from top banks
          </p>
        </div>

        {/* ── Filter Pills ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleFilterChange(tab.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#6424C7] text-white shadow-none"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#6424C7]/40 hover:text-[#6424C7] hover:bg-purple-50/60 shadow-sm"
                }`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── 3D Card Fan Stage ── */}
        <div className="mt-10 sm:mt-14 flex flex-col items-center w-full overflow-hidden">
          {/* Stage */}
          <div
            className="relative flex items-end justify-center h-[215px] sm:h-[360px] w-full overflow-hidden"
          >
            {/* Stage glow / reflection surface */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-[50%]"
              style={{
                width: isMobile ? 360 : 860,
                height: 36,
                background:
                  "radial-gradient(ellipse at center, rgba(100,36,199,0.14) 0%, rgba(100,36,199,0.04) 55%, transparent 80%)",
                filter: "blur(8px)",
              }}
            />

            {/* Cards in fan */}
            <AnimatePresence mode="sync">
              {filteredList.map((card, index) => {
                const { x, y, rotate, scale, zIndex, opacity } = getFanStyle(
                  index,
                  filteredList.length,
                  activeCard,
                  isMobile
                );
                const isActive = index === activeCard;
                const isHovered = hoveredCard === index;

                return (
                  <motion.button
                    key={card.id}
                    type="button"
                    aria-label={`Select ${card.name}`}
                    onClick={() => setActiveCard(index)}
                    onMouseEnter={() => {
                      setIsPaused(true);
                      setHoveredCard(index);
                    }}
                    onMouseLeave={() => {
                      setIsPaused(false);
                      setHoveredCard(null);
                    }}
                    className="absolute bottom-0 focus:outline-none cursor-pointer"
                    style={{
                      transformOrigin: "bottom center",
                      zIndex: isHovered ? 60 : zIndex,
                    }}
                    animate={{
                      x,
                      y: isHovered ? -34 : isActive ? -18 : y,
                      rotate: isHovered ? 0 : rotate,
                      scale: isHovered ? 1.12 : isActive ? 1.08 : scale,
                      opacity: isHovered ? 1 : opacity,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 340,
                      damping: 26,
                    }}
                  >
                    {/* Card image container */}
                    <div
                      className="relative w-[260px] h-[162px] min-[400px]:w-[285px] min-[400px]:h-[178px] sm:w-[400px] sm:h-[250px] rounded-2xl overflow-hidden"
                      style={{
                        boxShadow: isActive
                          ? `0 26px 65px -12px ${card.glowColor}, 0 12px 36px rgba(0,0,0,0.20)`
                          : "0 12px 36px rgba(0,0,0,0.15)",
                      }}
                    >
                      <Image
                        src={card.cardImage}
                        alt={card.name}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 640px) 280px, 400px"
                      />
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              type="button"
              onClick={() => canGoPrev && setActiveCard((p) => p - 1)}
              aria-label="Previous card"
              className={`absolute left-1 sm:left-8 top-1/2 -translate-y-6 z-50 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border bg-white shadow-md transition-all duration-200 ${
                canGoPrev
                  ? "border-gray-200 hover:border-[#6424C7]/50 hover:shadow-[0_0_14px_rgba(100,36,199,0.2)] cursor-pointer"
                  : "border-gray-100 opacity-30 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => canGoNext && setActiveCard((p) => p + 1)}
              aria-label="Next card"
              className={`absolute right-1 sm:right-8 top-1/2 -translate-y-6 z-50 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border bg-white shadow-md transition-all duration-200 ${
                canGoNext
                  ? "border-gray-200 hover:border-[#6424C7]/50 hover:shadow-[0_0_14px_rgba(100,36,199,0.2)] cursor-pointer"
                  : "border-gray-100 opacity-30 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="mt-5 flex items-center gap-2">
            {filteredList.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveCard(i)}
                aria-label={`Go to card ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeCard
                    ? "w-6 h-2 bg-[#6424C7]"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* ── Active Card Detail Panel ── */}
          <AnimatePresence mode="wait">
            {activeCardData && (
              <motion.div
                key={activeCardData.id}
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="mt-8 w-full max-w-2xl"
              >
                <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_40px_-10px_rgba(100,36,199,0.12)]">
                  {/* Top accent line */}
                  <div
                    className="h-0.5 w-full"
                    style={{
                      background: `linear-gradient(to right, transparent, ${activeCardData.accentColor}, transparent)`,
                    }}
                  />

                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                    {/* Card thumbnail */}
                    <div
                      className="relative shrink-0 self-center w-[150px] h-[94px] sm:w-[210px] sm:h-[130px] rounded-xl overflow-hidden"
                      style={{
                        boxShadow: `0 10px 30px -6px ${activeCardData.glowColor}, 0 4px 14px rgba(0,0,0,0.12)`,
                      }}
                    >
                      <Image
                        src={activeCardData.cardImage}
                        alt={activeCardData.name}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 640px) 150px, 210px"
                      />
                    </div>

                    {/* Info block */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="relative h-5 w-16 shrink-0">
                          <Image
                            src={activeCardData.bankLogo}
                            alt={activeCardData.bankName}
                            fill
                            unoptimized
                            className="object-contain object-left"
                          />
                        </div>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[10px] font-medium border"
                          style={{
                            backgroundColor: `${activeCardData.accentColor}18`,
                            color: activeCardData.accentColor,
                            borderColor: `${activeCardData.accentColor}40`,
                          }}
                        >
                          {activeCardData.badge}
                        </span>
                      </div>

                      <h3 className="text-[18px] font-semibold text-gray-900 tracking-tight leading-snug">
                        {activeCardData.name}
                      </h3>
                      <p className="mt-0.5 text-[12.5px] text-gray-500 font-normal line-clamp-1 leading-relaxed">
                        {activeCardData.keyBenefit}
                      </p>

                      {/* Perks row */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {activeCardData.perks.map((perk) => (
                          <span
                            key={perk}
                            className="rounded-full bg-gray-50 border border-gray-200/80 px-2.5 py-0.5 text-[11px] font-normal text-gray-600"
                          >
                            {perk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metrics + CTA */}
                    <div className="flex shrink-0 flex-col items-center gap-3 self-center sm:items-end">
                      <div className="flex gap-4 text-center sm:text-right">
                        <div>
                          <span className="block text-[10px] font-medium uppercase tracking-wider text-gray-400">Rewards</span>
                          <span
                            className="mt-0.5 block text-[15px] font-semibold"
                            style={{ color: activeCardData.accentColor }}
                          >
                            {activeCardData.rewardsRate}
                          </span>
                        </div>
                        <div className="border-l border-gray-200 pl-4">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Annual Fee</span>
                          <span className="mt-0.5 block text-[15px] font-black text-gray-900">
                            {activeCardData.annualFee}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={activeCardData.href}
                        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-95"
                        style={{
                          background: "linear-gradient(135deg, #6424C7 0%, #8b5cf6 100%)",
                          boxShadow: "0 4px 16px rgba(100,36,199,0.35)",
                        }}
                      >
                        Apply Now
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-10 text-center">
          <Link
            href="/credit-cards"
            className="group inline-flex items-center gap-2 rounded-full border border-[#6424C7]/30 bg-purple-50/60 px-6 py-2.5 text-[13px] font-bold text-[#6424C7] transition-all duration-200 hover:bg-[#6424C7] hover:text-white hover:shadow-[0_4px_18px_rgba(100,36,199,0.30)]"
          >
            Compare All Credit Cards
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
