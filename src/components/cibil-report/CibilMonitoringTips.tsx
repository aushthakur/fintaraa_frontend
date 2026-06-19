"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { CibilScoreHistoryPoint } from "./types";

const DEFAULT_CHART_DATA: CibilScoreHistoryPoint[] = [
  { month: "May", score: 710 },
  { month: "Jun", score: 723 },
  { month: "Jul", score: 746 },
  { month: "Aug", score: 763 },
  { month: "Sep", score: 773 },
  { month: "Oct", score: 781 },
];

const personalizedTips = [
  {
    id: 1,
    title: "Pay EMIs and bills on time",
    description: "Timely payments have the biggest impact on your credit score.",
  },
  {
    id: 2,
    title: "Keep credit utilization low",
    description: "Try to use less than 30% of your total credit limit.",
  },
  {
    id: 3,
    title: "Avoid multiple loan applications",
    description: "Too many credit checks in a short period can affect your score.",
  },
  {
    id: 4,
    title: "Maintain older credit accounts",
    description: "A longer credit history can help strengthen your score.",
  },
  {
    id: 5,
    title: "Check your credit report regularly",
    description: "Review your report for errors or incorrect entries and get them corrected.",
  },
];

export function CibilMonitoringTips({
  history = DEFAULT_CHART_DATA,
  improvementPoints,
}: {
  history?: CibilScoreHistoryPoint[];
  improvementPoints?: number;
}) {
  const chartData = history.length ? history : DEFAULT_CHART_DATA;
  const scores = chartData.map((point) => point.score);
  const minScore = Math.max(300, Math.min(...scores) - 10);
  const maxScore = Math.min(900, Math.max(...scores) + 10);
  const points =
    improvementPoints ??
    Math.max(0, chartData[chartData.length - 1].score - chartData[0].score);

  return (
    <section className="w-full max-w-9xl mx-auto bg-white px-4 py-10 antialiased text-[#111827] md:px-6 space-y-16">
      
      {/* TOP SECTION: CHART & EXPERT ADVICE */}
      <div className="grid items-start gap-10 lg:grid-cols-[1.5fr_1fr]">
        
        {/* LEFT SIDE: SCORE HISTORY CHART */}
        <div className="w-full flex flex-col justify-between h-full">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Score History & Monitoring
            </h2>
            <p className="mt-1.5 text-sm font-medium text-gray-500">
              Track your progress over the last 6 months
            </p>
          </div>

          {/* Recharts Wrapper */}
          <div className="mt-8 w-full pr-2 select-none">
            <ResponsiveContainer width="100%" height={256} minWidth={0}>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="2 3"
                  vertical={false}
                  stroke="#9ca3af"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#1f2937", fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  domain={[minScore, maxScore]}
                  tickCount={5}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#1f2937", fontSize: 12, fontWeight: 500 }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#005ca8"
                  strokeWidth={1.5}
                  dot={{ r: 3.5, fill: "#005ca8", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Banner Insight text block */}
          <div className="mt-6 rounded-lg bg-[#d9efff] px-4 py-3.5">
            <p className="text-xs font-semibold text-gray-900 tracking-wide">
              Great going! Your score improved by{" "}
              <span className="font-bold">{points} points</span> in the last 12
              months.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: EXPERT ADVICE CARD */}
        <div className="w-full h-full flex items-end mt-8 lg:mt-0 ">
          <aside className="w-full max-w-md lg:mx-0 rounded-2xl border xl:ml-auto  border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
            <h4 className="text-base font-bold text-gray-900 tracking-tight">
              Expert Advice
            </h4>
            
            {/* Embedded illustrative content block */}
            <div className="mt-4 relative w-full h-40 bg-[#f8f9fa] rounded-xl overflow-hidden flex items-center justify-center border border-gray-50">
              <div className="absolute inset-0 bg-linear-to-br from-[#e8f4ff] to-white opacity-60" />
              <div className="relative text-center p-4">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                  How to increase CIBIL Score
                </p>
                <p className="text-[9px] text-gray-400 font-medium mt-1">
                  Step-by-Step Improvement Guide
                </p>
                <div className="mt-3 flex justify-center gap-1.5">
                  <span className="w-7 h-1.5 rounded-full bg-red-500" />
                  <span className="w-7 h-1.5 rounded-full bg-amber-400" />
                  <span className="w-7 h-1.5 rounded-full bg-blue-500" />
                  <span className="w-7 h-1.5 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>

            <h3 className="mt-5 text-lg font-bold text-gray-950 leading-snug tracking-tight">
              Mastering Yor CIBIL: A10-Step Guide for Beginners
            </h3>
            
            <p className="mt-2 text-xs font-medium text-gray-400 leading-relaxed">
              Learn the secret hacks that banks use to determine your risk profile.
            </p>

            <Link
              href="/blog/improve-cibil-score"
              className="mt-6 flex items-center gap-1 text-sm font-bold text-[#005ca8] hover:underline w-fit"
            >
              Read Full Article
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </aside>
        </div>

      </div>

      {/* BOTTOM SECTION: PERSONALIZED IMPROVEMENT TIPS */}
      <div className="w-full">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Personalized Improvement Tips
          </h2>
          <p className="mt-1.5 text-sm font-medium text-gray-500">
            Track your progress over the last 6 months
          </p>
        </div>

        {/* List of clean cards matching the exact screenshot blueprint */}
        <div className="mt-6 space-y-3">
          {personalizedTips.map((tip) => (
            <div
              key={tip.id}
              className="flex items-start gap-4 sm:gap-6 rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-gray-200"
            >
              {/* Card Index Indicator */}
              <span className="text-sm font-bold text-gray-800 w-4 shrink-0 pt-0.5">
                {tip.id}
              </span>
              
              {/* Content text stack */}
              <div className="space-y-1">
                <h4 className="text-sm font-bold tracking-tight text-gray-900">
                  {tip.title}
                </h4>
                <p className="text-xs font-medium text-gray-400 leading-normal">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
