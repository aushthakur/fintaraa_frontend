"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  User,
  Home,
  Briefcase,
  Stethoscope,
  Calculator,
  GraduationCap,
  Building2,
  Coins,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface LoanItem {
  id: string;
  name: string;
  tagline: string;
  categoryLabel: string;
  icon: LucideIcon;
  rate: string;
  amount: string;
  tenure: string;
  keyBenefit: string;
  perks: string[];
  image: string;
  customImageClass?: string;
  href: string;
}

const allLoans: LoanItem[] = [
  {
    id: "personal-loan",
    name: "Personal Loan",
    tagline: "Instant Disbursal in 5 Minutes",
    categoryLabel: "Personal Credit",
    icon: User,
    rate: "10.50% p.a.",
    amount: "Up to ₹40 Lakh",
    tenure: "Up to 60 Months",
    keyBenefit: "100% paperless digital verification with immediate bank account credit.",
    perks: ["Zero Collateral Needed", "Same-Day Bank Disbursal", "Minimal Documentation"],
    image: "/assets/loan-png/personal_loan.png",
    href: "/products/personal-loan",
  },
  {
    id: "home-loan",
    name: "Home Loan",
    tagline: "Own Your Dream Home at 7.10%",
    categoryLabel: "Housing Finance",
    icon: Home,
    rate: "7.10% p.a.",
    amount: "Up to ₹5 Crore",
    tenure: "Up to 30 Years",
    keyBenefit: "Lowest monthly EMIs with maximum tax deductions under Sec 80C and 24B.",
    perks: ["Lowest Interest Rates", "Flexible 30-Year Tenure", "Max Tax Saving Benefits"],
    image: "/assets/loan-png/Home_loan.png",
    href: "/products/home-loan",
  },
  {
    id: "business-loan",
    name: "Business Loan",
    tagline: "Collateral-Free Growth Capital",
    categoryLabel: "Commercial Credit",
    icon: Briefcase,
    rate: "11.25% p.a.",
    amount: "Up to ₹1 Crore",
    tenure: "Up to 48 Months",
    keyBenefit: "Fuel enterprise expansion, stock inventory, and manage working capital smoothly.",
    perks: ["No Asset Pledging", "Fast-Track Digital Sanction", "Flexible Repayment Cycles"],
    image: "/assets/loan-png/business_loan.png",
    href: "/products/business-loan",
  },
  {
    id: "doctor-loan",
    name: "Doctor Loan",
    tagline: "Specialized Credit for Medical Pros",
    categoryLabel: "Healthcare Credit",
    icon: Stethoscope,
    rate: "10.25% p.a.",
    amount: "Up to ₹50 Lakh",
    tenure: "Up to 84 Months",
    keyBenefit: "Dedicated priority sanction for clinic setup, lab diagnostic tools, and expansion.",
    perks: ["Doctor Priority Desk", "Equipment & Clinic Finance", "High Sanction Limits"],
    image: "/assets/loan-png/doctors_loan.png",
    href: "/products/doctor-loan",
  },
  {
    id: "ca-loan",
    name: "CA Loan",
    tagline: "Exclusive Pre-Approved Line for CAs",
    categoryLabel: "Professional Finance",
    icon: Calculator,
    rate: "10.50% p.a.",
    amount: "Up to ₹40 Lakh",
    tenure: "Up to 60 Months",
    keyBenefit: "Tailor-made pre-approved financing designed specifically for chartered accountants.",
    perks: ["No Financial Audit Required", "Speedy 24h Sanction", "Practice Growth Funding"],
    image: "/assets/loan-png/ca_loan.png",
    href: "/products/ca-loan",
  },
  {
    id: "education-loan",
    name: "Education Loan",
    tagline: "100% Comprehensive Study Coverage",
    categoryLabel: "Higher Education",
    icon: GraduationCap,
    rate: "8.15% p.a.",
    amount: "Course-Cost Based",
    tenure: "Up to 15 Years",
    keyBenefit: "Full financial support for university tuition, accommodation, books, and air travel.",
    perks: ["Moratorium During Course", "Domestic & Overseas Study", "Sec 80E Tax Rebate"],
    image: "/assets/loan-png/education_loan.png",
    href: "/products/education-loan",
  },
  {
    id: "lap",
    name: "Loan Against Property",
    tagline: "Unlock Up to 70% Property Value",
    categoryLabel: "Secured Funding",
    icon: Building2,
    rate: "9.25% p.a.",
    amount: "Up to ₹10 Crore",
    tenure: "Up to 20 Years",
    keyBenefit: "Leverage residential or commercial assets for high-ticket business or personal needs.",
    perks: ["Up to 70% Property LTV", "Low Secured Interest Rates", "Flexible Long Tenure"],
    image: "/assets/loan-png/Home_loan.png",
    href: "/products/loan-against-property",
  },
  {
    id: "gold-loan",
    name: "Gold Loan",
    tagline: "Instant Cash in 15 Minutes",
    categoryLabel: "Instant Liquidity",
    icon: Coins,
    rate: "8.75% p.a.",
    amount: "Gold-Value Based",
    tenure: "Up to 36 Months",
    keyBenefit: "Instant funds disbursed against gold ornaments with certified bank vault storage.",
    perks: ["Instant 15-Min Disbursal", "Zero CIBIL Score Barrier", "Highest Per-Gram Valuation"],
    image: "/assets/loan-png/gold_loan.png",
    href: "/products/gold-loan",
  },
  {
    id: "vehicle-loan",
    name: "Vehicle Loan",
    tagline: "Up to 100% On-Road Car & Bike Funding",
    categoryLabel: "Auto Finance",
    icon: Car,
    rate: "8.75% p.a.",
    amount: "On-Road Price",
    tenure: "Up to 84 Months",
    keyBenefit: "Drive home your brand-new or pre-owned four-wheeler or bike with simple digital sanction.",
    perks: ["100% On-Road Funding", "New & Pre-Owned Vehicles", "Hassle-Free RC Processing"],
    image: "/assets/loan-png/vehical_loan.png",
    customImageClass: "-translate-y-2 sm:-translate-y-4",
    href: "/products/vehicle-loan",
  },
];

