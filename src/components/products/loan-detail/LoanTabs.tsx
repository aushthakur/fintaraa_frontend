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
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
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
      className="sticky z-[49] w-full border-y border-[#d8e6f0] bg-[#eaf4ff]/95 px-4 py-3 antialiased backdrop-blur sm:px-6 lg:px-8"
      style={{ top: "var(--site-header-height, 8.25rem)" }}
    >
      <div
        role="tablist"
        aria-label="Loan information sections"
        className="mx-auto flex max-w-9xl items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              className={`h-10 shrink-0 rounded-full px-4 text-[11px] font-extrabold transition sm:px-5 sm:text-[12px] ${
                isSelected
                  ? "bg-[#075cde] text-white"
                  : "border border-[#d6e3ec] bg-white text-[#36546b] hover:border-[#8db9d6] hover:text-[#075cde]"
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
    <section className="bg-[#f7fafc] pb-10 md:pb-14">
      <div className="mx-auto grid max-w-9xl items-start gap-5 px-4 pt-7 sm:px-6 md:pt-9 lg:grid-cols-[245px_minmax(0,1fr)] lg:px-8">
        <aside
          className="hidden rounded-2xl border border-[#dce7ef] bg-white p-3 lg:sticky lg:block"
          style={{ top: "calc(var(--site-header-height, 8.25rem) + 5.25rem)" }}
        >
          <div className="px-3 pb-3 pt-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#7890a2]">
              Quick links
            </p>
            <h2 className="mt-1 text-[16px] font-extrabold text-[#17354d]">
              {productName} Guide
            </h2>
          </div>
          <nav aria-label={`${productName} guide sections`} className="grid gap-1">
            {tabs.map((tab) => {
              const selected = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onTabChange(tab.key)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[11px] font-bold leading-4 transition ${
                    selected
                      ? "bg-[#e9f3ff] text-[#075cde]"
                      : "text-[#526b80] hover:bg-[#f5f8fa] hover:text-[#075cde]"
                  }`}
                >
                  <LoanTabIcon tab={tab} className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1">{tab.label}</span>
                  <ArrowRight
                    className={`h-3.5 w-3.5 shrink-0 ${selected ? "opacity-100" : "opacity-0"}`}
                  />
                </button>
              );
            })}
          </nav>
          <AuthRedirectLink
            href={applyHref}
            productSlug={productSlug}
            className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#13a653] px-3 text-[11px] font-extrabold text-white no-underline transition hover:bg-[#0f8f45]"
          >
            Apply for {productName}
            <ArrowRight className="h-3.5 w-3.5" />
          </AuthRedirectLink>
        </aside>

        <article className="min-w-0 rounded-2xl border border-[#dce7ef] bg-white p-5 sm:p-7 md:p-8">
          <div className="flex items-start gap-4 border-b border-[#e5edf3] pb-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9f3ff] text-[#075cde]">
              <LoanTabIcon tab={active} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#075cde]">
                {active.eyebrow || `${productName} guide`}
              </p>
              <h2 className="mt-1 text-[23px] font-extrabold leading-tight tracking-[-0.02em] text-[#17354d] sm:text-[28px]">
                {guideTitle(active.title)}
              </h2>
              {active.description ? (
                <p className="mt-2 text-[13px] font-medium leading-6 text-[#718598] sm:text-[14px]">
                  {active.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6">{children}</div>

          <div className="mt-7 border-t border-[#e5edf3] pt-5">
            <p className="text-[10px] font-medium leading-5 text-[#8295a5]">
              Information is indicative. Eligibility, pricing, approval and the
              final document checklist are determined by the selected lending
              partner after profile and document verification.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
