"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Calculator,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  PieChart as PieChartIcon,
  Table as TableIcon,
  ChevronDown,
  Info,
  Calendar,
  IndianRupee,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export type CalculatorType =
  | "emi"
  | "home-loan"
  | "personal-loan"
  | "eligibility";

interface CalculatorConfig {
  type: CalculatorType;
  title: string;
  subtitle: string;
  seoHeading: string;
  defaultAmount: number;
  minAmount: number;
  maxAmount: number;
  stepAmount: number;
  amountLabel: string;
  defaultRate: number;
  minRate: number;
  maxRate: number;
  stepRate: number;
  defaultTenureYears: number;
  minTenureYears: number;
  maxTenureYears: number;
  stepTenureYears: number;
  applyHref: string;
  applyText: string;
  faqs: { question: string; answer: string }[];
  guideSections: { title: string; content: string }[];
}

const configs: Record<CalculatorType, CalculatorConfig> = {
  emi: {
    type: "emi",
    title: "Loan EMI Calculator",
    subtitle:
      "Accurately calculate monthly installments, total interest, and full repayment schedule for any retail or commercial loan in seconds.",
    seoHeading: "How Does a Loan EMI Calculator Work?",
    defaultAmount: 1000000,
    minAmount: 50000,
    maxAmount: 50000000,
    stepAmount: 25000,
    amountLabel: "Loan Amount",
    defaultRate: 10.5,
    minRate: 6.5,
    maxRate: 24,
    stepRate: 0.1,
    defaultTenureYears: 5,
    minTenureYears: 1,
    maxTenureYears: 30,
    stepTenureYears: 1,
    applyHref: "/products/personal-loan",
    applyText: "Check Loan Offers",
    faqs: [
      {
        question: "What is an EMI?",
        answer:
          "Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are applied to both interest and principal each month so that over a specified number of years, the loan is fully paid off.",
      },
      {
        question: "How is loan EMI calculated?",
        answer:
          "Loan EMI is computed using the standard financial reducing balance formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is Principal Loan Amount, R is Monthly Interest Rate (Annual Rate / 12 / 100), and N is Number of Monthly Installments.",
      },
      {
        question: "How does loan tenure affect my total interest?",
        answer:
          "A longer tenure reduces your monthly EMI amount, making repayment easier on your monthly cash flow. However, it significantly increases the total cumulative interest paid over the life of the loan.",
      },
      {
        question: "Can I reduce my EMI by making prepayments?",
        answer:
          "Yes. Making part-prepayments reduces your outstanding principal, which in turn either reduces your remaining tenure or lowers your future monthly EMI amount.",
      },
    ],
    guideSections: [
      {
        title: "Understanding Principal vs Interest Breakdown",
        content:
          "In the early years of any loan, a larger portion of your EMI goes toward paying interest. As the loan matures and the outstanding principal decreases, a higher portion of each EMI goes toward principal repayment.",
      },
      {
        title: "Key Factors That Determine Your Loan EMI",
        content:
          "Your EMI depends on three primary variables: the principal loan amount borrowed, the agreed annual interest rate, and the repayment tenure in months. Additionally, your credit score, employer category, and existing debt obligations influence the interest rate offered by banks.",
      },
    ],
  },
  "home-loan": {
    type: "home-loan",
    title: "Home Loan EMI Calculator",
    subtitle:
      "Plan your dream home financing with exact monthly EMI calculations, tax savings breakdown, and yearly amortization schedules.",
    seoHeading: "Mastering Your Home Loan Financing & Repayment",
    defaultAmount: 4000000,
    minAmount: 500000,
    maxAmount: 100000000,
    stepAmount: 100000,
    amountLabel: "Home Loan Amount",
    defaultRate: 8.4,
    minRate: 7.5,
    maxRate: 15,
    stepRate: 0.05,
    defaultTenureYears: 20,
    minTenureYears: 5,
    maxTenureYears: 30,
    stepTenureYears: 1,
    applyHref: "/products/home-loan",
    applyText: "Explore Home Loans",
    faqs: [
      {
        question: "What is the typical home loan interest rate in India?",
        answer:
          "Home loan interest rates in India are linked to the RBI Repo Rate (EBLR/RLLR) and typically range from 8.35% to 9.50% p.a. for borrowers with a CIBIL score of 750 and above.",
      },
      {
        question: "What tax benefits can I claim on my Home Loan EMI?",
        answer:
          "Under the Income Tax Act, you can claim tax deductions up to ₹2 Lakh on interest paid (Section 24b) and up to ₹1.5 Lakh on principal repayment (Section 80C) in a financial year.",
      },
      {
        question: "What is the maximum tenure available for Home Loans?",
        answer:
          "Most Indian public and private banks offer home loan tenures up to 30 years, subject to the borrower's age at loan maturity (typically up to 60 years for salaried and 65-70 years for self-employed).",
      },
      {
        question: "Are there prepayment penalties on floating rate Home Loans?",
        answer:
          "As per RBI regulations, banks and Housing Finance Companies (HFCs) cannot charge any foreclosure or part-prepayment penalties on floating rate home loans sanctioned to individual borrowers.",
      },
    ],
    guideSections: [
      {
        title: "Tax Optimization Under Section 24(b) and Section 80C",
        content:
          "Home loan borrowers in India enjoy significant tax deductions. Section 24(b) allows deductions up to ₹2,00,000 on interest paid for self-occupied properties, while Section 80C permits up to ₹1,50,000 deduction on principal repaid.",
      },
      {
        title: "Floating vs Fixed Rate Home Loans",
        content:
          "Floating rate home loans adjust automatically with RBI Repo rate revisions (EBLR). They carry zero prepayment penalties for individuals. Fixed rate loans offer predictable EMIs for an initial lock-in period but typically carry higher initial interest rates.",
      },
    ],
  },
  "personal-loan": {
    type: "personal-loan",
    title: "Personal Loan EMI Calculator",
    subtitle:
      "Calculate your personal loan monthly EMI instantly. Compare tenures and interest rates for quick unsecured financing.",
    seoHeading: "Planning Your Personal Loan Repayment",
    defaultAmount: 500000,
    minAmount: 25000,
    maxAmount: 5000000,
    stepAmount: 10000,
    amountLabel: "Personal Loan Amount",
    defaultRate: 11.5,
    minRate: 9.99,
    maxRate: 24,
    stepRate: 0.25,
    defaultTenureYears: 3,
    minTenureYears: 1,
    maxTenureYears: 7,
    stepTenureYears: 1,
    applyHref: "/products/personal-loan",
    applyText: "Apply for Personal Loan",
    faqs: [
      {
        question: "What factors influence Personal Loan interest rates?",
        answer:
          "Personal loan rates are influenced by your credit score (preferably 750+), monthly net take-home salary, employer stability (Category A corporate/MNC/Govt), and your current debt-to-income ratio (FOIR).",
      },
      {
        question: "What is the typical tenure for a Personal Loan?",
        answer:
          "Personal loans in India are usually offered for tenures ranging from 12 months (1 year) to 60 months (5 years), with some lenders offering up to 84 months (7 years).",
      },
      {
        question: "Can I prepay or close my personal loan early?",
        answer:
          "Yes, most lenders allow foreclosure and part-prepayment after an initial lock-in period (usually 6 to 12 months), subject to nominal charges specified in your sanction letter.",
      },
    ],
    guideSections: [
      {
        title: "Flat Rate vs Reducing Balance Interest Rate",
        content:
          "Always verify if the personal loan quote is on a reducing balance or flat rate basis. A 10% flat interest rate is equivalent to approximately 18% to 19% on a reducing balance scale. Fintaraa displays all bank offers exclusively on standardized reducing balance rates.",
      },
      {
        title: "How to Keep Your Personal Loan EMI Affordable",
        content:
          "Select a tenure where your total monthly EMI does not exceed 30% to 40% of your net monthly take-home salary. Maintaining a credit score above 750 will help you negotiate lower processing fees and competitive interest rates.",
      },
    ],
  },
  eligibility: {
    type: "eligibility",
    title: "Loan Eligibility Calculator",
    subtitle:
      "Estimate your maximum borrowing limit based on your monthly income, existing debt commitments, and FOIR guidelines.",
    seoHeading: "How Banks Determine Your Loan Eligibility",
    defaultAmount: 75000,
    minAmount: 15000,
    maxAmount: 1000000,
    stepAmount: 5000,
    amountLabel: "Net Monthly Income",
    defaultRate: 8.5,
    minRate: 7.5,
    maxRate: 18,
    stepRate: 0.1,
    defaultTenureYears: 20,
    minTenureYears: 1,
    maxTenureYears: 30,
    stepTenureYears: 1,
    applyHref: "/products?category=Loans",
    applyText: "Check Pre-Approved Limits",
    faqs: [
      {
        question: "What is FOIR (Fixed Obligation to Income Ratio)?",
        answer:
          "FOIR is the percentage of your monthly income that is currently committed to debt repayments including credit card bills and existing EMIs. Banks typically cap total FOIR at 50% to 65% when sanctioning new credit.",
      },
      {
        question: "How can I increase my loan eligibility?",
        answer:
          "You can increase your loan eligibility by adding an earning co-applicant (spouse or parents), choosing a longer loan tenure, clearing existing credit card balances or small personal loans, and maintaining a high credit score.",
      },
      {
        question: "Does having existing credit cards lower my loan eligibility?",
        answer:
          "Having credit cards does not reduce your eligibility if you pay bills on time. However, carrying revolving balances or high credit utilization can increase your FOIR calculation and slightly reduce your eligible loan amount.",
      },
    ],
    guideSections: [
      {
        title: "Understanding FOIR and Debt Capacity",
        content:
          "Lenders ensure you have sufficient disposable income for living expenses. If your monthly income is ₹1,00,000 and the bank's maximum allowable FOIR is 50%, your total combined EMIs (existing + new loan) cannot exceed ₹50,000 per month.",
      },
      {
        title: "Impact of Co-Applicants on Eligibility",
        content:
          "Adding a co-applicant allows the lender to combine both incomes, substantially expanding your total borrowing eligibility for major property or home purchases.",
      },
    ],
  },
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, val));

