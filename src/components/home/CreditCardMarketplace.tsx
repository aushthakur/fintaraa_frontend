"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Zap, Globe, ShoppingBag, Fuel, Gift } from "lucide-react";

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

export function CreditCardMarketplace() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [displayList, setDisplayList] = useState(cardsCatalog);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (selectedFilter === "all") {
      setDisplayList(cardsCatalog);
    } else {
      setDisplayList(cardsCatalog.filter((card) => card.category === selectedFilter));
    }
  }, [selectedFilter]);

  useEffect(() => {
    if (isHovered || displayList.length <= 1) return;
    const interval = setInterval(() => {
      setDisplayList((prev) => {
        const newArr = [...prev];
        const first = newArr.shift();
        if (first) newArr.push(first);
        return newArr;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, displayList.length]);

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
  };

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

        {/* ── Puzzle Grid Layout ── */}
        <div className="mt-8 sm:mt-12 w-full">
          <div 
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            style={{ gridAutoRows: "minmax(280px, 300px)" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {displayList.map((card, index) => {
              const pattern = ["md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-1", "md:col-span-1", "md:col-span-2"];
              const gridClass = pattern[index % pattern.length];
              
              return (
                <div 
                  key={`cell-${index}`} 
                  className={`group/card relative w-full h-full min-h-[280px] overflow-hidden rounded-2xl border border-gray-100 ${gridClass} bg-slate-900 transition-shadow duration-300 hover:shadow-xl`}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={card.cardImage}
                        alt={card.name}
                        fill
                        className="object-cover opacity-80 transition-transform duration-700 group-hover/card:scale-105"
                      />
                      {/* Dark overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover/card:opacity-95" />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 text-white">
                         {/* Bank Logo / Badge */}
                         <div className="flex items-center gap-3 mb-2">
                           <div className="relative h-6 w-16 shrink-0 bg-white/20 backdrop-blur-sm rounded p-1">
                             <Image
                               src={card.bankLogo}
                               alt={card.bankName}
                               fill
                               className="object-contain"
                             />
                           </div>
                           <span
                             className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase border bg-white/10 backdrop-blur-md"
                             style={{ color: card.accentColor, borderColor: `${card.accentColor}40` }}
                           >
                             {card.badge}
                           </span>
                         </div>

                        <h3 className="text-[18px] sm:text-[22px] font-bold leading-tight mb-1">{card.name}</h3>
                        <p className="text-[13px] sm:text-[14px] font-semibold text-white mb-2">{card.rewardsRate} • {card.annualFee}</p>
                        <p className="text-[12px] sm:text-[13px] text-gray-200 line-clamp-2 mb-4 max-w-[85%]">{card.keyBenefit}</p>
                        <Link
                          href={card.href}
                          className="inline-flex w-fit items-center gap-2 text-[13px] font-bold text-white transition hover:text-[#c4b5fd]"
                          style={{ color: card.accentColor }}
                        >
                          Apply Now <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
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
