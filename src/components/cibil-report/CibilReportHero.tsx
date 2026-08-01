"use client";

import type { LucideIcon } from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import {
  CreditCard,
  BadgeCheck,
  CalendarClock,
  CircleCheckBig,
  ArrowDownToLine,
  Gauge,
  Layers3,
  Database,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import CreditScoreGauge from "./CreditScoreGauge";
import type { CibilMetricIcon, CibilReportViewData } from "./types";

const metricIcons: Record<CibilMetricIcon, LucideIcon> = {
  payment: CircleCheckBig,
  utilization: Gauge,
  enquiries: SearchCheck,
  accounts: Layers3,
  age: CalendarClock,
  "active-loans": BadgeCheck,
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

const scoreBand = (score: number) => {
  if (!score) return { label: "Not fetched", tone: "text-[#667f91]" };
  if (score < 650) return { label: "Needs attention", tone: "text-[#c2413a]" };
  if (score < 700) return { label: "Fair", tone: "text-[#a15c00]" };
  if (score < 750) return { label: "Good", tone: "text-[#075cde]" };
  return { label: "Excellent", tone: "text-[#168447]" };
};

export function CibilReportHero({
  data,
  downloadingReport,
  onDownloadReport,
}: {
  data: CibilReportViewData;
  downloadingReport?: boolean;
  onDownloadReport?: () => void;
}) {
  const band = scoreBand(data.score);

  return (
    <MotionConfig reducedMotion="user">
      <section className="border-b border-[#d9e8f2] bg-[#f3f9fd] px-4 py-9 md:px-6 md:py-11 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <h1 className="mt-4 text-[31px] font-extrabold leading-tight text-[#102f49] sm:text-[36px] lg:text-[40px]">
                Your {data.scoreBureauLabel} credit report
              </h1>
              <p className="mt-3 max-w-2xl text-[14px] font-medium leading-7 text-[#58758a] sm:text-[15px]">
                Hi{" "}
                <span className="font-bold text-[#254e69]">
                  {data.userName}
                </span>
                , this overview is built from the latest report saved securely
                to your Fintaraa profile.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold text-[#526e82]">
              <span className="inline-flex items-center gap-2">
                <Database
                  className="h-4 w-4 text-[#075cde]"
                  aria-hidden="true"
                />
                {data.sourceLabel}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarClock
                  className="h-4 w-4 text-[#075cde]"
                  aria-hidden="true"
                />
                Updated {data.scoreDateLabel}
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck
                  className="h-4 w-4 text-[#168447]"
                  aria-hidden="true"
                />
                Profile synced
              </span>
            </div>
          </motion.div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex min-h-110 flex-col rounded-lg border border-[#c9dfec] bg-white p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-extrabold text-[#075cde]">
                    {data.scoreBureauLabel}
                  </p>
                  <h2 className="mt-1 text-[20px] font-extrabold text-[#102f49]">
                    Current credit score
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#e9f8ef] px-2.5 py-1.5 text-[10px] font-extrabold text-[#168447]">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Profile verified
                </span>
              </div>

              <div className="mx-auto mt-2 w-full max-w-105 flex-1">
                <CreditScoreGauge score={data.score} scale={1.05} />
              </div>

              <div className="grid grid-cols-2 border-y border-[#e3edf3] py-3">
                <div className="border-r border-[#e3edf3] pr-3">
                  <p className="text-[10px] font-bold text-[#7890a2]">
                    Score band
                  </p>
                  <p className={`mt-1 text-[14px] font-extrabold ${band.tone}`}>
                    {band.label}
                  </p>
                </div>
                <div className="pl-4">
                  <p className="text-[10px] font-bold text-[#7890a2]">
                    Report date
                  </p>
                  <p className="mt-1 text-[14px] font-extrabold text-[#254e69]">
                    {data.reportDateLabel}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onDownloadReport}
                disabled={downloadingReport || !data.reportAvailable}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#075cde] px-4 text-[13px] font-extrabold text-white transition-colors hover:bg-[#064cb8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                {downloadingReport
                  ? "Preparing report..."
                  : "Download full report"}
              </button>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-lg border border-[#c9dfec] bg-white p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-extrabold text-[#075cde]">
                    At-a-glance factors
                  </p>
                  <h2 className="mt-1 text-[20px] font-extrabold text-[#102f49]">
                    Quick report summary
                  </h2>
                </div>
                <span className="rounded-md bg-[#edf6fc] px-2.5 py-1.5 text-[10px] font-bold text-[#526e82]">
                  Live profile data
                </span>
              </div>

              <div className="mt-5 divide-y divide-[#e6eef3]">
                {data.summaryRows.map((row) => {
                  const Icon = metricIcons[row.icon];
                  return (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${metricTones[row.icon]}`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-[13px] font-extrabold text-[#254e69]">
                            {row.label}
                          </h3>
                          <p className="mt-0.5 text-[10px] font-semibold text-[#7890a2] sm:text-[11px]">
                            {row.subLabel}
                          </p>
                        </div>
                      </div>
                      <span className="max-w-30 text-right text-[14px] font-extrabold text-[#102f49] sm:text-[15px]">
                        {row.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-[#e3edf3] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[12px] font-extrabold text-[#254e69]">
                    Detailed bureau analysis
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-[#7890a2]">
                    Accounts, balances, enquiries and payment behaviour
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onDownloadReport}
                  disabled={downloadingReport || !data.reportAvailable}
                  title="Download detailed CIBIL report"
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-[#a9cde0] px-3.5 text-[11px] font-extrabold text-[#075cde] transition-colors hover:border-[#075cde] hover:bg-[#f0f7fc] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                  Full report
                </button>
              </div>
            </motion.article>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
