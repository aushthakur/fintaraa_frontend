"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  ChartNoAxesCombined,
  CreditCard,
  FileText,
  History,
  Landmark,
  LineChart,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";

const factors = [
  {
    title: "Payment history",
    desc: "Consistent EMI and card-bill payments support a healthier repayment record.",
    icon: History,
    color: "text-[#5b21b6]",
    surface: "bg-[#e7f2ff]",
  },
  {
    title: "Credit utilisation",
    desc: "Using a smaller share of your available revolving limit signals controlled usage.",
    icon: CreditCard,
    color: "text-[#07845e]",
    surface: "bg-[#edf9f3]",
  },
  {
    title: "Credit age",
    desc: "Older, well-managed accounts help establish a longer borrowing track record.",
    icon: BarChart3,
    color: "text-[#9a6700]",
    surface: "bg-[#fff8e5]",
  },
  {
    title: "Credit mix",
    desc: "A balanced record across secured and unsecured credit can strengthen the profile.",
    icon: LineChart,
    color: "text-[#7c4bc1]",
    surface: "bg-[#f5efff]",
  },
  {
    title: "Credit enquiries",
    desc: "Several applications in a short period can indicate elevated credit dependence.",
    icon: FileText,
    color: "text-[#c44732]",
    surface: "bg-[#fff1ed]",
  },
];

const benefits = [
  {
    number: "01",
    title: "Know your credit health",
    text: "See where your current credit profile stands before applying.",
    icon: Target,
    color: "text-[#5b21b6]",
    surface: "bg-[#e7f2ff]",
  },
  {
    number: "02",
    title: "Plan loan eligibility",
    text: "Use the score as one input while preparing for a loan application.",
    icon: Landmark,
    color: "text-[#07845e]",
    surface: "bg-[#edf9f3]",
  },
  {
    number: "03",
    title: "Review credit access",
    text: "Understand how lenders may view your card and borrowing profile.",
    icon: CreditCard,
    color: "text-[#9a6700]",
    surface: "bg-[#fff8e5]",
  },
  {
    number: "04",
    title: "Track financial progress",
    text: "Monitor changes over time and identify areas that need attention.",
    icon: ChartNoAxesCombined,
    color: "text-[#7c4bc1]",
    surface: "bg-[#f5efff]",
  },
];

export function CibilBenefitsFactors() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="w-full bg-[#eef7fc] px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.65fr)] lg:items-end lg:gap-16">
            <motion.div
              initial={{ opacity: 0.95, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-[#5b21b6]">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                Credit awareness
              </p>
              <h2 className="mt-3 max-w-2xl text-[28px] font-bold leading-[1.16] text-[#3b0764] sm:text-[34px]">
                Why check your CIBIL score?
              </h2>
              <p className="mt-4 max-w-2xl text-[14px] font-medium leading-7 text-[#587287] md:text-[15px]">
                Regular monitoring gives you a clearer view of your credit health
                before an important loan or credit-card decision.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0.95, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-5 border-y border-[#c7dfec] py-5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-[#07845e]">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[14px] font-bold text-[#103e60]">
                  Checking does not lower your score
                </p>
                <p className="mt-1 text-[12px] font-medium leading-5 text-[#60798c]">
                  Viewing your own report is treated differently from a lender&apos;s
                  hard credit enquiry.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="mt-10 grid border-y border-[#c7dfec] sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0.95, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: 0.48,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`grid min-w-0 grid-cols-[40px_minmax(0,1fr)] gap-x-4 py-5 sm:block sm:px-5 sm:py-6 lg:px-6 ${
                    index === 1
                      ? "border-t border-[#c7dfec] sm:border-l sm:border-t-0"
                      : index === 2
                        ? "border-t border-[#c7dfec] lg:border-l lg:border-t-0"
                        : index === 3
                          ? "border-t border-[#c7dfec] sm:border-l lg:border-t-0"
                          : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.surface} ${item.color}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="hidden text-[12px] font-bold text-[#8aa0af] sm:block">
                      {item.number}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3 sm:mt-5">
                      <h3 className="text-[16px] font-bold leading-snug text-[#3b0764]">
                        {item.title}
                      </h3>
                      <span className="text-[11px] font-bold text-[#8aa0af] sm:hidden">
                        {item.number}
                      </span>
                    </div>
                    <p className="mt-2 text-[12px] font-medium leading-5 text-[#5c7487]">
                      {item.text}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-white px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-20">
            <motion.div
              initial={{ opacity: 0.95, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[11px] font-bold uppercase text-[#5b21b6]">
                Credit profile signals
              </p>
              <h2 className="mt-3 text-[28px] font-bold leading-[1.16] text-[#3b0764] sm:text-[34px]">
                What affects your score?
              </h2>
              <p className="mt-4 text-[14px] font-medium leading-7 text-[#587287]">
                Your score reflects a combination of repayment and borrowing
                behaviour, not a single transaction.
              </p>

              <div className="mt-8 flex h-30 items-end gap-2" aria-hidden="true">
                {[46, 64, 82, 102, 120].map((height, index) => (
                  <motion.span
                    key={height}
                    initial={{ height: 0 }}
                    whileInView={{ height }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`w-8 rounded-t-sm ${
                      index === 4
                        ? "bg-[#07845e]"
                        : index === 3
                          ? "bg-[#28a8c7]"
                          : "bg-[#76b9e6]"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-3 text-[11px] font-semibold text-[#7890a2]">
                Five core signals viewed together
              </p>
            </motion.div>

            <div className="grid border-t border-[#d8e6ef] sm:grid-cols-2">
              {factors.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0.95, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(index * 0.05, 0.18),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`flex min-w-0 gap-4 border-b border-[#d8e6ef] py-6 sm:px-6 ${
                      index % 2 === 0 ? "sm:border-r sm:pl-0" : "sm:pr-0"
                    } ${index === factors.length - 1 ? "sm:col-span-2 sm:border-r-0 sm:px-0" : ""}`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.surface} ${item.color}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-[16px] font-bold text-[#3b0764]">
                          {item.title}
                        </h3>
                        <span className="text-[10px] font-bold text-[#9aabb8]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-2 text-[12px] font-medium leading-5 text-[#5c7487]">
                        {item.desc}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0.95, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid items-center gap-6 border-y border-[#cfe2ef] bg-[#f1f8fc] px-5 py-6 sm:grid-cols-[minmax(0,1fr)_auto] md:px-8"
          >
            <div className="flex items-center gap-4">
              <span className="relative hidden h-16 w-24 shrink-0 sm:block">
                <Image
                  src="/assets/images/security.png"
                  alt="Secure credit report verification"
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </span>
              <div>
                <h3 className="text-[18px] font-bold text-[#3b0764]">
                  Monitor your credit health with Fintaraa
                </h3>
                <p className="mt-1 text-[13px] font-medium leading-5 text-[#60788b]">
                  Access your score securely and review your latest credit profile.
                </p>
              </div>
            </div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/cibil-score/report"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#5b21b6] px-5 text-[13px] font-bold text-white no-underline hover:bg-[#4c1d95] sm:w-auto"
              >
                Check my score
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
