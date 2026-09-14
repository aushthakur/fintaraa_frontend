"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, ChevronUp, Sparkles, TrendingDown } from "lucide-react";

export const personalLoanBankRates = [
  {
    name: "HDFC Bank",
    rate: "10.50",
    feature: "Zero paperless approval",
    maxAmount: "₹1 Crore",
    logo: "/assets/banks/HDFC-Bank.png",
    slug: "hdfc-bank",
  },
  {
    name: "Axis Bank",
    rate: "10.49",
    feature: "Lowest starting rate",
    maxAmount: "₹1 Crore",
    logo: "/assets/banks/axis-bank.png",
    slug: "axis-bank",
  },
  {
    name: "ICICI Bank",
    rate: "10.65",
    feature: "Instant 3-second disbursal",
    maxAmount: "₹1 Crore",
    logo: "/assets/banks/ICICI-Bank.png",
    slug: "icici-bank",
  },
  {
    name: "State Bank of India",
    rate: "11.00",
    feature: "Lowest processing fee",
    maxAmount: "₹50 Lakh",
    logo: "/assets/banks/State-Bank-of-India.png",
    slug: "sbi",
  },
  {
    name: "IDFC FIRST Bank",
    rate: "10.49",
    feature: "Zero foreclosure charges*",
    maxAmount: "₹1 Crore",
    logo: "/assets/banks/idfc.png",
    slug: "idfc-first-bank",
  },
  {
    name: "IndusInd Bank",
    rate: "10.49",
    feature: "100% digital journey",
    maxAmount: "₹50 Lakh",
    logo: "/assets/banks/IndusInd-Bank.png",
    slug: "indusind-bank",
  },
  {
    name: "Kotak Mahindra Bank",
    rate: "10.99",
    feature: "Minimal documentation",
    maxAmount: "₹1 Crore",
    logo: "/assets/banks/Kotak-Mahindra-Bank.png",
    slug: "kotak-mahindra-bank",
  },
  {
    name: "Bank of Baroda",
    rate: "10.85",
    feature: "Concessional rates for score > 750",
    maxAmount: "₹20 Lakh",
    logo: "/assets/banks/Bank-of-Baroda.png",
    slug: "bank-of-baroda",
  },
  {
    name: "Bajaj Finserv",
    rate: "11.00",
    feature: "Flexi hybrid loan facility",
    maxAmount: "₹40 Lakh",
    logo: "/assets/banks/bajaj.png",
    slug: "bajaj-finserv",
  },
  {
    name: "Punjab National Bank",
    rate: "11.15",
    feature: "Attractive PSU rates",
    maxAmount: "₹20 Lakh",
    logo: "/assets/banks/Punjab-National-Bank.png",
    slug: "pnb",
  },
  {
    name: "Yes Bank",
    rate: "10.99",
    feature: "Disbursal in under 2 hours",
    maxAmount: "₹40 Lakh",
    logo: "/assets/banks/yes-bank.png",
    slug: "yes-bank",
  },
  {
    name: "Canara Bank",
    rate: "10.95",
    feature: "Transparent low charges",
    maxAmount: "₹15 Lakh",
    logo: "/assets/banks/canara-bank.png",
    slug: "canara-bank",
  },
  {
    name: "Federal Bank",
    rate: "11.49",
    feature: "Quick in-principle sanction",
    maxAmount: "₹25 Lakh",
    logo: "/assets/banks/Federal-Bank.png",
    slug: "federal-bank",
  },
  {
    name: "Union Bank of India",
    rate: "11.20",
    feature: "Special women borrower rebate",
    maxAmount: "₹15 Lakh",
    logo: "/assets/banks/union-bank.png",
    slug: "union-bank",
  },
  {
    name: "Bandhan Bank",
    rate: "11.55",
    feature: "Doorstep service available",
    maxAmount: "₹15 Lakh",
    logo: "/assets/banks/Bandhan-Bank.png",
    slug: "bandhan-bank",
  },
  {
    name: "Central Bank of India",
    rate: "11.25",
    feature: "Low interest sovereign trust",
    maxAmount: "₹15 Lakh",
    logo: "/assets/banks/Central-Bank-of-India.png",
    slug: "central-bank",
  },
  {
    name: "IDBI Bank",
    rate: "11.00",
    feature: "Pre-approved salary loans",
    maxAmount: "₹20 Lakh",
    logo: "/assets/banks/IDBI-Bank.png",
    slug: "idbi-bank",
  },
  {
    name: "UCO Bank",
    rate: "11.40",
    feature: "Fast-track processing",
    maxAmount: "₹15 Lakh",
    logo: "/assets/banks/UCO-Bank.png",
    slug: "uco-bank",
  },
];

// Double the items for a seamless continuous looping marquee
const tickerItems = [...personalLoanBankRates, ...personalLoanBankRates];

