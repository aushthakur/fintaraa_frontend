"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LoanSeoPageData } from "@/services/loanSeoPages";

const banks = [
  { name: "HDFC Bank", id: "hdfc" },
  { name: "ICICI Bank", id: "icici" },
  { name: "Bajaj Bank", id: "bajaj" },
  { name: "Kotak Bank", id: "kotak" },
];

export function LoanEMICalculator({ page }: { page: LoanSeoPageData }) {
  const [selectedBank, setSelectedBank] = useState("hdfc");
  const [amount, setAmount] = useState(500000);
  const [interest, setInterest] = useState(8);
  const [tenure, setTenure] = useState(3);

  return (
    <section className="w-full bg-[#004B93] min-h-170 px-6 py-12 antialiased text-[#111827] sm:px-8 md:px-12 lg:px-16">
      <div className="mx-auto max-w-9xl">
        {/* SECTION HEADER BLOCK */}
        <div className="mb-8">
          <h2 className="text-[32px] font-bold tracking-tight text-white leading-tight">
            Calculate Your
            <span className="block text-[#00c853] mt-1">
              {page.loanType} EMI
            </span>
          </h2>
        </div>

        {/* MAIN MULTI-PANEL CALCULATOR WRAPPER */}
        <div className="grid lg:grid-cols-[1.4fr_0.8fr]">
          {/* LEFT SECTION: CONTROLS MATRIX DOCK */}
          <div className="grid gap-4 sm:grid-cols-3 max-h-80">
            {/* 1. BANK SELECT PANEL */}
            <div className="bg-white rounded-xl p-4 flex flex-col justify-between border border-gray-100 shadow-sm sm:col-span-1">
              <div>
                <span className="block text-xs font-bold text-gray-400 mb-3">
                  Select Your Bank
                </span>
                <div className="space-y-1">
                  {banks.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBank(bank.id)}
                      className="w-full flex items-center justify-between py-2 px-1 text-xs font-bold text-gray-800 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 rounded transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span>{bank.name}</span>
                      </div>
                      <div
                        className={`h-3 w-3 rounded-full border flex items-center justify-center ${
                          selectedBank === bank.id
                            ? "border-gray-900 bg-gray-900"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedBank === bank.id && (
                          <div className="h-1 w-1 bg-white rounded-full" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="text-[11px] font-bold text-[#004B93] hover:underline text-center w-full pt-2"
              >
                + More
              </button>
            </div>

            {/* 2. ENTER LOAN AMOUNT SLIDER CARD */}
            <div className="bg-white rounded-xl p-5 flex flex-col justify-between border border-gray-100 shadow-sm sm:col-span-2">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500">
                    Enter Loan Amount
                  </span>
                  <div className="flex gap-1.5">
                    {["1L", "5L", "10L", "15L"].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        className="text-[10px] font-bold border border-gray-300 px-2 py-0.5 rounded-full text-gray-600 hover:border-gray-900 transition-colors bg-white"
                      >
                        ₹ {chip}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-xl font-bold tracking-tight text-gray-900 border-b border-gray-200 pb-1.5 w-fit min-w-35 mb-6">
                  ₹ {amount.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="space-y-1">
                <input
                  type="range"
                  min={50000}
                  max={5000000}
                  step={50000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#004B93]"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-400 pt-1">
                  <span>5k</span>
                  <span>50L</span>
                </div>
              </div>
            </div>

            {/* 3. RATE OF INTEREST SLIDER CARD */}
            <div className="bg-white rounded-xl p-5 flex flex-col justify-between border border-gray-100 shadow-sm sm:col-span-2">
              <div>
                <span className="block text-xs font-bold text-gray-500 mb-2">
                  Rate of Interest (yearly%)
                </span>
                <div className="text-xl font-bold tracking-tight text-gray-900 border-b border-gray-200 pb-1.5 w-fit min-w-15 mb-6">
                  {interest}
                </div>
              </div>
              <div className="space-y-1">
                <input
                  type="range"
                  min={8}
                  max={30}
                  step={0.5}
                  value={interest}
                  onChange={(e) => setInterest(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#004B93]"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-400 pt-1">
                  <span>8%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>

            {/* 4. LOAN TENURE SLIDER CARD */}
            <div className="bg-white rounded-xl p-5 flex flex-col justify-between border border-gray-100 shadow-sm sm:col-span-1">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500">
                    Loan Tenure
                  </span>
                  <div className="flex gap-1">
                    {["5L", "10L"].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        className="text-[9px] font-bold border border-gray-200 px-1.5 py-0.5 rounded-md text-gray-400 bg-white"
                      >
                        ₹ {chip}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-xl font-bold tracking-tight text-gray-900 border-b border-gray-200 pb-1.5 w-fit min-w-10 mb-6">
                  {tenure}
                </div>
              </div>
              <div className="space-y-1">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#004B93]"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-400 pt-1">
                  <span>1Y</span>
                  <span>10Y</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex my-10 ms-10">
            {/* RIGHT SECTION: OPTIMIZED COMPACT EMI READOUT CARD */}
            <div className="bg-[#e3f0fc] p-8 flex flex-col my-2 me-2 justify-between border border-blue-100/20 shadow-sm w-full max-w-full mx-auto lg:ms-auto lg:me-0">
              {/* Upper segment text content */}
              <div className="text-center space-y-2 pb-4 border-b border-gray-400/30">
                <p className="text-xs font-semibold text-gray-600 tracking-wide">
                  Your Monthly EMI Payment
                </p>
                <p className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                  ₹ 15,668
                </p>
              </div>

              {/* Middle data points structure block */}
              <div className="py-4 space-y-3 border-b border-gray-400/30">
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>Principal Amount</span>
                  <span className="text-gray-900 font-extrabold">
                    ₹ 5,00,000
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>Interest Amount</span>
                  <span className="text-gray-900 font-extrabold">₹ 64,055</span>
                </div>
              </div>

              {/* Absolute total readout baseline and redirect anchor */}
              <div className="pt-4 space-y-5">
                <div className="flex justify-between items-center text-sm font-black text-gray-900 tracking-tight">
                  <span>Total Amount</span>
                  <span className="text-base font-extrabold">₹ 5,64,055</span>
                </div>

                <div className="w-full flex justify-center">
                  <Link
                    href={`/login?product=${page.loanTypeSlug}`}
                    className="flex h-9 w-full max-w-55 items-center justify-center gap-1.5 rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] text-xs font-bold text-white transition-all hover:brightness-110 active:scale-[0.99] no-underline shadow-sm"
                  >
                    <span>Get Instant Loan</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
