"use client";

import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Calculator,
  CircleHelp,
  FileCheck2,
  IndianRupee,
  ListChecks,
  Star,
  UserCheck,
} from "lucide-react";
import type { LoanSeoTab } from "@/services/loanSeoPages";

function LoanTabIcon({
  tab,
  className = "h-4 w-4",
}: {
  tab: LoanSeoTab;
  className?: string;
}) {
  const identity = [tab.key, tab.label, ...(tab.filterKeys || [])]
    .join(" ")
    .toLowerCase();
  if (identity.includes("eligib"))
    return <UserCheck className={className} />;
  if (identity.includes("document") || identity.includes("kyc"))
    return <FileCheck2 className={className} />;
  if (
    identity.includes("apply") ||
    identity.includes("process") ||
    identity.includes("verification")
  )
    return <ListChecks className={className} />;
  if (identity.includes("emi") || identity.includes("repayment"))
    return <Calculator className={className} />;
  if (identity.includes("fee") || identity.includes("charge"))
    return <IndianRupee className={className} />;
  if (identity.includes("review") || identity.includes("testimonial"))
    return <Star className={className} />;
  if (identity.includes("faq") || identity.includes("question"))
    return <CircleHelp className={className} />;
  if (identity.includes("feature") || identity.includes("benefit"))
    return <BadgeCheck className={className} />;
  return <BookOpenCheck className={className} />;
}

const shortLabel = (label: string) => {
  if (label.toLowerCase().includes("steps")) return "Process";
  if (label.toLowerCase().includes("calculator")) return "EMI";
  if (label.toLowerCase().includes("charges")) return "Fees";
  if (label.toLowerCase().includes("documents")) return "Documents";
  return label;
};

const guideTitle = (title: string) =>
  title.replace(
    /\b(overview|eligibility|features|documents|process|reviews|faqs)\b/gi,
    (word) =>
      word.toLowerCase() === "faqs"
        ? "FAQs"
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );

export function LoanTabs({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: LoanSeoTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}) {
  const active = tabs.find((tab) => tab.key === activeTab) || tabs[0];

  return (
    <section
      className="sticky z-30 w-full border-y border-slate-200 bg-white/95 px-4 py-2.5 antialiased backdrop-blur-md shadow-2xs sm:px-6 lg:px-8"
      style={{ top: "var(--site-header-height, 8.25rem)" }}
    >
      <div
        role="tablist"
        aria-label="Loan information sections"
        className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const isSelected = active?.key === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onTabChange(tab.key)}
              className={`h-9 shrink-0 rounded-full px-4 text-[12px] font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#5b21b6] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <span className="sm:hidden">{shortLabel(tab.label)}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function LoanGuidePanel({
  tabs,
  activeTab,
  onTabChange,
  productName,
  productSlug,
  applyHref,
  children,
}: {
  tabs: LoanSeoTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  productName: string;
  productSlug: string;
  applyHref: string;
  children: React.ReactNode;
}) {
  const active = tabs.find((tab) => tab.key === activeTab) || tabs[0];
  if (!active) return null;

  return (
    <section className="bg-slate-50/70 pb-12 md:pb-16 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 md:pt-10 lg:px-8">
        <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 md:p-8 shadow-xs">
          <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#5b21b6]">
              <LoanTabIcon tab={active} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#5b21b6]">
                {active.eyebrow || `${productName} guide`}
              </p>
              <h2 className="mt-1 text-[22px] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-[26px]">
                {guideTitle(active.title)}
              </h2>
              {active.description ? (
                <p className="mt-2 text-[13.5px] font-medium leading-relaxed text-slate-600">
                  {active.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6">{children}</div>

          <div className="mt-8 border-t border-slate-100 pt-4">
            <p className="text-[11px] font-medium leading-relaxed text-slate-400">
              *Information is indicative. Interest rates, loan sanction amounts, and approval are subject to bank and NBFC underwriting norms and credit evaluation.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