export function PersonalLoanRateTicker() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Hide on user profile/settings pages
  const isExcludedPage =
    pathname === "/account/profile" ||
    pathname.startsWith("/account/profile/") ||
    pathname === "/partner/profile" ||
    pathname.startsWith("/partner/profile/");

  if (isExcludedPage) return null;

  if (collapsed) {
    return (
      <aside
        aria-label="Personal Loan Live Rate Ticker collapsed"
        className="fixed bottom-3 left-3 sm:left-6 z-40"
      >
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="group inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-[0_6px_25px_rgba(91,33,182,0.14)] backdrop-blur-md transition-all hover:scale-105 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(91,33,182,0.22)] cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="bg-gradient-to-r from-[#5b21b6] to-[#7c3aed] bg-clip-text text-transparent">
            Personal Loan Rates from 10.49%
          </span>
          <ChevronUp className="h-3.5 w-3.5 text-[#7c3aed] transition-transform group-hover:-translate-y-0.5" />
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Live Personal Loan Interest Rates of Partner Banks"
      className="fixed bottom-0 left-0 right-0 z-40 select-none"
    >
      <style>{`
        @keyframes rate-marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .rate-ticker-marquee {
          display: flex;
          width: max-content;
          animation: rate-marquee-left 52s linear infinite;
          will-change: transform;
        }
        .rate-ticker-wrapper:hover .rate-ticker-marquee {
          animation-play-state: paused;
        }
        .rate-ticker-pill {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .rate-ticker-pill:hover {
          transform: translateY(-2px);
          border-color: #c4b5fd !important;
          background-color: #faf5ff !important;
          box-shadow: 0 4px 14px rgba(109, 40, 217, 0.16);
        }
      `}</style>

      {/* Top glowing laser accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#6d28d9] via-[#9333ea] to-[#2563eb] opacity-90 shadow-2xs" />

      {/* Main Light Glassmorphic Ticker Container */}
      <div className="rate-ticker-wrapper relative flex h-11 items-center bg-white/95 text-slate-800 backdrop-blur-xl border-t border-purple-100 shadow-[0_-6px_24px_rgba(0,0,0,0.07)]">
        
        {/* ── LEFT FIXED LIVE INDICATOR ── */}
        <div className="relative z-20 flex h-full shrink-0 items-center gap-2 border-r border-slate-200/90 bg-white/98 px-3 sm:px-4 shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>

          <div className="flex items-center gap-1.5">
            <TrendingDown className="h-3.5 w-3.5 text-[#6d28d9] shrink-0" />
            <span className="text-[11.5px] font-black uppercase tracking-wider text-[#1e1b4b] whitespace-nowrap hidden sm:inline">
              Personal Loan Rates
            </span>
            <span className="text-[10.5px] font-extrabold uppercase tracking-tight text-[#1e1b4b] sm:hidden">
              Live Rates
            </span>
            <span className="hidden md:inline rounded-full bg-purple-50 border border-purple-200/80 px-2 py-0.5 text-[9.5px] font-bold text-[#6d28d9] tracking-normal">
              50+ Banks
            </span>
          </div>
        </div>

        {/* ── CENTER INFINITE MARQUEE TRACK ── */}
        <div className="relative flex-1 overflow-hidden h-full flex items-center">
          {/* Subtle edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-white to-transparent" />

          <div className="rate-ticker-marquee flex items-center">
            {tickerItems.map((bank, index) => (
              <Link
                key={`${bank.slug}-${index}`}
                href="/products/personal-loan"
                className="rate-ticker-pill inline-flex items-center gap-2 mx-2 px-2.5 sm:px-3 py-1 rounded-full bg-slate-50/90 border border-slate-200/90 text-slate-700 no-underline shrink-0"
              >
                {/* Bank Mini Icon */}
                <div className="h-4.5 w-4.5 rounded-full bg-white border border-slate-200/80 flex items-center justify-center p-0.5 overflow-hidden shrink-0 shadow-2xs">
                  <Image
                    src={bank.logo}
                    alt={bank.name}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>

                {/* Bank Name */}
                <span className="text-[11.5px] font-bold text-slate-900 whitespace-nowrap">
                  {bank.name}
                </span>

                {/* Interest Rate Badge */}
                <span className="inline-flex items-center gap-0.5 text-[11px] font-black text-emerald-600 whitespace-nowrap">
                  <span className="text-[9.5px] text-slate-400 font-semibold">from</span>
                  {bank.rate}%
                  <span className="text-[9px] font-medium text-slate-500">p.a.</span>
                </span>

                {/* Feature highlight */}
                <span className="text-[10px] text-slate-500 hidden xl:inline whitespace-nowrap font-medium">
                  • {bank.feature}
                </span>

                {/* Micro Apply Callout */}
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#6d28d9] ml-0.5">
                  Apply <ArrowRight className="h-2.5 w-2.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── RIGHT FIXED ACTIONS & COLLAPSE ── */}
        <div className="relative z-20 flex h-full shrink-0 items-center gap-1.5 border-l border-slate-200/90 bg-white/98 px-2 sm:px-3 shadow-[-4px_0_12px_rgba(0,0,0,0.03)]">
          <Link
            href="/products/personal-loan"
            className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-[#5b21b6] via-[#6d28d9] to-[#7c3aed] px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:opacity-95 transition active:scale-95 no-underline"
          >
            <span>Compare All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>

          {/* Minimize toggle button */}
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            aria-label="Minimize rates ticker"
            title="Minimize ticker"
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
