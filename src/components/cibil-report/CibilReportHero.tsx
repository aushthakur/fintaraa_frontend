"use client";

import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";
import CreditScoreGauge from "./CreditScoreGauge";

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
    <section className="relative w-full max-w-9xl mx-auto bg-white px-4 sm:px-6 py-8 sm:py-10 antialiased text-[#111827] overflow-hidden">
      <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        {/* Left-most rectangle bleeding off the screen */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "55px",
            height: "90px",
            top: "-20px",
            left: "-15px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
        {/* Right parallel rectangle matching the screenshot position */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "60px",
            height: "120px",
            top: "-80px",
            left: "40px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
      </div>
      <div className="grid items-start gap-8 sm:gap-10 md:gap-12 grid-cols-1 md:grid-cols-2 mt-3 ms-0 sm:ms-6">
        {/* LEFT SIDE: CREDIT SCORE */}
        <div className="w-full space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              You are on FREE Credit Score Plan
            </h1>

            <div className="mt-3 flex gap-3">
              <button
                type="button"
                className="rounded-md bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-5 py-2 text-xs font-bold text-white transition-colors hover:brightness-110"
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
              Hey <span className="font-bold text-blue-600">Pawan!</span> Your
              Credit Score as of 01 Jun &apos;26
            </p>
          </div>

          {/* SCORE CARD CONTAINER */}
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 mx-auto md:mx-0">
            <h3 className="text-base text-center font-bold tracking-tight text-gray-700">
              Your Current Score
            </h3>

            {/* Reusable Gauge Component */}
            <div className="flex justify-center overflow-hidden w-full">
              <div className="max-w-65 sm:max-w-none mx-auto">
                <CreditScoreGauge score={782} width={260} height={150} scale={1.05} />
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Link
                href="/cibil-score/report"
                className="flex h-11 w-full items-center justify-center rounded-xl bg-linear-to-r from-[#0fae5e] to-[#17cb70] text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.99]"
              >
                Download Full Report
              </Link>

              <p className="text-[11px] font-semibold text-gray-400">
                Report Date: 20th May, 2025
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: QUICK REPORT SUMMARY */}
        <div className="w-full">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6 text-center md:text-left">
            Quick Report Summary
          </h2>

          <div className="rounded-2xl border border-gray-300 bg-white p-4 sm:p-6 mx-auto md:mx-0">
            <div className="divide-y divide-gray-100">
              {summaryRows.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 sm:py-4 first:pt-0 last:pb-5"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="shrink-0 text-xl sm:text-2xl w-5 sm:w-6 text-center">
                      {row.icon}
                    </span>
                    <div>
                      <h4 className="text-[13px] sm:text-[15px] font-bold tracking-tight text-gray-800 leading-snug">
                        {row.label}
                      </h4>
                      <p className="text-[11px] sm:text-xs font-medium text-gray-400 mt-0.5">
                        {row.subLabel}
                      </p>
                    </div>
                  </div>

                  <span className="text-[13px] sm:text-[15px] font-bold text-gray-900 shrink-0">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Action Card */}
            <div className="flex items-center justify-between rounded-2xl border border-[#bbf2d1] bg-[#e6f7ed] px-4 sm:px-5 py-3 sm:py-4 mt-2">
              <div>
                <p className="text-[13px] sm:text-[15px] font-bold text-[#00a653]">
                  Oldest Credit Account
                </p>
                <p className="text-[11px] sm:text-xs font-medium text-gray-400 mt-0.5">
                  In depth analysis of your Credit Score
                </p>
              </div>

              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] text-white transition-transform hover:scale-105 active:scale-95 shadow-sm"
              >
                <ArrowDownToLine className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}