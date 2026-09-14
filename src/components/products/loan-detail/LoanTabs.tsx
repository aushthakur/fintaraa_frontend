"use client";

import { useEffect, useState } from "react";
import {
  BookOpenCheck,
  BadgeCheck,
  UserCheck,
  FileCheck2,
  ListChecks,
  Calculator,
  IndianRupee,
  Star,
  CircleHelp,
  BookOpen,
  Building2,
} from "lucide-react";
import type { LoanSeoTab } from "@/services/loanSeoPages";

export interface NavSectionItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const PERSONAL_LOAN_NAV_SECTIONS: NavSectionItem[] = [
  { id: "life-goals", label: "Overview", shortLabel: "Overview", icon: BookOpenCheck },
  { id: "features", label: "Features", shortLabel: "Features", icon: BadgeCheck },
  { id: "steps-to-apply", label: "Steps to Apply", shortLabel: "Process", icon: ListChecks },
  { id: "eligibility", label: "Eligibility", shortLabel: "Eligibility", icon: UserCheck },
  { id: "documents", label: "Documents", shortLabel: "Documents", icon: FileCheck2 },
  { id: "emi-calculator", label: "EMI Calculator", shortLabel: "EMI", icon: Calculator },
  { id: "bank-comparison", label: "Bank Rates", shortLabel: "Banks", icon: Building2 },
  { id: "fees-and-charges", label: "Fees & Charges", shortLabel: "Fees", icon: IndianRupee },
  { id: "seo-guide", label: "Borrowing Guide", shortLabel: "Guide", icon: BookOpen },
  { id: "reviews", label: "Reviews", shortLabel: "Reviews", icon: Star },
  { id: "faqs", label: "FAQs", shortLabel: "FAQs", icon: CircleHelp },
];

export function LoanTabs({
  sections = PERSONAL_LOAN_NAV_SECTIONS,
  activeSectionId,
  onSectionClick,
}: {
  sections?: NavSectionItem[];
  activeSectionId?: string;
  onSectionClick?: (sectionId: string) => void;
  // Backward compatibility with legacy props
  tabs?: LoanSeoTab[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
}) {
  const [activeId, setActiveId] = useState<string>(
    activeSectionId || sections[0]?.id || "life-goals"
  );

  // Auto-track active section via IntersectionObserver on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    if (onSectionClick) {
      onSectionClick(id);
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <section
      className="sticky z-30 w-full border-y border-slate-200/90 bg-white/95 px-4 py-2.5 antialiased backdrop-blur-md shadow-2xs sm:px-6 lg:px-8"
      style={{ top: "var(--site-header-height, 8.25rem)" }}
    >
      <div
        role="tablist"
        aria-label="Loan navigation sections"
        className="mx-auto flex max-w-7xl items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((section) => {
          const isSelected = activeId === section.id;
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => scrollToSection(section.id)}
              className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 sm:px-4 text-xs font-bold transition-all cursor-pointer select-none ${
                isSelected
                  ? "bg-[#5b21b6] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="sm:hidden">{section.shortLabel}</span>
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
