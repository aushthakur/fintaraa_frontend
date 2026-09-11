"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  BriefcaseBusiness,
  Zap,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Compass,
} from "lucide-react";

interface PlanningGoal {
  id: string;
  label: string;
  icon: typeof Home;
  title: string;
  recommendation: string;
  primaryHref: string;
  primaryCta: string;
  secondaryHref: string;
  secondaryCta: string;
}

const goals: PlanningGoal[] = [
  {
    id: "buy-home",
    label: "Buy a Home",
    icon: Home,
    title: "Planning to Buy or Build a Home?",
    recommendation:
      "Compare lowest home loan rates from 7.10% p.a. with tenure up to 30 years from SBI, HDFC & ICICI.",
    primaryHref: "/products/home-loan",
    primaryCta: "Explore Home Loans",
    secondaryHref: "#calculators",
    secondaryCta: "Calculate Home EMI",
  },
  {
    id: "grow-business",
    label: "Grow My Business",
    icon: BriefcaseBusiness,
    title: "Expanding Business or Need Working Capital?",
    recommendation:
      "Get collateral-free business loans up to ₹1 Crore with minimal paperwork, plus MSME subsidy registration.",
    primaryHref: "/products/business-loan",
    primaryCta: "Explore Business Loans",
    secondaryHref: "/msme-registration",
    secondaryCta: "MSME Registration",
  },
  {
    id: "manage-expenses",
    label: "Manage Expenses",
    icon: Zap,
    title: "Need Quick Funds for Personal Milestones?",
    recommendation:
      "Instant personal loans up to ₹40 Lakh with 100% digital KYC and same-day bank disbursal.",
    primaryHref: "/products/personal-loan",
    primaryCta: "Check Loan Eligibility",
    secondaryHref: "/products/instant-loan",
    secondaryCta: "Instant 5-Min Loan",
  },
  {
    id: "improve-credit",
    label: "Improve Credit",
    icon: TrendingUp,
    title: "Want to Build or Repair Your Credit Score?",
    recommendation:
      "Check your credit report across 4 bureaus for free and get actionable factor analysis to qualify for better rates.",
    primaryHref: "/cibil-score",
    primaryCta: "Check My Free Score",
    secondaryHref: "/credit-cards",
    secondaryCta: "Credit Builder Cards",
  },
  {
    id: "get-card",
    label: "Get a Credit Card",
    icon: CreditCard,
    title: "Looking for Maximum Cashback & Travel Perks?",
    recommendation:
      "Compare 50+ credit cards with zero annual fee, 5% unlimited cashback and domestic airport lounge visits.",
    primaryHref: "/credit-cards",
    primaryCta: "Compare Credit Cards",
    secondaryHref: "/offers",
    secondaryCta: "View Card Offers",
  },
  {
    id: "protect-family",
    label: "Protect My Family",
    icon: ShieldCheck,
    title: "Securing Family Health & Future?",
    recommendation:
      "Pair high-cover term life insurance with comprehensive health insurance for cashless care at 10,000+ hospitals.",
    primaryHref: "/products/health-insurance",
    primaryCta: "Compare Health Plans",
    secondaryHref: "/products/term-insurance",
    secondaryCta: "Explore Term Plans",
  },
];

export function PersonalizedDiscovery() {
  const [activeGoalId, setActiveGoalId] = useState("buy-home");

  const goal = goals.find((g) => g.id === activeGoalId) || goals[0];

  return (
    <section
      id="assistant"
      className="scroll-mt-20 bg-white py-6 sm:py-8"
      aria-label="What are you planning?"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#5b21b6]" />
          <h2 className="text-[17px] font-semibold text-[#0f172a] sm:text-[20px]">
            What Are You Planning?
          </h2>
        </div>
        <p className="text-[12px] font-normal text-[#64748b]">
          Select your goal for tailored financial product recommendations
        </p>

        {/* Goal Chips */}
        <div className="mt-3.5 flex overflow-x-auto pb-1.5 scrollbar-none">
          <div className="flex gap-1.5">
            {goals.map((g) => {
              const Icon = g.icon;
              const isSelected = g.id === activeGoalId;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveGoalId(g.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition ${
                    isSelected
                      ? "bg-[#5b21b6] text-white shadow-2xs"
                      : "bg-[#f8fafc] text-[#334155] border border-gray-200 hover:bg-[#f1f5f9]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Result Card */}
        <div className="mt-3 rounded-xl border border-gray-200 bg-[#faf5ff]/60 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-[14.5px] font-semibold text-[#0f172a]">
                {goal.title}
              </h3>
              <p className="mt-1 text-[12.5px] font-normal text-[#475569]">
                {goal.recommendation}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={goal.primaryHref}
                className="inline-flex h-8.5 items-center justify-center gap-1 rounded-lg bg-[#5b21b6] px-3.5 text-[11.5px] font-medium text-white shadow-2xs transition hover:bg-[#4c1d95]"
              >
                {goal.primaryCta}
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href={goal.secondaryHref}
                className="inline-flex h-8.5 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 text-[11.5px] font-medium text-[#334155] transition hover:bg-gray-50"
              >
                {goal.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
