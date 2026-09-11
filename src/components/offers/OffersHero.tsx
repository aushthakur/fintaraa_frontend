"use client";

import Image from "next/image";
import { motion, MotionConfig } from "framer-motion";
import {
  BadgeCheck,
  Gift,
  Percent,
  Search,
  ShieldCheck,
  WalletCards,
  X,
} from "lucide-react";

type OffersHeroProps = {
  offerCount: number;
  query: string;
  onQueryChange: (value: string) => void;
};

const offerTypes = [
  { label: "Bank offers", icon: BadgeCheck },
  { label: "Cashback", icon: WalletCards },
  { label: "Rewards", icon: Gift },
];

export function OffersHero({
  offerCount,
  query,
  onQueryChange,
}: OffersHeroProps) {
  return (
    <MotionConfig reducedMotion="user">
      <section className="overflow-hidden px-4 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl items-center gap-6 pb-4 pt-8 sm:gap-8 sm:py-12 lg:min-h-115 lg:grid-cols-[minmax(0,1.04fr)_minmax(390px,0.96fr)] lg:gap-14 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-[12px] font-bold text-[#5b21b6]">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#ddecf8]">
                <Percent className="h-4 w-4" aria-hidden="true" />
              </span>
              Curated financial benefits
            </div>

            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.16] text-[#3b0764] sm:text-[38px] lg:text-[42px]">
              Offers &amp; Rewards
            </h1>
            <p className="mt-3 max-w-xl text-[20px] font-extrabold leading-7 text-[#254e69] sm:text-[22px]">
              More value in every decision.
            </p>
            <p className="mt-3 max-w-xl text-[15px] font-medium leading-7 text-[#526e82] sm:text-[16px]">
              Explore active loan, credit card, and insurance benefits from
              Fintaraa&apos;s trusted partner network.
            </p>

            <label className="mt-7 flex h-13 max-w-xl items-center gap-3 rounded-lg border border-[#b9d5e6] bg-white px-4 transition-colors focus-within:border-[#5b21b6] sm:h-14">
              <Search
                className="h-5 w-5 shrink-0 text-[#527189]"
                aria-hidden="true"
              />
              <span className="sr-only">Search offers</span>
              <input
                value={query}
                type="text"
                inputMode="search"
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search offers, banks or products"
                className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#3b0764] outline-none placeholder:font-medium placeholder:text-[#8ca0af]"
              />
              {query ? (
                <button
                  type="button"
                  title="Clear offer search"
                  aria-label="Clear offer search"
                  onClick={() => onQueryChange("")}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#7890a2] transition-colors hover:bg-[#eef6fb] hover:text-[#5b21b6]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </label>

            <div className="mt-5 hidden flex-wrap items-center gap-x-5 gap-y-3 sm:flex">
              {offerTypes.map((item) => {
                const Icon = item.icon;
                return (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-2 text-[12px] font-bold text-[#44647a]"
                  >
                    <Icon
                      className="h-4 w-4 text-[#5b21b6]"
                      aria-hidden="true"
                    />
                    {item.label}
                  </span>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto min-h-68 w-full max-w-135 sm:min-h-90 lg:min-h-105"
          >
            <div className="absolute inset-x-5 bottom-3 top-5 rounded-lg bg-[#dceefa] sm:inset-x-8 lg:bottom-2 lg:top-3" />
            <div className="absolute inset-x-9 bottom-8 top-12 overflow-hidden rounded-lg border border-[#c4dfef] bg-[#edf7fc] sm:inset-x-13 lg:bottom-7 lg:top-9">
              <div
                className="absolute inset-0 grid grid-cols-4 opacity-70"
                aria-hidden="true"
              >
                {Array.from({ length: 4 }).map((_, index) => (
                  <span
                    key={index}
                    className="border-r border-[#d7eaf5] last:border-r-0"
                  />
                ))}
              </div>
              <div className="absolute inset-x-0 top-1/2 border-t border-[#d7eaf5]" />
            </div>

            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{
                duration: 5.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-x-4 bottom-7 top-3 sm:inset-x-7 sm:bottom-8 lg:inset-x-4 lg:bottom-5 lg:top-0"
            >
              <Image
                priority
                src="/assets/offers/hero.png"
                alt="Gift box with discount coupon and reward timer"
                fill
                unoptimized
                sizes="(max-width: 1024px) 90vw, 520px"
                className="object-contain p-5 sm:p-7"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="absolute left-0 top-9 flex items-center gap-2 rounded-lg border border-[#bad9ea] bg-white px-3 py-2 sm:left-2 sm:top-12"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#e9f4fb] text-[#5b21b6]">
                <Percent className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[10px] font-semibold text-[#7890a2]">
                  Value-led deals
                </span>
                <span className="block text-[12px] font-extrabold text-[#3b0764]">
                  Offers & rewards
                </span>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="absolute bottom-2 right-0 flex max-w-49 items-center gap-2 rounded-lg bg-[#5b21b6] px-3 py-2.5 text-white sm:right-2"
            >
              <ShieldCheck
                className="h-5 w-5 shrink-0 text-[#bfe4ff]"
                aria-hidden="true"
              />
              <span className="text-[11px] font-bold leading-4">
                {query.trim()
                  ? `${offerCount} matching ${offerCount === 1 ? "offer" : "offers"}`
                  : offerCount > 0
                    ? `${offerCount} active offers to explore`
                    : "Verified partner offers"}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
