"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Download } from "lucide-react";

// Types
type LoanType = "Home Loan" | "Car Loan" | "Personal Loan" | "Loan Against Property";

interface CalculatorCardProps {
  title: string;
  subtitle?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  minLabel: string;
  maxLabel: string;
  onChange: (val: number) => void;
}

const loanTabs: LoanType[] = ["Home Loan", "Car Loan", "Personal Loan", "Loan Against Property", "Car Loan", "Car Loan", "Car Loan"];

const formatCurrencyIndian = (num: number) => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(Math.round(num));
};

// Subcomponent: Individual Range Input Field Card Block
function SliderCard({
  title,
  subtitle,
  value,
  min,
  max,
  step,
  suffix = "",
  minLabel,
  maxLabel,
  onChange,
}: CalculatorCardProps) {
  const percentageTrack = ((value - min) / (max - min)) * 100;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-400">
            {title}
          </h4>
          {subtitle && (
            <p className="text-[12px] font-medium text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Dynamic Numeric Value Input Form Box */}
        <div className="flex h-11 items-center rounded-lg border border-gray-100 bg-white px-3 min-w-35 justify-between">
          {!suffix && <span className="text-[14px] font-bold text-gray-700">₹</span>}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const val = Number(e.target.value);
              onChange(val > max ? max : val < min ? min : val);
            }}
            className="w-full border-0 bg-transparent text-right text-[15px] font-bold text-gray-800 outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && <span className="ml-1 text-[13px] font-bold text-blue-500">{suffix}</span>}
        </div>
      </div>

      {/* Styled Functional Input Range Slider Slider */}
      <div className="mt-6">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1.5 w-full appearance-none rounded-full cursor-pointer accent-blue-500"
          style={{
            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentageTrack}%, #e5e7eb ${percentageTrack}%, #e5e7eb 100%)`,
          }}
        />
        <div className="mt-3 flex justify-between text-[12px] font-medium text-gray-400">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function EmiCalculator() {
  const [activeTab, setActiveTab] = useState<LoanType>("Home Loan");
  const [loanAmount, setLoanAmount] = useState<number>(2500000);
  const [interestRate, setInterestRate] = useState<number>(8.75);
  const [loanTenure, setLoanTenure] = useState<number>(15);

  // Core Math Calculation Computations Engine Block
  const computedMetrics = useMemo(() => {
    const totalMonths = loanTenure * 12;
    const monthlyInterestRate = interestRate / 12 / 100;

    let monthlyEmi = 0;
    if (monthlyInterestRate > 0) {
      monthlyEmi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
    } else {
      monthlyEmi = loanAmount / totalMonths;
    }

    const totalPayableAmount = monthlyEmi * totalMonths;
    const totalInterestPayable = totalPayableAmount - loanAmount;

    const principalWeightRatio = (loanAmount / totalPayableAmount) * 100;
    const interestWeightRatio = (totalInterestPayable / totalPayableAmount) * 100;

    return {
      emi: monthlyEmi,
      totalPayable: totalPayableAmount,
      totalInterest: totalInterestPayable,
      principalPercent: principalWeightRatio,
      interestPercent: interestWeightRatio,
    };
  }, [loanAmount, interestRate, loanTenure]);

  return (
    <section className="bg-[#fafbfc] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        
        {/* Component Header Label */}
        <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">
          EMI Calculator
        </h2>

        {/* Category Selection Tab Pills Wrapper */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {loanTabs.map((tab, idx) => {
            const isSelected = activeTab === tab && idx === 0; // matching mockup active highlight structure style
            return (
              <button
                key={`${tab}-${idx}`}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-xl border px-5 py-2.5 text-[13px] font-semibold transition-all ${
                  isSelected || (idx === 0 && activeTab === tab)
                    ? "border-[#12b76a] bg-[#12b76a] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Two-Column App Layout Grid Shell */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          
          {/* Left Functional Control Section */}
          <div className="flex flex-col gap-4">
            <SliderCard
              title="Loan Amount"
              subtitle="Adjust your desired borrowing limit"
              value={loanAmount}
              min={50000}
              max={10000000}
              step={25000}
              minLabel="₹ 50,000"
              maxLabel="₹ 1,00,00,000"
              onChange={setLoanAmount}
            />

            <SliderCard
              title="Interest Rate (P.A)"
              subtitle="Estimated APR hint: 8.92%"
              value={interestRate}
              min={1}
              max={36}
              step={0.05}
              suffix="%"
              minLabel="6%"
              maxLabel="36%"
              onChange={setInterestRate}
            />

            <SliderCard
              title="Loan Tenure"
              subtitle="Select period in years"
              value={loanTenure}
              min={1}
              max={30}
              step={1}
              suffix="Years"
              minLabel="1 Year"
              maxLabel="30 Years"
              onChange={setLoanTenure}
            />

            {/* Outlined Download Document Action Trigger Button */}
            <button 
              type="button"
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-white text-[14px] font-bold text-gray-700 transition-colors hover:bg-emerald-50/40"
            >
              <span className="opacity-70">📄</span>
              Download Loan Break up PDF
              <Download className="h-4 w-4 ml-1 text-gray-400" />
            </button>
          </div>

          {/* Right Visual Breakdown Output Panel Sidebar */}
          <aside className="rounded-xl border border-gray-100 bg-white shadow-xs flex flex-col overflow-hidden">
            
            {/* Header Title Block banner */}
            <div className="bg-[#f8fafc] px-6 py-4 border-b border-gray-50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Breakdown Summary
              </span>
            </div>

            <div className="p-6 flex flex-col flex-1 justify-between">
              
              {/* Core Output Numeric Grid Display badges layout */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "emi", label: "Monthly EMI", val: computedMetrics.emi, bg: "bg-blue-50/40", icon: "📅" },
                  { id: "int", label: "Total Interest", val: computedMetrics.totalInterest, bg: "bg-emerald-50/30", icon: "％" },
                  { id: "tot", label: "Total Amount", val: computedMetrics.totalPayable, bg: "bg-blue-50/40", icon: "🪙" },
                ].map((badge) => (
                  <div key={badge.id} className={`rounded-xl border border-blue-50/60 p-3 text-center ${badge.bg}`}>
                    <span className="text-[12px] block text-center mb-1">{badge.icon}</span>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      {badge.label}
                    </p>
                    <p className="mt-1 text-[14px] font-bold text-gray-800 tracking-tight whitespace-nowrap">
                      {formatCurrencyIndian(badge.val)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Conic Gradient Donut Representation Visual Chart Rendering Node */}
              <div className="my-8 flex justify-center">
                <div
                  className="relative flex h-52 w-52 items-center justify-center rounded-full shadow-inner"
                  style={{
                    background: `conic-gradient(#2563eb 0% ${computedMetrics.principalPercent}%, #84cc16 ${computedMetrics.principalPercent}% 100%)`,
                  }}
                >
                  {/* Central Inner Data Display Cutout Bubble masking layer */}
                  <div className="flex h-38 w-38 flex-col items-center justify-center rounded-full bg-white text-center shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Total Amount
                    </span>
                    <p className="mt-0.5 text-[18px] font-extrabold text-gray-800 tracking-tight">
                      {formatCurrencyIndian(computedMetrics.totalPayable)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Category Percentage Weight Key Indicators Layout Wrapper Block */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-50 pt-5">
                <div className="flex items-start gap-2.5">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600" />
                  <div>
                    <p className="text-[12px] font-medium text-gray-400">Principal Amount</p>
                    <p className="text-[15px] font-bold text-gray-800">{formatCurrencyIndian(loanAmount)}</p>
                    <span className="text-[11px] font-bold text-blue-600">({computedMetrics.principalPercent.toFixed(1)}%)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-lime-500" />
                  <div>
                    <p className="text-[12px] font-medium text-gray-400">Total Interest</p>
                    <p className="text-[15px] font-bold text-gray-800">{formatCurrencyIndian(computedMetrics.totalInterest)}</p>
                    <span className="text-[11px] font-bold text-lime-600">({computedMetrics.interestPercent.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>

              {/* Main Conversion CTA Action Form Button element block */}
              <button 
                type="button"
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#12b76a] text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Apply For This Loan
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Safety Compliance & Legal Disclaimer Footnotes Section Block footer node */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-medium text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="text-emerald-500 text-[13px]">🛡</span> 100% Secure
                </span>
                <span>•</span>
                <span>No hidden charges</span>
              </div>
              
              <p className="mt-3 text-center text-[10px] font-medium italic text-gray-300 leading-normal">
                *EMI shown is indicative. Final rates may vary based on credit assessment.
              </p>

            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}