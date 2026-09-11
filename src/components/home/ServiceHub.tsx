"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeIndianRupee,
  Home,
  BriefcaseBusiness,
  Stethoscope,
  GraduationCap,
  CreditCard,
  ShieldCheck,
  Gauge,
  Building2,
  Gem,
  Car,
  Calculator,
  ReceiptText,
  FileCheck2,
  Building,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface ServiceLauncherItem {
  id: string;
  name: string;
  sub: string;
  badge?: string;
  href: string;
  icon: LucideIcon;
}

const primaryLauncherServices: ServiceLauncherItem[] = [
  {
    id: "personal-loan",
    name: "Personal Loan",
    sub: "Up to ₹40L • In 5 mins",
    badge: "Instant",
    href: "/products/personal-loan",
    icon: BadgeIndianRupee,
  },
  {
    id: "home-loan",
    name: "Home Loan",
    sub: "From 7.10% • Up to ₹5 Cr",
    badge: "Lowest Rate",
    href: "/products/home-loan",
    icon: Home,
  },
  {
    id: "business-loan",
    name: "Business Loan",
    sub: "Growth Capital • Up to ₹1 Cr",
    badge: "No Collateral",
    href: "/products/business-loan",
    icon: BriefcaseBusiness,
  },
  {
    id: "doctor-loan",
    name: "Doctor Loan",
    sub: "Professional Credit",
    badge: "Priority",
    href: "/products/doctor-loan",
    icon: Stethoscope,
  },
  {
    id: "ca-loan",
    name: "CA Loan",
    sub: "Exclusive Credit for CAs",
    badge: "Exclusive",
    href: "/products/ca-loan",
    icon: GraduationCap,
  },
  {
    id: "credit-cards",
    name: "Credit Cards",
    sub: "Compare 50+ Bank Cards",
    badge: "Offers",
    href: "/credit-cards",
    icon: CreditCard,
  },
  {
    id: "insurance",
    name: "Insurance",
    sub: "Health • Life • Motor",
    badge: "Digital",
    href: "/products?category=Insurance",
    icon: ShieldCheck,
  },
  {
    id: "credit-score",
    name: "Credit Score",
    sub: "Free Bureau Report",
    badge: "Free",
    href: "/cibil-score",
    icon: Gauge,
  },
];

const secondaryLauncherServices: ServiceLauncherItem[] = [
  {
    id: "loan-against-property",
    name: "Loan Against Property",
    sub: "High-ticket secured funding",
    href: "/products/loan-against-property",
    icon: Building2,
  },
  {
    id: "education-loan",
    name: "Education Loan",
    sub: "Domestic & global study",
    href: "/products/education-loan",
    icon: GraduationCap,
  },
  {
    id: "gold-loan",
    name: "Gold Loan",
    sub: "Instant liquidity on gold",
    href: "/products/gold-loan",
    icon: Gem,
  },
  {
    id: "vehicle-loan",
    name: "Vehicle Loan",
    sub: "Car & bike financing",
    href: "/products/vehicle-loan",
    icon: Car,
  },
  {
    id: "calculators",
    name: "Financial Tools",
    sub: "EMI & eligibility calculators",
    href: "#calculators",
    icon: Calculator,
  },
  {
    id: "itr-filing",
    name: "ITR Filing",
    sub: "Assisted income tax return",
    href: "/itr-filing",
    icon: ReceiptText,
  },
  {
    id: "msme-reg",
    name: "MSME Registration",
    sub: "Govt subsidies & Udyam",
    href: "/msme-registration",
    icon: FileCheck2,
  },
  {
    id: "company-reg",
    name: "Company Setup",
    sub: "Register Pvt Ltd, LLP, OPC",
    href: "/company-registration",
    icon: Building,
  },
];

export function ServiceHub() {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedList = isExpanded
    ? [...primaryLauncherServices, ...secondaryLauncherServices]
    : primaryLauncherServices;

  return (
    <section
      id="services-hub"
      className="scroll-mt-20 border-b border-gray-150 bg-[#fbfbfe] py-5 sm:py-7"
      aria-label="Explore financial services"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#5b21b6]" />
            <h2 className="text-[15px] font-bold text-[#0f172a] sm:text-[17px]">
              Explore Financial Services
            </h2>
            <span className="hidden text-[12px] font-medium text-[#64748b] sm:inline">
              • Tap any service for instant access
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="group inline-flex items-center gap-1 text-[12px] font-bold text-[#5b21b6] hover:text-[#4c1d95]"
          >
            <span>{isExpanded ? "Show Less" : "View All (16)"}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 transition group-hover:translate-y-0.5" />
            )}
          </button>
        </div>

        {/* Super-App Compact Service Launcher Grid */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-4 lg:grid-cols-4">
          {displayedList.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                href={service.href}
                className="group flex items-center gap-3 rounded-xl border border-gray-200/90 bg-white p-2.5 shadow-2xs transition-all duration-150 hover:-translate-y-0.5 hover:border-[#c4b5fd] hover:bg-[#faf5ff] hover:shadow-xs sm:p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f3ff] text-[#5b21b6] transition group-hover:bg-[#5b21b6] group-hover:text-white sm:h-9.5 sm:w-9.5">
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="truncate text-[12.5px] font-bold text-[#0f172a] group-hover:text-[#5b21b6] sm:text-[13.5px]">
                      {service.name}
                    </h3>
                    {service.badge && (
                      <span className="shrink-0 rounded bg-[#f5f3ff] px-1.5 py-0.2 text-[9px] font-bold uppercase text-[#5b21b6]">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] font-medium text-[#64748b]">
                    {service.sub}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
