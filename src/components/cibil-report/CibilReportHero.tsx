"use client";

import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";
import CreditScoreGauge from "./CreditScoreGauge"; // Preserved as requested

export function CibilReportHero() {
  const summaryRows = [
    {
      icon: "💳",
      label: "Payment History",
      subLabel: "% of On time Payments",
      value: "100%",
    },
    {
      icon: "💳",
      label: "Credit Card Utilization",
      subLabel: "% of Credit Limit Used",
      value: "10%",
    },
    {
      icon: "🗂️",
      label: "Credit Enquiries",
      subLabel: "All Loans & Credit Card",
      value: "1",
    },
    {
      icon: "📊",
      label: "Credit Mix",
      subLabel: "All Credit Accounts",
      value: "2",
    },
    {
      icon: "📅",
      label: "Credit Age",
      subLabel: "Oldest Credit Account",
      value: "2 y, 6 m",
    },
  ];

  return (
    <section className="relative w-full max-w-8xl mx-auto bg-white px-6 py-10 antialiased text-[#111827] overflow-hidden">
      {/* Soft blue corner accents from the image */}
      <div className="absolute top-0 left-0 -translate-x-6 -translate-y-6 w-24 h-24 bg-[#e8f4fd] rotate-45 -z-10 rounded-xl" />
      <div className="absolute top-0 left-0 -translate-x-12 -translate-y-2 w-20 h-20 bg-[#d4e9fc] rotate-45 -z-20 rounded-xl" />

      <div className="grid items-start gap-8 md:grid-cols-2">
        
        {/* LEFT SIDE: CREDIT SCORE */}
        <div className="w-full space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              You are on FREE Credit Score Plan
            </h1>

            <div className="mt-3 flex gap-3">
              <button
                type="button"
                className="rounded-md bg-[#00a653] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#009349]"
              >
                CIBIL
              </button>

              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-5 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                EXPERIAN
              </button>
            </div>

            <p className="mt-4 text-sm font-medium text-gray-700">
              Hey <span className="font-bold text-blue-600">Pawan!</span> Your Credit Score as of 01 Jun &apos;26
            </p>
          </div>

          {/* SCORE CARD CONTAINER */}
          <div className="max-w-85 rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
            <h3 className="text-sm font-bold tracking-tight text-gray-700">
              Your Current Score
            </h3>

            {/* Reusable Gauge Component */}
            <div className="mt-2 flex justify-center items-center">
              <CreditScoreGauge score={782} height={200} />
            </div>

            <Link
              href="/cibil-score/report"
              className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-[#00a653] text-sm font-bold text-white transition-all hover:bg-[#009349] active:scale-[0.99]"
            >
              Download Full Report
            </Link>

            <p className="mt-3 text-[10px] font-semibold text-gray-400">
              Report Date: 20th May, 2025
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: QUICK REPORT SUMMARY */}
        <div className="w-full">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-5">
            Quick Report Summary
          </h2>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
            <div className="divide-y divide-gray-100">
              {summaryRows.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <span className="shrink-0 text-xl w-6 text-center">{row.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold leading-tight text-gray-800">
                        {row.label}
                      </h4>
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                        {row.subLabel}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-gray-900">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Action Card */}
            <div className="flex items-center justify-between rounded-xl border border-[#bbf2d1] bg-[#e6f7ed] px-4 py-3.5 mt-2">
              <div>
                <p className="text-sm font-bold text-[#00a653]">
                  Oldest Credit Account
                </p>
                <p className="text-[11px] font-medium text-gray-500 mt-0.5">
                  In depth analysis of your Credit Score
                </p>
              </div>

              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00a653] text-white transition-transform hover:scale-105 active:scale-95"
              >
                <ArrowDownToLine className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}