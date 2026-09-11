"use client";

import { motion } from "framer-motion";
import {
  Banknote,
  Plane,
  Fuel,
  Star,
  ShoppingBag,
  User,
  Briefcase,
  Gem,
} from "lucide-react";

const categories = [
  {
    title: "Cashback",
    icon: Banknote,
    iconBg: "bg-[#e8f4ff]",
    iconColor: "text-[#4c1d95]",
  },
  {
    title: "Travel",
    icon: Plane,
    iconBg: "bg-[#ffe3ff]",
    iconColor: "text-[#cc00cc]",
  },
  {
    title: "Fuel",
    icon: Fuel,
    iconBg: "bg-[#e1ffe1]",
    iconColor: "text-[#00b33c]",
  },
  {
    title: "Rewards",
    icon: Star,
    iconBg: "bg-[#fff0e0]",
    iconColor: "text-[#e67300]",
  },
  {
    title: "Lifetime Free",
    icon: ShoppingBag,
    iconBg: "bg-[#ffe6f2]",
    iconColor: "text-[#e60073]",
  },
  {
    title: "Beginners",
    icon: User,
    iconBg: "bg-[#e8f4ff]",
    iconColor: "text-[#4c1d95]",
  },
  {
    title: "Self-Employed",
    icon: Briefcase,
    iconBg: "bg-[#e1ffe1]",
    iconColor: "text-[#00b33c]",
  },
  {
    title: "Super-Premium",
    icon: Gem,
    iconBg: "bg-[#ffffcc]",
    iconColor: "text-[#b3b300]",
  },
];

export function ExploreCategories({
  selectedCategories = [],
  onSelect,
  onViewAll,
}: {
  selectedCategories?: string[];
  onSelect: (category: string) => void;
  onViewAll: () => void;
}) {
  return (
    <section className="bg-white px-4 py-8 font-sans md:px-8 md:py-12 lg:px-16">
      <div className="mx-auto max-w-9xl">
        {/* Header Section */}
        <div className="mb-5 flex flex-row items-center justify-between gap-3 md:mb-8 md:items-end">
          <div>
            <h2 className="text-[20px] font-extrabold leading-tight tracking-tight text-[#22252a] md:text-[26px]">
              Explore Credit Cards by Category
            </h2>
            <p className="mt-1 hidden max-w-xl text-[14px] leading-relaxed text-[#8a94a6] sm:block">
              Find the perfect credit card for your lifestyle and spending
              needs.
            </p>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[12px] font-bold text-[#4c1d95] hover:underline md:text-[13px]"
          >
            View All Cards <span className="text-[14px]">→</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-4 xl:grid-cols-8">
          {categories.map(({ title, icon: Icon, iconBg, iconColor }, index) => (
            <motion.button
              type="button"
              key={title}
              onClick={() => onSelect(title)}
              aria-pressed={selectedCategories.includes(title)}
              initial={{ opacity: 0.95, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{
                duration: 0.45,
                delay: Math.min(index * 0.04, 0.2),
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`flex min-h-22 cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-left transition-[border-color,background-color,box-shadow] duration-200 md:min-h-36.25 md:flex-col md:justify-center md:p-5 md:text-center ${
                selectedCategories.includes(title)
                  ? "border-[#4c1d95] bg-[#f3f9ff] shadow-[0_8px_24px_rgba(0,92,168,0.12)]"
                  : "border-[#e3ebf3] bg-white shadow-[0_4px_12px_rgba(22,34,50,0.02)] hover:border-[#b9d7f0] hover:shadow-md"
              }`}
            >
              {/* Colored Circular Icon Container */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:h-14 md:w-14 ${iconBg} ${iconColor}`}
              >
                <Icon className="h-4.5 w-4.5 md:h-6 md:w-6" />
              </div>

              {/* Stacked Labels */}
              <div className="min-w-0 md:mt-4">
                <p className="wrap-break-word text-[12px] font-bold leading-tight text-[#1a1d24] md:text-[14px]">
                  {title}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-[#8a94a6] md:text-[11px]">
                  Cards
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