export function LoansMarketplace() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-change every 2.5 seconds (2-3 seconds) with pause on user hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % allLoans.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activeLoan = allLoans[selectedIndex];
  const ActiveIcon = activeLoan.icon;

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? allLoans.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === allLoans.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="loans"
      className="relative scroll-mt-20 overflow-hidden bg-white py-10 sm:py-14 lg:py-16"
      aria-label="Find the right loan for you"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with light, thin fonts */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5 sm:mb-7">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-light tracking-tight text-[#0f172a] leading-tight">
              Find the Right{" "}
              <span className="font-normal bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] bg-clip-text text-transparent">
                Loan for You
              </span>
            </h2>
            <p className="mt-1.5 text-[13px] sm:text-[14px] font-light text-[#64748b] max-w-xl leading-relaxed">
              Explore tailored loan solutions from 50+ top banks with live rates, maximum loan limits &amp; instant approval.
            </p>
          </div>

          {/* Top Category Nav Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous loan"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-[#5b21b6] hover:bg-purple-50 hover:text-[#5b21b6] transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next loan"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-[#5b21b6] hover:bg-purple-50 hover:text-[#5b21b6] transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <Link
              href="/products?category=Loans"
              className="group inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#5b21b6] px-3.5 text-[12.5px] font-normal text-white shadow-md shadow-purple-900/15 hover:bg-[#4c1d95] transition-all"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Loan Category Pills with thin font */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-5 no-scrollbar">
          {allLoans.map((loan, idx) => {
            const isSelected = idx === selectedIndex;
            const Icon = loan.icon;
            return (
              <button
                key={loan.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-light transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#5b21b6] text-white shadow-md shadow-purple-900/20 font-normal"
                    : "bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-[#5b21b6]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-slate-400"}`} />
                <span>{loan.name}</span>
              </button>
            );
          })}
        </div>

        {/* ── SHOWCASE STAGE (Minimalist & Premium) ── */}
        <div className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px]">
            {/* ── LEFT HALF: IMAGE STUDIO ── */}
            <div className="lg:col-span-6 bg-slate-50/50 relative flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-200/60 overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(147,51,234,0.06) 0%, transparent 60%)",
                }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLoan.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative z-10 flex flex-col items-center justify-center w-full"
                >
                  <div
                    className={`relative w-full max-w-[320px] h-[270px] sm:max-w-[380px] sm:h-[320px] lg:max-w-[420px] lg:h-[350px] filter drop-shadow-xl ${
                      activeLoan.customImageClass || ""
                    }`}
                  >
                    <Image
                      src={activeLoan.image}
                      alt={activeLoan.name}
                      fill
                      priority
                      unoptimized
                      className="object-contain object-bottom"
                      sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 420px"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[11px] font-medium text-slate-600 border border-slate-200 shadow-sm">
                      <Zap className="h-3 w-3 text-purple-600" />
                      <span>5-Min Instant Disbursal</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[11px] font-medium text-slate-600 border border-slate-200 shadow-sm">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      <span>50+ Partner Banks</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── RIGHT HALF: MINIMALIST DETAILS ── */}
            <div className="lg:col-span-6 bg-white relative flex flex-col justify-between p-6 sm:p-8 lg:p-10 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLoan.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative z-10 flex flex-col justify-center flex-1"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-50 px-2.5 py-1 text-[11px] font-semibold text-purple-700 border border-purple-100">
                      <ActiveIcon className="h-3 w-3" />
                      <span>{activeLoan.categoryLabel}</span>
                    </span>
                    <span className="text-[12px] font-medium text-slate-500">
                      {activeLoan.tagline}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-slate-900 tracking-tight leading-tight mt-1">
                    {activeLoan.name}
                  </h3>

                  <p className="mt-2.5 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed max-w-md">
                    {activeLoan.keyBenefit}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-2.5">
                    <div className="flex flex-col items-center justify-center h-[52px] sm:h-[60px] rounded-xl bg-slate-50 border border-slate-100 px-1.5 transition-colors hover:bg-slate-100 overflow-hidden">
                      <span className="block w-full text-center text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-500 truncate">
                        Starting ROI
                      </span>
                      <span className="mt-0.5 block w-full text-center text-[13px] sm:text-[15px] font-bold text-purple-700 tracking-tight truncate">
                        {activeLoan.rate}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center h-[52px] sm:h-[60px] rounded-xl bg-slate-50 border border-slate-100 px-1.5 transition-colors hover:bg-slate-100 overflow-hidden">
                      <span className="block w-full text-center text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-500 truncate">
                        Max Amount
                      </span>
                      <span className="mt-0.5 block w-full text-center text-[13px] sm:text-[15px] font-bold text-slate-800 tracking-tight truncate">
                        {activeLoan.amount.replace("Up to ", "")}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center h-[52px] sm:h-[60px] rounded-xl bg-slate-50 border border-slate-100 px-1.5 transition-colors hover:bg-slate-100 overflow-hidden">
                      <span className="block w-full text-center text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-500 truncate">
                        Max Tenure
                      </span>
                      <span className="mt-0.5 block w-full text-center text-[13px] sm:text-[15px] font-bold text-slate-800 tracking-tight truncate">
                        {activeLoan.tenure.replace("Up to ", "")}
                      </span>
                    </div>
                  </div>



                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Link
                      href={activeLoan.href}
                      className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl bg-[#5b21b6] px-6 sm:px-8 text-[13px] sm:text-[14px] font-semibold text-white shadow-lg shadow-purple-900/20 hover:bg-[#4c1d95] active:scale-95 transition-all"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href="#calculators"
                      className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 px-5 text-[13px] sm:text-[14px] font-semibold text-slate-700 transition-all active:scale-95"
                    >
                      <Calculator className="h-4 w-4 text-slate-500" />
                      <span>Calculate EMI</span>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-100 relative z-10">
                <div className="flex items-center gap-1.5">
                  {allLoans.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedIndex(i)}
                      aria-label={`Go to loan ${i + 1}`}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        i === selectedIndex
                          ? "w-8 h-1.5 bg-purple-600"
                          : "w-2 h-1.5 bg-slate-200 hover:bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <Link
                  href="/products?category=Loans"
                  className="hidden sm:inline-flex items-center gap-1 text-[12px] font-semibold text-slate-500 hover:text-purple-700 transition-colors"
                >
                  Compare All Banks <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoansMarketplace;
