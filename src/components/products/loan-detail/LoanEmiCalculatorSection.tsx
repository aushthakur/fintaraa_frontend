"use client";

import { useState, useId } from "react";
import { Calculator, ArrowRight, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";

function formatInLakhsOrCrores(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `${cr % 1 === 0 ? cr : cr.toFixed(2)} Crore`;
  }
  if (amount >= 100000) {
    const l = amount / 100000;
    return `${l % 1 === 0 ? l : l.toFixed(2)} Lakh`;
  }
  return amount.toLocaleString("en-IN");
}

interface LoanEmiCalculatorSectionProps {
  productSlug?: string;
  applyHref: string;
}

export function LoanEmiCalculatorSection({
  productSlug = "personal-loan",
  applyHref,
}: LoanEmiCalculatorSectionProps) {
  const amountSliderId = useId();
  const rateSliderId = useId();

  // Up to ₹1 Crore (1,00,00,000)
  const [loanAmount, setLoanAmount] = useState<number>(1000000); // 10 Lakhs default
  const [interestRate, setInterestRate] = useState<number>(10.49); // 10.49% default
  const [tenureYears, setTenureYears] = useState<number>(5); // 5 Years default

  // Standard EMI Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const calculateEMI = (principal: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;
    if (monthlyRate === 0) return Math.round(principal / totalMonths);
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(emi);
  };

  const monthlyEmi = calculateEMI(loanAmount, interestRate, tenureYears);
  const totalMonths = tenureYears * 12;
  const totalAmount = monthlyEmi * totalMonths;
  const totalInterest = Math.max(0, totalAmount - loanAmount);
  const principalPercentage = Math.round((loanAmount / totalAmount) * 100) || 0;
  const interestPercentage = 100 - principalPercentage;

  const quickAmounts = [
    { label: "₹3 Lakh", value: 300000 },
    { label: "₹5 Lakh", value: 500000 },
    { label: "₹10 Lakh", value: 1000000 },
    { label: "₹25 Lakh", value: 2500000 },
    { label: "₹50 Lakh", value: 5000000 },
    { label: "₹1 Crore", value: 10000000 },
  ];

  const tenureOptions = [1, 2, 3, 4, 5, 7];

  return (
    <section
      id="emi-calculator"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="w-full max-w-7xl mx-auto px-4 py-16 antialiased text-slate-900 md:px-6 lg:px-8 border-b border-slate-100"
    >
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
          Personal Loan <span className="text-[#5b21b6]">EMI Calculator</span>
        </h2>
        <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
          Accurately calculate your monthly installments, total interest outflow, and repayment schedule for loan amounts up to ₹1 Crore. Test different tenures to discover an EMI that fits comfortably inside your monthly budget.
        </p>
      </div>

      {/* Main Calculator Grid (Borderless, Spacious) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start font-normal">
        
        {/* Left: Input Sliders & Selectors (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Loan Amount */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <label htmlFor={amountSliderId} className="text-sm font-normal text-slate-700">
                Required Loan Amount
              </label>
              <div className="flex items-center gap-1 text-lg sm:text-xl font-normal text-[#5b21b6]">
                <span>₹</span>
                <span>{loanAmount.toLocaleString("en-IN")}</span>
                <span className="text-xs font-normal text-slate-400 ml-1">
                  ({formatInLakhsOrCrores(loanAmount)})
                </span>
              </div>
            </div>

            <input
              id={amountSliderId}
              type="range"
              min={50000}
              max={10000000}
              step={25000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5b21b6]"
            />

            {/* Quick Amount Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {quickAmounts.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setLoanAmount(item.value)}
                  className={`px-3 py-1 text-xs font-normal rounded-full transition-all cursor-pointer ${
                    loanAmount === item.value
                      ? "bg-[#5b21b6] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Interest Rate */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <label htmlFor={rateSliderId} className="text-sm font-normal text-slate-700">
                Interest Rate (p.a.)
              </label>
              <div className="text-lg sm:text-xl font-normal text-[#5b21b6]">
                {interestRate.toFixed(2)}%
              </div>
            </div>

            <input
              id={rateSliderId}
              type="range"
              min={10.49}
              max={24.0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5b21b6]"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-normal mt-1">
              <span>10.49% (Top Tier Partner Rate)</span>
              <span>24.00%</span>
            </div>
          </div>

          {/* 3. Tenure */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-sm font-normal text-slate-700">
                Loan Tenure (Repayment Period)
              </span>
              <div className="text-lg sm:text-xl font-normal text-[#5b21b6]">
                {tenureYears} {tenureYears === 1 ? "Year" : "Years"} ({tenureYears * 12} Months)
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
              {tenureOptions.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setTenureYears(year)}
                  className={`py-2.5 px-2 text-center text-xs font-normal rounded-xl transition-all cursor-pointer ${
                    tenureYears === year
                      ? "bg-[#5b21b6] text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {year} {year === 1 ? "Year" : "Years"}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Output Summary & Visual Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-50/70 p-6 sm:p-8 rounded-3xl font-normal">
          
          <p className="text-xs font-normal uppercase tracking-wider text-slate-400">
            Estimated Monthly Payment
          </p>
          <div className="mt-1 flex items-baseline gap-1 text-3xl sm:text-4xl font-normal text-slate-900">
            <span className="text-2xl sm:text-3xl text-[#5b21b6]">₹</span>
            <span>{monthlyEmi.toLocaleString("en-IN")}</span>
            <span className="text-xs font-normal text-slate-500">/ month</span>
          </div>

          <div className="mt-6 space-y-3 pt-6 border-t border-slate-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-normal">Principal Amount</span>
              <span className="font-normal text-slate-900">₹{loanAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-normal">Total Interest Payable</span>
              <span className="font-normal text-[#5b21b6]">₹{totalInterest.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
              <span className="text-slate-900 font-normal">Total Amount Payable</span>
              <span className="font-normal text-slate-900 text-base">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Visual Bar Indicator */}
          <div className="mt-6">
            <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden flex">
              <div
                style={{ width: `${principalPercentage}%` }}
                className="bg-[#5b21b6] h-full"
                title={`Principal: ${principalPercentage}%`}
              />
              <div
                style={{ width: `${interestPercentage}%` }}
                className="bg-amber-400 h-full"
                title={`Interest: ${interestPercentage}%`}
              />
            </div>
            <div className="flex justify-between text-xs font-normal mt-2 text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#5b21b6]" />
                <span>Principal ({principalPercentage}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span>Interest ({interestPercentage}%)</span>
              </div>
            </div>
          </div>

          {/* Apply CTA */}
          <div className="mt-8">
            <AuthRedirectLink
              href={applyHref}
              productSlug={productSlug}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5b21b6] py-3.5 px-6 text-sm font-normal text-white shadow-md transition-all hover:bg-[#4c1d95] active:scale-[0.98]"
            >
              <span>Apply for ₹{formatInLakhsOrCrores(loanAmount)} Loan</span>
              <ArrowRight className="h-4 w-4" />
            </AuthRedirectLink>
            <p className="mt-2.5 text-center text-[11px] font-normal text-slate-500">
              Zero impact on your CIBIL score during eligibility check
            </p>
          </div>

        </div>

      </div>

      {/* Editorial Comparison: Reducing vs Flat Rate Trap (Crucial for SEO & Indian Consumers) */}
      <div className="mt-16 pt-12 border-t border-slate-200">
        <div className="max-w-3xl mb-8">
          <h3 className="text-2xl font-normal text-slate-900">
            Reducing Balance vs Flat Interest Rate: Save Lakhs in Interest
          </h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
            Many private lenders advertise an attractive “7% to 8% flat interest rate”. In reality, a 7% flat rate is equivalent to approximately 13.5% to 14.5% reducing rate, because in a flat rate loan, interest is calculated on the entire original principal for the full tenure, even after you have repaid 80% of the loan!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-normal">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <h4 className="text-base font-normal text-slate-900">Reducing Balance Rate (Standard on Fintaraa)</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Every month when you pay your EMI, a portion reduces your principal balance. The next month&apos;s interest is calculated ONLY on the remaining outstanding principal. This significantly lowers your total interest outflow and allows you to save money by making prepayments.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-6 list-disc font-normal">
              <li>Interest decreases with every monthly repayment</li>
              <li>Part-payments immediately reduce subsequent monthly EMIs</li>
              <li>Honest, transparent APR (Annual Percentage Rate) compliant with RBI rules</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-600 shrink-0" />
              <h4 className="text-base font-normal text-slate-900">Flat Interest Rate Trap (Misleading Offline Loans)</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Interest is charged on the initial borrowed amount throughout the loan tenure. Even in the 5th year when only ₹50,000 remains unpaid, you still pay interest as if you owe the entire ₹10,00,000!
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-6 list-disc font-normal">
              <li>You pay up to 40% to 60% more total interest over the tenure</li>
              <li>Prepayments provide little to no interest relief</li>
              <li>Advertised 8% flat rate = Actual 14.5% effective reducing rate</li>
            </ul>
          </div>
        </div>
      </div>

    </section>
  );
}
