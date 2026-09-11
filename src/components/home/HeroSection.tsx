"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  LockKeyhole,
  ChevronDown,
  X,
  CreditCard,
  BriefcaseBusiness,
  CalendarDays,
  IndianRupee,
  Gauge,
  HandCoins,
  Umbrella,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { loanProductDirectory } from "@/data/bankDirectory";
import { productHref } from "@/lib/productRouting";

// Rotating services for the hero headline
const rotatingServices = [
  "Personal Loans",
  "Business Loans",
  "Home Loans",
  "Doctor Loans",
  "CA Loans",
  "Credit Cards",
  "Insurance",
];

const productTabs = [
  { label: "Loan", icon: HandCoins },
  { label: "Insurance", icon: Umbrella },
  { label: "Credit Card", icon: CreditCard },
];

const quickLoanOption = "Loan in 5 Minutes";
const loanTypeOptions = [
  quickLoanOption,
  ...loanProductDirectory.map((loan) => loan.name),
];
const tenureOptions = Array.from(
  { length: 30 },
  (_, index) => `${index + 1} ${index === 0 ? "Year" : "Years"}`,
);
const salaryOptions = [
  "Salaried",
  "Self Employed",
  "Self Employed Professional",
];
const insuranceTypeOptions = [
  "Health Insurance",
  "Life Insurance",
  "Term Insurance",
  "Travel Insurance",
  "Property Insurance",
];
const insuranceNeedOptions = [
  "Self",
  "Family",
  "Parents",
  "Business",
  "Vehicle",
];
const cardTypeOptions = [
  "Cashback Cards",
  "Travel Cards",
  "Fuel Cards",
  "Shopping Cards",
  "Rewards Cards",
];
const loanPurposeSlugs: Record<string, string> = {
  [quickLoanOption]: "instant-loan",
  ...Object.fromEntries(
    loanProductDirectory.map((loan) => [loan.name, loan.slug]),
  ),
};

const formatAmount = (value: number | string) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return String(value);
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const getTenureYears = (value: string) => Number(value.match(/\d+/)?.[0] || 5);

