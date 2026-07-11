"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleCheckBig,
  CreditCard,
  Gauge,
  Landmark,
  Layers3,
  ReceiptText,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import type {
  CibilMetricIcon,
  CibilReportViewData,
} from "./types";

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
  accounts: "bg-[#e8f3fb] text-[#075cde]",
  age: "bg-[#e7f7f6] text-[#087f77]",
  "active-loans": "bg-[#e8f3fb] text-[#075cde]",
  "closed-loans": "bg-[#e9f8ef] text-[#168447]",
  "credit-cards": "bg-[#f0ecff] text-[#6548c7]",
};

export function CibilReportDetails({ data }: { data: CibilReportViewData }) {
  return (
    <MotionConfig reducedMotion="user">
      <section className="bg-white px-4 py-10 md:px-6 md:py-12 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="inline-flex items-center gap-2 text-[12px] font-extrabold text-[#075cde]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Saved bureau details
            </p>
            <h2 className="mt-3 text-[26px] font-extrabold leading-tight text-[#102f49] sm:text-[30px]">
              Credit profile breakdown
            </h2>
            <p className="mt-2 max-w-2xl text-[14px] font-medium leading-6 text-[#667f91]">
              Account, balance and payment indicators calculated from the report
              stored in your profile.
            </p>
          </motion.div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {data.detailMetrics.map((item, index) => {
              const Icon = metricIcons[item.icon];
              return (
                <motion.article
                  key={item.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="min-h-36 rounded-lg border border-[#d8e5ed] bg-white p-4"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-md ${metricTones[item.icon]}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-[11px] font-extrabold leading-4 text-[#526e82]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[20px] font-extrabold text-[#102f49]">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[9px] font-semibold leading-4 text-[#8ca0af]">
                    {item.subLabel}
                  </p>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {data.detailSections.map((section, index) => (
              <motion.article
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.15) }}
                className="overflow-hidden rounded-lg border border-[#d5e4ed] bg-white"
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#e1ebf1] bg-[#f7fafc] px-4 py-3.5 sm:px-5">
                  <h3 className="text-[14px] font-extrabold text-[#254e69]">
                    {section.title}
                  </h3>
                  <span className="text-[10px] font-bold text-[#8ca0af]">
                    {section.rows.length || 0} fields
                  </span>
                </div>
                <dl className="divide-y divide-[#e7eef3] px-4 sm:px-5">
                  {(section.rows.length
                    ? section.rows
                    : [{ label: "Status", value: "No data reported" }]
                  ).map((row) => (
                    <div
                      key={`${section.title}-${row.label}-${row.value}`}
                      className="flex items-start justify-between gap-4 py-3"
                    >
                      <dt className="text-[11px] font-semibold leading-5 text-[#7890a2]">
                        {row.label}
                      </dt>
                      <dd className="max-w-[58%] text-right text-[11px] font-extrabold leading-5 text-[#254e69]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="mt-6 grid overflow-hidden rounded-lg border border-[#c9dfec] bg-[#edf6fc] lg:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#075cde]">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Recommended next actions
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {data.recommendations.slice(0, 3).map((item, index) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-[10px] font-extrabold text-[#075cde]">
                      {index + 1}
                    </span>
                    <p className="text-[11px] font-semibold leading-5 text-[#526e82]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center border-t border-[#c9dfec] px-5 py-4 lg:border-l lg:border-t-0">
              <Link
                href="/support"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#9fc5d9] bg-white px-4 text-[11px] font-extrabold text-[#075cde] no-underline transition-colors hover:border-[#075cde]"
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