export function DedicatedCalculatorPage({ type }: { type: CalculatorType }) {
  const config = configs[type] || configs.emi;

  // Primary Inputs
  const [amount, setAmount] = useState<number>(config.defaultAmount);
  const [rate, setRate] = useState<number>(config.defaultRate);
  const [tenureYears, setTenureYears] = useState<number>(
    config.defaultTenureYears,
  );
  const [existingEmis, setExistingEmis] = useState<number>(0);
  const [foirPercent, setFoirPercent] = useState<number>(55);
  const [activeTab, setActiveTab] = useState<"summary" | "schedule">("summary");

  // Calculations
  const isEligibilityMode = type === "eligibility";
  const tenureMonths = tenureYears * 12;
  const monthlyRate = rate / 12 / 100;

  // Standard EMI calculation
  const calculatedEmi = useMemo(() => {
    if (amount <= 0 || tenureMonths <= 0) return 0;
    if (monthlyRate === 0) return amount / tenureMonths;
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    return Math.round((amount * monthlyRate * factor) / (factor - 1));
  }, [amount, monthlyRate, tenureMonths]);

  // Eligibility calculation
  const eligibleLoanAmount = useMemo(() => {
    if (!isEligibilityMode) return 0;
    const maxAllowedEmi = (amount * foirPercent) / 100 - existingEmis;
    if (maxAllowedEmi <= 0) return 0;
    if (monthlyRate === 0) return maxAllowedEmi * tenureMonths;
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    const principal = (maxAllowedEmi * (factor - 1)) / (monthlyRate * factor);
    return Math.round(principal);
  }, [
    isEligibilityMode,
    amount,
    foirPercent,
    existingEmis,
    monthlyRate,
    tenureMonths,
  ]);

  const totalPayment = isEligibilityMode
    ? 0
    : calculatedEmi * tenureMonths;
  const totalInterest = isEligibilityMode
    ? 0
    : Math.max(0, totalPayment - amount);
  const principalPercent =
    totalPayment > 0 ? Math.round((amount / totalPayment) * 100) : 0;
  const interestPercent = 100 - principalPercent;

  // Generate Year-by-Year Amortization Schedule
  const amortizationSchedule = useMemo(() => {
    if (isEligibilityMode || amount <= 0 || calculatedEmi <= 0) return [];
    let balance = amount;
    const yearly = [];

    for (let year = 1; year <= tenureYears; year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const interestForMonth = balance * monthlyRate;
        const principalForMonth = Math.min(
          balance,
          calculatedEmi - interestForMonth,
        );
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        balance -= principalForMonth;
      }

      yearly.push({
        year,
        principalPaid: Math.round(yearlyPrincipal),
        interestPaid: Math.round(yearlyInterest),
        totalPaid: Math.round(yearlyPrincipal + yearlyInterest),
        closingBalance: Math.max(0, Math.round(balance)),
      });
      if (balance <= 0) break;
    }
    return yearly;
  }, [isEligibilityMode, amount, calculatedEmi, tenureYears, monthlyRate]);

  return (
    <main className="min-h-screen bg-[#FAF7FF] text-slate-900 pb-16">
      {/* Header Breadcrumb & Title */}
      <div className="bg-white border-b border-purple-100 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <Link href="/" className="hover:text-[#5B21B6]">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-[#5B21B6]">
              Calculators
            </Link>
            <span>/</span>
            <span className="text-[#5B21B6] font-medium">{config.title}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            {config.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {config.subtitle}
          </p>
        </div>
      </div>

      {/* Main Interactive Calculator Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sliders and Inputs (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-[#5B21B6]">
                  <Calculator className="w-5 h-5" />
                </div>
                <h2 className="text-base font-semibold text-slate-800">
                  {isEligibilityMode
                    ? "Income & Existing Commitments"
                    : "Loan Parameters"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAmount(config.defaultAmount);
                  setRate(config.defaultRate);
                  setTenureYears(config.defaultTenureYears);
                  setExistingEmis(0);
                }}
                className="text-xs font-medium text-[#5B21B6] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Amount Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-700">
                  {config.amountLabel}
                </label>
                <div className="flex items-center px-3 py-1 bg-purple-50/80 rounded-xl border border-purple-100 text-sm font-semibold text-[#5B21B6]">
                  <span>₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="w-28 bg-transparent text-right outline-none font-semibold text-[#5B21B6] ml-1"
                  />
                </div>
              </div>
              <input
                type="range"
                min={config.minAmount}
                max={config.maxAmount}
                step={config.stepAmount}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-[#5B21B6] cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{formatCurrency(config.minAmount)}</span>
                <span>{formatCurrency(config.maxAmount)}</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-700">
                  Interest Rate (p.a.)
                </label>
                <div className="flex items-center px-3 py-1 bg-purple-50/80 rounded-xl border border-purple-100 text-sm font-semibold text-[#5B21B6]">
                  <input
                    type="number"
                    step={config.stepRate}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value) || 0)}
                    className="w-16 bg-transparent text-right outline-none font-semibold text-[#5B21B6] mr-1"
                  />
                  <span>%</span>
                </div>
              </div>
              <input
                type="range"
                min={config.minRate}
                max={config.maxRate}
                step={config.stepRate}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-[#5B21B6] cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{config.minRate}%</span>
                <span>{config.maxRate}%</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-700">
                  Loan Tenure
                </label>
                <div className="flex items-center px-3 py-1 bg-purple-50/80 rounded-xl border border-purple-100 text-sm font-semibold text-[#5B21B6]">
                  <input
                    type="number"
                    value={tenureYears}
                    onChange={(e) =>
                      setTenureYears(Number(e.target.value) || 1)
                    }
                    className="w-12 bg-transparent text-right outline-none font-semibold text-[#5B21B6] mr-1"
                  />
                  <span>Years ({tenureYears * 12}M)</span>
                </div>
              </div>
              <input
                type="range"
                min={config.minTenureYears}
                max={config.maxTenureYears}
                step={config.stepTenureYears}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-[#5B21B6] cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{config.minTenureYears} Year</span>
                <span>{config.maxTenureYears} Years</span>
              </div>
            </div>

            {/* Additional Inputs for Eligibility Mode */}
            {isEligibilityMode && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-700">
                      Existing Monthly EMIs / Obligations
                    </label>
                    <div className="flex items-center px-3 py-1 bg-purple-50/80 rounded-xl border border-purple-100 text-sm font-semibold text-[#5B21B6]">
                      <span>₹</span>
                      <input
                        type="number"
                        value={existingEmis}
                        onChange={(e) =>
                          setExistingEmis(Number(e.target.value) || 0)
                        }
                        className="w-24 bg-transparent text-right outline-none font-semibold text-[#5B21B6] ml-1"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200000}
                    step={1000}
                    value={existingEmis}
                    onChange={(e) => setExistingEmis(Number(e.target.value))}
                    className="w-full accent-[#5B21B6] cursor-pointer h-2 bg-slate-100 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-700">
                      Allowable FOIR Ratio ({foirPercent}%)
                    </label>
                    <span className="text-xs text-slate-500 font-normal">
                      Standard: 50% - 60%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={70}
                    step={5}
                    value={foirPercent}
                    onChange={(e) => setFoirPercent(Number(e.target.value))}
                    className="w-full accent-[#5B21B6] cursor-pointer h-2 bg-slate-100 rounded-lg"
                  />
                </div>
              </>
            )}
          </div>

          {/* Right Column: Output Summary & Visual Donut (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#4C1D95] via-[#5B21B6] to-[#6D28D9] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-medium text-purple-200 uppercase tracking-wider">
                {isEligibilityMode
                  ? "Estimated Borrowing Capacity"
                  : "Monthly Installment (EMI)"}
              </span>
              <div className="text-3xl sm:text-4xl font-semibold text-white mt-1.5 tracking-tight">
                {formatCurrency(
                  isEligibilityMode ? eligibleLoanAmount : calculatedEmi,
                )}
                {!isEligibilityMode && (
                  <span className="text-xs font-normal text-purple-200 ml-1.5">
                    / month
                  </span>
                )}
              </div>
            </div>

            {/* Breakdown Cards */}
            {!isEligibilityMode ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <span className="text-[11px] font-normal text-purple-200">
                    Principal Amount
                  </span>
                  <div className="text-sm sm:text-base font-semibold text-white mt-0.5">
                    {formatCurrency(amount)}
                  </div>
                  <span className="text-[10px] text-purple-300">
                    ({principalPercent}%)
                  </span>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <span className="text-[11px] font-normal text-purple-200">
                    Total Interest
                  </span>
                  <div className="text-sm sm:text-base font-semibold text-white mt-0.5">
                    {formatCurrency(totalInterest)}
                  </div>
                  <span className="text-[10px] text-purple-300">
                    ({interestPercent}%)
                  </span>
                </div>

                <div className="col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-normal text-purple-200">
                      Total Repayment (Principal + Interest)
                    </span>
                    <div className="text-base font-semibold text-white mt-0.5">
                      {formatCurrency(totalPayment)}
                    </div>
                  </div>
                  <Calendar className="w-5 h-5 text-purple-200 opacity-60" />
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <span className="text-[11px] font-normal text-purple-200">
                    Max Allowed EMI Capacity
                  </span>
                  <div className="text-base font-semibold text-white mt-0.5">
                    {formatCurrency(
                      Math.max(0, (amount * foirPercent) / 100 - existingEmis),
                    )}{" "}
                    / month
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <span className="text-[11px] font-normal text-purple-200">
                    Tenure Considered
                  </span>
                  <div className="text-base font-semibold text-white mt-0.5">
                    {tenureYears} Years ({tenureYears * 12} Installments)
                  </div>
                </div>
              </div>
            )}

            {/* Apply CTA */}
            <div className="pt-2">
              <Link
                href={config.applyHref}
                className="w-full h-12 bg-white text-[#5B21B6] hover:bg-purple-50 font-semibold text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 no-underline"
              >
                <span>{config.applyText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Amortization Table Section (for EMI calculators) */}
        {!isEligibilityMode && amortizationSchedule.length > 0 && (
          <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TableIcon className="w-5 h-5 text-[#5B21B6]" />
              <h3 className="text-lg font-semibold text-slate-900">
                Yearly Amortization Repayment Schedule
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-purple-100 bg-purple-50/50 text-slate-700">
                    <th className="py-3 px-4 font-semibold rounded-l-xl">
                      Year
                    </th>
                    <th className="py-3 px-4 font-semibold">Principal (₹)</th>
                    <th className="py-3 px-4 font-semibold">Interest (₹)</th>
                    <th className="py-3 px-4 font-semibold">
                      Total Payment (₹)
                    </th>
                    <th className="py-3 px-4 font-semibold rounded-r-xl text-right">
                      Balance (₹)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {amortizationSchedule.map((row) => (
                    <tr
                      key={row.year}
                      className="hover:bg-purple-50/20 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[#5B21B6]">
                        Year {row.year}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-normal">
                        {row.principalPaid.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-normal">
                        {row.interestPaid.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 text-slate-900 font-medium">
                        {row.totalPaid.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 text-slate-900 font-medium text-right">
                        {row.closingBalance.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEO Educational Guide Sections Below Calculator */}
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            {config.seoHeading}
          </h2>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            {config.guideSections.map((sec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-purple-50/30 border border-purple-100"
              >
                <h3 className="text-sm font-semibold text-[#5B21B6] mb-2">
                  {sec.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {config.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-4 rounded-2xl border border-purple-100 bg-purple-50/20 open:bg-purple-50/40 transition-colors"
              >
                <summary className="font-semibold text-xs sm:text-sm text-slate-800 cursor-pointer list-none flex justify-between items-center">
                  <span>{faq.question}</span>
                  <ChevronDown className="w-4 h-4 text-purple-600 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed border-t border-purple-100/60 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
