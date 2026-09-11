"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  FileSpreadsheet,
  ReceiptText,
  Landmark,
  Gauge,
  Calculator,
  FileCheck2,
  GitCompare,
  Building,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

interface SmartAction {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  href: string;
  icon: LucideIcon;
  iconBg: string;
  category: "cards" | "business" | "tax" | "tools";
}

const quickServices: SmartAction[] = [
  {
    id: "action-credit-card-apply",
    title: "Quick Card Apply",
    subtitle: "Instant Apply • 50+ Cards",
    badge: "Instant",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/70",
    href: "/credit-cards",
    icon: CreditCard,
    iconBg: "bg-amber-50/80 border-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
    category: "cards",
  },
  {
    id: "action-project-report",
    title: "Project Report",
    subtitle: "Bank CMA & DPR Reports",
    badge: "Bank Ready",
    badgeColor: "bg-purple-50 text-[#5b21b6] border-purple-200/70",
    href: "/project-report",
    icon: FileSpreadsheet,
    iconBg: "bg-purple-50/80 border-purple-100 text-[#5b21b6] group-hover:bg-[#5b21b6] group-hover:text-white",
    category: "business",
  },
  {
    id: "action-gst-filing",
    title: "GST Filing & Reg",
    subtitle: "Returns & Registration",
    badge: "GST Portal",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200/70",
    href: "/gst-registration",
    icon: ReceiptText,
    iconBg: "bg-blue-50/80 border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    category: "tax",
  },
  {
    id: "action-govt-schemes",
    title: "Govt Schemes",
    subtitle: "PMEGP, Mudra & Subsidies",
    badge: "Subsidies",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    href: "/msme-registration",
    icon: Landmark,
    iconBg: "bg-emerald-50/80 border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    category: "business",
  },
  {
    id: "action-credit-score",
    title: "Free Credit Score",
    subtitle: "Bureau CIBIL Report",
    badge: "Free Check",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    href: "/cibil-score",
    icon: Gauge,
    iconBg: "bg-emerald-50/80 border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    category: "tools",
  },
  {
    id: "action-calculate-emi",
    title: "Calculate EMI",
    subtitle: "Loan & Interest Planner",
    badge: "Calculator",
    badgeColor: "bg-violet-50 text-[#6d28d9] border-violet-200/70",
    href: "#calculators",
    icon: Calculator,
    iconBg: "bg-violet-50/80 border-violet-100 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-white",
    category: "tools",
  },
  {
    id: "action-itr-filing",
    title: "ITR Filing",
    subtitle: "Income Tax Returns",
    badge: "CA Assisted",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200/70",
    href: "/itr-filing",
    icon: FileCheck2,
    iconBg: "bg-teal-50/80 border-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white",
    category: "tax",
  },
  {
    id: "action-company-setup",
    title: "Company Setup",
    subtitle: "Pvt Ltd, LLP, OPC & MSME",
    badge: "Govt Reg",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
    href: "/company-registration",
    icon: Building,
    iconBg: "bg-indigo-50/80 border-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    category: "business",
  },
  {
    id: "action-compare-loans",
    title: "Compare Loans",
    subtitle: "30+ Top Partner Banks",
    badge: "Lowest ROI",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200/70",
    href: "#loans",
    icon: GitCompare,
    iconBg: "bg-sky-50/80 border-sky-100 text-sky-600 group-hover:bg-sky-600 group-hover:text-white",
    category: "cards",
  },
  {
    id: "action-insurance",
    title: "Insurance Cover",
    subtitle: "Health, Life & Motor",
    badge: "Save Tax",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200/70",
    href: "#insurance",
    icon: ShieldCheck,
    iconBg: "bg-rose-50/80 border-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
    category: "cards",
  },
];

const categoryTabs = [
  { id: "all", label: "All Quick Services" },
  { id: "cards", label: "Cards & Loans" },
  { id: "business", label: "Govt Schemes & Project Report" },
  { id: "tax", label: "GST & Tax Filing" },
  { id: "tools", label: "Calculators & Score" },
];

export function SmartActionBar() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredServices =
    activeTab === "all"
      ? quickServices
      : quickServices.filter((service) => service.category === activeTab);

  return (
    <section
      className="bg-white py-3.5 sm:py-5"
      aria-label="Quick Financial Services and Tools"
    >
      <div className="mx-auto w-full max-w-8xl min-[1680px]:max-w-9xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#f8fafc] p-3.5 sm:p-5 sm:px-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] border border-slate-100">
          {/* Section Header with badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 sm:mb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#5b21b6] text-white shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <div>
                <h2 className="text-[13.5px] sm:text-[15.5px] font-semibold text-[#0f172a] tracking-tight">
                  Quick Services &amp; Financial Tools
                </h2>
                <p className="text-[11px] font-normal text-[#64748b]">
                  Instant card apply, bank project reports, GST filing, govt schemes &amp; calculators
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-emerald-700 border border-emerald-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% Free • Verified &amp; Paperless
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3.5 no-scrollbar">
            {categoryTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 rounded-xl px-3 py-1 text-[11px] sm:text-[12px] font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#5b21b6] text-white shadow-xs"
                      : "bg-white text-[#475569] hover:bg-purple-50 hover:text-[#5b21b6] border border-slate-200/70"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Super-App Responsive Box Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {filteredServices.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group relative flex flex-col items-center justify-between rounded-2xl bg-white p-3.5 sm:p-4 text-center shadow-[0_2px_10px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(91,33,182,0.12)] hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-transparent hover:border-[#ddd6fe]"
                >
                  {/* Floating mini badge */}
                  <span
                    className={`absolute top-2 right-2 rounded-full px-1.5 py-0.5 text-[8px] sm:text-[8.5px] font-semibold uppercase tracking-wide border ${tool.badgeColor}`}
                  >
                    {tool.badge}
                  </span>

                  {/* Icon Box */}
                  <div
                    className={`mt-1 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border transition-all duration-300 shadow-2xs group-hover:scale-110 ${tool.iconBg}`}
                  >
                    <Icon className="h-5 w-5 transition-transform" />
                  </div>

                  {/* Titles */}
                  <div className="mt-2 sm:mt-2.5 w-full">
                    <p className="flex items-center justify-center gap-0.5 text-[12px] sm:text-[12.5px] font-semibold text-[#0f172a] group-hover:text-[#5b21b6] transition-colors leading-tight truncate">
                      <span>{tool.title}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#5b21b6]" />
                    </p>
                    <p className="mt-0.5 text-[9.5px] sm:text-[10px] font-normal text-[#64748b] truncate">
                      {tool.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
export default SmartActionBar;
