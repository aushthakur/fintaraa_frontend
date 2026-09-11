"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleCheckBig,
  FileCheck2,
  Gauge,
  Layers3,
  Landmark,
  CreditCard,
  ReceiptText,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import type { CibilMetricIcon, CibilReportViewData } from "./types";

const metricIcons: Record<CibilMetricIcon, LucideIcon> = {
  payment: ReceiptText,
  utilization: Gauge,
  enquiries: SearchCheck,
  accounts: Layers3,
  age: BadgeCheck,
  "active-loans": Landmark,
  "closed-loans": CircleCheckBig,
  "credit-cards": CreditCard,
};

const metricTones: Record<CibilMetricIcon, string> = {
  payment: "bg-[#e9f8ef] text-[#168447]",
  utilization: "bg-[#fff4dd] text-[#a15c00]",
  enquiries: "bg-[#f0ecff] text-[#6548c7]",
  accounts: "bg-[#e8f3fb] text-[#5b21b6]",
  age: "bg-[#e7f7f6] text-[#087f77]",
  "active-loans": "bg-[#e8f3fb] text-[#5b21b6]",
  "closed-loans": "bg-[#e9f8ef] text-[#168447]",
  "credit-cards": "bg-[#f0ecff] text-[#6548c7]",
};

const metricBars: Record<CibilMetricIcon, string> = {
  payment: "bg-[#26a269]",
  utilization: "bg-[#e2a126]",
  enquiries: "bg-[#7559d5]",
  accounts: "bg-[#1976d2]",
  age: "bg-[#179b91]",
  "active-loans": "bg-[#1976d2]",
  "closed-loans": "bg-[#26a269]",
  "credit-cards": "bg-[#7559d5]",
};

const sectionMeta: Record<
  string,
  { icon: LucideIcon; tone: string; iconTone: string }
> = {
  "Account Summary": {
    icon: Layers3,
    tone: "from-[#eef7fd] to-white",
    iconTone: "bg-[#dceffa] text-[#5b21b6]",
  },
  "Loan Summary": {
    icon: Landmark,
    tone: "from-[#f1f3ff] to-white",
    iconTone: "bg-[#e5e9ff] text-[#4659b8]",
  },
  "Credit Card Summary": {
    icon: CreditCard,
    tone: "from-[#f5f1ff] to-white",
    iconTone: "bg-[#ebe3ff] text-[#6548c7]",
  },
  "Bureau Report Details": {
    icon: ShieldCheck,
    tone: "from-[#edf9f4] to-white",
    iconTone: "bg-[#dcf3e8] text-[#168447]",
  },
};

export function CibilReportDetails({ data }: { data: CibilReportViewData }) {
  return (
    <MotionConfig reducedMotion="user">
      <section className="border-y border-[#e2ebf1] bg-[#f7fafc] px-4 py-12 md:px-6 md:py-14 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <h2 className="mt-3 text-[27px] font-extrabold leading-tight tracking-[-0.02em] text-[#3b0764] sm:text-[32px]">
                Credit profile breakdown
              </h2>
              <p className="mt-2 max-w-2xl text-[14px] font-medium leading-6 text-[#667f91]">
                A structured view of the accounts, balances and repayment
                indicators reported in your latest bureau file.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#c9dfec] bg-white px-3.5 py-2 text-[10px] font-extrabold text-[#526e82] shadow-[0_4px_12px_rgba(30,74,102,0.06)]">
              <BadgeCheck
                className="h-4 w-4 text-[#168447]"
                aria-hidden="true"
              />
              Verified report data
            </span>
          </motion.div>

          <div className="mt-7 grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-6">
            {data.detailMetrics.map((item, index) => {
              const Icon = metricIcons[item.icon];
              return (
                <motion.article
                  key={item.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="group relative flex min-h-42 flex-col overflow-hidden rounded-2xl border border-[#d8e5ed] bg-white p-4 shadow-[0_8px_24px_rgba(30,74,102,0.055)] transition duration-300 hover:-translate-y-0.5 hover:border-[#bfd7e5] hover:shadow-[0_12px_30px_rgba(30,74,102,0.09)] sm:p-5"
                >
                  <span
                    className={`absolute inset-x-0 top-0 h-1 ${metricBars[item.icon]}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${metricTones[item.icon]}`}
                  >
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-[10px] font-extrabold uppercase leading-4 tracking-[0.08em] text-[#667f91]">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-[22px] font-extrabold tracking-[-0.02em] text-[#3b0764]">
                    {item.value}
                  </p>
                  <p className="mt-auto pt-2 text-[10px] font-semibold leading-4 text-[#8ca0af]">
                    {item.subLabel}
                  </p>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.detailSections.map((section, index) => {
              const meta = sectionMeta[section.title] || {
                icon: FileCheck2,
                tone: "from-[#f4f8fb] to-white",
                iconTone: "bg-[#e8f3fb] text-[#5b21b6]",
              };
              const SectionIcon = meta.icon;
              return (
                <motion.article
                  key={section.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.05, 0.15),
                  }}
                  className="overflow-hidden rounded-2xl border border-[#d5e4ed] bg-white shadow-[0_10px_28px_rgba(30,74,102,0.055)]"
                >
                  <div
                    className={`flex items-center justify-between gap-2 border-b border-[#e1ebf1] bg-linear-to-r ${meta.tone} px-4 py-3`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.iconTone}`}
                      >
                        <SectionIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <h3 className="text-[12px] font-extrabold leading-4 text-[#254e69]">
                        {section.title}
                      </h3>
                    </div>
                    <span className="shrink-0 rounded-full border border-[#d5e4ed] bg-white px-2 py-0.5 text-[8px] font-extrabold text-[#7890a2]">
                      {section.rows.length || 0} fields
                    </span>
                  </div>
                  <dl className="divide-y divide-[#edf2f5] px-4">
                    {(section.rows.length
                      ? section.rows
                      : [{ label: "Status", value: "No data reported" }]
                    ).map((row) => (
                      <div
                        key={`${section.title}-${row.label}-${row.value}`}
                        className="flex items-start justify-between gap-3 py-2.5"
                      >
                        <dt className="text-[10px] font-semibold leading-4 text-[#7890a2]">
                          {row.label}
                        </dt>
                        <dd className="max-w-[56%] text-right text-[10px] font-extrabold leading-4 text-[#254e69]">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </motion.article>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="mt-5 grid overflow-hidden rounded-2xl border border-[#163f5c] bg-[#0f344f] shadow-[0_16px_40px_rgba(15,52,79,0.16)] lg:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#8bc9f1]">
                <CheckCircle2
                  className="h-4 w-4 text-[#59d396]"
                  aria-hidden="true"
                />
                Recommended next actions
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {data.recommendations.slice(0, 3).map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/6 p-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/12 text-[10px] font-extrabold text-white">
                      {index + 1}
                    </span>
                    <p className="text-[11px] font-semibold leading-5 text-[#d7e6ef]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center border-t border-white/10 bg-white/4 px-5 py-4 lg:border-l lg:border-t-0">
              <Link
                href="/support"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white px-4 text-[11px] font-extrabold text-[#0f4e79] no-underline shadow-sm transition-colors hover:bg-[#edf7fd]"
              >
                Report an issue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