function CompactSelect({
  label,
  value,
  options,
  icon: Icon,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  icon: LucideIcon;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold text-[#475569]">{label}</span>
      <span className="relative mt-1 flex h-10 w-full items-center gap-2 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] px-2.5 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5b21b6]/20">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-100/70 text-[#5b21b6]">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 appearance-none bg-transparent pr-5 text-[12px] font-bold text-[#0f172a] outline-none cursor-pointer"
          aria-label={label}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-[#94a3b8]" />
      </span>
    </label>
  );
}

// Search Catalog for the Header Search Engine
const searchCatalog = [
  { name: "Personal Loan", category: "Loans", href: "/products/personal-loan", sub: "From 10.5% p.a. • Instant" },
  { name: "Home Loan", category: "Loans", href: "/products/home-loan", sub: "From 7.10% p.a. • Up to ₹5 Cr" },
  { name: "Business Loan", category: "Loans", href: "/products/business-loan", sub: "Collateral-free up to ₹1 Cr" },
  { name: "Doctor Loan", category: "Loans", href: "/products/doctor-loan", sub: "Specialized medical credit" },
  { name: "CA Loan", category: "Loans", href: "/products/ca-loan", sub: "Exclusive credit for CAs" },
  { name: "Loan Against Property", category: "Loans", href: "/products/loan-against-property", sub: "High value secured funding" },
  { name: "Credit Cards Comparison", category: "Cards", href: "/credit-cards", sub: "Compare 50+ bank cards" },
  { name: "HDFC Credit Cards", category: "Cards", href: "/banks/hdfc-bank/credit-card", sub: "Millennia, Regalia & Diners" },
  { name: "SBI Credit Cards", category: "Cards", href: "/banks/sbi-card/credit-card", sub: "Cashback, PRIME & Octane" },
  { name: "Health Insurance", category: "Insurance", href: "/products/health-insurance", sub: "Cashless care at 10,000+ hospitals" },
  { name: "Life Insurance", category: "Insurance", href: "/products/life-insurance", sub: "Term life & family security" },
  { name: "Motor Insurance", category: "Insurance", href: "/products/motor-insurance", sub: "Instant policy issuance" },
  { name: "Quick Apply Credit Card", category: "Cards", href: "/credit-cards", sub: "Instant approval on 50+ bank cards" },
  { name: "Project Report Preparation", category: "Financial Services", href: "/project-report", sub: "Bank CMA data & DPR for loans" },
  { name: "GST Registration & Filing", category: "Financial Services", href: "/gst-registration", sub: "Monthly returns & new registration" },
  { name: "Govt Schemes & Subsidies", category: "Financial Services", href: "/msme-registration", sub: "PMEGP, Mudra, CGTMSE & Udyam" },
  { name: "Company Setup", category: "Financial Services", href: "/company-registration", sub: "Pvt Ltd, LLP, OPC registration" },
  { name: "Free Credit Score Check", category: "Credit Score", href: "/cibil-score", sub: "Free bureau report & score" },
  { name: "EMI Calculator", category: "Calculators", href: "#calculators", sub: "Monthly installment estimation" },
  { name: "ITR Filing", category: "Financial Services", href: "/itr-filing", sub: "Assisted income tax return" },
  { name: "MSME Registration", category: "Financial Services", href: "/msme-registration", sub: "Govt subsidies & Udyam" },
];

export function HeroSection() {
  // Rotating headline index
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingServices.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  // Search Engine State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return searchCatalog.slice(0, 6);
    return searchCatalog.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.sub.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // ORIGINAL FINTARAA HERO FORM STATE (preserved exactly)
  const [selectedProduct, setSelectedProduct] = useState(productTabs[0].label);
  const [amount, setAmount] = useState("1000000");
  const [purpose, setPurpose] = useState(loanTypeOptions[0]);
  const [tenure, setTenure] = useState("5 Years");
  const [salaryType, setSalaryType] = useState(salaryOptions[0]);
  const [monthlyIncome, setMonthlyIncome] = useState("50000");
  const [insuranceType, setInsuranceType] = useState(insuranceTypeOptions[0]);
  const [insuranceNeed, setInsuranceNeed] = useState(insuranceNeedOptions[0]);
  const [cardType, setCardType] = useState(cardTypeOptions[0]);
  const [cibilScore, setCibilScore] = useState(720);

  // ORIGINAL SUBMISSION LOGIC AND QUERY PARAMETERS (preserved 100%)
  const continueHref = useMemo(() => {
    if (selectedProduct === "Credit Card") return "/credit-cards";
    if (selectedProduct === "Insurance") return productHref(insuranceType);

    const loanType = loanPurposeSlugs[purpose] || "personal-loan";
    const params = new URLSearchParams({
      product: "loan",
      loanType,
      amount: amount || "0",
      salaryType,
      monthlyIncome: monthlyIncome || "0",
      cibilScore: String(cibilScore),
      tenureYears: String(getTenureYears(tenure)),
    });

    return `/eligibility-results?${params.toString()}`;
  }, [
    amount,
    cibilScore,
    insuranceType,
    monthlyIncome,
    purpose,
    salaryType,
    selectedProduct,
    tenure,
  ]);

  const continueLabel =
    selectedProduct === "Loan"
      ? "Check Offers"
      : selectedProduct === "Insurance"
        ? "Explore Cover"
        : "Explore Cards";

  return (
    <section
      className="hero-section relative overflow-hidden bg-white pt-4 pb-2 sm:pt-6 sm:pb-3 lg:pt-7 lg:pb-3"
      aria-label="Fintaraa Hero"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          {/* LEFT: 58% Column (Marketing + Discovery + Action) */}
          <div className="relative z-10 lg:col-span-7">
            {/* MANDATORY HERO HEADLINE with smooth vertical rotating text */}
            <h1 className="text-[25px] font-semibold leading-[1.22] tracking-tight text-[#0f172a] sm:text-[36px] md:text-[38px] lg:text-[41px]">
              Turn Your Dreams into Reality{" "}
              <span className="block mt-0.5 sm:mt-1 text-[#1e293b]">
                with our{" "}
                <span className="relative inline-block h-[1.25em] overflow-hidden align-top text-[#5b21b6]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={rotatingServices[wordIndex]}
                      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="inline-block whitespace-nowrap font-semibold text-[#5b21b6]"
                    >
                      {rotatingServices[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </h1>

            {/* Supporting text from original Fintaraa copy */}
            <p className="mt-3 max-w-lg text-[13.5px] font-medium leading-relaxed text-[#64748b] sm:text-[14.5px]">
              One secure check. Multiple trusted offers from 30+ banks &amp; NBFCs. Zero impact on your CIBIL score.
            </p>

            {/* FINANCIAL PRODUCT SEARCH ENGINE (Desktop & Tablet only, hidden on mobile view) */}
            <div ref={searchRef} className="relative mt-5 max-w-md lg:max-w-lg hidden md:block">
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#64748b]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search loans, cards, insurance & tools..."
                  className="h-11 w-full rounded-none border-0 border-b border-slate-300/50 bg-transparent pl-10 pr-9 text-[13px] font-semibold text-[#0f172a] placeholder:text-[#94a3b8] transition-colors focus:border-b-[#5b21b6] focus:outline-none focus:ring-0 sm:h-12 sm:text-[14px]"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="pointer-events-none absolute right-3 hidden rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-400 sm:inline">
                    🔍
                  </span>
                )}
              </div>

              {/* Search Engine Dropdown with categorized suggestions */}
              {isSearchOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-80 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                  <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                    <span>{searchQuery ? "Matching Results" : "Quick Suggestions"}</span>
                    <span>Direct Link</span>
                  </div>
                  <div className="mt-1 divide-y divide-gray-100">
                    {searchResults.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between rounded-lg p-2 text-left transition hover:bg-[#f5f3ff]"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-[#0f172a]">
                              {item.name}
                            </span>
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9.5px] font-bold text-[#475569]">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748b]">{item.sub}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-[#5b21b6]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Services shortcut chips (Desktop & Tablet) */}
            <div className="mt-3.5 hidden md:flex flex-wrap items-center gap-1.5 text-[11px] sm:text-[11.5px]">
              <span className="font-semibold text-[#64748b]">Quick Services:</span>
              <Link
                href="/credit-cards"
                className="rounded-full bg-purple-50 px-2.5 py-0.5 font-semibold text-[#5b21b6] hover:bg-purple-100 transition-colors"
              >
                Quick Card Apply
              </Link>
              <Link
                href="/project-report"
                className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-[#334155] hover:bg-purple-50 hover:text-[#5b21b6] transition-colors"
              >
                Project Report
              </Link>
              <Link
                href="/gst-registration"
                className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-[#334155] hover:bg-purple-50 hover:text-[#5b21b6] transition-colors"
              >
                GST Filing
              </Link>
              <Link
                href="/msme-registration"
                className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-[#334155] hover:bg-purple-50 hover:text-[#5b21b6] transition-colors"
              >
                Govt Schemes
              </Link>
            </div>
          </div>

          {/* RIGHT: 42% Column (ORIGINAL FINTARAA ELIGIBILITY FORM) */}
          <div className="hero-right relative mt-40 sm:mt-44 lg:mt-0 lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[430px] sm:max-w-[450px]">
              {/* The Desktop Woman PNG (emerging from behind the left edge on desktop) */}
              <div
                className="hero-woman pointer-events-none absolute top-3 sm:top-4 z-[1] select-none hidden min-[900px]:block min-[900px]:h-[415px] min-[900px]:-left-[155px] min-[1100px]:h-[445px] min-[1100px]:-left-[175px] min-[1280px]:h-[465px] min-[1280px]:-left-[195px] min-[1440px]:h-[480px] min-[1440px]:-left-[210px]"
                aria-hidden="true"
              >
                <Image
                  src="/assets/hero/hero-woman.png"
                  alt="Fintaraa Eligibility Assistant"
                  width={1145}
                  height={1374}
                  priority
                  className="h-full w-auto max-w-none object-contain object-bottom pointer-events-none select-none"
                />
              </div>

              {/* The Mobile Girl PNG pointing fingers downwards behind the form (mobile/tablet only) */}
              <div
                className="hero-woman-mobile pointer-events-none absolute -top-[190px] sm:-top-[210px] left-1/2 -translate-x-1/2 z-[1] select-none block min-[900px]:hidden w-[310px] h-[372px] sm:w-[350px] sm:h-[420px]"
                aria-hidden="true"
              >
                <Image
                  src="/assets/hero/hero_girlmobileview.png"
                  alt="Fintaraa Eligibility Assistant"
                  width={1145}
                  height={1374}
                  priority
                  className="h-full w-full object-contain object-top pointer-events-none select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
                />
              </div>

              {/* Form Card (Shadow as Border, No Harsh Outlines) */}
              <div className="eligibility-form eligibility-form-wrapper relative z-[2] w-full rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-[0_0_22px_rgba(15,23,42,0.12),0_1px_4px_rgba(15,23,42,0.06)] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15.5px] sm:text-[16px] font-extrabold tracking-tight text-[#0f172a]">
                    Check Your Eligibility
                  </p>
                  <p className="text-[11px] sm:text-[11.5px] font-medium text-[#64748b]">
                    Personalised • Instant • Free Check
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-purple-50 px-2 sm:px-2.5 py-1 text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider text-[#5b21b6]">
                  <LockKeyhole className="h-3 w-3" />
                  Bank Grade Secure
                </span>
              </div>

              {/* Product Tabs (Modern Segmented Pill Bar - No Lines) */}
              <form className="mt-3.5 grid gap-3" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-3 rounded-xl bg-[#f1f5f9] p-1 gap-1">
                  {productTabs.map(({ label, icon: Icon }) => {
                    const active = selectedProduct === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSelectedProduct(label)}
                        className={`flex h-8.5 items-center justify-center gap-1.5 rounded-lg text-[11.5px] font-bold transition-all duration-200 cursor-pointer ${
                          active
                            ? "bg-white text-[#5b21b6] shadow-xs"
                            : "text-[#64748b] hover:text-[#0f172a]"
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${active ? "text-[#5b21b6]" : "text-[#64748b]"}`} />
                        <span>{label === "Credit Card" ? "Card" : label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Form Inputs (Classy filled surfaces with no harsh box borders) */}
                {selectedProduct === "Loan" ? (
                  <>
                    <div>
                      <div className="flex items-baseline justify-between">
                        <p className="text-[11px] font-bold text-[#475569]">
                          Requirement Amount
                        </p>
                        <p className="text-[15.5px] font-extrabold text-[#5b21b6]">
                          {amount ? `₹ ${formatAmount(amount)}` : "Enter amount"}
                        </p>
                      </div>
                      <label className="mt-1 flex h-10 w-full items-center gap-2 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] px-2.5 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5b21b6]/20">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-100/70 text-[#5b21b6]">
                          <IndianRupee className="h-3.5 w-3.5" />
                        </span>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                          placeholder="e.g. 500000"
                          className="min-w-0 flex-1 bg-transparent text-[13px] font-bold text-[#0f172a] outline-none placeholder:text-[#94a3b8] placeholder:font-normal"
                          aria-label="Requirement amount"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <CompactSelect
                        label="Loan Type"
                        value={purpose}
                        options={loanTypeOptions}
                        icon={UserRound}
                        onChange={setPurpose}
                      />
                      <CompactSelect
                        label="Tenure"
                        value={tenure}
                        options={tenureOptions}
                        icon={CalendarDays}
                        onChange={setTenure}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <CompactSelect
                        label="Employment"
                        value={salaryType}
                        options={salaryOptions}
                        icon={BriefcaseBusiness}
                        onChange={setSalaryType}
                      />
                      <label className="block">
                        <span className="text-[11px] font-bold text-[#475569]">
                          Monthly Salary (₹)
                        </span>
                        <span className="mt-1 flex h-10 w-full items-center gap-2 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] px-2.5 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5b21b6]/20">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-100/70 text-[#5b21b6]">
                            <IndianRupee className="h-3.5 w-3.5" />
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(e.target.value.replace(/\D/g, ""))}
                            placeholder="50000"
                            className="min-w-0 flex-1 border-0 bg-transparent text-[12px] font-bold text-[#0f172a] outline-none placeholder:text-[#94a3b8] placeholder:font-normal"
                            aria-label="Monthly Salary / Income"
                          />
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#475569]">CIBIL Score</span>
                          <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-[#0d9488]">Min 300 - Max 900</span>
                        </div>
                        <span className="mt-1 flex h-10 w-full items-center gap-2 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] px-2.5 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5b21b6]/20">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-100/70 text-[#5b21b6]">
                            <Gauge className="h-3.5 w-3.5" />
                          </span>
                          <input
                            type="number"
                            min={300}
                            max={900}
                            value={cibilScore}
                            onChange={(e) => setCibilScore(Number(e.target.value || 0))}
                            className="min-w-0 flex-1 border-0 bg-transparent text-[12px] font-bold text-[#0f172a] outline-none"
                            aria-label="CIBIL Score"
                          />
                        </span>
                      </label>
                    </div>
                  </>
                ) : selectedProduct === "Insurance" ? (
                  <div className="grid gap-2.5">
                    <CompactSelect
                      label="Insurance Type"
                      value={insuranceType}
                      options={insuranceTypeOptions}
                      icon={Umbrella}
                      onChange={setInsuranceType}
                    />
                    <CompactSelect
                      label="Cover For"
                      value={insuranceNeed}
                      options={insuranceNeedOptions}
                      icon={ShieldCheck}
                      onChange={setInsuranceNeed}
                    />
                    <p className="rounded-xl bg-[#f8fafc] p-2.5 text-[11.5px] font-medium text-[#64748b]">
                      Compare plans by cover, premium, waiting period &amp; claim support.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-2.5">
                    <CompactSelect
                      label="Card Preference"
                      value={cardType}
                      options={cardTypeOptions}
                      icon={CreditCard}
                      onChange={setCardType}
                    />
                    <p className="rounded-xl bg-[#f8fafc] p-2.5 text-[11.5px] font-medium text-[#64748b]">
                      Explore cards for cashback, travel, fuel, shopping, and rewards.
                    </p>
                  </div>
                )}

                <Link
                  href={continueHref}
                  className="mt-2.5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5b21b6] to-[#4c1d95] hover:from-[#4c1d95] hover:to-[#3b0764] px-5 text-[13px] font-bold text-white shadow-md shadow-purple-900/15 transition-all duration-200 active:scale-[0.99]"
                >
                  {continueLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </form>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
