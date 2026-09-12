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

        {/* ── SPLIT SHOWCASE STAGE (Left Image Half: Pure White Studio | Right Details Half: Sleek Obsidian Slate) ── */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.12)] bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px]">
            {/* ── LEFT HALF: WHITE STUDIO STAGE FOR 3D IMAGE ── */}
            <div className="lg:col-span-6 bg-white relative flex flex-col items-center justify-center p-5 sm:p-6 lg:p-7 border-b lg:border-b-0 lg:border-r border-slate-100/90 overflow-hidden">
              {/* Subtle ambient radial backdrop on white */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(147,51,234,0.06) 0%, rgba(241,245,249,0.7) 60%, transparent 100%)",
                }}
              />

              {/* Animated 3D Artwork Image Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLoan.id}
                  initial={{ opacity: 0, scale: 0.94, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -8 }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                  className="relative z-10 flex flex-col items-center justify-center w-full"
                >
                  {/* MAXIMIZED 3D Artwork Image */}
                  <div
                    className={`relative w-full max-w-[320px] h-[270px] sm:max-w-[390px] sm:h-[330px] lg:max-w-[460px] lg:h-[370px] filter drop-shadow-[0_20px_35px_rgba(15,23,42,0.14)] ${
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
                      sizes="(max-width: 640px) 320px, (max-width: 1024px) 390px, 460px"
                    />
                  </div>

                  {/* Crisp Light Trust Indicators */}
                  <div className="mt-2.5 flex items-center justify-center gap-2 sm:gap-2.5">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-0.5 text-[10.5px] font-normal text-slate-600 border border-slate-200/80 shadow-2xs">
                      <Zap className="h-3 w-3 text-[#7c3aed]" />
                      <span>5-Min Instant Disbursal</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-0.5 text-[10.5px] font-normal text-slate-600 border border-slate-200/80 shadow-2xs">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      <span>50+ Partner Banks</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── RIGHT HALF: SLEEK OBSIDIAN SLATE FOR DETAILS ── */}
            <div className="lg:col-span-6 bg-gradient-to-br from-[#080d19] via-[#0f172a] to-[#18132f] relative flex flex-col justify-between p-5 sm:p-6 lg:p-7 overflow-hidden">
              {/* Subtle top light accent line */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#a855f7]/60 to-transparent opacity-80" />

              {/* Background ambient lighting blooms */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-purple-600/15 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-indigo-600/15 blur-3xl"
              />

              {/* Animated Content for Loan Details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLoan.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                  className="relative z-10 flex flex-col justify-center flex-1"
                >
                  {/* Category Pill & Tagline */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.08] px-2.5 py-0.5 text-[11px] font-light text-purple-200 border border-white/10 backdrop-blur-md">
                      <ActiveIcon className="h-3 w-3 text-[#c084fc]" />
                      <span>{activeLoan.categoryLabel}</span>
                    </span>
                    <span className="text-[11.5px] font-light text-slate-400">
                      {activeLoan.tagline}
                    </span>
                  </div>

                  {/* Loan Title */}
                  <h3 className="text-xl sm:text-2xl lg:text-[27px] font-light text-white tracking-tight leading-snug">
                    {activeLoan.name}
                  </h3>

                  {/* Key Proposition */}
                  <p className="mt-1 text-[12px] sm:text-[13px] text-slate-300/85 font-light leading-relaxed">
                    {activeLoan.keyBenefit}
                  </p>

                  {/* 3 Compact Frosted Glass Metrics */}
                  <div className="mt-3.5 grid grid-cols-3 gap-2 sm:gap-2.5">
                    <div className="rounded-xl bg-white/[0.05] border border-white/10 p-2 sm:p-2.5 text-center backdrop-blur-md">
                      <span className="block text-[9.5px] sm:text-[10px] font-light uppercase tracking-wider text-slate-400">
                        Starting ROI
                      </span>
                      <span className="mt-0.5 block text-base sm:text-lg lg:text-[21px] font-light text-[#c084fc] leading-tight tracking-tight">
                        {activeLoan.rate}
                      </span>
                    </div>

                    <div className="rounded-xl bg-white/[0.05] border border-white/10 p-2 sm:p-2.5 text-center backdrop-blur-md">
                      <span className="block text-[9.5px] sm:text-[10px] font-light uppercase tracking-wider text-slate-400">
                        Max Amount
                      </span>
                      <span className="mt-0.5 block text-base sm:text-lg lg:text-[21px] font-light text-white leading-tight tracking-tight">
                        {activeLoan.amount.replace("Up to ", "")}
                      </span>
                    </div>

                    <div className="rounded-xl bg-white/[0.05] border border-white/10 p-2 sm:p-2.5 text-center backdrop-blur-md">
                      <span className="block text-[9.5px] sm:text-[10px] font-light uppercase tracking-wider text-slate-400">
                        Max Tenure
                      </span>
                      <span className="mt-0.5 block text-base sm:text-lg lg:text-[21px] font-light text-white leading-tight tracking-tight">
                        {activeLoan.tenure.replace("Up to ", "")}
                      </span>
                    </div>
                  </div>

                  {/* Key Perks List */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {activeLoan.perks.map((perk) => (
                      <span
                        key={perk}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 text-[11px] font-light text-slate-200"
                      >
                        <CheckCircle2 className="h-3 w-3 text-[#c084fc] shrink-0" />
                        <span>{perk}</span>
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2.5">
                    <Link
                      href={activeLoan.href}
                      className="inline-flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#9333ea] via-[#7c3aed] to-[#5b21b6] px-5 sm:px-6 text-[12.5px] sm:text-[13px] font-normal text-white shadow-md shadow-purple-950/40 hover:brightness-110 active:scale-95 transition-all tracking-wide"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <Link
                      href="#calculators"
                      className="inline-flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.12] px-4 text-[12px] sm:text-[12.5px] font-light text-white backdrop-blur-md transition-all active:scale-95"
                    >
                      <span>Calculate EMI</span>
                    </Link>

                    <Link
                      href="/products?category=Loans"
                      className="ml-auto hidden sm:inline-flex items-center text-[11.5px] font-light text-purple-300/80 hover:text-white transition-colors"
                    >
                      Compare All Banks →
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Progress Indicators inside Right Panel */}
              <div className="mt-4 pt-3 flex items-center justify-between border-t border-white/[0.08] relative z-10">
                <div className="flex items-center gap-1">
                  {allLoans.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedIndex(i)}
                      aria-label={`Go to loan ${i + 1}`}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        i === selectedIndex
                          ? "w-6 h-1 bg-[#c084fc]"
                          : "w-1 h-1 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-light text-slate-400">
                  {selectedIndex + 1} / {allLoans.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoansMarketplace;
