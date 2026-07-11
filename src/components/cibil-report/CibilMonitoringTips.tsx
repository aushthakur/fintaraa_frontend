"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowUpRight,
  BookOpenCheck,
  CheckCircle2,
  LineChart as LineChartIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { CibilScoreHistoryPoint } from "./types";

const defaultRecommendations = [
  "Pay every EMI and credit card bill on or before its due date.",
  "Keep revolving credit utilization controlled, ideally around 30% or less.",
  "Apply for new credit selectively to avoid repeated hard enquiries.",
  "Review all active and closed accounts for inaccurate bureau reporting.",
  "Retain older, well-managed accounts when they remain useful and affordable.",
];

export function CibilMonitoringTips({
  history = [],
  improvementPoints = 0,
  recommendations = defaultRecommendations,
}: {
  history?: CibilScoreHistoryPoint[];
  improvementPoints?: number;
  recommendations?: string[];
}) {
  const scores = history.map((point) => point.score);
  const minScore = scores.length
    ? Math.max(300, Math.min(...scores) - 20)
    : 300;
  const maxScore = scores.length
    ? Math.min(900, Math.max(...scores) + 20)
    : 900;
  const trendUp = improvementPoints > 0;
  const trendDown = improvementPoints < 0;
  const TrendIcon = trendDown ? TrendingDown : TrendingUp;

  return (
    <MotionConfig reducedMotion="user">
      <section className="bg-white px-4 py-11 md:px-6 md:py-14 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(330px,0.65fr)]">
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-lg border border-[#d5e4ed] bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-[12px] font-extrabold text-[#075cde]">
                    <LineChartIcon className="h-4 w-4" aria-hidden="true" />
                    Score monitoring
                  </p>
                  <h2 className="mt-3 text-[24px] font-extrabold text-[#102f49] sm:text-[28px]">
                    Credit score history
                  </h2>
                  <p className="mt-2 text-[12px] font-medium text-[#7890a2]">
                    Actual CIBIL fetches recorded during the last 12 months
                  </p>
                </div>
                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-md px-3 py-2 text-[11px] font-extrabold ${
                    trendDown
                      ? "bg-[#fff0f1] text-[#b4232d]"
                      : trendUp
                        ? "bg-[#e9f8ef] text-[#168447]"
                        : "bg-[#edf6fc] text-[#526e82]"
                  }`}
                >
                  <TrendIcon className="h-4 w-4" aria-hidden="true" />
                  {history.length >= 2
                    ? `${improvementPoints > 0 ? "+" : ""}${improvementPoints} points`
                    : "First recorded score"}
                </span>
              </div>

              {history.length ? (
                <div className="mt-7 h-65 w-full select-none" aria-label="CIBIL score history chart">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <LineChart
                      data={history}
                      margin={{ top: 10, right: 12, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 4"
                        vertical={false}
                        stroke="#dbe7ee"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#667f91", fontSize: 11, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis
                        domain={[minScore, maxScore]}
                        tickCount={5}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#7890a2", fontSize: 10, fontWeight: 600 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#075cde"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#ffffff", stroke: "#075cde", strokeWidth: 2 }}
                        activeDot={{ r: 5, fill: "#075cde" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-7 flex min-h-65 flex-col items-center justify-center border-y border-[#e1ebf1] px-5 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#e8f3fb] text-[#075cde]">
                    <LineChartIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-[13px] font-extrabold text-[#254e69]">
                    Score history is not available yet
                  </p>
                  <p className="mt-2 max-w-md text-[11px] font-medium leading-5 text-[#7890a2]">
                    Future bureau refreshes will appear here after they are saved to your profile.
                  </p>
                </div>
              )}

              <div className="mt-5 flex items-start gap-3 rounded-md bg-[#edf6fc] px-4 py-3">
                <TrendIcon
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    trendDown ? "text-[#b4232d]" : "text-[#075cde]"
                  }`}
                  aria-hidden="true"
                />
                <p className="text-[11px] font-semibold leading-5 text-[#526e82]">
                  {history.length >= 2
                    ? trendUp
                      ? `Your recorded score increased by ${improvementPoints} points across the available history.`
                      : trendDown
                        ? `Your recorded score decreased by ${Math.abs(improvementPoints)} points. Review recent enquiries, balances and payments.`
                        : "Your recorded score is unchanged across the available history."
                    : "A single saved score is shown without an estimated or fabricated trend."}
                </p>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-lg border border-[#d5e4ed] bg-white"
            >
              <div className="relative aspect-16/9 bg-[#eef7fc]">
                <Image
                  src="/assets/images/cibil-score-quality.png"
                  alt="Credit score analysis and improvement"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover"
                />
              </div>
              <div className="p-5 sm:p-6">
                <p className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#075cde]">
                  <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                  Expert guide
                </p>
                <h2 className="mt-3 text-[20px] font-extrabold leading-7 text-[#102f49]">
                  Practical steps to improve your CIBIL score
                </h2>
                <p className="mt-2 text-[12px] font-medium leading-6 text-[#667f91]">
                  Understand how payment history, utilization, enquiries and
                  credit age influence your profile.
                </p>
                <Link
                  href="/blog/improve-cibil-score-practical-steps"
                  className="mt-5 inline-flex items-center gap-2 text-[12px] font-extrabold text-[#075cde] no-underline"
                >
                  Read the improvement guide
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <p className="inline-flex items-center gap-2 text-[12px] font-extrabold text-[#075cde]">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Based on your report factors
            </p>
            <h2 className="mt-3 text-[24px] font-extrabold text-[#102f49] sm:text-[28px]">
              Personalized improvement priorities
            </h2>

            <div className="mt-6 overflow-hidden rounded-lg border border-[#d5e4ed] bg-white">
              {(recommendations.length
                ? recommendations
                : defaultRecommendations
              ).map((recommendation, index) => (
                <div
                  key={`${index}-${recommendation}`}
                  className="flex items-start gap-4 border-b border-[#e4edf2] px-4 py-4 last:border-b-0 sm:px-5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#e8f3fb] text-[11px] font-extrabold text-[#075cde]">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-[12px] font-semibold leading-5 text-[#526e82] sm:text-[13px]">
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
