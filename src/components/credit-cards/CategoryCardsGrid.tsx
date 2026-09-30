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
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900 leading-[1.12]">
              Explore Credit Cards by <span className="text-[#6424C7]">Category</span>
            </h2>
            <p className="mt-3 text-[15px] sm:text-[17px] leading-relaxed text-slate-600 font-normal">
              Find the perfect credit card tailored for your lifestyle, spending habits, and travel needs.
            </p>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex shrink-0 items-center justify-center h-11 px-5 rounded-xl bg-purple-50 text-[14px] font-normal text-[#6424C7] hover:bg-purple-100 transition-colors"
          >
            View All Cards <span className="ml-1.5">→</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-8">
          {categories.map(({ title, icon: Icon, iconBg, iconColor }, index) => (
            <motion.button
              type="button"
              key={title}
              onClick={() => onSelect(title)}
              aria-pressed={selectedCategories.includes(title)}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.3,
                delay: index * 0.03,
              }}
              className={`relative overflow-hidden group flex flex-col items-center justify-center p-3 sm:p-4 text-center transition-all duration-300 min-h-[110px] sm:min-h-[130px] rounded-2xl ${
                selectedCategories.includes(title)
                  ? "bg-[#6424C7] shadow-lg shadow-purple-900/20 border border-[#6424C7]"
                  : "bg-white hover:bg-slate-50 border border-slate-200 hover:border-purple-300 hover:shadow-md"
              }`}
            >
              {/* Colored Circular Icon Container */}
              <div
                className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                  selectedCategories.includes(title)
                    ? "bg-white/20 text-white"
                    : `${iconBg} ${iconColor} group-hover:bg-[#6424C7] group-hover:text-white`
                }`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              {/* Stacked Labels */}
              <div className="mt-3 w-full relative z-10">
                <p
                  className={`text-[12px] sm:text-[13px] font-bold leading-tight transition-colors duration-300 ${
                    selectedCategories.includes(title)
                      ? "text-white"
                      : "text-slate-900 group-hover:text-[#6424C7]"
                  }`}
                >
                  {title}
                </p>
                <p
                  className={`mt-0.5 text-[10px] sm:text-[11px] font-medium transition-colors duration-300 ${
                    selectedCategories.includes(title)
                      ? "text-purple-200"
                      : "text-slate-500"
                  }`}
                >
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
